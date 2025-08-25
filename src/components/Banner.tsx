"use client";
import Image from "next/image";
import { motion, AnimatePresence } from "framer-motion";
import Link from "next/link";
import type { Media } from "@/lib/anilist";
import { useEffect, useMemo, useState } from "react";
import { htmlToText } from "html-to-text";
import { shimmerDataURL } from "@/lib/shimmer";

type Props = { items: Media[]; intervalMs?: number };

export default function Banner({ items, intervalMs = 7000 }: Props) {
  // kandidat slide (utamakan banner HD, fallback extraLarge/large)
  const slides = useMemo(() => {
    const seen = new Set<number>();
    return items
      .filter((m) => {
        if (seen.has(m.id)) return false;
        seen.add(m.id);
        return Boolean(m.bannerImage || m.coverImage?.extraLarge || m.coverImage?.large);
      })
      .slice(0, 50);
  }, [items]);

  const [idx, setIdx] = useState(0);
  const [paused, setPaused] = useState(false);

  // auto-rotate
  useEffect(() => {
    if (slides.length <= 1 || paused) return;
    const id = window.setInterval(() => setIdx((i) => (i + 1) % slides.length), intervalMs);
    return () => window.clearInterval(id);
  }, [slides.length, intervalMs, paused]);

  const item = slides[idx];
  if (!item) return null;

  const title = item.title.english || item.title.romaji || item.title.native || "Untitled";
  const descRaw = item.description ? htmlToText(item.description, { wordwrap: 100 }) : "";
  const desc = descRaw.slice(0, 180) + (descRaw.length > 180 ? "…" : "");
  const bg = item.bannerImage || item.coverImage?.extraLarge || item.coverImage?.large;

  const blurURL = shimmerDataURL(1200, 600);
  const progress = slides.length ? ((idx + 1) / slides.length) * 100 : 0; // <-- 1 garis progress

  return (
    <section className="relative h-[55vw] max-h-[560px] min-h-[320px] w-full overflow-hidden" onMouseEnter={() => setPaused(true)} onMouseLeave={() => setPaused(false)}>
      <AnimatePresence mode="wait">
        <motion.div key={bg} initial={{ opacity: 0 }} animate={{ opacity: 1 }} exit={{ opacity: 0 }} transition={{ duration: 0.6 }} className="absolute inset-0">
          {bg && <Image src={bg} alt={title} fill priority quality={90} sizes="100vw" placeholder="blur" blurDataURL={blurURL} className="object-cover" />}
          <div className="absolute inset-0 bg-gradient-to-t from-black/90 via-black/60 to-transparent" />
        </motion.div>
      </AnimatePresence>

      {/* text */}
      <div className="absolute bottom-0 left-0 right-0 text-white">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 pb-8">
          <motion.h1 initial={{ opacity: 0, y: 10 }} animate={{ opacity: 1, y: 0 }} transition={{ type: "spring", damping: 18 }} className="text-3xl md:text-5xl font-extrabold drop-shadow-[0_2px_6px_rgba(0,0,0,0.8)]">
            {title}
          </motion.h1>
          <p className="mt-2 max-w-2xl text-sm md:text-base text-white/90 drop-shadow-[0_1px_4px_rgba(0,0,0,0.8)]">{desc}</p>
          <div className="mt-4 flex items-center gap-3">
            <Link href={`/anime/${item.id}`} className="px-5 py-2.5 rounded-lg bg-white text-black font-semibold">
              Lihat Detail
            </Link>
          </div>
        </div>
      </div>

      {/* === Single progress bar (ganti dot-dot) === */}
      <div className="absolute left-0 right-0 bottom-2">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="h-[3px] w-full bg-white/30 rounded-full overflow-hidden">
            <div className="h-full bg-white rounded-full transition-all duration-500" style={{ width: `${progress}%` }} />
          </div>
        </div>
      </div>
    </section>
  );
}
