import { NextResponse } from "next/server";
import { prisma } from "@/lib/db";

export async function GET() {
  try {
    // Son 2 dakika içinde sinyal gönderenleri online kabul et
    const twoMinutesAgo = new Date(Date.now() - 2 * 60 * 1000);

    const onlineUsers = await prisma.user.findMany({
      where: {
        active: true,
        lastSeen: {
          gte: twoMinutesAgo,
        },
      },
      select: {
        id: true,
        name: true,
        phone: true,
        role: true,
        supplierName: true,
        lastSeen: true,
      },
      orderBy: {
        lastSeen: "desc",
      },
    });

    return NextResponse.json({ success: true, users: onlineUsers });
  } catch (error) {
    return NextResponse.json({ error: "Online kullanıcılar alınamadı." }, { status: 500 });
  }
}