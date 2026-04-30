import Image from "next/image";
import Link from "next/link";
import { Sparkles, Play, Star, Calendar, Tv } from "lucide-react";
import { RECOMMENDED_ANIME } from "@/lib/recommendations";
import { fetchAnimeById } from "@/lib/anilist";
import { htmlToText } from "html-to-text";

export const metadata = {
  title: "Rekomendasi — AnimeHub",
  description: "Koleksi anime pilihan Admin yang bisa langsung ditonton. Kualitas terbaik, tanpa buffering.",
};

export default async function RecommendationPage() {
  // Fetch metadata dari AniList untuk semua anime yang direkomendasikan
  const animeDataList = await Promise.all(
    RECOMMENDED_ANIME.map(async (rec) => {
      try {
        const data = await fetchAnimeById(rec.anilistId);
        return { rec, data };
      } catch {
        return { rec, data: null };
      }
    })
  );

  return (
    <main className="detail-page min-h-screen pb-16 relative">
      {/* Ambient Background */}
      <div className="pointer-events-none fixed inset-0 z-0 overflow-hidden">
        <div className="absolute -top-[200px] -left-[200px] w-[600px] h-[600px] rounded-full bg-amber-500/[0.06] blur-[150px]" />
        <div className="absolute top-[40%] -right-[150px] w-[400px] h-[400px] rounded-full bg-fuchsia-600/[0.06] blur-[150px]" />
        <div className="absolute bottom-[10%] left-[30%] w-[500px] h-[500px] rounded-full bg-indigo-600/[0.04] blur-[180px]" />
      </div>

      <div className="relative z-10 max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 pt-24 md:pt-28">
        {/* Page Header */}
        <div className="text-center mb-12 md:mb-16">
          <div className="inline-flex items-center gap-2 px-4 py-1.5 rounded-full bg-amber-500/10 border border-amber-500/20 text-amber-400 text-xs font-semibold mb-4">
            <Sparkles className="h-3.5 w-3.5" />
            Koleksi Pilihan Admin
          </div>
          <h1 className="text-3xl md:text-5xl font-extrabold text-white tracking-tight">
            Rekomendasi{" "}
            <span className="bg-[linear-gradient(90deg,#fbbf24,#f59e0b,#d97706)] bg-clip-text text-transparent">
              Anime
            </span>
          </h1>
          <p className="mt-3 text-white/50 text-sm md:text-base max-w-xl mx-auto leading-relaxed">
            Anime terpilih yang bisa langsung kamu tonton dengan kualitas terbaik. Dikelola langsung oleh Admin AnimeHub.
          </p>
        </div>

        {/* Anime Cards */}
        <div className="grid grid-cols-1 gap-6 md:gap-8">
          {animeDataList.map(({ rec, data }) => {
            if (!data) return null;

            const title = data.title.english || data.title.romaji || data.title.native || "Untitled";
            const altTitle = data.title.romaji && data.title.romaji !== title ? data.title.romaji : data.title.native || "";
            const desc = data.description ? htmlToText(data.description, { wordwrap: false }) : "";
            const banner = data.bannerImage || data.coverImage?.extraLarge || "";
            const cover = data.coverImage?.extraLarge || data.coverImage?.large || "";
            const score = data.averageScore ?? 0;

            return (
              <div key={rec.slug} className="detail-glass-card overflow-hidden group">
                {/* Banner */}
                <div className="relative h-48 sm:h-56 md:h-72 overflow-hidden">
                  {banner && (
                    <Image
                      src={banner}
                      alt={title}
                      fill
                      className="object-cover transition-transform duration-700 group-hover:scale-105"
                      sizes="100vw"
                      priority
                    />
                  )}
                  <div className="absolute inset-0 bg-gradient-to-t from-black/90 via-black/40 to-transparent" />
                  <div className="absolute inset-0 bg-gradient-to-r from-black/60 to-transparent" />

                  {/* Badge */}
                  <div className="absolute top-4 left-4">
                    <span className="inline-flex items-center gap-1.5 px-3 py-1.5 rounded-full text-xs font-bold bg-amber-500/20 border border-amber-500/30 text-amber-300 backdrop-blur-sm">
                      <Sparkles className="h-3 w-3" />
                      {rec.badge}
                    </span>
                  </div>

                  {/* Score */}
                  {score > 0 && (
                    <div className="absolute top-4 right-4">
                      <span className="inline-flex items-center gap-1 px-2.5 py-1 rounded-full text-xs font-bold bg-black/50 border border-white/10 text-white backdrop-blur-sm">
                        <Star className="h-3 w-3 text-amber-400 fill-amber-400" />
                        {score}%
                      </span>
                    </div>
                  )}

                  {/* Bottom info on banner */}
                  <div className="absolute bottom-4 left-4 right-4 flex items-end justify-between gap-4">
                    <div className="flex items-center gap-4">
                      {cover && (
                        <div className="relative hidden sm:block h-28 w-20 rounded-xl overflow-hidden border-2 border-white/20 shadow-2xl shrink-0">
                          <Image src={cover} alt={title} fill className="object-cover" sizes="80px" />
                        </div>
                      )}
                      <div>
                        <h2 className="text-xl md:text-2xl font-extrabold text-white line-clamp-2 drop-shadow-lg">{title}</h2>
                        {altTitle && <p className="text-white/50 text-xs mt-0.5">{altTitle}</p>}
                        <div className="flex flex-wrap items-center gap-2 mt-2">
                          {data.seasonYear && (
                            <span className="inline-flex items-center gap-1 text-xs text-white/60">
                              <Calendar className="h-3 w-3" />
                              {data.seasonYear}
                            </span>
                          )}
                          {data.format && (
                            <span className="inline-flex items-center gap-1 text-xs text-white/60">
                              <Tv className="h-3 w-3" />
                              {data.format}
                            </span>
                          )}
                          <span className="text-xs text-white/40">•</span>
                          <span className="text-xs text-white/60">{rec.episodes.length} Episode</span>
                        </div>
                      </div>
                    </div>

                    {/* CTA — link to the regular detail page (same UI) */}
                    <Link
                      href={`/anime/${rec.anilistId}`}
                      className="shrink-0 hidden sm:inline-flex items-center gap-2 px-5 py-2.5 rounded-xl text-sm font-bold
                                 bg-gradient-to-r from-amber-500 to-orange-500 text-black
                                 hover:from-amber-400 hover:to-orange-400
                                 shadow-lg shadow-amber-500/20
                                 transition-all duration-300 hover:scale-105 hover:shadow-amber-500/30"
                    >
                      <Play className="h-4 w-4 fill-current" />
                      Lihat Detail
                    </Link>
                  </div>
                </div>

                {/* Content body */}
                <div className="p-5 md:p-6 space-y-4">
                  <p className="text-white/60 text-sm leading-relaxed line-clamp-3">{desc || "Sinopsis tidak tersedia."}</p>

                  {/* Genres */}
                  {data.genres && (
                    <div className="flex flex-wrap gap-2">
                      {data.genres.map((g) => (
                        <span
                          key={g}
                          className="px-2.5 py-1 rounded-lg text-[10px] font-semibold uppercase tracking-wider
                                     bg-white/[0.04] border border-white/[0.08] text-white/50"
                        >
                          {g}
                        </span>
                      ))}
                    </div>
                  )}

                  {/* Episode Grid */}
                  <div>
                    <h3 className="text-sm font-bold text-white/80 mb-3 flex items-center gap-2">
                      <span className="w-1 h-4 rounded-full bg-gradient-to-b from-amber-400 to-orange-600" />
                      Daftar Episode
                    </h3>
                    <div className="grid grid-cols-3 sm:grid-cols-4 md:grid-cols-5 lg:grid-cols-6 xl:grid-cols-8 gap-2">
                      {rec.episodes.map((ep) => (
                        <Link
                          key={ep.number}
                          href={`/recommendation/${rec.slug}?ep=${ep.number}`}
                          className="group/ep relative rounded-xl overflow-hidden
                                     bg-white/[0.03] border border-white/[0.06]
                                     hover:bg-gradient-to-br hover:from-amber-500/15 hover:to-orange-500/10
                                     hover:border-amber-500/30
                                     px-3 py-2.5 transition-all duration-300
                                     text-sm font-medium flex items-center justify-between"
                        >
                          <span className="text-white/60 group-hover/ep:text-white transition-colors">Eps {ep.number}</span>
                          <Play className="h-3.5 w-3.5 text-white/20 group-hover/ep:text-amber-400 transition-all duration-300 group-hover/ep:scale-110 fill-current" />
                          <div className="absolute inset-0 opacity-0 group-hover/ep:opacity-100 transition-opacity duration-500 bg-gradient-to-r from-amber-500/5 to-transparent pointer-events-none" />
                        </Link>
                      ))}
                    </div>
                  </div>

                  {/* Mobile CTA */}
                  <div className="sm:hidden">
                    <Link
                      href={`/anime/${rec.anilistId}`}
                      className="flex items-center justify-center gap-2 w-full px-5 py-3 rounded-xl text-sm font-bold
                                 bg-gradient-to-r from-amber-500 to-orange-500 text-black
                                 shadow-lg shadow-amber-500/20"
                    >
                      <Play className="h-4 w-4 fill-current" />
                      Lihat Detail
                    </Link>
                  </div>
                </div>
              </div>
            );
          })}
        </div>
      </div>
    </main>
  );
}
