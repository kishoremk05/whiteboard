import { ReactNode } from 'react';
import { Link } from 'react-router-dom';
import { Sparkles } from 'lucide-react';

interface AuthLayoutProps {
    children: ReactNode;
    title: string;
    subtitle?: string;
}

export function AuthLayout({ children, title, subtitle }: AuthLayoutProps) {
    return (
        <div className="min-h-screen flex">
            {/* Left Side - Form */}
            <div className="flex-1 flex flex-col justify-center px-6 py-12 lg:px-12 bg-white">
                {/* Logo */}
                <div className="mb-10">
                    <Link to="/" className="inline-flex items-center gap-2">
                        <div className="w-10 h-10 rounded-xl bg-primary-600 flex items-center justify-center">
                            <Sparkles className="w-5 h-5 text-white" />
                        </div>
                        <span className="text-xl font-bold text-slate-900">
                            Canvas<span className="text-primary-600">AI</span>
                        </span>
                    </Link>
                </div>

                {/* Form Container */}
                <div className="w-full max-w-sm">
                    <h1 className="text-2xl font-bold text-slate-900 mb-2">{title}</h1>
                    {subtitle && (
                        <p className="text-slate-600 mb-8">{subtitle}</p>
                    )}
                    {children}
                </div>
            </div>

            {/* Right Side - Illustration */}
            <div className="hidden lg:flex lg:w-1/2 bg-primary-600 items-center justify-center p-12">
                <div className="max-w-lg">
                    {/* SVG Illustration */}
                    <svg
                        viewBox="0 0 400 300"
                        fill="none"
                        xmlns="http://www.w3.org/2000/svg"
                        className="w-full"
                    >
                        {/* Main Canvas */}
                        <rect
                            x="40"
                            y="30"
                            width="320"
                            height="220"
                            rx="12"
                            fill="white"
                            fillOpacity="0.1"
                            stroke="white"
                            strokeOpacity="0.3"
                            strokeWidth="2"
                        />

                        {/* Inner Canvas */}
                        <rect
                            x="60"
                            y="50"
                            width="280"
                            height="180"
                            rx="8"
                            fill="white"
                            fillOpacity="0.05"
                        />

                        {/* Drawing Elements */}
                        <path
                            d="M100 120 Q 150 80, 200 120 T 300 120"
                            stroke="white"
                            strokeWidth="3"
                            strokeLinecap="round"
                            fill="none"
                        />

                        <rect
                            x="80"
                            y="160"
                            width="60"
                            height="50"
                            rx="4"
                            fill="#fef3c7"
                            fillOpacity="0.8"
                        />

                        <rect
                            x="160"
                            y="140"
                            width="50"
                            height="50"
                            rx="4"
                            fill="#dbeafe"
                            fillOpacity="0.8"
                        />

                        <circle
                            cx="280"
                            cy="170"
                            r="30"
                            fill="#dcfce7"
                            fillOpacity="0.8"
                        />

                        {/* Cursor */}
                        <path
                            d="M220 100 L 220 120 L 228 115 L 233 125 L 238 123 L 233 113 L 241 113 Z"
                            fill="white"
                        />

                        {/* Decorative dots */}
                        <circle cx="80" cy="42" r="4" fill="#f87171" />
                        <circle cx="95" cy="42" r="4" fill="#fbbf24" />
                        <circle cx="110" cy="42" r="4" fill="#4ade80" />

                        {/* Sparkles */}
                        <path
                            d="M340 60 L 342 66 L 348 66 L 343 70 L 345 76 L 340 72 L 335 76 L 337 70 L 332 66 L 338 66 Z"
                            fill="white"
                            fillOpacity="0.7"
                        />
                        <path
                            d="M50 200 L 51 204 L 55 204 L 52 207 L 53 211 L 50 208 L 47 211 L 48 207 L 45 204 L 49 204 Z"
                            fill="white"
                            fillOpacity="0.7"
                        />
                    </svg>

                    {/* Text */}
                    <div className="text-center mt-10">
                        <h2 className="text-2xl font-bold text-white mb-3">
                            Bring your ideas to life
                        </h2>
                        <p className="text-primary-100">
                            Join thousands of teams using CanvasAI to create, collaborate, and innovate together.
                        </p>
                    </div>
                </div>
            </div>
        </div>
    );
}
