"use client";

import { useCallback, useState } from "react";

type MenuCsvRow = { nama: string; harga: number; kategori?: string | null; deskripsi?: string | null; aktif: boolean };
type Props = { onSuccess?: (inserted: number) => void };

export function MenuUpload({ onSuccess }: Props) {
  const [uploading, setUploading] = useState(false);
  const [message, setMessage] = useState<string | null>(null);
  const [error, setError] = useState<string | null>(null);
  const [dragOver, setDragOver] = useState(false);

  const resetState = () => {
    setMessage(null);
    setError(null);
  };

  const sendData = async (file: File) => {
    const formData = new FormData();
    formData.append("file", file);
    const res = await fetch("/api/menu/upload", {
      method: "POST",
      body: formData,
    });
    const json = await res.json();
    if (!res.ok) throw new Error(json.error || "Gagal upload");
    return json.inserted as number;
  };

  const handleFile = useCallback(
    async (file: File) => {
      if (!file.name.toLowerCase().endsWith(".csv")) {
        setError("Hanya file .csv yang diizinkan");
        return;
      }
      resetState();
      setUploading(true);
      try {
        const inserted = await sendData(file);
        setMessage(`Import berhasil. Inserted: ${inserted}`);
        onSuccess?.(inserted);
      } catch (err: any) {
        setError(err.message || "Gagal upload");
      } finally {
        setUploading(false);
      }
    },
    [onSuccess]
  );

  const onDrop = (e: React.DragEvent<HTMLDivElement>) => {
    e.preventDefault();
    setDragOver(false);
    const file = e.dataTransfer.files?.[0];
    if (file) handleFile(file);
  };

  const onSelect = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (file) handleFile(file);
  };

  return (
    <div className="space-y-4">
      <div
        onDragOver={(e) => {
          e.preventDefault();
          setDragOver(true);
        }}
        onDragLeave={() => setDragOver(false)}
        onDrop={onDrop}
        className={`flex flex-col items-center justify-center rounded-2xl border-2 border-dashed px-6 py-10 text-center transition ${
          dragOver ? "border-amber-500 bg-amber-50" : "border-slate-300 bg-white"
        }`}
      >
        <p className="text-lg font-semibold text-slate-800">Drag & Drop CSV di sini</p>
        <p className="text-sm text-slate-500">
          atau klik untuk memilih file .csv (header: nama,harga,kategori,deskripsi,aktif)
        </p>
        <label className="mt-4 inline-flex items-center gap-2 rounded-lg border border-slate-300 bg-white px-4 py-2 text-sm font-semibold text-slate-700 shadow-sm transition hover:border-slate-400 cursor-pointer">
          Pilih CSV
          <input type="file" accept=".csv" className="hidden" onChange={onSelect} disabled={uploading} />
        </label>
      </div>

      {uploading && <div className="text-sm text-slate-500">Mengunggah...</div>}
      {message && <div className="rounded-lg border border-emerald-200 bg-emerald-50 px-4 py-2 text-emerald-700">{message}</div>}
      {error && <div className="rounded-lg border border-rose-200 bg-rose-50 px-4 py-2 text-rose-700">{error}</div>}
    </div>
  );
}
