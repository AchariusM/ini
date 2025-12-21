"use client";

import { useEffect, useMemo, useState } from "react";
import { MagnifyingGlassIcon, PlusIcon } from "@heroicons/react/24/outline";
import AppNavbar from "../ui/app-navbar";

type Karyawan = {
  id: number;
  nama: string;
  jabatan: string;
  kontak?: string | null;
  gaji?: number | null;
  aktif: boolean;
};

const getInitials = (nama: string) =>
  nama
    .split(" ")
    .map((part) => part[0])
    .join("")
    .slice(0, 2)
    .toUpperCase();

export default function KaryawanPage() {
  const [data, setData] = useState<Karyawan[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [editing, setEditing] = useState<Karyawan | null>(null);
  const [form, setForm] = useState<Omit<Karyawan, "id">>({
    nama: "",
    jabatan: "",
    kontak: "",
    aktif: true,
  });
  const [query, setQuery] = useState("");
  const [showForm, setShowForm] = useState(false);
  const [detail, setDetail] = useState<Karyawan | null>(null);

  const fetchData = async () => {
    try {
      setLoading(true);
      const res = await fetch("/api/karyawan");
      if (!res.ok) throw new Error("Gagal memuat karyawan");
      const json = await res.json();
      setData(json);
      setError(null);
    } catch (err: any) {
      setError(err.message || "Gagal memuat karyawan");
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchData();
  }, []);

  const filtered = useMemo(
    () =>
      data.filter((item) => {
        const target = `${item.nama} ${item.jabatan} ${item.id}`.toLowerCase();
        return target.includes(query.toLowerCase());
      }),
    [data, query]
  );

  const reset = () => {
    setForm({ nama: "", jabatan: "", kontak: "", aktif: true });
    setEditing(null);
    setShowForm(false);
  };

  const submit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!form.nama || !form.jabatan) return;

    const payload = { ...form };

    try {
      if (editing) {
        const res = await fetch(`/api/karyawan/${editing.id}`, {
          method: "PUT",
          headers: { "Content-Type": "application/json" },
          body: JSON.stringify(payload),
        });
        if (!res.ok) throw new Error("Gagal menyimpan karyawan");
        const updated = await res.json();
        setData((prev) => prev.map((item) => (item.id === editing.id ? updated : item)));
      } else {
        const res = await fetch("/api/karyawan", {
          method: "POST",
          headers: { "Content-Type": "application/json" },
          body: JSON.stringify(payload),
        });
        if (!res.ok) throw new Error("Gagal menambah karyawan");
        const created = await res.json();
        setData((prev) => [created, ...prev]);
      }
      reset();
    } catch (err: any) {
      alert(err.message || "Gagal menyimpan karyawan");
    }
  };

  const handleDelete = async (id: number) => {
    if (!confirm("Hapus karyawan ini?")) return;
    try {
      const res = await fetch(`/api/karyawan/${id}`, { method: "DELETE" });
      if (!res.ok) throw new Error("Gagal menghapus karyawan");
      setData((prev) => prev.filter((i) => i.id !== id));
      if (editing?.id === id) reset();
    } catch (err: any) {
      alert(err.message || "Gagal menghapus karyawan");
    }
  };

  const startEdit = (item: Karyawan) => {
    setEditing(item);
    setForm({
      nama: item.nama,
      jabatan: item.jabatan,
      kontak: item.kontak || "",
      aktif: item.aktif,
    });
    setShowForm(true);
  };

  const startAdd = () => {
    reset();
    setShowForm(true);
  };

  return (
    <main className="min-h-screen bg-[#f2ebdf] text-slate-900">
      <AppNavbar />

      <div className="max-w-6xl mx-auto px-4 pb-12 pt-6 md:pt-10 space-y-6">
        <div className="rounded-2xl bg-white/95 border border-slate-200 shadow-xl">
          <div className="flex flex-col gap-4 border-b border-slate-200 px-6 py-5 md:flex-row md:items-center md:justify-between">
            <div>
              <p className="text-xs font-semibold uppercase tracking-[0.25em] text-amber-600">Karyawan</p>
              <h1 className="text-2xl font-bold text-slate-900">Manajemen Data Karyawan</h1>
              <p className="text-sm text-slate-500">Kelola data staf, kontak, dan status tampil.</p>
            </div>
            <div className="flex w-full flex-col gap-3 md:w-auto md:flex-row md:items-center">
              <div className="relative w-full md:w-72">
                <MagnifyingGlassIcon className="pointer-events-none absolute left-3 top-1/2 h-5 w-5 -translate-y-1/2 text-slate-400" />
                <input
                  value={query}
                  onChange={(e) => setQuery(e.target.value)}
                  placeholder="Cari Karyawan..."
                  className="w-full rounded-lg border border-slate-300 bg-white px-10 py-2 text-sm text-slate-800 placeholder:text-slate-400 outline-none ring-2 ring-transparent transition focus:border-amber-300 focus:ring-amber-200"
                />
              </div>
              <button
                onClick={startAdd}
                className="inline-flex items-center justify-center gap-2 rounded-lg bg-[#c41c24] px-4 py-2 text-sm font-semibold text-white shadow-md shadow-[#c41c24]/25 transition hover:bg-[#aa171f] active:scale-[0.99]"
              >
                <PlusIcon className="h-5 w-5" />
                Tambah
              </button>
            </div>
          </div>

          {showForm && (
            <form
              onSubmit={submit}
              className="grid gap-3 border-b border-slate-200 bg-slate-50 px-6 py-4 md:grid-cols-5 md:items-end"
            >
              <input
                value={form.nama}
                onChange={(e) => setForm({ ...form, nama: e.target.value })}
                placeholder="Nama lengkap"
                className="w-full rounded-lg border border-slate-300 bg-white px-3 py-2 text-sm text-slate-800 placeholder:text-slate-400 outline-none ring-2 ring-transparent transition focus:border-amber-300 focus:ring-amber-200"
                required
              />
              <input
                value={form.jabatan}
                onChange={(e) => setForm({ ...form, jabatan: e.target.value })}
                placeholder="Role / Jabatan"
                className="w-full rounded-lg border border-slate-300 bg-white px-3 py-2 text-sm text-slate-800 placeholder:text-slate-400 outline-none ring-2 ring-transparent transition focus:border-amber-300 focus:ring-amber-200"
                required
              />
              <input
                value={form.kontak || ""}
                onChange={(e) => setForm({ ...form, kontak: e.target.value })}
                placeholder="Nomor HP"
                className="w-full rounded-lg border border-slate-300 bg-white px-3 py-2 text-sm text-slate-800 placeholder:text-slate-400 outline-none ring-2 ring-transparent transition focus:border-amber-300 focus:ring-amber-200"
              />
              <label className="flex items-center gap-2 rounded-lg border border-slate-300 bg-white px-3 py-2 text-sm font-semibold text-slate-700">
                <input
                  type="checkbox"
                  checked={form.aktif}
                  onChange={(e) => setForm({ ...form, aktif: e.target.checked })}
                  className="h-4 w-4 rounded border-slate-300 text-emerald-600 focus:ring-emerald-500"
                />
                Tampil (aktif)
              </label>
              <div className="flex gap-2 md:col-span-1 md:justify-end">
                <button
                  type="submit"
                  className="inline-flex flex-1 items-center justify-center rounded-lg bg-[#2563eb] px-4 py-2 text-sm font-semibold text-white shadow-md transition hover:bg-[#1e4fc7] active:scale-[0.99]"
                >
                  {editing ? "Simpan" : "Tambah"}
                </button>
                <button
                  type="button"
                  onClick={reset}
                  className="inline-flex items-center justify-center rounded-lg border border-slate-300 bg-white px-3 py-2 text-sm font-semibold text-slate-700 transition hover:border-slate-400"
                >
                  Batal
                </button>
              </div>
            </form>
          )}

          <div className="space-y-3 px-4 py-5 md:px-6">
            {loading && <div className="text-center text-slate-500">Memuat karyawan...</div>}
            {error && (
              <div className="rounded-xl border border-rose-200 bg-rose-50 px-4 py-3 text-rose-700">{error}</div>
            )}
            {!loading &&
              !error &&
              filtered.map((k) => (
                <div
                  key={k.id}
                  className="flex flex-col gap-3 rounded-xl border border-slate-200 bg-white px-4 py-3 shadow-sm md:flex-row md:items-center"
                >
                  <div className="flex items-center gap-3">
                    <div className="flex h-12 w-12 items-center justify-center rounded-xl bg-[#f2ebdf] text-base font-semibold text-slate-900 border border-slate-200">
                      {getInitials(k.nama)}
                    </div>
                    <div className="leading-snug">
                      <div className="text-base font-semibold text-[#d0382a]">{k.nama}</div>
                      <div className="text-sm text-slate-600">
                        {k.jabatan} <span className="text-slate-400">#{k.id}</span>
                      </div>
                      {k.kontak ? <div className="text-xs text-slate-500">HP: {k.kontak}</div> : null}
                    </div>
                  </div>

                  <div className="flex flex-1 flex-wrap items-center justify-start gap-3 md:justify-end">
                    <span
                      className={`rounded-full px-3 py-1 text-xs font-semibold ${
                        k.aktif ? "bg-emerald-100 text-emerald-700" : "bg-amber-100 text-amber-700"
                      }`}
                    >
                      {k.aktif ? "Aktif" : "Nonaktif"}
                    </span>
                    <button onClick={() => startEdit(k)} className="text-sm font-semibold text-blue-600 transition hover:text-blue-700">
                      Edit
                    </button>
                    <button
                      onClick={() => handleDelete(k.id)}
                      className="text-sm font-semibold text-amber-600 transition hover:text-amber-700"
                    >
                      Hapus
                    </button>
                    <button
                      onClick={() => setDetail(k)}
                      className="rounded-full bg-[#2563eb] px-4 py-1 text-sm font-semibold text-white transition hover:bg-[#1e4fc7]"
                    >
                      Tampil
                    </button>
                  </div>
                </div>
              ))}

            {!loading && !error && filtered.length === 0 && (
              <div className="rounded-xl border border-dashed border-slate-200 bg-slate-50 px-4 py-6 text-center text-slate-500">
                Tidak ada karyawan yang cocok dengan pencarian.
              </div>
            )}
          </div>
        </div>
      </div>

      {detail && (
        <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/40 px-4 py-6">
          <div className="w-full max-w-lg rounded-2xl bg-white shadow-2xl">
            <div className="flex items-center justify-between border-b border-slate-200 px-6 py-4">
              <div>
                <p className="text-xs font-semibold uppercase tracking-[0.2em] text-amber-600">Detail</p>
                <p className="text-lg font-bold text-slate-900">{detail.nama}</p>
                <p className="text-sm text-slate-500">
                  {detail.jabatan} <span className="text-slate-400">#{detail.id}</span>
                </p>
              </div>
              <button
                type="button"
                onClick={() => setDetail(null)}
                className="rounded-full border border-slate-200 px-3 py-1 text-xs font-semibold text-slate-700 hover:bg-slate-50"
              >
                Tutup
              </button>
            </div>

            <div className="space-y-3 px-6 py-5 text-sm text-slate-800">
              <div className="flex items-center gap-2">
                <span className="w-24 text-slate-500">Nama</span>
                <span className="font-semibold text-slate-900">{detail.nama}</span>
              </div>
              <div className="flex items-center gap-2">
                <span className="w-24 text-slate-500">Role</span>
                <span className="font-semibold text-slate-900">{detail.jabatan}</span>
              </div>
              <div className="flex items-center gap-2">
                <span className="w-24 text-slate-500">Nomor HP</span>
                <span className="font-semibold text-slate-900">{detail.kontak || "-"}</span>
              </div>
              <div className="flex items-center gap-2">
                <span className="w-24 text-slate-500">Status</span>
                <span
                  className={`rounded-full px-3 py-1 text-xs font-semibold ${
                    detail.aktif ? "bg-emerald-100 text-emerald-700" : "bg-amber-100 text-amber-700"
                  }`}
                >
                  {detail.aktif ? "Aktif" : "Nonaktif"}
                </span>
              </div>
            </div>
          </div>
        </div>
      )}
    </main>
  );
}
