export default function BannerSkeleton() {
  return (
    <section className="relative h-[55vw] max-h-[560px] min-h-[320px] w-full overflow-hidden">
      <div className="absolute inset-0 bg-gradient-to-b from-slate-700/40 to-slate-900/70 animate-pulse" />
      <div className="absolute inset-0 bg-gradient-to-t from-black/90 via-black/60 to-transparent" />
      <div className="absolute bottom-0 left-0 right-0 text-white">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 pb-8">
          <div className="h-8 md:h-12 w-2/3 md:w-1/3 rounded bg-white/20 mb-3" />
          <div className="space-y-2 mb-4">
            <div className="h-3 w-11/12 md:w-2/3 rounded bg-white/15" />
            <div className="h-3 w-10/12 md:w-1/2 rounded bg-white/15" />
          </div>
          <div className="h-10 w-36 rounded bg-white/30" />
        </div>
      </div>
    </section>
  );
}
