import { cookies } from "next/headers";
import crypto from "crypto";
import { getDb, User } from "./db";

const COOKIE_NAME = "tapreview_session";

export function createSession(userId: number): string {
  const db = getDb();
  const token = crypto.randomBytes(32).toString("hex");
  db.prepare("INSERT INTO sessions (token, user_id) VALUES (?, ?)").run(token, userId);
  return token;
}

export function destroySession(token: string) {
  const db = getDb();
  db.prepare("DELETE FROM sessions WHERE token = ?").run(token);
}

export function getSessionUser(): User | null {
  try {
    const token = cookies().get(COOKIE_NAME)?.value;
    if (!token) return null;
    const db = getDb();
    const row = db
      .prepare(
        "SELECT u.id, u.email, u.name, u.role, u.created_at FROM sessions s JOIN users u ON u.id = s.user_id WHERE s.token = ?"
      )
      .get(token) as User | undefined;
    return row ?? null;
  } catch {
    return null;
  }
}

export function setSessionCookie(token: string) {
  cookies().set(COOKIE_NAME, token, {
    httpOnly: true,
    sameSite: "lax",
    path: "/",
    maxAge: 60 * 60 * 24 * 30, // 30 hari
  });
}

export function clearSessionCookie() {
  cookies().set(COOKIE_NAME, "", { httpOnly: true, path: "/", maxAge: 0 });
}
