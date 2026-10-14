import { NextRequest, NextResponse } from "next/server";
import { getDb, generateUniqueCode } from "@/lib/db";
import { getSessionUser } from "@/lib/auth";

// POST: generate N kode kartu baru (admin only)
export async function POST(req: NextRequest) {
  const user = getSessionUser();
  if (!user || user.role !== "admin") {
    return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
  }
  try {
    const { count } = await req.json();
    const n = Math.min(Math.max(parseInt(count) || 10, 1), 200);
    const db = getDb();
    const codes: string[] = [];
    const insert = db.prepare("INSERT INTO cards (code) VALUES (?)");
    const tx = db.transaction((list: string[]) => {
      for (const c of list) insert.run(c);
    });
    for (let i = 0; i < n; i++) codes.push(generateUniqueCode(db));
    tx(codes);
    return NextResponse.json({ ok: true, codes });
  } catch (e) {
    return NextResponse.json({ error: "Terjadi kesalahan" }, { status: 500 });
  }
}
