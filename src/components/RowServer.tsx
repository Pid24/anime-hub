import Row from "@/components/Row";
import { fetchTrending, fetchPopular, fetchTopRated, fetchSeasonal } from "@/lib/anilist";

type Props = { type: "trending" | "popular" | "top" | "seasonal"; title: string; limit?: number };

export default async function RowServer({ type, title, limit = 20 }: Props) {
  const fetchers = {
    trending: () => fetchTrending(1, limit),
    popular: () => fetchPopular(1, limit),
    top: () => fetchTopRated(1, limit),
    seasonal: () => fetchSeasonal(limit),
  } as const;

  const { items } = await fetchers[type](); // <-- data diambil DI SINI
  return <Row title={title} items={items} />; // Row client component kamu (dengan hover trailer + filter)
}
