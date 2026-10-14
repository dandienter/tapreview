import Database from "better-sqlite3";
import path from "path";
import fs from "fs";
import crypto from "crypto";

let db: Database.Database | null = null;

export function getDb(): Database.Database {
  if (db) return db;

  const dataDir = path.join(process.cwd(), "data");
  if (!fs.existsSync(dataDir)) fs.mkdirSync(dataDir, { recursive: true });

  const dbPath = path.join(dataDir, "tapreview.db");
  db = new Database(dbPath);
  db.pragma("journal_mode = WAL");
  migrate(db);
  return db;
}

function migrate(db: Database.Database) {
  db.exec(`
    CREATE TABLE IF NOT EXISTS users (
      id INTEGER PRIMARY KEY AUTOINCREMENT,
      email TEXT UNIQUE NOT NULL,
      password_hash TEXT NOT NULL,
      name TEXT NOT NULL,
      role TEXT NOT NULL DEFAULT 'buyer',
      created_at TEXT NOT NULL DEFAULT (datetime('now'))
    );
    CREATE TABLE IF NOT EXISTS cards (
      id INTEGER PRIMARY KEY AUTOINCREMENT,
      code TEXT UNIQUE NOT NULL,
      business_name TEXT,
      review_url TEXT,
      buyer_id INTEGER REFERENCES users(id),
      is_active INTEGER NOT NULL DEFAULT 0,
      tap_count INTEGER NOT NULL DEFAULT 0,
      created_at TEXT NOT NULL DEFAULT (datetime('now'))
    );
    CREATE TABLE IF NOT EXISTS sessions (
      id INTEGER PRIMARY KEY AUTOINCREMENT,
      token TEXT UNIQUE NOT NULL,
      user_id INTEGER NOT NULL REFERENCES users(id),
      created_at TEXT NOT NULL DEFAULT (datetime('now'))
    );
    CREATE TABLE IF NOT EXISTS taps (
      id INTEGER PRIMARY KEY AUTOINCREMENT,
      card_id INTEGER NOT NULL REFERENCES cards(id),
      ip TEXT,
      user_agent TEXT,
      created_at TEXT NOT NULL DEFAULT (datetime('now'))
    );
    CREATE INDEX IF NOT EXISTS idx_cards_code ON cards(code);
    CREATE INDEX IF NOT EXISTS idx_taps_card ON taps(card_id);
  `);

  // Seed admin
  const admin = db.prepare("SELECT id FROM users WHERE email = ?").get("admin@tapreview.id") as any;
  if (!admin) {
    const hash = hashPassword("admin123");
    db.prepare("INSERT INTO users (email, password_hash, name, role) VALUES (?, ?, ?, ?)").run(
      "admin@tapreview.id",
      hash,
      "Administrator",
      "admin"
    );
    console.log("[db] Seeded admin: admin@tapreview.id / admin123");
  }
}

export function hashPassword(password: string): string {
  const salt = crypto.randomBytes(16).toString("hex");
  const hash = crypto.scryptSync(password, salt, 64).toString("hex");
  return `${salt}:${hash}`;
}

export function verifyPassword(password: string, stored: string): boolean {
  const [salt, hash] = stored.split(":");
  if (!salt || !hash) return false;
  const derived = crypto.scryptSync(password, salt, 64).toString("hex");
  return crypto.timingSafeEqual(Buffer.from(hash, "hex"), Buffer.from(derived, "hex"));
}

const CODE_CHARS = "ABCDEFGHJKLMNPQRSTUVWXYZ23456789";

export function generateCode(): string {
  let code = "";
  for (let i = 0; i < 6; i++) {
    code += CODE_CHARS[crypto.randomInt(CODE_CHARS.length)];
  }
  return code;
}

export function generateUniqueCode(db: Database.Database): string {
  for (let i = 0; i < 100; i++) {
    const code = generateCode();
    const exists = db.prepare("SELECT id FROM cards WHERE code = ?").get(code);
    if (!exists) return code;
  }
  throw new Error("Gagal generate kode unik");
}

export type User = {
  id: number;
  email: string;
  name: string;
  role: string;
  created_at: string;
};

export type Card = {
  id: number;
  code: string;
  business_name: string | null;
  review_url: string | null;
  buyer_id: number | null;
  is_active: number;
  tap_count: number;
  created_at: string;
};
