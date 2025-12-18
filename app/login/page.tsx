"use client";

import { useState, useEffect, type FormEvent } from "react";
import { useRouter } from "next/navigation";
import Image from "next/image";

export default function LoginPage() {
  const [username, setUsername] = useState("");
  const [password, setPassword] = useState("");
  const [captcha, setCaptcha] = useState("");
  const [inputCaptcha, setInputCaptcha] = useState("");
  const [error, setError] = useState("");
  const router = useRouter();

  const generateCaptcha = () => {
    const chars = "ABCDEFGHIJKLMNOPQRSTUVWXYZabcdefghijklmnopqrstuvwxyz0123456789";
    let code = "";
    for (let i = 0; i < 5; i++) {
      code += chars.charAt(Math.floor(Math.random() * chars.length));
    }
    setCaptcha(code);
  };

  useEffect(() => {
    generateCaptcha();
  }, []);

  const handleSubmit = async (e: FormEvent) => {
    e.preventDefault();
    setError("");

    if (!username || !password) {
      setError("Username dan password wajib diisi!");
      return;
    }

    if (inputCaptcha !== captcha) {
      setError("Captcha salah!");
      generateCaptcha();
      setInputCaptcha("");
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

      if (!res.ok) {
        setError(data?.message ?? "Server error.");
        return;
      }

      if (!data.success) {
        setError(data.message);
        return;
      }

      localStorage.setItem("login", "true");

      const role = (data.role as string | undefined)?.toUpperCase();
      if (role === "OWNER") router.replace("/user/HK");
      else if (role === "KASIR") router.replace("/user/kasir");
      else if (role === "HEAD_KITCHEN") router.replace("/user/HK");
      else router.replace("/");
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

            <div className="space-y-2">
              <label className="block text-sm text-white/80">Captcha</label>
              <div className="flex items-center gap-3">
                <div className="bg-emerald-600 text-white font-bold px-4 py-2 rounded select-none tracking-wider shadow">
                  {captcha}
                </div>
                <button
                  type="button"
                  onClick={generateCaptcha}
                  className="text-emerald-300 hover:text-emerald-200 text-lg"
                  aria-label="Muat ulang captcha"
                >
                  Reload
                </button>
              </div>
              <input
                type="text"
                placeholder="Masukkan captcha"
                value={inputCaptcha}
                onChange={(e) => setInputCaptcha(e.target.value)}
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
