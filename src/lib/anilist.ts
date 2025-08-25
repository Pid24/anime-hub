// src/lib/anilist.ts
export const ANILIST_ENDPOINT = "https://graphql.anilist.co";

export async function anilistGQL<T>(query: string, variables?: Record<string, any>): Promise<T> {
  const res = await fetch(ANILIST_ENDPOINT, {
    method: "POST",
    headers: { "Content-Type": "application/json", Accept: "application/json" },
    body: JSON.stringify({ query, variables }),
    next: { revalidate: 60 },
  });
  if (!res.ok) throw new Error(`AniList error: ${res.status} ${await res.text()}`);
  const json = (await res.json()) as { data: T };
  return json.data;
}

export type Media = {
  id: number;
  title: { romaji?: string; english?: string; native?: string };
  description?: string | null;
  coverImage?: { /** HD cover fallback */ extraLarge?: string; large?: string; color?: string } | null;
  bannerImage?: string | null; // biasanya 1920+px (HD)
  averageScore?: number | null;
  episodes?: number | null;
  format?: string | null;
  seasonYear?: number | null;
  genres?: string[] | null;
  trailer?: { id?: string | null; site?: string | null } | null;
};

export function currentSeason(d = new Date()) {
  const m = d.getUTCMonth() + 1;
  const y = d.getUTCFullYear();
  const season = m <= 3 ? "WINTER" : m <= 6 ? "SPRING" : m <= 9 ? "SUMMER" : "FALL";
  return { season, seasonYear: y };
}

// ===== Queries (semua ambil bannerImage + coverImage.extraLarge) =====
export async function fetchTrending(page = 1, perPage = 24): Promise<{ items: Media[] }> {
  const q = `
    query ($page: Int, $perPage: Int) {
      Page(page: $page, perPage: $perPage) {
        media(type: ANIME, sort: TRENDING_DESC) {
          id
          title { romaji english native }
          description
          coverImage { extraLarge large color }
          bannerImage
          averageScore
          episodes
          seasonYear
          format
          genres
          trailer { id site }
        }
      }
    }
  `;
  const d = await anilistGQL<{ Page: { media: Media[] } }>(q, { page, perPage });
  return { items: d.Page.media };
}

export async function fetchPopular(page = 1, perPage = 24): Promise<{ items: Media[] }> {
  const q = `
    query ($page: Int, $perPage: Int) {
      Page(page: $page, perPage: $perPage) {
        media(type: ANIME, sort: POPULARITY_DESC) {
          id
          title { romaji english native }
          description
          coverImage { extraLarge large }
          bannerImage
          averageScore
          seasonYear
          format
          genres
          trailer { id site }
        }
      }
    }
  `;
  const d = await anilistGQL<{ Page: { media: Media[] } }>(q, { page, perPage });
  return { items: d.Page.media };
}

export async function fetchTopRated(page = 1, perPage = 24): Promise<{ items: Media[] }> {
  const q = `
    query ($page: Int, $perPage: Int) {
      Page(page: $page, perPage: $perPage) {
        media(type: ANIME, sort: SCORE_DESC) {
          id
          title { romaji english native }
          description
          coverImage { extraLarge large }
          bannerImage
          averageScore
          seasonYear
          format
          genres
          trailer { id site }
        }
      }
    }
  `;
  const d = await anilistGQL<{ Page: { media: Media[] } }>(q, { page, perPage });
  return { items: d.Page.media };
}

export async function fetchSeasonal(perPage = 24): Promise<{ items: Media[] }> {
  const { season, seasonYear } = currentSeason();
  const q = `
    query ($season: MediaSeason, $seasonYear: Int, $perPage: Int) {
      Page(page: 1, perPage: $perPage) {
        media(type: ANIME, season: $season, seasonYear: $seasonYear, sort: POPULARITY_DESC) {
          id
          title { romaji english native }
          description
          coverImage { extraLarge large }
          bannerImage
          averageScore
          seasonYear
          format
          genres
          trailer { id site }
        }
      }
    }
  `;
  const d = await anilistGQL<{ Page: { media: Media[] } }>(q, { season, seasonYear, perPage });
  return { items: d.Page.media };
}

export async function searchAnime(qs: string, page = 1, perPage = 24): Promise<{ items: Media[] }> {
  const q = `
    query ($q: String, $page: Int, $perPage: Int) {
      Page(page: $page, perPage: $perPage) {
        media(search: $q, type: ANIME, sort: POPULARITY_DESC) {
          id
          title { romaji english native }
          coverImage { extraLarge large }
          averageScore
          episodes
          seasonYear
          genres
          trailer { id site }
        }
      }
    }
  `;
  const d = await anilistGQL<{ Page: { media: Media[] } }>(q, { q: qs, page, perPage });
  return { items: d.Page.media };
}

export async function fetchAnimeById(id: number): Promise<Media> {
  const q = `
    query ($id: Int) {
      Media(id: $id, type: ANIME) {
        id
        title { romaji english native }
        description
        coverImage { extraLarge large color }
        bannerImage
        averageScore
        episodes
        seasonYear
        format
        genres
        trailer { id site }
      }
    }
  `;
  const d = await anilistGQL<{ Media: Media }>(q, { id });
  return d.Media;
}
