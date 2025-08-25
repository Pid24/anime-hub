"use client";
import Image from "next/image";
import Link from "next/link";
import type { Media } from "@/lib/anilist";
import { useEffect, useRef, useState } from "react";
import { Volume2, VolumeX } from "lucide-react";

const AUDIO_KEY = "ah:audio"; // on|off

export default function PreviewCard({ m }: { m: Media }) {
  const title = m.title.english || m.title.romaji || m.title.native || "Untitled";

  const [hovered, setHovered] = useState(false);
  const [play, setPlay] = useState(false);
  const [audioOn, setAudioOn] = useState(false);
  const [origin, setOrigin] = useState<string>("");
  const iframeRef = useRef<HTMLIFrameElement | null>(null);
  const hoverTimer = useRef<number | null>(null);

  const youTubeId = m.trailer?.site?.toLowerCase() === "youtube" ? m.trailer.id ?? undefined : undefined;

  // load user audio pref
  useEffect(() => {
    setAudioOn(typeof window !== "undefined" && localStorage.getItem(AUDIO_KEY) === "on");
    if (typeof window !== "undefined") setOrigin(window.location.origin);
  }, []);

  // small delay before actually playing (biar gak flicker pas lewat doang)
  useEffect(() => {
    const isCoarse = typeof window !== "undefined" && window.matchMedia?.("(pointer: coarse)").matches;
    if (isCoarse) {
      setPlay(false);
      return;
    } // disable autoplay on touch devices

    if (hovered) {
      hoverTimer.current = window.setTimeout(() => setPlay(true), 350);
    } else {
      if (hoverTimer.current) window.clearTimeout(hoverTimer.current);
      setPlay(false);
    }
    return () => {
      if (hoverTimer.current) window.clearTimeout(hoverTimer.current);
    };
  }, [hovered]);

  // ketika sudah playing & user mengizinkan audio → unmute via YT API
  useEffect(() => {
    if (!play || !audioOn || !iframeRef.current) return;
    // YouTube Iframe API via postMessage
    const post = (func: string) => {
      iframeRef.current?.contentWindow?.postMessage(JSON.stringify({ event: "command", func, args: [] }), "*");
    };
    // unmute + pastikan sedang play
    post("unMute");
    post("playVideo");
  }, [play, audioOn]);

  function enableAudio() {
    // klik tombol ini adalah user gesture → ijinkan audio
    setAudioOn(true);
    try {
      localStorage.setItem(AUDIO_KEY, "on");
    } catch {}
    // kalau lagi playing, langsung unmute
    if (iframeRef.current) {
      iframeRef.current.contentWindow?.postMessage(JSON.stringify({ event: "command", func: "unMute", args: [] }), "*");
    }
  }

  const iframeSrc = youTubeId ? `https://www.youtube.com/embed/${youTubeId}?autoplay=1&mute=1&controls=0&rel=0&playsinline=1&enablejsapi=1&origin=${origin}` : "";

  return (
    <div className="snap-start shrink-0 w-40 sm:w-44 md:w-48 lg:w-56" onMouseEnter={() => setHovered(true)} onMouseLeave={() => setHovered(false)}>
      <div className="card relative aspect-[2/3] transition-transform duration-300 hover:scale-[1.04] overflow-hidden">
        {/* media area */}
        <div className="absolute inset-0">
          {play && youTubeId ? (
            <iframe ref={iframeRef} className="w-full h-full" src={iframeSrc} title="Trailer preview" allow="autoplay; encrypted-media; picture-in-picture; web-share" />
          ) : m.coverImage?.extraLarge || m.coverImage?.large ? (
            <Image src={m.coverImage.extraLarge ?? m.coverImage.large!} alt={title} fill sizes="240px" className="object-cover" />
          ) : null}
          {/* gradient bawah utk teks */}
          <div className="absolute inset-x-0 bottom-0 h-24 bg-gradient-to-t from-black/85 to-transparent" />
        </div>

        {/* tombol speaker (muncul saat hover) */}
        {youTubeId && (
          <button
            onClick={(e) => {
              e.stopPropagation();
              e.preventDefault();
              enableAudio();
            }}
            className="absolute top-2 right-2 z-20 h-8 w-8 rounded-full bg-black/60 border border-white/20 flex items-center justify-center text-white opacity-0 group-hover:opacity-100 hover:bg-black/70"
            title={audioOn ? "Suara aktif" : "Aktifkan suara"}
            aria-label={audioOn ? "Suara aktif" : "Aktifkan suara"}
          >
            {audioOn ? <Volume2 className="h-4 w-4" /> : <VolumeX className="h-4 w-4" />}
          </button>
        )}

        {/* info compact (teks putih) */}
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
