import Image from "next/image";
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
    <main className="max-w-7xl mx-auto px-4 py-8 space-y-10">
      <section>
        <h2 className="text-2xl font-bold mb-4">Ongoing (legal)</h2>
        <div className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-5 gap-4">
          {ongoing.data.ongoing?.animeList.map((a) => (
            <a key={a.animeId} href={a.href} className="block rounded-2xl overflow-hidden border border-white/10 bg-white/5">
              <div className="relative aspect-[3/4]">
                <Image src={a.poster} alt={a.title} fill className="object-cover" />
              </div>
              <div className="p-3">
                <div className="font-semibold text-sm line-clamp-2">{a.title}</div>
                <div className="text-xs opacity-70 mt-1">
                  {a.releaseDay ?? "—"} • {a.latestReleaseDate ?? "—"}
                </div>
              </div>
            </a>
          ))}
        </div>
      </section>

      <section>
        <h2 className="text-2xl font-bold mb-4">Completed (legal)</h2>
        <div className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-5 gap-4">
          {completed.data.completed?.animeList.map((a) => (
            <a key={a.animeId} href={a.href} className="block rounded-2xl overflow-hidden border border-white/10 bg-white/5">
              <div className="relative aspect-[3/4]">
                <Image src={a.poster} alt={a.title} fill className="object-cover" />
              </div>
              <div className="p-3">
                <div className="font-semibold text-sm line-clamp-2">{a.title}</div>
                <div className="text-xs opacity-70 mt-1">
                  Ep {a.episodes} • Skor {a.score ?? "—"}
                </div>
              </div>
            </a>
          ))}
        </div>
      </section>
    </main>
  );
}
