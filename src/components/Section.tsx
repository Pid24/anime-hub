export default function Section({ title, children, id }: { title: string; children: React.ReactNode; id?: string }) {
  return (
    <section id={id} className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
      <h2 className="text-2xl md:text-3xl font-extrabold mb-6 tracking-tight">{title}</h2>
      {children}
    </section>
  );
}
