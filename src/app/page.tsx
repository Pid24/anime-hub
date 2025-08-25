import Banner from "@/components/Banner";
import Row from "@/components/Row";
import { fetchTrending, fetchPopular, fetchTopRated, fetchSeasonal } from "@/lib/anilist";

export default async function Page() {
  const [trending, popular, topRated, seasonal] = await Promise.all([fetchTrending(1, 30), fetchPopular(1, 30), fetchTopRated(1, 30), fetchSeasonal(30)]);

  // gabungkan semua koleksi → unik → biarkan Banner filter HD sendiri
  const all = [...trending.items, ...popular.items, ...topRated.items, ...seasonal.items];

  return (
    <main>
      <Banner items={all} intervalMs={7000} />

      <div id="trending">
        <Row title="Trending Now" items={trending.items} />
      </div>
      <Row title="Popular on AnimeHub" items={popular.items} />
      <Row title="Top Rated" items={topRated.items} />
      <Row title="Seasonal Picks" items={seasonal.items} />
    </main>
  );
}
