"use client";

import Link from "next/link";
import { ChevronLeft, ChevronRight, ChevronsLeft, ChevronsRight } from "lucide-react";

interface PaginationProps {
  currentPage: number;
  lastPage: number;
  /** Base path, e.g. "/anime" */
  basePath: string;
  /** Extra query params to preserve, e.g. { section: "popular" } */
  extraParams?: Record<string, string>;
}

export default function Pagination({
  currentPage,
  lastPage,
  basePath,
  extraParams = {},
}: PaginationProps) {
  if (lastPage <= 1) return null;

  const buildHref = (page: number) => {
    const params = new URLSearchParams({ ...extraParams, page: String(page) });
    return `${basePath}?${params.toString()}`;
  };

  // Generate page numbers to show (max 5 visible around current)
  const pages: number[] = [];
  const maxVisible = 5;
  let start = Math.max(1, currentPage - Math.floor(maxVisible / 2));
  const end = Math.min(lastPage, start + maxVisible - 1);
  start = Math.max(1, end - maxVisible + 1);

  for (let i = start; i <= end; i++) {
    pages.push(i);
  }

  const hasPrev = currentPage > 1;
  const hasNext = currentPage < lastPage;

  const baseBtnClass =
    "flex items-center justify-center min-w-[40px] h-10 rounded-lg text-sm font-medium transition-all duration-200 border";

  return (
    <nav
      aria-label="Pagination"
      className="flex items-center justify-center gap-1.5 pt-10 pb-4"
    >
      {/* First page */}
      {hasPrev && currentPage > 2 && (
        <Link
          href={buildHref(1)}
          className={`${baseBtnClass} border-white/10 bg-white/5 text-white/60 hover:bg-white/10 hover:text-white hover:border-white/20`}
          aria-label="Halaman pertama"
        >
          <ChevronsLeft className="w-4 h-4" />
        </Link>
      )}

      {/* Previous */}
      {hasPrev ? (
        <Link
          href={buildHref(currentPage - 1)}
          className={`${baseBtnClass} border-white/10 bg-white/5 text-white/60 hover:bg-white/10 hover:text-white hover:border-white/20`}
          aria-label="Halaman sebelumnya"
        >
          <ChevronLeft className="w-4 h-4" />
        </Link>
      ) : (
        <span
          className={`${baseBtnClass} border-white/5 bg-white/[0.02] text-white/20 cursor-not-allowed`}
        >
          <ChevronLeft className="w-4 h-4" />
        </span>
      )}

      {/* Page numbers */}
      {start > 1 && (
        <>
          <Link
            href={buildHref(1)}
            className={`${baseBtnClass} border-white/10 bg-white/5 text-white/60 hover:bg-white/10 hover:text-white hover:border-white/20`}
          >
            1
          </Link>
          {start > 2 && (
            <span className="flex items-center justify-center w-10 h-10 text-white/30 text-sm">
              ···
            </span>
          )}
        </>
      )}

      {pages.map((p) => (
        <Link
          key={p}
          href={buildHref(p)}
          aria-current={p === currentPage ? "page" : undefined}
          className={`${baseBtnClass} ${
            p === currentPage
              ? "bg-gradient-to-br from-indigo-500 to-fuchsia-500 border-indigo-400/50 text-white shadow-lg shadow-indigo-500/20 scale-105"
              : "border-white/10 bg-white/5 text-white/60 hover:bg-white/10 hover:text-white hover:border-white/20"
          }`}
        >
          {p}
        </Link>
      ))}

      {end < lastPage && (
        <>
          {end < lastPage - 1 && (
            <span className="flex items-center justify-center w-10 h-10 text-white/30 text-sm">
              ···
            </span>
          )}
          <Link
            href={buildHref(lastPage)}
            className={`${baseBtnClass} border-white/10 bg-white/5 text-white/60 hover:bg-white/10 hover:text-white hover:border-white/20`}
          >
            {lastPage}
          </Link>
        </>
      )}

      {/* Next */}
      {hasNext ? (
        <Link
          href={buildHref(currentPage + 1)}
          className={`${baseBtnClass} border-white/10 bg-white/5 text-white/60 hover:bg-white/10 hover:text-white hover:border-white/20`}
          aria-label="Halaman selanjutnya"
        >
          <ChevronRight className="w-4 h-4" />
        </Link>
      ) : (
        <span
          className={`${baseBtnClass} border-white/5 bg-white/[0.02] text-white/20 cursor-not-allowed`}
        >
          <ChevronRight className="w-4 h-4" />
        </span>
      )}

      {/* Last page */}
      {hasNext && currentPage < lastPage - 1 && (
        <Link
          href={buildHref(lastPage)}
          className={`${baseBtnClass} border-white/10 bg-white/5 text-white/60 hover:bg-white/10 hover:text-white hover:border-white/20`}
          aria-label="Halaman terakhir"
        >
          <ChevronsRight className="w-4 h-4" />
        </Link>
      )}
    </nav>
  );
}
