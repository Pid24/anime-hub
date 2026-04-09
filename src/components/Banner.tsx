"use client";
import Image from "next/image";
import { motion, AnimatePresence } from "framer-motion";
import Link from "next/link";
import type { Media } from "@/lib/anilist";
import { useEffect, useMemo, useState } from "react";
import { htmlToText } from "html-to-text";
import { shimmerDataURL } from "@/lib/shimmer";
import { Play, Star } from "lucide-react";

type Props = { items: Media[]; intervalMs?: number };

export default function Banner({ items, intervalMs = 7000 }: Props) {
  // kandidat slide (utamakan banner HD, fallback extraLarge/large)
  const slides = useMemo(() => {
    const seen = new Set<number>();
    return items
      .filter((m) => {
        if (seen.has(m.id)) return false;
        seen.add(m.id);
        // Hapus fallback coverImage, WAJIB punya bannerImage
        return Boolean(m.bannerImage);
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
  const bg = item.bannerImage;

  const blurURL = shimmerDataURL(1200, 600);
  const progress = slides.length ? ((idx + 1) / slides.length) * 100 : 0;

  return (
    <section
      className="relative h-[55vw] max-h-[560px] min-h-[320px] w-full overflow-hidden"
      onMouseEnter={() => setPaused(true)}
      onMouseLeave={() => setPaused(false)}
    >
      <AnimatePresence mode="wait">
        <motion.div
          key={bg}
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          exit={{ opacity: 0 }}
          transition={{ duration: 0.6 }}
          className="absolute inset-0"
        >
          {bg && (
            <Image
              src={bg}
              alt={title}
              fill
              priority
              quality={90}
              sizes="100vw"
              placeholder="blur"
              blurDataURL={blurURL}
              className="object-cover"
            />
          )}
          {/* Multi-layer gradient for depth */}
          <div className="absolute inset-0 bg-gradient-to-t from-[#080c16] via-black/50 to-transparent" />
          <div className="absolute inset-0 bg-gradient-to-r from-[#080c16]/70 via-transparent to-transparent" />
        </motion.div>
      </AnimatePresence>

      {/* text content */}
      <div className="absolute bottom-0 left-0 right-0 text-white z-10 pointer-events-none">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 pb-10 pointer-events-auto">
          <AnimatePresence mode="wait">
            <motion.div
              key={item.id}
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              exit={{ opacity: 0, y: -10 }}
              transition={{ duration: 0.5, ease: "easeOut" }}
            >
              {/* Meta badge */}
              {item.averageScore && (
                <div className="flex items-center gap-3 mb-3">
                  <span className="inline-flex items-center gap-1.5 px-2.5 py-1 rounded-full bg-white/10 backdrop-blur-sm border border-white/10 text-xs font-semibold">
                    <Star className="h-3 w-3 text-amber-400 fill-amber-400" />
                    {item.averageScore}%
                  </span>
                  {item.genres && item.genres.length > 0 && (
                    <span className="text-xs text-white/60 font-medium">
                      {item.genres.slice(0, 3).join(" • ")}
                    </span>
                  )}
                </div>
              )}

              <h1 className="text-3xl md:text-5xl font-black tracking-tight drop-shadow-[0_4px_12px_rgba(0,0,0,0.8)]">
                {title}
              </h1>
              <p className="mt-2 max-w-2xl text-sm md:text-base text-white/80 leading-relaxed drop-shadow-[0_1px_4px_rgba(0,0,0,0.8)]">
                {desc}
              </p>

              <div className="mt-5 flex items-center gap-3">
                <Link
                  href={`/anime/${item.id}`}
                  className="inline-flex items-center gap-2 px-6 py-2.5 rounded-lg bg-white text-black font-semibold
                             hover:bg-gray-100 transition-colors shadow-[0_4px_12px_rgba(0,0,0,0.3)]"
                >
                  <Play className="h-4 w-4 fill-current" />
                  Lihat Detail
                </Link>
              </div>
            </motion.div>
          </AnimatePresence>
        </div>
      </div>

      {/* Progress bar */}
      <div className="absolute left-0 right-0 bottom-0 z-20">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 pb-3">
          <div className="h-[3px] w-full bg-white/15 rounded-full overflow-hidden">
            <div
              className="h-full rounded-full transition-all duration-500 bg-gradient-to-r from-indigo-400 to-fuchsia-400"
              style={{ width: `${progress}%` }}
            />
          </div>
        </div>
      </div>
    </section>
  );
}
