import { useEffect, useRef } from 'react';
import gsap from 'gsap';
import { ScrollTrigger } from 'gsap/ScrollTrigger';
import { PenTool, Users, Sparkles, Share } from 'lucide-react';

gsap.registerPlugin(ScrollTrigger);

const steps = [
    {
        number: '01',
        icon: PenTool,
        title: 'Create Your Board',
        description: 'Start with a blank canvas or choose from professional templates.',
        color: 'bg-blue-500',
        lightColor: 'bg-blue-100',
    },
    {
        number: '02',
        icon: Users,
        title: 'Invite Your Team',
        description: 'Share with collaborators and work together in real-time.',
        color: 'bg-green-500',
        lightColor: 'bg-green-100',
    },
    {
        number: '03',
        icon: Sparkles,
        title: 'Enhance with AI',
        description: 'Let AI organize ideas, suggest layouts, and automate tasks.',
        color: 'bg-purple-500',
        lightColor: 'bg-purple-100',
    },
    {
        number: '04',
        icon: Share,
        title: 'Share & Export',
        description: 'Present, embed, or export your board in any format.',
        color: 'bg-orange-500',
        lightColor: 'bg-orange-100',
    },
];

export function HowItWorks() {
    const sectionRef = useRef<HTMLElement>(null);

    useEffect(() => {
        const ctx = gsap.context(() => {
            gsap.from('.hiw-header', {
                scrollTrigger: {
                    trigger: sectionRef.current,
                    start: 'top 80%',
                },
                y: 30,
                opacity: 0,
                duration: 0.8,
                ease: 'power2.out',
            });

            gsap.from('.hiw-step', {
                scrollTrigger: {
                    trigger: '.hiw-steps',
                    start: 'top 80%',
                },
                y: 40,
                opacity: 0,
                duration: 0.6,
                stagger: 0.15,
                ease: 'power2.out',
            });

            gsap.from('.hiw-connector', {
                scrollTrigger: {
                    trigger: '.hiw-steps',
                    start: 'top 75%',
                },
                scaleX: 0,
                duration: 0.8,
                stagger: 0.2,
                ease: 'power2.out',
            });
        }, sectionRef);

        return () => ctx.revert();
    }, []);

    return (
        <section ref={sectionRef} id="how-it-works" className="py-24 lg:py-32 bg-gray-50 relative overflow-hidden">
            {/* Background decoration */}
            <div className="absolute inset-0 opacity-40">
                <div className="absolute top-20 left-10 w-32 h-32 bg-yellow-200 rounded-full blur-3xl" />
                <div className="absolute bottom-20 right-10 w-40 h-40 bg-blue-200 rounded-full blur-3xl" />
            </div>

            {/* Dot pattern */}
            <div 
                className="absolute inset-0 opacity-[0.3]"
                style={{
                    backgroundImage: `radial-gradient(circle, #d1d5db 1px, transparent 1px)`,
                    backgroundSize: '24px 24px',
                }}
            />

            <div className="max-w-6xl mx-auto px-4 sm:px-6 lg:px-8 relative z-10">
                {/* Section Header */}
                <div className="hiw-header text-center mb-20">
                    <div className="inline-flex items-center gap-2 bg-gray-900 text-white px-4 py-2 rounded-full text-sm font-medium mb-6">
                        <span className="w-2 h-2 bg-green-400 rounded-full animate-pulse" />
                        Simple & Intuitive
                    </div>
                    <h2 className="text-4xl sm:text-5xl lg:text-6xl font-black text-gray-900 mb-6">
                        Get started in{' '}
                        <span className="relative inline-block">
                            minutes
                            <div className="absolute -bottom-1 left-0 right-0 h-3 bg-yellow-300 -z-10 rounded" />
                        </span>
                    </h2>
                    <p className="text-lg text-gray-500 max-w-2xl mx-auto">
                        From sign-up to your first collaborative board in under 5 minutes.
                    </p>
                </div>

                {/* Steps */}
                <div className="hiw-steps relative">
                    {/* Connection line */}
                    <div className="hidden lg:block absolute top-20 left-[12%] right-[12%] h-0.5 bg-gray-200" />
                    
                    <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-8 lg:gap-6">
                        {steps.map((step, index) => (
                            <div key={step.number} className="hiw-step relative">
                                {/* Step card */}
                                <div className="bg-white rounded-3xl p-6 lg:p-8 shadow-lg border border-gray-100 text-center relative z-10 hover:shadow-xl transition-shadow duration-300">
                                    {/* Number badge */}
                                    <div className={`absolute -top-4 left-1/2 -translate-x-1/2 w-8 h-8 ${step.color} rounded-full flex items-center justify-center shadow-lg`}>
                                        <span className="text-white text-sm font-bold">{index + 1}</span>
                                    </div>
                                    
                                    {/* Icon */}
                                    <div className={`w-16 h-16 ${step.lightColor} rounded-2xl flex items-center justify-center mx-auto mb-5 mt-2`}>
                                        <step.icon className={`w-8 h-8 ${step.color.replace('bg-', 'text-')}`} />
                                    </div>
                                    
                                    {/* Content */}
                                    <h3 className="text-lg font-bold text-gray-900 mb-2">{step.title}</h3>
                                    <p className="text-gray-500 text-sm leading-relaxed">{step.description}</p>
                                </div>
                                
                                {/* Connector arrow for desktop */}
                                {index < steps.length - 1 && (
                                    <div className="hiw-connector hidden lg:block absolute top-20 -right-3 z-20">
                                        <svg width="24" height="24" viewBox="0 0 24 24" fill="none">
                                            <path d="M5 12H19M19 12L12 5M19 12L12 19" stroke="#9CA3AF" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"/>
                                        </svg>
                                    </div>
                                )}
                            </div>
                        ))}
                    </div>
                </div>
            </div>
        </section>
    );
}
