"use client";

import React, { useMemo, useState } from "react";
import {
  MagnifyingGlassIcon,
  PlusIcon,
  PencilSquareIcon,
  TrashIcon,
  TagIcon,
} from "@heroicons/react/24/outline";
import AppNavbar from "../ui/app-navbar";

type MenuItem = {
  id: string;
  nama: string;
  harga: number;
  kategori: string;
  deskripsi: string;
  gambar?: string;
  aktif: boolean;
};

const initialMenu: MenuItem[] = [
  // Nasi
  { id: "N-01", nama: "Gyudon", harga: 39000, kategori: "Nasi", deskripsi: "Nasi dengan irisan daging sapi.", aktif: true },
  { id: "N-02", nama: "Omurice", harga: 29000, kategori: "Nasi", deskripsi: "Nasi goreng dibungkus telur omelet.", aktif: true },
  { id: "N-03", nama: "Katsudon", harga: 37000, kategori: "Nasi", deskripsi: "Nasi dengan katsu ayam dan telur.", aktif: true },
  { id: "N-04", nama: "Oyakodon", harga: 26000, kategori: "Nasi", deskripsi: "Nasi dengan ayam dan telur lembut.", aktif: true },
  { id: "N-05", nama: "Nasi katsu ayam", harga: 26000, kategori: "Nasi", deskripsi: "Nasi dengan katsu ayam.", aktif: true },
  { id: "N-06", nama: "Nasi katsu dori", harga: 28000, kategori: "Nasi", deskripsi: "Nasi dengan katsu dori.", aktif: true },
  { id: "N-07", nama: "Nasi karage ayam", harga: 25000, kategori: "Nasi", deskripsi: "Nasi dengan karage ayam.", aktif: true },
  { id: "N-08", nama: "Nasi karage dori", harga: 27000, kategori: "Nasi", deskripsi: "Nasi dengan karage dori.", aktif: true },
  { id: "N-09", nama: "Nasi kare Jepang", harga: 25000, kategori: "Nasi", deskripsi: "Nasi kare khas Jepang.", aktif: true },
  { id: "N-10", nama: "Nasi katsu kare ayam", harga: 34000, kategori: "Nasi", deskripsi: "Nasi kare dengan katsu ayam.", aktif: true },
  { id: "N-11", nama: "Nasi katsu kare dori", harga: 37000, kategori: "Nasi", deskripsi: "Nasi kare dengan katsu dori.", aktif: true },
  { id: "N-12", nama: "Nasi karage kare ayam", harga: 32000, kategori: "Nasi", deskripsi: "Nasi kare dengan karage ayam.", aktif: true },
  { id: "N-13", nama: "Nasi karage kare dori", harga: 35000, kategori: "Nasi", deskripsi: "Nasi kare dengan karage dori.", aktif: true },

  // Yakitori (isi 4)
  { id: "Y-01", nama: "Kawa", harga: 22000, kategori: "Yakitori", deskripsi: "Yakitori kulit (isi 4 tusuk).", aktif: true },
  { id: "Y-02", nama: "Tsukune", harga: 24000, kategori: "Yakitori", deskripsi: "Yakitori bakso ayam (isi 4 tusuk).", aktif: true },
  { id: "Y-03", nama: "Momo", harga: 24000, kategori: "Yakitori", deskripsi: "Yakitori paha ayam (isi 4 tusuk).", aktif: true },
  { id: "Y-04", nama: "Mix yakitori", harga: 23000, kategori: "Yakitori", deskripsi: "Paket mix yakitori (isi 4 tusuk).", aktif: true },

  // Snack
  { id: "S-01", nama: "Gyoza", harga: 20000, kategori: "Snack", deskripsi: "Gyoza isi 4 per porsi.", aktif: true },
  { id: "S-02", nama: "Tamagoyaki", harga: 18000, kategori: "Snack", deskripsi: "Tamagoyaki 8 potong per porsi.", aktif: true },
  { id: "S-03", nama: "Katsu ala carte ayam", harga: 20000, kategori: "Snack", deskripsi: "Katsu ayam tanpa nasi.", aktif: true },
  { id: "S-04", nama: "Katsu ala carte dori", harga: 22000, kategori: "Snack", deskripsi: "Katsu dori tanpa nasi.", aktif: true },
  { id: "S-05", nama: "Karage ayam", harga: 21000, kategori: "Snack", deskripsi: "Karage ayam renyah.", aktif: true },
  { id: "S-06", nama: "Karage dori", harga: 23000, kategori: "Snack", deskripsi: "Karage dori renyah.", aktif: true },

  // Minuman
  { id: "M-01", nama: "Ocha", harga: 5000, kategori: "Minuman", deskripsi: "Teh ocha.", aktif: true },
  { id: "M-02", nama: "Es teh", harga: 5000, kategori: "Minuman", deskripsi: "Es teh manis.", aktif: true },
  { id: "M-03", nama: "Es jeruk nipis", harga: 10000, kategori: "Minuman", deskripsi: "Es jeruk nipis segar.", aktif: true },
  { id: "M-04", nama: "Es teh jeruk nipis", harga: 12000, kategori: "Minuman", deskripsi: "Perpaduan teh dan jeruk nipis.", aktif: true },
  { id: "M-05", nama: "Air putih", harga: 4000, kategori: "Minuman", deskripsi: "Air mineral gelas.", aktif: true },
  { id: "M-06", nama: "Air mineral botol", harga: 8000, kategori: "Minuman", deskripsi: "Air mineral botol.", aktif: true },
  { id: "M-07", nama: "Purrin", harga: 16000, kategori: "Minuman", deskripsi: "Puding purrin dingin.", aktif: true },
];

const formatRupiah = (nilai: number) =>
  `Rp ${nilai.toLocaleString("id-ID")}`;

export default function MenuPage() {
  const [items, setItems] = useState<MenuItem[]>(initialMenu);
  const [editing, setEditing] = useState<MenuItem | null>(null);
  const [form, setForm] = useState<MenuItem>({
    id: "",
    nama: "",
    harga: 0,
    kategori: "",
    deskripsi: "",
    gambar: "",
    aktif: true,
  });
  const [query, setQuery] = useState("");
  const [selectedKategori, setSelectedKategori] = useState("Semua");
  const [showForm, setShowForm] = useState(false);

  const kategoriList = useMemo(() => {
    const set = new Set(items.map((i) => i.kategori));
    return ["Semua", ...Array.from(set)];
  }, [items]);

  const filtered = useMemo(
    () =>
      items.filter((item) => {
        const matchesKategori =
          selectedKategori === "Semua" || item.kategori === selectedKategori;
        const matchesQuery = `${item.nama} ${item.kategori} ${item.deskripsi}`
          .toLowerCase()
          .includes(query.toLowerCase());
        return matchesKategori && matchesQuery;
      }),
    [items, query, selectedKategori]
  );

  const resetForm = () => {
    setForm({ id: "", nama: "", harga: 0, kategori: "", deskripsi: "", gambar: "", aktif: true });
    setEditing(null);
    setShowForm(false);
  };

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (!form.id || !form.nama || !form.kategori || !form.harga) return;

    if (editing) {
      setItems((prev) => prev.map((item) => (item.id === editing.id ? form : item)));
    } else {
      setItems((prev) => [...prev, form]);
    }
    resetForm();
  };

  const handleEdit = (item: MenuItem) => {
    setEditing(item);
    setForm(item);
    setShowForm(true);
  };

  const handleDelete = (id: string) => {
    if (confirm("Hapus menu ini?")) {
      setItems((prev) => prev.filter((i) => i.id !== id));
      if (editing?.id === id) resetForm();
    }
  };

  const handleAdd = () => {
    setEditing(null);
    setForm({ id: "", nama: "", harga: 0, kategori: "", deskripsi: "", gambar: "", aktif: true });
    setShowForm(true);
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
                onClick={handleAdd}
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
                value={form.id}
                onChange={(e) => setForm({ ...form, id: e.target.value })}
                placeholder="Kode (cth: M-09)"
                className="w-full rounded-lg border border-slate-300 bg-white px-3 py-2 text-sm text-slate-800 placeholder:text-slate-400 outline-none ring-2 ring-transparent transition focus:border-amber-300 focus:ring-amber-200"
              />
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
                value={form.kategori}
                onChange={(e) => setForm({ ...form, kategori: e.target.value })}
                placeholder="Kategori"
                className="w-full rounded-lg border border-slate-300 bg-white px-3 py-2 text-sm text-slate-800 placeholder:text-slate-400 outline-none ring-2 ring-transparent transition focus:border-amber-300 focus:ring-amber-200"
              />
              <input
                value={form.deskripsi}
                onChange={(e) => setForm({ ...form, deskripsi: e.target.value })}
                placeholder="Deskripsi singkat"
                className="w-full rounded-lg border border-slate-300 bg-white px-3 py-2 text-sm text-slate-800 placeholder:text-slate-400 outline-none ring-2 ring-transparent transition focus:border-amber-300 focus:ring-amber-200"
              />
              <input
                value={form.gambar}
                onChange={(e) => setForm({ ...form, gambar: e.target.value })}
                placeholder="URL gambar (opsional)"
                className="w-full rounded-lg border border-slate-300 bg-white px-3 py-2 text-sm text-slate-800 placeholder:text-slate-400 outline-none ring-2 ring-transparent transition focus:border-amber-300 focus:ring-amber-200"
              />
              <div className="flex gap-2 md:col-span-2 md:col-start-5 md:justify-end">
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
            {filtered.map((item) => (
              <div
                key={item.id}
                className="flex h-full flex-col rounded-2xl border border-slate-200 bg-white shadow-sm"
              >
                <div className="relative h-32 w-full overflow-hidden rounded-t-2xl bg-slate-200/80">
                  {item.gambar ? (
                    // eslint-disable-next-line @next/next/no-img-element
                    <img
                      src={item.gambar}
                      alt={item.nama}
                      className="h-full w-full object-cover"
                    />
                  ) : (
                    <div className="flex h-full items-center justify-center text-sm text-slate-500">Gambar</div>
                  )}
                </div>

                <div className="flex flex-1 flex-col gap-2 px-4 py-3">
                  <div className="text-lg font-semibold text-[#d0382a]">{item.nama}</div>
                  <div className="text-base font-semibold text-emerald-600">{formatRupiah(item.harga)}</div>
                  <div className="flex items-center gap-2 text-sm text-emerald-700">
                    <TagIcon className="h-4 w-4" />
                    <span>{item.kategori}</span>
                  </div>
                  <p className="text-sm text-slate-600">{item.deskripsi}</p>
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

            {filtered.length === 0 && (
              <div className="col-span-full rounded-xl border border-dashed border-white/10 bg-[#1d2738]/80 px-4 py-6 text-center text-slate-300">
                Tidak ada menu yang cocok dengan pencarian atau kategori.
              </div>
            )}
          </div>
        </div>
      </div>
    </main>
  );
}
