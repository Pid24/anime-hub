import Link from "next/link";
import Image from "next/image";
import { ArrowLeft } from "lucide-react";
import { absoluteUrl } from "@/lib/absolute-url";

type Item = {
  title: string;
  poster: string;
  episodes: number;
  releaseDay?: string;
  latestReleaseDate?: string;
  score?: string | number;
  animeId: string;
  href: string;
};

type Section = { animeList: Item[] } | undefined;

async function get<T>(url: string): Promise<T> {
  const res = await fetch(absoluteUrl(url), { cache: "no-store" });
  if (!res.ok) throw new Error(`Failed: ${url}`);
  return res.json();
}

export default async function AnimeIndex() {
  const ongoing = await get<{ data: { ongoing: Section } }>("/api/anime/ongoing");
  const completed = await get<{ data: { completed: Section } }>("/api/anime/completed");

  return (
    <main className="min-h-screen pt-8 md:pt-12 pb-12">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        {/* Header Section (Senada dengan Trending) */}
        <div className="mb-10">
          <Link href="/" className="inline-flex items-center gap-2 text-sm font-medium text-white/70 hover:text-white mb-4 transition-colors">
            <ArrowLeft className="h-4 w-4" /> Kembali ke Beranda
          </Link>
          <h1 className="text-3xl md:text-4xl font-extrabold text-transparent bg-clip-text bg-gradient-to-r from-indigo-400 to-fuchsia-400">Explore Anime</h1>
          <p className="mt-2 text-white/80">Jelajahi daftar anime legal berstatus ongoing maupun completed.</p>
        </div>

        <div className="space-y-12">
          {/* Section Ongoing */}
          <section>
            <h2 className="text-2xl font-bold mb-6 flex items-center gap-2">
              <span className="w-2 h-6 bg-indigo-500 rounded-full inline-block"></span>
              Ongoing (Legal)
            </h2>
            <div className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-4 lg:grid-cols-5 gap-x-4 gap-y-8">
              {ongoing.data.ongoing?.animeList.map((a) => (
                <div key={a.animeId} className="flex justify-center">
                  <Link href={a.href} className="group w-full max-w-[224px]">
                    <div className="relative aspect-[2/3] w-full rounded-lg transition-transform duration-300 group-hover:scale-[1.04] overflow-hidden bg-white/5 border border-white/10">
                      <Image src={a.poster} alt={a.title} fill className="object-cover" sizes="(max-width: 768px) 50vw, 20vw" />
                      <div className="absolute inset-x-0 bottom-0 h-24 bg-gradient-to-t from-black/90 to-transparent" />
                      <div className="absolute inset-x-0 bottom-0 p-3 text-[12px] leading-tight text-white drop-shadow-[0_1px_4px_rgba(0,0,0,0.9)]">
                        <div className="font-semibold line-clamp-2 mb-1">{a.title}</div>
                        <div className="text-white/80 text-[11px]">
                          {a.releaseDay ?? "—"} • {a.latestReleaseDate ?? "—"}
                        </div>
                      </div>
                    </div>
                  </Link>
                </div>
              ))}
            </div>
          </section>

          {/* Section Completed */}
          <section>
            <h2 className="text-2xl font-bold mb-6 flex items-center gap-2">
              <span className="w-2 h-6 bg-fuchsia-500 rounded-full inline-block"></span>
              Completed (Legal)
            </h2>
            <div className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-4 lg:grid-cols-5 gap-x-4 gap-y-8">
              {completed.data.completed?.animeList.map((a) => (
                <div key={a.animeId} className="flex justify-center">
                  <Link href={a.href} className="group w-full max-w-[224px]">
                    <div className="relative aspect-[2/3] w-full rounded-lg transition-transform duration-300 group-hover:scale-[1.04] overflow-hidden bg-white/5 border border-white/10">
                      <Image src={a.poster} alt={a.title} fill className="object-cover" sizes="(max-width: 768px) 50vw, 20vw" />
                      <div className="absolute inset-x-0 bottom-0 h-24 bg-gradient-to-t from-black/90 to-transparent" />
                      <div className="absolute inset-x-0 bottom-0 p-3 text-[12px] leading-tight text-white drop-shadow-[0_1px_4px_rgba(0,0,0,0.9)]">
                        <div className="font-semibold line-clamp-2 mb-1">{a.title}</div>
                        <div className="text-white/80 text-[11px] flex justify-between items-center">
                          <span>Eps {a.episodes}</span>
                          <span className="bg-white/20 px-1.5 py-0.5 rounded text-[10px] font-bold">⭐ {a.score ?? "N/A"}</span>
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
