/**
 * Eurosian VIP Transfer — Bağımsız Çalışan Sunucu (sıfır npm bağımlılığı)
 *
 * Bu sürüm GERÇEK giriş zorunluluğu içerir:
 * - Admin: kullanıcı adı + şifre (scrypt ile hash'lenmiş, tuzlu)
 * - Şoför/Karşılamacı: telefon + 4 haneli PIN
 * - Misafir: giriş GEREKMEZ — sadece rezervasyon oluşturma ve kod ile takip açık
 * Admin/şoför/karşılamacının HİÇBİR aksiyonu (onay, atama, teslim al/bırak,
 * tamamla) oturum doğrulaması olmadan çalışmaz — sunucu tarafında zorlanır.
 *
 * Veri artık data.json dosyasına yazılır — sunucuyu durdurup yeniden
 * başlattığında rezervasyonlar/kullanıcılar KAYBOLMAZ.
 *
 * Çalıştırma:  node server.js
 * Tarayıcı:    http://localhost:4000
 */
const http = require("http");
const crypto = require("crypto");
const fs = require("fs");
const path = require("path");

const DATA_FILE = path.join(__dirname, "data.json");
const SESSION_TTL_MS = 12 * 60 * 60 * 1000; // 12 saat

/* ================= Şifre/PIN hash yardımcıları (sadece Node built-in crypto) ================= */
function hashSecret(secret, salt = crypto.randomBytes(16).toString("hex")) {
  const hash = crypto.scryptSync(secret, salt, 64).toString("hex");
  return { salt, hash };
}
function verifySecret(secret, salt, expectedHash) {
  const hash = crypto.scryptSync(secret, salt, 64).toString("hex");
  return crypto.timingSafeEqual(Buffer.from(hash, "hex"), Buffer.from(expectedHash, "hex"));
}

/* ================= Saf iş kuralı fonksiyonları ================= */
function isGreeterRequired(vehicleSize) {
  return vehicleSize === "SMALL";
}
function quotePrice({ rule, vehicleSize, hasReturnLeg, promoDiscountPercent = 0 }) {
  const basePrice = vehicleSize === "LARGE" ? rule.basePriceLarge : rule.basePriceSmall;
  const returnLegPrice = hasReturnLeg ? basePrice : 0;
  const subtotal = basePrice + returnLegPrice;
  const pct = Math.min(100, Math.max(0, promoDiscountPercent));
  const discount = round2((subtotal * pct) / 100);
  return { regionName: rule.regionName, km: rule.km, basePrice, returnLegPrice, discount, total: round2(subtotal - discount) };
}
function round2(n) {
  return Math.round(n * 100) / 100;
}
function stagesFor(vehicleSize) {
  return vehicleSize === "SMALL"
    ? ["PENDING_APPROVAL", "APPROVED", "ASSIGNED", "GREETER_CONFIRMED", "EN_ROUTE", "DROPPED_OFF", "COMPLETED"]
    : ["PENDING_APPROVAL", "APPROVED", "ASSIGNED", "EN_ROUTE", "DROPPED_OFF", "COMPLETED"];
}
function canTransition(current, target, vehicleSize) {
  const stages = stagesFor(vehicleSize);
  const idx = stages.indexOf(current);
  if (idx === -1 || idx === stages.length - 1) return target === "CANCELLED";
  return target === stages[idx + 1] || target === "CANCELLED";
}
function validateAssignment({ vehicleSize, greeterId, driverFee, greeterFee }) {
  if (!driverFee || driverFee <= 0) return { valid: false, reason: "Şoför ücreti girilmeli." };
  if (isGreeterRequired(vehicleSize)) {
    if (!greeterId) return { valid: false, reason: "Küçük araçta karşılamacı ataması zorunludur." };
    if (!greeterFee || greeterFee <= 0) return { valid: false, reason: "Karşılamacı ücreti girilmeli." };
  }
  return { valid: true };
}

/* ================= Veri: yükle / kaydet (data.json) ================= */
function seedData() {
  const admin = hashSecret("Eurosian2026!");
  const driverPin = hashSecret("1234");
  const greeterPin = hashSecret("1234");
  return {
    pricingRules: [
      { regionName: "Lara", km: 15, basePriceSmall: 25, basePriceLarge: 40 },
      { regionName: "Antalya Merkez", km: 12, basePriceSmall: 25, basePriceLarge: 40 },
      { regionName: "Belek", km: 35, basePriceSmall: 40, basePriceLarge: 55 },
      { regionName: "Kemer", km: 61, basePriceSmall: 60, basePriceLarge: 75 },
      { regionName: "Side", km: 66, basePriceSmall: 65, basePriceLarge: 80 },
      { regionName: "Alanya", km: 125, basePriceSmall: 110, basePriceLarge: 125 },
    ],
    vehicles: [
      { id: "v1", plate: "07 EVT 12", model: "Mercedes Vito", size: "SMALL", driverId: "d1" },
      { id: "v2", plate: "07 EVT 34", model: "VW Transporter", size: "SMALL", driverId: "d2" },
      { id: "v3", plate: "07 EVT 56", model: "Mercedes Sprinter", size: "LARGE", driverId: "d3" },
    ],
    users: [
      { id: "admin1", role: "ADMIN", name: "Operasyon Yöneticisi", username: "admin", salt: admin.salt, hash: admin.hash },
      { id: "d1", role: "DRIVER", name: "Emre Yıldız", phone: "+905551110001", salt: driverPin.salt, hash: driverPin.hash },
      { id: "d2", role: "DRIVER", name: "Caner Demir", phone: "+905551110002", salt: driverPin.salt, hash: driverPin.hash },
      { id: "d3", role: "DRIVER", name: "Hakan Su", phone: "+905551110003", salt: driverPin.salt, hash: driverPin.hash },
      { id: "g1", role: "GREETER", name: "Aylin Kaya", phone: "+905551110011", salt: greeterPin.salt, hash: greeterPin.hash },
      { id: "g2", role: "GREETER", name: "Deniz Aksoy", phone: "+905551110012", salt: greeterPin.salt, hash: greeterPin.hash },
    ],
    bookings: [],
    payouts: [],
    events: [],
    codeCounter: 1000,
  };
}

let db;
if (fs.existsSync(DATA_FILE)) {
  try {
    db = JSON.parse(fs.readFileSync(DATA_FILE, "utf8"));
    console.log(`Kayıtlı veri yüklendi: ${DATA_FILE} (${db.bookings.length} rezervasyon)`);
  } catch (e) {
    console.error("data.json okunamadı, sıfırdan başlatılıyor:", e.message);
    db = seedData();
  }
} else {
  db = seedData();
  console.log("İlk kurulum: data.json oluşturuluyor (admin/şoför/karşılamacı hesapları seed edildi).");
}

let saveTimer = null;
function persist() {
  clearTimeout(saveTimer);
  saveTimer = setTimeout(() => {
    fs.writeFile(DATA_FILE, JSON.stringify(db, null, 2), (err) => {
      if (err) console.error("data.json'a yazılamadı:", err.message);
    });
  }, 150);
}
persist();

function log(text) {
  db.events.unshift({ id: crypto.randomUUID(), text, at: new Date().toISOString() });
  db.events = db.events.slice(0, 50);
  persist();
}

/* ================= Oturum yönetimi (cookie tabanlı, bellekte) ================= */
const sessions = new Map();

function createSession(user) {
  const token = crypto.randomBytes(32).toString("hex");
  sessions.set(token, { userId: user.id, role: user.role, expiresAt: Date.now() + SESSION_TTL_MS });
  return token;
}
function getSession(req) {
  const cookie = req.headers.cookie || "";
  const match = cookie.match(/evt_session=([a-f0-9]+)/);
  if (!match) return null;
  const session = sessions.get(match[1]);
  if (!session) return null;
  if (Date.now() > session.expiresAt) {
    sessions.delete(match[1]);
    return null;
  }
  return session;
}
function requireRole(req, role) {
  const session = getSession(req);
  if (!session || session.role !== role) return null;
  const user = db.users.find((u) => u.id === session.userId);
  return user && user.role === role ? user : null;
}

/* ================= Auth endpoint'leri ================= */
function loginAdmin(body) {
  const user = db.users.find((u) => u.role === "ADMIN" && u.username === body.username);
  if (!user || !verifySecret(body.password || "", user.salt, user.hash)) {
    return { status: 401, json: { error: "Kullanıcı adı veya şifre yanlış." } };
  }
  const token = createSession(user);
  return { status: 200, json: { user: publicUser(user) }, setCookie: token };
}

function loginPhone(body, expectedRole) {
  const user = db.users.find((u) => u.role === expectedRole && u.phone === body.phone);
  if (!user || !verifySecret(body.pin || "", user.salt, user.hash)) {
    return { status: 401, json: { error: "Telefon veya PIN yanlış." } };
  }
  const token = createSession(user);
  return { status: 200, json: { user: publicUser(user) }, setCookie: token };
}

function logout(req) {
  const cookie = req.headers.cookie || "";
  const match = cookie.match(/evt_session=([a-f0-9]+)/);
  if (match) sessions.delete(match[1]);
  return { status: 200, json: { ok: true }, clearCookie: true };
}

function me(req) {
  const session = getSession(req);
  if (!session) return { status: 200, json: { user: null } };
  const user = db.users.find((u) => u.id === session.userId);
  return { status: 200, json: { user: user ? publicUser(user) : null } };
}

function publicUser(u) {
  return { id: u.id, role: u.role, name: u.name, username: u.username, phone: u.phone };
}

/* ================= Rezervasyon iş mantığı (misafir tarafı — girişsiz açık) ================= */
function createBooking(body) {
  const rule = db.pricingRules.find((r) => r.regionName === body.regionName);
  if (!rule) return { status: 400, json: { error: "Bölge bulunamadı." } };

  const quote = quotePrice({
    rule,
    vehicleSize: body.vehicleSize,
    hasReturnLeg: !!body.hasReturnLeg,
    promoDiscountPercent: body.promoDiscountPercent || 0,
  });

  const booking = {
    id: crypto.randomUUID(),
    code: `EVT-${db.codeCounter++}`,
    guestName: body.guestName,
    guestPhone: body.guestPhone,
    guestLanguage: body.guestLanguage || "TR",
    regionName: rule.regionName,
    km: rule.km,
    flightNumber: body.flightNumber || null,
    scheduledAt: body.scheduledAt || null,
    passengers: Number(body.passengers) || 1,
    vehicleSize: body.vehicleSize,
    hasReturnLeg: !!body.hasReturnLeg,
    price: quote.total,
    paymentMethod: body.paymentMethod || "PAY_IN_VEHICLE",
    status: "PENDING_APPROVAL",
    vehicleId: null,
    driverId: null,
    greeterId: null,
    driverFee: null,
    greeterFee: null,
    createdAt: new Date().toISOString(),
  };
  db.bookings.unshift(booking);
  log(`Rezervasyon alındı: ${booking.code} — ${booking.guestName}, admin onayı bekleniyor.`);
  persist();
  return { status: 201, json: { booking, quote } };
}

function trackBooking(code) {
  const b = db.bookings.find((x) => x.code === code);
  if (!b) return { status: 404, json: { error: "Rezervasyon bulunamadı." } };
  const driver = db.users.find((u) => u.id === b.driverId);
  const vehicle = db.vehicles.find((v) => v.id === b.vehicleId);
  return { status: 200, json: { booking: b, driverName: driver && driver.name, vehiclePlate: vehicle && vehicle.plate } };
}

/* ================= Admin/şoför/karşılamacı aksiyonları — HEPSİ oturum ister ================= */
function approveBooking(req, id) {
  const admin = requireRole(req, "ADMIN");
  if (!admin) return { status: 401, json: { error: "Bu işlem için admin girişi gerekli." } };

  const b = db.bookings.find((x) => x.id === id);
  if (!b) return { status: 404, json: { error: "Bulunamadı" } };
  if (!canTransition(b.status, "APPROVED", b.vehicleSize)) {
    return { status: 409, json: { error: `${b.status} durumundan APPROVED'a geçilemez.` } };
  }
  b.status = "APPROVED";
  log(`Admin (${admin.name}) ${b.code} rezervasyonunu onayladı.`);
  persist();
  return { status: 200, json: { booking: b } };
}

function assignBooking(req, id, body) {
  const admin = requireRole(req, "ADMIN");
  if (!admin) return { status: 401, json: { error: "Bu işlem için admin girişi gerekli." } };

  const b = db.bookings.find((x) => x.id === id);
  if (!b) return { status: 404, json: { error: "Bulunamadı" } };

  const v = validateAssignment({
    vehicleSize: b.vehicleSize,
    greeterId: body.greeterId,
    driverFee: Number(body.driverFee),
    greeterFee: Number(body.greeterFee),
  });
  if (!v.valid) return { status: 400, json: { error: v.reason } };
  if (!canTransition(b.status, "ASSIGNED", b.vehicleSize)) {
    return { status: 409, json: { error: `${b.status} durumundan ASSIGNED'a geçilemez.` } };
  }

  const vehicle = db.vehicles.find((x) => x.id === body.vehicleId);
  if (!vehicle) return { status: 400, json: { error: "Araç bulunamadı." } };

  const overlap = db.bookings.find(
    (x) => x.id !== b.id && x.vehicleId === vehicle.id && ["ASSIGNED", "GREETER_CONFIRMED", "EN_ROUTE"].includes(x.status)
  );
  if (overlap) return { status: 409, json: { error: `Bu araç zaten ${overlap.code} işine atanmış.` } };

  b.status = "ASSIGNED";
  b.vehicleId = vehicle.id;
  b.driverId = vehicle.driverId;
  b.greeterId = body.greeterId || null;
  b.driverFee = Number(body.driverFee);
  b.greeterFee = body.greeterFee ? Number(body.greeterFee) : null;

  const driver = db.users.find((u) => u.id === b.driverId);
  const greeter = db.users.find((u) => u.id === b.greeterId);
  log(`WhatsApp → Misafir + ${driver ? driver.name : ""}${greeter ? " + " + greeter.name : ""}: "${b.code} işiniz atandı — ${vehicle.plate}."`);
  persist();
  return { status: 200, json: { booking: b } };
}

function completeBooking(req, id) {
  const admin = requireRole(req, "ADMIN");
  if (!admin) return { status: 401, json: { error: "Bu işlem için admin girişi gerekli." } };

  const b = db.bookings.find((x) => x.id === id);
  if (!b) return { status: 404, json: { error: "Bulunamadı" } };
  if (b.status !== "DROPPED_OFF") return { status: 409, json: { error: "Sadece 'Otele Bırakıldı' işi tamamlanabilir." } };

  b.status = "COMPLETED";
  const now = new Date();
  db.payouts.push({ id: crypto.randomUUID(), bookingId: b.id, userId: b.driverId, amount: b.driverFee, at: now.toISOString() });
  if (b.greeterId) db.payouts.push({ id: crypto.randomUUID(), bookingId: b.id, userId: b.greeterId, amount: b.greeterFee, at: now.toISOString() });

  const driver = db.users.find((u) => u.id === b.driverId);
  const greeter = db.users.find((u) => u.id === b.greeterId);
  log(`WhatsApp → ${driver ? driver.name : ""}: "Hakedişiniz ₺${b.driverFee} kaydedildi."${greeter ? ` / ${greeter.name}: "₺${b.greeterFee}"` : ""}`);
  persist();
  return { status: 200, json: { booking: b } };
}

function greeterAction(req, id, action) {
  const greeter = requireRole(req, "GREETER");
  if (!greeter) return { status: 401, json: { error: "Bu işlem için karşılamacı girişi gerekli." } };

  const b = db.bookings.find((x) => x.id === id);
  if (!b) return { status: 404, json: { error: "Bulunamadı" } };
  if (b.greeterId !== greeter.id) return { status: 403, json: { error: "Bu iş size atanmamış." } };

  const target = action === "meet" ? "GREETER_CONFIRMED" : "EN_ROUTE";
  if (!canTransition(b.status, target, b.vehicleSize)) {
    return { status: 409, json: { error: `${b.status} → ${target} geçişi geçersiz.` } };
  }
  b.status = target;
  log(
    action === "meet"
      ? `Karşılamacı (${greeter.name}) ${b.code} misafirini karşıladı.`
      : `Karşılamacı (${greeter.name}) ${b.code} misafirini şoföre teslim etti.`
  );
  persist();
  return { status: 200, json: { booking: b } };
}

function driverAction(req, id, action) {
  const driver = requireRole(req, "DRIVER");
  if (!driver) return { status: 401, json: { error: "Bu işlem için şoför girişi gerekli." } };

  const b = db.bookings.find((x) => x.id === id);
  if (!b) return { status: 404, json: { error: "Bulunamadı" } };
  if (b.driverId !== driver.id) return { status: 403, json: { error: "Bu iş size atanmamış." } };

  const target = action === "pickup" ? "EN_ROUTE" : "DROPPED_OFF";
  if (!canTransition(b.status, target, b.vehicleSize)) {
    return { status: 409, json: { error: `${b.status} → ${target} geçişi geçersiz.` } };
  }
  b.status = target;
  log(
    action === "pickup"
      ? `Şoför (${driver.name}) ${b.code} misafirini teslim aldı.`
      : `Şoför (${driver.name}) ${b.code} misafirini otele bıraktı.`
  );
  persist();
  return { status: 200, json: { booking: b } };
}

/* ================= Görünüm verisi ================= */
function adminState(req) {
  const admin = requireRole(req, "ADMIN");
  if (!admin) return { status: 401, json: { error: "Admin girişi gerekli." } };
  return {
    status: 200,
    json: {
      bookings: db.bookings,
      vehicles: db.vehicles,
      users: db.users.map(publicUser),
      pricingRules: db.pricingRules,
      events: db.events,
    },
  };
}
function driverState(req) {
  const driver = requireRole(req, "DRIVER");
  if (!driver) return { status: 401, json: { error: "Şoför girişi gerekli." } };
  const jobs = db.bookings.filter((b) => b.driverId === driver.id && !["PENDING_APPROVAL", "APPROVED", "COMPLETED", "CANCELLED"].includes(b.status));
  return { status: 200, json: { me: publicUser(driver), jobs } };
}
function greeterState(req) {
  const greeter = requireRole(req, "GREETER");
  if (!greeter) return { status: 401, json: { error: "Karşılamacı girişi gerekli." } };
  const jobs = db.bookings.filter((b) => b.greeterId === greeter.id && ["ASSIGNED", "GREETER_CONFIRMED"].includes(b.status));
  return { status: 200, json: { me: publicUser(greeter), jobs } };
}

/* ================= Yönlendirici ================= */
const routes = [
  [/^\/api\/auth\/me$/, "GET", (_m, _b, req) => me(req)],
  [/^\/api\/auth\/login\/admin$/, "POST", (_m, b) => loginAdmin(b)],
  [/^\/api\/auth\/login\/driver$/, "POST", (_m, b) => loginPhone(b, "DRIVER")],
  [/^\/api\/auth\/login\/greeter$/, "POST", (_m, b) => loginPhone(b, "GREETER")],
  [/^\/api\/auth\/logout$/, "POST", (_m, _b, req) => logout(req)],

  [/^\/api\/bookings$/, "POST", (_m, body) => createBooking(body)],
  [/^\/api\/bookings\/track\/([^/]+)$/, "GET", (m) => trackBooking(m[1])],

  [/^\/api\/admin\/state$/, "GET", (_m, _b, req) => adminState(req)],
  [/^\/api\/bookings\/([^/]+)\/approve$/, "POST", (m, _b, req) => approveBooking(req, m[1])],
  [/^\/api\/bookings\/([^/]+)\/assign$/, "POST", (m, body, req) => assignBooking(req, m[1], body)],
  [/^\/api\/bookings\/([^/]+)\/complete$/, "POST", (m, _b, req) => completeBooking(req, m[1])],

  [/^\/api\/driver\/state$/, "GET", (_m, _b, req) => driverState(req)],
  [/^\/api\/bookings\/([^/]+)\/driver\/(pickup|dropoff)$/, "POST", (m, _b, req) => driverAction(req, m[1], m[2])],

  [/^\/api\/greeter\/state$/, "GET", (_m, _b, req) => greeterState(req)],
  [/^\/api\/bookings\/([^/]+)\/greeter\/(meet|handover)$/, "POST", (m, _b, req) => greeterAction(req, m[1], m[2])],
];

const server = http.createServer((req, res) => {
  const url = new URL(req.url, "http://localhost");

  if (req.method === "GET" && url.pathname === "/") {
    const html = fs.readFileSync(path.join(__dirname, "index.html"), "utf8");
    res.writeHead(200, { "Content-Type": "text/html; charset=utf-8" });
    res.end(html);
    return;
  }

  for (const [pattern, method, handler] of routes) {
    const m = url.pathname.match(pattern);
    if (m && req.method === method) {
      let bodyChunks = [];
      req.on("data", (c) => bodyChunks.push(c));
      req.on("end", () => {
        let body = {};
        try {
          body = bodyChunks.length ? JSON.parse(Buffer.concat(bodyChunks).toString()) : {};
        } catch (e) {
          /* boş body */
        }
        const result = handler(m, body, req);
        const headers = { "Content-Type": "application/json; charset=utf-8" };
        if (result.setCookie) {
          headers["Set-Cookie"] = `evt_session=${result.setCookie}; HttpOnly; Path=/; Max-Age=${SESSION_TTL_MS / 1000}; SameSite=Lax`;
        }
        if (result.clearCookie) {
          headers["Set-Cookie"] = "evt_session=; HttpOnly; Path=/; Max-Age=0";
        }
        res.writeHead(result.status, headers);
        res.end(JSON.stringify(result.json));
      });
      return;
    }
  }

  res.writeHead(404, { "Content-Type": "application/json" });
  res.end(JSON.stringify({ error: "Not found" }));
});

const PORT = process.env.PORT || 4000;
server.listen(PORT, () => {
  console.log(`Eurosian VIP Transfer sunucusu çalışıyor: http://localhost:${PORT}`);
  console.log("Giriş bilgileri (ilk kurulumda seed edildi):");
  console.log("  Admin:       kullanıcı adı 'admin', şifre 'Eurosian2026!'");
  console.log("  Şoför:       +905551110001 / +905551110002 / +905551110003, PIN 1234");
  console.log("  Karşılamacı: +905551110011 / +905551110012, PIN 1234");
});
