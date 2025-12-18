import { NextResponse } from "next/server";
import prisma from "@/lib/prisma";

export async function POST() {
  try {
    // 1. Ambil stok_awal & sisa
    const stokAwal = await prisma.stokAwal.findMany();
    const sisa = await prisma.sisa.findMany();

    // 2. Buat laporan harian
    const laporan = stokAwal.map((item) => {
      const s = sisa.find((x) => x.nama === item.nama);
      const sisaJml = s ? s.jumlah : 0;

      return {
        nama: item.nama,
        stok_awal: item.jumlah,
        sisa: sisaJml,
        penggunaan: item.jumlah - sisaJml,
        satuan: item.satuan,
        kategori: item.kategori,
      };
    });

    await prisma.laporanHarian.create({
      data: {
        data: laporan,
      },
    });

    // 3. Reset tabel sisa
    await prisma.sisa.deleteMany({});

    await prisma.sisa.createMany({
      data: stokAwal.map((item) => ({
        nama: item.nama,
        jumlah: item.jumlah,
        satuan: item.satuan,
        kategori: item.kategori,
      })),
    });

    return NextResponse.json({
      message: "Reset harian + simpan laporan berhasil",
      total: laporan.length,
    });
  } catch (error) {
    console.error(error);
    return NextResponse.json(
      { error: "Gagal reset harian" },
      { status: 500 }
    );
  }
}
