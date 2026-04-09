import Image from "next/image";
import Link from "next/link";
import { fetchSeasonalPaginated, fetchPopularPaginated } from "@/lib/anilist";
import Pagination from "@/components/Pagination";

export const revalidate = 3600;

const PER_PAGE = 15;

// Tabs yang tersedia
const SECTIONS = [
  { key: "seasonal", label: "Sedang Tayang", color: "bg-indigo-500" },
  { key: "popular", label: "Terpopuler", color: "bg-fuchsia-500" },
] as const;

type SectionKey = (typeof SECTIONS)[number]["key"];

interface AnimeIndexProps {
  searchParams: Promise<{ page?: string; section?: string }>;
}

export default async function AnimeIndex({ searchParams }: AnimeIndexProps) {
  const params = await searchParams;
  const section = (params.section as SectionKey) || "seasonal";
  const page = Math.max(1, parseInt(params.page || "1", 10));

  // Fetch data berdasarkan section aktif
  const data =
    section === "popular"
      ? await fetchPopularPaginated(page, PER_PAGE)
      : await fetchSeasonalPaginated(page, PER_PAGE);

  const activeSection = SECTIONS.find((s) => s.key === section) || SECTIONS[0];

  return (
    <main className="min-h-screen pt-8 md:pt-12 pb-12 relative z-10">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        {/* Header */}
        <div className="mb-8">
          <h1 className="text-3xl md:text-4xl font-extrabold text-transparent bg-clip-text bg-gradient-to-r from-indigo-400 to-fuchsia-400">
            Explore Anime
          </h1>
          <p className="mt-2 text-white/60 text-sm md:text-base">
            Jelajahi daftar anime musiman terbaru dan judul terpopuler.
          </p>
        </div>

        {/* Section Tabs */}
        <div className="flex gap-2 mb-8">
          {SECTIONS.map((s) => (
            <Link
              key={s.key}
              href={`/anime?section=${s.key}&page=1`}
              className={`flex items-center gap-2 px-5 py-2.5 rounded-full text-sm font-semibold transition-all duration-200 border ${
                section === s.key
                  ? "bg-white/10 border-white/20 text-white shadow-lg"
                  : "bg-white/[0.03] border-white/8 text-white/50 hover:bg-white/[0.06] hover:text-white/80 hover:border-white/15"
              }`}
            >
              <span
                className={`w-2 h-2 rounded-full ${s.color} ${section === s.key ? "animate-pulse" : "opacity-50"}`}
              />
              {s.label}
            </Link>
          ))}
        </div>

        {/* Section Title & Page Info */}
        <div className="flex items-center justify-between mb-6">
          <h2 className="text-xl md:text-2xl font-bold flex items-center gap-2">
            <span className={`w-2 h-6 ${activeSection.color} rounded-full inline-block`} />
            {activeSection.label}
          </h2>
          <span className="text-sm text-white/40">
            Halaman {data.pageInfo.currentPage} dari {data.pageInfo.lastPage}
          </span>
        </div>

        {/* Anime Grid */}
        <div className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-4 lg:grid-cols-5 gap-x-4 gap-y-8">
          {data.items.map((a) => (
            <div key={a.id} className="flex justify-center">
              <Link href={`/anime/${a.id}`} className="group w-full max-w-[224px]">
                <div className="relative aspect-[2/3] w-full rounded-xl transition-all duration-300 group-hover:scale-[1.04] group-hover:shadow-2xl group-hover:shadow-indigo-500/10 overflow-hidden bg-white/5 border border-white/10 group-hover:border-indigo-500/30">
                  <Image
                    src={a.coverImage?.extraLarge || a.coverImage?.large || ""}
                    alt={a.title.romaji || "Poster"}
                    fill
                    className="object-cover transition-transform duration-500 group-hover:scale-[1.08]"
                    sizes="(max-width: 640px) 50vw, (max-width: 1024px) 25vw, 20vw"
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
            </div>
          ))}
        </div>

        {/* Empty State */}
        {data.items.length === 0 && (
          <div className="flex flex-col items-center justify-center py-20 text-white/40">
            <p className="text-lg font-medium">Tidak ada data ditemukan</p>
            <p className="text-sm mt-1">Coba halaman lain atau section yang berbeda.</p>
          </div>
        )}

        {/* Pagination */}
        <Pagination
          currentPage={data.pageInfo.currentPage}
          lastPage={data.pageInfo.lastPage}
          basePath="/anime"
          extraParams={{ section }}
        />
      </div>
    </main>
  );
}
