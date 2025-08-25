// src/lib/absolute-url.ts

/**
 * Bangun absolute URL untuk dipakai server-side fetch ke /api
 * Tanpa pakai `headers()` biar aman di type-check & semua runtime.
 *
 * Prioritas:
 * 1) NEXT_PUBLIC_SITE_URL          -> mis. https://animehub.example.com
 * 2) VERCEL_URL / NEXT_PUBLIC_VERCEL_URL (tanpa protokol) -> https://<host>
 * 3) fallback dev: http://localhost:3000
 */
export function absoluteUrl(path = ""): string {
  const base =
    process.env.NEXT_PUBLIC_SITE_URL ||
    (process.env.VERCEL_URL ? `https://${process.env.VERCEL_URL}` : undefined) ||
    (process.env.NEXT_PUBLIC_VERCEL_URL ? `https://${process.env.NEXT_PUBLIC_VERCEL_URL}` : undefined) ||
    "http://localhost:3000";

  const slash = path.startsWith("/") ? "" : "/";
  return `${base}${slash}${path}`;
}
