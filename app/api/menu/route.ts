import { NextResponse } from "next/server";
import { prisma } from "@/app/lib/prisma";

export const runtime = "nodejs";

// GET all menu items
export async function GET() {
  try {
    const items = await prisma.menuItem.findMany({
      orderBy: { id: "desc" },
    });
    return NextResponse.json(items);
  } catch (error) {
    console.error(error);
    return NextResponse.json({ error: "Gagal mengambil data menu" }, { status: 500 });
  }
}

// POST create menu item
export async function POST(req: Request) {
  try {
    const body = await req.json();
    const { nama, harga, kategori, deskripsi, aktif } = body;

    if (!nama || harga === undefined) {
      return NextResponse.json({ error: "Nama dan harga wajib diisi" }, { status: 400 });
    }

    const created = await prisma.menuItem.create({
      data: {
        nama,
        harga,
        kategori,
        deskripsi,
        aktif: aktif ?? true,
      },
    });

    return NextResponse.json(created, { status: 201 });
  } catch (error) {
    console.error(error);
    return NextResponse.json({ error: "Gagal membuat menu" }, { status: 500 });
  }
}
