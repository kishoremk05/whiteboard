import { Link } from 'react-router-dom';
import { Twitter, Github, Linkedin, Mail } from 'lucide-react';

export function Footer() {
    return (
        <footer className="bg-gray-900 text-white border-t border-gray-800">
            <div className="max-w-6xl mx-auto px-4 sm:px-6 lg:px-8 py-6">
                <div className="flex flex-col sm:flex-row items-center justify-between gap-4">
                    {/* Brand & Copyright */}
                    <div className="flex items-center gap-4">
                        <Link to="/" className="flex items-center gap-2">
                            <div className="w-8 h-8 rounded-lg bg-white flex items-center justify-center">
                                <span className="text-gray-900 font-bold text-xs">CB</span>
                            </div>
                            <span className="text-sm font-semibold">
                                Canvas<span className="text-gray-400">Board</span>
                            </span>
                        </Link>
                        <span className="text-xs text-gray-500 hidden sm:inline">
                            © {new Date().getFullYear()}
                        </span>
                    </div>

                    {/* Links & Social */}
                    <div className="flex items-center gap-6">
                        {/* Legal Links */}
                        <div className="flex items-center gap-4 text-xs">
                            <Link to="/privacy" className="text-gray-500 hover:text-white transition-colors">
                                Privacy
                            </Link>
                            <Link to="/terms" className="text-gray-500 hover:text-white transition-colors">
                                Terms
                            </Link>
                        </div>

                        {/* Social Icons */}
                        <div className="flex gap-2">
                            <a
                                href="#"
                                className="w-8 h-8 rounded-lg bg-gray-800 hover:bg-gray-700 flex items-center justify-center text-gray-400 hover:text-white transition-colors"
                            >
                                <Twitter className="w-3.5 h-3.5" />
                            </a>
                            <a
                                href="#"
                                className="w-8 h-8 rounded-lg bg-gray-800 hover:bg-gray-700 flex items-center justify-center text-gray-400 hover:text-white transition-colors"
                            >
                                <Github className="w-3.5 h-3.5" />
                            </a>
                            <a
                                href="#"
                                className="w-8 h-8 rounded-lg bg-gray-800 hover:bg-gray-700 flex items-center justify-center text-gray-400 hover:text-white transition-colors"
                            >
                                <Linkedin className="w-3.5 h-3.5" />
                            </a>
                            <a
                                href="#"
                                className="w-8 h-8 rounded-lg bg-gray-800 hover:bg-gray-700 flex items-center justify-center text-gray-400 hover:text-white transition-colors"
                            >
                                <Mail className="w-3.5 h-3.5" />
                            </a>
                        </div>
                    </div>
                </div>
            </div>
        </footer>
    );
}
