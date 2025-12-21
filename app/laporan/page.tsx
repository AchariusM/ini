"use client";

import { useEffect, useMemo, useState } from "react";
import AppNavbar from "../ui/app-navbar";

type LaporanApi = {
  id: number;
  judul: string;
  rangkuman?: string | null;
  periodeMulai?: string | null;
  periodeSelesai?: string | null;
  dibuatOleh?: string | null;
  createdAt?: string | null;
};

type FormState = {
  judul: string;
  total: string;
  tanggal: string;
  waktu: string;
  catatan: string;
  kasir: string;
};

const formatCurrency = (value: number) =>
  new Intl.NumberFormat("id-ID", { style: "currency", currency: "IDR", maximumFractionDigits: 0 }).format(value);

const formatTanggalDisplay = (iso?: string | null) => {
  if (!iso) return "-";
  const d = new Date(iso);
  const pad = (v: number) => String(v).padStart(2, "0");
  return `${pad(d.getDate())}-${pad(d.getMonth() + 1)}-${d.getFullYear()} • ${pad(d.getHours())}:${pad(d.getMinutes())}`;
};

const decodeRangkuman = (rangkuman?: string | null): { total: number; note: string } => {
  if (!rangkuman) return { total: 0, note: "" };
  try {
    const parsed = JSON.parse(rangkuman);
    if (typeof parsed === "object" && parsed !== null) {
      return {
        total: Number(parsed.total) || 0,
        note: typeof parsed.note === "string" ? parsed.note : "",
      };
    }
  } catch {
    // not JSON, fall through
  }

  const numeric = Number(String(rangkuman).replace(/[^\d.-]/g, ""));
  return { total: Number.isFinite(numeric) ? numeric : 0, note: typeof rangkuman === "string" ? rangkuman : "" };
};

const encodeRangkuman = (total: number, note: string) => JSON.stringify({ total, note });

const emptyForm: FormState = { judul: "", total: "", tanggal: "", waktu: "", catatan: "", kasir: "" };

export default function LaporanPage() {
  const [periode, setPeriode] = useState<"hari-ini" | "7" | "30" | "semua">("semua");
  const [data, setData] = useState<LaporanApi[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  const [modalOpen, setModalOpen] = useState(false);
  const [activeId, setActiveId] = useState<number | null>(null);
  const [form, setForm] = useState<FormState>(emptyForm);
  const [saving, setSaving] = useState(false);
  const [deleting, setDeleting] = useState(false);

  const loadData = async () => {
    try {
      setLoading(true);
      const res = await fetch("/api/laporan");
      if (!res.ok) throw new Error("Gagal memuat laporan");
      const json = await res.json();
      setData(json);
      setError(null);
    } catch (err: any) {
      setError(err.message || "Gagal memuat laporan");
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    loadData();
  }, []);

  const filtered = useMemo(() => {
    if (periode === "semua") return data;
    const now = new Date();
    const allowedDays = periode === "hari-ini" ? 0 : Number(periode);

    return data.filter((lap) => {
      const tanggal = lap.periodeMulai || lap.createdAt;
      if (!tanggal) return false;
      const dt = new Date(tanggal);
      const diff = Math.floor((now.getTime() - dt.getTime()) / 86400000);
      return diff <= allowedDays;
    });
  }, [data, periode]);

  const totalPendapatan = filtered.reduce((sum, lap) => sum + decodeRangkuman(lap.rangkuman).total, 0);

  const openCreate = () => {
    setActiveId(null);
    setForm(emptyForm);
    setModalOpen(true);
  };

  const openDetail = (lap: LaporanApi) => {
    const { total, note } = decodeRangkuman(lap.rangkuman);
    const tanggalDasar = lap.periodeMulai || lap.createdAt || "";
    const dt = tanggalDasar ? new Date(tanggalDasar) : null;
    const pad = (v: number) => String(v).padStart(2, "0");

    setActiveId(lap.id);
    setForm({
      judul: lap.judul || "",
      total: total ? String(total) : "",
      tanggal: dt ? `${dt.getFullYear()}-${pad(dt.getMonth() + 1)}-${pad(dt.getDate())}` : "",
      waktu: dt ? `${pad(dt.getHours())}:${pad(dt.getMinutes())}` : "",
      catatan: note,
      kasir: lap.dibuatOleh || "",
    });
    setModalOpen(true);
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setSaving(true);
    try {
      const total = Number(form.total || 0);
      const payload = {
        judul: form.judul || "Transaksi",
        rangkuman: encodeRangkuman(total, form.catatan),
        periodeMulai: form.tanggal ? new Date(`${form.tanggal}T${form.waktu || "00:00"}`).toISOString() : undefined,
        periodeSelesai: undefined,
        dibuatOleh: form.kasir || undefined,
      };

      const url = activeId ? `/api/laporan/${activeId}` : "/api/laporan";
      const method = activeId ? "PUT" : "POST";

      const res = await fetch(url, {
        method,
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(payload),
      });

      if (!res.ok) throw new Error(activeId ? "Gagal menyimpan perubahan" : "Gagal menambah transaksi");

      await loadData();
      setModalOpen(false);
    } catch (err: any) {
      setError(err.message || "Terjadi kesalahan");
    } finally {
      setSaving(false);
    }
  };

  const handleDelete = async () => {
    if (!activeId) return;
    const sure = window.confirm("Hapus transaksi ini?");
    if (!sure) return;
    setDeleting(true);
    try {
      const res = await fetch(`/api/laporan/${activeId}`, { method: "DELETE" });
      if (!res.ok) throw new Error("Gagal menghapus transaksi");
      await loadData();
      setModalOpen(false);
    } catch (err: any) {
      setError(err.message || "Terjadi kesalahan");
    } finally {
      setDeleting(false);
    }
  };

  return (
    <main className="min-h-screen bg-[#f2ebdf] text-slate-900">
      <AppNavbar />

      <div className="max-w-6xl mx-auto px-4 pb-12 pt-6 md:pt-10 space-y-6">
        <div className="rounded-2xl bg-white/95 border border-slate-200 shadow-xl overflow-hidden">
          <div className="border-b border-slate-200 bg-white px-6 pt-4 pb-3">
            <h1 className="text-lg font-semibold text-[#c41c24]">Laporan Transaksi</h1>
            <p className="text-sm text-slate-500">Rekap transaksi dengan data dari server</p>
          </div>

          <div className="space-y-6 px-6 py-6">
            <div className="flex flex-col gap-4 md:flex-row md:items-center md:justify-between">
              <div className="grid flex-1 gap-4 md:grid-cols-3">
                <div className="rounded-2xl bg-[#7a1c22] text-white px-5 py-4 shadow-md">
                  <p className="text-sm font-semibold opacity-90">Total Pendapatan</p>
                  <p className="text-3xl md:text-4xl font-bold mt-2 leading-tight">{formatCurrency(totalPendapatan)}</p>
                </div>

                <div className="rounded-2xl border border-slate-200 bg-slate-50 px-5 py-4 shadow-inner">
                  <p className="text-sm font-semibold text-slate-600">Jumlah Transaksi</p>
                  <p className="text-3xl md:text-4xl font-bold text-emerald-600 mt-2 leading-tight">{filtered.length}</p>
                </div>

                <div className="rounded-2xl border border-slate-200 bg-slate-50 px-5 py-4 shadow-inner">
                  <p className="text-sm font-semibold text-slate-600">Filter Periode</p>
                  <select
                    value={periode}
                    onChange={(e) => setPeriode(e.target.value as typeof periode)}
                    className="mt-2 w-full rounded-lg border border-slate-300 bg-white px-3 py-2 text-sm font-semibold text-slate-800 outline-none ring-2 ring-transparent transition focus:border-amber-300 focus:ring-amber-200"
                  >
                    <option value="semua">Semua</option>
                    <option value="hari-ini">Hari ini</option>
                    <option value="7">7 hari</option>
                    <option value="30">30 hari</option>
                  </select>
                </div>
              </div>

              <button
                type="button"
                onClick={openCreate}
                className="mt-2 inline-flex items-center justify-center rounded-lg bg-emerald-600 px-4 py-2 text-sm font-semibold text-white transition hover:bg-emerald-700 md:mt-0"
              >
                Tambah Transaksi
              </button>
            </div>

            <div className="space-y-3">
              <h2 className="text-lg font-bold text-slate-900">Riwayat Transaksi</h2>

              {loading && <div className="text-center text-slate-500">Memuat laporan...</div>}
              {error && (
                <div className="rounded-xl border border-rose-200 bg-rose-50 px-4 py-3 text-rose-700">{error}</div>
              )}

              {!loading &&
                !error &&
                filtered.map((lap) => {
                  const { total } = decodeRangkuman(lap.rangkuman);
                  return (
                    <div
                      key={lap.id}
                      className="flex flex-col gap-3 rounded-2xl border border-slate-200 bg-white px-4 py-3 shadow-sm md:flex-row md:items-center md:justify-between"
                    >
                      <div className="flex items-center gap-3">
                        <div className="flex h-12 w-12 items-center justify-center rounded-xl border border-slate-200 bg-slate-50 text-lg font-bold text-[#c41c24]">
                          #
                        </div>
                        <div className="leading-tight">
                          <p className="font-semibold text-slate-900">{lap.judul || `TRX #${lap.id}`}</p>
                          <p className="text-sm text-slate-500">{formatTanggalDisplay(lap.periodeMulai || lap.createdAt)}</p>
                        </div>
                      </div>

                      <div className="flex items-center justify-between gap-3 md:justify-end md:min-w-[240px]">
                        <p className="text-base font-semibold text-emerald-700">{formatCurrency(total)}</p>
                        <button
                          type="button"
                          onClick={() => openDetail(lap)}
                          className="rounded-lg bg-emerald-600 px-4 py-2 text-sm font-semibold text-white transition hover:bg-emerald-700"
                        >
                          Detail
                        </button>
                      </div>
                    </div>
                  );
                })}

              {!loading && !error && filtered.length === 0 && (
                <div className="rounded-xl border border-dashed border-slate-200 bg-slate-50 px-4 py-5 text-center text-slate-500">
                  Tidak ada transaksi pada periode ini.
                </div>
              )}
            </div>
          </div>
        </div>
      </div>

      {modalOpen && (
        <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/40 px-4 py-6">
          <div className="w-full max-w-2xl rounded-2xl bg-white shadow-2xl">
            <div className="flex items-center justify-between border-b border-slate-200 px-6 py-4">
              <div>
                <p className="text-sm font-semibold text-[#c41c24]">
                  {activeId ? `Detail Transaksi #${activeId}` : "Tambah Transaksi"}
                </p>
                <p className="text-xs text-slate-500">Isi detail untuk menyimpan atau update.</p>
              </div>
              <button
                type="button"
                onClick={() => setModalOpen(false)}
                className="rounded-full border border-slate-200 px-3 py-1 text-xs font-semibold text-slate-600 hover:bg-slate-100"
              >
                Tutup
              </button>
            </div>

            <form onSubmit={handleSubmit} className="space-y-4 px-6 py-5">
              <div className="grid gap-4 md:grid-cols-2">
                <label className="space-y-1 text-sm font-semibold text-slate-700">
                  Kode Transaksi
                  <input
                    value={form.judul}
                    onChange={(e) => setForm((f) => ({ ...f, judul: e.target.value }))}
                    className="mt-1 w-full rounded-lg border border-slate-300 px-3 py-2 text-sm font-medium text-slate-900 outline-none ring-2 ring-transparent transition focus:border-amber-300 focus:ring-amber-200"
                    placeholder="TRX #2025xxx"
                    required
                  />
                </label>
                <label className="space-y-1 text-sm font-semibold text-slate-700">
                  Kasir / Dibuat oleh
                  <input
                    value={form.kasir}
                    onChange={(e) => setForm((f) => ({ ...f, kasir: e.target.value }))}
                    className="mt-1 w-full rounded-lg border border-slate-300 px-3 py-2 text-sm font-medium text-slate-900 outline-none ring-2 ring-transparent transition focus:border-amber-300 focus:ring-amber-200"
                    placeholder="Nama kasir"
                  />
                </label>
              </div>

              <div className="grid gap-4 md:grid-cols-3">
                <label className="space-y-1 text-sm font-semibold text-slate-700">
                  Tanggal
                  <input
                    type="date"
                    value={form.tanggal}
                    onChange={(e) => setForm((f) => ({ ...f, tanggal: e.target.value }))}
                    className="mt-1 w-full rounded-lg border border-slate-300 px-3 py-2 text-sm font-medium text-slate-900 outline-none ring-2 ring-transparent transition focus:border-amber-300 focus:ring-amber-200"
                    required
                  />
                </label>
                <label className="space-y-1 text-sm font-semibold text-slate-700">
                  Waktu
                  <input
                    type="time"
                    value={form.waktu}
                    onChange={(e) => setForm((f) => ({ ...f, waktu: e.target.value }))}
                    className="mt-1 w-full rounded-lg border border-slate-300 px-3 py-2 text-sm font-medium text-slate-900 outline-none ring-2 ring-transparent transition focus:border-amber-300 focus:ring-amber-200"
                    required
                  />
                </label>
                <label className="space-y-1 text-sm font-semibold text-slate-700">
                  Total (Rp)
                  <input
                    type="number"
                    min={0}
                    step="500"
                    value={form.total}
                    onChange={(e) => setForm((f) => ({ ...f, total: e.target.value }))}
                    className="mt-1 w-full rounded-lg border border-slate-300 px-3 py-2 text-sm font-medium text-slate-900 outline-none ring-2 ring-transparent transition focus:border-amber-300 focus:ring-amber-200"
                    required
                  />
                </label>
              </div>

              <label className="space-y-1 text-sm font-semibold text-slate-700">
                Catatan
                <textarea
                  value={form.catatan}
                  onChange={(e) => setForm((f) => ({ ...f, catatan: e.target.value }))}
                  className="mt-1 w-full rounded-lg border border-slate-300 px-3 py-2 text-sm font-medium text-slate-900 outline-none ring-2 ring-transparent transition focus:border-amber-300 focus:ring-amber-200"
                  rows={3}
                  placeholder="Catatan atau ringkasan singkat"
                />
              </label>

              <div className="flex flex-col-reverse gap-3 pt-2 md:flex-row md:items-center md:justify-between">
                {activeId ? (
                  <button
                    type="button"
                    onClick={handleDelete}
                    disabled={deleting}
                    className="rounded-lg border border-rose-200 px-4 py-2 text-sm font-semibold text-rose-700 transition hover:bg-rose-50 disabled:cursor-not-allowed disabled:opacity-60"
                  >
                    {deleting ? "Menghapus..." : "Hapus"}
                  </button>
                ) : (
                  <div />
                )}

                <div className="flex gap-2 md:justify-end">
                  <button
                    type="button"
                    onClick={() => setModalOpen(false)}
                    className="rounded-lg border border-slate-200 px-4 py-2 text-sm font-semibold text-slate-700 transition hover:bg-slate-50"
                  >
                    Batal
                  </button>
                  <button
                    type="submit"
                    disabled={saving}
                    className="rounded-lg bg-emerald-600 px-4 py-2 text-sm font-semibold text-white transition hover:bg-emerald-700 disabled:cursor-not-allowed disabled:opacity-70"
                  >
                    {saving ? "Menyimpan..." : activeId ? "Simpan Perubahan" : "Tambah"}
                  </button>
                </div>
              </div>
            </form>
          </div>
        </div>
      )}
    </main>
  );
}
