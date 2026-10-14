import { NextResponse } from "next/server";
import { cookies } from "next/headers";
import { destroySession, clearSessionCookie } from "@/lib/auth";

export async function POST() {
  const token = cookies().get("tapreview_session")?.value;
  if (token) destroySession(token);
  clearSessionCookie();
  return NextResponse.json({ ok: true });
}
