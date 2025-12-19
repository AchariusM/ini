import { NextRequest, NextResponse } from "next/server";
import { prisma } from "@/app/lib/prisma";

type RouteContext = {
  params: {
    id: string;
  };
};

// GET detail sisa
export async function GET(_req: NextRequest, { params }: RouteContext) {
  try {
    const id = Number(params.id);
    const data = await prisma.sisa.findUnique({ where: { id } });
    if (!data) {
      return NextResponse.json({ error: "Data tidak ditemukan" }, { status: 404 });
    }
    return NextResponse.json(data);
  } catch (error) {
    console.error(error);
    return NextResponse.json({ error: "Gagal mengambil detail" }, { status: 500 });
  }
}

// PUT = update data by id
export async function PUT(req: NextRequest, { params }: RouteContext) {
  try {
    const id = Number(params.id);
    const body = await req.json();
    const { nama, jumlah, satuan, kategori } = body;

    const updated = await prisma.sisa.update({
      where: { id },
      data: { nama, jumlah: parseFloat(jumlah), satuan, kategori },
    });
    return NextResponse.json(updated);
  } catch (error) {
    console.error(error);
    return NextResponse.json({ error: "Gagal mengupdate data" }, { status: 500 });
  }
}

// DELETE data by id
export async function DELETE(_req: NextRequest, { params }: RouteContext) {
  try {
    const id = Number(params.id);
    await prisma.sisa.delete({ where: { id } });
    return NextResponse.json({ message: "Data berhasil dihapus" });
  } catch (error) {
    console.error(error);
    return NextResponse.json({ error: "Gagal menghapus data" }, { status: 500 });
  }
}
