"use client";

import Image from "next/image";
import AppNavbar from "../ui/app-navbar";

export default function DashboardPage() {
  return (
    <main className="relative min-h-screen text-white overflow-hidden bg-black">
      <div className="absolute inset-0">
        <Image
          src="/warungoyako.jpeg"
          alt="Warung Oyako"
          fill
          priority
          className="object-cover"
          sizes="100vw"
        />
        <div className="absolute inset-0 bg-black/65" />
        <div className="absolute inset-0 bg-gradient-to-b from-black/20 via-black/40 to-black/80" />
      </div>

      <AppNavbar />

      <section className="relative z-10 flex items-center justify-center px-4 md:px-10 py-16 md:py-24">
        <div className="text-center space-y-4 max-w-3xl">
          <h1 className="text-5xl md:text-6xl lg:text-7xl font-extrabold leading-tight drop-shadow-[0_10px_30px_rgba(0,0,0,0.45)]">
            WARUNG OYAKO
          </h1>
          <p className="text-xl md:text-2xl text-white/90">Comfort Japanese Food</p>
        </div>
      </section>
    </main>
  );
}
