import { NextRequest, NextResponse } from "next/server";
import { getDb, hashPassword } from "@/lib/db";
import { createSession, setSessionCookie } from "@/lib/auth";

export async function POST(req: NextRequest) {
  try {
    const { email, password, name } = await req.json();
    if (!email || !password || !name) {
      return NextResponse.json({ error: "Lengkapi semua field" }, { status: 400 });
    }
    if (password.length < 6) {
      return NextResponse.json({ error: "Password minimal 6 karakter" }, { status: 400 });
    }
    const db = getDb();
    const exists = db.prepare("SELECT id FROM users WHERE email = ?").get(email.toLowerCase());
    if (exists) {
      return NextResponse.json({ error: "Email sudah terdaftar" }, { status: 400 });
    }
    const result = db
      .prepare("INSERT INTO users (email, password_hash, name, role) VALUES (?, ?, ?, 'buyer')")
      .run(email.toLowerCase(), hashPassword(password), name);
    const token = createSession(Number(result.lastInsertRowid));
    setSessionCookie(token);
    return NextResponse.json({ ok: true });
  } catch (e) {
    return NextResponse.json({ error: "Terjadi kesalahan" }, { status: 500 });
  }
}
