import { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { Sparkles, ArrowRight, Check, Palette, Users, Zap, Target, Brain, Lock, Rocket, ChevronLeft, Play, MousePointerClick } from 'lucide-react';
import { Button } from '../ui/button';
import { useAuth } from '../../contexts/AuthContext';
import { useBoards } from '../../contexts/BoardContext';
import { templates } from '../../data/mockData';
import { cn } from '../../lib/utils';

interface OnboardingFlowProps {
    onComplete: () => void;
}

type Step = 'welcome' | 'template' | 'features' | 'complete';

const features = [
    {
        icon: Palette,
        title: 'Infinite Canvas',
        description: 'Unlimited space to express your ideas with a powerful drawing experience',
        color: 'from-purple-500 to-purple-600',
        bgColor: 'bg-purple-50',
        textColor: 'text-purple-600',
    },
    {
        icon: Users,
        title: 'Real-time Collaboration',
        description: 'Work together with your team simultaneously in shared workspaces',
        color: 'from-blue-500 to-blue-600',
        bgColor: 'bg-blue-50',
        textColor: 'text-blue-600',
    },
    {
        icon: Zap,
        title: 'AI-Powered Tools',
        description: 'Smart assistance that understands context and accelerates your workflow',
        color: 'from-amber-500 to-amber-600',
        bgColor: 'bg-amber-50',
        textColor: 'text-amber-600',
    },
    {
        icon: Lock,
        title: 'Enterprise Security',
        description: 'Bank-grade encryption and compliance for your sensitive data',
        color: 'from-emerald-500 to-emerald-600',
        bgColor: 'bg-emerald-50',
        textColor: 'text-emerald-600',
    },
];

const templateIcons: Record<string, React.ReactNode> = {
    'template-blank': <Target className="w-5 h-5" />,
    'template-brainstorm': <Brain className="w-5 h-5" />,
    'template-math': <span className="text-lg font-bold">∑</span>,
    'template-meeting': <Users className="w-5 h-5" />,
};

const templateColors: Record<string, string> = {
    'template-blank': 'from-slate-400 to-slate-600',
    'template-brainstorm': 'from-amber-400 to-amber-600',
    'template-math': 'from-blue-400 to-blue-600',
    'template-meeting': 'from-emerald-400 to-emerald-600',
};

export function OnboardingFlow({ onComplete }: OnboardingFlowProps) {
    const navigate = useNavigate();
    const { user } = useAuth();
    const { createBoard } = useBoards();
    const [step, setStep] = useState<Step>('welcome');
    const [selectedTemplate, setSelectedTemplate] = useState<string | null>(null);
    const [isTransitioning, setIsTransitioning] = useState(false);
    const [showConfetti, setShowConfetti] = useState(false);

    const handleStepChange = (newStep: Step) => {
        setIsTransitioning(true);
        setTimeout(() => {
            setStep(newStep);
            setIsTransitioning(false);
        }, 200);
    };

    const handleCreateBoard = async () => {
        const template = templates.find(t => t.id === selectedTemplate);
        const board = await createBoard(template?.name || 'My First Board', selectedTemplate || undefined);
        onComplete();
        navigate(`/board/${board.id}`);
    };

    const handleSkip = () => {
        onComplete();
        navigate('/dashboard');
    };

    // Show confetti on complete step
    useEffect(() => {
        if (step === 'complete') {
            setShowConfetti(true);
            setTimeout(() => setShowConfetti(false), 3000);
        }
    }, [step]);

    const steps: Step[] = ['welcome', 'template', 'features', 'complete'];
    const currentStepIndex = steps.indexOf(step);

    return (
        <div className="fixed inset-0 z-50 bg-gradient-to-br from-primary-50 via-white to-accent-50 flex items-center justify-center p-4 overflow-hidden">
            {/* Animated background elements */}
            <div className="absolute inset-0 overflow-hidden pointer-events-none">
                <div className="absolute top-1/4 left-1/4 w-96 h-96 bg-primary-200/30 rounded-full blur-3xl animate-pulse" />
                <div className="absolute bottom-1/4 right-1/4 w-80 h-80 bg-accent-200/30 rounded-full blur-3xl animate-pulse" style={{ animationDelay: '1s' }} />
                <div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-[600px] h-[600px] bg-gradient-to-br from-primary-100/20 to-accent-100/20 rounded-full blur-3xl" />
            </div>

            {/* Confetti effect */}
            {showConfetti && (
                <div className="absolute inset-0 pointer-events-none z-10">
                    {Array.from({ length: 50 }).map((_, i) => (
                        <div
                            key={i}
                            className="absolute w-3 h-3 rounded-sm animate-bounce"
                            style={{
                                left: `${Math.random() * 100}%`,
                                top: `-${Math.random() * 20}%`,
                                backgroundColor: ['#6366f1', '#8b5cf6', '#ec4899', '#f59e0b', '#10b981'][Math.floor(Math.random() * 5)],
                                animationDelay: `${Math.random() * 2}s`,
                                animationDuration: `${2 + Math.random() * 2}s`,
                            }}
                        />
                    ))}
                </div>
            )}

            <div className="relative max-w-3xl w-full">
                {/* Progress indicator */}
                <div className="flex justify-center items-center mb-10">
                    {steps.map((s, i) => (
                        <div key={s} className="flex items-center">
                            <div className="relative">
                                <div
                                    className={cn(
                                        'w-10 h-10 rounded-full flex items-center justify-center font-semibold text-sm transition-all duration-500',
                                        currentStepIndex > i
                                            ? 'bg-primary-500 text-white'
                                            : currentStepIndex === i
                                                ? 'bg-primary-500 text-white ring-4 ring-primary-200'
                                                : 'bg-white border-2 border-slate-200 text-slate-400'
                                    )}
                                >
                                    {currentStepIndex > i ? (
                                        <Check className="w-5 h-5" />
                                    ) : (
                                        i + 1
                                    )}
                                </div>
                                <span className={cn(
                                    'absolute -bottom-6 left-1/2 -translate-x-1/2 text-xs font-medium whitespace-nowrap transition-colors',
                                    currentStepIndex >= i ? 'text-slate-700' : 'text-slate-400'
                                )}>
                                    {s.charAt(0).toUpperCase() + s.slice(1)}
                                </span>
                            </div>
                            {i < 3 && (
                                <div
                                    className={cn(
                                        'w-16 lg:w-24 h-1 mx-1 rounded-full transition-all duration-500',
                                        currentStepIndex > i
                                            ? 'bg-primary-500'
                                            : 'bg-slate-200'
                                    )}
                                />
                            )}
                        </div>
                    ))}
                </div>

                {/* Content container with transition */}
                <div className={cn(
                    'transition-all duration-300',
                    isTransitioning ? 'opacity-0 scale-95' : 'opacity-100 scale-100'
                )}>
                    {/* Welcome Step */}
                    {step === 'welcome' && (
                        <div className="text-center">
                            <div className="relative w-24 h-24 rounded-3xl bg-gradient-to-br from-primary-500 to-accent-500 flex items-center justify-center mx-auto mb-8 shadow-2xl shadow-primary-500/30">
                                <Sparkles className="w-12 h-12 text-white" />
                                <div className="absolute -bottom-2 -right-2 w-8 h-8 rounded-xl bg-white shadow-lg flex items-center justify-center">
                                    <span className="text-xl">👋</span>
                                </div>
                            </div>
                            <h1 className="text-4xl lg:text-5xl font-bold text-slate-900 mb-4">
                                Welcome, {user?.name?.split(' ')[0] || 'Creator'}!
                            </h1>
                            <p className="text-xl text-slate-600 max-w-lg mx-auto mb-10">
                                You're about to unlock the most powerful way to visualize and share your ideas.
                            </p>
                            <div className="flex flex-col sm:flex-row justify-center gap-4">
                                <Button 
                                    variant="outline" 
                                    size="lg"
                                    onClick={handleSkip}
                                    className="text-slate-600"
                                >
                                    Skip intro
                                </Button>
                                <Button 
                                    variant="gradient" 
                                    size="lg"
                                    onClick={() => handleStepChange('template')} 
                                    className="gap-2 shadow-lg shadow-primary-500/30"
                                >
                                    Let's get started
                                    <ArrowRight className="w-5 h-5" />
                                </Button>
                            </div>
                            <p className="text-sm text-slate-400 mt-6">
                                <MousePointerClick className="w-4 h-4 inline-block mr-1" />
                                Takes about 60 seconds
                            </p>
                        </div>
                    )}

                    {/* Template Step */}
                    {step === 'template' && (
                        <div>
                            <div className="text-center mb-8">
                                <div className="inline-flex items-center gap-2 px-4 py-2 bg-primary-100 rounded-full text-primary-700 text-sm font-medium mb-4">
                                    <Target className="w-4 h-4" />
                                    Step 2 of 4
                                </div>
                                <h2 className="text-3xl lg:text-4xl font-bold text-slate-900 mb-3">
                                    Pick your starting point
                                </h2>
                                <p className="text-lg text-slate-600 max-w-md mx-auto">
                                    Choose a template to jumpstart your first project
                                </p>
                            </div>
                            <div className="grid grid-cols-2 md:grid-cols-4 gap-4 mb-10">
                                {templates.slice(0, 4).map((template, index) => (
                                    <button
                                        key={template.id}
                                        onClick={() => setSelectedTemplate(template.id)}
                                        className={cn(
                                            'group relative p-5 rounded-2xl border-2 text-left transition-all duration-300',
                                            'hover:shadow-xl hover:-translate-y-1',
                                            'animate-in fade-in-0 slide-in-from-bottom-4',
                                            selectedTemplate === template.id
                                                ? 'border-primary-500 bg-primary-50 shadow-lg'
                                                : 'border-slate-200 bg-white hover:border-slate-300'
                                        )}
                                        style={{ animationDelay: `${index * 100}ms`, animationFillMode: 'both' }}
                                    >
                                        <div className={cn(
                                            'w-12 h-12 rounded-xl bg-gradient-to-br flex items-center justify-center mb-4 text-white transition-transform duration-300 group-hover:scale-110',
                                            templateColors[template.id] || 'from-slate-400 to-slate-600'
                                        )}>
                                            {templateIcons[template.id] || <Sparkles className="w-5 h-5" />}
                                        </div>
                                        <p className="font-semibold text-slate-900 mb-1">{template.name}</p>
                                        <p className="text-xs text-slate-500 line-clamp-2">{template.description}</p>
                                        
                                        {selectedTemplate === template.id && (
                                            <div className="absolute top-3 right-3 w-6 h-6 rounded-full bg-primary-500 flex items-center justify-center">
                                                <Check className="w-4 h-4 text-white" />
                                            </div>
                                        )}
                                    </button>
                                ))}
                            </div>
                            <div className="flex justify-between items-center">
                                <Button 
                                    variant="ghost" 
                                    onClick={() => handleStepChange('welcome')}
                                    className="gap-2"
                                >
                                    <ChevronLeft className="w-4 h-4" />
                                    Back
                                </Button>
                                <div className="flex items-center gap-3">
                                    <button
                                        onClick={() => setSelectedTemplate(null)}
                                        className="text-sm text-slate-500 hover:text-slate-700"
                                    >
                                        Start blank
                                    </button>
                                    <Button
                                        variant="gradient"
                                        onClick={() => handleStepChange('features')}
                                        className="gap-2 shadow-lg shadow-primary-500/20"
                                    >
                                        Continue
                                        <ArrowRight className="w-4 h-4" />
                                    </Button>
                                </div>
                            </div>
                        </div>
                    )}

                    {/* Features Step */}
                    {step === 'features' && (
                        <div>
                            <div className="text-center mb-8">
                                <div className="inline-flex items-center gap-2 px-4 py-2 bg-primary-100 rounded-full text-primary-700 text-sm font-medium mb-4">
                                    <Zap className="w-4 h-4" />
                                    Step 3 of 4
                                </div>
                                <h2 className="text-3xl lg:text-4xl font-bold text-slate-900 mb-3">
                                    Built for creators like you
                                </h2>
                                <p className="text-lg text-slate-600">
                                    Powerful features to bring your ideas to life
                                </p>
                            </div>
                            <div className="grid md:grid-cols-2 gap-4 mb-10">
                                {features.map((feature, index) => (
                                    <div
                                        key={feature.title}
                                        className={cn(
                                            'group p-6 rounded-2xl bg-white border border-slate-200 transition-all duration-300',
                                            'hover:shadow-lg hover:border-slate-300 hover:-translate-y-0.5',
                                            'animate-in fade-in-0 slide-in-from-bottom-4'
                                        )}
                                        style={{ animationDelay: `${index * 100}ms`, animationFillMode: 'both' }}
                                    >
                                        <div className="flex items-start gap-4">
                                            <div className={cn(
                                                'w-14 h-14 rounded-xl bg-gradient-to-br flex items-center justify-center flex-shrink-0 text-white transition-transform duration-300 group-hover:scale-110',
                                                feature.color
                                            )}>
                                                <feature.icon className="w-7 h-7" />
                                            </div>
                                            <div>
                                                <h3 className="font-semibold text-lg text-slate-900 mb-1">
                                                    {feature.title}
                                                </h3>
                                                <p className="text-sm text-slate-600">
                                                    {feature.description}
                                                </p>
                                            </div>
                                        </div>
                                    </div>
                                ))}
                            </div>
                            <div className="flex justify-between">
                                <Button 
                                    variant="ghost" 
                                    onClick={() => handleStepChange('template')}
                                    className="gap-2"
                                >
                                    <ChevronLeft className="w-4 h-4" />
                                    Back
                                </Button>
                                <Button
                                    variant="gradient"
                                    onClick={() => handleStepChange('complete')}
                                    className="gap-2 shadow-lg shadow-primary-500/20"
                                >
                                    Almost done!
                                    <ArrowRight className="w-4 h-4" />
                                </Button>
                            </div>
                        </div>
                    )}

                    {/* Complete Step */}
                    {step === 'complete' && (
                        <div className="text-center">
                            <div className="relative w-28 h-28 rounded-full bg-gradient-to-br from-emerald-400 to-emerald-600 flex items-center justify-center mx-auto mb-8 shadow-2xl shadow-emerald-500/30">
                                <Check className="w-14 h-14 text-white" />
                                <div className="absolute -inset-2 rounded-full border-4 border-emerald-200 animate-ping opacity-20" />
                            </div>
                            <div className="inline-flex items-center gap-2 px-4 py-2 bg-emerald-100 rounded-full text-emerald-700 text-sm font-medium mb-4">
                                <Rocket className="w-4 h-4" />
                                You're all set!
                            </div>
                            <h2 className="text-4xl lg:text-5xl font-bold text-slate-900 mb-4">
                                Let's create magic! ✨
                            </h2>
                            <p className="text-xl text-slate-600 max-w-lg mx-auto mb-10">
                                Your workspace is ready. Time to bring your ideas to life.
                            </p>
                            <Button 
                                variant="gradient" 
                                size="lg" 
                                onClick={handleCreateBoard} 
                                className="gap-3 shadow-xl shadow-primary-500/30 px-8"
                            >
                                <Play className="w-5 h-5" />
                                Create My First Board
                            </Button>
                            <p className="text-sm text-slate-400 mt-6">
                                You can always change settings later
                            </p>
                        </div>
                    )}
                </div>
            </div>
        </div>
    );
}
