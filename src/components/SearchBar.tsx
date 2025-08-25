"use client";

import { useEffect, useState } from "react";
import { useRouter, useSearchParams } from "next/navigation";
import { Search } from "lucide-react";

export default function SearchBar() {
  const router = useRouter();
  const params = useSearchParams();
  const [q, setQ] = useState("");

  useEffect(() => {
    setQ(params.get("q") ?? "");
  }, [params]);

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    router.push(`/search?q=${encodeURIComponent(q)}`);
  };

  return (
    <form onSubmit={handleSubmit} className="relative w-full max-w-xl">
      <input
        value={q}
        onChange={(e) => setQ(e.target.value)}
        placeholder="Cari anime..."
        className="w-full rounded-2xl bg-white/5 border border-white/10 px-4 py-3 pl-11 outline-none backdrop-blur text-sm md:text-base focus:ring-2 focus:ring-indigo-500"
      />
      <Search className="absolute left-3 top-1/2 -translate-y-1/2 h-5 w-5 opacity-70" />
    </form>
  );
}
