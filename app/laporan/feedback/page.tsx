"use client";

import { useMemo, useState } from "react";
import AppNavbar from "@/app/ui/app-navbar";
import Image from "next/image";

type Feedback = {
  id: string;
  nama: string;
  email: string;
  pesan: string;
  rating: number;
  tanggal: string; // YYYY-MM-DD
};

const getInitials = (nama: string) =>
  nama
    .split(" ")
    .map((n) => n[0])
    .join("")
    .slice(0, 2)
    .toUpperCase();

const StarRow = ({ rating }: { rating: number }) => {
  return (
    <div className="flex items-center gap-1 text-amber-500">
      {Array.from({ length: 5 }).map((_, i) => (
        <span key={i} className={i < rating ? "text-amber-500" : "text-slate-300"}>
          ★
        </span>
      ))}
    </div>
  );
};

export default function FeedbackPage() {
  const initial = useMemo<Feedback[]>(
    () => [
      { id: "F-01", nama: "Adit", email: "adit@mail.com", pesan: "Rasanya mantap, porsi pas.", rating: 5, tanggal: "2025-01-10" },
      { id: "F-02", nama: "Dina", email: "dina@mail.com", pesan: "Pengiriman agak lama, tapi enak.", rating: 4, tanggal: "2025-02-09" },
      { id: "F-03", nama: "Rico", email: "rico@mail.com", pesan: "Kuah terlalu asin untuk saya.", rating: 3, tanggal: "2025-02-08" },
      { id: "F-04", nama: "Sinta", email: "", pesan: "Tempat nyaman, pelayanan cepat.", rating: 5, tanggal: "2025-03-02" },
    ],
    []
  );

  const [selectedMonth, setSelectedMonth] = useState<string>("all");

  const monthOptions = useMemo(() => {
    const months = new Set<string>();
    initial.forEach((f) => {
      const ym = f.tanggal.slice(0, 7); // YYYY-MM
      months.add(ym);
    });
    return Array.from(months).sort().reverse();
  }, [initial]);

  const filtered = selectedMonth === "all" ? initial : initial.filter((f) => f.tanggal.startsWith(selectedMonth));
  const average =
    filtered.length === 0 ? 0 : filtered.reduce((sum, f) => sum + f.rating, 0) / filtered.length;

  return (
    <main className="min-h-screen bg-[#f2ebdf] text-slate-900">
      <AppNavbar />

      <div className="max-w-6xl mx-auto px-4 pb-10 pt-6 md:pt-10 space-y-6">
        <div className="rounded-2xl border border-slate-200 bg-white/95 shadow-xl p-6 md:p-8 space-y-6">
          <header className="flex flex-col gap-4 md:flex-row md:items-center md:justify-between">
            <div className="flex items-center gap-3">
              <div className="relative w-12 h-12 rounded-full overflow-hidden border border-slate-200 shadow-sm">
                <Image src="/logooyako.jpeg" alt="Warung Oyako" fill sizes="48px" className="object-cover" />
              </div>
              <div>
                <p className="text-xs uppercase tracking-[0.2em] text-amber-600 font-semibold">Warung Oyako</p>
                <h1 className="text-3xl font-bold text-slate-900">Feedback Pelanggan</h1>
                <p className="text-slate-500">Rekap komentar dan rating pelanggan.</p>
              </div>
            </div>

            <div className="flex items-center gap-3">
              <label className="text-sm font-medium text-slate-700">Filter bulan</label>
              <select
                value={selectedMonth}
                onChange={(e) => setSelectedMonth(e.target.value)}
                className="rounded-lg border border-slate-300 bg-white px-3 py-2 text-sm text-slate-800 outline-none ring-2 ring-transparent transition focus:border-amber-300 focus:ring-amber-200"
              >
                <option value="all">Semua</option>
                {monthOptions.map((m) => (
                  <option key={m} value={m}>
                    {new Date(m + "-01").toLocaleString("id-ID", { month: "long", year: "numeric" })}
                  </option>
                ))}
              </select>
            </div>
          </header>

          <div className="space-y-4">
            <div className="rounded-2xl border border-slate-200 bg-white shadow-inner px-6 py-4 flex flex-wrap items-center gap-6">
              <div className="flex items-center gap-3">
                <p className="text-4xl font-extrabold text-amber-500">{average.toFixed(1)}</p>
                <div className="flex flex-col">
                  <StarRow rating={Math.round(average)} />
                  <span className="text-sm text-slate-500">Rata-rata ulasan</span>
                </div>
              </div>
              <div className="h-10 w-px bg-slate-200" />
              <div className="text-lg font-semibold text-slate-800">{filtered.length} Total Feedback Masuk</div>
            </div>

            <div className="space-y-4">
              {filtered.map((f) => (
                <div
                  key={f.id}
                  className="rounded-2xl border border-slate-200 bg-white shadow-sm px-5 py-4 flex flex-col gap-3"
                >
                  <div className="flex items-start gap-4">
                    <div className="flex h-12 w-12 items-center justify-center rounded-full bg-[#d0382a] text-white font-bold">
                      {getInitials(f.nama)}
                    </div>
                    <div className="flex-1">
                      <div className="flex flex-wrap items-center justify-between gap-2">
                        <div>
                          <p className="text-base font-bold text-slate-900">{f.nama}</p>
                          <p className="text-sm text-slate-500">{f.tanggal}</p>
                        </div>
                        <div className="flex items-center gap-2">
                          <StarRow rating={f.rating} />
                        </div>
                      </div>
                    </div>
                  </div>
                  <p className="text-base text-slate-800 italic">"{f.pesan}"</p>
                </div>
              ))}

              {filtered.length === 0 && (
                <div className="rounded-2xl border border-dashed border-slate-200 bg-white px-4 py-6 text-center text-slate-500">
                  Tidak ada feedback pada bulan ini.
                </div>
              )}
            </div>
          </div>
        </div>
      </div>
    </main>
  );
}
