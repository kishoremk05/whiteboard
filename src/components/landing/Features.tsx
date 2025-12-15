import { useEffect, useRef } from 'react';
import gsap from 'gsap';
import { ScrollTrigger } from 'gsap/ScrollTrigger';

gsap.registerPlugin(ScrollTrigger);

const features = [
    {
        icon: (
            <svg className="w-12 h-12" viewBox="0 0 48 48" fill="none">
                <path d="M12 36V16L24 8L36 16V36L24 28L12 36Z" fill="#e0e7ff" stroke="#6366f1" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
                    <animate attributeName="d" values="M12 36V16L24 8L36 16V36L24 28L12 36Z;M14 34V18L24 10L34 18V34L24 26L14 34Z;M12 36V16L24 8L36 16V36L24 28L12 36Z" dur="3s" repeatCount="indefinite" />
                </path>
                <circle cx="24" cy="20" r="4" fill="#6366f1">
                    <animate attributeName="r" values="4;5;4" dur="2s" repeatCount="indefinite" />
                </circle>
            </svg>
        ),
        title: 'AI-Powered',
        description: 'Smart suggestions and auto-complete help you work faster. Let AI enhance your creativity.',
    },
    {
        icon: (
            <svg className="w-12 h-12" viewBox="0 0 48 48" fill="none">
                <circle cx="18" cy="20" r="8" fill="#dcfce7" stroke="#22c55e" strokeWidth="2" />
                <circle cx="30" cy="20" r="8" fill="#dbeafe" stroke="#3b82f6" strokeWidth="2" />
                <circle cx="24" cy="32" r="8" fill="#fef3c7" stroke="#f59e0b" strokeWidth="2" />
                <path d="M18 28L24 24L30 28" stroke="#64748b" strokeWidth="1.5" strokeLinecap="round">
                    <animate attributeName="stroke-dashoffset" from="20" to="0" dur="1.5s" repeatCount="indefinite" />
                </path>
            </svg>
        ),
        title: 'Real-time Collaboration',
        description: 'Work together with your team simultaneously. See live cursors and changes instantly.',
    },
    {
        icon: (
            <svg className="w-12 h-12" viewBox="0 0 48 48" fill="none">
                <polygon points="24,8 40,40 8,40" fill="#fef3c7" stroke="#f59e0b" strokeWidth="2" strokeLinejoin="round">
                    <animateTransform attributeName="transform" type="rotate" values="0 24 28;5 24 28;0 24 28;-5 24 28;0 24 28" dur="4s" repeatCount="indefinite" />
                </polygon>
                <circle cx="24" cy="28" r="4" fill="#f59e0b" />
            </svg>
        ),
        title: 'Lightning Fast',
        description: 'Optimized canvas engine handles thousands of objects without slowing down.',
    },
];

export function Features() {
    const sectionRef = useRef<HTMLElement>(null);
    const cardsRef = useRef<HTMLDivElement>(null);

    useEffect(() => {
        const ctx = gsap.context(() => {
            gsap.from('.feature-title', {
                scrollTrigger: {
                    trigger: sectionRef.current,
                    start: 'top 80%',
                },
                y: 30,
                opacity: 0,
                duration: 0.6,
                ease: 'power3.out',
            });

            gsap.from('.feature-card', {
                scrollTrigger: {
                    trigger: cardsRef.current,
                    start: 'top 85%',
                },
                y: 50,
                opacity: 0,
                duration: 0.7,
                stagger: 0.15,
                ease: 'power3.out',
            });
        }, sectionRef);

        return () => ctx.revert();
    }, []);

    return (
        <section ref={sectionRef} id="features" className="py-24 bg-white">
            <div className="max-w-5xl mx-auto px-4 sm:px-6 lg:px-8">
                {/* Header */}
                <div className="feature-title text-center mb-16">
                    <h2 className="text-3xl sm:text-4xl font-bold text-slate-900 mb-4">
                        Everything you need
                    </h2>
                    <p className="text-lg text-slate-600 max-w-2xl mx-auto">
                        Powerful features to help you create, collaborate, and ship faster.
                    </p>
                </div>

                {/* Features */}
                <div ref={cardsRef} className="grid md:grid-cols-3 gap-12">
                    {features.map((feature) => (
                        <div key={feature.title} className="feature-card text-center">
                            <div className="inline-flex items-center justify-center mb-6">
                                {feature.icon}
                            </div>
                            <h3 className="text-xl font-semibold text-slate-900 mb-3">
                                {feature.title}
                            </h3>
                            <p className="text-slate-600 leading-relaxed">
                                {feature.description}
                            </p>
                        </div>
                    ))}
                </div>
            </div>
        </section>
    );
}
