import { NextResponse } from "next/server";
import { getDb } from "@/lib/db";
import { getSessionUser } from "@/lib/auth";

// GET: semua kartu + info buyer (admin only)
export async function GET() {
  const user = getSessionUser();
  if (!user || user.role !== "admin") {
    return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
  }
  const db = getDb();
  const cards = db
    .prepare(
      `SELECT c.*, u.email AS buyer_email, u.name AS buyer_name
       FROM cards c LEFT JOIN users u ON u.id = c.buyer_id
       ORDER BY c.created_at DESC LIMIT 500`
    )
    .all();
  return NextResponse.json({ cards });
}
