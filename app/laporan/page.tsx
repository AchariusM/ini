"use client";

import { useMemo, useState } from "react";
import AppNavbar from "../ui/app-navbar";

type Transaksi = {
  id: string;
  waktu: string; // ISO string
  total: number;
};

const transaksiDummy: Transaksi[] = [
  { id: "TRX #2025001", waktu: "2025-11-24T12:45:00", total: 121000 },
  { id: "TRX #2025002", waktu: "2025-11-24T19:10:00", total: 89000 },
  { id: "TRX #2025003", waktu: "2025-11-23T11:20:00", total: 56000 },
  { id: "TRX #2025004", waktu: "2025-11-22T09:05:00", total: 99000 },
];

const formatRupiah = (value: number) =>
  "Rp " + value.toLocaleString("id-ID", { minimumFractionDigits: 0 }) + ",00";

const formatTanggal = (iso: string) => {
  const d = new Date(iso);
  return `${d.getDate().toString().padStart(2, "0")}-${(d.getMonth() + 1)
    .toString()
    .padStart(2, "0")}-${d.getFullYear()} • ${d
    .getHours()
    .toString()
    .padStart(2, "0")}:${d.getMinutes().toString().padStart(2, "0")}`;
};

export default function LaporanPage() {
  const [periode, setPeriode] = useState<"hari-ini" | "7" | "30" | "semua">("hari-ini");

  const filtered = useMemo(() => {
    if (periode === "semua") return transaksiDummy;
    const now = new Date();
    const maxDay = periode === "hari-ini" ? 0 : Number(periode);
    return transaksiDummy.filter((t) => {
      const dt = new Date(t.waktu);
      const diff = Math.floor((now.getTime() - dt.getTime()) / 86400000);
      return diff <= maxDay;
    });
  }, [periode]);

  const totalPendapatan = filtered.reduce((sum, t) => sum + t.total, 0);

  return (
    <main className="min-h-screen bg-[#f2ebdf] text-slate-900">
      <AppNavbar />

      <div className="max-w-6xl mx-auto px-4 pb-12 pt-6 md:pt-10 space-y-6">
        <div className="rounded-2xl bg-white/95 border border-slate-200 shadow-xl overflow-hidden">
          <div className="border-b border-slate-200 bg-white px-6 pt-4 pb-3">
            <h1 className="text-lg font-semibold text-[#c41c24]">Laporan Transaksi</h1>
          </div>

          <div className="space-y-6 px-6 py-6">
            <div className="grid gap-4 md:grid-cols-3">
              <div className="rounded-xl bg-[#7a1c22] text-white px-5 py-4 shadow-md">
                <p className="text-sm font-semibold opacity-85">Total Pendapatan</p>
                <p className="text-2xl md:text-3xl font-bold mt-2">{formatRupiah(totalPendapatan)}</p>
              </div>
              <div className="rounded-xl border border-slate-200 bg-slate-50 px-5 py-4 shadow-inner">
                <p className="text-sm font-semibold text-slate-500">Jumlah Transaksi</p>
                <p className="text-2xl md:text-3xl font-bold text-emerald-600 mt-2">{filtered.length}</p>
              </div>
              <div className="rounded-xl border border-slate-200 bg-slate-50 px-5 py-4 shadow-inner">
                <p className="text-sm font-semibold text-slate-500">Filter Periode</p>
                <select
                  value={periode}
                  onChange={(e) => setPeriode(e.target.value as typeof periode)}
                  className="mt-2 w-full rounded-lg border border-slate-300 bg-white px-3 py-2 text-sm font-semibold text-slate-800 outline-none ring-2 ring-transparent transition focus:border-amber-300 focus:ring-amber-200"
                >
                  <option value="hari-ini">Hari ini</option>
                  <option value="7">7 hari</option>
                  <option value="30">30 hari</option>
                  <option value="semua">Semua</option>
                </select>
              </div>
            </div>

            <div className="space-y-3">
              <h2 className="text-lg font-bold text-slate-900">Riwayat Transaksi</h2>

              {filtered.map((t) => (
                <div
                  key={t.id}
                  className="flex flex-col gap-3 rounded-xl border border-slate-200 bg-white px-4 py-3 shadow-sm md:flex-row md:items-center"
                >
                  <div className="flex items-center gap-3">
                    <div className="flex h-12 w-12 items-center justify-center rounded-xl border border-slate-200 bg-slate-100 text-lg font-bold text-[#c41c24]">
                      #
                    </div>
                    <div className="leading-tight">
                      <p className="font-semibold text-slate-900">{t.id}</p>
                      <p className="text-sm text-slate-500">{formatTanggal(t.waktu)}</p>
                    </div>
                  </div>

                  <div className="flex flex-1 items-center justify-between gap-3 md:justify-end">
                    <p className="text-base font-semibold text-emerald-600">{formatRupiah(t.total)}</p>
                    <button className="rounded-lg bg-emerald-600 px-4 py-2 text-sm font-semibold text-white transition hover:bg-emerald-500">
                      Detail
                    </button>
                  </div>
                </div>
              ))}

              {filtered.length === 0 && (
                <div className="rounded-xl border border-dashed border-slate-200 bg-slate-50 px-4 py-5 text-center text-slate-500">
                  Tidak ada transaksi pada periode ini.
                </div>
              )}
            </div>
          </div>
        </div>
      </div>
    </main>
  );
}
