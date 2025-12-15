import { useEffect, useRef, useState } from 'react';
import gsap from 'gsap';
import { ScrollTrigger } from 'gsap/ScrollTrigger';
import { GraduationCap, Briefcase, Palette, Users, Check } from 'lucide-react';

gsap.registerPlugin(ScrollTrigger);

const useCases = [
    {
        id: 'education',
        icon: GraduationCap,
        title: 'Education',
        description: 'Make learning visual and interactive with diagrams, equations, and annotations.',
        benefits: ['Interactive lessons', 'Student collaboration', 'Visual explanations'],
    },
    {
        id: 'business',
        icon: Briefcase,
        title: 'Business',
        description: 'Plan strategies, map processes, and run workshops with distributed teams.',
        benefits: ['Sprint planning', 'Process mapping', 'Remote workshops'],
    },
    {
        id: 'design',
        icon: Palette,
        title: 'Design',
        description: 'Brainstorm ideas, sketch wireframes, and create mood boards effortlessly.',
        benefits: ['Wireframing', 'Mood boards', 'Design critiques'],
    },
    {
        id: 'teams',
        icon: Users,
        title: 'Teams',
        description: 'Keep your distributed team aligned with real-time collaborative whiteboards.',
        benefits: ['Daily standups', 'Retrospectives', 'Brainstorming'],
    },
];

// Animated illustrations for each use case
function EducationIllustration() {
    const pathRef = useRef<SVGPathElement>(null);

    useEffect(() => {
        if (pathRef.current) {
            const length = pathRef.current.getTotalLength();
            gsap.set(pathRef.current, { strokeDasharray: length, strokeDashoffset: length });
            gsap.to(pathRef.current, { strokeDashoffset: 0, duration: 2, ease: 'power2.inOut', repeat: -1, repeatDelay: 1 });
        }
    }, []);

    return (
        <svg viewBox="0 0 200 160" className="w-full h-full">
            {/* Chalkboard */}
            <rect x="20" y="20" width="160" height="100" rx="4" fill="#1e293b" />
            <rect x="30" y="30" width="140" height="80" rx="2" fill="#334155" />

            {/* Math equation being drawn */}
            <path
                ref={pathRef}
                d="M50 70 L70 50 L90 70 M110 55 L110 75 M130 60 Q140 50 150 60 Q160 70 150 80"
                stroke="#fbbf24"
                strokeWidth="3"
                strokeLinecap="round"
                fill="none"
            />

            {/* Floating elements */}
            <circle cx="170" cy="35" r="8" fill="#6366f1" opacity="0.8">
                <animate attributeName="cy" values="35;30;35" dur="2s" repeatCount="indefinite" />
            </circle>
            <rect x="25" y="130" width="30" height="20" rx="2" fill="#22c55e" opacity="0.8">
                <animate attributeName="y" values="130;125;130" dur="2.5s" repeatCount="indefinite" />
            </rect>
        </svg>
    );
}

function BusinessIllustration() {
    return (
        <svg viewBox="0 0 200 160" className="w-full h-full">
            {/* Kanban board */}
            <rect x="20" y="20" width="50" height="120" rx="4" fill="#e0e7ff" />
            <rect x="75" y="20" width="50" height="120" rx="4" fill="#dbeafe" />
            <rect x="130" y="20" width="50" height="120" rx="4" fill="#dcfce7" />

            {/* Cards */}
            <rect x="28" y="35" width="34" height="25" rx="2" fill="white" stroke="#6366f1" strokeWidth="1">
                <animate attributeName="y" values="35;40;35" dur="3s" repeatCount="indefinite" />
            </rect>
            <rect x="28" y="68" width="34" height="20" rx="2" fill="white" stroke="#6366f1" strokeWidth="1" />

            <rect x="83" y="35" width="34" height="30" rx="2" fill="white" stroke="#3b82f6" strokeWidth="1">
                <animate attributeName="y" values="35;32;35" dur="2.5s" repeatCount="indefinite" />
            </rect>

            <rect x="138" y="35" width="34" height="22" rx="2" fill="white" stroke="#22c55e" strokeWidth="1">
                <animate attributeName="y" values="35;38;35" dur="2.8s" repeatCount="indefinite" />
            </rect>

            {/* Arrow moving */}
            <path d="M95 100 L105 100" stroke="#64748b" strokeWidth="2" strokeLinecap="round">
                <animate attributeName="d" values="M95 100 L105 100;M100 100 L110 100;M95 100 L105 100" dur="1.5s" repeatCount="indefinite" />
            </path>
        </svg>
    );
}

function DesignIllustration() {
    const lineRef = useRef<SVGPathElement>(null);

    useEffect(() => {
        if (lineRef.current) {
            const length = lineRef.current.getTotalLength();
            gsap.set(lineRef.current, { strokeDasharray: length, strokeDashoffset: length });
            gsap.to(lineRef.current, { strokeDashoffset: 0, duration: 1.5, ease: 'power2.out', repeat: -1, repeatDelay: 2 });
        }
    }, []);

    return (
        <svg viewBox="0 0 200 160" className="w-full h-full">
            {/* Artboard */}
            <rect x="30" y="20" width="140" height="100" rx="4" fill="white" stroke="#e2e8f0" strokeWidth="2" />

            {/* Drawing being created */}
            <path
                ref={lineRef}
                d="M50 80 Q80 40 110 70 Q140 100 170 60"
                stroke="#ec4899"
                strokeWidth="3"
                strokeLinecap="round"
                fill="none"
            />

            {/* Color palette */}
            <circle cx="50" cy="135" r="10" fill="#6366f1">
                <animate attributeName="r" values="10;12;10" dur="2s" repeatCount="indefinite" />
            </circle>
            <circle cx="80" cy="135" r="10" fill="#ec4899" />
            <circle cx="110" cy="135" r="10" fill="#f59e0b" />
            <circle cx="140" cy="135" r="10" fill="#22c55e" />

            {/* Floating shape */}
            <rect x="150" y="25" width="15" height="15" rx="2" fill="#fef3c7" stroke="#f59e0b" strokeWidth="1">
                <animateTransform attributeName="transform" type="rotate" values="0 157.5 32.5;10 157.5 32.5;0 157.5 32.5" dur="3s" repeatCount="indefinite" />
            </rect>
        </svg>
    );
}

function TeamsIllustration() {
    return (
        <svg viewBox="0 0 200 160" className="w-full h-full">
            {/* Central whiteboard */}
            <rect x="50" y="40" width="100" height="70" rx="4" fill="white" stroke="#e2e8f0" strokeWidth="2" />

            {/* Team members around */}
            <circle cx="35" cy="50" r="15" fill="#dbeafe" stroke="#3b82f6" strokeWidth="2">
                <animate attributeName="cx" values="35;38;35" dur="2s" repeatCount="indefinite" />
            </circle>
            <circle cx="165" cy="50" r="15" fill="#dcfce7" stroke="#22c55e" strokeWidth="2">
                <animate attributeName="cx" values="165;162;165" dur="2.2s" repeatCount="indefinite" />
            </circle>
            <circle cx="35" cy="110" r="15" fill="#fef3c7" stroke="#f59e0b" strokeWidth="2">
                <animate attributeName="cx" values="35;38;35" dur="2.4s" repeatCount="indefinite" />
            </circle>
            <circle cx="165" cy="110" r="15" fill="#e0e7ff" stroke="#6366f1" strokeWidth="2">
                <animate attributeName="cx" values="165;162;165" dur="2.6s" repeatCount="indefinite" />
            </circle>

            {/* Connection lines */}
            <line x1="50" y1="50" x2="50" y2="50" stroke="#3b82f6" strokeWidth="1.5" strokeDasharray="4">
                <animate attributeName="x1" values="50;45;50" dur="2s" repeatCount="indefinite" />
            </line>

            {/* Cursor on board */}
            <path d="M90 65 L90 80 L95 76 L98 83 L102 81 L99 74 L104 74 L90 65Z" fill="#6366f1">
                <animate attributeName="transform" values="translate(0,0);translate(10,5);translate(0,0)" dur="2s" repeatCount="indefinite" />
            </path>
        </svg>
    );
}

const illustrations: Record<string, React.FC> = {
    education: EducationIllustration,
    business: BusinessIllustration,
    design: DesignIllustration,
    teams: TeamsIllustration,
};

export function UseCases() {
    const sectionRef = useRef<HTMLElement>(null);
    const [activeTab, setActiveTab] = useState('education');
    const contentRef = useRef<HTMLDivElement>(null);

    const activeCase = useCases.find((uc) => uc.id === activeTab) || useCases[0];
    const IllustrationComponent = illustrations[activeTab];

    useEffect(() => {
        const ctx = gsap.context(() => {
            gsap.from('.usecase-header', {
                scrollTrigger: {
                    trigger: sectionRef.current,
                    start: 'top 80%',
                },
                opacity: 0,
                y: 30,
                duration: 0.6,
                ease: 'power3.out',
            });
        }, sectionRef);

        return () => ctx.revert();
    }, []);

    // Animate content when tab changes
    useEffect(() => {
        if (contentRef.current) {
            gsap.fromTo(contentRef.current,
                { opacity: 0, y: 20 },
                { opacity: 1, y: 0, duration: 0.4, ease: 'power2.out' }
            );
        }
    }, [activeTab]);

    return (
        <section ref={sectionRef} id="use-cases" className="py-24 bg-slate-50">
            <div className="max-w-6xl mx-auto px-4 sm:px-6 lg:px-8">
                {/* Header */}
                <div className="usecase-header text-center mb-12">
                    <h2 className="text-3xl sm:text-4xl font-bold text-slate-900 mb-4">
                        Built for every workflow
                    </h2>
                    <p className="text-lg text-slate-600">
                        From classrooms to boardrooms, CanvasAI adapts to how you work.
                    </p>
                </div>

                {/* Tabs */}
                <div className="flex flex-wrap justify-center gap-2 mb-12">
                    {useCases.map((uc) => (
                        <button
                            key={uc.id}
                            onClick={() => setActiveTab(uc.id)}
                            className={`flex items-center gap-2 px-5 py-2.5 rounded-full text-sm font-medium transition-all ${activeTab === uc.id
                                    ? 'bg-slate-900 text-white shadow-lg'
                                    : 'bg-white text-slate-600 hover:bg-slate-100 border border-slate-200'
                                }`}
                        >
                            <uc.icon className="w-4 h-4" />
                            {uc.title}
                        </button>
                    ))}
                </div>

                {/* Content */}
                <div ref={contentRef} className="grid md:grid-cols-2 gap-12 items-center">
                    {/* Text */}
                    <div>
                        <div className="inline-flex items-center justify-center w-12 h-12 rounded-xl bg-primary-100 text-primary-600 mb-6">
                            <activeCase.icon className="w-6 h-6" />
                        </div>
                        <h3 className="text-2xl font-bold text-slate-900 mb-4">
                            Perfect for {activeCase.title.toLowerCase()}
                        </h3>
                        <p className="text-slate-600 mb-6 leading-relaxed">
                            {activeCase.description}
                        </p>
                        <ul className="space-y-3">
                            {activeCase.benefits.map((benefit) => (
                                <li key={benefit} className="flex items-center gap-3 text-slate-700">
                                    <div className="w-5 h-5 rounded-full bg-green-100 flex items-center justify-center flex-shrink-0">
                                        <Check className="w-3 h-3 text-green-600" />
                                    </div>
                                    {benefit}
                                </li>
                            ))}
                        </ul>
                    </div>

                    {/* Animated Illustration */}
                    <div className="bg-gradient-to-br from-primary-500 to-primary-700 rounded-2xl p-8 shadow-xl">
                        <div className="bg-white/10 backdrop-blur-sm rounded-xl p-4 aspect-[5/4]">
                            <IllustrationComponent />
                        </div>
                    </div>
                </div>
            </div>
        </section>
    );
}
