import { useState } from 'react';
import { Link } from 'react-router-dom';
import { ArrowLeft, Mail, Check } from 'lucide-react';
import { AuthLayout } from '../components/auth/AuthLayout';
import { Button } from '../components/ui/button';
import { Input } from '../components/ui/input';
import { Label } from '../components/ui/label';
import { useAuth } from '../contexts/AuthContext';
import { toast } from 'sonner';

export function ForgotPassword() {
    const { resetPassword } = useAuth();
    const [email, setEmail] = useState('');
    const [isLoading, setIsLoading] = useState(false);
    const [isSubmitted, setIsSubmitted] = useState(false);

    const handleSubmit = async (e: React.FormEvent) => {
        e.preventDefault();

        if (!email) {
            toast.error('Please enter your email');
            return;
        }

        setIsLoading(true);
        try {
            await resetPassword(email);
            setIsSubmitted(true);
        } catch {
            toast.error('Something went wrong. Please try again.');
        } finally {
            setIsLoading(false);
        }
    };

    if (isSubmitted) {
        return (
            <AuthLayout
                title="Check your email"
                subtitle="We've sent you password reset instructions"
            >
                <div className="text-center">
                    <div className="w-16 h-16 rounded-full bg-green-100 flex items-center justify-center mx-auto mb-6">
                        <Check className="w-8 h-8 text-green-600" />
                    </div>
                    <p className="text-slate-600 mb-8">
                        We've sent a password reset link to <strong>{email}</strong>.
                        Please check your inbox.
                    </p>
                    <Link to="/login">
                        <Button variant="outline" className="w-full border-slate-300">
                            <ArrowLeft className="w-4 h-4 mr-2" />
                            Back to Sign In
                        </Button>
                    </Link>
                </div>
            </AuthLayout>
        );
    }

    return (
        <AuthLayout
            title="Reset your password"
            subtitle="Enter your email and we'll send you a reset link"
        >
            <form onSubmit={handleSubmit} className="space-y-5">
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

                <Button
                    type="submit"
                    disabled={isLoading}
                    className="w-full h-12 bg-primary-600 hover:bg-primary-700 text-white"
                >
                    {isLoading ? (
                        <div className="w-5 h-5 border-2 border-white border-t-transparent rounded-full animate-spin" />
                    ) : (
                        <>
                            <Mail className="w-5 h-5 mr-2" />
                            Send Reset Link
                        </>
                    )}
                </Button>

                <p className="text-center">
                    <Link
                        to="/login"
                        className="text-sm text-slate-600 hover:text-slate-900 inline-flex items-center gap-1"
                    >
                        <ArrowLeft className="w-4 h-4" />
                        Back to Sign In
                    </Link>
                </p>
            </form>
        </AuthLayout>
    );
}
