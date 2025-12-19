import { NextResponse } from "next/server";
import { prisma } from "@/app/lib/prisma";

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
    return NextResponse.json({ error: "Gagal mengambil feedback" }, { status: 500 });
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
