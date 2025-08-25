"use client";
import { motion } from "framer-motion";
import Link from "next/link";

export default function Hero() {
  return (
    <section className="relative overflow-hidden">
      <div className="pointer-events-none absolute inset-0 -z-10">
        <div className="absolute -top-24 -left-24 w-80 h-80 rounded-full blur-3xl opacity-40 bg-indigo-500/20" />
        <div className="absolute -top-10 right-0 w-96 h-96 rounded-full blur-3xl opacity-40 bg-fuchsia-500/20" />
      </div>

      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-12 md:py-16">
        <motion.h1 initial={{ opacity: 0, y: 14 }} animate={{ opacity: 1, y: 0 }} transition={{ type: "spring", damping: 18 }} className="text-4xl md:text-6xl font-extrabold tracking-tight">
          <span className="bg-gradient-to-br from-white to-slate-300 bg-clip-text text-transparent">Tonton Trailer. Jelajahi Anime.</span>
        </motion.h1>

        <motion.p initial={{ opacity: 0, y: 10 }} animate={{ opacity: 1, y: 0 }} transition={{ delay: 0.05 }} className="mt-4 max-w-2xl opacity-85 text-slate-200/90">
          Portofolio demo berbasis AniList — cepat, bersih, dan bebas konten bajakan.
        </motion.p>

        <motion.div initial={{ opacity: 0, y: 10 }} animate={{ opacity: 1, y: 0 }} transition={{ delay: 0.1 }} className="mt-6 flex items-center gap-3">
          <Link href="/anime" className="px-5 py-2.5 rounded-2xl bg-indigo-500 hover:bg-indigo-400 text-white font-semibold shadow-lg shadow-indigo-500/20">
            Mulai Eksplor
          </Link>
          <a href="#trending" className="px-5 py-2.5 rounded-2xl border border-white/15 bg-white/5 hover:bg-white/10 font-semibold">
            Lihat Trending
          </a>
        </motion.div>
      </div>
    </section>
  );
}
