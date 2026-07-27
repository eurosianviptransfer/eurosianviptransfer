import { NextRequest, NextResponse } from "next/server";
import { getServerSession } from "next-auth";
import { authOptions } from "@/lib/auth/config";
import { prisma } from "@/lib/db";
import { normalizePhone } from "@/lib/auth/otp";

export async function POST(req: NextRequest) {
  const body = await req.json().catch(() => null);
  if (!body || typeof body.subjectUserId !== "string" || !Number.isInteger(body.score) || body.score < 1 || body.score > 5) return NextResponse.json({ error: "Puan 1 ile 5 arasında olmalıdır." }, { status: 400 });
  const session = await getServerSession(authOptions);
  const isAdmin = session?.user && (session.user as any).role === "ADMIN";
  let bookingId: string | null = typeof body.bookingId === "string" ? body.bookingId : null;
  if (!isAdmin) {
    if (!bookingId || typeof body.guestPhone !== "string") return NextResponse.json({ error: "Rezervasyon kodu ve telefon gerekli." }, { status: 401 });
    const booking = await prisma.booking.findFirst({ where: { code: bookingId, guestPhone: normalizePhone(body.guestPhone), status: "COMPLETED" } });
    if (!booking) return NextResponse.json({ error: "Tamamlanmış rezervasyon bulunamadı." }, { status: 404 });
    bookingId = booking.id;
    const alreadyRated = await prisma.rating.findFirst({ where: { bookingId, subjectUserId: body.subjectUserId, raterPhone: normalizePhone(body.guestPhone) } });
    if (alreadyRated) return NextResponse.json({ error: "Bu ekip üyesi için daha önce değerlendirme yaptınız." }, { status: 409 });
  }
  const subject = await prisma.user.findUnique({ where: { id: body.subjectUserId } });
  if (!subject || !["DRIVER", "GREETER"].includes(subject.role)) return NextResponse.json({ error: "Puanlanacak ekip üyesi bulunamadı." }, { status: 404 });
  const rating = await prisma.rating.create({ data: { bookingId, subjectUserId: subject.id, raterRole: isAdmin ? "ADMIN" : null, raterName: typeof body.raterName === "string" ? body.raterName.trim().slice(0, 100) : null, raterPhone: isAdmin ? null : normalizePhone(body.guestPhone), score: body.score, comment: typeof body.comment === "string" ? body.comment.trim().slice(0, 500) : null, category: typeof body.category === "string" ? body.category.slice(0, 40) : "SERVICE" } });
  return NextResponse.json({ rating }, { status: 201 });
}

export async function PUT(req: NextRequest) {
  const code = req.nextUrl.searchParams.get("code"); const phone = req.nextUrl.searchParams.get("phone");
  if (!code || !phone) return NextResponse.json({ error: "Rezervasyon kodu ve telefon gerekli." }, { status: 400 });
  const booking = await prisma.booking.findFirst({ where: { code, guestPhone: normalizePhone(phone), status: "COMPLETED" }, include: { driver: { select: { id: true, name: true, role: true } }, greeter: { select: { id: true, name: true, role: true } } } });
  if (!booking) return NextResponse.json({ error: "Tamamlanmış rezervasyon bulunamadı." }, { status: 404 });
  return NextResponse.json({ booking: { code: booking.code, staff: [booking.driver, booking.greeter].filter(Boolean) } });
}

export async function GET() {
  const session = await getServerSession(authOptions); if (!session || (session.user as any).role !== "ADMIN") return NextResponse.json({ error: "Admin girişi gerekli." }, { status: 401 });
  const ratings = await prisma.rating.findMany({ include: { subjectUser: { select: { id: true, name: true, role: true } } }, orderBy: { createdAt: "desc" }, take: 500 });
  const grouped = Object.values(ratings.reduce<Record<string, { id: string; name: string; role: string; total: number; count: number }>>((acc, rating) => { const key = rating.subjectUserId; acc[key] ??= { id: key, name: rating.subjectUser.name, role: rating.subjectUser.role, total: 0, count: 0 }; acc[key].total += rating.score; acc[key].count += 1; return acc; }, {})).map(item => ({ ...item, average: Number((item.total / item.count).toFixed(2)) }));
  return NextResponse.json({ ratings, summary: grouped });
}
