export function Brands() {
  const brandNames = [
    "Notion",
    "Figma",
    "Linear",
    "Vercel",
    "Microsoft",
    "Notion",
    "Figma",
    "Linear",
    "Vercel",
    "Microsoft",
  ];

  return (
    <section className="py-10 bg-white border-y border-slate-100 overflow-hidden">
      <div className="relative max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <p className="text-center text-sm font-medium text-slate-400 mb-8 uppercase tracking-widest">
          Trusted by 10,000+ Teams
        </p>

        <div className="relative flex overflow-hidden group">
          <div className="flex animate-scroll whitespace-nowrap gap-16 min-w-full items-center">
            {brandNames.map((brand, i) => (
              <div
                key={i}
                className="flex items-center justify-center min-w-[120px] opacity-40 hover:opacity-100 transition-opacity duration-300"
              >
                <span className="text-2xl font-bold text-slate-800">
                  {brand}
                </span>
              </div>
            ))}
            {brandNames.map((brand, i) => (
              <div
                key={`dup-${i}`}
                className="flex items-center justify-center min-w-[120px] opacity-40 hover:opacity-100 transition-opacity duration-300"
              >
                <span className="text-2xl font-bold text-slate-800">
                  {brand}
                </span>
              </div>
            ))}
          </div>

          {/* Fade Edges */}
          <div className="pointer-events-none absolute inset-y-0 left-0 w-32 bg-gradient-to-r from-white to-transparent" />
          <div className="pointer-events-none absolute inset-y-0 right-0 w-32 bg-gradient-to-l from-white to-transparent" />
        </div>
      </div>
    </section>
  );
}
