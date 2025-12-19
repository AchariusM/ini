import { NextResponse } from "next/server";
import { prisma } from "@/app/lib/prisma";

export const runtime = "nodejs";

// GET all karyawan
export async function GET() {
  try {
    const data = await prisma.karyawan.findMany({
      orderBy: { id: "desc" },
    });
    return NextResponse.json(data);
  } catch (error) {
    console.error(error);
    return NextResponse.json({ error: "Gagal mengambil data karyawan" }, { status: 500 });
  }
}

// POST create karyawan
export async function POST(req: Request) {
  try {
    const body = await req.json();
    const { nama, jabatan, kontak, gaji, aktif } = body;

    if (!nama || !jabatan) {
      return NextResponse.json({ error: "Nama dan jabatan wajib diisi" }, { status: 400 });
    }

    const created = await prisma.karyawan.create({
      data: {
        nama,
        jabatan,
        kontak,
        gaji,
        aktif: aktif ?? true,
      },
    });

    return NextResponse.json(created, { status: 201 });
  } catch (error) {
    console.error(error);
    return NextResponse.json({ error: "Gagal membuat karyawan" }, { status: 500 });
  }
}
