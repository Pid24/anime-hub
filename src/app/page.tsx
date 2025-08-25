import { Suspense } from "react";
import Banner from "@/components/Banner";
import RowServer from "@/components/RowServer";
import RowSkeleton from "@/components/RowSkeleton";
import { fetchTrending, fetchPopular } from "@/lib/anilist";

export default async function Page() {
  // Data secukupnya untuk Banner (biar hero langsung siap)
  const [trending, popular] = await Promise.all([fetchTrending(1, 30), fetchPopular(1, 30)]);
  const heroCandidates = [...trending.items, ...popular.items];

  return (
    <main>
      <Banner items={heroCandidates} intervalMs={7000} />

      <div id="trending">
        <Suspense fallback={<RowSkeleton title="Trending Now" />}>
          <RowServer type="trending" title="Trending Now" />
        </Suspense>
      </div>

      <Suspense fallback={<RowSkeleton title="Popular on AnimeHub" />}>
        <RowServer type="popular" title="Popular on AnimeHub" />
      </Suspense>

      <Suspense fallback={<RowSkeleton title="Top Rated" />}>
        <RowServer type="top" title="Top Rated" />
      </Suspense>

      <Suspense fallback={<RowSkeleton title="Seasonal Picks" />}>
        <RowServer type="seasonal" title="Seasonal Picks" />
      </Suspense>
    </main>
  );
}
