import { NextResponse } from "next/server";
import { prisma } from "@/app/lib/prisma";

// GET: ambil semua data sisa (opsional filter kategori)
export async function GET(req: Request) {
  try {
    const { searchParams } = new URL(req.url);
    const kategori = searchParams.get("kategori");

    const data = await prisma.sisa.findMany({
      where: kategori ? { kategori } : undefined,
      orderBy: { id: "desc" },
    });

    return NextResponse.json(data);
  } catch (error) {
    console.error(error);
    return NextResponse.json({ error: "Gagal mengambil data" }, { status: 500 });
  }
}

// POST: tambah data sisa
export async function POST(req: Request) {
  try {
    const body = await req.json();
    const { nama, jumlah, satuan, kategori } = body;

    if (!nama || jumlah === undefined || !satuan || !kategori) {
      return NextResponse.json({ error: "Semua field wajib diisi" }, { status: 400 });
    }

    const created = await prisma.sisa.create({
      data: {
        nama,
        jumlah: parseFloat(jumlah),
        satuan,
        kategori,
      },
    });

    return NextResponse.json(created);
  } catch (error) {
    console.error(error);
    return NextResponse.json({ error: "Gagal menambah data" }, { status: 500 });
  }
}
