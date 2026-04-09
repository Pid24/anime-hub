import Link from "next/link";
import { ArrowLeft } from "lucide-react";
import { fetchTrending } from "@/lib/anilist";
import PreviewCard from "@/components/PreviewCard";

export const metadata = {
  title: "Trending Anime - AnimeHub",
  description: "Daftar anime yang sedang trending saat ini.",
};

export default async function TrendingPage() {
  // Menarik data lebih banyak khusus untuk halaman grid (contoh: 40 item)
  const data = await fetchTrending(1, 40);

  return (
    <main className="min-h-screen pt-8 md:pt-12 pb-12">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        {/* Header Section */}
        <div className="mb-8">
          <h1 className="text-3xl md:text-4xl font-extrabold text-transparent bg-clip-text bg-gradient-to-r from-indigo-400 to-fuchsia-400">Trending Now</h1>
          <p className="mt-2 text-white/80">Anime paling populer yang sedang hangat diperbincangkan saat ini.</p>
        </div>

        {/* Grid Layout untuk memuat banyak poster sekaligus */}
        <div className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-4 lg:grid-cols-5 gap-x-4 gap-y-8">
          {data.items.map((anime) => (
            <div key={anime.id} className="flex justify-center">
              <PreviewCard m={anime} />
            </div>
          ))}
        </div>
      </div>
    </main>
  );
}
