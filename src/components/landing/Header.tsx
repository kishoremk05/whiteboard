import { useState, useEffect } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { Menu, X } from 'lucide-react';
import { Button } from '../ui/button';
import { useAuth } from '../../contexts/AuthContext';
import { cn } from '../../lib/utils';

const navLinks = [
    { label: 'Features', href: '#features' },
    { label: 'How It Works', href: '#how-it-works' },
    { label: 'Use Cases', href: '#use-cases' },
];

export function Header() {
    const navigate = useNavigate();
    const { isAuthenticated } = useAuth();
    const [isScrolled, setIsScrolled] = useState(false);
    const [isMobileMenuOpen, setIsMobileMenuOpen] = useState(false);

    useEffect(() => {
        const handleScroll = () => {
            setIsScrolled(window.scrollY > 20);
        };

        window.addEventListener('scroll', handleScroll);
        return () => window.removeEventListener('scroll', handleScroll);
    }, []);

    const handleNavClick = (href: string) => {
        setIsMobileMenuOpen(false);
        if (href.startsWith('#')) {
            const element = document.querySelector(href);
            element?.scrollIntoView({ behavior: 'smooth' });
        }
    };

    return (
        <header
            className={cn(
                'fixed top-0 left-0 right-0 z-50 transition-all duration-300',
                isScrolled
                    ? 'bg-white/95 backdrop-blur-md shadow-sm border-b border-gray-200'
                    : 'bg-transparent'
            )}
        >
            <div className="max-w-6xl mx-auto px-4 sm:px-6 lg:px-8">
                <div className="flex items-center justify-between h-16">
                    {/* Logo */}
                    <Link to="/" className="flex items-center gap-2">
                        <div className="w-10 h-10 rounded-xl bg-gray-900 flex items-center justify-center">
                            <span className="text-white font-bold text-sm">CB</span>
                        </div>
                        <span className="text-lg font-bold text-gray-900">
                            Canvas<span className="text-gray-400">Board</span>
                        </span>
                    </Link>

                    {/* Desktop Navigation */}
                    <nav className="hidden md:flex items-center gap-8">
                        {navLinks.map((link) => (
                            <button
                                key={link.label}
                                onClick={() => handleNavClick(link.href)}
                                className="text-gray-700 hover:text-gray-900 text-sm font-medium transition-colors"
                            >
                                {link.label}
                            </button>
                        ))}
                    </nav>

                    {/* Desktop CTA */}
                    <div className="hidden md:flex items-center gap-3">
                        {isAuthenticated ? (
                            <Button onClick={() => navigate('/dashboard')} size="sm" className="bg-gray-900 hover:bg-gray-800 text-white rounded-full px-5">
                                Dashboard
                            </Button>
                        ) : (
                            <>
                                <Button
                                    variant="ghost"
                                    size="sm"
                                    onClick={() => navigate('/login')}
                                    className="text-gray-700 hover:text-gray-900 hover:bg-transparent"
                                >
                                    Sign in
                                </Button>
                                <Button
                                    size="sm"
                                    onClick={() => navigate('/signup')}
                                    className="bg-gray-900 hover:bg-gray-800 text-white rounded-full px-5"
                                >
                                    Sign up free
                                </Button>
                            </>
                        )}
                    </div>

                    {/* Mobile Menu Button */}
                    <button
                        onClick={() => setIsMobileMenuOpen(!isMobileMenuOpen)}
                        className="md:hidden p-2 text-gray-700"
                    >
                        {isMobileMenuOpen ? <X className="w-5 h-5" /> : <Menu className="w-5 h-5" />}
                    </button>
                </div>
            </div>

            {/* Mobile Menu */}
            {isMobileMenuOpen && (
                <div className="md:hidden bg-white border-t border-gray-200 px-4 py-4">
                    <nav className="space-y-3">
                        {navLinks.map((link) => (
                            <button
                                key={link.label}
                                onClick={() => handleNavClick(link.href)}
                                className="block w-full text-left text-gray-700 py-2 text-sm"
                            >
                                {link.label}
                            </button>
                        ))}
                    </nav>
                    <div className="mt-4 pt-4 border-t border-gray-200 space-y-2">
                        <Button
                            variant="outline"
                            onClick={() => navigate('/login')}
                            className="w-full border-gray-300 text-gray-700"
                            size="sm"
                        >
                            Sign in
                        </Button>
                        <Button
                            onClick={() => navigate('/signup')}
                            className="w-full bg-gray-900 hover:bg-gray-800 text-white rounded-full"
                            size="sm"
                        >
                            Sign up free
                        </Button>
                    </div>
                </div>
            )}
        </header>
    );
}
