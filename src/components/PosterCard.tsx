"use client";
import Image from "next/image";
import Link from "next/link";
import type { Media } from "@/lib/anilist";

export default function PosterCard({ m }: { m: Media }) {
  const title = m.title.english || m.title.romaji || m.title.native || "Untitled";
  return (
    <Link href={`/anime/${m.id}`} className="snap-start shrink-0 w-40 sm:w-44 md:w-48 lg:w-56">
      <div className="card relative aspect-[2/3] transition-transform duration-300 hover:scale-[1.04]">
        {m.coverImage?.large && <Image src={m.coverImage.large} alt={title} fill sizes="(max-width:768px) 40vw, 280px" className="object-cover" />}
        <div className="absolute inset-x-0 bottom-0 h-20 bg-gradient-to-t from-black/80 to-transparent" />
        <div className="absolute left-2 bottom-2 right-2 text-xs font-semibold leading-tight line-clamp-2">{title}</div>
      </div>
    </Link>
  );
}
