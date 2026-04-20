// src/app/api/watch/sources/route.ts
import { NextRequest, NextResponse } from "next/server";
import { getStreamingSources } from "@/lib/consumet";

/**
 * GET /api/watch/sources?episodeId=xxx&provider=AnimeKai
 *
 * Ambil URL streaming (.m3u8 / .mp4) untuk episode tertentu.
 */
export async function GET(request: NextRequest) {
  const { searchParams } = request.nextUrl;
  const episodeId = searchParams.get("episodeId");
  const provider = searchParams.get("provider") || "AnimeKai";

  if (!episodeId) {
    return NextResponse.json(
      { error: "Parameter 'episodeId' wajib diisi" },
      { status: 400 }
    );
  }

  try {
    const result = await getStreamingSources(episodeId, provider);

    if (!result.sources.length) {
      return NextResponse.json({
        found: false,
        sources: [],
        subtitles: [],
        message: `Tidak ada sumber streaming ditemukan untuk episode: ${episodeId}`,
      });
    }

    return NextResponse.json({
      found: true,
      sources: result.sources,
      subtitles: result.subtitles,
      intro: result.intro || null,
      outro: result.outro || null,
      download: result.download || null,
    });
  } catch (err) {
    console.error("[API /watch/sources] Error:", err);
    return NextResponse.json(
      {
        found: false,
        sources: [],
        subtitles: [],
        error: "Gagal mengambil sumber streaming. Server mungkin sedang tidak tersedia.",
      },
      { status: 200 } // Return 200 so frontend handles gracefully
    );
  }
}
