// file: app/api/login/route.ts
import { NextResponse } from "next/server";
import { prisma } from "@/app/lib/prisma"; // <--- Ganti import ini!

export const runtime = "nodejs";

export async function POST(req: Request) {
  try {
    let body: { username?: string; password?: string } | null = null;
    try {
      body = await req.json();
    } catch {
      return NextResponse.json(
        { success: false, message: "Request body bukan JSON valid" },
        { status: 400 }
      );
    }

    const username = body?.username?.trim();
    const password = body?.password;

    if (!username || !password) {
      return NextResponse.json(
        { success: false, message: "Username dan password wajib diisi" },
        { status: 400 }
      );
    }

    // Gunakan 'prisma' yang diimport dari @/lib/prisma
    const user = await prisma.user.findUnique({
      where: { username },
    });

    if (!user) {
      return NextResponse.json(
        { success: false, message: "Username tidak ditemukan" },
        { status: 401 }
      );
    }

    // Catatan: Untuk produksi, gunakan bcrypt.compare, jangan string biasa.
    if (user.password !== password) {
      return NextResponse.json(
        { success: false, message: "Password salah" },
        { status: 401 }
      );
    }

    return NextResponse.json({ success: true, role: user.role });
  } catch (err: any) {
    console.error("Login Error:", err); // Log error agar terbaca di terminal
    return NextResponse.json({ success: false, message: "Server error" }, { status: 500 });
  }
}
