import { Suspense } from "react";
import { notFound } from "next/navigation";
import WatchClient from "@/components/WatchClient";

type Props = {
  params: Promise<{ id: string }>;
};

export default async function WatchPage({ params }: Props) {
  const resolvedParams = await params;
  const id = Number(resolvedParams.id);

  if (isNaN(id)) {
    return notFound();
  }

  return (
    <Suspense
      fallback={
        <div className="min-h-screen flex items-center justify-center">
          <div className="flex flex-col items-center gap-3">
            <div className="h-10 w-10 border-2 border-indigo-400 border-t-transparent rounded-full animate-spin" />
            <p className="text-white/50 text-sm">Memuat player...</p>
          </div>
        </div>
      }
    >
      <WatchClient animeId={id} />
    </Suspense>
  );
}
