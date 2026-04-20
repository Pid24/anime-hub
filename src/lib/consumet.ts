// src/lib/consumet.ts
// Multi-provider anime streaming wrapper using @consumet/extensions.
// Tries all available providers with graceful fallback.

import { ANIME, StreamingServers } from "@consumet/extensions";

// ===== Types =====
export type GogoEpisode = {
  id: string;
  number: number;
  title?: string;
  url?: string;
  isFiller?: boolean;
};

export type StreamSource = {
  url: string;
  quality: string;
  isM3U8: boolean;
};

export type SubtitleTrack = {
  url: string;
  lang: string;
};

export type StreamingResult = {
  sources: StreamSource[];
  subtitles: SubtitleTrack[];
  intro?: { start: number; end: number };
  outro?: { start: number; end: number };
  download?: string;
};

export type SearchResult = {
  id: string;
  title: string;
  image?: string;
  provider: string;
};

export type EpisodeListResult = {
  found: boolean;
  provider: string;
  providerId: string;
  providerTitle: string;
  episodes: GogoEpisode[];
};

// ===== Simple In-Memory Cache =====
const cache = new Map<string, { data: unknown; expiry: number }>();
const CACHE_TTL = 10 * 60 * 1000; // 10 minutes

function getCached<T>(key: string): T | null {
  const entry = cache.get(key);
  if (!entry) return null;
  if (Date.now() > entry.expiry) {
    cache.delete(key);
    return null;
  }
  return entry.data as T;
}

function setCache(key: string, data: unknown) {
  cache.set(key, { data, expiry: Date.now() + CACHE_TTL });
}

// ===== Provider Registry =====
// Each provider is tried in order. Add/remove providers as needed.

type ProviderEntry = {
  name: string;
  create: () => {
    search: (q: string) => Promise<{ results: Record<string, unknown>[] }>;
    fetchAnimeInfo: (id: string) => Promise<Record<string, unknown>>;
    fetchEpisodeSources: (
      id: string,
      ...args: unknown[]
    ) => Promise<Record<string, unknown>>;
  };
  defaultServer?: string;
};

const PROVIDERS: ProviderEntry[] = [
  {
    name: "AnimeKai",
    create: () => new ANIME.AnimeKai() as unknown as ReturnType<ProviderEntry["create"]>,
    defaultServer: StreamingServers.MegaUp,
  },
  {
    name: "Hianime",
    create: () => new ANIME.Hianime() as unknown as ReturnType<ProviderEntry["create"]>,
    defaultServer: StreamingServers.MegaCloud,
  },
  {
    name: "AnimePahe",
    create: () => new ANIME.AnimePahe() as unknown as ReturnType<ProviderEntry["create"]>,
  },
];

// Provider instances (lazy-loaded singletons)
const instances = new Map<string, ReturnType<ProviderEntry["create"]>>();

function getProviderInstance(entry: ProviderEntry) {
  if (!instances.has(entry.name)) {
    instances.set(entry.name, entry.create());
  }
  return instances.get(entry.name)!;
}

// ===== Core Functions =====

/**
 * Search for anime across all available providers.
 * Returns results from the first provider that succeeds.
 */
export async function searchAnimeProviders(
  title: string
): Promise<{ provider: string; results: SearchResult[] } | null> {
  const cacheKey = `search:${title.toLowerCase().trim()}`;
  const cached = getCached<{ provider: string; results: SearchResult[] }>(cacheKey);
  if (cached) return cached;

  for (const entry of PROVIDERS) {
    try {
      const provider = getProviderInstance(entry);
      const results = await provider.search(title);

      if (results.results && results.results.length > 0) {
        const mapped: SearchResult[] = results.results.slice(0, 15).map((r) => ({
          id: String(r.id || ""),
          title: String(r.title || ""),
          image: r.image as string | undefined,
          provider: entry.name,
        }));

        const result = { provider: entry.name, results: mapped };
        setCache(cacheKey, result);
        return result;
      }
    } catch (err) {
      console.warn(`[Consumet] Search failed for provider ${entry.name}:`, (err as Error).message);
      continue;
    }
  }

  return null;
}

/**
 * Get episode list for an anime from a specific provider.
 */
export async function getEpisodeList(
  providerId: string,
  providerName: string
): Promise<GogoEpisode[]> {
  const cacheKey = `episodes:${providerName}:${providerId}`;
  const cached = getCached<GogoEpisode[]>(cacheKey);
  if (cached) return cached;

  const entry = PROVIDERS.find((p) => p.name === providerName);
  if (!entry) throw new Error(`Provider ${providerName} not found`);

  const provider = getProviderInstance(entry);
  const info = await provider.fetchAnimeInfo(providerId);

  const rawEpisodes = (info.episodes || []) as Record<string, unknown>[];
  const episodes: GogoEpisode[] = rawEpisodes.map((ep) => ({
    id: String(ep.id || ""),
    number: Number(ep.number || 0),
    title: ep.title as string | undefined,
    url: ep.url as string | undefined,
    isFiller: ep.isFiller as boolean | undefined,
  }));

  setCache(cacheKey, episodes);
  return episodes;
}

/**
 * Get streaming sources for an episode.
 */
export async function getStreamingSources(
  episodeId: string,
  providerName: string
): Promise<StreamingResult> {
  const cacheKey = `sources:${providerName}:${episodeId}`;
  const cached = getCached<StreamingResult>(cacheKey);
  if (cached) return cached;

  const entry = PROVIDERS.find((p) => p.name === providerName);
  if (!entry) throw new Error(`Provider ${providerName} not found`);

  const provider = getProviderInstance(entry);

  // Try with default server, then without
  let data: Record<string, unknown> | null = null;

  if (entry.defaultServer) {
    try {
      data = await provider.fetchEpisodeSources(episodeId, entry.defaultServer);
    } catch {
      console.warn(`[Consumet] Default server failed for ${providerName}, trying without server param`);
    }
  }

  if (!data) {
    data = await provider.fetchEpisodeSources(episodeId);
  }

  const rawSources = (data.sources || []) as Record<string, unknown>[];
  const rawSubs = (data.subtitles || []) as Record<string, unknown>[];

  const result: StreamingResult = {
    sources: rawSources.map((s) => ({
      url: String(s.url || ""),
      quality: String(s.quality || "default"),
      isM3U8: (s.isM3U8 as boolean) ?? String(s.url || "").includes(".m3u8"),
    })),
    subtitles: rawSubs
      .filter((s) => s.url && s.lang)
      .map((s) => ({
        url: String(s.url),
        lang: String(s.lang),
      })),
    intro: data.intro as { start: number; end: number } | undefined,
    outro: data.outro as { start: number; end: number } | undefined,
    download: data.download as string | undefined,
  };

  setCache(cacheKey, result);
  return result;
}

/**
 * High-level function: Search for anime by title across all providers,
 * then fetch episode list from the first provider that works.
 */
export async function findEpisodesForAnime(
  title: string
): Promise<EpisodeListResult | null> {
  const cacheKey = `findEpisodes:${title.toLowerCase().trim()}`;
  const cached = getCached<EpisodeListResult>(cacheKey);
  if (cached) return cached;

  const searchResult = await searchAnimeProviders(title);
  if (!searchResult || searchResult.results.length === 0) return null;

  const bestMatch = searchResult.results[0];

  try {
    const episodes = await getEpisodeList(bestMatch.id, searchResult.provider);

    const result: EpisodeListResult = {
      found: true,
      provider: searchResult.provider,
      providerId: bestMatch.id,
      providerTitle: bestMatch.title,
      episodes,
    };

    setCache(cacheKey, result);
    return result;
  } catch (err) {
    console.error(`[Consumet] Failed to fetch episodes from ${searchResult.provider}:`, (err as Error).message);

    // Try remaining providers
    for (const entry of PROVIDERS) {
      if (entry.name === searchResult.provider) continue;
      try {
        const provider = getProviderInstance(entry);
        const altSearch = await provider.search(title);
        if (!altSearch.results?.length) continue;

        const altId = String(altSearch.results[0].id);
        const altTitle = String(altSearch.results[0].title);
        const episodes = await getEpisodeList(altId, entry.name);

        const result: EpisodeListResult = {
          found: true,
          provider: entry.name,
          providerId: altId,
          providerTitle: altTitle,
          episodes,
        };

        setCache(cacheKey, result);
        return result;
      } catch {
        continue;
      }
    }

    return null;
  }
}
