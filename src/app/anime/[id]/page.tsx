import Image from "next/image";
import Link from "next/link";
import { notFound } from "next/navigation";
import { ArrowLeft, PlayCircle, Star, Calendar, Film, Sparkles } from "lucide-react";
import Player from "@/components/Player";
import { fetchAnimeById } from "@/lib/anilist";
import { htmlToText } from "html-to-text";

// Definisikan params sebagai Promise sesuai standar Next.js terbaru
type Props = {
  params: Promise<{ id: string }>;
};

export default async function AnimeDetail({ params }: Props) {
  // WAJIB di-await sebelum membaca id
  const resolvedParams = await params;
  const id = Number(resolvedParams.id);

  // Jika ID bukan angka, langsung lempar ke halaman 404
  if (isNaN(id)) {
    return notFound();
  }

  let anime;
  try {
    anime = await fetchAnimeById(id);
  } catch (error) {
    // Tangkap error 404 dari AniList agar server tidak crash
    return notFound();
  }

  const title = anime.title.english || anime.title.romaji || anime.title.native || "Untitled";
  const altTitle = anime.title.romaji && anime.title.romaji !== title ? anime.title.romaji : anime.title.native || "";
  // Matikan wordwrap agar teks tidak terpotong aneh di DOM
  const desc = anime.description ? htmlToText(anime.description, { wordwrap: false }) : "";
  const episodes = Math.max(anime.episodes ?? 12, 1);
  const score = anime.averageScore ?? 0;

  // Warna aksen dinamis berdasarkan skor
  const scoreColor = score >= 80 ? "from-emerald-400 to-cyan-400" : score >= 60 ? "from-amber-400 to-orange-400" : "from-rose-400 to-pink-400";
  const scoreRingColor = score >= 80 ? "#34d399" : score >= 60 ? "#fbbf24" : "#fb7185";

  return (
    <main className="detail-page min-h-screen pb-16 relative">
      {/* ===== Ambient Background Glows ===== */}
      <div className="pointer-events-none fixed inset-0 z-0 overflow-hidden">
        <div className="absolute -top-[200px] -left-[200px] w-[600px] h-[600px] rounded-full bg-indigo-600/8 blur-[150px]" />
        <div className="absolute top-[40%] -right-[150px] w-[500px] h-[500px] rounded-full bg-fuchsia-600/8 blur-[150px]" />
        <div className="absolute bottom-[10%] left-[30%] w-[400px] h-[400px] rounded-full bg-cyan-600/6 blur-[120px]" />
      </div>

      {/* ===== Hero Banner ===== */}
      <div className="relative h-[35vh] min-h-[250px] max-h-[400px] w-full overflow-hidden">
        {/* Banner Image */}
        {anime.bannerImage ? (
          <Image src={anime.bannerImage} alt="banner" fill className="object-cover scale-105" priority sizes="100vw" />
        ) : anime.coverImage?.extraLarge ? (
          <Image src={anime.coverImage.extraLarge} alt="banner" fill className="object-cover blur-2xl opacity-50 scale-110" priority sizes="100vw" />
        ) : null}

        {/* Multi-layer gradient overlays for cinematic depth */}
        <div className="absolute inset-0 bg-gradient-to-t from-[#0a0e1a] via-[#0a0e1a]/70 to-transparent" />
        <div className="absolute inset-0 bg-gradient-to-r from-[#0a0e1a]/60 via-transparent to-[#0a0e1a]/30" />
        <div className="absolute bottom-0 left-0 right-0 h-24 bg-gradient-to-t from-[#0a0e1a] to-transparent" />

        {/* Back button */}
        <div className="absolute top-0 left-0 right-0 z-30 pt-20 md:pt-24">
          <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
            <Link
              href="/"
              className="group inline-flex items-center gap-2.5 text-sm font-semibold text-white/70 hover:text-white
                         px-4 py-2 rounded-full bg-white/5 backdrop-blur-md border border-white/10
                         hover:bg-white/10 hover:border-white/20 transition-all duration-300"
            >
              <ArrowLeft className="h-4 w-4 transition-transform group-hover:-translate-x-0.5" />
              Kembali
            </Link>
          </div>
        </div>
      </div>

      {/* ===== HERO SECTION: Poster + Title + Meta (sejajar) ===== */}
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 relative z-20 -mt-24 sm:-mt-32 lg:-mt-40">
        <div className="flex flex-col sm:flex-row items-center sm:items-end gap-5 sm:gap-6 lg:gap-8">

          {/* Poster Card — naik ke banner */}
          {anime.coverImage?.extraLarge && (
            <div className="group relative flex-shrink-0 w-[160px] sm:w-[180px] md:w-[200px] lg:w-[220px]">
              <div className="relative aspect-[2/3] rounded-2xl overflow-hidden
                              shadow-[0_20px_60px_rgba(0,0,0,0.8),0_0_40px_rgba(99,102,241,0.15)]
                              border border-white/15 transition-transform duration-500 group-hover:scale-[1.02]">
                <Image
                  src={anime.coverImage.extraLarge}
                  alt={title}
                  fill
                  className="object-cover"
                  sizes="(max-width: 640px) 160px, (max-width: 768px) 180px, (max-width: 1024px) 200px, 220px"
                />
                {/* Score Badge */}
                {score > 0 && (
                  <div className="absolute top-3 right-3">
                    <div className="flex items-center gap-1.5 px-2.5 py-1 rounded-full
                                    bg-black/70 backdrop-blur-md border border-white/20
                                    shadow-[0_4px_12px_rgba(0,0,0,0.4)]">
                      <Star className="h-3 w-3 text-amber-400 fill-amber-400" />
                      <span className="text-xs font-bold text-white">{(score / 10).toFixed(1)}</span>
                    </div>
                  </div>
                )}
              </div>
              {/* Glow effect under poster */}
              <div className="absolute -bottom-4 left-1/2 -translate-x-1/2 w-3/4 h-8 bg-indigo-500/20 blur-2xl rounded-full" />
            </div>
          )}

          {/* Title + Meta info — sejajar bawah poster */}
          <div className="flex-1 min-w-0 text-center sm:text-left pb-1">
            <h1 className="text-2xl sm:text-3xl md:text-4xl lg:text-5xl font-black text-white tracking-tight leading-[1.1]">
              {title}
            </h1>
            {altTitle && (
              <p className="text-sm md:text-base text-white/40 mt-1.5 font-medium">{altTitle}</p>
            )}

            {/* Meta tags inline */}
            <div className="flex flex-wrap items-center justify-center sm:justify-start gap-2 mt-3 text-sm">
              {score > 0 && (
                <span className="inline-flex items-center gap-1.5 px-3 py-1 rounded-full bg-white/5 border border-white/10 text-white/80 font-medium">
                  <Star className="h-3.5 w-3.5 text-amber-400 fill-amber-400" />
                  {score}%
                </span>
              )}
              {anime.format && (
                <span className="inline-flex items-center gap-1.5 px-3 py-1 rounded-full bg-white/5 border border-white/10 text-white/80 font-medium">
                  <Film className="h-3.5 w-3.5 text-violet-400" />
                  {anime.format}
                </span>
              )}
              {anime.seasonYear && (
                <span className="inline-flex items-center gap-1.5 px-3 py-1 rounded-full bg-white/5 border border-white/10 text-white/80 font-medium">
                  <Calendar className="h-3.5 w-3.5 text-cyan-400" />
                  {anime.seasonYear}
                </span>
              )}
              {anime.episodes && (
                <span className="inline-flex items-center gap-1.5 px-3 py-1 rounded-full bg-white/5 border border-white/10 text-white/80 font-medium">
                  <PlayCircle className="h-3.5 w-3.5 text-emerald-400" />
                  {anime.episodes} Eps
                </span>
              )}
            </div>

            {/* Genre Tags */}
            {anime.genres && anime.genres.length > 0 && (
              <div className="flex flex-wrap items-center justify-center sm:justify-start gap-1.5 mt-3">
                {anime.genres.map((g: string) => (
                  <span
                    key={g}
                    className="px-2.5 py-1 rounded-full text-[11px] font-semibold
                               bg-gradient-to-r from-white/[0.07] to-white/[0.03]
                               border border-white/10 text-white/60
                               hover:border-white/25 hover:text-white
                               transition-all duration-300 cursor-default"
                  >
                    {g}
                  </span>
                ))}
              </div>
            )}

            {/* Accent line */}
            <div className="mt-4 h-1 w-20 md:w-24 rounded-full bg-gradient-to-r from-indigo-500 via-violet-500 to-fuchsia-500 mx-auto sm:mx-0" />
          </div>
        </div>
      </div>

      {/* ===== MAIN CONTENT: Trailer, Synopsis, Episodes (full width) ===== */}
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 relative z-10 mt-8 md:mt-10 space-y-8">

        {/* Trailer */}
        {anime.trailer?.id && (
          <div className="rounded-2xl overflow-hidden border border-white/10
                          shadow-[0_8px_40px_rgba(0,0,0,0.5),0_0_20px_rgba(99,102,241,0.08)]
                          bg-black/60 backdrop-blur-md">
            <Player trailerId={anime.trailer.id} trailerSite={anime.trailer.site} />
          </div>
        )}

        {/* Synopsis */}
        <div className="detail-glass-card p-6 md:p-8">
          <h3 className="text-lg font-bold mb-4 flex items-center gap-3 text-white">
            <span className="w-1 h-6 rounded-full bg-gradient-to-b from-indigo-400 to-violet-600" />
            Sinopsis
          </h3>
          <p className="text-white/70 leading-[1.8] text-[15px] whitespace-pre-line">
            {desc || "Sinopsis tidak tersedia untuk judul ini."}
          </p>
        </div>

        {/* Episode List */}
        <div className="detail-glass-card p-6 md:p-8">
          <div className="flex items-center justify-between mb-6">
            <h3 className="text-lg font-bold flex items-center gap-3 text-white">
              <span className="w-1 h-6 rounded-full bg-gradient-to-b from-fuchsia-400 to-pink-600" />
              Daftar Episode
            </h3>
            <span className="text-xs font-semibold text-white/30 bg-white/5 px-3 py-1 rounded-full border border-white/5">
              {episodes} Episode
            </span>
          </div>
          <div className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-4 lg:grid-cols-5 xl:grid-cols-6 gap-2.5">
            {Array.from({ length: episodes }).map((_, i) => (
              <button
                key={i}
                className="group relative rounded-xl overflow-hidden
                           bg-white/[0.03] border border-white/[0.06]
                           hover:bg-gradient-to-br hover:from-indigo-500/15 hover:to-fuchsia-500/10
                           hover:border-indigo-500/30
                           px-4 py-3.5 transition-all duration-300
                           text-sm font-medium flex items-center justify-between"
              >
                <span className="text-white/60 group-hover:text-white transition-colors">Eps {i + 1}</span>
                <PlayCircle className="h-4 w-4 text-white/20 group-hover:text-indigo-400 transition-all duration-300 group-hover:scale-110" />
                {/* Hover glow */}
                <div className="absolute inset-0 opacity-0 group-hover:opacity-100 transition-opacity duration-500
                                bg-gradient-to-r from-indigo-500/5 to-transparent pointer-events-none" />
              </button>
            ))}
          </div>
        </div>
      </div>
    </main>
  );
}
