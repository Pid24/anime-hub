export type OtakuAnimeItem = {
  title: string;
  poster: string;
  episodes: number;
  releaseDay?: string;
  latestReleaseDate?: string;
  score?: string | number;
  animeId: string;
  href: string;
  sourceUrl?: string; // pengganti otakudesuUrl
};

export type OtakuSection = {
  href: string;
  sourceUrl?: string;
  animeList: OtakuAnimeItem[];
};

export type OtakuPayload = {
  statusCode: number;
  statusMessage: string;
  message: string;
  ok: boolean;
  data: {
    ongoing?: OtakuSection;
    completed?: OtakuSection;
  };
  pagination: null;
};
