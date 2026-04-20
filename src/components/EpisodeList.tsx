"use client";

import { useEffect, useState } from "react";
import Link from "next/link";
import { PlayCircle, Loader2, AlertTriangle, Search } from "lucide-react";

type GogoEpisode = {
  id: string;
  number: number;
};

interface EpisodeListProps {
  /** AniList ID anime */
  animeId: number;
  /** Judul anime (untuk search di Gogoanime) */
  animeTitle: string;
  /** Jumlah episode dari AniList (fallback jika Gogo tidak ditemukan) */
  anilistEpisodeCount: number;
  /** Episode yang sedang diputar (opsional, untuk highlight) */
  currentEpisode?: number;
}

export default function EpisodeList({
  animeId,
  animeTitle,
  anilistEpisodeCount,
  currentEpisode,
}: EpisodeListProps) {
  const [episodes, setEpisodes] = useState<GogoEpisode[]>([]);
  const [loading, setLoading] = useState(true);
  const [found, setFound] = useState(false);
  const [providerTitle, setProviderTitle] = useState<string>("");
  const [providerName, setProviderName] = useState<string>("");
  const [searchFilter, setSearchFilter] = useState("");

  useEffect(() => {
    let cancelled = false;

    async function fetchEpisodes() {
      setLoading(true);
      try {
        const res = await fetch(
          `/api/watch/episodes?title=${encodeURIComponent(animeTitle)}`
        );
        if (!res.ok) throw new Error("Failed to fetch");

        const data = await res.json();
        if (!cancelled) {
          setFound(data.found);
          setProviderTitle(data.providerTitle || "");
          setProviderName(data.provider || "");
          setEpisodes(data.episodes || []);
        }
      } catch (err) {
        console.error("Failed to fetch episodes:", err);
        if (!cancelled) {
          setFound(false);
          setEpisodes([]);
        }
      } finally {
        if (!cancelled) setLoading(false);
      }
    }

    fetchEpisodes();
    return () => {
      cancelled = true;
    };
  }, [animeTitle]);

  const episodeCount = found ? episodes.length : Math.max(anilistEpisodeCount, 1);

  // Filter episodes by number
  const filteredEpisodes = searchFilter
    ? episodes.filter((ep) => String(ep.number).includes(searchFilter))
    : episodes;

  // Loading State
  if (loading) {
    return (
      <div className="detail-glass-card p-6 md:p-8">
        <div className="flex items-center justify-between mb-6">
          <h3 className="text-lg font-bold flex items-center gap-3 text-white">
            <span className="w-1 h-6 rounded-full bg-gradient-to-b from-fuchsia-400 to-pink-600" />
            Daftar Episode
          </h3>
        </div>
        <div className="flex items-center justify-center py-12 gap-3">
          <Loader2 className="h-5 w-5 text-indigo-400 animate-spin" />
          <span className="text-white/50 text-sm">Mencari episode streaming...</span>
        </div>
      </div>
    );
  }

  return (
    <div className="detail-glass-card p-6 md:p-8">
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3 mb-6">
        <div className="flex items-center gap-3">
          <h3 className="text-lg font-bold flex items-center gap-3 text-white">
            <span className="w-1 h-6 rounded-full bg-gradient-to-b from-fuchsia-400 to-pink-600" />
            Daftar Episode
          </h3>
          <span className="text-xs font-semibold text-white/30 bg-white/5 px-3 py-1 rounded-full border border-white/5">
            {episodeCount} Episode
          </span>
        </div>

        {/* Status badge */}
        <div className="flex items-center gap-2">
          {found ? (
            <span className="inline-flex items-center gap-1.5 px-3 py-1 rounded-full text-xs font-semibold bg-emerald-500/10 border border-emerald-500/20 text-emerald-400">
              <span className="w-1.5 h-1.5 rounded-full bg-emerald-400 animate-pulse" />
              Streaming Ready
            </span>
          ) : (
            <span className="inline-flex items-center gap-1.5 px-3 py-1 rounded-full text-xs font-semibold bg-amber-500/10 border border-amber-500/20 text-amber-400">
              <AlertTriangle className="h-3 w-3" />
              Sumber Tidak Tersedia
            </span>
          )}
        </div>
      </div>

      {/* Provider match info */}
      {found && providerTitle && (
        <div className="mb-4 px-3 py-2 rounded-lg bg-white/[0.03] border border-white/[0.06] text-xs text-white/40">
          Sumber: <span className="text-white/60 font-medium">{providerTitle}</span>{providerName ? ` via ${providerName}` : ""}
        </div>
      )}

      {/* Search filter (for large episode lists) */}
      {found && episodes.length > 24 && (
        <div className="mb-4 relative">
          <Search className="absolute left-3 top-1/2 -translate-y-1/2 h-4 w-4 text-white/30" />
          <input
            type="text"
            placeholder="Cari episode..."
            value={searchFilter}
            onChange={(e) => setSearchFilter(e.target.value)}
            className="w-full pl-9 pr-4 py-2 rounded-xl bg-white/[0.04] border border-white/[0.08]
                       text-sm text-white/80 placeholder:text-white/30
                       focus:outline-none focus:border-indigo-500/40 focus:bg-white/[0.06]
                       transition-all duration-200"
          />
        </div>
      )}

      {/* Episode Grid */}
      {found && episodes.length > 0 ? (
        <div className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-4 lg:grid-cols-5 xl:grid-cols-6 gap-2.5">
          {filteredEpisodes.map((ep) => {
            const isActive = currentEpisode === ep.number;
            return (
              <Link
                key={ep.id}
                href={`/watch/${animeId}?ep=${ep.number}`}
                className={`group relative rounded-xl overflow-hidden
                           px-4 py-3.5 transition-all duration-300
                           text-sm font-medium flex items-center justify-between
                           ${
                             isActive
                               ? "bg-gradient-to-br from-indigo-500/25 to-fuchsia-500/15 border border-indigo-500/40 shadow-lg shadow-indigo-500/10"
                               : "bg-white/[0.03] border border-white/[0.06] hover:bg-gradient-to-br hover:from-indigo-500/15 hover:to-fuchsia-500/10 hover:border-indigo-500/30"
                           }`}
              >
                <span
                  className={`transition-colors ${
                    isActive
                      ? "text-indigo-300 font-semibold"
                      : "text-white/60 group-hover:text-white"
                  }`}
                >
                  Eps {ep.number}
                </span>
                <PlayCircle
                  className={`h-4 w-4 transition-all duration-300 ${
                    isActive
                      ? "text-indigo-400 scale-110"
                      : "text-white/20 group-hover:text-indigo-400 group-hover:scale-110"
                  }`}
                />
                {/* Hover glow */}
                <div
                  className="absolute inset-0 opacity-0 group-hover:opacity-100 transition-opacity duration-500
                               bg-gradient-to-r from-indigo-500/5 to-transparent pointer-events-none"
                />
              </Link>
            );
          })}
        </div>
      ) : !found ? (
        /* Fallback: dummy episode grid (same as original) */
        <div className="space-y-4">
          <div className="px-3 py-2 rounded-lg bg-amber-500/5 border border-amber-500/10 text-xs text-amber-400/80">
            Episode streaming tidak tersedia dari provider manapun. Menampilkan daftar placeholder.
          </div>
          <div className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-4 lg:grid-cols-5 xl:grid-cols-6 gap-2.5">
            {Array.from({ length: episodeCount }).map((_, i) => (
              <div
                key={i}
                className="group relative rounded-xl overflow-hidden
                          bg-white/[0.03] border border-white/[0.06]
                          px-4 py-3.5 text-sm font-medium flex items-center justify-between
                          opacity-50 cursor-not-allowed"
              >
                <span className="text-white/40">Eps {i + 1}</span>
                <PlayCircle className="h-4 w-4 text-white/10" />
              </div>
            ))}
          </div>
        </div>
      ) : null}
    </div>
  );
}
