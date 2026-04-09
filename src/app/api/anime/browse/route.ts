import { NextRequest, NextResponse } from "next/server";
import {
  fetchSeasonalPaginated,
  fetchPopularPaginated,
} from "@/lib/anilist";

/**
 * GET /api/anime/browse?section=seasonal|popular&page=1&perPage=24
 *
 * API route yang mendukung pagination cursor dari AniList.
 * Digunakan oleh client-side infinite scroll.
 */
export async function GET(req: NextRequest) {
  const { searchParams } = req.nextUrl;
  const section = searchParams.get("section") || "seasonal";
  const page = Math.max(1, parseInt(searchParams.get("page") || "1", 10));
  const perPage = Math.min(50, Math.max(1, parseInt(searchParams.get("perPage") || "24", 10)));

  try {
    const result =
      section === "popular"
        ? await fetchPopularPaginated(page, perPage)
        : await fetchSeasonalPaginated(page, perPage);

    return NextResponse.json({
      ok: true,
      data: result.items,
      pageInfo: result.pageInfo,
    });
  } catch (err) {
    const message = err instanceof Error ? err.message : "Unknown error";
    return NextResponse.json(
      { ok: false, error: message, data: [], pageInfo: null },
      { status: 500 }
    );
  }
}
