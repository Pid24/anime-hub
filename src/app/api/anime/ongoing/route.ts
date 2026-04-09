import { NextResponse } from "next/server";
import { anilistGQL } from "@/lib/anilist";

type Media = {
  id: number;
  title: { romaji?: string; english?: string };
  coverImage: { large: string };
  episodes?: number | null;
  nextAiringEpisode?: { airingAt: number } | null;
};

const QUERY = `
query ($page: Int, $perPage: Int) {
  Page(page: $page, perPage: $perPage) {
    media(type: ANIME, status: RELEASING, sort: TRENDING_DESC, isAdult: false) {
      id
      title { romaji english }
      coverImage { large }
      episodes
      nextAiringEpisode { airingAt }
    }
  }
}
`;

export async function GET() {
  const { Page } = await anilistGQL<{ Page: { media: Media[] } }>(QUERY, { page: 1, perPage: 24 });

  const animeList = Page.media.map((m) => {
    const title = m.title.english || m.title.romaji || "Untitled";
    const airingAt = m.nextAiringEpisode?.airingAt ? new Date(m.nextAiringEpisode.airingAt * 1000) : undefined;
    const releaseDay = airingAt?.toLocaleDateString("id-ID", { weekday: "long" });
    const latestReleaseDate = airingAt?.toLocaleDateString("id-ID", { day: "2-digit", month: "short" });

    return {
      title,
      poster: m.coverImage.large,
      episodes: m.episodes ?? 0,
      releaseDay,
      latestReleaseDate,
      animeId: String(m.id),
      href: `/anime/${m.id}`, // ke halaman detail kamu
      sourceUrl: `https://anilist.co/anime/${m.id}`,
    };
  });

  return NextResponse.json({
    statusCode: 200,
    statusMessage: "OK",
    message: "",
    ok: true,
    data: {
      ongoing: {
        href: "/anime/ongoing",
        sourceUrl: "https://anilist.co",
        animeList,
      },
    },
    pagination: null,
  });
}
