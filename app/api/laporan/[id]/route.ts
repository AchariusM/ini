import { NextResponse } from "next/server";
import { prisma } from "@/app/lib/prisma";

export const runtime = "nodejs";

type LaporanParams = { params: Promise<{ id: string }> };

export async function GET(_req: Request, { params }: LaporanParams) {
  try {
    const { id } = await params;
    const data = await prisma.laporan.findUnique({ where: { id: Number(id) }, include: { feedback: true } });
    if (!data) return NextResponse.json({ error: "Laporan tidak ditemukan" }, { status: 404 });
    return NextResponse.json(data);
  } catch (error) {
    console.error(error);
    return NextResponse.json({ error: "Gagal mengambil laporan" }, { status: 500 });
  }
}

export async function PUT(req: Request, { params }: LaporanParams) {
  try {
    const { id } = await params;
    const body = await req.json();
    const { judul, rangkuman, periodeMulai, periodeSelesai, dibuatOleh, feedbackId } = body;

    const updated = await prisma.laporan.update({
      where: { id: Number(id) },
      data: {
        judul: judul || "Transaksi",
        rangkuman,
        periodeMulai: periodeMulai ? new Date(periodeMulai) : undefined,
        periodeSelesai: periodeSelesai ? new Date(periodeSelesai) : undefined,
        dibuatOleh,
        feedbackId,
      },
      include: { feedback: true },
    });

    return NextResponse.json(updated);
  } catch (error) {
    console.error(error);
    return NextResponse.json({ error: "Gagal mengupdate laporan" }, { status: 500 });
  }
}

export async function DELETE(_req: Request, { params }: LaporanParams) {
  try {
    const { id } = await params;
    await prisma.laporan.delete({ where: { id: Number(id) } });
    return NextResponse.json({ message: "Laporan dihapus" });
  } catch (error) {
    console.error(error);
    return NextResponse.json({ error: "Gagal menghapus laporan" }, { status: 500 });
  }
}
