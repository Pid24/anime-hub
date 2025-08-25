"use client";

interface PlayerProps {
  trailerId?: string | null;
  trailerSite?: string | null;
}

export default function Player({ trailerId, trailerSite }: PlayerProps) {
  // Jika ada trailer YouTube dari AniList, pakai iframe
  if (trailerId && trailerSite === "youtube") {
    return (
      <div className="aspect-video w-full overflow-hidden rounded-2xl border border-white/10 bg-black">
        <iframe className="w-full h-full" src={`https://www.youtube.com/embed/${trailerId}`} title="Trailer" allow="accelerometer; autoplay; clipboard-write; encrypted-media; gyroscope; picture-in-picture; web-share" allowFullScreen />
      </div>
    );
  }

  // Fallback demo: video lokal (public/sample.mp4)
  return <video src="/sample.mp4" controls className="aspect-video w-full overflow-hidden rounded-2xl border border-white/10 bg-black" />;
}
