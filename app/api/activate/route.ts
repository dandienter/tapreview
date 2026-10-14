import { NextRequest, NextResponse } from "next/server";
import { getDb, hashPassword, Card } from "@/lib/db";
import { createSession, setSessionCookie } from "@/lib/auth";

// Aktivasi kartu: validasi kode, buat akun buyer otomatis (atau pakai yang login), aktifkan kartu
export async function POST(req: NextRequest) {
  try {
    const { code, business_name, review_url, email, password, name } = await req.json();
    const cleanCode = (code || "").toUpperCase().trim();

    if (!cleanCode || !business_name || !review_url) {
      return NextResponse.json({ error: "Lengkapi kode, nama usaha, dan link review" }, { status: 400 });
    }
    if (!/^https?:\/\//i.test(review_url)) {
      return NextResponse.json({ error: "Link review harus diawali http:// atau https://" }, { status: 400 });
    }

    const db = getDb();
    const card = db.prepare("SELECT * FROM cards WHERE code = ?").get(cleanCode) as Card | undefined;
    if (!card) {
      return NextResponse.json({ error: "Kode kartu tidak ditemukan" }, { status: 404 });
    }
    if (card.is_active) {
      return NextResponse.json({ error: "Kartu ini sudah diaktivasi" }, { status: 400 });
    }

    // Cari atau buat user
    let userId: number | null = null;
    if (email && password) {
      const existing = db.prepare("SELECT id, password_hash FROM users WHERE email = ?").get(email.toLowerCase()) as any;
      if (existing) {
        // user sudah ada -> verifikasi password
        const { verifyPassword } = await import("@/lib/db");
        if (!verifyPassword(password, existing.password_hash)) {
          return NextResponse.json({ error: "Email sudah terdaftar, password salah" }, { status: 400 });
        }
        userId = existing.id;
      } else {
        if (password.length < 6) {
          return NextResponse.json({ error: "Password minimal 6 karakter" }, { status: 400 });
        }
        const r = db
          .prepare("INSERT INTO users (email, password_hash, name, role) VALUES (?, ?, ?, 'buyer')")
          .run(email.toLowerCase(), hashPassword(password), name || business_name);
        userId = Number(r.lastInsertRowid);
      }
    } else {
      return NextResponse.json({ error: "Email dan password wajib diisi" }, { status: 400 });
    }

    db.prepare("UPDATE cards SET business_name = ?, review_url = ?, buyer_id = ?, is_active = 1 WHERE id = ?").run(
      business_name,
      review_url,
      userId,
      card.id
    );

    const token = createSession(userId!);
    setSessionCookie(token);
    return NextResponse.json({ ok: true, code: cleanCode });
  } catch (e) {
    console.error(e);
    return NextResponse.json({ error: "Terjadi kesalahan" }, { status: 500 });
  }
}
