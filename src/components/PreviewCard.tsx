"use client";
import Image from "next/image";
import Link from "next/link";
import type { Media } from "@/lib/anilist";
import { useEffect, useRef, useState } from "react";

export default function PreviewCard({ m }: { m: Media }) {
  const title = m.title.english || m.title.romaji || m.title.native || "Untitled";
  const [play, setPlay] = useState(false);
  const [hovered, setHovered] = useState(false);
  const tRef = useRef<number | null>(null);

  // Delay 350ms sebelum play biar gak flicker
  useEffect(() => {
    if (hovered) {
      tRef.current = window.setTimeout(() => setPlay(true), 350);
    } else {
      if (tRef.current) window.clearTimeout(tRef.current);
      setPlay(false);
    }
    return () => {
      if (tRef.current) window.clearTimeout(tRef.current);
    };
  }, [hovered]);

  const youTubeId = m.trailer?.site === "youtube" ? m.trailer.id : undefined;

  return (
    <div className="snap-start shrink-0 w-40 sm:w-44 md:w-48 lg:w-56" onMouseEnter={() => setHovered(true)} onMouseLeave={() => setHovered(false)}>
      <div className="card relative aspect-[2/3] transition-transform duration-300 hover:scale-[1.04] overflow-hidden">
        {/* Media area */}
        <div className="absolute inset-0">
          {play && youTubeId ? (
            <iframe className="w-full h-full" src={`https://www.youtube.com/embed/${youTubeId}?autoplay=1&mute=1&controls=0&rel=0&playsinline=1`} title="Trailer preview" allow="autoplay; encrypted-media; picture-in-picture; web-share" />
          ) : m.coverImage?.extraLarge || m.coverImage?.large ? (
            <Image src={m.coverImage.extraLarge ?? m.coverImage.large!} alt={title} fill sizes="240px" className="object-cover" />
          ) : null}
          {/* Gradient bawah untuk teks */}
          <div className="absolute inset-x-0 bottom-0 h-24 bg-gradient-to-t from-black/85 to-transparent" />
        </div>

        {/* Info compact (TEKS PUTIH + shadow) */}
        <div className="absolute inset-x-0 bottom-0 p-2 text-[11px] leading-tight text-white drop-shadow-[0_1px_4px_rgba(0,0,0,0.9)]">
          <div className="font-semibold line-clamp-2">{title}</div>
          <div className="text-white/90 mt-1">
            {m.seasonYear ?? "—"} • {m.format ?? "TV"}
            {m.averageScore ? ` • ${m.averageScore}%` : ""}
          </div>
          {m.genres && m.genres.length > 0 && (
            <div className="mt-1 flex flex-wrap gap-1">
              {m.genres.slice(0, 3).map((g) => (
                <span key={g} className="px-1.5 py-0.5 rounded bg-white/20 border border-white/20 text-white/95">
                  {g}
                </span>
              ))}
            </div>
          )}
          <div className="mt-2">
            <Link href={`/anime/${m.id}`} className="inline-block px-2 py-1 rounded bg-white text-black font-semibold">
              Detail
            </Link>
          </div>
        </div>
      </div>
    </div>
  );
}
