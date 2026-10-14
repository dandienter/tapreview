import Link from "next/link";
import NFCCard from "@/components/NFCCard";

const STEPS = [
  {
    n: "1",
    title: "Beli Kartu",
    desc: "Pesan kartu NFC TapReview. Setiap kartu punya kode unik yang sudah tertanam di chip.",
  },
  {
    n: "2",
    title: "Aktifkan",
    desc: "Masukkan kode kartu + link Google Review usaha kamu di halaman aktivasi. Selesai dalam 1 menit.",
  },
  {
    n: "3",
    title: "Customer Tap",
    desc: "Tempelkan HP ke kartu, otomatis terbuka halaman review Google. Review 5 bintang mengalir.",
  },
];

const PRICES = [
  {
    name: "Starter",
    price: "Rp 99rb",
    desc: "Cocok buat coba-coba",
    features: ["1 kartu NFC", "Dashboard aktivasi", "Statistik tap", "Ganti link kapan aja"],
    cta: "Pesan Sekarang",
  },
  {
    name: "Bisnis",
    price: "Rp 399rb",
    desc: "Buat resto, kafe, barbershop",
    features: ["5 kartu NFC", "Semua fitur Starter", "Prioritas support", "Stiker meja bonus"],
    cta: "Pesan Sekarang",
    highlight: true,
  },
  {
    name: "Enterprise",
    price: "Rp 749rb",
    desc: "Buat cabang / franchise",
    features: ["10 kartu NFC", "Semua fitur Bisnis", "Konsultasi setup", "Desain kartu custom"],
    cta: "Hubungi Kami",
  },
];

const FAQS = [
  {
    q: "Apakah customer perlu install aplikasi?",
    a: "Tidak. Hampir semua HP Android dan iPhone modern bisa baca NFC langsung. Tempel HP ke kartu, link review langsung terbuka di browser.",
  },
  {
    q: "Bagaimana cara dapat link Google Review?",
    a: "Buka Google Maps, cari usaha kamu, buka tab Ulasan, lalu salin link-nya. Di dashboard TapReview kami juga sediakan panduan langkah per langkah.",
  },
  {
    q: "Bisa ganti link review setelah aktivasi?",
    a: "Bisa, kapan aja, gratis. Login ke dashboard, klik Edit di kartu kamu, ganti link-nya. Kartu fisik tidak perlu diganti.",
  },
  {
    q: "Apakah ada biaya bulanan?",
    a: "Tidak ada. Bayar sekali untuk kartunya, pakai selamanya. Dashboard dan statistik gratis.",
  },
  {
    q: "Data tap saya aman?",
    a: "Ya. Kami hanya mencatat jumlah tap dan waktu, tanpa data pribadi customer.",
  },
];

export default function Home() {
  return (
    <div>
      {/* HERO */}
      <section className="relative overflow-hidden bg-gradient-to-b from-brand-50 to-white">
        <div className="mx-auto grid max-w-7xl items-center gap-12 px-4 py-16 md:grid-cols-2 md:py-24">
          <div>
            <span className="inline-block rounded-full bg-brand-100 px-3 py-1 text-xs font-semibold text-brand-700">
              Kartu NFC Google Review
            </span>
            <h1 className="mt-4 text-4xl font-extrabold tracking-tight text-slate-900 md:text-6xl">
              Ubah Setiap Customer Jadi <span className="text-brand-600">Review Bintang 5</span>
            </h1>
            <p className="mt-4 text-lg text-slate-600">
              Satu tap, customer langsung diarahkan ke halaman review Google usaha kamu. Tanpa aplikasi, tanpa ribet, tanpa biaya bulanan.
            </p>
            <div className="mt-8 flex flex-col gap-3 sm:flex-row">
              <Link href="/#harga" className="rounded-xl bg-brand-600 px-6 py-3 text-center font-semibold text-white shadow-lg hover:bg-brand-700">
                Beli Kartu
              </Link>
              <Link href="/aktivasi" className="rounded-xl border border-slate-300 bg-white px-6 py-3 text-center font-semibold text-slate-700 hover:bg-slate-50">
                Aktifkan Kartu
              </Link>
            </div>
            <p className="mt-4 text-sm text-slate-500">Sudah punya kartu? Aktivasi gratis, cuma 1 menit.</p>
          </div>
          <div className="py-8">
            <NFCCard />
          </div>
        </div>
      </section>

      {/* CARA KERJA */}
      <section id="cara-kerja" className="mx-auto max-w-7xl px-4 py-16 md:py-24">
        <h2 className="text-center text-3xl font-bold tracking-tight md:text-4xl">Cara Kerja</h2>
        <p className="mx-auto mt-3 max-w-2xl text-center text-slate-600">
          Tiga langkah mudah dari kartu sampai review masuk.
        </p>
        <div className="mt-10 grid gap-6 md:grid-cols-3">
          {STEPS.map((s) => (
            <div key={s.n} className="rounded-2xl border border-slate-200 bg-white p-6 shadow-sm">
              <span className="flex h-10 w-10 items-center justify-center rounded-full bg-brand-600 text-lg font-bold text-white">
                {s.n}
              </span>
              <h3 className="mt-4 text-xl font-semibold">{s.title}</h3>
              <p className="mt-2 text-slate-600">{s.desc}</p>
            </div>
          ))}
        </div>
      </section>

      {/* HARGA */}
      <section id="harga" className="bg-slate-50">
        <div className="mx-auto max-w-7xl px-4 py-16 md:py-24">
          <h2 className="text-center text-3xl font-bold tracking-tight md:text-4xl">Harga</h2>
          <p className="mx-auto mt-3 max-w-2xl text-center text-slate-600">
            Bayar sekali, pakai selamanya. Tanpa biaya bulanan.
          </p>
          <div className="mt-10 grid gap-6 md:grid-cols-3">
            {PRICES.map((p) => (
              <div
                key={p.name}
                className={`rounded-2xl border p-6 ${
                  p.highlight
                    ? "border-brand-600 bg-white shadow-xl ring-2 ring-brand-600/20"
                    : "border-slate-200 bg-white shadow-sm"
                }`}
              >
                {p.highlight && (
                  <span className="mb-3 inline-block rounded-full bg-brand-600 px-3 py-1 text-xs font-semibold text-white">
                    Paling Laris
                  </span>
                )}
                <h3 className="text-xl font-bold">{p.name}</h3>
                <p className="text-sm text-slate-500">{p.desc}</p>
                <p className="mt-4 text-3xl font-extrabold">{p.price}</p>
                <ul className="mt-6 space-y-2">
                  {p.features.map((f) => (
                    <li key={f} className="flex items-start gap-2 text-sm text-slate-600">
                      <svg className="mt-0.5 h-4 w-4 shrink-0 text-green-600" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={3} d="M5 13l4 4L19 7" />
                      </svg>
                      {f}
                    </li>
                  ))}
                </ul>
                <Link
                  href="/aktivasi"
                  className={`mt-6 block rounded-xl px-6 py-3 text-center font-semibold ${
                    p.highlight ? "bg-brand-600 text-white hover:bg-brand-700" : "bg-slate-100 text-slate-800 hover:bg-slate-200"
                  }`}
                >
                  {p.cta}
                </Link>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* FAQ */}
      <section id="faq" className="mx-auto max-w-3xl px-4 py-16 md:py-24">
        <h2 className="text-center text-3xl font-bold tracking-tight md:text-4xl">Pertanyaan Umum</h2>
        <div className="mt-10 space-y-4">
          {FAQS.map((f) => (
            <details key={f.q} className="rounded-xl border border-slate-200 bg-white p-5">
              <summary className="cursor-pointer font-semibold">{f.q}</summary>
              <p className="mt-2 text-slate-600">{f.a}</p>
            </details>
          ))}
        </div>
      </section>

      {/* CTA */}
      <section className="bg-slate-900">
        <div className="mx-auto max-w-7xl px-4 py-16 text-center md:py-20">
          <h2 className="text-3xl font-bold text-white md:text-4xl">Siap Banjir Review Bintang 5?</h2>
          <p className="mx-auto mt-3 max-w-xl text-slate-400">
            Pesan kartunya hari ini, aktifkan dalam 1 menit, dan biarkan customer yang bicara.
          </p>
          <Link href="/aktivasi" className="mt-8 inline-block rounded-xl bg-brand-600 px-8 py-3 font-semibold text-white hover:bg-brand-700">
            Aktifkan Kartu Saya
          </Link>
        </div>
      </section>
    </div>
  );
}
