export function Brands() {
    // Duplicated for seamless loop
    const brands = [
        "https://upload.wikimedia.org/wikipedia/commons/thumb/e/e9/Notion-logo.svg/2048px-Notion-logo.svg.png",
        "https://upload.wikimedia.org/wikipedia/commons/3/33/Figma-logo.svg",
        "https://assets-global.website-files.com/6257adef93867e56f84d3092/6259ce84838d7211516e3c0f_Linear_Logo_White.svg", // Linear
        "https://assets.vercel.com/image/upload/v1662130559/nextjs/Icon_light_background.png", // Nextjs
        "https://upload.wikimedia.org/wikipedia/commons/4/44/Microsoft_logo.svg",
        // Repeat
        "https://upload.wikimedia.org/wikipedia/commons/thumb/e/e9/Notion-logo.svg/2048px-Notion-logo.svg.png",
        "https://upload.wikimedia.org/wikipedia/commons/3/33/Figma-logo.svg",
        "https://assets-global.website-files.com/6257adef93867e56f84d3092/6259ce84838d7211516e3c0f_Linear_Logo_White.svg",
        "https://assets.vercel.com/image/upload/v1662130559/nextjs/Icon_light_background.png",
        "https://upload.wikimedia.org/wikipedia/commons/4/44/Microsoft_logo.svg",
    ];

    const brandNames = ['Notion', 'Figma', 'Linear', 'Vercel', 'Microsoft', 'Notion', 'Figma', 'Linear', 'Vercel', 'Microsoft'];

    return (
        <section className="py-10 bg-white border-y border-slate-100 overflow-hidden">
            <div className="relative max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
                <p className="text-center text-sm font-medium text-slate-400 mb-8 uppercase tracking-widest">Trusted by 10,000+ Teams</p>

                <div className="relative flex overflow-hidden group">
                    <div className="flex animate-scroll whitespace-nowrap gap-16 min-w-full items-center">
                        {brandNames.map((brand, i) => (
                            <div key={i} className="flex items-center justify-center min-w-[120px] opacity-40 hover:opacity-100 transition-opacity duration-300">
                                <span className="text-2xl font-bold text-slate-800">{brand}</span>
                            </div>
                        ))}
                        {brandNames.map((brand, i) => (
                            <div key={`dup-${i}`} className="flex items-center justify-center min-w-[120px] opacity-40 hover:opacity-100 transition-opacity duration-300">
                                <span className="text-2xl font-bold text-slate-800">{brand}</span>
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
