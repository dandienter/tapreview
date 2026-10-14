"use client";

import { useEffect, useState } from "react";
import { useRouter } from "next/navigation";

type Card = {
  id: number;
  code: string;
  business_name: string | null;
  review_url: string | null;
  tap_count: number;
  created_at: string;
};

export default function Dashboard() {
  const router = useRouter();
  const [cards, setCards] = useState<Card[]>([]);
  const [loading, setLoading] = useState(true);
  const [editing, setEditing] = useState<Card | null>(null);
  const [editForm, setEditForm] = useState({ business_name: "", review_url: "" });
  const [showAdd, setShowAdd] = useState(false);
  const [addForm, setAddForm] = useState({ code: "", business_name: "", review_url: "" });
  const [msg, setMsg] = useState("");
  const [copied, setCopied] = useState("");

  const load = async () => {
    const r = await fetch("/api/cards");
    if (r.status === 401) {
      router.push("/masuk");
      return;
    }
    const d = await r.json();
    setCards(d.cards || []);
    setLoading(false);
  };

  useEffect(() => {
    load();
  }, []);

  const cardUrl = (code: string) => `${window.location.origin}/c/${code}`;

  const copyUrl = (code: string) => {
    navigator.clipboard.writeText(cardUrl(code));
    setCopied(code);
    setTimeout(() => setCopied(""), 2000);
  };

  const saveEdit = async () => {
    if (!editing) return;
    const r = await fetch(`/api/cards/${editing.id}`, {
      method: "PATCH",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify(editForm),
    });
    const d = await r.json();
    if (!r.ok) {
      setMsg(d.error || "Gagal menyimpan");
      return;
    }
    setEditing(null);
    setMsg("Berhasil disimpan");
    setTimeout(() => setMsg(""), 3000);
    load();
  };

  const addCard = async () => {
    const r = await fetch("/api/cards", {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify(addForm),
    });
    const d = await r.json();
    if (!r.ok) {
      setMsg(d.error || "Gagal menambah kartu");
      return;
    }
    setShowAdd(false);
    setAddForm({ code: "", business_name: "", review_url: "" });
    setMsg("Kartu berhasil ditambahkan");
    setTimeout(() => setMsg(""), 3000);
    load();
  };

  const totalTaps = cards.reduce((s, c) => s + c.tap_count, 0);
  const input = "w-full rounded-xl border border-slate-300 px-4 py-2.5 text-sm focus:border-brand-500 focus:outline-none focus:ring-2 focus:ring-brand-500/20";

  if (loading) return <div className="mx-auto max-w-5xl px-4 py-16 text-center text-slate-500">Memuat...</div>;

  return (
    <div className="mx-auto max-w-5xl px-4 py-10">
      <div className="flex flex-wrap items-center justify-between gap-4">
        <div>
          <h1 className="text-3xl font-bold tracking-tight">Dashboard</h1>
          <p className="mt-1 text-slate-600">Kelola kartu NFC kamu.</p>
        </div>
        <button onClick={() => setShowAdd(true)} className="rounded-xl bg-brand-600 px-5 py-2.5 text-sm font-semibold text-white hover:bg-brand-700">
          + Tambah Kartu
        </button>
      </div>

      {msg && <div className="mt-4 rounded-xl bg-green-50 px-4 py-3 text-sm text-green-700">{msg}</div>}

      {/* STATS */}
      <div className="mt-6 grid grid-cols-2 gap-4 md:grid-cols-3">
        <div className="rounded-2xl border border-slate-200 bg-white p-5">
          <p className="text-sm text-slate-500">Total Kartu</p>
          <p className="mt-1 text-3xl font-extrabold">{cards.length}</p>
        </div>
        <div className="rounded-2xl border border-slate-200 bg-white p-5">
          <p className="text-sm text-slate-500">Total Tap</p>
          <p className="mt-1 text-3xl font-extrabold text-brand-600">{totalTaps}</p>
        </div>
        <div className="rounded-2xl border border-slate-200 bg-white p-5">
          <p className="text-sm text-slate-500">Rata-rata / Kartu</p>
          <p className="mt-1 text-3xl font-extrabold">{cards.length ? Math.round(totalTaps / cards.length) : 0}</p>
        </div>
      </div>

      {/* GRAFIK SEDERHANA */}
      {cards.length > 0 && (
        <div className="mt-6 rounded-2xl border border-slate-200 bg-white p-6">
          <h2 className="font-semibold">Tap per Kartu</h2>
          <div className="mt-4 space-y-3">
            {cards.map((c) => {
              const max = Math.max(...cards.map((x) => x.tap_count), 1);
              return (
                <div key={c.id} className="flex items-center gap-3">
                  <span className="w-20 shrink-0 font-mono text-xs font-bold">{c.code}</span>
                  <div className="h-6 flex-1 overflow-hidden rounded-full bg-slate-100">
                    <div className="h-full rounded-full bg-gradient-to-r from-brand-500 to-violet-500" style={{ width: `${(c.tap_count / max) * 100}%` }} />
                  </div>
                  <span className="w-12 text-right text-sm font-semibold">{c.tap_count}</span>
                </div>
              );
            })}
          </div>
        </div>
      )}

      {/* LIST KARTU */}
      <div className="mt-6 space-y-4">
        {cards.length === 0 && (
          <div className="rounded-2xl border border-dashed border-slate-300 bg-slate-50 p-10 text-center">
            <p className="font-semibold text-slate-700">Belum ada kartu</p>
            <p className="mt-1 text-sm text-slate-500">Aktifkan kartu pertama kamu atau tambah dengan kode kartu.</p>
          </div>
        )}
        {cards.map((c) => (
          <div key={c.id} className="rounded-2xl border border-slate-200 bg-white p-5">
            <div className="flex flex-wrap items-start justify-between gap-3">
              <div>
                <p className="font-mono text-lg font-bold tracking-widest">{c.code}</p>
                <p className="mt-1 font-semibold">{c.business_name || "-"}</p>
                <a href={c.review_url || "#"} target="_blank" rel="noreferrer" className="mt-1 block max-w-md truncate text-sm text-brand-600 hover:underline">
                  {c.review_url || "-"}
                </a>
              </div>
              <div className="text-right">
                <p className="text-2xl font-extrabold text-brand-600">{c.tap_count}</p>
                <p className="text-xs text-slate-500">tap</p>
              </div>
            </div>
            <div className="mt-4 flex flex-wrap gap-2">
              <button onClick={() => copyUrl(c.code)}
                className="rounded-lg bg-slate-100 px-3 py-1.5 text-xs font-semibold text-slate-700 hover:bg-slate-200">
                {copied === c.code ? "Tersalin!" : "Salin URL Kartu"}
              </button>
              <button onClick={() => { setEditing(c); setEditForm({ business_name: c.business_name || "", review_url: c.review_url || "" }); }}
                className="rounded-lg bg-slate-100 px-3 py-1.5 text-xs font-semibold text-slate-700 hover:bg-slate-200">
                Edit Link
              </button>
            </div>
          </div>
        ))}
      </div>

      {/* MODAL EDIT */}
      {editing && (
        <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/40 p-4">
          <div className="w-full max-w-md rounded-2xl bg-white p-6">
            <h3 className="text-lg font-bold">Edit Kartu {editing.code}</h3>
            <div className="mt-4 space-y-3">
              <div>
                <label className="mb-1 block text-sm font-semibold">Nama Usaha</label>
                <input className={input} value={editForm.business_name}
                  onChange={(e) => setEditForm({ ...editForm, business_name: e.target.value })} />
              </div>
              <div>
                <label className="mb-1 block text-sm font-semibold">Link Review</label>
                <input className={input} value={editForm.review_url}
                  onChange={(e) => setEditForm({ ...editForm, review_url: e.target.value })} />
              </div>
            </div>
            <div className="mt-6 flex gap-2">
              <button onClick={() => setEditing(null)} className="flex-1 rounded-xl bg-slate-100 px-4 py-2.5 text-sm font-semibold">Batal</button>
              <button onClick={saveEdit} className="flex-1 rounded-xl bg-brand-600 px-4 py-2.5 text-sm font-semibold text-white hover:bg-brand-700">Simpan</button>
            </div>
          </div>
        </div>
      )}

      {/* MODAL TAMBAH */}
      {showAdd && (
        <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/40 p-4">
          <div className="w-full max-w-md rounded-2xl bg-white p-6">
            <h3 className="text-lg font-bold">Tambah Kartu</h3>
            <p className="mt-1 text-sm text-slate-500">Masukkan kode kartu baru yang belum aktif.</p>
            <div className="mt-4 space-y-3">
              <div>
                <label className="mb-1 block text-sm font-semibold">Kode Kartu</label>
                <input className={`${input} font-mono uppercase`} placeholder="A1B2C3" maxLength={6}
                  value={addForm.code} onChange={(e) => setAddForm({ ...addForm, code: e.target.value.toUpperCase() })} />
              </div>
              <div>
                <label className="mb-1 block text-sm font-semibold">Nama Usaha</label>
                <input className={input} value={addForm.business_name}
                  onChange={(e) => setAddForm({ ...addForm, business_name: e.target.value })} />
              </div>
              <div>
                <label className="mb-1 block text-sm font-semibold">Link Review</label>
                <input className={input} placeholder="https://..." value={addForm.review_url}
                  onChange={(e) => setAddForm({ ...addForm, review_url: e.target.value })} />
              </div>
            </div>
            <div className="mt-6 flex gap-2">
              <button onClick={() => setShowAdd(false)} className="flex-1 rounded-xl bg-slate-100 px-4 py-2.5 text-sm font-semibold">Batal</button>
              <button onClick={addCard} className="flex-1 rounded-xl bg-brand-600 px-4 py-2.5 text-sm font-semibold text-white hover:bg-brand-700">Tambah</button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}
