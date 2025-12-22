import { useEffect, useRef } from 'react';
import gsap from 'gsap';
import { ScrollTrigger } from 'gsap/ScrollTrigger';

gsap.registerPlugin(ScrollTrigger);

const steps = [
    {
        number: '01',
        title: 'Create Your Board',
        description: 'Start with a blank canvas or choose from pre-built templates. Add sticky notes, shapes, images, and text with intuitive drag-and-drop tools.',
    },
    {
        number: '02',
        title: 'Collaborate in Real-Time',
        description: 'Invite team members via shareable links. Watch as everyone\'s ideas appear instantly with live cursors and synchronized updates.',
    },
    {
        number: '03',
        title: 'Export & Share',
        description: 'Download your board as PNG, PDF, or SVG. Present directly from the app, or integrate with your favorite productivity tools.',
    },
];

export function HowItWorks() {
    const sectionRef = useRef<HTMLElement>(null);

    useEffect(() => {
        const ctx = gsap.context(() => {
            gsap.from('.hiw-title', {
                scrollTrigger: {
                    trigger: '.hiw-title',
                    start: 'top 85%',
                },
                y: 24,
                opacity: 0,
                duration: 0.6,
            });

            gsap.from('.step-card', {
                scrollTrigger: {
                    trigger: '.steps-container',
                    start: 'top 80%',
                },
                y: 30,
                opacity: 0,
                duration: 0.5,
                stagger: 0.15,
            });
        }, sectionRef);

        return () => ctx.revert();
    }, []);

    return (
        <section ref={sectionRef} id="how-it-works" className="py-24 lg:py-32 bg-white relative overflow-hidden">
            {/* Subtle noise/grain texture background */}
            <div 
                className="absolute inset-0 opacity-[0.4]"
                style={{
                    backgroundImage: `url("data:image/svg+xml,%3Csvg viewBox='0 0 400 400' xmlns='http://www.w3.org/2000/svg'%3E%3Cfilter id='noiseFilter'%3E%3CfeTurbulence type='fractalNoise' baseFrequency='0.9' numOctaves='4' stitchTiles='stitch'/%3E%3C/filter%3E%3Crect width='100%25' height='100%25' filter='url(%23noiseFilter)'/%3E%3C/svg%3E")`,
                }}
            />
            {/* Hand-drawn decorative doodles */}
            <svg className="absolute top-16 right-8 w-24 h-24 opacity-50" viewBox="0 0 96 96" fill="none">
                <path d="M20 48 Q 48 20, 76 48 Q 48 76, 20 48" stroke="#3B82F6" strokeWidth="2" fill="none" />
                <circle cx="48" cy="48" r="8" stroke="#E85A4F" strokeWidth="2" fill="none" />
            </svg>

            <svg className="absolute top-1/2 left-4 w-16 h-32 opacity-40" viewBox="0 0 64 128" fill="none">
                <path d="M32 8 Q 8 32, 32 64 Q 56 96, 32 120" stroke="#3B82F6" strokeWidth="2" strokeLinecap="round" fill="none" />
                <circle cx="32" cy="8" r="4" fill="#3B82F6" />
                <circle cx="32" cy="120" r="4" fill="#3B82F6" />
            </svg>

            <svg className="absolute bottom-16 right-16 w-20 h-20 opacity-40" viewBox="0 0 80 80" fill="none">
                <path d="M40 10 L44 36 L70 40 L44 44 L40 70 L36 44 L10 40 L36 36 Z" stroke="#E85A4F" strokeWidth="2" fill="none" />
            </svg>

            {/* Lightbulb doodle */}
            <svg className="absolute top-24 left-12 w-12 h-16 opacity-50" viewBox="0 0 48 64" fill="none">
                <ellipse cx="24" cy="24" rx="16" ry="18" stroke="#FBBF24" strokeWidth="2" fill="none" />
                <path d="M18 42 L18 52 L30 52 L30 42" stroke="#FBBF24" strokeWidth="2" fill="none" />
                <path d="M20 56 L28 56" stroke="#FBBF24" strokeWidth="2" strokeLinecap="round" />
                <path d="M24 6 L24 2" stroke="#FBBF24" strokeWidth="2" strokeLinecap="round" />
                <path d="M8 24 L4 24" stroke="#FBBF24" strokeWidth="2" strokeLinecap="round" />
                <path d="M40 24 L44 24" stroke="#FBBF24" strokeWidth="2" strokeLinecap="round" />
            </svg>

            <div className="max-w-5xl mx-auto px-4 sm:px-6 lg:px-8 relative">
                {/* Section Header */}
                <div className="hiw-title text-center mb-16 lg:mb-20">
                    <div className="inline-block relative">
                        <h2 className="text-4xl sm:text-5xl lg:text-6xl font-black text-gray-900" style={{ fontFamily: 'Georgia, serif' }}>
                            How It Works
                        </h2>
                        <svg className="absolute -bottom-3 left-0 w-full h-6" viewBox="0 0 300 24" fill="none" preserveAspectRatio="none">
                            <path d="M5 12 Q 75 20, 150 10 Q 225 0, 295 14" stroke="#3B82F6" strokeWidth="3" strokeLinecap="round" fill="none" />
                        </svg>
                    </div>
                    <p className="text-lg text-gray-500 mt-8 max-w-xl mx-auto">
                        Get started in just a few simple steps
                    </p>
                </div>

                {/* Steps - Hand-drawn style boxes */}
                <div className="steps-container flex flex-col lg:flex-row gap-8 lg:gap-6 items-center lg:items-stretch justify-center">
                    {steps.map((step, idx) => (
                        <div
                            key={step.number}
                            className="step-card relative bg-white rounded-lg p-8 w-full max-w-xs shadow-soft"
                            style={{ transform: `rotate(${idx === 1 ? '0deg' : idx === 0 ? '-2deg' : '2deg'})` }}
                        >
                            {/* Hand-drawn border */}
                            <svg className="absolute inset-0 w-full h-full pointer-events-none" viewBox="0 0 280 200" preserveAspectRatio="none">
                                <rect x="4" y="4" width="272" height="192" rx="8" stroke="#3B82F6" strokeWidth="2.5" fill="none" />
                            </svg>

                            <div className="relative z-10 text-center">
                                {/* Number badge */}
                                <div className="w-16 h-16 mx-auto mb-6 rounded-full bg-gray-900 text-white flex items-center justify-center text-2xl font-bold shadow-md">
                                    {step.number}
                                </div>
                                <h3 className="text-xl font-bold text-gray-900 mb-3">{step.title}</h3>
                                <p className="text-gray-500">{step.description}</p>
                            </div>

                            {/* Connecting arrow (not on last item) */}
                            {idx < 2 && (
                                <svg className="hidden lg:block absolute -right-8 top-1/2 -translate-y-1/2 w-12 h-8" viewBox="0 0 48 32" fill="none">
                                    <path d="M4 16 Q 24 8, 36 16 Q 24 24, 4 16" stroke="#3B82F6" strokeWidth="2" fill="none" />
                                    <path d="M32 10 L40 16 L32 22" stroke="#3B82F6" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" fill="none" />
                                </svg>
                            )}
                        </div>
                    ))}
                </div>

                {/* Bottom decorative element */}
                <div className="flex justify-center mt-16">
                    <svg className="w-48 h-12 opacity-30" viewBox="0 0 192 48" fill="none">
                        <path d="M8 24 Q 48 8, 96 24 Q 144 40, 184 24" stroke="#3B82F6" strokeWidth="2" strokeDasharray="6 4" fill="none" />
                        <circle cx="96" cy="24" r="6" stroke="#E85A4F" strokeWidth="2" fill="none" />
                    </svg>
                </div>
            </div>

            {/* Dotted section divider */}
            <div className="absolute bottom-0 left-0 right-0 border-b-2 border-dashed border-gray-200" />
        </section>
    );
}
