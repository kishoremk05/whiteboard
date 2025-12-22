import { useEffect, useRef, useState } from 'react';
import gsap from 'gsap';
import { ScrollTrigger } from 'gsap/ScrollTrigger';
import { GraduationCap, Briefcase, Palette, Users } from 'lucide-react';

gsap.registerPlugin(ScrollTrigger);

const useCases = [
    {
        id: 'education',
        icon: GraduationCap,
        title: 'Education & Learning',
        description: 'Create interactive lessons with diagrams, mind maps, and collaborative exercises. Students can brainstorm together, annotate materials, and visualize complex concepts in real-time.',
    },
    {
        id: 'business',
        icon: Briefcase,
        title: 'Business Strategy',
        description: 'Plan roadmaps, run sprint retrospectives, and facilitate workshops. Map out business processes, create SWOT analyses, and align your team on strategic initiatives with visual clarity.',
    },
    {
        id: 'design',
        icon: Palette,
        title: 'Design & Creativity',
        description: 'Sketch wireframes, build user journey maps, and create mood boards. Perfect for UX designers, product teams, and creative professionals who think visually and iterate quickly.',
    },
    {
        id: 'teams',
        icon: Users,
        title: 'Remote Teams',
        description: 'Bridge the distance with a shared visual workspace. Run daily standups, brainstorm new features, and keep distributed teams aligned with async-friendly collaboration tools.',
    },
];

export function UseCases() {
    const sectionRef = useRef<HTMLElement>(null);
    const [activeTab, setActiveTab] = useState('education');
    const activeCase = useCases.find((uc) => uc.id === activeTab) || useCases[0];

    useEffect(() => {
        const ctx = gsap.context(() => {
            gsap.from('.usecase-title', {
                scrollTrigger: {
                    trigger: '.usecase-title',
                    start: 'top 85%',
                },
                y: 24,
                opacity: 0,
                duration: 0.6,
            });
        }, sectionRef);

        return () => ctx.revert();
    }, []);

    return (
        <section ref={sectionRef} id="use-cases" className="py-24 lg:py-32 bg-white relative overflow-hidden">
            {/* Subtle noise/grain texture background */}
            <div 
                className="absolute inset-0 opacity-[0.4]"
                style={{
                    backgroundImage: `url("data:image/svg+xml,%3Csvg viewBox='0 0 400 400' xmlns='http://www.w3.org/2000/svg'%3E%3Cfilter id='noiseFilter'%3E%3CfeTurbulence type='fractalNoise' baseFrequency='0.9' numOctaves='4' stitchTiles='stitch'/%3E%3C/filter%3E%3Crect width='100%25' height='100%25' filter='url(%23noiseFilter)'/%3E%3C/svg%3E")`,
                }}
            />
            {/* Hand-drawn decorative doodles */}
            <svg className="absolute top-12 left-8 w-20 h-20 opacity-50" viewBox="0 0 80 80" fill="none">
                <circle cx="40" cy="40" r="32" stroke="#3B82F6" strokeWidth="2" strokeDasharray="8 4" fill="none" />
                <circle cx="40" cy="40" r="16" stroke="#3B82F6" strokeWidth="1.5" fill="none" />
                <circle cx="40" cy="40" r="4" fill="#3B82F6" />
            </svg>

            <svg className="absolute top-24 right-12 w-16 h-16 opacity-40" viewBox="0 0 64 64" fill="none">
                <path d="M32 4 L38 26 L60 32 L38 38 L32 60 L26 38 L4 32 L26 26 Z" stroke="#FBBF24" strokeWidth="2" fill="none" />
            </svg>

            <svg className="absolute bottom-20 left-20 w-24 h-16 opacity-40" viewBox="0 0 96 64" fill="none">
                <path d="M8 32 Q 24 8, 48 32 Q 72 56, 88 32" stroke="#E85A4F" strokeWidth="2" strokeLinecap="round" fill="none" />
            </svg>

            {/* Camera doodle */}
            <svg className="absolute bottom-32 right-8 w-16 h-14 opacity-40" viewBox="0 0 64 56" fill="none">
                <rect x="4" y="12" width="56" height="40" rx="4" stroke="#3B82F6" strokeWidth="2" fill="none" />
                <circle cx="32" cy="32" r="12" stroke="#3B82F6" strokeWidth="2" fill="none" />
                <circle cx="32" cy="32" r="6" stroke="#3B82F6" strokeWidth="1.5" fill="none" />
                <rect x="20" y="4" width="24" height="10" rx="2" stroke="#3B82F6" strokeWidth="2" fill="none" />
            </svg>

            <div className="max-w-5xl mx-auto px-4 sm:px-6 lg:px-8 relative">
                {/* Section Header */}
                <div className="usecase-title text-center mb-12 lg:mb-16">
                    <div className="inline-block relative">
                        <h2 className="text-4xl sm:text-5xl lg:text-6xl font-black text-gray-900" style={{ fontFamily: 'Georgia, serif' }}>
                            Use Cases
                        </h2>
                        <svg className="absolute -bottom-3 left-0 w-full h-6" viewBox="0 0 250 24" fill="none" preserveAspectRatio="none">
                            <path d="M5 14 Q 62 6, 125 12 Q 188 18, 245 8" stroke="#3B82F6" strokeWidth="3" strokeLinecap="round" fill="none" />
                        </svg>
                    </div>
                    <p className="text-lg text-gray-500 mt-8 max-w-xl mx-auto">
                        From classrooms to boardrooms
                    </p>
                </div>

                {/* Tab buttons - Hand-drawn style */}
                <div className="flex flex-wrap justify-center gap-4 mb-12">
                    {useCases.map((uc) => (
                        <button
                            key={uc.id}
                            onClick={() => setActiveTab(uc.id)}
                            className={`relative px-6 py-3 rounded-lg font-medium transition-all ${
                                activeTab === uc.id
                                    ? 'bg-white text-gray-900 shadow-soft'
                                    : 'text-gray-500 hover:text-gray-900'
                            }`}
                        >
                            {activeTab === uc.id && (
                                <svg className="absolute inset-0 w-full h-full pointer-events-none" viewBox="0 0 120 48" preserveAspectRatio="none">
                                    <rect x="2" y="2" width="116" height="44" rx="8" stroke="#3B82F6" strokeWidth="2" fill="none" />
                                </svg>
                            )}
                            <span className="relative z-10 flex items-center gap-2">
                                <uc.icon className="w-4 h-4" />
                                {uc.title}
                            </span>
                        </button>
                    ))}
                </div>

                {/* Active case content */}
                <div className="relative bg-white rounded-xl p-8 lg:p-12 shadow-soft max-w-2xl mx-auto">
                    {/* Hand-drawn border */}
                    <svg className="absolute inset-0 w-full h-full pointer-events-none" viewBox="0 0 640 300" preserveAspectRatio="none">
                        <rect x="4" y="4" width="632" height="292" rx="12" stroke="#3B82F6" strokeWidth="2.5" fill="none" />
                    </svg>

                    <div className="relative z-10 text-center">
                        <div className="w-20 h-20 mx-auto mb-6 rounded-2xl bg-yellow-100 flex items-center justify-center">
                            <activeCase.icon className="w-10 h-10 text-yellow-700" />
                        </div>
                        <h3 className="text-2xl font-bold text-gray-900 mb-4">{activeCase.title}</h3>
                        <p className="text-gray-500 text-lg max-w-md mx-auto">{activeCase.description}</p>
                        
                        {/* Decorative stars */}
                        <div className="flex justify-center gap-2 mt-6">
                            {[1, 2, 3].map((i) => (
                                <svg key={i} className="w-6 h-6 text-yellow-400" viewBox="0 0 24 24" fill="currentColor">
                                    <path d="M12 2 L14 8 L20 9 L15 14 L17 20 L12 17 L7 20 L9 14 L4 9 L10 8 Z" />
                                </svg>
                            ))}
                        </div>
                    </div>
                </div>

                {/* Bottom doodle */}
                <div className="flex justify-center mt-16">
                    <svg className="w-40 h-8 opacity-30" viewBox="0 0 160 32" fill="none">
                        <path d="M8 16 C 40 4, 80 28, 120 16 C 136 12, 148 16, 152 16" stroke="#3B82F6" strokeWidth="2" strokeLinecap="round" fill="none" />
                    </svg>
                </div>
            </div>

            {/* Dotted section divider */}
            <div className="absolute bottom-0 left-0 right-0 border-b-2 border-dashed border-gray-200" />
        </section>
    );
}
