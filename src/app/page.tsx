import { Suspense } from "react";
import Banner from "@/components/Banner";
import RowServer from "@/components/RowServer";
import RowSkeleton from "@/components/RowSkeleton";
import { fetchTrending, fetchPopular } from "@/lib/anilist";

export default async function Page() {
  const [trending, popular] = await Promise.all([fetchTrending(1, 30), fetchPopular(1, 30)]);
  const heroCandidates = [...trending.items, ...popular.items];

  return (
    <main className="min-h-screen pb-10">
      <Banner items={heroCandidates} intervalMs={7000} />

      {/* Wrapper utama untuk daftar Row dengan Ambient Glow */}
      <div className="relative flex flex-col space-y-4 md:space-y-8 pt-8">
        {/* Efek cahaya ambient (Glow) di background, tidak mengganggu klik */}
        <div className="pointer-events-none absolute top-0 left-1/2 -translate-x-1/2 w-[800px] h-[500px] bg-indigo-500/10 blur-[120px] rounded-full z-0" />

        <div id="trending" className="scroll-mt-24 relative z-10">
          <Suspense fallback={<RowSkeleton title="Trending Now" />}>
            <RowServer type="trending" title="Trending Now" />
          </Suspense>
        </div>

        <div id="explore" className="scroll-mt-24 relative z-10">
          <Suspense fallback={<RowSkeleton title="Popular on AnimeHub" />}>
            <RowServer type="popular" title="Popular on AnimeHub" />
          </Suspense>
        </div>

        <div id="top" className="scroll-mt-24 relative z-10">
          <Suspense fallback={<RowSkeleton title="Top Rated" />}>
            <RowServer type="top" title="Top Rated" />
          </Suspense>
        </div>

        <div id="seasonal" className="scroll-mt-24 relative z-10">
          <Suspense fallback={<RowSkeleton title="Seasonal Picks" />}>
            <RowServer type="seasonal" title="Seasonal Picks" />
          </Suspense>
        </div>
      </div>

      {/* Footer Minimalis */}
      <footer className="mt-16 border-t border-white/5 pt-8 pb-12 text-center relative z-10">
        <p className="text-sm text-white/40 font-medium">© {new Date().getFullYear()} AnimeHub. Data provided by AniList.</p>
      </footer>
    </main>
  );
}
