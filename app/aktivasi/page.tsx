"use client";

import { useState } from "react";
import { useRouter } from "next/navigation";
import Link from "next/link";

export default function Aktivasi() {
  const router = useRouter();
  const [form, setForm] = useState({ code: "", business_name: "", review_url: "", name: "", email: "", password: "" });
  const [error, setError] = useState("");
  const [loading, setLoading] = useState(false);

  const submit = async (e: React.FormEvent) => {
    e.preventDefault();
    setError("");
    setLoading(true);
    try {
      const r = await fetch("/api/activate", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(form),
      });
      const d = await r.json();
      if (!r.ok) {
        setError(d.error || "Gagal aktivasi");
        return;
      }
      router.push("/dashboard");
    } catch {
      setError("Terjadi kesalahan jaringan");
    } finally {
      setLoading(false);
    }
  };

  const input = "w-full rounded-xl border border-slate-300 px-4 py-2.5 text-sm focus:border-brand-500 focus:outline-none focus:ring-2 focus:ring-brand-500/20";

  return (
    <div className="mx-auto max-w-xl px-4 py-12">
      <h1 className="text-3xl font-bold tracking-tight">Aktifkan Kartu Kamu</h1>
      <p className="mt-2 text-slate-600">Masukkan kode di kartu + link Google Review usaha kamu. Akun dibuat otomatis.</p>

      <form onSubmit={submit} className="mt-8 space-y-4 rounded-2xl border border-slate-200 bg-white p-6 shadow-sm">
        {error && <div className="rounded-xl bg-red-50 px-4 py-3 text-sm text-red-700">{error}</div>}

        <div>
          <label className="mb-1 block text-sm font-semibold">Kode Kartu *</label>
          <input className={`${input} font-mono uppercase tracking-widest`} placeholder="A1B2C3" maxLength={6}
            value={form.code} onChange={(e) => setForm({ ...form, code: e.target.value.toUpperCase() })} required />
          <p className="mt-1 text-xs text-slate-500">6 karakter, ada di belakang kartu / kemasan.</p>
        </div>
        <div>
          <label className="mb-1 block text-sm font-semibold">Nama Usaha *</label>
          <input className={input} placeholder="Warung Kopi Berkah" value={form.business_name}
            onChange={(e) => setForm({ ...form, business_name: e.target.value })} required />
        </div>
        <div>
          <label className="mb-1 block text-sm font-semibold">Link Google Review *</label>
          <input className={input} placeholder="https://g.page/..." value={form.review_url}
            onChange={(e) => setForm({ ...form, review_url: e.target.value })} required />
          <p className="mt-1 text-xs text-slate-500">Buka Google Maps - cari usaha kamu - tab Ulasan - salin link.</p>
        </div>

        <div className="border-t border-slate-200 pt-4">
          <p className="mb-3 text-sm font-semibold text-slate-700">Buat Akun (untuk kelola kartu)</p>
          <div className="space-y-4">
            <div>
              <label className="mb-1 block text-sm font-semibold">Nama Kamu *</label>
              <input className={input} placeholder="Budi" value={form.name}
                onChange={(e) => setForm({ ...form, name: e.target.value })} required />
            </div>
            <div>
              <label className="mb-1 block text-sm font-semibold">Email *</label>
              <input type="email" className={input} placeholder="budi@email.com" value={form.email}
                onChange={(e) => setForm({ ...form, email: e.target.value })} required />
            </div>
            <div>
              <label className="mb-1 block text-sm font-semibold">Password *</label>
              <input type="password" className={input} placeholder="Minimal 6 karakter" value={form.password}
                onChange={(e) => setForm({ ...form, password: e.target.value })} required />
            </div>
          </div>
        </div>

        <button type="submit" disabled={loading}
          className="w-full rounded-xl bg-brand-600 px-6 py-3 font-semibold text-white hover:bg-brand-700 disabled:opacity-50">
          {loading ? "Mengaktivasi..." : "Aktifkan Kartu"}
        </button>
      </form>

      <p className="mt-4 text-center text-sm text-slate-500">
        Sudah punya akun? <Link href="/masuk" className="font-semibold text-brand-600">Masuk</Link>
      </p>
    </div>
  );
}
