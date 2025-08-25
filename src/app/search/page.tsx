import Section from "@/components/Section";
import AnimeCard from "@/components/AnimeCard";
import { searchAnime } from "@/lib/anilist";

export default async function SearchPage({ searchParams }: { searchParams: { q?: string } }) {
  const q = (searchParams.q ?? "").trim();
  const { items } = q ? await searchAnime(q) : { items: [] };
  return (
    <main>
      <Section title={q ? `Hasil untuk “${q}”` : "Cari Anime"}>
        {q ? (
          <div className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-4 lg:grid-cols-6 gap-4">
            {items.map((m) => (
              <AnimeCard key={m.id} m={m} />
            ))}
          </div>
        ) : (
          <p className="opacity-70">Ketik judul di kolom pencarian (atas kanan).</p>
        )}
      </Section>
    </main>
  );
}
