"use client";

import Link from "next/link";
import { useEffect, useState } from "react";

export default function Navbar() {
  const [user, setUser] = useState<any>(null);
  const [open, setOpen] = useState(false);

  useEffect(() => {
    fetch("/api/auth/me")
      .then((r) => r.json())
      .then((d) => setUser(d.user))
      .catch(() => {});
  }, []);

  const logout = async () => {
    await fetch("/api/auth/logout", { method: "POST" });
    window.location.href = "/";
  };

  return (
    <header className="sticky top-0 z-50 border-b border-slate-200 bg-white/80 backdrop-blur">
      <div className="mx-auto flex h-16 max-w-7xl items-center justify-between px-4">
        <Link href="/" className="flex items-center gap-2">
          <span className="flex h-9 w-9 items-center justify-center rounded-xl bg-brand-600 text-lg font-bold text-white">
            T
          </span>
          <span className="text-lg font-bold tracking-tight">TapReview</span>
        </Link>
        <nav className="hidden items-center gap-6 text-sm font-medium text-slate-600 md:flex">
          <Link href="/#cara-kerja" className="hover:text-slate-900">Cara Kerja</Link>
          <Link href="/#harga" className="hover:text-slate-900">Harga</Link>
          <Link href="/#faq" className="hover:text-slate-900">FAQ</Link>
        </nav>
        <div className="flex items-center gap-2">
          {user ? (
            <>
              <Link
                href={user.role === "admin" ? "/admin" : "/dashboard"}
                className="rounded-lg bg-slate-100 px-4 py-2 text-sm font-semibold text-slate-700 hover:bg-slate-200"
              >
                Dashboard
              </Link>
              <button onClick={logout} className="rounded-lg px-3 py-2 text-sm font-medium text-slate-500 hover:text-slate-800">
                Keluar
              </button>
            </>
          ) : (
            <>
              <Link href="/masuk" className="rounded-lg px-3 py-2 text-sm font-medium text-slate-600 hover:text-slate-900">
                Masuk
              </Link>
              <Link href="/aktivasi" className="rounded-lg bg-brand-600 px-4 py-2 text-sm font-semibold text-white hover:bg-brand-700">
                Aktifkan Kartu
              </Link>
            </>
          )}
          <button className="md:hidden" onClick={() => setOpen(!open)} aria-label="Menu">
            <svg className="h-6 w-6" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeWidth={2} d="M4 6h16M4 12h16M4 18h16" />
            </svg>
          </button>
        </div>
      </div>
      {open && (
        <div className="border-t border-slate-200 bg-white px-4 py-3 md:hidden">
          <Link href="/#cara-kerja" className="block py-2 text-sm font-medium" onClick={() => setOpen(false)}>Cara Kerja</Link>
          <Link href="/#harga" className="block py-2 text-sm font-medium" onClick={() => setOpen(false)}>Harga</Link>
          <Link href="/#faq" className="block py-2 text-sm font-medium" onClick={() => setOpen(false)}>FAQ</Link>
        </div>
      )}
    </header>
  );
}
