import { NextResponse } from "next/server";
import { prisma } from "@/app/lib/prisma";

export const runtime = "nodejs";

// GET all laporan
export async function GET() {
  try {
    const data = await prisma.laporan.findMany({
      orderBy: { id: "desc" },
      include: { feedback: true },
    });
    return NextResponse.json(data);
  } catch (error) {
    console.error(error);
    return NextResponse.json({ error: "Gagal mengambil laporan" }, { status: 500 });
  }
}

// POST create laporan
export async function POST(req: Request) {
  try {
    const body = await req.json();
    const { judul, rangkuman, periodeMulai, periodeSelesai, dibuatOleh, feedbackId } = body;

    const created = await prisma.laporan.create({
      data: {
        judul: judul || "Transaksi",
        rangkuman,
        periodeMulai: periodeMulai ? new Date(periodeMulai) : undefined,
        periodeSelesai: periodeSelesai ? new Date(periodeSelesai) : undefined,
        dibuatOleh,
        feedbackId,
      },
    });

    return NextResponse.json(created, { status: 201 });
  } catch (error) {
    console.error(error);
    return NextResponse.json({ error: "Gagal membuat laporan" }, { status: 500 });
  }
}
