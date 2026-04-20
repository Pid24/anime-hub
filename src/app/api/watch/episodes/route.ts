// src/app/api/watch/episodes/route.ts
import { NextRequest, NextResponse } from "next/server";
import { findEpisodesForAnime } from "@/lib/consumet";

/**
 * GET /api/watch/episodes?title=Jujutsu+Kaisen
 *
 * Cari anime di multi-provider (AnimeKai, Hianime, AnimePahe),
 * lalu kembalikan daftar episode yang tersedia.
 */
export async function GET(request: NextRequest) {
  const { searchParams } = request.nextUrl;
  const title = searchParams.get("title");

  if (!title) {
    return NextResponse.json(
      { error: "Parameter 'title' wajib diisi" },
      { status: 400 }
    );
  }

  try {
    const result = await findEpisodesForAnime(title);

    if (!result) {
      return NextResponse.json({
        found: false,
        provider: null,
        providerId: null,
        providerTitle: null,
        episodes: [],
        message: `Anime "${title}" tidak ditemukan di provider manapun`,
      });
    }

    return NextResponse.json({
      found: true,
      provider: result.provider,
      providerId: result.providerId,
      providerTitle: result.providerTitle,
      totalEpisodes: result.episodes.length,
      episodes: result.episodes,
    });
  } catch (err) {
    console.error("[API /watch/episodes] Error:", err);
    return NextResponse.json(
      { error: "Gagal mengambil daftar episode" },
      { status: 500 }
    );
  }
}
