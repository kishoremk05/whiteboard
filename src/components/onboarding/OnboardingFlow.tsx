import { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { Sparkles, ArrowRight, Check, Palette, Users, Zap } from 'lucide-react';
import { Button } from '../ui/button';
import { useAuth } from '../../contexts/AuthContext';
import { useBoards } from '../../contexts/BoardContext';
import { mockTemplates } from '../../data/mockData';
import { cn } from '../../lib/utils';

interface OnboardingFlowProps {
    onComplete: () => void;
}

type Step = 'welcome' | 'template' | 'features' | 'complete';

const features = [
    {
        icon: Palette,
        title: 'Infinite Canvas',
        description: 'Unlimited space to express your ideas',
    },
    {
        icon: Users,
        title: 'Real-time Collaboration',
        description: 'Work together with your team',
    },
    {
        icon: Zap,
        title: 'AI-Powered Tools',
        description: 'Smart assistance for faster workflow',
    },
];

export function OnboardingFlow({ onComplete }: OnboardingFlowProps) {
    const navigate = useNavigate();
    const { user } = useAuth();
    const { createBoard } = useBoards();
    const [step, setStep] = useState<Step>('welcome');
    const [selectedTemplate, setSelectedTemplate] = useState<string | null>(null);

    const handleCreateBoard = () => {
        const template = mockTemplates.find(t => t.id === selectedTemplate);
        const board = createBoard(template?.name || 'My First Board', selectedTemplate || undefined);
        onComplete();
        navigate(`/board/${board.id}`);
    };

    const handleSkip = () => {
        onComplete();
        navigate('/dashboard');
    };

    return (
        <div className="fixed inset-0 z-50 bg-gradient-to-br from-primary-50 via-white to-accent-50 flex items-center justify-center p-4">
            <div className="max-w-2xl w-full">
                {/* Progress */}
                <div className="flex justify-center mb-8">
                    {(['welcome', 'template', 'features', 'complete'] as Step[]).map((s, i) => (
                        <div key={s} className="flex items-center">
                            <div
                                className={cn(
                                    'w-3 h-3 rounded-full transition-colors',
                                    step === s
                                        ? 'bg-primary-500'
                                        : ['template', 'features', 'complete'].indexOf(step) > i
                                            ? 'bg-primary-300'
                                            : 'bg-slate-200'
                                )}
                            />
                            {i < 3 && (
                                <div
                                    className={cn(
                                        'w-12 h-0.5',
                                        ['template', 'features', 'complete'].indexOf(step) > i
                                            ? 'bg-primary-300'
                                            : 'bg-slate-200'
                                    )}
                                />
                            )}
                        </div>
                    ))}
                </div>

                {/* Welcome Step */}
                {step === 'welcome' && (
                    <div className="text-center animate-fade-in">
                        <div className="w-20 h-20 rounded-2xl bg-gradient-to-br from-primary-500 to-accent-500 flex items-center justify-center mx-auto mb-6 shadow-lg">
                            <Sparkles className="w-10 h-10 text-white" />
                        </div>
                        <h1 className="text-3xl lg:text-4xl font-bold text-slate-900 mb-4">
                            Welcome to CanvasAI, {user?.name?.split(' ')[0]}! 👋
                        </h1>
                        <p className="text-lg text-slate-600 max-w-md mx-auto mb-8">
                            Let's get you started with your first board. It only takes a minute.
                        </p>
                        <div className="flex justify-center gap-4">
                            <Button variant="ghost" onClick={handleSkip}>
                                Skip for now
                            </Button>
                            <Button variant="gradient" onClick={() => setStep('template')} className="gap-2">
                                Get Started
                                <ArrowRight className="w-4 h-4" />
                            </Button>
                        </div>
                    </div>
                )}

                {/* Template Step */}
                {step === 'template' && (
                    <div className="animate-fade-in">
                        <div className="text-center mb-8">
                            <h2 className="text-2xl lg:text-3xl font-bold text-slate-900 mb-2">
                                Choose a template
                            </h2>
                            <p className="text-slate-600">
                                Pick a starting point or start with a blank canvas
                            </p>
                        </div>
                        <div className="grid grid-cols-2 md:grid-cols-4 gap-4 mb-8">
                            {mockTemplates.slice(0, 4).map((template) => (
                                <button
                                    key={template.id}
                                    onClick={() => setSelectedTemplate(template.id)}
                                    className={cn(
                                        'p-4 rounded-xl border-2 text-left transition-all hover:shadow-md',
                                        selectedTemplate === template.id
                                            ? 'border-primary-500 bg-primary-50'
                                            : 'border-slate-200 hover:border-slate-300'
                                    )}
                                >
                                    <div className="w-10 h-10 rounded-lg bg-slate-100 flex items-center justify-center mb-3">
                                        <Sparkles className="w-5 h-5 text-slate-500" />
                                    </div>
                                    <p className="font-medium text-slate-900 text-sm">{template.name}</p>
                                </button>
                            ))}
                        </div>
                        <div className="flex justify-between">
                            <Button variant="ghost" onClick={() => setStep('welcome')}>
                                Back
                            </Button>
                            <Button
                                variant="gradient"
                                onClick={() => setStep('features')}
                                className="gap-2"
                            >
                                Continue
                                <ArrowRight className="w-4 h-4" />
                            </Button>
                        </div>
                    </div>
                )}

                {/* Features Step */}
                {step === 'features' && (
                    <div className="animate-fade-in">
                        <div className="text-center mb-8">
                            <h2 className="text-2xl lg:text-3xl font-bold text-slate-900 mb-2">
                                Powerful features at your fingertips
                            </h2>
                            <p className="text-slate-600">
                                Everything you need to bring ideas to life
                            </p>
                        </div>
                        <div className="grid md:grid-cols-3 gap-4 mb-8">
                            {features.map((feature) => (
                                <div
                                    key={feature.title}
                                    className="p-6 rounded-xl bg-white border border-slate-200 text-center"
                                >
                                    <div className="w-12 h-12 rounded-xl bg-primary-100 flex items-center justify-center mx-auto mb-4">
                                        <feature.icon className="w-6 h-6 text-primary-600" />
                                    </div>
                                    <h3 className="font-semibold text-slate-900 mb-1">{feature.title}</h3>
                                    <p className="text-sm text-slate-500">{feature.description}</p>
                                </div>
                            ))}
                        </div>
                        <div className="flex justify-between">
                            <Button variant="ghost" onClick={() => setStep('template')}>
                                Back
                            </Button>
                            <Button
                                variant="gradient"
                                onClick={() => setStep('complete')}
                                className="gap-2"
                            >
                                Continue
                                <ArrowRight className="w-4 h-4" />
                            </Button>
                        </div>
                    </div>
                )}

                {/* Complete Step */}
                {step === 'complete' && (
                    <div className="text-center animate-fade-in">
                        <div className="w-20 h-20 rounded-full bg-green-100 flex items-center justify-center mx-auto mb-6">
                            <Check className="w-10 h-10 text-green-600" />
                        </div>
                        <h2 className="text-2xl lg:text-3xl font-bold text-slate-900 mb-4">
                            You're all set! 🎉
                        </h2>
                        <p className="text-lg text-slate-600 max-w-md mx-auto mb-8">
                            Your workspace is ready. Let's create your first board!
                        </p>
                        <Button variant="gradient" size="lg" onClick={handleCreateBoard} className="gap-2">
                            Create My First Board
                            <ArrowRight className="w-5 h-5" />
                        </Button>
                    </div>
                )}
            </div>
        </div>
    );
}
