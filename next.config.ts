/** @type {import('next').NextConfig} */
const nextConfig = {
  images: {
    domains: ["s1.anilist.co", "s2.anilist.co", "s3.anilist.co", "s4.anilist.co", "i.ytimg.com", "img.youtube.com"],
  },
  // @consumet/extensions uses dynamic requires (got-scraping, etc.)
  // that Turbopack/Webpack can't bundle. Mark them as server-external
  // so they are resolved at runtime by Node.js instead.
  serverExternalPackages: ["@consumet/extensions", "got-scraping"],
};
module.exports = nextConfig;
