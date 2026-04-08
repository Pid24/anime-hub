import Link from "next/link";
import Image from "next/image";
import { ArrowLeft } from "lucide-react";
import { fetchSeasonal, fetchPopular } from "@/lib/anilist";

export const revalidate = 3600; // Cache 1 jam untuk efisiensi Vercel

export default async function AnimeIndex() {
  // Langsung memanggil helper function AniList, BUKAN fetch ke /api/ lokal
  const ongoingData = await fetchSeasonal(15);
  const popularData = await fetchPopular(1, 15);

  return (
    <main className="min-h-screen pt-8 md:pt-12 pb-12 relative z-10">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        {/* Header Section */}
        <div className="mb-10">
          <Link href="/" className="inline-flex items-center gap-2 text-sm font-medium text-white/70 hover:text-white mb-4 transition-colors">
            <ArrowLeft className="h-4 w-4" /> Kembali ke Beranda
          </Link>
          <h1 className="text-3xl md:text-4xl font-extrabold text-transparent bg-clip-text bg-gradient-to-r from-indigo-400 to-fuchsia-400">Explore Anime</h1>
          <p className="mt-2 text-white/80">Jelajahi daftar anime musiman terbaru dan judul terpopuler.</p>
        </div>

        <div className="space-y-12">
          {/* Section Sedang Tayang (Seasonal) */}
          <section>
            <h2 className="text-2xl font-bold mb-6 flex items-center gap-2">
              <span className="w-2 h-6 bg-indigo-500 rounded-full inline-block"></span>
              Sedang Tayang (Seasonal)
            </h2>
            <div className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-4 lg:grid-cols-5 gap-x-4 gap-y-8">
              {ongoingData.items.map((a) => (
                <div key={a.id} className="flex justify-center">
                  <Link href={`/anime/${a.id}`} className="group w-full max-w-[224px]">
                    <div className="relative aspect-[2/3] w-full rounded-lg transition-transform duration-300 group-hover:scale-[1.04] overflow-hidden bg-white/5 border border-white/10">
                      <Image src={a.coverImage?.extraLarge || ""} alt={a.title.romaji || "Poster"} fill className="object-cover" sizes="(max-width: 768px) 50vw, 20vw" />
                      <div className="absolute inset-x-0 bottom-0 h-24 bg-gradient-to-t from-black/90 to-transparent" />
                      <div className="absolute inset-x-0 bottom-0 p-3 text-[12px] leading-tight text-white drop-shadow-[0_1px_4px_rgba(0,0,0,0.9)]">
                        <div className="font-semibold line-clamp-2 mb-1">{a.title.english || a.title.romaji}</div>
                        <div className="text-white/80 text-[11px]">
                          Tahun: {a.seasonYear ?? "—"} • {a.format ?? "—"}
                        </div>
                      </div>
                    </div>
                  </Link>
                </div>
              ))}
            </div>
          </section>

          {/* Section Completed / Terpopuler */}
          <section>
            <h2 className="text-2xl font-bold mb-6 flex items-center gap-2">
              <span className="w-2 h-6 bg-fuchsia-500 rounded-full inline-block"></span>
              Terpopuler (Popular)
            </h2>
            <div className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-4 lg:grid-cols-5 gap-x-4 gap-y-8">
              {popularData.items.map((a) => (
                <div key={a.id} className="flex justify-center">
                  <Link href={`/anime/${a.id}`} className="group w-full max-w-[224px]">
                    <div className="relative aspect-[2/3] w-full rounded-lg transition-transform duration-300 group-hover:scale-[1.04] overflow-hidden bg-white/5 border border-white/10">
                      <Image src={a.coverImage?.extraLarge || ""} alt={a.title.romaji || "Poster"} fill className="object-cover" sizes="(max-width: 768px) 50vw, 20vw" />
                      <div className="absolute inset-x-0 bottom-0 h-24 bg-gradient-to-t from-black/90 to-transparent" />
                      <div className="absolute inset-x-0 bottom-0 p-3 text-[12px] leading-tight text-white drop-shadow-[0_1px_4px_rgba(0,0,0,0.9)]">
                        <div className="font-semibold line-clamp-2 mb-1">{a.title.english || a.title.romaji}</div>
                        <div className="text-white/80 text-[11px] flex justify-between items-center">
                          <span>Eps {a.episodes ?? "?"}</span>
                          <span className="bg-white/20 px-1.5 py-0.5 rounded text-[10px] font-bold">⭐ {a.averageScore ? `${a.averageScore}%` : "N/A"}</span>
                        </div>
                      </div>
                    </div>
                  </Link>
                </div>
              ))}
            </div>
          </section>
        </div>
      </div>
    </main>
  );
}
