import { NextRequest, NextResponse } from "next/server";
import { getDb, Card } from "@/lib/db";
import { getSessionUser } from "@/lib/auth";

// GET: list kartu milik buyer yang login
export async function GET() {
  const user = getSessionUser();
  if (!user) return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
  const db = getDb();
  const cards = db
    .prepare("SELECT * FROM cards WHERE buyer_id = ? ORDER BY created_at DESC")
    .all(user.id) as Card[];
  return NextResponse.json({ cards });
}

// POST: buyer klaim kartu baru pakai kode
export async function POST(req: NextRequest) {
  const user = getSessionUser();
  if (!user) return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
  try {
    const { code, business_name, review_url } = await req.json();
    const cleanCode = (code || "").toUpperCase().trim();
    if (!cleanCode) return NextResponse.json({ error: "Kode wajib diisi" }, { status: 400 });

    const db = getDb();
    const card = db.prepare("SELECT * FROM cards WHERE code = ?").get(cleanCode) as Card | undefined;
    if (!card) return NextResponse.json({ error: "Kode tidak ditemukan" }, { status: 404 });
    if (card.is_active) return NextResponse.json({ error: "Kartu sudah aktif" }, { status: 400 });

    db.prepare("UPDATE cards SET business_name = ?, review_url = ?, buyer_id = ?, is_active = 1 WHERE id = ?").run(
      business_name || null,
      review_url || null,
      user.id,
      card.id
    );
    return NextResponse.json({ ok: true });
  } catch (e) {
    return NextResponse.json({ error: "Terjadi kesalahan" }, { status: 500 });
  }
}
