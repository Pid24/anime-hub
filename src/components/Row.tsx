"use client";
import { useMemo, useRef } from "react";
import { ChevronLeft, ChevronRight, ArrowRight } from "lucide-react";
import Link from "next/link";
import type { Media } from "@/lib/anilist";
import PreviewCard from "./PreviewCard";

// hanya terima trailer YouTube (sesuai player kita)
function hasTrailer(m: Media) {
  const site = m?.trailer?.site?.toLowerCase();
  return Boolean(m?.trailer?.id && site === "youtube");
}

export default function Row({ title, items, href }: { title: string; items: Media[]; href?: string }) {
  const ref = useRef<HTMLDivElement>(null);
  const scrollBy = (dx: number) => ref.current?.scrollBy({ left: dx, behavior: "smooth" });

  // filter: cuma yang ada trailer
  const withTrailer = useMemo(() => (items ?? []).filter(hasTrailer), [items]);

  // kalau tidak ada item setelah filter, sembunyikan row
  if (!withTrailer.length) return null;

  return (
    <section className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-4 md:py-6">
      {/* Header Row */}
      <div className="flex items-end justify-between mb-4">
        <h2 className="text-lg md:text-2xl font-bold text-white">{title}</h2>
        {href && (
          <Link
            href={href}
            className="text-sm font-semibold text-white/50 hover:text-white flex items-center gap-1
                       transition-colors pb-0.5 group"
          >
            Lihat Semua
            <ArrowRight className="h-4 w-4 transition-transform group-hover:translate-x-0.5" />
          </Link>
        )}
      </div>

      <div className="relative group">
        {/* tombol kiri */}
        <button
          onClick={() => scrollBy(-800)}
          className="hidden md:flex items-center justify-center absolute left-0 top-1/2 -translate-y-1/2 z-20
                     h-10 w-10 rounded-full bg-black/60 border border-white/10 backdrop-blur-sm
                     opacity-0 group-hover:opacity-100 transition-all duration-300
                     hover:bg-black/80 hover:border-white/20 hover:scale-110"
          aria-label="Scroll left"
        >
          <ChevronLeft className="h-6 w-6 text-white" />
        </button>

        {/* baris kartu */}
        <div ref={ref} className="flex gap-3 overflow-x-auto hide-scroll scroll-smooth snap-x snap-mandatory pb-2">
          {withTrailer.map((m) => (
            <PreviewCard key={m.id} m={m} />
          ))}
        </div>

        {/* tombol kanan */}
        <button
          onClick={() => scrollBy(800)}
          className="hidden md:flex items-center justify-center absolute right-0 top-1/2 -translate-y-1/2 z-20
                     h-10 w-10 rounded-full bg-black/60 border border-white/10 backdrop-blur-sm
                     opacity-0 group-hover:opacity-100 transition-all duration-300
                     hover:bg-black/80 hover:border-white/20 hover:scale-110"
          aria-label="Scroll right"
        >
          <ChevronRight className="h-6 w-6 text-white" />
        </button>

        {/* edge fades — using solid dark color instead of var(--bg) for consistency */}
        <div className="pointer-events-none absolute left-0 top-0 h-full w-12 bg-gradient-to-r from-[#080c16] to-transparent z-10" />
        <div className="pointer-events-none absolute right-0 top-0 h-full w-12 bg-gradient-to-l from-[#080c16] to-transparent z-10" />
      </div>
    </section>
  );
}
