import { useEffect, useRef } from 'react';
import { useNavigate } from 'react-router-dom';
import gsap from 'gsap';
import { ArrowRight, Play } from 'lucide-react';
import { Button } from '../ui/button';

export function Hero() {
    const navigate = useNavigate();
    const heroRef = useRef<HTMLDivElement>(null);
    const pathRef = useRef<SVGPathElement>(null);

    useEffect(() => {
        const ctx = gsap.context(() => {
            // Text animation
            gsap.from('.hero-text > *', {
                y: 30,
                opacity: 0,
                duration: 0.8,
                stagger: 0.1,
                ease: 'power3.out',
            });

            // Illustration fade in
            gsap.from('.hero-board', {
                scale: 0.95,
                opacity: 0,
                duration: 1,
                delay: 0.3,
                ease: 'power2.out',
            });

            // Animate the drawing path
            if (pathRef.current) {
                const pathLength = pathRef.current.getTotalLength();
                gsap.set(pathRef.current, {
                    strokeDasharray: pathLength,
                    strokeDashoffset: pathLength,
                });
                gsap.to(pathRef.current, {
                    strokeDashoffset: 0,
                    duration: 2,
                    delay: 0.8,
                    ease: 'power2.inOut',
                });
            }

            // Floating animations
            gsap.to('.float-note', { y: -12, duration: 2.5, repeat: -1, yoyo: true, ease: 'sine.inOut' });
            gsap.to('.float-cursor', { y: -8, x: 5, duration: 2, repeat: -1, yoyo: true, ease: 'sine.inOut', delay: 0.5 });
            gsap.to('.float-shape', { y: -10, rotation: 5, duration: 2.8, repeat: -1, yoyo: true, ease: 'sine.inOut', delay: 0.3 });

            // Cursor movement
            gsap.to('.cursor-dot', {
                x: 40,
                y: -30,
                duration: 3,
                repeat: -1,
                yoyo: true,
                ease: 'power1.inOut',
                delay: 1,
            });
        }, heroRef);

        return () => ctx.revert();
    }, []);

    return (
        <section ref={heroRef} className="relative min-h-screen flex items-center pt-16 overflow-hidden bg-gradient-to-b from-slate-50 to-white">
            <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 w-full">
                <div className="grid lg:grid-cols-2 gap-12 lg:gap-20 items-center">
                    {/* Text */}
                    <div className="hero-text text-center lg:text-left">
                        <div className="inline-flex items-center gap-2 px-4 py-2 rounded-full bg-primary-50 border border-primary-100 mb-6">
                            <span className="w-2 h-2 rounded-full bg-primary-500 animate-pulse" />
                            <span className="text-sm font-medium text-primary-700">AI-Powered Whiteboard</span>
                        </div>

                        <h1 className="text-4xl sm:text-5xl lg:text-6xl font-bold text-slate-900 leading-tight mb-6">
                            Where ideas
                            <br />
                            <span className="text-primary-600">come to life</span>
                        </h1>

                        <p className="text-lg text-slate-600 max-w-md mx-auto lg:mx-0 mb-8">
                            The collaborative whiteboard for teams who think visually.
                            Sketch, plan, and create together in real-time.
                        </p>

                        <div className="flex flex-col sm:flex-row gap-3 justify-center lg:justify-start">
                            <Button
                                size="lg"
                                onClick={() => navigate('/signup')}
                                className="bg-slate-900 hover:bg-slate-800 text-white px-6 group"
                            >
                                Start for free
                                <ArrowRight className="w-4 h-4 ml-2 group-hover:translate-x-1 transition-transform" />
                            </Button>
                            <Button
                                size="lg"
                                variant="outline"
                                className="border-slate-200 text-slate-700 hover:bg-slate-50"
                            >
                                <Play className="w-4 h-4 mr-2" />
                                See it in action
                            </Button>
                        </div>

                        <p className="text-sm text-slate-500 mt-6">
                            Free forever • No credit card required
                        </p>
                    </div>

                    {/* Illustration */}
                    <div className="relative hero-board">
                        <div className="relative max-w-md mx-auto">
                            {/* Main whiteboard */}
                            <div className="bg-white rounded-2xl shadow-2xl border border-slate-200 overflow-hidden">
                                {/* Window bar */}
                                <div className="h-8 bg-slate-50 border-b border-slate-100 flex items-center px-3 gap-1.5">
                                    <div className="w-2.5 h-2.5 rounded-full bg-red-400" />
                                    <div className="w-2.5 h-2.5 rounded-full bg-amber-400" />
                                    <div className="w-2.5 h-2.5 rounded-full bg-green-400" />
                                </div>

                                {/* Canvas */}
                                <div className="p-6 min-h-[280px] relative">
                                    <svg className="w-full h-48" viewBox="0 0 320 160" fill="none">
                                        {/* Animated curved line */}
                                        <path
                                            ref={pathRef}
                                            d="M30 100 Q 80 30, 140 70 Q 200 110, 260 50"
                                            stroke="#6366f1"
                                            strokeWidth="3"
                                            strokeLinecap="round"
                                            fill="none"
                                        />

                                        {/* Static shapes */}
                                        <rect x="40" y="110" width="50" height="35" rx="4" fill="#fef3c7" stroke="#fbbf24" strokeWidth="1.5" />
                                        <rect x="140" y="90" width="40" height="40" rx="4" fill="#dbeafe" stroke="#3b82f6" strokeWidth="1.5" />
                                        <circle cx="250" cy="100" r="22" fill="#dcfce7" stroke="#22c55e" strokeWidth="1.5" />
                                    </svg>

                                    {/* Cursor with name */}
                                    <div className="cursor-dot absolute bottom-16 left-1/3">
                                        <svg width="20" height="24" viewBox="0 0 20 24" fill="none">
                                            <path d="M4 2L4 18L7 15L10 22L14 20L11 13L16 13L4 2Z" fill="#6366f1" stroke="white" strokeWidth="1.5" />
                                        </svg>
                                        <span className="absolute left-5 top-4 text-xs bg-primary-600 text-white px-2 py-0.5 rounded-full whitespace-nowrap">Alex</span>
                                    </div>
                                </div>
                            </div>

                            {/* Floating sticky note */}
                            <div className="float-note absolute -top-4 -right-4 w-16 h-16 bg-amber-100 rounded-lg shadow-lg border border-amber-200 rotate-6 p-2 z-10">
                                <div className="w-10 h-1.5 bg-amber-300 rounded mb-1" />
                                <div className="w-8 h-1.5 bg-amber-200 rounded mb-1" />
                                <div className="w-6 h-1.5 bg-amber-200 rounded" />
                            </div>

                            {/* Floating shape */}
                            <div className="float-shape absolute -bottom-2 right-6 w-10 h-10 bg-teal-100 rounded-xl border border-teal-200 shadow-lg -rotate-12 z-10" />
                        </div>
                    </div>
                </div>
            </div>
        </section>
    );
}
