import { useEffect, useRef } from 'react';
import gsap from 'gsap';
import { ScrollTrigger } from 'gsap/ScrollTrigger';
import { Sparkles, Zap, Users, Layers, Lock } from 'lucide-react';

gsap.registerPlugin(ScrollTrigger);

const features = [
    {
        icon: Sparkles,
        title: 'AI-Powered Brainstorming',
        description: 'Let AI help you organize ideas, suggest layouts, and generate mind maps automatically from your notes',
    },
    {
        icon: Zap,
        title: 'Lightning Fast Performance',
        description: 'Smoothly handle thousands of shapes, images, and annotations without lag',
    },
    {
        icon: Users,
        title: 'Real-time Collaboration',
        description: 'See your team\'s cursors, edits, and sticky notes update instantly. No refresh needed',
    },
    {
        icon: Lock,
        title: 'Enterprise-Grade Security',
        description: 'Your data is encrypted end-to-end with role-based access controls and SOC 2 compliance',
    },
    {
        icon: Layers,
        title: 'Infinite Canvas Workspace',
        description: 'Never run out of space. Pan, zoom, and organize your ideas across an unlimited digital canvas',
    },
];

export function Features() {
    const sectionRef = useRef<HTMLElement>(null);

    useEffect(() => {
        const ctx = gsap.context(() => {
            gsap.from('.features-title', {
                scrollTrigger: {
                    trigger: '.features-title',
                    start: 'top 85%',
                },
                y: 24,
                opacity: 0,
                duration: 0.6,
                immediateRender: false,
            });

            gsap.from('.feature-card', {
                scrollTrigger: {
                    trigger: '.features-container',
                    start: 'top 80%',
                },
                y: 30,
                opacity: 0,
                duration: 0.5,
                stagger: 0.1,
                immediateRender: false,
            });
        }, sectionRef);

        return () => ctx.revert();
    }, []);

    return (
        <section ref={sectionRef} id="features" className="py-24 lg:py-32 bg-white relative overflow-hidden">
            {/* Subtle noise/grain texture background */}
            <div 
                className="absolute inset-0 opacity-[0.4]"
                style={{
                    backgroundImage: `url("data:image/svg+xml,%3Csvg viewBox='0 0 400 400' xmlns='http://www.w3.org/2000/svg'%3E%3Cfilter id='noiseFilter'%3E%3CfeTurbulence type='fractalNoise' baseFrequency='0.9' numOctaves='4' stitchTiles='stitch'/%3E%3C/filter%3E%3Crect width='100%25' height='100%25' filter='url(%23noiseFilter)'/%3E%3C/svg%3E")`,
                }}
            />
            {/* Hand-drawn decorative elements */}
            <svg className="absolute top-12 left-8 w-20 h-20 opacity-60" viewBox="0 0 80 80" fill="none">
                <path d="M10 40 Q 20 10, 40 20 Q 60 30, 70 10" stroke="#3B82F6" strokeWidth="2" strokeLinecap="round" fill="none" />
                <circle cx="70" cy="12" r="4" fill="#3B82F6" />
            </svg>
            
            <svg className="absolute top-20 right-12 w-16 h-16 opacity-50" viewBox="0 0 64 64" fill="none">
                <path d="M32 8 L36 28 L56 32 L36 36 L32 56 L28 36 L8 32 L28 28 Z" stroke="#3B82F6" strokeWidth="2" fill="none" />
            </svg>

            <svg className="absolute bottom-20 left-16 w-24 h-24 opacity-40" viewBox="0 0 96 96" fill="none">
                <circle cx="48" cy="48" r="40" stroke="#3B82F6" strokeWidth="2" strokeDasharray="6 6" fill="none" />
                <circle cx="48" cy="48" r="25" stroke="#3B82F6" strokeWidth="1.5" strokeDasharray="4 4" fill="none" />
            </svg>

            <svg className="absolute bottom-32 right-20 w-12 h-12 opacity-50" viewBox="0 0 48 48" fill="none">
                <path d="M24 4 C 36 16, 44 24, 24 44 C 4 24, 12 16, 24 4" stroke="#E85A4F" strokeWidth="2" fill="none" />
            </svg>

            <div className="max-w-6xl mx-auto px-4 sm:px-6 lg:px-8 relative">
                {/* Section Header - Handwritten style */}
                <div className="features-title text-center mb-16 lg:mb-20">
                    <div className="inline-block relative">
                        <h2 className="text-4xl sm:text-5xl lg:text-6xl font-black text-gray-900" style={{ fontFamily: 'Georgia, serif' }}>
                            Main Features
                        </h2>
                        {/* Hand-drawn underline */}
                        <svg className="absolute -bottom-3 left-0 w-full h-6" viewBox="0 0 300 24" fill="none" preserveAspectRatio="none">
                            <path d="M5 12 Q 75 4, 150 14 Q 225 24, 295 10" stroke="#3B82F6" strokeWidth="3" strokeLinecap="round" fill="none" />
                        </svg>
                    </div>
                    <p className="text-lg text-gray-500 mt-8 max-w-xl mx-auto">
                        Everything you need to bring your ideas to life
                    </p>
                </div>

                {/* Features - Organic layout with hand-drawn boxes */}
                <div className="features-container relative">
                    {/* Row 1 */}
                    <div className="flex flex-wrap justify-center gap-6 lg:gap-8 mb-8">
                        {features.slice(0, 3).map((feature, idx) => (
                            <div
                                key={feature.title}
                                className="feature-card relative bg-white rounded-lg p-6 w-72 shadow-soft"
                                style={{ transform: `rotate(${idx % 2 === 0 ? '-1deg' : '1deg'})` }}
                            >
                                {/* Hand-drawn border */}
                                <svg className="absolute inset-0 w-full h-full pointer-events-none" viewBox="0 0 288 140" preserveAspectRatio="none">
                                    <rect x="4" y="4" width="280" height="132" rx="8" stroke="#3B82F6" strokeWidth="2" fill="none" strokeDasharray="0" />
                                </svg>
                                
                                <div className="relative z-10">
                                    <div className="w-12 h-12 rounded-xl bg-yellow-100 flex items-center justify-center mb-4">
                                        <feature.icon className="w-6 h-6 text-yellow-700" />
                                    </div>
                                    <h3 className="text-lg font-bold text-gray-900 mb-2">{feature.title}</h3>
                                    <p className="text-gray-500 text-sm">{feature.description}</p>
                                </div>
                            </div>
                        ))}
                    </div>

                    {/* Row 2 */}
                    <div className="flex flex-wrap justify-center gap-6 lg:gap-8">
                        {features.slice(3, 5).map((feature, idx) => (
                            <div
                                key={feature.title}
                                className="feature-card relative bg-white rounded-lg p-6 w-72 shadow-soft"
                                style={{ transform: `rotate(${idx % 2 === 0 ? '1deg' : '-1deg'})` }}
                            >
                                {/* Hand-drawn border */}
                                <svg className="absolute inset-0 w-full h-full pointer-events-none" viewBox="0 0 288 140" preserveAspectRatio="none">
                                    <rect x="4" y="4" width="280" height="132" rx="8" stroke="#3B82F6" strokeWidth="2" fill="none" />
                                </svg>
                                
                                <div className="relative z-10">
                                    <div className="w-12 h-12 rounded-xl bg-gray-100 flex items-center justify-center mb-4">
                                        <feature.icon className="w-6 h-6 text-gray-700" />
                                    </div>
                                    <h3 className="text-lg font-bold text-gray-900 mb-2">{feature.title}</h3>
                                    <p className="text-gray-500 text-sm">{feature.description}</p>
                                </div>
                            </div>
                        ))}
                    </div>

                    {/* Decorative connecting swoosh */}
                    <svg className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-full h-full pointer-events-none opacity-20" viewBox="0 0 800 400" fill="none">
                        <path d="M100 200 Q 250 100, 400 200 Q 550 300, 700 200" stroke="#3B82F6" strokeWidth="3" strokeDasharray="10 10" fill="none" />
                    </svg>
                </div>

                {/* Bottom doodle */}
                <div className="flex justify-center mt-16">
                    <svg className="w-32 h-8 opacity-40" viewBox="0 0 128 32" fill="none">
                        <path d="M4 16 Q 32 4, 64 16 Q 96 28, 124 16" stroke="#3B82F6" strokeWidth="2" strokeLinecap="round" fill="none" />
                        <circle cx="64" cy="16" r="4" fill="#E85A4F" />
                    </svg>
                </div>
            </div>

            {/* Dotted section divider */}
            <div className="absolute bottom-0 left-0 right-0 border-b-2 border-dashed border-gray-200" />
        </section>
    );
}
