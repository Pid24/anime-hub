"use client";

import Link from "next/link";
import { useEffect, useState, Suspense } from "react";
import { usePathname } from "next/navigation";
import SearchBar from "./SearchBar";
import { Bell, Menu, X, User } from "lucide-react";

function NavItem({ href, label }: { href: string; label: string }) {
  const pathname = usePathname();
  const isActive = href.startsWith("#") ? false : pathname.startsWith(href);

  return (
    <Link
      href={href}
      className={[
        "relative px-1 py-1 text-sm transition-colors",
        isActive ? "text-white" : "text-white/80 hover:text-white",
        "after:content-[''] after:absolute after:left-0 after:-bottom-0.5 after:h-[2px]",
        "after:bg-gradient-to-r after:from-indigo-400 after:to-fuchsia-400",
        "after:transition-all after:duration-300",
        isActive ? "after:w-full" : "after:w-0 hover:after:w-full",
      ].join(" ")}
    >
      {label}
    </Link>
  );
}

function SearchBarFallback() {
  return <div className="h-9 w-full rounded-full bg-white/10 border border-white/10 animate-pulse" />;
}

export default function Header() {
  const [scrolled, setScrolled] = useState(false);
  const [open, setOpen] = useState(false);

  useEffect(() => {
    const onScroll = () => setScrolled(window.scrollY > 60);
    onScroll();
    window.addEventListener("scroll", onScroll, { passive: true });
    return () => window.removeEventListener("scroll", onScroll);
  }, []);

  const shell = "sticky top-0 z-50 transition-colors duration-300 border-b";
  const styleWhenTop = "bg-gradient-to-b from-black/40 to-transparent border-transparent";
  const styleWhenScrolled = "bg-black/70 backdrop-blur-lg border-white/10 shadow-[0_8px_30px_rgba(0,0,0,.35)]";

  return (
    <header className={`${shell} ${scrolled ? styleWhenScrolled : styleWhenTop}`}>
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 h-16 flex items-center gap-4">
        {/* brand */}
        <Link href="/" className="font-extrabold tracking-tight text-lg whitespace-nowrap">
          <span className="bg-[linear-gradient(90deg,#60a5fa,#a78bfa,#fb7185)] bg-clip-text text-transparent">AnimeHub</span>
        </Link>

        {/* nav desktop */}
        <nav className="hidden md:flex items-center gap-5">
          <NavItem href="/anime" label="Explore" />
          <NavItem href="#trending" label="Trending" />
        </nav>

        {/* search (center) — wrap with Suspense */}
        <div className="hidden md:flex flex-1 justify-center">
          <div className="w-full max-w-xl">
            <Suspense fallback={<SearchBarFallback />}>
              <SearchBar />
            </Suspense>
          </div>
        </div>

        <div className="flex-1 md:hidden" />

        {/* actions */}
        <div className="ml-auto flex items-center gap-2">
          <button className="hidden sm:inline-flex h-9 w-9 items-center justify-center rounded-full bg-white/10 border border-white/10 hover:bg-white/15" aria-label="Notifications" title="Notifications">
            <Bell className="h-5 w-5" />
          </button>
          <button className="hidden sm:inline-flex h-9 w-9 items-center justify-center rounded-full bg-white/10 border border-white/10 hover:bg-white/15" aria-label="Account" title="Account">
            <User className="h-5 w-5" />
          </button>

          {/* mobile menu toggle */}
          <button onClick={() => setOpen((v) => !v)} className="md:hidden inline-flex h-9 w-9 items-center justify-center rounded-full bg-white/10 border border-white/10" aria-label="Menu" title="Menu">
            {open ? <X className="h-5 w-5" /> : <Menu className="h-5 w-5" />}
          </button>
        </div>
      </div>

      {/* mobile sheet */}
      {open && (
        <div className="md:hidden border-t border-white/10 bg-black/75 backdrop-blur-lg">
          <div className="px-4 py-3">
            <div className="mb-3">
              <Suspense fallback={<SearchBarFallback />}>
                <SearchBar />
              </Suspense>
            </div>
            <div className="flex flex-col gap-3">
              <NavItem href="/anime" label="Explore" />
              <NavItem href="#trending" label="Trending" />
            </div>
          </div>
        </div>
      )}
    </header>
  );
}
