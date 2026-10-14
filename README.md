# TapReview

Web aktivasi kartu NFC Google Review. Jual kartu NFC fisik, pembeli tap kartu - otomatis terbuka halaman Google Review usaha mereka.

## Konsep Bisnis

1. **Jual kartu NFC** - beli kartu NTAG213/NTAG215 blank (Rp 5-15rb), tulis URL unik per kartu pakai HP + aplikasi NFC Tools
2. **Pembeli aktivasi** di web ini: masukkan kode kartu + link Google Review usaha mereka
3. **Customer tap kartu** - HP langsung buka link review Google

Modal per kartu ~Rp 10-25rb, jual Rp 50-150rb.

## Fitur

- Landing page modern (hero, cara kerja, harga, FAQ)
- Aktivasi kartu (buat akun otomatis saat aktivasi)
- Dashboard buyer: list kartu, edit link review, statistik tap, tambah kartu
- Redirect `/c/[kode]`: catat tap + redirect 302 ke link review
- Admin dashboard: generate kode bulk, statistik global, list semua kartu
- Auth: register/login, session cookie, password scrypt hash
- Database: SQLite (better-sqlite3), auto-migrate

## Cara Jalan

```bash
npm install
npm run dev
```

Buka http://localhost:3000

**Login admin default:** `admin@tapreview.id` / `admin123` (ganti setelah deploy!)

## Struktur

```
app/
  page.tsx              Landing page
  aktivasi/page.tsx     Form aktivasi kartu
  masuk/page.tsx        Login
  daftar/page.tsx       Register
  dashboard/page.tsx    Dashboard buyer
  admin/page.tsx        Dashboard admin
  c/[code]/route.ts     Redirect + catat tap
  api/
    auth/               register, login, logout, me
    activate/           Aktivasi kartu
    cards/              List/tambah/edit kartu
    admin/              generate, cards, stats
lib/
  db.ts                 SQLite + migrate + seed
  auth.ts               Session cookie
components/
  Navbar.tsx
  NFCCard.tsx           Mockup kartu NFC (CSS)
data/                   SQLite file (auto-created, gitignored)
```

## Deploy

```bash
npm run build
npm start
```

Database SQLite tersimpan di `./data/tapreview.db`. Untuk production dengan banyak traffic, migrasi ke PostgreSQL disarankan.

## Lisensi

MIT
