import { useEffect, useRef, useState } from 'react';
import gsap from 'gsap';
import { ScrollTrigger } from 'gsap/ScrollTrigger';
import { GraduationCap, Briefcase, Palette, Users, Check } from 'lucide-react';

gsap.registerPlugin(ScrollTrigger);

const tabs = [
    {
        id: 'education',
        label: 'Education',
        icon: GraduationCap,
        color: 'bg-blue-500',
    },
    {
        id: 'business',
        label: 'Business',
        icon: Briefcase,
        color: 'bg-green-500',
    },
    {
        id: 'design',
        label: 'Design',
        icon: Palette,
        color: 'bg-purple-500',
    },
    {
        id: 'remote',
        label: 'Remote Teams',
        icon: Users,
        color: 'bg-orange-500',
    },
];

const useCaseContent = {
    education: {
        title: 'Transform Learning Experiences',
        icon: GraduationCap,
        color: 'bg-blue-500',
        lightColor: 'bg-blue-50',
        description: 'Create interactive lessons with diagrams, mind maps, and collaborative exercises. Students can participate in real-time, making learning engaging and visual.',
        features: [
            'Interactive lesson boards with real-time participation',
            'Visual note-taking and mind mapping tools',
            'Student collaboration zones for group projects',
            'Assessment templates and progress tracking',
        ],
        stats: { users: '50K+', rating: '4.9/5' },
    },
    business: {
        title: 'Accelerate Business Strategy',
        icon: Briefcase,
        color: 'bg-green-500',
        lightColor: 'bg-green-50',
        description: 'Map out business strategies, create roadmaps, and align your team on goals. Perfect for planning sessions, retrospectives, and stakeholder presentations.',
        features: [
            'Strategy mapping and business canvas templates',
            'OKR tracking and goal alignment boards',
            'Stakeholder presentation mode',
            'Team retrospective and planning frameworks',
        ],
        stats: { users: '30K+', rating: '4.8/5' },
    },
    design: {
        title: 'Unleash Creative Potential',
        icon: Palette,
        color: 'bg-purple-500',
        lightColor: 'bg-purple-50',
        description: 'Brainstorm creative ideas, create mood boards, and iterate on designs collaboratively. From wireframes to user journeys, visualize every step.',
        features: [
            'Mood board and inspiration collection',
            'Wireframing and prototyping tools',
            'User journey and flow mapping',
            'Design critique and feedback sessions',
        ],
        stats: { users: '40K+', rating: '4.9/5' },
    },
    remote: {
        title: 'Bridge Remote Teams',
        icon: Users,
        color: 'bg-orange-500',
        lightColor: 'bg-orange-50',
        description: 'Bridge the distance with real-time collaboration. Run effective remote meetings, workshops, and brainstorms as if everyone was in the same room.',
        features: [
            'Virtual meeting spaces with video integration',
            'Async collaboration with comments and mentions',
            'Team building activities and icebreakers',
            'Cross-timezone workflow management',
        ],
        stats: { users: '60K+', rating: '4.9/5' },
    },
};

export function UseCases() {
    const sectionRef = useRef<HTMLElement>(null);
    const contentRef = useRef<HTMLDivElement>(null);
    const [activeTab, setActiveTab] = useState('education');

    useEffect(() => {
        const ctx = gsap.context(() => {
            gsap.from('.usecases-header', {
                scrollTrigger: {
                    trigger: sectionRef.current,
                    start: 'top 80%',
                },
                y: 30,
                opacity: 0,
                duration: 0.8,
                ease: 'power2.out',
            });
        }, sectionRef);

        return () => ctx.revert();
    }, []);

    useEffect(() => {
        if (contentRef.current) {
            gsap.fromTo(contentRef.current, 
                { opacity: 0, y: 20 },
                { opacity: 1, y: 0, duration: 0.4, ease: 'power2.out' }
            );
        }
    }, [activeTab]);

    const content = useCaseContent[activeTab as keyof typeof useCaseContent];

    return (
        <section ref={sectionRef} id="use-cases" className="py-24 lg:py-32 bg-white relative overflow-hidden">
            {/* Decorative elements */}
            <div className="absolute top-20 left-10 w-24 h-24 border-2 border-dashed border-gray-200 rounded-full opacity-40" />
            <div className="absolute bottom-20 right-10 w-32 h-32 border-2 border-dashed border-gray-200 rounded-full opacity-40" />
            <div className="absolute top-32 right-20 text-5xl text-yellow-300 opacity-50">✦</div>
            <div className="absolute bottom-40 left-20 text-3xl text-pink-300 opacity-50">✦</div>

            <div className="max-w-6xl mx-auto px-4 sm:px-6 lg:px-8 relative z-10">
                {/* Section Header */}
                <div className="usecases-header text-center mb-16">
                    <div className="inline-flex items-center gap-2 bg-gray-100 text-gray-700 px-4 py-2 rounded-full text-sm font-medium mb-6">
                        <span className="text-lg">🎯</span>
                        For every team
                    </div>
                    <h2 className="text-4xl sm:text-5xl lg:text-6xl font-black text-gray-900 mb-6">
                        Built for{' '}
                        <span className="relative inline-block">
                            your workflow
                            <svg className="absolute -bottom-2 left-0 w-full" viewBox="0 0 240 12" fill="none">
                                <path d="M2 8 Q 60 2, 120 8 Q 180 14, 238 6" stroke="#EC4899" strokeWidth="4" strokeLinecap="round" fill="none" />
                            </svg>
                        </span>
                    </h2>
                    <p className="text-lg text-gray-500 max-w-2xl mx-auto">
                        From classrooms to boardrooms, CanvasBoard adapts to how your team works.
                    </p>
                </div>

                {/* Tabs */}
                <div className="flex flex-wrap justify-center gap-3 mb-12">
                    {tabs.map((tab) => (
                        <button
                            key={tab.id}
                            onClick={() => setActiveTab(tab.id)}
                            className={`flex items-center gap-2 px-5 py-3 rounded-full text-sm font-semibold transition-all duration-300 ${
                                activeTab === tab.id
                                    ? `${tab.color} text-white shadow-lg scale-105`
                                    : 'bg-gray-100 text-gray-600 hover:bg-gray-200'
                            }`}
                        >
                            <tab.icon className="w-4 h-4" />
                            {tab.label}
                        </button>
                    ))}
                </div>

                {/* Content Card */}
                <div 
                    ref={contentRef}
                    className={`${content.lightColor} rounded-3xl p-8 lg:p-12 border-2 border-gray-100 shadow-xl`}
                >
                    <div className="grid lg:grid-cols-2 gap-8 lg:gap-12 items-center">
                        {/* Left - Content */}
                        <div>
                            <div className={`inline-flex items-center gap-3 ${content.color} text-white px-4 py-2 rounded-full text-sm font-medium mb-6`}>
                                <content.icon className="w-4 h-4" />
                                {tabs.find(t => t.id === activeTab)?.label}
                            </div>
                            
                            <h3 className="text-2xl lg:text-3xl font-bold text-gray-900 mb-4">
                                {content.title}
                            </h3>
                            
                            <p className="text-gray-600 mb-8 leading-relaxed">
                                {content.description}
                            </p>
                            
                            {/* Features list */}
                            <ul className="space-y-3">
                                {content.features.map((feature) => (
                                    <li key={feature} className="flex items-start gap-3">
                                        <div className={`w-5 h-5 ${content.color} rounded-full flex items-center justify-center flex-shrink-0 mt-0.5`}>
                                            <Check className="w-3 h-3 text-white" />
                                        </div>
                                        <span className="text-gray-700">{feature}</span>
                                    </li>
                                ))}
                            </ul>
                        </div>
                        
                        {/* Right - Visual/Stats */}
                        <div className="relative">
                            {/* Mock board preview */}
                            <div className="bg-white rounded-2xl shadow-2xl p-6 border border-gray-100">
                                <div className="flex items-center gap-3 mb-4">
                                    <div className="flex gap-1.5">
                                        <div className="w-3 h-3 rounded-full bg-red-400" />
                                        <div className="w-3 h-3 rounded-full bg-yellow-400" />
                                        <div className="w-3 h-3 rounded-full bg-green-400" />
                                    </div>
                                    <div className="flex-1 h-6 bg-gray-100 rounded-lg" />
                                </div>
                                
                                {/* Mock canvas */}
                                <div className="aspect-video bg-gray-50 rounded-xl relative overflow-hidden">
                                    {/* Decorative sticky notes */}
                                    <div className="absolute top-4 left-4 w-16 h-16 bg-yellow-200 rounded-lg transform -rotate-3 shadow-sm" />
                                    <div className="absolute top-8 right-8 w-20 h-14 bg-pink-200 rounded-lg transform rotate-2 shadow-sm" />
                                    <div className="absolute bottom-6 left-1/3 w-24 h-12 bg-blue-200 rounded-lg transform -rotate-1 shadow-sm" />
                                    <div className="absolute bottom-4 right-6 w-14 h-14 bg-green-200 rounded-lg transform rotate-3 shadow-sm" />
                                    
                                    {/* Center element */}
                                    <div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2">
                                        <div className={`w-12 h-12 ${content.color} rounded-xl flex items-center justify-center shadow-lg`}>
                                            <content.icon className="w-6 h-6 text-white" />
                                        </div>
                                    </div>
                                    
                                    {/* Connecting lines */}
                                    <svg className="absolute inset-0 w-full h-full pointer-events-none" viewBox="0 0 400 200">
                                        <path d="M80 60 L180 100" stroke="#9CA3AF" strokeWidth="1.5" strokeDasharray="4 4" />
                                        <path d="M220 100 L320 70" stroke="#9CA3AF" strokeWidth="1.5" strokeDasharray="4 4" />
                                        <path d="M200 100 L160 160" stroke="#9CA3AF" strokeWidth="1.5" strokeDasharray="4 4" />
                                    </svg>
                                </div>
                                
                                {/* Stats */}
                                <div className="flex justify-center gap-8 mt-6 pt-6 border-t border-gray-100">
                                    <div className="text-center">
                                        <div className="text-2xl font-bold text-gray-900">{content.stats.users}</div>
                                        <div className="text-sm text-gray-500">Active users</div>
                                    </div>
                                    <div className="text-center">
                                        <div className="text-2xl font-bold text-gray-900">{content.stats.rating}</div>
                                        <div className="text-sm text-gray-500">User rating</div>
                                    </div>
                                </div>
                            </div>
                            
                            {/* Floating avatars */}
                            <div className="absolute -top-4 -right-4 w-10 h-10 bg-purple-500 rounded-full flex items-center justify-center shadow-lg">
                                <span className="text-white text-xs font-bold">K</span>
                            </div>
                            <div className="absolute -bottom-4 -left-4 w-10 h-10 bg-blue-500 rounded-full flex items-center justify-center shadow-lg">
                                <span className="text-white text-xs font-bold">M</span>
                            </div>
                        </div>
                    </div>
                </div>
            </div>
        </section>
    );
}
