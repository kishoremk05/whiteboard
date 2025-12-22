import { useEffect, useRef } from 'react';
import { useNavigate } from 'react-router-dom';
import gsap from 'gsap';
import { ScrollTrigger } from 'gsap/ScrollTrigger';
import { ArrowRight, CheckCircle2 } from 'lucide-react';
import { Button } from '../ui/button';

gsap.registerPlugin(ScrollTrigger);

const benefits = [
    'Unlimited boards',
    'Real-time collaboration',
    'AI-powered features',
    'No credit card required',
];

export function CTA() {
    const navigate = useNavigate();
    const sectionRef = useRef<HTMLElement>(null);

    useEffect(() => {
        const ctx = gsap.context(() => {
            gsap.from('.cta-content > *', {
                scrollTrigger: {
                    trigger: sectionRef.current,
                    start: 'top 80%',
                },
                y: 24,
                opacity: 0,
                duration: 0.5,
                stagger: 0.08,
                ease: 'power2.out',
            });
        }, sectionRef);

        return () => ctx.revert();
    }, []);

    return (
        <section ref={sectionRef} className="py-24 lg:py-32 bg-gray-900">
            <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8">
                <div className="cta-content text-center">
                    {/* Heading */}
                    <h2 className="text-3xl sm:text-4xl lg:text-5xl font-bold text-white mb-6">
                        Ready to bring your ideas to life?
                    </h2>

                    {/* Description */}
                    <p className="text-lg text-gray-400 mb-8 max-w-xl mx-auto">
                        Join thousands of teams using CanvasAI to visualize, collaborate, and create together.
                    </p>

                    {/* Benefits */}
                    <div className="flex flex-wrap justify-center gap-4 mb-10">
                        {benefits.map((benefit) => (
                            <div key={benefit} className="flex items-center gap-2 text-sm text-white">
                                <CheckCircle2 className="w-4 h-4 text-gray-400" />
                                {benefit}
                            </div>
                        ))}
                    </div>

                    {/* CTA Buttons */}
                    <div className="flex flex-col sm:flex-row gap-4 justify-center">
                        <Button
                            size="xl"
                            onClick={() => navigate('/signup')}
                            className="bg-white text-gray-900 hover:bg-gray-100 rounded-full px-8 shadow-md hover:shadow-lg transition-all duration-200"
                        >
                            Get Started Free
                            <ArrowRight className="w-5 h-5" />
                        </Button>
                        <Button
                            size="xl"
                            onClick={() => navigate('/login')}
                            className="bg-white text-gray-900 hover:bg-gray-100 rounded-full px-8 shadow-md hover:shadow-lg transition-all duration-200"
                        >
                            Sign In
                        </Button>
                    </div>
                </div>
            </div>
        </section>
    );
}
