import { NextResponse } from "next/server";
import { getDb } from "@/lib/db";
import { getSessionUser } from "@/lib/auth";

// GET: statistik global (admin only)
export async function GET() {
  const user = getSessionUser();
  if (!user || user.role !== "admin") {
    return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
  }
  const db = getDb();
  const totalCards = (db.prepare("SELECT COUNT(*) AS c FROM cards").get() as any).c;
  const activeCards = (db.prepare("SELECT COUNT(*) AS c FROM cards WHERE is_active = 1").get() as any).c;
  const totalTaps = (db.prepare("SELECT COUNT(*) AS c FROM taps").get() as any).c;
  const totalUsers = (db.prepare("SELECT COUNT(*) AS c FROM users WHERE role = 'buyer'").get() as any).c;
  const tapsPerDay = db
    .prepare(
      `SELECT date(created_at) AS d, COUNT(*) AS c FROM taps
       WHERE created_at >= date('now', '-14 days') GROUP BY d ORDER BY d`
    )
    .all();
  const topCards = db
    .prepare("SELECT code, business_name, tap_count FROM cards ORDER BY tap_count DESC LIMIT 10")
    .all();
  return NextResponse.json({ totalCards, activeCards, totalTaps, totalUsers, tapsPerDay, topCards });
}
