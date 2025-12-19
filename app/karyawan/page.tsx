"use client";

import React, { useMemo, useState } from "react";
import { MagnifyingGlassIcon, PlusIcon } from "@heroicons/react/24/outline";
import AppNavbar from "../ui/app-navbar";

type Karyawan = {
  id: string;
  nama: string;
  jabatan: string;
  kontak: string;
  aktif: boolean;
};

const defaultData: Karyawan[] = [
  { id: "101", nama: "Robin San", jabatan: "Owner", kontak: "0812-1111-2222", aktif: true },
  { id: "102", nama: "Bolon Susanto", jabatan: "Head Chef", kontak: "0813-8888-9999", aktif: true },
  { id: "103", nama: "Rita Anggraini", jabatan: "Kasir", kontak: "0812-5555-1010", aktif: true },
];

const getInitials = (nama: string) =>
  nama
    .split(" ")
    .map((part) => part[0])
    .join("")
    .slice(0, 2)
    .toUpperCase();

export default function KaryawanPage() {
  const [data, setData] = useState<Karyawan[]>(defaultData);
  const [editing, setEditing] = useState<Karyawan | null>(null);
  const [form, setForm] = useState<Karyawan>({ id: "", nama: "", jabatan: "", kontak: "", aktif: true });
  const [query, setQuery] = useState("");
  const [showForm, setShowForm] = useState(false);

  const filtered = useMemo(
    () =>
      data.filter((item) => {
        const target = `${item.nama} ${item.jabatan} ${item.id}`.toLowerCase();
        return target.includes(query.toLowerCase());
      }),
    [data, query]
  );

  const reset = () => {
    setForm({ id: "", nama: "", jabatan: "", kontak: "", aktif: true });
    setEditing(null);
    setShowForm(false);
  };

  const submit = (e: React.FormEvent) => {
    e.preventDefault();
    if (!form.id || !form.nama || !form.jabatan) return;

    if (editing) {
      setData((prev) => prev.map((item) => (item.id === editing.id ? form : item)));
    } else {
      setData((prev) => [...prev, form]);
    }
    reset();
  };

  const handleDelete = (id: string) => {
    if (confirm("Hapus karyawan ini?")) {
      setData((prev) => prev.filter((i) => i.id !== id));
      if (editing?.id === id) reset();
    }
  };

  const handleToggle = (id: string) => {
    setData((prev) => prev.map((item) => (item.id === id ? { ...item, aktif: !item.aktif } : item)));
  };

  const startEdit = (item: Karyawan) => {
    setEditing(item);
    setForm(item);
    setShowForm(true);
  };

  const startAdd = () => {
    setEditing(null);
    setForm({ id: "", nama: "", jabatan: "", kontak: "", aktif: true });
    setShowForm(true);
  };

  return (
    <main className="min-h-screen bg-[#f2ebdf] text-slate-900">
      <AppNavbar />

      <div className="max-w-6xl mx-auto px-4 pb-12 pt-6 md:pt-10">
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
                value={form.id}
                onChange={(e) => setForm({ ...form, id: e.target.value })}
                placeholder="ID (cth: 104)"
                className="w-full rounded-lg border border-slate-300 bg-white px-3 py-2 text-sm text-slate-800 placeholder:text-slate-400 outline-none ring-2 ring-transparent transition focus:border-amber-300 focus:ring-amber-200"
              />
              <input
                value={form.nama}
                onChange={(e) => setForm({ ...form, nama: e.target.value })}
                placeholder="Nama"
                className="w-full rounded-lg border border-slate-300 bg-white px-3 py-2 text-sm text-slate-800 placeholder:text-slate-400 outline-none ring-2 ring-transparent transition focus:border-amber-300 focus:ring-amber-200"
              />
              <input
                value={form.jabatan}
                onChange={(e) => setForm({ ...form, jabatan: e.target.value })}
                placeholder="Jabatan"
                className="w-full rounded-lg border border-slate-300 bg-white px-3 py-2 text-sm text-slate-800 placeholder:text-slate-400 outline-none ring-2 ring-transparent transition focus:border-amber-300 focus:ring-amber-200"
              />
              <input
                value={form.kontak}
                onChange={(e) => setForm({ ...form, kontak: e.target.value })}
                placeholder="Kontak"
                className="w-full rounded-lg border border-slate-300 bg-white px-3 py-2 text-sm text-slate-800 placeholder:text-slate-400 outline-none ring-2 ring-transparent transition focus:border-amber-300 focus:ring-amber-200"
              />
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
            {filtered.map((k) => (
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
                  <button
                    onClick={() => startEdit(k)}
                    className="text-sm font-semibold text-blue-600 transition hover:text-blue-700"
                  >
                    Edit
                  </button>
                  <button
                    onClick={() => handleDelete(k.id)}
                    className="text-sm font-semibold text-amber-600 transition hover:text-amber-700"
                  >
                    Hapus
                  </button>
                  <button
                    onClick={() => handleToggle(k.id)}
                    className={`rounded-full px-4 py-1 text-sm font-semibold transition ${
                      k.aktif
                        ? "bg-[#2563eb] text-white hover:bg-[#1e4fc7]"
                        : "bg-slate-400 text-white hover:bg-slate-500"
                    }`}
                  >
                    Tampil
                  </button>
                </div>
              </div>
            ))}

            {filtered.length === 0 && (
              <div className="rounded-xl border border-dashed border-white/10 bg-[#1f2940]/80 px-4 py-6 text-center text-slate-300">
                Tidak ada karyawan yang cocok dengan pencarian.
              </div>
            )}
          </div>
        </div>
      </div>
    </main>
  );
}
