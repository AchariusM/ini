import { NextResponse } from "next/server";
import { prisma } from "@/app/lib/prisma";
import { Prisma } from "@prisma/client";

export const runtime = "nodejs";

type Context = { params: { id: string } };

export async function GET(_req: Request, { params }: Context) {
  try {
    const id = Number(params.id);
    const item = await prisma.menuItem.findUnique({ where: { id } });
    if (!item) return NextResponse.json({ error: "Menu tidak ditemukan" }, { status: 404 });
    return NextResponse.json(item);
  } catch (error) {
    console.error(error);
    return NextResponse.json({ error: "Gagal mengambil menu" }, { status: 500 });
  }
}

export async function PUT(req: Request, { params }: Context) {
  try {
    const id = Number(params.id);
    const body = await req.json();
    const { nama, harga, kategori, deskripsi, aktif } = body;
    const hargaNum = Number(harga);

    const updated = await prisma.menuItem.update({
      where: { id },
      data: {
        nama,
        harga: Number.isFinite(hargaNum) ? new Prisma.Decimal(hargaNum) : undefined,
        kategori,
        deskripsi,
        aktif,
      },
    });

    return NextResponse.json(updated);
  } catch (error) {
    console.error(error);
    return NextResponse.json({ error: "Gagal mengupdate menu" }, { status: 500 });
  }
}

export async function DELETE(_req: Request, { params }: Context) {
  try {
    const id = Number(params.id);
    await prisma.menuItem.delete({ where: { id } });
    return NextResponse.json({ message: "Menu dihapus" });
  } catch (error) {
    console.error(error);
    return NextResponse.json({ error: "Gagal menghapus menu" }, { status: 500 });
  }
}
