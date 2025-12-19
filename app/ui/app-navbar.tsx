"use client";

import Image from "next/image";
import Link from "next/link";
import { useEffect, useState } from "react";
import { usePathname } from "next/navigation";

const NAV_ITEMS = [
  { title: "Menu", href: "/menu" },
  { title: "Karyawan", href: "/karyawan" },
  { title: "Laporan", href: "/laporan" },
  { title: "Feedback", href: "/laporan/feedback" },
];

export default function AppNavbar() {
  const [role, setRole] = useState<string>("Owner");
  const [open, setOpen] = useState(false);
  const pathname = usePathname();

  useEffect(() => {
    const saved = (typeof window !== "undefined" && localStorage.getItem("role")) || "";
    if (saved) setRole(saved);
  }, []);

  return (
    <header className="relative z-20 flex items-center justify-between px-4 md:px-10 py-3 bg-[#2f2e2c] text-white">
      <div className="flex items-center gap-3">
        <div className="relative w-12 h-12 rounded-full overflow-hidden border border-white/30 shadow">
          <Image src="/logooyako.jpeg" alt="Warung Oyako" fill sizes="48px" className="object-cover" />
        </div>
      </div>

      <nav className="flex-1 flex justify-center">
        <div className="flex items-center gap-6 text-xs md:text-sm font-semibold tracking-[0.15em] uppercase">
          {NAV_ITEMS.map((item) => {
            const active = pathname.startsWith(item.href);
            return (
              <Link
                key={item.title}
                href={item.href}
                className={`px-2 py-1 transition ${
                  active ? "text-amber-200" : "text-white/85 hover:text-white"
                }`}
              >
                {item.title}
              </Link>
            );
          })}
        </div>
      </nav>

      <div className="relative">
        <button
          onClick={() => setOpen((v) => !v)}
          className="flex items-center gap-2 bg-transparent border border-white/30 px-4 py-2 rounded-full text-sm font-semibold hover:bg-white/10 transition"
        >
          {role || "Owner"}
          <span aria-hidden className={`transform transition ${open ? "rotate-180" : ""}`}>⌄</span>
        </button>

        {open && (
          <div className="absolute right-0 mt-2 w-48 bg-white text-gray-900 rounded-xl shadow-2xl border border-black/10 overflow-hidden">
            <div className="px-4 py-3 text-sm border-b border-gray-200">Role: {role || "Owner"}</div>
            <button
              onClick={() => {
                localStorage.removeItem("login");
                localStorage.removeItem("role");
                window.location.href = "/login";
              }}
              className="w-full text-left px-4 py-3 text-sm hover:bg-gray-100 flex items-center gap-2"
            >
              <span aria-hidden>⎋</span>
              Logout
            </button>
          </div>
        )}
      </div>
    </header>
  );
}
