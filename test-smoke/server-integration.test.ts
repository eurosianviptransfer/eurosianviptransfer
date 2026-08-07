/**
 * Entegrasyon testi — runnable/server.js'i gerçekten başlatır, gerçek HTTP
 * istekleri atar; admin/şoför/karşılamacı girişi ZORUNLU olduğu için her
 * aksiyondan önce gerçek login yapıp session cookie'sini kullanır.
 * Sıfır npm bağımlılığı: fetch (Node 18+ built-in) ve child_process kullanır.
 */
import { describe, it, before, after } from "node:test";
import assert from "node:assert/strict";
import { spawn } from "node:child_process";
import path from "node:path";
import fs from "node:fs";
import { fileURLToPath } from "node:url";

const __dirname = path.dirname(fileURLToPath(import.meta.url));
const PORT = 4001;
const BASE = `http://localhost:${PORT}`;
const DATA_FILE = path.join(__dirname, "..", "runnable", "data.json");
let serverProcess;

function cookieFrom(res) {
  const raw = res.headers.get("set-cookie") || "";
  const match = raw.match(/evt_session=[a-f0-9]+/);
  return match ? match[0] : "";
}

async function loginAdmin() {
  const res = await fetch(`${BASE}/api/auth/login/admin`, {
    method: "POST",
    headers: { "Content-Type": "application/json" },
    body: JSON.stringify({ username: "admin", password: "Eurosian2026!" }),
  });
  return cookieFrom(res);
}
async function loginDriver(phone) {
  const res = await fetch(`${BASE}/api/auth/login/driver`, {
    method: "POST",
    headers: { "Content-Type": "application/json" },
    body: JSON.stringify({ phone, pin: "1234" }),
  });
  return cookieFrom(res);
}
async function loginGreeter(phone) {
  const res = await fetch(`${BASE}/api/auth/login/greeter`, {
    method: "POST",
    headers: { "Content-Type": "application/json" },
    body: JSON.stringify({ phone, pin: "1234" }),
  });
  return cookieFrom(res);
}

before(async () => {
  if (fs.existsSync(DATA_FILE)) fs.unlinkSync(DATA_FILE); // temiz test için sıfırdan seed

  // Prefer in-process server start when available to avoid sandbox bind/EPERM issues.
  try {
    const { createRequire } = await import("module");
    const require = createRequire(import.meta.url);
    const srv = require(path.join(__dirname, "..", "runnable", "server.js"));
    if (srv && typeof srv.startServer === "function") {
      // store instance globally for after() cleanup
      global.__TEST_SERVER_INSTANCE = await srv.startServer({ port: PORT, host: "127.0.0.1" });
      return;
    }
  } catch (e) {
    // fall through to spawn fallback
  }

  serverProcess = spawn("node", [path.join(__dirname, "..", "runnable", "server.js")], {
    env: { ...process.env, PORT: String(PORT) },
    stdio: "pipe",
  });
  await new Promise((resolve, reject) => {
    const timeout = setTimeout(() => reject(new Error("Sunucu 5sn içinde başlamadı")), 5000);
    serverProcess.stdout.on("data", (chunk) => {
      if (chunk.toString().includes("çalışıyor")) {
        clearTimeout(timeout);
        resolve();
      }
    });
  });
});

after(() => {
  if (serverProcess) {
    serverProcess.kill();
  }
  if (global.__TEST_SERVER_INSTANCE && typeof global.__TEST_SERVER_INSTANCE.close === "function") {
    try {
      global.__TEST_SERVER_INSTANCE.close();
    } catch (e) {
      /* ignore */
    }
  }
  if (fs.existsSync(DATA_FILE)) fs.unlinkSync(DATA_FILE); // test artığı bırakma
});

describe("runnable/server.js — kimlik doğrulama zorunluluğu", () => {
  it("ana sayfa 200 döner", async () => {
    const res = await fetch(BASE + "/");
    assert.equal(res.status, 200);
  });

  it("girişsiz admin state isteği 401 döner", async () => {
    const res = await fetch(BASE + "/api/admin/state");
    assert.equal(res.status, 401);
  });

  it("yanlış admin şifresi 401 döner", async () => {
    const res = await fetch(`${BASE}/api/auth/login/admin`, {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ username: "admin", password: "yanlis" }),
    });
    assert.equal(res.status, 401);
  });

  it("doğru admin şifresiyle giriş yapılır ve state erişilebilir olur", async () => {
    const cookie = await loginAdmin();
    assert.ok(cookie.length > 0);
    const res = await fetch(`${BASE}/api/admin/state`, { headers: { Cookie: cookie } });
    assert.equal(res.status, 200);
  });

  it("yanlış PIN ile şoför girişi 401 döner", async () => {
    const res = await fetch(`${BASE}/api/auth/login/driver`, {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ phone: "+905551110001", pin: "9999" }),
    });
    assert.equal(res.status, 401);
  });

  it("girişsiz şoför aksiyonu 401 döner", async () => {
    const res = await fetch(`${BASE}/api/bookings/herhangi-bir-id/driver/pickup`, { method: "POST" });
    assert.equal(res.status, 401);
  });
});

describe("runnable/server.js — misafir girişsiz rezervasyon yapabilir", () => {
  it("misafir giriş yapmadan rezervasyon oluşturur ve doğru fiyat hesaplanır", async () => {
    const res = await fetch(BASE + "/api/bookings", {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({
        guestName: "Test Misafir",
        guestPhone: "+905551112233",
        regionName: "Belek",
        vehicleSize: "SMALL",
        passengers: 2,
      }),
    });
    const json = await res.json();
    assert.equal(res.status, 201);
    assert.equal(json.booking.price, 40);
    assert.equal(json.booking.status, "PENDING_APPROVAL");
  });
});

describe("runnable/server.js — uçtan uca akış (gerçek girişlerle)", () => {
  it("küçük araçta karşılamacısız atama reddedilir", async () => {
    const adminCookie = await loginAdmin();
    const create = await fetch(BASE + "/api/bookings", {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({
        guestName: "Deneme 2",
        guestPhone: "+905551112244",
        regionName: "Lara",
        vehicleSize: "SMALL",
        passengers: 1,
      }),
    });
    const { booking } = await create.json();

    await fetch(`${BASE}/api/bookings/${booking.id}/approve`, { method: "POST", headers: { Cookie: adminCookie } });

    const assignRes = await fetch(`${BASE}/api/bookings/${booking.id}/assign`, {
      method: "POST",
      headers: { "Content-Type": "application/json", Cookie: adminCookie },
      body: JSON.stringify({ vehicleId: "v1", driverFee: 500 }), // greeterId eksik
    });
    assert.equal(assignRes.status, 400);
  });

  it("onay → atama → karşıla → teslim et → bırak → tamamla tam akışı çalışır", async () => {
    const adminCookie = await loginAdmin();
    const greeterCookie = await loginGreeter("+905551110011");
    const driverCookie = await loginDriver("+905551110001");

    const create = await fetch(BASE + "/api/bookings", {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({
        guestName: "Tam Akış",
        guestPhone: "+905551112255",
        regionName: "Side",
        vehicleSize: "SMALL",
        passengers: 4,
      }),
    });
    const { booking } = await create.json();

    await fetch(`${BASE}/api/bookings/${booking.id}/approve`, { method: "POST", headers: { Cookie: adminCookie } });
    await fetch(`${BASE}/api/bookings/${booking.id}/assign`, {
      method: "POST",
      headers: { "Content-Type": "application/json", Cookie: adminCookie },
      body: JSON.stringify({ vehicleId: "v1", greeterId: "g1", driverFee: 500, greeterFee: 200 }),
    });

    // Yanlış şoför/karşılamacı bu işe atanmadıysa aksiyon reddedilmeli
    const wrongGreeter = await loginGreeter("+905551110012");
    const forbidden = await fetch(`${BASE}/api/bookings/${booking.id}/greeter/meet`, {
      method: "POST",
      headers: { Cookie: wrongGreeter },
    });
    assert.equal(forbidden.status, 403);

    await fetch(`${BASE}/api/bookings/${booking.id}/greeter/meet`, { method: "POST", headers: { Cookie: greeterCookie } });
    await fetch(`${BASE}/api/bookings/${booking.id}/greeter/handover`, { method: "POST", headers: { Cookie: greeterCookie } });
    await fetch(`${BASE}/api/bookings/${booking.id}/driver/dropoff`, { method: "POST", headers: { Cookie: driverCookie } });
    const completeRes = await fetch(`${BASE}/api/bookings/${booking.id}/complete`, {
      method: "POST",
      headers: { Cookie: adminCookie },
    });
    const completeJson = await completeRes.json();

    assert.equal(completeRes.status, 200);
    assert.equal(completeJson.booking.status, "COMPLETED");
  });
});
