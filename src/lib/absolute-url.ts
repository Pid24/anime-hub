// src/lib/absolute-url.ts
import { headers } from "next/headers";

/** Bangun URL absolut untuk dipakai fetch di server components */
export function absoluteUrl(path: string) {
  if (path.startsWith("http://") || path.startsWith("https://")) return path;

  const h = headers();
  const proto = h.get("x-forwarded-proto") ?? "http";
  const host = h.get("host") ?? "localhost:3000";
  const slash = path.startsWith("/") ? "" : "/";

  return `${proto}://${host}${slash}${path}`;
}
