import { useState, useEffect } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { Menu, X } from 'lucide-react';
import { Button } from '../ui/button';
import { useAuth } from '../../contexts/AuthContext';

export function Header() {
    const navigate = useNavigate();
    const { isAuthenticated } = useAuth();
    const [isScrolled, setIsScrolled] = useState(false);
    const [isMobileMenuOpen, setIsMobileMenuOpen] = useState(false);

    useEffect(() => {
        const handleScroll = () => {
            setIsScrolled(window.scrollY > 10);
        };
        window.addEventListener('scroll', handleScroll);
        return () => window.removeEventListener('scroll', handleScroll);
    }, []);

    const navLinks = [
        { label: 'Features', href: '#features' },
        { label: 'How It Works', href: '#how-it-works' },
        { label: 'Use Cases', href: '#use-cases' },
    ];

    return (
        <header
            className={`fixed top-0 left-0 right-0 z-50 transition-all duration-300 ${
                isScrolled
                    ? 'bg-white/95 backdrop-blur-md shadow-sm'
                    : 'bg-transparent'
            }`}
        >
            <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
                <div className="flex items-center justify-between h-16 lg:h-20">
                    {/* Logo - CanvasBoard with CB badge */}
                    <Link to="/" className="flex items-center gap-2">
                        <div className="w-8 h-8 rounded-lg bg-gray-900 flex items-center justify-center">
                            <span className="text-white text-xs font-bold">CB</span>
                        </div>
                        <span className="text-xl font-bold text-gray-900">
                            Canvas<span className="font-normal">Board</span>
                        </span>
                    </Link>

                    {/* Desktop Navigation */}
                    <nav className="hidden lg:flex items-center gap-8">
                        {navLinks.map((link) => (
                            <a
                                key={link.label}
                                href={link.href}
                                className="text-gray-600 hover:text-gray-900 transition-colors font-medium text-sm"
                            >
                                {link.label}
                            </a>
                        ))}
                    </nav>

                    {/* Desktop Auth Button */}
                    <div className="hidden lg:flex items-center">
                        <Button
                            onClick={() => navigate(isAuthenticated ? '/dashboard' : '/login')}
                            className="bg-gray-900 hover:bg-gray-800 text-white rounded-full px-6"
                        >
                            Dashboard
                        </Button>
                    </div>

                    {/* Mobile Menu Button */}
                    <button
                        onClick={() => setIsMobileMenuOpen(!isMobileMenuOpen)}
                        className="lg:hidden p-2 rounded-lg hover:bg-gray-100 transition-colors"
                    >
                        {isMobileMenuOpen ? (
                            <X className="w-6 h-6 text-gray-900" />
                        ) : (
                            <Menu className="w-6 h-6 text-gray-900" />
                        )}
                    </button>
                </div>
            </div>

            {/* Mobile Menu */}
            {isMobileMenuOpen && (
                <div className="lg:hidden bg-white border-t border-gray-100">
                    <div className="px-4 py-6 space-y-4">
                        {navLinks.map((link) => (
                            <a
                                key={link.label}
                                href={link.href}
                                onClick={() => setIsMobileMenuOpen(false)}
                                className="block text-gray-700 hover:text-gray-900 font-medium py-2"
                            >
                                {link.label}
                            </a>
                        ))}
                        <div className="pt-4 border-t border-gray-100">
                            <Button
                                onClick={() => navigate(isAuthenticated ? '/dashboard' : '/login')}
                                className="w-full bg-gray-900 hover:bg-gray-800 text-white rounded-full"
                            >
                                Dashboard
                            </Button>
                        </div>
                    </div>
                </div>
            )}
        </header>
    );
}
