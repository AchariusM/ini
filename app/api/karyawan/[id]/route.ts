import { NextResponse } from "next/server";
import { prisma } from "@/app/lib/prisma";

export const runtime = "nodejs";

type Context = { params: { id: string } };

export async function GET(_req: Request, { params }: Context) {
  try {
    const id = Number(params.id);
    const data = await prisma.karyawan.findUnique({ where: { id } });
    if (!data) return NextResponse.json({ error: "Karyawan tidak ditemukan" }, { status: 404 });
    return NextResponse.json(data);
  } catch (error) {
    console.error(error);
    return NextResponse.json({ error: "Gagal mengambil karyawan" }, { status: 500 });
  }
}

export async function PUT(req: Request, { params }: Context) {
  try {
    const id = Number(params.id);
    const body = await req.json();
    const { nama, jabatan, kontak, gaji, aktif } = body;

    const updated = await prisma.karyawan.update({
      where: { id },
      data: { nama, jabatan, kontak, gaji, aktif },
    });

    return NextResponse.json(updated);
  } catch (error) {
    console.error(error);
    return NextResponse.json({ error: "Gagal mengupdate karyawan" }, { status: 500 });
  }
}

export async function DELETE(_req: Request, { params }: Context) {
  try {
    const id = Number(params.id);
    await prisma.karyawan.delete({ where: { id } });
    return NextResponse.json({ message: "Karyawan dihapus" });
  } catch (error) {
    console.error(error);
    return NextResponse.json({ error: "Gagal menghapus karyawan" }, { status: 500 });
  }
}
