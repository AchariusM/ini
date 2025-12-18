'use client';

import AcmeLogo from '@/app/ui/logorangga';
import Link from 'next/link';
import { usePathname } from 'next/navigation';
import { ChevronDownIcon } from '@heroicons/react/24/outline';

export default function Layout({ children }: { children: React.ReactNode }) {
  const pathname = usePathname();
  const navLinks = [
    { href: '/user/kasir/sisa', label: 'Sisa' },
    { href: '/stok_awal', label: 'Stok' },
  ];

  return (
    <div className="min-h-screen flex flex-col bg-[#f4efe6] text-neutral-900">
      <header className="fixed top-0 w-full z-50 border-b border-white/10 bg-neutral-950/85 backdrop-blur-md">
        <div className="flex items-center justify-between px-6 py-3">
          <div className="flex items-center gap-3">
            <div className="w-12 h-12 rounded-full overflow-hidden border border-white/20 shadow-lg">
              <AcmeLogo />
            </div>
          </div>

          <nav className="flex items-center gap-6 text-xs sm:text-sm">
            {navLinks.map((link) => (
              <Link
                key={link.href}
                href={link.href}
                className={`uppercase tracking-[0.2em] transition-colors ${
                  pathname === link.href
                    ? 'text-white'
                    : 'text-white/70 hover:text-white'
                }`}
              >
                {link.label}
              </Link>
            ))}
          </nav>

          <button
            type="button"
            className="flex items-center gap-2 rounded-full border border-white/20 bg-white/10 px-4 py-2 text-xs sm:text-sm text-white/90 hover:bg-white/20 transition"
          >
            Kasir
            <ChevronDownIcon className="w-4 h-4" />
          </button>
        </div>
      </header>

      <main className="pt-24 px-6 sm:px-10 flex-1">{children}</main>
    </div>
  );
}
