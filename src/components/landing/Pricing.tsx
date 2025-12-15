import { useEffect, useRef } from 'react';
import { useNavigate } from 'react-router-dom';
import gsap from 'gsap';
import { ScrollTrigger } from 'gsap/ScrollTrigger';
import { Check } from 'lucide-react';
import { Button } from '../ui/button';

gsap.registerPlugin(ScrollTrigger);

const plans = [
    {
        name: 'Free',
        price: '$0',
        period: 'forever',
        description: 'Perfect for getting started',
        features: [
            '3 active boards',
            'Basic templates',
            'Export to PNG',
            'Community support',
        ],
        cta: 'Get Started',
        popular: false,
    },
    {
        name: 'Pro',
        price: '$12',
        period: '/month',
        description: 'For professionals and power users',
        features: [
            'Unlimited boards',
            'All templates',
            'Export to PDF, PNG, SVG',
            'Priority support',
            'Version history',
            'Custom branding',
        ],
        cta: 'Start Free Trial',
        popular: true,
    },
    {
        name: 'Team',
        price: '$29',
        period: '/user/month',
        description: 'For teams that collaborate',
        features: [
            'Everything in Pro',
            'Unlimited team members',
            'Admin controls',
            'SSO integration',
            'Advanced analytics',
            'Dedicated support',
        ],
        cta: 'Contact Sales',
        popular: false,
    },
];

export function Pricing() {
    const sectionRef = useRef<HTMLElement>(null);
    const cardsRef = useRef<(HTMLDivElement | null)[]>([]);
    const navigate = useNavigate();

    useEffect(() => {
        const ctx = gsap.context(() => {
            gsap.from('.pricing-header', {
                scrollTrigger: {
                    trigger: sectionRef.current,
                    start: 'top 80%',
                    toggleActions: 'play none none reverse',
                },
                y: 40,
                opacity: 0,
                duration: 0.8,
                ease: 'power3.out',
            });

            cardsRef.current.forEach((card, index) => {
                if (card) {
                    gsap.from(card, {
                        scrollTrigger: {
                            trigger: card,
                            start: 'top 85%',
                            toggleActions: 'play none none reverse',
                        },
                        y: 60,
                        opacity: 0,
                        duration: 0.7,
                        delay: index * 0.15,
                        ease: 'power3.out',
                    });
                }
            });
        }, sectionRef);

        return () => ctx.revert();
    }, []);

    return (
        <section
            ref={sectionRef}
            id="pricing"
            className="py-24 bg-slate-50"
        >
            <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
                {/* Section Header */}
                <div className="pricing-header text-center max-w-3xl mx-auto mb-16">
                    <h2 className="text-3xl sm:text-4xl font-bold text-slate-900 mb-4">
                        Simple, transparent pricing
                    </h2>
                    <p className="text-lg text-slate-600">
                        Start free, upgrade when you need more. No hidden fees.
                    </p>
                </div>

                {/* Pricing Cards */}
                <div className="grid md:grid-cols-3 gap-6 lg:gap-8">
                    {plans.map((plan, index) => (
                        <div
                            key={plan.name}
                            ref={(el) => { cardsRef.current[index] = el; }}
                            className={`relative bg-white rounded-2xl p-8 border-2 transition-all ${plan.popular
                                    ? 'border-primary-500 shadow-lg scale-105'
                                    : 'border-slate-200 hover:border-slate-300 hover:shadow-md'
                                }`}
                        >
                            {/* Popular Badge */}
                            {plan.popular && (
                                <div className="absolute -top-4 left-1/2 -translate-x-1/2">
                                    <span className="bg-primary-600 text-white text-sm font-medium px-4 py-1 rounded-full">
                                        Most Popular
                                    </span>
                                </div>
                            )}

                            {/* Plan Info */}
                            <div className="text-center mb-8">
                                <h3 className="text-xl font-semibold text-slate-900 mb-2">
                                    {plan.name}
                                </h3>
                                <div className="flex items-baseline justify-center gap-1 mb-2">
                                    <span className="text-4xl font-bold text-slate-900">{plan.price}</span>
                                    <span className="text-slate-500">{plan.period}</span>
                                </div>
                                <p className="text-slate-600 text-sm">{plan.description}</p>
                            </div>

                            {/* Features */}
                            <ul className="space-y-3 mb-8">
                                {plan.features.map((feature) => (
                                    <li key={feature} className="flex items-center gap-3 text-slate-700">
                                        <div className={`w-5 h-5 rounded-full flex items-center justify-center ${plan.popular ? 'bg-primary-100 text-primary-600' : 'bg-slate-100 text-slate-600'
                                            }`}>
                                            <Check className="w-3 h-3" />
                                        </div>
                                        {feature}
                                    </li>
                                ))}
                            </ul>

                            {/* CTA */}
                            <Button
                                onClick={() => navigate('/signup')}
                                className={`w-full ${plan.popular
                                        ? 'bg-primary-600 hover:bg-primary-700 text-white'
                                        : 'bg-slate-100 hover:bg-slate-200 text-slate-900'
                                    }`}
                                size="lg"
                            >
                                {plan.cta}
                            </Button>
                        </div>
                    ))}
                </div>
            </div>
        </section>
    );
}
