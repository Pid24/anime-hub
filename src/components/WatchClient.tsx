"use client";

import { useEffect, useState, useCallback } from "react";
import { useRouter, useSearchParams } from "next/navigation";
import Image from "next/image";
import Link from "next/link";
import {
  ArrowLeft,
  ChevronLeft,
  ChevronRight,
  Star,
  Loader2,
  AlertTriangle,
  PlayCircle,
  Download,
  ExternalLink,
  ServerCrash,
} from "lucide-react";
import VideoPlayer from "@/components/VideoPlayer";

type GogoEpisode = {
  id: string;
  number: number;
  title?: string;
};

type StreamSource = {
  url: string;
  quality: string;
  isM3U8: boolean;
};

type SubtitleTrack = {
  url: string;
  lang: string;
};

type AnimeInfo = {
  id: number;
  title: { romaji?: string; english?: string; native?: string };
  coverImage?: { extraLarge?: string; large?: string; color?: string } | null;
  bannerImage?: string | null;
  averageScore?: number | null;
  episodes?: number | null;
  format?: string | null;
  genres?: string[] | null;
  trailer?: { id?: string | null; site?: string | null } | null;
};

export default function WatchClient({ animeId }: { animeId: number }) {
  const router = useRouter();
  const searchParams = useSearchParams();
  const epNum = parseInt(searchParams.get("ep") || "1", 10);

  const [anime, setAnime] = useState<AnimeInfo | null>(null);
  const [episodes, setEpisodes] = useState<GogoEpisode[]>([]);
  const [provider, setProvider] = useState<string>("");
  const [sources, setSources] = useState<StreamSource[]>([]);
  const [subtitles, setSubtitles] = useState<SubtitleTrack[]>([]);
  const [downloadUrl, setDownloadUrl] = useState<string | null>(null);
  const [loadingAnime, setLoadingAnime] = useState(true);
  const [loadingEpisodes, setLoadingEpisodes] = useState(true);
  const [loadingSources, setLoadingSources] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [streamError, setStreamError] = useState<string | null>(null);

  const title = anime
    ? anime.title.english || anime.title.romaji || anime.title.native || "Untitled"
    : "Loading...";

  // YouTube trailer fallback
  const youtubeTrailerId =
    anime?.trailer?.site?.toLowerCase() === "youtube" ? anime.trailer.id : null;

  // 1. Fetch anime info from AniList
  useEffect(() => {
    async function fetchAnime() {
      setLoadingAnime(true);
      try {
        const query = `query($id:Int){Media(id:$id,type:ANIME){id title{romaji english native} coverImage{extraLarge large color} bannerImage averageScore episodes format genres trailer{id site}}}`;
        const res = await fetch("https://graphql.anilist.co", {
          method: "POST",
          headers: { "Content-Type": "application/json" },
          body: JSON.stringify({ query, variables: { id: animeId } }),
        });
        const data = await res.json();
        setAnime(data.data.Media);
      } catch {
        console.error("Failed to fetch anime info");
      } finally {
        setLoadingAnime(false);
      }
    }
    fetchAnime();
  }, [animeId]);

  // 2. Fetch episodes when anime info is loaded
  useEffect(() => {
    if (!anime) return;

    async function fetchEpisodes() {
      setLoadingEpisodes(true);
      try {
        const searchTitle = anime!.title.english || anime!.title.romaji || "";
        const res = await fetch(
          `/api/watch/episodes?title=${encodeURIComponent(searchTitle)}`
        );
        const data = await res.json();
        if (data.found) {
          setEpisodes(data.episodes || []);
          setProvider(data.provider || "");
        } else {
          setError(data.message || "Anime tidak ditemukan di provider manapun.");
        }
      } catch {
        setError("Gagal mengambil daftar episode.");
      } finally {
        setLoadingEpisodes(false);
      }
    }
    fetchEpisodes();
  }, [anime]);

  // 3. Fetch streaming sources when episode changes
  const fetchSources = useCallback(
    async (episodeId: string, providerName: string) => {
      setLoadingSources(true);
      setSources([]);
      setSubtitles([]);
      setStreamError(null);
      try {
        const res = await fetch(
          `/api/watch/sources?episodeId=${encodeURIComponent(episodeId)}&provider=${encodeURIComponent(providerName)}`
        );
        const data = await res.json();
        if (data.found && data.sources?.length > 0) {
          setSources(data.sources);
          setSubtitles(data.subtitles || []);
          setDownloadUrl(data.download || null);
        } else {
          setStreamError(
            data.message || data.error || "Sumber streaming tidak tersedia untuk episode ini."
          );
        }
      } catch {
        setStreamError("Gagal mengambil sumber streaming.");
      } finally {
        setLoadingSources(false);
      }
    },
    []
  );

  // Find current episode and fetch sources
  useEffect(() => {
    if (episodes.length === 0 || !provider) return;
    const currentEp = episodes.find((ep) => ep.number === epNum);
    if (currentEp) {
      fetchSources(currentEp.id, provider);
    } else {
      setStreamError(`Episode ${epNum} tidak tersedia.`);
    }
  }, [episodes, epNum, provider, fetchSources]);

  const currentEpObj = episodes.find((ep) => ep.number === epNum);
  const prevEp = episodes.find((ep) => ep.number === epNum - 1);
  const nextEp = episodes.find((ep) => ep.number === epNum + 1);

  const handleNextEpisode = () => {
    if (nextEp) {
      router.push(`/watch/${animeId}?ep=${nextEp.number}`);
    }
  };

  return (
    <main className="watch-page min-h-screen pb-12 relative">
      {/* Ambient Background */}
      <div className="pointer-events-none fixed inset-0 z-0 overflow-hidden">
        <div className="absolute -top-[200px] -left-[200px] w-[600px] h-[600px] rounded-full bg-indigo-600/6 blur-[150px]" />
        <div className="absolute top-[40%] -right-[150px] w-[400px] h-[400px] rounded-full bg-fuchsia-600/6 blur-[150px]" />
      </div>

      <div className="relative z-10 max-w-[1600px] mx-auto px-4 sm:px-6 lg:px-8 pt-4 md:pt-6">
        {/* Navigation Bar */}
        <div className="flex items-center justify-between mb-4 md:mb-6">
          <Link
            href={`/anime/${animeId}`}
            className="inline-flex items-center gap-2 text-white/60 hover:text-white transition-colors text-sm"
          >
            <ArrowLeft className="h-4 w-4" />
            <span className="hidden sm:inline">Kembali ke Detail</span>
          </Link>

          <div className="flex items-center gap-2">
            {prevEp && (
              <Link
                href={`/watch/${animeId}?ep=${prevEp.number}`}
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
                href={`/watch/${animeId}?ep=${nextEp.number}`}
                className="inline-flex items-center gap-1 px-3 py-1.5 rounded-lg text-xs font-medium
                           bg-indigo-500/15 border border-indigo-500/25 text-indigo-300
                           hover:bg-indigo-500/25 hover:text-white transition-all"
              >
                Eps {nextEp.number}
                <ChevronRight className="h-3.5 w-3.5" />
              </Link>
            )}
          </div>
        </div>

        {/* Main Content Grid */}
        <div className="flex flex-col lg:flex-row gap-4 md:gap-6">
          {/* Video Player Area */}
          <div className="flex-1 min-w-0">
            {/* Now Playing Title */}
            <div className="mb-3 flex items-center gap-3 flex-wrap">
              <h1 className="text-lg md:text-xl font-bold text-white truncate">{title}</h1>
              <span className="shrink-0 text-xs font-semibold text-indigo-300 bg-indigo-500/15 px-2.5 py-1 rounded-full border border-indigo-500/20">
                Episode {epNum}
              </span>
              {provider && (
                <span className="shrink-0 text-[10px] font-medium text-white/30 bg-white/5 px-2 py-0.5 rounded-full border border-white/5">
                  via {provider}
                </span>
              )}
            </div>

            {/* Video Player */}
            {loadingSources || loadingEpisodes || loadingAnime ? (
              <div className="aspect-video w-full bg-black/60 rounded-2xl border border-white/10 flex items-center justify-center">
                <div className="flex flex-col items-center gap-3">
                  <Loader2 className="h-10 w-10 text-indigo-400 animate-spin" />
                  <p className="text-white/50 text-sm">
                    {loadingAnime
                      ? "Memuat info anime..."
                      : loadingEpisodes
                        ? "Mencari episode..."
                        : "Memuat sumber streaming..."}
                  </p>
                </div>
              </div>
            ) : sources.length > 0 ? (
              <VideoPlayer
                sources={sources}
                subtitles={subtitles}
                poster={anime?.bannerImage || anime?.coverImage?.extraLarge || undefined}
                title={`${title} - Episode ${epNum}${currentEpObj?.title ? ` : ${currentEpObj.title}` : ""}`}
                onEnded={handleNextEpisode}
              />
            ) : (streamError || error) ? (
              <div className="aspect-video w-full bg-black/60 rounded-2xl border border-white/10 flex items-center justify-center">
                <div className="flex flex-col items-center gap-4 text-center px-6 max-w-lg">
                  <ServerCrash className="h-12 w-12 text-amber-400/70" />
                  <div>
                    <p className="text-white/80 text-sm font-medium mb-1">Streaming Tidak Tersedia</p>
                    <p className="text-white/40 text-xs leading-relaxed">
                      {streamError || error}
                    </p>
                  </div>

                  {/* YouTube Trailer Fallback */}
                  {youtubeTrailerId && (
                    <div className="w-full mt-2">
                      <p className="text-white/30 text-[10px] uppercase tracking-wider mb-2 font-semibold">
                        Trailer Tersedia
                      </p>
                      <div className="aspect-video w-full max-w-md mx-auto rounded-xl overflow-hidden border border-white/10">
                        <iframe
                          className="w-full h-full"
                          src={`https://www.youtube.com/embed/${youtubeTrailerId}?rel=0`}
                          title="Trailer"
                          allow="accelerometer; autoplay; clipboard-write; encrypted-media; gyroscope; picture-in-picture"
                          allowFullScreen
                        />
                      </div>
                    </div>
                  )}

                  <Link
                    href={`/anime/${animeId}`}
                    className="mt-2 px-4 py-2 rounded-lg text-xs font-medium bg-white/10 border border-white/10 text-white/80 hover:bg-white/15 transition-colors"
                  >
                    Kembali ke Detail
                  </Link>
                </div>
              </div>
            ) : null}

            {/* Action bar below player */}
            {sources.length > 0 && (
              <div className="mt-3 flex flex-wrap items-center gap-2">
                {downloadUrl && (
                  <a
                    href={downloadUrl}
                    target="_blank"
                    rel="noopener noreferrer"
                    className="inline-flex items-center gap-1.5 px-3 py-1.5 rounded-lg text-xs font-medium
                               bg-emerald-500/10 border border-emerald-500/20 text-emerald-400
                               hover:bg-emerald-500/20 transition-all"
                  >
                    <Download className="h-3.5 w-3.5" />
                    Download
                  </a>
                )}
                <a
                  href={`https://anilist.co/anime/${animeId}`}
                  target="_blank"
                  rel="noopener noreferrer"
                  className="inline-flex items-center gap-1.5 px-3 py-1.5 rounded-lg text-xs font-medium
                             bg-white/[0.05] border border-white/[0.08] text-white/50
                             hover:bg-white/10 hover:text-white/80 transition-all"
                >
                  <ExternalLink className="h-3.5 w-3.5" />
                  AniList
                </a>
              </div>
            )}

            {/* Episode title + info (below player, mobile-visible) */}
            {currentEpObj?.title && (
              <div className="mt-3 px-1">
                <p className="text-white/60 text-sm">
                  <span className="text-white/30 font-medium">Episode {epNum}:</span>{" "}
                  {currentEpObj.title}
                </p>
              </div>
            )}

            {/* Anime Info Card (below player on mobile) */}
            {anime && (
              <div className="mt-4 detail-glass-card p-4 flex gap-4 lg:hidden">
                {anime.coverImage?.extraLarge && (
                  <div className="relative shrink-0 w-16 h-24 rounded-lg overflow-hidden">
                    <Image
                      src={anime.coverImage.extraLarge}
                      alt={title}
                      fill
                      className="object-cover"
                      sizes="64px"
                    />
                  </div>
                )}
                <div className="min-w-0">
                  <h3 className="text-sm font-bold text-white line-clamp-1">{title}</h3>
                  <div className="flex flex-wrap items-center gap-2 mt-1 text-xs text-white/50">
                    {anime.averageScore && (
                      <span className="inline-flex items-center gap-1">
                        <Star className="h-3 w-3 text-amber-400 fill-amber-400" />
                        {anime.averageScore}%
                      </span>
                    )}
                    {anime.format && <span>{anime.format}</span>}
                    {anime.episodes && <span>{anime.episodes} Eps</span>}
                  </div>
                  {anime.genres && (
                    <div className="flex flex-wrap gap-1 mt-1.5">
                      {anime.genres.slice(0, 3).map((g) => (
                        <span
                          key={g}
                          className="px-1.5 py-0.5 rounded text-[9px] font-medium bg-white/5 border border-white/5 text-white/40"
                        >
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
                  <PlayCircle className="h-4 w-4 text-indigo-400" />
                  Episode ({episodes.length})
                </h3>
                {provider && (
                  <span className="text-[10px] text-white/25 font-medium">{provider}</span>
                )}
              </div>

              {/* Episode List */}
              <div className="max-h-[65vh] overflow-y-auto hide-scroll">
                {loadingEpisodes ? (
                  <div className="flex items-center justify-center py-12">
                    <Loader2 className="h-5 w-5 text-indigo-400 animate-spin" />
                  </div>
                ) : episodes.length > 0 ? (
                  <div className="p-2 space-y-1">
                    {episodes.map((ep) => {
                      const isActive = ep.number === epNum;
                      return (
                        <Link
                          key={ep.id}
                          href={`/watch/${animeId}?ep=${ep.number}`}
                          className={`flex items-center gap-3 px-3 py-2.5 rounded-lg transition-all duration-200 group ${
                            isActive
                              ? "bg-indigo-500/15 border border-indigo-500/25"
                              : "hover:bg-white/[0.04] border border-transparent"
                          }`}
                        >
                          <div
                            className={`shrink-0 h-8 w-8 rounded-lg flex items-center justify-center text-xs font-bold ${
                              isActive
                                ? "bg-indigo-500/25 text-indigo-300"
                                : "bg-white/[0.04] text-white/40 group-hover:text-white/60"
                            }`}
                          >
                            {ep.number}
                          </div>
                          <div className="min-w-0 flex-1">
                            <p
                              className={`text-sm font-medium truncate ${
                                isActive ? "text-indigo-300" : "text-white/70 group-hover:text-white/90"
                              }`}
                            >
                              {ep.title || `Episode ${ep.number}`}
                            </p>
                          </div>
                          {isActive ? (
                            <span className="shrink-0 inline-flex h-2 w-2 rounded-full bg-indigo-400 animate-pulse" />
                          ) : (
                            <PlayCircle className="shrink-0 h-4 w-4 text-white/15 group-hover:text-white/40 transition-colors" />
                          )}
                        </Link>
                      );
                    })}
                  </div>
                ) : (
                  <div className="flex flex-col items-center justify-center py-12 px-4 text-center">
                    <AlertTriangle className="h-6 w-6 text-amber-400 mb-2" />
                    <p className="text-white/50 text-xs">
                      {error || "Episode tidak tersedia"}
                    </p>
                  </div>
                )}
              </div>
            </div>
          </div>
        </div>
      </div>
    </main>
  );
}
