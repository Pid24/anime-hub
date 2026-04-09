import type { Metadata } from "next";
import { Plus_Jakarta_Sans } from "next/font/google";
import "./globals.css";
import Header from "@/components/Header";
import Footer from "@/components/Footer"; // <-- Import komponen Footer ala Netflix

const plusJakarta = Plus_Jakarta_Sans({ subsets: ["latin"], weight: ["400", "600", "800"] });

export const metadata: Metadata = {
  title: "AnimeHub",
  description: "Anime explorer (legal) for portfolio using AniList + Next.js",
};

export default function RootLayout({ children }: { children: React.ReactNode }) {
  return (
    <html lang="id" className="h-full scroll-smooth">
      {/* Tambahkan flex dan flex-col agar layout bisa mendistribusikan ruang kosong */}
      <body className={`${plusJakarta.className} min-h-screen flex flex-col app-bg overflow-x-hidden`}>
        <Header />

        {/* flex-1 akan memaksa konten utama mengambil seluruh sisa ruang layar, mendorong footer ke bawah */}
        <main className="flex-1">{children}</main>

        {/* Footer global dipanggil di sini */}
        <Footer />
      </body>
    </html>
  );
}
