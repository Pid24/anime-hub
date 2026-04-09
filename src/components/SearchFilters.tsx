"use client";

import { useRouter, useSearchParams, usePathname } from "next/navigation";
import { useState, useCallback } from "react";
import { Search } from "lucide-react";

const GENRES = ["Action", "Adventure", "Comedy", "Drama", "Fantasy", "Horror", "Mecha", "Music", "Mystery", "Psychological", "Romance", "Sci-Fi", "Slice of Life", "Sports", "Supernatural", "Thriller"];
const YEARS = Array.from({ length: 25 }, (_, i) => new Date().getFullYear() - i); // 25 tahun terakhir
const FORMATS = ["TV", "MOVIE", "TV_SHORT", "SPECIAL", "OVA", "ONA"];
const SORTS = [
  { value: "POPULARITY_DESC", label: "Paling Populer" },
  { value: "SCORE_DESC", label: "Skor Tertinggi" },
  { value: "TRENDING_DESC", label: "Sedang Trending" },
  { value: "START_DATE_DESC", label: "Rilis Terbaru" },
];

export default function SearchFilters() {
  const router = useRouter();
  const pathname = usePathname();
  const searchParams = useSearchParams();

  // Inisialisasi state dari URL saat ini
  const [search, setSearch] = useState(searchParams.get("q") || "");
  const [genre, setGenre] = useState(searchParams.get("genre") || "");
  const [year, setYear] = useState(searchParams.get("year") || "");
  const [format, setFormat] = useState(searchParams.get("format") || "");
  const [sort, setSort] = useState(searchParams.get("sort") || "POPULARITY_DESC");

  // Fungsi untuk memodifikasi URL Parameter
  const applyFilters = useCallback(
    (key: string, value: string) => {
      const params = new URLSearchParams(searchParams.toString());
      if (value) {
        params.set(key, value);
      } else {
        params.delete(key);
      }
      router.push(`${pathname}?${params.toString()}`);
    },
    [searchParams, pathname, router],
  );

  const handleSearchSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    applyFilters("q", search);
  };

  return (
    <div className="bg-white/5 border border-white/10 p-5 rounded-2xl backdrop-blur-md shadow-lg space-y-4">
      {/* Search Bar */}
      <form onSubmit={handleSearchSubmit} className="relative">
        <input
          type="text"
          value={search}
          onChange={(e) => setSearch(e.target.value)}
          placeholder="Cari judul anime..."
          className="w-full bg-black/50 border border-white/20 rounded-xl py-3 pl-12 pr-4 text-white placeholder-white/50 focus:outline-none focus:border-indigo-500 focus:ring-1 focus:ring-indigo-500 transition-all"
        />
        <Search className="absolute left-4 top-1/2 -translate-y-1/2 h-5 w-5 text-white/50" />
        <button type="submit" className="hidden">
          Submit
        </button>
      </form>

      {/* Dropdown Filters Grid */}
      <div className="grid grid-cols-2 md:grid-cols-4 gap-3">
        <select
          value={genre}
          onChange={(e) => {
            setGenre(e.target.value);
            applyFilters("genre", e.target.value);
          }}
          className="bg-black/50 border border-white/20 rounded-lg p-2.5 text-sm text-white focus:outline-none focus:border-indigo-500 appearance-none"
        >
          <option value="">Semua Genre</option>
          {GENRES.map((g) => (
            <option key={g} value={g}>
              {g}
            </option>
          ))}
        </select>

        <select
          value={year}
          onChange={(e) => {
            setYear(e.target.value);
            applyFilters("year", e.target.value);
          }}
          className="bg-black/50 border border-white/20 rounded-lg p-2.5 text-sm text-white focus:outline-none focus:border-indigo-500 appearance-none"
        >
          <option value="">Semua Tahun</option>
          {YEARS.map((y) => (
            <option key={y} value={y}>
              {y}
            </option>
          ))}
        </select>

        <select
          value={format}
          onChange={(e) => {
            setFormat(e.target.value);
            applyFilters("format", e.target.value);
          }}
          className="bg-black/50 border border-white/20 rounded-lg p-2.5 text-sm text-white focus:outline-none focus:border-indigo-500 appearance-none"
        >
          <option value="">Semua Format</option>
          {FORMATS.map((f) => (
            <option key={f} value={f}>
              {f.replace("_", " ")}
            </option>
          ))}
        </select>

        <select
          value={sort}
          onChange={(e) => {
            setSort(e.target.value);
            applyFilters("sort", e.target.value);
          }}
          className="bg-black/50 border border-white/20 rounded-lg p-2.5 text-sm text-white focus:outline-none focus:border-indigo-500 appearance-none"
        >
          {SORTS.map((s) => (
            <option key={s.value} value={s.value}>
              {s.label}
            </option>
          ))}
        </select>
      </div>
    </div>
  );
}
