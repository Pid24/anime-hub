import { NextResponse } from "next/server";
import { anilistGQL } from "@/lib/anilist";

type Media = {
  id: number;
  title: { romaji?: string; english?: string };
  coverImage: { large: string };
  episodes?: number | null;
  averageScore?: number | null;
  endDate?: { year?: number; month?: number; day?: number } | null;
};

const QUERY = `
query ($page: Int, $perPage: Int) {
  Page(page: $page, perPage: $perPage) {
    media(type: ANIME, status: FINISHED, sort: POPULARITY_DESC) {
      id
      title { romaji english }
      coverImage { large }
      episodes
      averageScore
      endDate { year month day }
    }
  }
}
`;

function fmtEndDate(e?: { year?: number; month?: number; day?: number } | null) {
  if (!e?.year || !e?.month || !e?.day) return undefined;
  const d = new Date(e.year, e.month - 1, e.day);
  return d.toLocaleDateString("id-ID", { day: "2-digit", month: "short" });
}

export async function GET() {
  const { Page } = await anilistGQL<{ Page: { media: Media[] } }>(QUERY, { page: 1, perPage: 24 });

  const animeList = Page.media.map((m) => ({
    title: m.title.english || m.title.romaji || "Untitled",
    poster: m.coverImage.large,
    episodes: m.episodes ?? 0,
    score: typeof m.averageScore === "number" ? (m.averageScore / 10).toFixed(2) : undefined,
    lastReleaseDate: fmtEndDate(m.endDate),
    animeId: String(m.id),
    href: `/anime/${m.id}`,
    sourceUrl: `https://anilist.co/anime/${m.id}`,
  }));

  return NextResponse.json({
    statusCode: 200,
    statusMessage: "OK",
    message: "",
    ok: true,
    data: {
      completed: {
        href: "/anime/completed",
        sourceUrl: "https://anilist.co",
        animeList,
      },
    },
    pagination: null,
  });
}
