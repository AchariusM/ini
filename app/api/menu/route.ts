import { NextResponse } from "next/server";
import { prisma } from "@/app/lib/prisma";
import { Prisma } from "@prisma/client";

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

// POST create menu item (single) atau bulk (array)
export async function POST(req: Request) {
  try {
    const body = await req.json();

    // Bulk insert ketika body adalah array
    if (Array.isArray(body)) {
      const payload = body
        .map((b) => ({
          nama: b.nama,
          harga: Number(b.harga),
          kategori: b.kategori ?? null,
          deskripsi: b.deskripsi ?? null,
          aktif: b.aktif ?? true,
        }))
        .filter((item) => item.nama && Number.isFinite(item.harga));

      if (payload.length === 0) {
        return NextResponse.json({ error: "Data tidak valid" }, { status: 400 });
      }

      const created = await prisma.menuItem.createMany({
        data: payload,
      });

      return NextResponse.json({ inserted: created.count }, { status: 201 });
    }

    // Single insert
    const { nama, harga, kategori, deskripsi, aktif } = body;
    const hargaNum = Number(harga);

    if (!nama || !Number.isFinite(hargaNum)) {
      return NextResponse.json({ error: "Nama dan harga wajib diisi" }, { status: 400 });
    }

    const created = await prisma.menuItem.create({
      data: {
        nama,
        harga: new Prisma.Decimal(hargaNum),
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
