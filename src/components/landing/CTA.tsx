import { useNavigate } from 'react-router-dom';
import { ArrowRight } from 'lucide-react';
import { Button } from '../ui/button';

export function CTA() {
    const navigate = useNavigate();

    return (
        <section className="py-24 bg-gradient-to-br from-slate-900 via-slate-800 to-slate-900">
            <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8 text-center">
                <h2 className="text-3xl sm:text-4xl font-bold text-white mb-4">
                    Ready to get started?
                </h2>
                <p className="text-slate-400 text-lg mb-10 max-w-xl mx-auto">
                    Join teams who use CanvasAI to bring their ideas to life.
                    Start free, no credit card required.
                </p>
                <div className="flex flex-col sm:flex-row gap-4 justify-center">
                    <Button
                        size="lg"
                        onClick={() => navigate('/signup')}
                        className="bg-white text-slate-900 hover:bg-slate-100 px-8 group shadow-xl"
                    >
                        Get Started Free
                        <ArrowRight className="w-4 h-4 ml-2 group-hover:translate-x-1 transition-transform" />
                    </Button>
                    <Button
                        size="lg"
                        variant="outline"
                        onClick={() => navigate('/login')}
                        className="border-slate-600 text-white hover:bg-white/10 px-8"
                    >
                        Sign In
                    </Button>
                </div>
            </div>
        </section>
    );
}
