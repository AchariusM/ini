"use client";

import { useEffect, useMemo, useState } from "react";
import { MagnifyingGlassIcon, PlusIcon, PencilSquareIcon, TrashIcon, TagIcon } from "@heroicons/react/24/outline";
import AppNavbar from "../ui/app-navbar";

type MenuItem = {
  id: number;
  nama: string;
  harga: number;
  kategori?: string | null;
  deskripsi?: string | null;
  aktif: boolean;
};

const formatRupiah = (nilai: number) => `Rp ${nilai.toLocaleString("id-ID")}`;

export default function MenuPage() {
  const [items, setItems] = useState<MenuItem[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [editing, setEditing] = useState<MenuItem | null>(null);
  const [form, setForm] = useState<Omit<MenuItem, "id">>({
    nama: "",
    harga: 0,
    kategori: "",
    deskripsi: "",
    aktif: true,
  });
  const [query, setQuery] = useState("");
  const [selectedKategori, setSelectedKategori] = useState("Semua");
  const [showForm, setShowForm] = useState(false);

  const fetchMenu = async () => {
    try {
      setLoading(true);
      const res = await fetch("/api/menu");
      if (!res.ok) throw new Error("Gagal memuat menu");
      const data = await res.json();
      setItems(data);
      setError(null);
    } catch (err: any) {
      setError(err.message || "Gagal memuat menu");
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchMenu();
  }, []);

  const kategoriList = useMemo(() => {
    const set = new Set(items.map((i) => i.kategori).filter(Boolean) as string[]);
    return ["Semua", ...Array.from(set)];
  }, [items]);

  const filtered = useMemo(
    () =>
      items.filter((item) => {
        const matchesKategori =
          selectedKategori === "Semua" || (item.kategori || "").toLowerCase() === selectedKategori.toLowerCase();
        const matchesQuery = `${item.nama} ${item.kategori || ""} ${item.deskripsi || ""}`
          .toLowerCase()
          .includes(query.toLowerCase());
        return matchesKategori && matchesQuery;
      }),
    [items, query, selectedKategori]
  );

  const resetForm = () => {
    setForm({ nama: "", harga: 0, kategori: "", deskripsi: "", aktif: true });
    setEditing(null);
    setShowForm(false);
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!form.nama || !form.harga) return;
    try {
      const payload = { ...form, harga: Number(form.harga) };
      if (editing) {
        const res = await fetch(`/api/menu/${editing.id}`, {
          method: "PUT",
          headers: { "Content-Type": "application/json" },
          body: JSON.stringify(payload),
        });
        if (!res.ok) throw new Error("Gagal update menu");
        const data = await res.json();
        setItems((prev) => prev.map((item) => (item.id === editing.id ? data : item)));
      } else {
        const res = await fetch("/api/menu", {
          method: "POST",
          headers: { "Content-Type": "application/json" },
          body: JSON.stringify(payload),
        });
        if (!res.ok) throw new Error("Gagal tambah menu");
        const data = await res.json();
        setItems((prev) => [data, ...prev]);
      }
      resetForm();
    } catch (err: any) {
      alert(err.message || "Gagal menyimpan menu");
    }
  };

  const handleEdit = (item: MenuItem) => {
    setEditing(item);
    setForm({
      nama: item.nama,
      harga: item.harga,
      kategori: item.kategori || "",
      deskripsi: item.deskripsi || "",
      aktif: item.aktif,
    });
    setShowForm(true);
  };

  const handleDelete = async (id: number) => {
    if (!confirm("Hapus menu ini?")) return;
    try {
      const res = await fetch(`/api/menu/${id}`, { method: "DELETE" });
      if (!res.ok) throw new Error("Gagal menghapus menu");
      setItems((prev) => prev.filter((i) => i.id !== id));
    } catch (err: any) {
      alert(err.message || "Gagal menghapus menu");
    }
  };

  return (
    <main className="min-h-screen bg-[#f2ebdf] text-slate-900">
      <AppNavbar />

      <div className="mx-auto max-w-7xl px-4 pb-12 pt-6 md:pt-10">
        <div className="rounded-2xl border border-slate-200 bg-white/95 shadow-xl">
          <div className="flex flex-col gap-4 border-b border-slate-200 px-6 py-5 md:flex-row md:items-center md:justify-between">
            <div>
              <p className="text-xs font-semibold uppercase tracking-[0.25em] text-amber-600">Menu</p>
              <h1 className="text-3xl font-bold text-slate-900">Daftar Menu Warung Oyako</h1>
            </div>
            <div className="flex w-full flex-col gap-3 md:w-auto md:flex-row md:items-center">
              <div className="relative w-full md:w-80">
                <MagnifyingGlassIcon className="pointer-events-none absolute left-3 top-1/2 h-5 w-5 -translate-y-1/2 text-slate-400" />
                <input
                  value={query}
                  onChange={(e) => setQuery(e.target.value)}
                  placeholder="Cari menu..."
                  className="w-full rounded-lg border border-slate-300 bg-white px-10 py-2 text-sm text-slate-800 placeholder:text-slate-400 outline-none ring-2 ring-transparent transition focus:border-amber-300 focus:ring-amber-200"
                />
              </div>
              <button
                onClick={() => {
                  resetForm();
                  setShowForm(true);
                }}
                className="inline-flex items-center justify-center gap-2 rounded-lg bg-[#c41c24] px-4 py-2 text-sm font-semibold text-white shadow-md shadow-[#c41c24]/25 transition hover:bg-[#aa171f] active:scale-[0.99]"
              >
                <PlusIcon className="h-5 w-5" />
                Tambah
              </button>
            </div>
          </div>

          <div className="flex flex-wrap gap-3 px-6 py-4">
            {kategoriList.map((kat) => (
              <button
                key={kat}
                onClick={() => setSelectedKategori(kat)}
                className={`rounded-full px-4 py-2 text-sm font-semibold transition ${
                  selectedKategori === kat
                    ? "bg-emerald-500 text-white shadow-md shadow-emerald-500/25"
                    : "bg-slate-200 text-slate-700 hover:bg-slate-300"
                }`}
              >
                {kat}
              </button>
            ))}
          </div>

          {showForm && (
            <form
              onSubmit={handleSubmit}
              className="grid gap-3 border-y border-slate-200 bg-slate-50 px-6 py-4 md:grid-cols-6 md:items-end"
            >
              <input
                value={form.nama}
                onChange={(e) => setForm({ ...form, nama: e.target.value })}
                placeholder="Nama menu"
                className="w-full rounded-lg border border-slate-300 bg-white px-3 py-2 text-sm text-slate-800 placeholder:text-slate-400 outline-none ring-2 ring-transparent transition focus:border-amber-300 focus:ring-amber-200"
              />
              <input
                type="number"
                value={form.harga}
                onChange={(e) => setForm({ ...form, harga: Number(e.target.value) })}
                placeholder="Harga"
                className="w-full rounded-lg border border-slate-300 bg-white px-3 py-2 text-sm text-slate-800 placeholder:text-slate-400 outline-none ring-2 ring-transparent transition focus:border-amber-300 focus:ring-amber-200"
              />
              <input
                value={form.kategori || ""}
                onChange={(e) => setForm({ ...form, kategori: e.target.value })}
                placeholder="Kategori"
                className="w-full rounded-lg border border-slate-300 bg-white px-3 py-2 text-sm text-slate-800 placeholder:text-slate-400 outline-none ring-2 ring-transparent transition focus:border-amber-300 focus:ring-amber-200"
              />
              <input
                value={form.deskripsi || ""}
                onChange={(e) => setForm({ ...form, deskripsi: e.target.value })}
                placeholder="Deskripsi singkat"
                className="w-full rounded-lg border border-slate-300 bg-white px-3 py-2 text-sm text-slate-800 placeholder:text-slate-400 outline-none ring-2 ring-transparent transition focus:border-amber-300 focus:ring-amber-200"
              />
              <label className="flex items-center gap-2 text-sm text-slate-700">
                <input
                  type="checkbox"
                  checked={form.aktif}
                  onChange={(e) => setForm({ ...form, aktif: e.target.checked })}
                />
                Aktif
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
                  onClick={resetForm}
                  className="inline-flex items-center justify-center rounded-lg border border-slate-300 bg-white px-3 py-2 text-sm font-semibold text-slate-700 transition hover:border-slate-400"
                >
                  Batal
                </button>
              </div>
            </form>
          )}

          <div className="grid grid-cols-1 gap-5 px-4 py-6 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4">
            {loading && <div className="col-span-full text-center text-slate-500">Memuat menu...</div>}
            {error && (
              <div className="col-span-full rounded-xl border border-rose-200 bg-rose-50 px-4 py-3 text-rose-700">
                {error}
              </div>
            )}
            {!loading &&
              !error &&
              filtered.map((item) => (
                <div key={item.id} className="flex h-full flex-col rounded-2xl border border-slate-200 bg-white shadow-sm">
                  <div className="relative h-32 w-full overflow-hidden rounded-t-2xl bg-slate-200/80" />

                  <div className="flex flex-1 flex-col gap-2 px-4 py-3">
                    <div className="text-lg font-semibold text-[#d0382a]">{item.nama}</div>
                    <div className="text-base font-semibold text-emerald-600">{formatRupiah(item.harga)}</div>
                    <div className="flex items-center gap-2 text-sm text-emerald-700">
                      <TagIcon className="h-4 w-4" />
                      <span>{item.kategori || "-"}</span>
                    </div>
                    <p className="text-sm text-slate-600">{item.deskripsi || "-"}</p>
                    <div className="mt-auto border-t border-slate-200 pt-3">
                      <div className="flex items-center justify-end gap-3">
                        <button
                          onClick={() => handleEdit(item)}
                          className="rounded-full p-2 text-amber-600 transition hover:bg-amber-100 hover:text-amber-700"
                          title="Edit"
                        >
                          <PencilSquareIcon className="h-5 w-5" />
                        </button>
                        <button
                          onClick={() => handleDelete(item.id)}
                          className="rounded-full p-2 text-rose-600 transition hover:bg-rose-100 hover:text-rose-700"
                          title="Hapus"
                        >
                          <TrashIcon className="h-5 w-5" />
                        </button>
                      </div>
                    </div>
                  </div>
                </div>
              ))}

            {!loading && !error && filtered.length === 0 && (
              <div className="col-span-full rounded-xl border border-dashed border-slate-200 bg-slate-50 px-4 py-6 text-center text-slate-500">
                Tidak ada menu yang cocok dengan pencarian atau kategori.
              </div>
            )}
          </div>
        </div>
      </div>
    </main>
  );
}
