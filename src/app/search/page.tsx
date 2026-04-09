import Link from "next/link";
import { Suspense } from "react";
import { ArrowLeft } from "lucide-react";
import SearchFilters from "@/components/SearchFilters";
import PreviewCard from "@/components/PreviewCard";
import { fetchAdvancedSearch } from "@/lib/anilist";

// Definisikan tipe untuk Next.js 15+ searchParams Promise
type Props = {
  searchParams: Promise<{ [key: string]: string | string[] | undefined }>;
};

export const metadata = {
  title: "Pencarian Lanjutan - AnimeHub",
  description: "Cari dan filter database anime berdasarkan genre, tahun, dan format.",
};

export default async function SearchPage({ searchParams }: Props) {
  // Wajib di-await sesuai standar Next.js App Router terbaru
  const params = await searchParams;

  // Normalisasi parameter URL
  const q = typeof params.q === "string" ? params.q : undefined;
  const genre = typeof params.genre === "string" ? params.genre : undefined;
  const year = typeof params.year === "string" ? Number(params.year) : undefined;
  const format = typeof params.format === "string" ? params.format : undefined;
  const sort = typeof params.sort === "string" ? params.sort : undefined;

  const isSearching = q || genre || year || format;

  // Eksekusi GraphQL dengan parameter yang ada
  const { items } = await fetchAdvancedSearch({
    search: q,
    genre: genre,
    year: year,
    format: format,
    sort: sort,
  });

  return (
    <main className="min-h-screen pt-8 md:pt-12 pb-12 relative z-10">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        {/* Header & Filter Controls */}
        <div className="mb-8">
          <Link href="/" className="inline-flex items-center gap-2 text-sm font-medium text-white/70 hover:text-white mb-4 transition-colors">
            <ArrowLeft className="h-4 w-4" /> Kembali
          </Link>
          <h1 className="text-3xl md:text-4xl font-extrabold text-transparent bg-clip-text bg-gradient-to-r from-indigo-400 to-fuchsia-400 mb-6">Pencarian Lanjutan</h1>

          <Suspense fallback={<div className="h-40 w-full bg-white/5 animate-pulse rounded-2xl border border-white/10" />}>
            <SearchFilters />
          </Suspense>
        </div>

        {/* Results Grid */}
        <div className="mt-10">
          <h2 className="text-xl font-bold mb-6 border-b border-white/10 pb-3 flex items-center justify-between">
            <span>{isSearching ? "Hasil Pencarian" : "Rekomendasi Populer"}</span>
            <span className="text-sm font-medium text-white/50 bg-white/10 px-3 py-1 rounded-full">{items.length} Ditemukan</span>
          </h2>

          {items.length > 0 ? (
            <div className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-4 lg:grid-cols-5 gap-x-4 gap-y-8">
              {items.map((anime) => (
                <div key={anime.id} className="flex justify-center">
                  {/* Gunakan PreviewCard agar UI seragam dengan halaman lain */}
                  <PreviewCard m={anime} />
                </div>
              ))}
            </div>
          ) : (
            <div className="text-center py-20 bg-white/5 border border-white/10 rounded-2xl backdrop-blur-sm shadow-lg">
              <p className="text-lg font-semibold text-white/90">Tidak ada anime yang cocok dengan kriteria Anda.</p>
              <p className="text-sm mt-2 text-white/60">Coba ubah filter atau gunakan kata kunci yang lebih umum.</p>
            </div>
          )}
        </div>
      </div>
    </main>
  );
}
