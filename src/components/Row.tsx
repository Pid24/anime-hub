"use client";
import { useMemo, useRef } from "react";
import { ChevronLeft, ChevronRight } from "lucide-react";
import type { Media } from "@/lib/anilist";
import PreviewCard from "./PreviewCard";

// hanya terima trailer YouTube (sesuai player kita)
function hasTrailer(m: Media) {
  const site = m?.trailer?.site?.toLowerCase();
  return Boolean(m?.trailer?.id && site === "youtube");
}

export default function Row({ title, items }: { title: string; items: Media[] }) {
  const ref = useRef<HTMLDivElement>(null);
  const scrollBy = (dx: number) => ref.current?.scrollBy({ left: dx, behavior: "smooth" });

  // filter: cuma yang ada trailer
  const withTrailer = useMemo(() => (items ?? []).filter(hasTrailer), [items]);

  // kalau tidak ada item setelah filter, sembunyikan row
  if (!withTrailer.length) return null;

  return (
    <section className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-6">
      <h2 className="text-xl md:text-2xl font-bold mb-3">{title}</h2>

      <div className="relative group">
        {/* tombol kiri */}
        <button
          onClick={() => scrollBy(-800)}
          className="hidden md:flex items-center justify-center absolute left-0 top-1/2 -translate-y-1/2 z-20
                     h-10 w-10 rounded-full bg-black/60 border border-white/10 opacity-0 group-hover:opacity-100"
          aria-label="Scroll left"
        >
          <ChevronLeft className="h-6 w-6" />
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
                     h-10 w-10 rounded-full bg-black/60 border border-white/10 opacity-0 group-hover:opacity-100"
          aria-label="Scroll right"
        >
          <ChevronRight className="h-6 w-6" />
        </button>

        {/* edge fades tipis */}
        <div className="pointer-events-none absolute left-0 top-0 h-full w-10 bg-gradient-to-r from-[var(--bg)] to-transparent z-10" />
        <div className="pointer-events-none absolute right-0 top-0 h-full w-10 bg-gradient-to-l from-[var(--bg)] to-transparent z-10" />
      </div>
    </section>
  );
}
