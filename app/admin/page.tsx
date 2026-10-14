"use client";

import { useEffect, useState } from "react";
import { useRouter } from "next/navigation";

export default function Admin() {
  const router = useRouter();
  const [stats, setStats] = useState<any>(null);
  const [cards, setCards] = useState<any[]>([]);
  const [genCount, setGenCount] = useState(50);
  const [newCodes, setNewCodes] = useState<string[]>([]);
  const [loading, setLoading] = useState(true);
  const [msg, setMsg] = useState("");

  const load = async () => {
    const [s, c] = await Promise.all([fetch("/api/admin/stats"), fetch("/api/admin/cards")]);
    if (s.status === 401) {
      router.push("/masuk");
      return;
    }
    setStats(await s.json());
    setCards((await c.json()).cards || []);
    setLoading(false);
  };

  useEffect(() => {
    load();
  }, []);

  const generate = async () => {
    setMsg("Generating...");
    const r = await fetch("/api/admin/generate", {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ count: genCount }),
    });
    const d = await r.json();
    if (!r.ok) {
      setMsg("Gagal");
      return;
    }
    setNewCodes(d.codes);
    setMsg(`${d.codes.length} kode berhasil dibuat`);
    load();
  };

  const copyCodes = () => {
    navigator.clipboard.writeText(newCodes.join("\n"));
    setMsg("Kode tersalin!");
    setTimeout(() => setMsg(""), 2000);
  };

  if (loading) return <div className="mx-auto max-w-6xl px-4 py-16 text-center text-slate-500">Memuat...</div>;

  const maxTaps = Math.max(...(stats?.tapsPerDay?.map((t: any) => t.c) || [1]), 1);

  return (
    <div className="mx-auto max-w-6xl px-4 py-10">
      <h1 className="text-3xl font-bold tracking-tight">Admin Dashboard</h1>
      {msg && <div className="mt-4 rounded-xl bg-blue-50 px-4 py-3 text-sm text-blue-700">{msg}</div>}

      {/* STATS */}
      <div className="mt-6 grid grid-cols-2 gap-4 md:grid-cols-4">
        {[
          { label: "Total Kartu", value: stats.totalCards },
          { label: "Kartu Aktif", value: stats.activeCards },
          { label: "Total Tap", value: stats.totalTaps },
          { label: "Total Buyer", value: stats.totalUsers },
        ].map((s) => (
          <div key={s.label} className="rounded-2xl border border-slate-200 bg-white p-5">
            <p className="text-sm text-slate-500">{s.label}</p>
            <p className="mt-1 text-3xl font-extrabold">{s.value}</p>
          </div>
        ))}
      </div>

      {/* GRAFIK TAP 14 HARI */}
      <div className="mt-6 rounded-2xl border border-slate-200 bg-white p-6">
        <h2 className="font-semibold">Tap 14 Hari Terakhir</h2>
        <div className="mt-4 flex h-32 items-end gap-1">
          {stats.tapsPerDay.map((t: any) => (
            <div key={t.d} className="flex-1" title={`${t.d}: ${t.c}`}>
              <div className="rounded-t bg-brand-500" style={{ height: `${Math.max((t.c / maxTaps) * 100, 4)}%`, minHeight: 4 }} />
            </div>
          ))}
          {stats.tapsPerDay.length === 0 && <p className="text-sm text-slate-500">Belum ada data tap.</p>}
        </div>
      </div>

      {/* GENERATE KODE */}
      <div className="mt-6 rounded-2xl border border-slate-200 bg-white p-6">
        <h2 className="font-semibold">Generate Kode Kartu</h2>
        <p className="mt-1 text-sm text-slate-500">Buat kode unik untuk ditulis ke chip NFC.</p>
        <div className="mt-4 flex flex-wrap items-center gap-3">
          <input type="number" min={1} max={200} value={genCount} onChange={(e) => setGenCount(Number(e.target.value))}
            className="w-24 rounded-xl border border-slate-300 px-3 py-2 text-sm" />
          <button onClick={generate} className="rounded-xl bg-brand-600 px-5 py-2 text-sm font-semibold text-white hover:bg-brand-700">
            Generate
          </button>
          {newCodes.length > 0 && (
            <button onClick={copyCodes} className="rounded-xl bg-slate-100 px-5 py-2 text-sm font-semibold hover:bg-slate-200">
              Salin {newCodes.length} Kode
            </button>
          )}
        </div>
        {newCodes.length > 0 && (
          <div className="mt-4 max-h-48 overflow-auto rounded-xl bg-slate-50 p-4 font-mono text-sm">
            {newCodes.join(", ")}
          </div>
        )}
      </div>

      {/* TOP KARTU */}
      <div className="mt-6 rounded-2xl border border-slate-200 bg-white p-6">
        <h2 className="font-semibold">Kartu Terpopuler</h2>
        <div className="mt-4 space-y-2">
          {stats.topCards.map((c: any, i: number) => (
            <div key={c.code} className="flex items-center justify-between text-sm">
              <span><b>{i + 1}.</b> <span className="font-mono font-bold">{c.code}</span> - {c.business_name || "-"}</span>
              <span className="font-semibold text-brand-600">{c.tap_count} tap</span>
            </div>
          ))}
          {stats.topCards.length === 0 && <p className="text-sm text-slate-500">Belum ada data.</p>}
        </div>
      </div>

      {/* SEMUA KARTU */}
      <div className="mt-6 rounded-2xl border border-slate-200 bg-white p-6">
        <h2 className="font-semibold">Semua Kartu ({cards.length})</h2>
        <div className="mt-4 overflow-x-auto">
          <table className="w-full text-sm">
            <thead>
              <tr className="border-b text-left text-slate-500">
                <th className="pb-2 pr-4">Kode</th>
                <th className="pb-2 pr-4">Status</th>
                <th className="pb-2 pr-4">Usaha</th>
                <th className="pb-2 pr-4">Buyer</th>
                <th className="pb-2">Tap</th>
              </tr>
            </thead>
            <tbody>
              {cards.map((c: any) => (
                <tr key={c.id} className="border-b last:border-0">
                  <td className="py-2 pr-4 font-mono font-bold">{c.code}</td>
                  <td className="py-2 pr-4">
                    <span className={`rounded-full px-2 py-0.5 text-xs font-semibold ${c.is_active ? "bg-green-100 text-green-700" : "bg-slate-100 text-slate-500"}`}>
                      {c.is_active ? "Aktif" : "Belum"}
                    </span>
                  </td>
                  <td className="py-2 pr-4">{c.business_name || "-"}</td>
                  <td className="py-2 pr-4">{c.buyer_email || "-"}</td>
                  <td className="py-2 font-semibold">{c.tap_count}</td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </div>
    </div>
  );
}
