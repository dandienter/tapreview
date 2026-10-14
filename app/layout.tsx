import type { Metadata } from "next";
import "./globals.css";
import Navbar from "@/components/Navbar";

export const metadata: Metadata = {
  title: "TapReview - Kartu NFC Google Review",
  description: "Jual kartu NFC tap untuk Google Review. Beli, aktifkan, tap - review mengalir otomatis.",
};

export default function RootLayout({ children }: { children: React.ReactNode }) {
  return (
    <html lang="id">
      <body>
        <Navbar />
        <main className="min-h-screen">{children}</main>
        <footer className="border-t border-slate-200 bg-slate-50">
          <div className="mx-auto max-w-7xl px-4 py-10 text-center text-sm text-slate-500">
            <p className="font-semibold text-slate-700">TapReview</p>
            <p className="mt-1">Kartu NFC Google Review - Beli, Aktifkan, Tap.</p>
            <p className="mt-3">&copy; 2026 TapReview. Open source (MIT).</p>
          </div>
        </footer>
      </body>
    </html>
  );
}
