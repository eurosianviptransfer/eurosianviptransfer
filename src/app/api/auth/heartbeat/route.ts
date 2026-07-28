import { NextResponse } from "next/server";
import { prisma } from "@/lib/db";

export async function POST(req: Request) {
  try {
    const body = await req.json();
    const { userId } = body;

    if (!userId) {
      return NextResponse.json({ error: "Kullanıcı ID gereklidir." }, { status: 400 });
    }

    await prisma.user.update({
      where: { id: userId },
      data: { lastSeen: new Date() },
    });

    return NextResponse.json({ success: true });
  } catch (error) {
    return NextResponse.json({ error: "Heartbeat hatası" }, { status: 500 });
  }
}