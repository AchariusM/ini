import { NextResponse } from "next/server";
import { prisma } from "@/app/lib/prisma";

export const runtime = "nodejs";

type Context = { params: { id: string } };

export async function GET(_req: Request, { params }: Context) {
  try {
    const id = Number(params.id);
    const data = await prisma.laporan.findUnique({ where: { id }, include: { feedback: true } });
    if (!data) return NextResponse.json({ error: "Laporan tidak ditemukan" }, { status: 404 });
    return NextResponse.json(data);
  } catch (error) {
    console.error(error);
    return NextResponse.json({ error: "Gagal mengambil laporan" }, { status: 500 });
  }
}

export async function PUT(req: Request, { params }: Context) {
  try {
    const id = Number(params.id);
    const body = await req.json();
    const { judul, rangkuman, periodeMulai, periodeSelesai, dibuatOleh, feedbackId } = body;

    const updated = await prisma.laporan.update({
      where: { id },
      data: {
        judul,
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

export async function DELETE(_req: Request, { params }: Context) {
  try {
    const id = Number(params.id);
    await prisma.laporan.delete({ where: { id } });
    return NextResponse.json({ message: "Laporan dihapus" });
  } catch (error) {
    console.error(error);
    return NextResponse.json({ error: "Gagal menghapus laporan" }, { status: 500 });
  }
}
