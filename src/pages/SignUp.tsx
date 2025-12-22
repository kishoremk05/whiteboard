import { useState } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { Eye, EyeOff, ArrowRight, Check } from 'lucide-react';
import { AuthLayout } from '../components/auth/AuthLayout';
import { Button } from '../components/ui/button';
import { Input } from '../components/ui/input';
import { Label } from '../components/ui/label';
import { useAuth } from '../contexts/AuthContext';
import { toast } from 'sonner';
import { cn } from '../lib/utils';

export function SignUp() {
    const navigate = useNavigate();
    const { signup } = useAuth();
    const [name, setName] = useState('');
    const [email, setEmail] = useState('');
    const [password, setPassword] = useState('');
    const [showPassword, setShowPassword] = useState(false);
    const [isLoading, setIsLoading] = useState(false);

    const passwordStrength = () => {
        let score = 0;
        if (password.length >= 8) score++;
        if (/[A-Z]/.test(password)) score++;
        if (/[0-9]/.test(password)) score++;
        if (/[^A-Za-z0-9]/.test(password)) score++;
        return score;
    };

    const strength = passwordStrength();

    const handleSubmit = async (e: React.FormEvent) => {
        e.preventDefault();

        if (!name || !email || !password) {
            toast.error('Please fill in all fields');
            return;
        }

        if (strength < 2) {
            toast.error('Please choose a stronger password');
            return;
        }

        setIsLoading(true);
        try {
            await signup(email, password, name);
            toast.success('Account created successfully!');
            navigate('/dashboard');
        } catch {
            toast.error('Something went wrong. Please try again.');
        } finally {
            setIsLoading(false);
        }
    };

    return (
        <AuthLayout
            title="Create your account"
            subtitle="Start your free trial today"
        >
            <form onSubmit={handleSubmit} className="space-y-5">
                <div className="space-y-2">
                    <Label htmlFor="name">Full name</Label>
                    <Input
                        id="name"
                        type="text"
                        placeholder="John Doe"
                        value={name}
                        onChange={(e) => setName(e.target.value)}
                        className="h-12"
                    />
                </div>

                <div className="space-y-2">
                    <Label htmlFor="email">Email</Label>
                    <Input
                        id="email"
                        type="email"
                        placeholder="you@example.com"
                        value={email}
                        onChange={(e) => setEmail(e.target.value)}
                        className="h-12"
                    />
                </div>

                <div className="space-y-2">
                    <Label htmlFor="password">Password</Label>
                    <div className="relative">
                        <Input
                            id="password"
                            type={showPassword ? 'text' : 'password'}
                            placeholder="Create a password"
                            value={password}
                            onChange={(e) => setPassword(e.target.value)}
                            className="h-12 pr-12"
                        />
                        <button
                            type="button"
                            onClick={() => setShowPassword(!showPassword)}
                            className="absolute right-4 top-1/2 -translate-y-1/2 text-slate-400 hover:text-slate-600"
                        >
                            {showPassword ? (
                                <EyeOff className="w-5 h-5" />
                            ) : (
                                <Eye className="w-5 h-5" />
                            )}
                        </button>
                    </div>

                    {/* Password Strength */}
                    {password && (
                        <div className="space-y-2 pt-2">
                            <div className="flex gap-1">
                                {[1, 2, 3, 4].map((level) => (
                                    <div
                                        key={level}
                                        className={cn(
                                            'h-1 flex-1 rounded-full transition-colors',
                                            strength >= level
                                                ? strength <= 1
                                                    ? 'bg-red-500'
                                                    : strength === 2
                                                        ? 'bg-amber-500'
                                                        : 'bg-green-500'
                                                : 'bg-slate-200'
                                        )}
                                    />
                                ))}
                            </div>
                            <p className="text-xs text-slate-500">
                                {strength <= 1 && 'Weak password'}
                                {strength === 2 && 'Fair password'}
                                {strength === 3 && 'Good password'}
                                {strength >= 4 && 'Strong password'}
                            </p>
                        </div>
                    )}
                </div>

                <Button
                    type="submit"
                    disabled={isLoading}
                    className="w-full h-12 bg-gray-900 hover:bg-gray-800 text-white"
                >
                    {isLoading ? (
                        <div className="w-5 h-5 border-2 border-white border-t-transparent rounded-full animate-spin" />
                    ) : (
                        <>
                            Create Account
                            <ArrowRight className="w-5 h-5 ml-2" />
                        </>
                    )}
                </Button>

                {/* Benefits */}
                <div className="pt-4 space-y-2">
                    {['Unlimited free boards', 'No credit card required', 'Cancel anytime'].map((item) => (
                        <div key={item} className="flex items-center gap-2 text-sm text-slate-600">
                            <Check className="w-4 h-4 text-green-500" />
                            {item}
                        </div>
                    ))}
                </div>

                <p className="text-center text-slate-600 text-sm pt-4">
                    Already have an account?{' '}
                    <Link to="/login" className="text-gray-900 hover:text-gray-700 font-medium">
                        Sign in
                    </Link>
                </p>
            </form>
        </AuthLayout>
    );
}
