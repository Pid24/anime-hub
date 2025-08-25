export default function RowSkeleton({ title }: { title: string }) {
  return (
    <section className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-6 animate-pulse">
      <h2 className="text-xl md:text-2xl font-bold mb-3">{title}</h2>
      <div className="flex gap-3 overflow-hidden">
        {Array.from({ length: 8 }).map((_, i) => (
          <div key={i} className="snap-start shrink-0 w-40 sm:w-44 md:w-48 lg:w-56">
            <div className="h-64 md:h-72 rounded-lg bg-white/10" />
          </div>
        ))}
      </div>
    </section>
  );
}
