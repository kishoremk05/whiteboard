import { useEffect, useRef } from 'react';
import { useNavigate } from 'react-router-dom';
import gsap from 'gsap';
import { ScrollTrigger } from 'gsap/ScrollTrigger';
import { Check, Star } from 'lucide-react';
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
                },
                y: 24,
                opacity: 0,
                duration: 0.6,
                ease: 'power2.out',
            });

            cardsRef.current.forEach((card, index) => {
                if (card) {
                    gsap.from(card, {
                        scrollTrigger: {
                            trigger: card,
                            start: 'top 85%',
                        },
                        y: 24,
                        opacity: 0,
                        duration: 0.5,
                        delay: index * 0.1,
                        ease: 'power2.out',
                    });
                }
            });
        }, sectionRef);

        return () => ctx.revert();
    }, []);

    return (
        <section ref={sectionRef} id="pricing" className="py-24 lg:py-32 bg-cream-200">
            <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
                {/* Section Header */}
                <div className="pricing-header text-center max-w-3xl mx-auto mb-16">
                    <div className="inline-flex items-center gap-2 px-4 py-2 rounded-full bg-white border border-cream-300 mb-6">
                        <div className="w-2 h-2 rounded-full bg-primary-500" />
                        <span className="text-sm font-medium text-brown-700">Pricing</span>
                    </div>
                    <h2 className="text-3xl sm:text-4xl lg:text-5xl font-bold text-brown-800 mb-4">
                        Simple,{' '}
                        <span className="text-primary-500">transparent</span> pricing
                    </h2>
                    <p className="text-lg text-brown-600">
                        Start free, upgrade when you need more. No hidden fees.
                    </p>
                </div>

                {/* Pricing Cards - Horizontal scrolling on mobile */}
                <div className="overflow-x-auto pb-4 -mx-4 px-4 lg:overflow-visible lg:px-0 scrollbar-hide">
                    <div className="flex gap-6 lg:gap-8 lg:justify-center" style={{ minWidth: 'max-content' }}>
                        {plans.map((plan, index) => (
                            <div
                                key={plan.name}
                                ref={(el) => { cardsRef.current[index] = el; }}
                                className={`relative bg-white rounded-2xl p-8 border-2 transition-all duration-200 w-80 lg:w-auto lg:flex-1 lg:max-w-sm flex-shrink-0 ${
                                    plan.popular
                                        ? 'border-primary-500 shadow-medium lg:scale-105'
                                        : 'border-cream-300 shadow-soft hover:shadow-medium hover:-translate-y-0.5'
                                }`}
                            >
                                {/* Popular Badge */}
                                {plan.popular && (
                                    <div className="absolute -top-4 left-1/2 -translate-x-1/2">
                                        <span className="bg-primary-500 text-white text-sm font-medium px-4 py-1.5 rounded-full shadow-soft flex items-center gap-1">
                                            <Star className="w-3.5 h-3.5 fill-current" />
                                            Most Popular
                                        </span>
                                    </div>
                                )}

                                {/* Plan Info */}
                                <div className="text-center mb-8">
                                    <h3 className="text-xl font-semibold text-brown-800 mb-2">
                                        {plan.name}
                                    </h3>
                                    <div className="flex items-baseline justify-center gap-1 mb-2">
                                        <span className="text-4xl font-bold text-brown-800">{plan.price}</span>
                                        <span className="text-brown-500">{plan.period}</span>
                                    </div>
                                    <p className="text-brown-600 text-sm">{plan.description}</p>
                                </div>

                                {/* Features */}
                                <ul className="space-y-3 mb-8">
                                    {plan.features.map((feature) => (
                                        <li key={feature} className="flex items-center gap-3 text-brown-700">
                                            <div className={`w-5 h-5 rounded-full flex items-center justify-center ${
                                                plan.popular ? 'bg-primary-100 text-primary-600' : 'bg-cream-200 text-brown-600'
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
                                    className={`w-full rounded-full ${
                                        plan.popular
                                            ? 'bg-primary-500 hover:bg-primary-600 text-white shadow-soft'
                                            : 'bg-cream-100 hover:bg-cream-200 text-brown-800 border border-cream-300'
                                    }`}
                                    size="lg"
                                >
                                    {plan.cta}
                                </Button>
                            </div>
                        ))}
                    </div>
                </div>
            </div>
        </section>
    );
}
