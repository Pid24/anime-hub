// src/lib/recommendations.ts
// Data statis untuk anime rekomendasi admin.
// Hanya menyimpan anilistId dan link Google Drive per episode.
// Semua metadata (poster, sinopsis, dll) diambil dari AniList API.

export type RecommendedEpisode = {
  number: number;
  title: string;
  /** Google Drive file ID (extracted from share link) */
  gdriveFileId: string;
};

export type RecommendedAnime = {
  /** Unique slug for URL routing */
  slug: string;
  /** AniList ID — semua metadata diambil dari sini */
  anilistId: number;
  /** Badge label (e.g. "Pilihan Admin ⭐") */
  badge: string;
  /** Episodes sourced from Google Drive */
  episodes: RecommendedEpisode[];
};

// ===================================================================
// Helper: Convert Google Drive file ID to embeddable iframe URL
// ===================================================================
export function gdriveEmbedUrl(fileId: string): string {
  return `https://drive.google.com/file/d/${fileId}/preview`;
}

// ===================================================================
// RECOMMENDATION DATA
// Untuk menambah anime baru, cukup tambahkan objek di array ini.
// Metadata (judul, poster, sinopsis) otomatis diambil dari AniList.
// ===================================================================
export const RECOMMENDED_ANIME: RecommendedAnime[] = [
  {
    slug: "frieren-season-2",
    anilistId: 182255,
    badge: "Pilihan Admin ⭐",
    episodes: [
      { number: 1, title: "Episode 1", gdriveFileId: "1SfUvpg3gMHDJT52mwF-gYXTuXvQVgl2l" },
      { number: 2, title: "Episode 2", gdriveFileId: "1DK0ufr0xgLNcd1VuLRFicZ3lXOLOKyb7" },
      { number: 3, title: "Episode 3", gdriveFileId: "1SYWiB7RNU-ODBI8VJysf3oxCfcXrdgB4" },
      { number: 4, title: "Episode 4", gdriveFileId: "1XPGAaIsU4Qsq5bpeJCmobUdJ2CQDg1K_" },
      { number: 5, title: "Episode 5", gdriveFileId: "1b7wif20UZRLtT7aR-HNrO-QpzVwjRBvY" },
      { number: 6, title: "Episode 6", gdriveFileId: "1C0NWMuqSHyJrVz3i08CDlI1o6-m37ry_" },
      { number: 7, title: "Episode 7", gdriveFileId: "1Pk7G073tfFCB0VL9vq407TIQODCMPTKS" },
      { number: 8, title: "Episode 8", gdriveFileId: "1z3AINtK8oVZSyuNTj96yBzxnfMyizc8j" },
      { number: 9, title: "Episode 9", gdriveFileId: "16cIZQj-fAwpkEhZAx96dOTDElPxs274Q" },
      { number: 10, title: "Episode 10", gdriveFileId: "1zSNldrUXA34WQ0JUWdE5lN_2VX48EQTK" },
    ],
  },
];

// ===================================================================
// Lookup helpers
// ===================================================================
export function getRecommendedAnimeBySlug(slug: string): RecommendedAnime | undefined {
  return RECOMMENDED_ANIME.find((a) => a.slug === slug);
}

export function getRecommendedAnimeByAnilistId(anilistId: number): RecommendedAnime | undefined {
  return RECOMMENDED_ANIME.find((a) => a.anilistId === anilistId);
}

export function getRecommendedEpisode(
  slug: string,
  epNumber: number
): { anime: RecommendedAnime; episode: RecommendedEpisode } | undefined {
  const anime = getRecommendedAnimeBySlug(slug);
  if (!anime) return undefined;
  const episode = anime.episodes.find((e) => e.number === epNumber);
  if (!episode) return undefined;
  return { anime, episode };
}
