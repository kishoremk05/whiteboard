import { useEffect, useRef, useState } from 'react';
import gsap from 'gsap';
import { ScrollTrigger } from 'gsap/ScrollTrigger';
import { Quote, ChevronLeft, ChevronRight } from 'lucide-react';

gsap.registerPlugin(ScrollTrigger);

const testimonials = [
    {
        quote: "This tool has transformed how our distributed team collaborates. The real-time sync is incredibly smooth and intuitive.",
        role: "Design Lead",
        company: "Technology Company",
        avatar: "bg-purple-500",
    },
    {
        quote: "We consolidated multiple tools into this single canvas. Planning, brainstorming, and documentation—all in one place.",
        role: "Product Manager",
        company: "Software Startup",
        avatar: "bg-blue-500",
    },
    {
        quote: "The AI-powered features genuinely save us time every sprint. It's become an essential part of our workflow.",
        role: "Engineering Manager",
        company: "Enterprise Team",
        avatar: "bg-green-500",
    },
];

export function Testimonials() {
    const sectionRef = useRef<HTMLElement>(null);
    const [activeIndex, setActiveIndex] = useState(0);

    useEffect(() => {
        const ctx = gsap.context(() => {
            gsap.from('.testimonials-header', {
                scrollTrigger: {
                    trigger: sectionRef.current,
                    start: 'top 80%',
                },
                y: 24,
                opacity: 0,
                duration: 0.6,
                ease: 'power2.out',
            });
        }, sectionRef);

        return () => ctx.revert();
    }, []);

    const nextSlide = () => {
        setActiveIndex((prev) => (prev + 1) % testimonials.length);
    };

    const prevSlide = () => {
        setActiveIndex((prev) => (prev - 1 + testimonials.length) % testimonials.length);
    };

    return (
        <section ref={sectionRef} id="testimonials" className="py-24 lg:py-32 bg-cream-100">
            <div className="max-w-5xl mx-auto px-4 sm:px-6 lg:px-8">
                {/* Header */}
                <div className="testimonials-header text-center mb-16">
                    <div className="inline-flex items-center gap-2 px-4 py-2 rounded-full bg-white border border-cream-300 mb-6">
                        <div className="w-2 h-2 rounded-full bg-primary-500" />
                        <span className="text-sm font-medium text-brown-700">What Teams Say</span>
                    </div>
                    <h2 className="text-3xl sm:text-4xl lg:text-5xl font-bold text-brown-800 mb-4">
                        Trusted by teams{' '}
                        <span className="text-primary-500">everywhere</span>
                    </h2>
                </div>

                {/* Single Card Carousel */}
                <div className="relative max-w-3xl mx-auto">
                    {/* Main Card */}
                    <div className="bg-white rounded-2xl p-8 lg:p-12 shadow-medium border border-cream-300 text-center">
                        <Quote className="w-12 h-12 text-primary-200 mx-auto mb-6" />
                        
                        <p className="text-xl lg:text-2xl text-brown-700 leading-relaxed mb-8">
                            "{testimonials[activeIndex].quote}"
                        </p>

                        <div className="flex flex-col items-center gap-3">
                            <div className={`w-14 h-14 rounded-full ${testimonials[activeIndex].avatar} flex items-center justify-center`}>
                                <span className="text-white text-xl font-bold">
                                    {testimonials[activeIndex].role.charAt(0)}
                                </span>
                            </div>
                            <div>
                                <p className="font-semibold text-brown-800">{testimonials[activeIndex].role}</p>
                                <p className="text-brown-500 text-sm">{testimonials[activeIndex].company}</p>
                            </div>
                        </div>
                    </div>

                    {/* Navigation */}
                    <div className="flex justify-center items-center gap-4 mt-8">
                        <button
                            onClick={prevSlide}
                            className="w-10 h-10 rounded-full bg-white border border-cream-300 flex items-center justify-center text-brown-600 hover:bg-cream-100 transition-colors shadow-soft"
                        >
                            <ChevronLeft className="w-5 h-5" />
                        </button>

                        {/* Dots */}
                        <div className="flex gap-2">
                            {testimonials.map((_, i) => (
                                <button
                                    key={i}
                                    onClick={() => setActiveIndex(i)}
                                    className={`w-2.5 h-2.5 rounded-full transition-all ${
                                        i === activeIndex ? 'bg-primary-500 w-8' : 'bg-cream-400 hover:bg-cream-500'
                                    }`}
                                />
                            ))}
                        </div>

                        <button
                            onClick={nextSlide}
                            className="w-10 h-10 rounded-full bg-white border border-cream-300 flex items-center justify-center text-brown-600 hover:bg-cream-100 transition-colors shadow-soft"
                        >
                            <ChevronRight className="w-5 h-5" />
                        </button>
                    </div>
                </div>
            </div>
        </section>
    );
}
