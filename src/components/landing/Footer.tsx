import { Link } from 'react-router-dom';
import { Sparkles, Twitter, Github, Linkedin } from 'lucide-react';

const links = {
    product: [
        { label: 'Features', href: '#features' },
        { label: 'Use Cases', href: '#use-cases' },
        { label: 'Templates', href: '/templates' },
    ],
    company: [
        { label: 'About', href: '/about' },
        { label: 'Blog', href: '/blog' },
        { label: 'Contact', href: '/contact' },
    ],
    legal: [
        { label: 'Privacy', href: '/privacy' },
        { label: 'Terms', href: '/terms' },
    ],
};

export function Footer() {
    return (
        <footer className="bg-white border-t border-slate-200 py-16">
            <div className="max-w-6xl mx-auto px-4 sm:px-6 lg:px-8">
                <div className="grid grid-cols-2 md:grid-cols-4 gap-8 mb-12">
                    {/* Brand */}
                    <div className="col-span-2 md:col-span-1">
                        <Link to="/" className="flex items-center gap-2 mb-4">
                            <div className="w-8 h-8 rounded-lg bg-primary-600 flex items-center justify-center">
                                <Sparkles className="w-4 h-4 text-white" />
                            </div>
                            <span className="text-lg font-bold text-slate-900">
                                Canvas<span className="text-primary-600">AI</span>
                            </span>
                        </Link>
                        <p className="text-sm text-slate-500 mb-4">
                            The collaborative whiteboard for modern teams.
                        </p>
                        <div className="flex gap-3">
                            <a href="#" className="w-8 h-8 rounded-lg bg-slate-100 hover:bg-slate-200 flex items-center justify-center text-slate-600 transition-colors">
                                <Twitter className="w-4 h-4" />
                            </a>
                            <a href="#" className="w-8 h-8 rounded-lg bg-slate-100 hover:bg-slate-200 flex items-center justify-center text-slate-600 transition-colors">
                                <Github className="w-4 h-4" />
                            </a>
                            <a href="#" className="w-8 h-8 rounded-lg bg-slate-100 hover:bg-slate-200 flex items-center justify-center text-slate-600 transition-colors">
                                <Linkedin className="w-4 h-4" />
                            </a>
                        </div>
                    </div>

                    {/* Product */}
                    <div>
                        <h4 className="font-semibold text-slate-900 mb-4">Product</h4>
                        <ul className="space-y-2">
                            {links.product.map((link) => (
                                <li key={link.label}>
                                    <Link to={link.href} className="text-sm text-slate-600 hover:text-slate-900 transition-colors">
                                        {link.label}
                                    </Link>
                                </li>
                            ))}
                        </ul>
                    </div>

                    {/* Company */}
                    <div>
                        <h4 className="font-semibold text-slate-900 mb-4">Company</h4>
                        <ul className="space-y-2">
                            {links.company.map((link) => (
                                <li key={link.label}>
                                    <Link to={link.href} className="text-sm text-slate-600 hover:text-slate-900 transition-colors">
                                        {link.label}
                                    </Link>
                                </li>
                            ))}
                        </ul>
                    </div>

                    {/* Legal */}
                    <div>
                        <h4 className="font-semibold text-slate-900 mb-4">Legal</h4>
                        <ul className="space-y-2">
                            {links.legal.map((link) => (
                                <li key={link.label}>
                                    <Link to={link.href} className="text-sm text-slate-600 hover:text-slate-900 transition-colors">
                                        {link.label}
                                    </Link>
                                </li>
                            ))}
                        </ul>
                    </div>
                </div>

                {/* Bottom */}
                <div className="pt-8 border-t border-slate-200 flex flex-col sm:flex-row items-center justify-between gap-4">
                    <p className="text-sm text-slate-500">
                        © {new Date().getFullYear()} CanvasAI. All rights reserved.
                    </p>
                    <div className="flex items-center gap-2 text-sm text-slate-500">
                        <span className="w-2 h-2 rounded-full bg-green-500" />
                        All systems operational
                    </div>
                </div>
            </div>
        </footer>
    );
}
