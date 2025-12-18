"use client";

import Image from "next/image";
import Link from "next/link";

export default function HomePage() {
  return (
    <main className="relative min-h-screen text-white overflow-hidden">
      <div className="absolute inset-0">
        <Image
          src="/warungoyako.jpeg"
          alt="Warung Oyako"
          fill
          priority
          className="object-cover"
          sizes="100vw"
        />
        <div className="absolute inset-0 bg-black/55" />
        <div className="absolute inset-0 bg-gradient-to-b from-black/30 via-black/40 to-black/70" />
      </div>

      <header className="relative z-10 flex items-center justify-between px-6 md:px-12 py-6">
        <div className="flex items-center gap-3 bg-black/50 backdrop-blur-md px-3 py-2 rounded-full border border-white/10 shadow-lg">
          <div className="relative w-12 h-12 overflow-hidden rounded-full border border-white/30">
            <Image src="/logooyako.jpeg" alt="Warung Oyako" fill className="object-cover" sizes="48px" />
          </div>
          <div className="text-sm uppercase tracking-[0.2em] text-yellow-200 font-semibold">
            Warung Oyako
          </div>
        </div>

        <Link
          href="/login"
          className="text-sm md:text-base bg-white/80 text-gray-900 px-4 py-2 md:px-5 md:py-2.5 rounded-full font-semibold shadow-lg hover:bg-white transition"
        >
          Masuk
        </Link>
      </header>

      <section className="relative z-10 flex flex-col items-center justify-center text-center px-6 md:px-10 pt-10 md:pt-20 pb-16 md:pb-24 gap-6">
        <div className="text-xs md:text-sm uppercase tracking-[0.3em] text-yellow-300 font-semibold">
          Warung Oyako
        </div>
        <h1 className="text-3xl md:text-5xl lg:text-6xl font-extrabold leading-tight max-w-4xl drop-shadow-[0_10px_25px_rgba(0,0,0,0.5)]">
          SIKP — Sistem Informasi Kepuasan Pelanggan
        </h1>
        <p className="text-base md:text-lg text-white/90 max-w-2xl drop-shadow-[0_4px_20px_rgba(0,0,0,0.4)]">
          Kelola menu, karyawan, laporan, dan feedback pelanggan secara efisien dalam satu dashboard.
        </p>
        <Link
          href="/login"
          className="mt-4 inline-flex items-center gap-2 bg-amber-400 text-black font-semibold px-6 py-3 md:px-8 md:py-4 rounded-full shadow-xl hover:bg-amber-300 hover:translate-y-[-1px] transition"
        >
          Mulai Sekarang
          <span aria-hidden>→</span>
        </Link>
      </section>
    </main>
  );
}
