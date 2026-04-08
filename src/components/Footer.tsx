import Link from "next/link";
import { Github, Twitter, Instagram, Youtube } from "lucide-react";

export default function Footer() {
  const currentYear = new Date().getFullYear();

  return (
    <footer className="w-full border-t border-white/10 bg-black/60 pt-16 pb-12 mt-auto relative z-10 backdrop-blur-sm">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        {/* Social Media Row */}
        <div className="flex items-center gap-6 mb-10 text-white/90">
          <Link href="#" className="hover:text-white transition-colors" aria-label="Instagram">
            <Instagram className="h-6 w-6" />
          </Link>
          <Link href="#" className="hover:text-white transition-colors" aria-label="Twitter">
            <Twitter className="h-6 w-6" />
          </Link>
          <Link href="#" className="hover:text-white transition-colors" aria-label="Youtube">
            <Youtube className="h-6 w-6" />
          </Link>
          <Link href="#" className="hover:text-white transition-colors" aria-label="Github">
            <Github className="h-6 w-6" />
          </Link>
        </div>

        {/* Links Grid (Ala Netflix) */}
        <div className="grid grid-cols-2 md:grid-cols-4 gap-y-4 gap-x-8 text-[13px] text-white/50 mb-10">
          <div className="flex flex-col space-y-3">
            <Link href="#" className="hover:underline">
              Tanya Jawab (FAQ)
            </Link>
            <Link href="#" className="hover:underline">
              Pusat Bantuan
            </Link>
            <Link href="#" className="hover:underline">
              Akun
            </Link>
            <Link href="#" className="hover:underline">
              Pusat Media
            </Link>
          </div>
          <div className="flex flex-col space-y-3">
            <Link href="#" className="hover:underline">
              Request Anime
            </Link>
            <Link href="#" className="hover:underline">
              Cara Menonton
            </Link>
            <Link href="#" className="hover:underline">
              Ketentuan Penggunaan
            </Link>
            <Link href="#" className="hover:underline">
              Kebijakan Privasi
            </Link>
          </div>
          <div className="flex flex-col space-y-3">
            <Link href="#" className="hover:underline">
              DMCA / Copyright
            </Link>
            <Link href="#" className="hover:underline">
              Preferensi Cookie
            </Link>
            <Link href="#" className="hover:underline">
              Informasi Perusahaan
            </Link>
            <Link href="#" className="hover:underline">
              Hubungi Kami
            </Link>
          </div>
          <div className="flex flex-col space-y-3">
            <Link href="#" className="hover:underline">
              Komunitas Discord
            </Link>
            <Link href="#" className="hover:underline">
              Sumber Data (AniList)
            </Link>
            <Link href="#" className="hover:underline">
              Dukung Kami (Donasi)
            </Link>
            <Link href="#" className="hover:underline">
              Blog
            </Link>
          </div>
        </div>

        {/* Copyright & Brand */}
        <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center gap-4 text-xs text-white/40">
          <p>© {currentYear} AnimeHub. Platform Streaming Prototipe.</p>
          <div className="flex gap-4">
            <span className="bg-white/10 px-2 py-1 rounded text-white/60">ID-ID</span>
          </div>
        </div>
      </div>
    </footer>
  );
}
