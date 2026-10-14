import { NextRequest, NextResponse } from "next/server";
import { getDb, Card } from "@/lib/db";

// GET /c/[code] -> catat tap, redirect ke review_url
export async function GET(req: NextRequest, { params }: { params: { code: string } }) {
  const code = (params.code || "").toUpperCase().trim();
  const db = getDb();
  const card = db.prepare("SELECT * FROM cards WHERE code = ?").get(code) as Card | undefined;

  if (!card || !card.is_active || !card.review_url) {
    // Kartu belum diaktivasi -> tampilkan halaman info
    const html = `<!DOCTYPE html><html lang="id"><head><meta charset="utf-8"/><meta name="viewport" content="width=device-width,initial-scale=1"/><title>Kartu Belum Aktif - TapReview</title>
    <style>body{font-family:system-ui,sans-serif;display:flex;align-items:center;justify-content:center;min-height:100vh;margin:0;background:#f8fafc;color:#0f172a;text-align:center;padding:24px}a{background:#4f46e5;color:#fff;padding:12px 24px;border-radius:12px;text-decoration:none;font-weight:600;display:inline-block;margin-top:16px}</style></head>
    <body><div><h1>Kartu Belum Diaktivasi</h1><p>Kode <b>${code}</b> belum terhubung ke link review.</p><a href="/aktivasi">Aktifkan Sekarang</a></div></body></html>`;
    return new NextResponse(html, { headers: { "Content-Type": "text/html; charset=utf-8" } });
  }

  // Catat tap
  const ip = req.headers.get("x-forwarded-for")?.split(",")[0]?.trim() ?? "unknown";
  const ua = req.headers.get("user-agent") ?? "";
  db.prepare("UPDATE cards SET tap_count = tap_count + 1 WHERE id = ?").run(card.id);
  db.prepare("INSERT INTO taps (card_id, ip, user_agent) VALUES (?, ?, ?)").run(card.id, ip, ua);

  return NextResponse.redirect(card.review_url, 302);
}
