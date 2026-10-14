import { NextRequest, NextResponse } from "next/server";
import { getDb, Card } from "@/lib/db";
import { getSessionUser } from "@/lib/auth";

// PATCH: update link review / nama usaha kartu milik sendiri
export async function PATCH(req: NextRequest, { params }: { params: { id: string } }) {
  const user = getSessionUser();
  if (!user) return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
  try {
    const { business_name, review_url } = await req.json();
    if (review_url && !/^https?:\/\//i.test(review_url)) {
      return NextResponse.json({ error: "Link harus diawali http:// atau https://" }, { status: 400 });
    }
    const db = getDb();
    const card = db.prepare("SELECT * FROM cards WHERE id = ?").get(params.id) as Card | undefined;
    if (!card || card.buyer_id !== user.id) {
      return NextResponse.json({ error: "Kartu tidak ditemukan" }, { status: 404 });
    }
    db.prepare("UPDATE cards SET business_name = ?, review_url = ? WHERE id = ?").run(
      business_name ?? card.business_name,
      review_url ?? card.review_url,
      card.id
    );
    return NextResponse.json({ ok: true });
  } catch (e) {
    return NextResponse.json({ error: "Terjadi kesalahan" }, { status: 500 });
  }
}
