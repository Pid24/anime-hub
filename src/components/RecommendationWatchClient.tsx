"use client";

import { useEffect, useState, useCallback } from "react";
import { useSearchParams, useRouter } from "next/navigation";
import Link from "next/link";
import Image from "next/image";
import { ArrowLeft, ChevronLeft, ChevronRight, Play, PlayCircle, Star, Calendar, Tv, Sparkles, Loader2 } from "lucide-react";
import { type RecommendedAnime, gdriveEmbedUrl } from "@/lib/recommendations";

type AnimeInfo = {
  id: number;
  title: { romaji?: string; english?: string; native?: string };
  coverImage?: { extraLarge?: string; large?: string; color?: string } | null;
  bannerImage?: string | null;
  averageScore?: number | null;
  episodes?: number | null;
  format?: string | null;
  seasonYear?: number | null;
  genres?: string[] | null;
  description?: string | null;
};

interface RecommendationWatchClientProps {
  anime: RecommendedAnime;
}

export default function RecommendationWatchClient({ anime }: RecommendationWatchClientProps) {
  const searchParams = useSearchParams();
  const router = useRouter();
  const epNum = parseInt(searchParams.get("ep") || "1", 10);

  const [anilistData, setAnilistData] = useState<AnimeInfo | null>(null);
  const [loadingInfo, setLoadingInfo] = useState(true);

  const currentEp = anime.episodes.find((e) => e.number === epNum);
  const prevEp = anime.episodes.find((e) => e.number === epNum - 1);
  const nextEp = anime.episodes.find((e) => e.number === epNum + 1);

  // Fetch anime metadata from AniList
  useEffect(() => {
    async function fetchAnimeInfo() {
      setLoadingInfo(true);
      try {
        const query = `query($id:Int){Media(id:$id,type:ANIME){id title{romaji english native} coverImage{extraLarge large color} bannerImage averageScore episodes format seasonYear genres description}}`;
        const res = await fetch("https://graphql.anilist.co", {
          method: "POST",
          headers: { "Content-Type": "application/json" },
          body: JSON.stringify({ query, variables: { id: anime.anilistId } }),
        });
        const data = await res.json();
        setAnilistData(data.data.Media);
      } catch {
        console.error("Failed to fetch anime info from AniList");
      } finally {
        setLoadingInfo(false);
      }
    }
    fetchAnimeInfo();
  }, [anime.anilistId]);

  const title = anilistData ? anilistData.title.english || anilistData.title.romaji || anilistData.title.native || "Loading..." : "Loading...";

  const cover = anilistData?.coverImage?.extraLarge || anilistData?.coverImage?.large || "";
  const score = anilistData?.averageScore ?? 0;

  const handleNextEpisode = useCallback(() => {
    if (nextEp) {
      router.push(`/recommendation/${anime.slug}?ep=${nextEp.number}`);
    }
  }, [nextEp, anime.slug, router]);

  if (!currentEp) {
    return (
      <main className="watch-page min-h-screen flex items-center justify-center">
        <div className="text-center">
          <p className="text-white/50 text-sm">Episode {epNum} tidak tersedia.</p>
          <Link href={`/recommendation/${anime.slug}?ep=1`} className="mt-4 inline-flex items-center gap-2 text-sm text-amber-400 hover:text-amber-300">
            <ArrowLeft className="h-4 w-4" />
            Kembali ke Episode 1
          </Link>
        </div>
      </main>
    );
  }

  return (
    <main className="watch-page min-h-screen pb-12 relative">
      {/* Ambient Background */}
      <div className="pointer-events-none fixed inset-0 z-0 overflow-hidden">
        <div className="absolute -top-[200px] -left-[200px] w-[600px] h-[600px] rounded-full bg-amber-600/[0.06] blur-[150px]" />
        <div className="absolute top-[40%] -right-[150px] w-[400px] h-[400px] rounded-full bg-fuchsia-600/[0.05] blur-[150px]" />
      </div>

      <div className="relative z-10 max-w-[1600px] mx-auto px-4 sm:px-6 lg:px-8 pt-4 md:pt-6">
        {/* Top Navigation */}
        <div className="flex items-center justify-between mb-4 md:mb-6">
          <Link href={`/anime/${anime.anilistId}`} className="inline-flex items-center gap-2 text-white/60 hover:text-white transition-colors text-sm">
            <ArrowLeft className="h-4 w-4" />
            <span className="hidden sm:inline">Kembali ke Detail</span>
          </Link>

          <div className="flex items-center gap-2">
            {prevEp && (
              <Link
                href={`/recommendation/${anime.slug}?ep=${prevEp.number}`}
                className="inline-flex items-center gap-1 px-3 py-1.5 rounded-lg text-xs font-medium
                           bg-white/[0.05] border border-white/[0.08] text-white/60
                           hover:bg-white/10 hover:text-white transition-all"
              >
                <ChevronLeft className="h-3.5 w-3.5" />
                Eps {prevEp.number}
              </Link>
            )}
            {nextEp && (
              <Link
                href={`/recommendation/${anime.slug}?ep=${nextEp.number}`}
                className="inline-flex items-center gap-1 px-3 py-1.5 rounded-lg text-xs font-medium
                           bg-amber-500/15 border border-amber-500/25 text-amber-300
                           hover:bg-amber-500/25 hover:text-white transition-all"
              >
                Eps {nextEp.number}
                <ChevronRight className="h-3.5 w-3.5" />
              </Link>
            )}
          </div>
        </div>

        {/* Main Layout */}
        <div className="flex flex-col lg:flex-row gap-4 md:gap-6">
          {/* Player Area */}
          <div className="flex-1 min-w-0">
            {/* Title bar */}
            <div className="mb-3 flex items-center gap-3 flex-wrap">
              <h1 className="text-lg md:text-xl font-bold text-white truncate">{loadingInfo ? "Memuat..." : title}</h1>
              <span className="shrink-0 text-xs font-semibold text-amber-300 bg-amber-500/15 px-2.5 py-1 rounded-full border border-amber-500/20">Episode {epNum}</span>
            </div>

            {/* Google Drive iFrame Player */}
            <div className="video-container relative aspect-video w-full bg-black rounded-2xl overflow-hidden border border-white/10">
              <iframe src={gdriveEmbedUrl(currentEp.gdriveFileId)} className="w-full h-full" allow="autoplay; encrypted-media" allowFullScreen title={`${title} - Episode ${epNum}`} sandbox="allow-scripts allow-same-origin allow-popups" />
            </div>

            {/* Action bar */}
            <div className="mt-3 flex flex-wrap items-center gap-2">
              {nextEp && (
                <button
                  onClick={handleNextEpisode}
                  className="inline-flex items-center gap-1.5 px-3 py-1.5 rounded-lg text-xs font-medium
                             bg-amber-500/10 border border-amber-500/20 text-amber-400
                             hover:bg-amber-500/20 transition-all"
                >
                  <Play className="h-3.5 w-3.5 fill-current" />
                  Episode Selanjutnya
                </button>
              )}
            </div>

            {/* Episode title */}
            <div className="mt-3 px-1">
              <p className="text-white/60 text-sm">
                <span className="text-white/30 font-medium">Episode {epNum}:</span> {currentEp.title}
              </p>
            </div>

            {/* Anime Info Card (mobile only) */}
            {anilistData && (
              <div className="mt-4 detail-glass-card p-4 flex gap-4 lg:hidden">
                {cover && (
                  <div className="relative shrink-0 w-16 h-24 rounded-lg overflow-hidden">
                    <Image src={cover} alt={title} fill className="object-cover" sizes="64px" />
                  </div>
                )}
                <div className="min-w-0">
                  <h3 className="text-sm font-bold text-white line-clamp-1">{title}</h3>
                  <div className="flex flex-wrap items-center gap-2 mt-1 text-xs text-white/50">
                    {score > 0 && (
                      <span className="inline-flex items-center gap-1">
                        <Star className="h-3 w-3 text-amber-400 fill-amber-400" />
                        {score}%
                      </span>
                    )}
                    {anilistData.seasonYear && (
                      <span className="inline-flex items-center gap-1">
                        <Calendar className="h-3 w-3" />
                        {anilistData.seasonYear}
                      </span>
                    )}
                    {anilistData.format && (
                      <span className="inline-flex items-center gap-1">
                        <Tv className="h-3 w-3" />
                        {anilistData.format}
                      </span>
                    )}
                  </div>
                  {anilistData.genres && (
                    <div className="flex flex-wrap gap-1 mt-1.5">
                      {anilistData.genres.slice(0, 3).map((g) => (
                        <span key={g} className="px-1.5 py-0.5 rounded text-[9px] font-medium bg-white/5 border border-white/5 text-white/40">
                          {g}
                        </span>
                      ))}
                    </div>
                  )}
                </div>
              </div>
            )}
          </div>

          {/* Episode Sidebar */}
          <div className="lg:w-[340px] xl:w-[380px] shrink-0">
            <div className="detail-glass-card overflow-hidden">
              {/* Sidebar Header */}
              <div className="flex items-center justify-between p-4 border-b border-white/[0.06]">
                <h3 className="text-sm font-bold text-white flex items-center gap-2">
                  <PlayCircle className="h-4 w-4 text-amber-400" />
                  Episode ({anime.episodes.length})
                </h3>
                <span className="inline-flex items-center gap-1 text-[10px] text-amber-400/50 font-medium">
                  <Sparkles className="h-2.5 w-2.5" />
                  {anime.badge}
                </span>
              </div>

              {/* Episode List */}
              <div className="max-h-[65vh] overflow-y-auto hide-scroll">
                <div className="p-2 space-y-1">
                  {anime.episodes.map((ep) => {
                    const isActive = ep.number === epNum;
                    return (
                      <Link
                        key={ep.number}
                        href={`/recommendation/${anime.slug}?ep=${ep.number}`}
                        className={`flex items-center gap-3 px-3 py-2.5 rounded-lg transition-all duration-200 group ${isActive ? "bg-amber-500/15 border border-amber-500/25" : "hover:bg-white/[0.04] border border-transparent"}`}
                      >
                        <div className={`shrink-0 h-8 w-8 rounded-lg flex items-center justify-center text-xs font-bold ${isActive ? "bg-amber-500/25 text-amber-300" : "bg-white/[0.04] text-white/40 group-hover:text-white/60"}`}>
                          {ep.number}
                        </div>
                        <div className="min-w-0 flex-1">
                          <p className={`text-sm font-medium truncate ${isActive ? "text-amber-300" : "text-white/70 group-hover:text-white/90"}`}>{ep.title}</p>
                        </div>
                        {isActive ? <span className="shrink-0 inline-flex h-2 w-2 rounded-full bg-amber-400 animate-pulse" /> : <PlayCircle className="shrink-0 h-4 w-4 text-white/15 group-hover:text-white/40 transition-colors" />}
                      </Link>
                    );
                  })}
                </div>
              </div>
            </div>

            {/* Anime Info Card (desktop sidebar) — from AniList */}
            {loadingInfo ? (
              <div className="hidden lg:flex mt-4 detail-glass-card p-6 items-center justify-center">
                <Loader2 className="h-5 w-5 text-amber-400 animate-spin" />
              </div>
            ) : (
              anilistData && (
                <div className="hidden lg:block mt-4 detail-glass-card p-4">
                  <div className="flex gap-3">
                    {cover && (
                      <div className="relative shrink-0 w-14 h-20 rounded-lg overflow-hidden">
                        <Image src={cover} alt={title} fill className="object-cover" sizes="56px" />
                      </div>
                    )}
                    <div className="min-w-0">
                      <h4 className="text-xs font-bold text-white line-clamp-2">{title}</h4>
                      <div className="flex items-center gap-2 mt-1 text-[10px] text-white/40">
                        {score > 0 && (
                          <span className="inline-flex items-center gap-0.5">
                            <Star className="h-2.5 w-2.5 text-amber-400 fill-amber-400" />
                            {score}%
                          </span>
                        )}
                        {anilistData.seasonYear && <span>{anilistData.seasonYear}</span>}
                        {anilistData.format && <span>{anilistData.format}</span>}
                      </div>
                    </div>
                  </div>
                </div>
              )
            )}
          </div>
        </div>
      </div>
    </main>
  );
}
