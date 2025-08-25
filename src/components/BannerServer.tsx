import Banner from "@/components/Banner";
import { fetchTrending, fetchPopular } from "@/lib/anilist";

export default async function BannerServer() {
  const [trending, popular] = await Promise.all([fetchTrending(1, 30), fetchPopular(1, 30)]);
  const items = [...trending.items, ...popular.items];
  return <Banner items={items} intervalMs={7000} />;
}
