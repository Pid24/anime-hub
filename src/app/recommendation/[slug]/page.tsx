import { Suspense } from "react";
import { notFound } from "next/navigation";
import { getRecommendedAnimeBySlug, RECOMMENDED_ANIME } from "@/lib/recommendations";
import RecommendationWatchClient from "@/components/RecommendationWatchClient";

type Props = {
  params: Promise<{ slug: string }>;
};

export async function generateStaticParams() {
  return RECOMMENDED_ANIME.map((anime) => ({
    slug: anime.slug,
  }));
}

export async function generateMetadata({ params }: Props) {
  const resolvedParams = await params;
  const anime = getRecommendedAnimeBySlug(resolvedParams.slug);

  if (!anime) {
    return { title: "Not Found — AnimeHub" };
  }

  return {
    title: `Tonton Rekomendasi — AnimeHub`,
    description: `Tonton anime rekomendasi pilihan admin di AnimeHub`,
  };
}

export default async function RecommendationWatchPage({ params }: Props) {
  const resolvedParams = await params;
  const anime = getRecommendedAnimeBySlug(resolvedParams.slug);

  if (!anime) {
    return notFound();
  }

  return (
    <Suspense
      fallback={
        <div className="min-h-screen flex items-center justify-center">
          <div className="flex flex-col items-center gap-3">
            <div className="h-10 w-10 border-2 border-amber-400 border-t-transparent rounded-full animate-spin" />
            <p className="text-white/50 text-sm">Memuat player...</p>
          </div>
        </div>
      }
    >
      <RecommendationWatchClient anime={anime} />
    </Suspense>
  );
}
