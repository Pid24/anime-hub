const toBase64 = (str: string) => (typeof window === "undefined" ? Buffer.from(str).toString("base64") : window.btoa(str));

export function shimmerDataURL(w = 1200, h = 600) {
  const svg = `
  <svg width="${w}" height="${h}" viewBox="0 0 ${w} ${h}" xmlns="http://www.w3.org/2000/svg" preserveAspectRatio="none">
    <defs>
      <linearGradient id="g">
        <stop stop-color="#222" offset="20%" />
        <stop stop-color="#333" offset="50%" />
        <stop stop-color="#222" offset="80%" />
      </linearGradient>
    </defs>
    <rect width="${w}" height="${h}" fill="#1a1a1a"/>
    <rect id="r" width="${w}" height="${h}" fill="url(#g)" />
    <animate xlink:href="#r" attributeName="x" from="-${w}" to="${w}" dur="1.2s" repeatCount="indefinite"  />
  </svg>`;
  return `data:image/svg+xml;base64,${toBase64(svg)}`;
}
