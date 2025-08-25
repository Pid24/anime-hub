import type { Metadata } from "next";
import { Plus_Jakarta_Sans } from "next/font/google";
import "./globals.css";
import Header from "@/components/Header";

const plusJakarta = Plus_Jakarta_Sans({ subsets: ["latin"], weight: ["400", "600", "800"] });

export const metadata: Metadata = {
  title: "AnimeHub",
  description: "Anime explorer (legal) for portfolio using AniList + Next.js",
};

export default function RootLayout({ children }: { children: React.ReactNode }) {
  return (
    <html lang="id" className="h-full scroll-smooth">
      <body className={`${plusJakarta.className} min-h-screen app-bg`}>
        <Header />
        {children}
        <footer className="py-10 text-center opacity-60 text-xs">Data by AniList. This is a demo app.</footer>
      </body>
    </html>
  );
}
