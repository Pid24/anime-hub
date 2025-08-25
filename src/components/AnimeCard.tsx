"use client";
import Image from "next/image";
import Link from "next/link";
import { motion } from "framer-motion";
import type { Media } from "@/lib/anilist";

export default function AnimeCard({ m }: { m: Media }) {
  const title = m.title.english || m.title.romaji || m.title.native || "Untitled";
  const meta = `${m.seasonYear ?? "—"} • ${m.format ?? "TV"}`;

  return (
    <motion.div whileHover={{ y: -6 }} transition={{ type: "spring", stiffness: 320, damping: 22 }} className="group">
      <Link href={`/anime/${m.id}`} className="block relative card overflow-hidden">
        <div className="pointer-events-none absolute inset-0 rounded-2xl opacity-0 group-hover:opacity-100 transition ring-1 ring-inset ring-indigo-400/40" />
        <div className="relative aspect-[3/4]">
          {m.coverImage?.large && <Image src={m.coverImage.large} alt={title} fill sizes="(max-width:768px) 50vw, 25vw" className="object-cover transition duration-300 group-hover:scale-[1.03]" />}
          <div className="absolute left-2 top-2 rounded-full px-2 py-1 text-[10px] font-bold bg-black/50 backdrop-blur border border-white/10">{m.averageScore ? `${m.averageScore}%` : "NEW"}</div>
          <div className="absolute inset-x-0 bottom-0 h-20 bg-gradient-to-t from-black/70 to-transparent" />
        </div>
        <div className="p-3">
          <h3 className="font-semibold text-sm line-clamp-2 group-hover:text-indigo-400 transition-colors">{title}</h3>
          <p className="text-xs opacity-70 mt-1">{meta}</p>
        </div>
      </Link>
    </motion.div>
  );
}
