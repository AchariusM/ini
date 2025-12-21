"use client";

import AppNavbar from "@/app/ui/app-navbar";
import { MenuUpload } from "@/app/ui/menu-upload";

export default function MenuUploadPage() {
  return (
    <main className="min-h-screen bg-[#f2ebdf] text-slate-900">
      <AppNavbar />
      <div className="max-w-3xl mx-auto px-4 pb-12 pt-8 space-y-6">
        <div className="rounded-2xl bg-white/95 border border-slate-200 shadow-xl p-6 space-y-4">
          <div>
            <p className="text-xs font-semibold uppercase tracking-[0.25em] text-amber-600">Menu</p>
            <h1 className="text-2xl font-bold text-slate-900">Upload CSV Menu</h1>
            <p className="text-sm text-slate-600">
              Format CSV: nama,harga,kategori,deskripsi,aktif. Delimiter koma atau titik koma diperbolehkan.
            </p>
          </div>
          <MenuUpload
            onSuccess={async () => {
              // no-op; page just for upload
            }}
          />
          <div className="flex flex-wrap gap-2 pt-2">
            <form
              action="/api/menu/upload?seed=default"
              method="post"
              className="flex items-center gap-2"
            >
              <button
                type="submit"
                className="rounded-lg bg-emerald-600 px-4 py-2 text-sm font-semibold text-white shadow-md transition hover:bg-emerald-500"
              >
                Isi dengan data contoh
              </button>
            </form>
          </div>
        </div>
      </div>
    </main>
  );
}
