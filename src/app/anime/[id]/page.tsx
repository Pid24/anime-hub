import Image from "next/image";
import Section from "@/components/Section";
import Player from "@/components/Player";
import { fetchAnimeById } from "@/lib/anilist";
import { htmlToText } from "html-to-text";

export default async function AnimeDetail({ params }: { params: { id: string } }) {
  const id = Number(params.id);
  const m = await fetchAnimeById(id);
  const title = m.title.english || m.title.romaji || m.title.native || "Untitled";
  const desc = m.description ? htmlToText(m.description, { wordwrap: 80 }) : "";
  const episodes = Math.max(m.episodes ?? 12, 1); // fallback 12 utk demo

  return (
    <main>
      {m.bannerImage && (
        <div className="relative h-44 md:h-64 w-full">
          <Image src={m.bannerImage} alt="banner" fill className="object-cover opacity-70" />
        </div>
      )}

      <Section title={title}>
        <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
          <div className="md:col-span-2 space-y-6">
            <Player trailerId={m.trailer?.id ?? undefined} trailerSite={m.trailer?.site ?? undefined} />

            <div className="rounded-2xl border border-white/10 bg-white/5 p-4">
              <h3 className="font-semibold mb-2">Sinopsis</h3>
              <p className="opacity-90 whitespace-pre-line">{desc || "Sinopsis tidak tersedia."}</p>
            </div>

            <div className="rounded-2xl border border-white/10 bg-white/5 p-4">
              <h3 className="font-semibold mb-2">Episode</h3>
              <ul className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-4 gap-2 text-sm">
                {Array.from({ length: episodes }).map((_, i) => (
                  <li key={i} className="rounded-lg border border-white/10 bg-black/30 px-3 py-2 text-center">
                    Episode {i + 1}
                  </li>
                ))}
              </ul>
              <p className="text-xs opacity-60 mt-2">Daftar episode ini **dummy** untuk demo. Jangan gunakan untuk streaming bajakan.</p>
            </div>
          </div>

          <aside className="space-y-4">
            <div className="rounded-2xl border border-white/10 bg-white/5 p-4">
              <h4 className="font-semibold">Info</h4>
              <div className="text-sm opacity-90 space-y-1 mt-2">
                <div>Skor: {m.averageScore ?? "—"}</div>
                <div>Format: {m.format ?? "—"}</div>
                <div>Tahun: {m.seasonYear ?? "—"}</div>
                <div>Genre: {m.genres?.join(", ") || "—"}</div>
              </div>
            </div>
          </aside>
        </div>
      </Section>
    </main>
  );
}
