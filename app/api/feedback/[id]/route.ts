import { NextResponse } from "next/server";
import { prisma } from "@/app/lib/prisma";

export const runtime = "nodejs";

type FeedbackParams = { params: Promise<{ id: string }> };

export async function GET(_req: Request, { params }: FeedbackParams) {
  try {
    const { id } = await params;
    const data = await prisma.feedback.findUnique({ where: { id: Number(id) } });
    if (!data) return NextResponse.json({ error: "Feedback tidak ditemukan" }, { status: 404 });
    return NextResponse.json(data);
  } catch (error) {
    console.error(error);
    return NextResponse.json({ error: "Gagal mengambil feedback" }, { status: 500 });
  }
}

export async function PUT(req: Request, { params }: FeedbackParams) {
  try {
    const { id } = await params;
    const body = await req.json();
    const { nama, email, pesan, rating, sumber } = body;

    const updated = await prisma.feedback.update({
      where: { id: Number(id) },
      data: { nama, email, pesan, rating, sumber },
    });

    return NextResponse.json(updated);
  } catch (error) {
    console.error(error);
    return NextResponse.json({ error: "Gagal mengupdate feedback" }, { status: 500 });
  }
}

export async function DELETE(_req: Request, { params }: FeedbackParams) {
  try {
    const { id } = await params;
    await prisma.feedback.delete({ where: { id: Number(id) } });
    return NextResponse.json({ message: "Feedback dihapus" });
  } catch (error) {
    console.error(error);
    return NextResponse.json({ error: "Gagal menghapus feedback" }, { status: 500 });
  }
}
