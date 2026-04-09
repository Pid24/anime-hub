"use client";

import { useCallback, useEffect, useRef, useState } from "react";
import Image from "next/image";
import Link from "next/link";
import { motion, AnimatePresence } from "framer-motion";
import { Loader2 } from "lucide-react";
import type { Media, PageInfo } from "@/lib/anilist";

interface AnimeInfiniteGridProps {
  /** Initial data rendered on the server */
  initialItems: Media[];
  /** Initial pagination info */
  initialPageInfo: PageInfo;
  /** Which section to fetch: "seasonal" | "popular" */
  section: "seasonal" | "popular";
  /** Items per page */
  perPage?: number;
}

export default function AnimeInfiniteGrid({
  initialItems,
  initialPageInfo,
  section,
  perPage = 24,
}: AnimeInfiniteGridProps) {
  const [items, setItems] = useState<Media[]>(initialItems);
  const [pageInfo, setPageInfo] = useState<PageInfo>(initialPageInfo);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const sentinelRef = useRef<HTMLDivElement>(null);

  const loadMore = useCallback(async () => {
    if (loading || !pageInfo.hasNextPage) return;

    setLoading(true);
    setError(null);

    try {
      const nextPage = pageInfo.currentPage + 1;
      const res = await fetch(
        `/api/anime/browse?section=${section}&page=${nextPage}&perPage=${perPage}`
      );
      const json = await res.json();

      if (!json.ok) throw new Error(json.error || "Failed to fetch");

      const newItems = json.data as Media[];

      // Deduplicate by id
      setItems((prev) => {
        const existingIds = new Set(prev.map((m) => m.id));
        const unique = newItems.filter((m: Media) => !existingIds.has(m.id));
        return [...prev, ...unique];
      });

      setPageInfo(json.pageInfo as PageInfo);
    } catch (err) {
      setError(err instanceof Error ? err.message : "Terjadi kesalahan");
    } finally {
      setLoading(false);
    }
  }, [loading, pageInfo, section, perPage]);

  // Intersection Observer for infinite scroll
  useEffect(() => {
    const sentinel = sentinelRef.current;
    if (!sentinel) return;

    const observer = new IntersectionObserver(
      (entries) => {
        if (entries[0].isIntersecting) {
          loadMore();
        }
      },
      { rootMargin: "400px" } // Pre-fetch 400px before user reaches the bottom
    );

    observer.observe(sentinel);
    return () => observer.disconnect();
  }, [loadMore]);

  const cardVariants = {
    hidden: { opacity: 0, y: 24, scale: 0.96 },
    visible: (i: number) => ({
      opacity: 1,
      y: 0,
      scale: 1,
      transition: {
        delay: i * 0.03,
        duration: 0.4,
        ease: [0.25, 0.46, 0.45, 0.94] as [number, number, number, number],
      },
    }),
  };

  return (
    <>
      <div className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-4 lg:grid-cols-5 xl:grid-cols-6 gap-x-4 gap-y-8">
        <AnimatePresence mode="popLayout">
          {items.map((a, i) => (
            <motion.div
              key={a.id}
              custom={i % perPage}
              variants={cardVariants}
              initial={i >= initialItems.length ? "hidden" : false}
              animate="visible"
              layout
              className="flex justify-center"
            >
              <Link
                href={`/anime/${a.id}`}
                className="group w-full max-w-[224px]"
              >
                <div className="relative aspect-[2/3] w-full rounded-xl transition-all duration-300 group-hover:scale-[1.04] group-hover:shadow-2xl group-hover:shadow-indigo-500/10 overflow-hidden bg-white/5 border border-white/10 group-hover:border-indigo-500/30">
                  <Image
                    src={a.coverImage?.extraLarge || a.coverImage?.large || ""}
                    alt={a.title.romaji || "Poster"}
                    fill
                    className="object-cover transition-transform duration-500 group-hover:scale-[1.08]"
                    sizes="(max-width: 640px) 50vw, (max-width: 1024px) 25vw, 16vw"
                  />
                  {/* Gradient overlay */}
                  <div className="absolute inset-x-0 bottom-0 h-28 bg-gradient-to-t from-black/90 via-black/40 to-transparent" />

                  {/* Score badge */}
                  {a.averageScore && (
                    <div className="absolute top-2 left-2 flex items-center gap-1 rounded-full px-2 py-0.5 text-[10px] font-bold bg-black/60 backdrop-blur-sm border border-white/10">
                      <span className="text-yellow-400">★</span>
                      <span>{a.averageScore}%</span>
                    </div>
                  )}

                  {/* Info overlay */}
                  <div className="absolute inset-x-0 bottom-0 p-3 text-[12px] leading-tight text-white drop-shadow-[0_1px_4px_rgba(0,0,0,0.9)]">
                    <div className="font-semibold line-clamp-2 mb-1 group-hover:text-indigo-300 transition-colors">
                      {a.title.english || a.title.romaji}
                    </div>
                    <div className="text-white/70 text-[11px] flex items-center gap-1.5">
                      <span>{a.seasonYear ?? "—"}</span>
                      <span className="w-0.5 h-0.5 rounded-full bg-white/40" />
                      <span>{a.format ?? "TV"}</span>
                      {a.episodes && (
                        <>
                          <span className="w-0.5 h-0.5 rounded-full bg-white/40" />
                          <span>{a.episodes} eps</span>
                        </>
                      )}
                    </div>
                  </div>
                </div>
              </Link>
            </motion.div>
          ))}
        </AnimatePresence>
      </div>

      {/* Sentinel for IntersectionObserver + Loading indicator */}
      <div ref={sentinelRef} className="flex flex-col items-center justify-center py-12">
        {loading && (
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            className="flex items-center gap-3 text-white/60"
          >
            <Loader2 className="w-5 h-5 animate-spin text-indigo-400" />
            <span className="text-sm font-medium">Memuat lebih banyak...</span>
          </motion.div>
        )}

        {error && (
          <motion.div
            initial={{ opacity: 0, y: 8 }}
            animate={{ opacity: 1, y: 0 }}
            className="text-center space-y-3"
          >
            <p className="text-red-400 text-sm">{error}</p>
            <button
              onClick={loadMore}
              className="px-5 py-2 text-sm font-medium rounded-full bg-indigo-500/20 text-indigo-300 border border-indigo-500/30 hover:bg-indigo-500/30 transition-all duration-200"
            >
              Coba Lagi
            </button>
          </motion.div>
        )}

        {!pageInfo.hasNextPage && items.length > 0 && (
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            transition={{ delay: 0.3 }}
            className="flex items-center gap-3 text-white/30"
          >
            <div className="h-px w-12 bg-gradient-to-r from-transparent to-white/20" />
            <span className="text-xs font-medium tracking-wider uppercase">
              Semua data telah dimuat
            </span>
            <div className="h-px w-12 bg-gradient-to-l from-transparent to-white/20" />
          </motion.div>
        )}
      </div>
    </>
  );
}
