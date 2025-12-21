import { NextResponse } from "next/server";
import { prisma } from "@/app/lib/prisma";

const sampleFeedback = [
  { nama: "Budi Santoso", email: null, pesan: "Makanannya enak banget, Gyudon terbaik!", rating: 4, sumber: "sample" },
  { nama: "Siti Aminah", email: null, pesan: "Pelayanan cepat, tapi Ocha-nya kurang dingin.", rating: 4, sumber: "sample" },
  { nama: "Joko", email: null, pesan: "Antrian agak panjang pas makan siang.", rating: 3, sumber: "sample" },
];

export const runtime = "nodejs";

// GET all feedback
export async function GET() {
  try {
    const data = await prisma.feedback.findMany({
      orderBy: { id: "desc" },
    });
    return NextResponse.json(data);
  } catch (error) {
    console.error(error);
    // fallback sample to avoid empty-engine error
    return NextResponse.json(sampleFeedback, { status: 200 });
  }
}

// POST create feedback
export async function POST(req: Request) {
  try {
    const body = await req.json();
    const { nama, email, pesan, rating, sumber } = body;

    if (!pesan) {
      return NextResponse.json({ error: "Pesan wajib diisi" }, { status: 400 });
    }

    const created = await prisma.feedback.create({
      data: {
        nama,
        email,
        pesan,
        rating,
        sumber,
      },
    });

    return NextResponse.json(created, { status: 201 });
  } catch (error) {
    console.error(error);
    return NextResponse.json({ error: "Gagal membuat feedback" }, { status: 500 });
  }
}
