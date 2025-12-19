"use client";

import { useState, useEffect, type FormEvent } from "react";
import { useRouter } from "next/navigation";
import Image from "next/image";

export default function LoginPage() {
  const [username, setUsername] = useState("");
  const [password, setPassword] = useState("");
  const [error, setError] = useState("");
  const router = useRouter();

  const handleSubmit = async (e: FormEvent) => {
    e.preventDefault();
    setError("");

    if (!username || !password) {
      setError("Username dan password wajib diisi!");
      return;
    }

    try {
      const res = await fetch("/api/login", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ username, password }),
      });

      const contentType = res.headers.get("content-type") ?? "";
      if (!contentType.includes("application/json")) {
        const text = await res.text();
        console.error("Login response is not JSON:", res.status, text);
        setError("Server mengembalikan respons tidak valid.");
        return;
      }

      const data = await res.json();

      if (!res.ok || !data.success) {
        setError(data?.error ?? data?.message ?? "Server error.");
        return;
      }

      localStorage.setItem("login", "true");
      if (data.role) localStorage.setItem("role", String(data.role));

      router.replace("/dashboard");
    } catch (err) {
      console.error(err);
      setError("Terjadi kesalahan pada server.");
    }
  };

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
        <div className="absolute inset-0 bg-black/65 backdrop-blur-[3px]" />
      </div>

      <div className="relative z-10 flex items-center justify-center min-h-screen px-4">
        <div className="w-full max-w-lg bg-black/75 border border-white/10 rounded-3xl shadow-[0_20px_60px_rgba(0,0,0,0.55)] backdrop-blur-xl p-8 md:p-10 space-y-8">
          <div className="flex flex-col items-center gap-2">
            <div className="relative w-16 h-16 rounded-full overflow-hidden border border-white/30 shadow-lg">
              <Image src="/logooyako.jpeg" alt="Warung Oyako" fill sizes="64px" className="object-cover" />
            </div>
            <h1 className="text-3xl font-extrabold tracking-wide">SIKP</h1>
            <p className="text-sm text-white/80 text-center">
              Sistem Informasi Kepuasan Pelanggan
            </p>
          </div>

          <form onSubmit={handleSubmit} className="space-y-6">
            <h2 className="text-2xl font-semibold text-center">Masuk</h2>

            <div className="space-y-2">
              <label className="block text-sm text-white/80">Username</label>
              <input
                type="text"
                placeholder="Masukkan username"
                value={username}
                onChange={(e) => setUsername(e.target.value)}
                className="w-full rounded-lg border border-white/20 bg-black/30 px-3 py-3 text-white placeholder-white/50 focus:outline-none focus:ring-2 focus:ring-emerald-400/70 focus:border-emerald-400/60"
              />
            </div>

            <div className="space-y-2">
              <label className="block text-sm text-white/80">Password</label>
              <input
                type="password"
                placeholder="Masukkan password"
                value={password}
                onChange={(e) => setPassword(e.target.value)}
                className="w-full rounded-lg border border-white/20 bg-black/30 px-3 py-3 text-white placeholder-white/50 focus:outline-none focus:ring-2 focus:ring-emerald-400/70 focus:border-emerald-400/60"
              />
            </div>

            {error && (
              <div className="bg-red-600/85 text-white text-sm p-2 rounded text-center border border-red-500/40">
                {error}
              </div>
            )}

            <button
              type="submit"
              className="w-full bg-emerald-500 hover:bg-emerald-400 text-black font-semibold py-3 rounded-lg shadow-lg transition transform hover:-translate-y-[1px]"
            >
              Masuk
            </button>
          </form>
        </div>
      </div>
    </main>
  );
}
