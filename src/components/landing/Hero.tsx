import { useEffect, useRef } from 'react';
import { useNavigate } from 'react-router-dom';
import gsap from 'gsap';
import { Lightbulb } from 'lucide-react';
import { Button } from '../ui/button';

// Floating user data with updated names
const floatingUsers = [
    { name: 'Mani', color: 'bg-orange-500', position: 'top-[70%] left-[5%]', delay: 0 },
    { name: 'DK', color: 'bg-pink-500', position: 'top-48 left-[80%]', delay: 0.5 },
    { name: 'Kishore', color: 'bg-purple-500', position: 'top-55 left-[80%]', delay: 1 },
    { name: 'JS', color: 'bg-blue-500', position: 'bottom-32 right-[10%]', delay: 1.5 },
    { name: 'Barath', color: 'bg-green-500', position: 'top-[45%] left-[8%]', delay: 0.8 },
];

export function Hero() {
    const navigate = useNavigate();
    const heroRef = useRef<HTMLDivElement>(null);

    useEffect(() => {
        if (!heroRef.current) return;
        
        const ctx = gsap.context(() => {
            const tl = gsap.timeline({ defaults: { ease: 'power2.out' } });

            // Animate main content
            tl.from('.hero-title', {
                y: 40,
                opacity: 0,
                duration: 0.8,
            });

            tl.from('.hero-desc', {
                y: 24,
                opacity: 0,
                duration: 0.6,
            }, '-=0.4');

            tl.from('.hero-buttons', {
                y: 20,
                opacity: 0,
                duration: 0.5,
            }, '-=0.3');

            // Animate floating elements
            tl.from('.floating-element', {
                scale: 0,
                opacity: 0,
                duration: 0.5,
                stagger: 0.1,
                ease: 'back.out(1.7)',
            }, '-=0.3');

            // Animate hand-drawn arrows (simple fade in, pathLength requires DrawSVGPlugin)
            tl.from('.hand-drawn-arrow', {
                opacity: 0,
                duration: 0.8,
                stagger: 0.2,
            }, '-=0.5');

        }, heroRef);

        return () => ctx.revert();
    }, []);

    return (
        <section
            ref={heroRef}
            className="relative min-h-screen flex items-center pt-20 pb-16 overflow-hidden bg-white"
        >
            {/* Subtle noise/grain texture background */}
            <div className="absolute inset-0">
                <div 
                    className="absolute inset-0 opacity-[0.4]"
                    style={{
                        backgroundImage: `url("data:image/svg+xml,%3Csvg viewBox='0 0 400 400' xmlns='http://www.w3.org/2000/svg'%3E%3Cfilter id='noiseFilter'%3E%3CfeTurbulence type='fractalNoise' baseFrequency='0.9' numOctaves='4' stitchTiles='stitch'/%3E%3C/filter%3E%3Crect width='100%25' height='100%25' filter='url(%23noiseFilter)'/%3E%3C/svg%3E")`,
                    }}
                />
            </div>

            {/* Hand-drawn SVG arrows */}
            <svg className="absolute inset-0 w-full h-full pointer-events-none" viewBox="0 0 1440 900" fill="none">
                {/* Top left curved arrow */}
                <path
                    className="hand-drawn-arrow"
                    d="M200 250 Q 350 200, 400 350 Q 450 500, 600 450"
                    stroke="#2D2A26"
                    strokeWidth="2"
                    strokeLinecap="round"
                    strokeDasharray="4 6"
                    fill="none"
                />
                {/* Arrow head */}
                <path
                    className="hand-drawn-arrow"
                    d="M595 445 L605 455 L610 442"
                    stroke="#2D2A26"
                    strokeWidth="2"
                    strokeLinecap="round"
                    strokeLinejoin="round"
                    fill="none"
                />
                
                {/* Top right curved arrow */}
                <path
                    className="hand-drawn-arrow"
                    d="M1200 180 Q 1100 280, 1150 380 Q 1200 480, 1050 520"
                    stroke="#2D2A26"
                    strokeWidth="2"
                    strokeLinecap="round"
                    strokeDasharray="4 6"
                    fill="none"
                />
                {/* Arrow head */}
                <path
                    className="hand-drawn-arrow"
                    d="M1055 515 L1045 525 L1058 528"
                    stroke="#2D2A26"
                    strokeWidth="2"
                    strokeLinecap="round"
                    strokeLinejoin="round"
                    fill="none"
                />

            </svg>

            {/* Floating collaboration elements */}
            
            {/* Left side - Realistic Notepaper */}
            <div className="floating-element absolute top-72 lg:top-80 left-4 lg:left-12 w-48 lg:w-64">
                <div className="relative">
                    {/* Notepaper with realistic styling */}
                    <div className="relative w-44 lg:w-56 bg-white rounded-sm shadow-lg overflow-hidden transform -rotate-2" style={{ boxShadow: '4px 4px 12px rgba(0,0,0,0.15), -1px -1px 4px rgba(0,0,0,0.05)' }}>
                        {/* Paper tape at top */}
                        <div className="absolute -top-1 left-1/2 -translate-x-1/2 w-12 h-4 bg-amber-200/80 rounded-sm" style={{ boxShadow: '0 1px 2px rgba(0,0,0,0.1)' }} />
                        
                        {/* Lined paper effect */}
                        <div className="pt-6 pb-4 px-4">
                            {/* Lines */}
                            <div className="space-y-3">
                                <div className="h-px bg-blue-100" />
                                <div className="h-px bg-blue-100" />
                                <div className="h-px bg-blue-100" />
                                <div className="h-px bg-blue-100" />
                                <div className="h-px bg-blue-100" />
                            </div>
                            {/* Handwritten-style text overlay */}
                            <div className="absolute top-8 left-4 right-4">
                                <p className="text-sm text-gray-700" style={{ fontFamily: 'cursive, serif' }}>@Barath</p>
                                <p className="text-xs text-gray-600 mt-1" style={{ fontFamily: 'cursive, serif' }}>I had an idea to simplify the user flow</p>
                            </div>
                        </div>
                        
                        {/* Red margin line */}
                        <div className="absolute top-0 left-6 w-px h-full bg-red-200" />
                        
                        {/* Subtle paper texture */}
                        <div className="absolute inset-0 opacity-[0.03]" style={{ backgroundImage: 'url("data:image/svg+xml,%3Csvg viewBox=\'0 0 200 200\' xmlns=\'http://www.w3.org/2000/svg\'%3E%3Cfilter id=\'noiseFilter\'%3E%3CfeTurbulence type=\'fractalNoise\' baseFrequency=\'0.9\' numOctaves=\'3\' stitchTiles=\'stitch\'/%3E%3C/filter%3E%3Crect width=\'100%25\' height=\'100%25\' filter=\'url(%23noiseFilter)\'/%3E%3C/svg%3E")' }} />
                    </div>
                    
                    {/* Sticky note attachment */}
                    <div className="absolute -right-6 -bottom-2 bg-yellow-200 rounded px-2 py-1.5 shadow-soft transform rotate-3">
                        <p className="text-[10px] text-gray-700 font-medium">💡 Great idea!</p>
                    </div>
                </div>
            </div>

            {/* Yellow sticky note with lightbulb - moved further right */}
            <div className="floating-element absolute top-28 lg:top-36 right-8 lg:right-20 w-20 h-20 lg:w-28 lg:h-28 bg-yellow-200 rounded-xl shadow-medium p-3 transform rotate-3">
                <Lightbulb className="w-8 h-8 lg:w-12 lg:h-12 text-yellow-700 mx-auto mt-1" />
            </div>

            {/* Emoji reactions - no animation */}
            <div className="floating-element absolute top-1/3 left-12 w-10 h-10 bg-yellow-100 rounded-full shadow-soft flex items-center justify-center text-xl">
                😊
            </div>
            <div className="floating-element absolute bottom-1/3 right-20 w-10 h-10 bg-gray-100 rounded-full shadow-soft flex items-center justify-center text-xl">
                ❤️
                <span className="absolute -top-1 -right-1 w-5 h-5 bg-gray-900 rounded-full text-white text-xs flex items-center justify-center font-bold">3</span>
            </div>

            {/* Floating user avatars with names */}
            {floatingUsers.map((user) => (
                <div
                    key={user.name}
                    className={`floating-element absolute ${user.position} hidden lg:flex items-center gap-2`}
                    style={{ animationDelay: `${user.delay}s` }}
                >
                    {/* Avatar */}
                    <div className={`w-8 h-8 ${user.color} rounded-full shadow-medium flex items-center justify-center`}>
                        <span className="text-white text-xs font-bold">{user.name.charAt(0)}</span>
                    </div>
                    {/* Name label */}
                    <span className="px-3 py-1 bg-gray-900 text-white text-sm font-medium rounded-full shadow-soft">
                        {user.name}
                    </span>
                    {/* Cursor pointer */}
                    <svg className="absolute -bottom-4 -left-2 w-4 h-5" viewBox="0 0 16 20" fill="none">
                        <path d="M1 1L1 15L4 12L7 19L10 18L7 11L12 11L1 1Z" fill={user.color.replace('bg-', '#').includes('#') ? '#2D2A26' : '#2D2A26'} stroke="white" strokeWidth="1.5" />
                    </svg>
                </div>
            ))}

            {/* User cursors at bottom - no animation */}
            <div className="floating-element absolute bottom-40 right-1/4 flex items-center gap-1">
                <svg className="w-5 h-6" viewBox="0 0 20 24" fill="none">
                    <path d="M4 2L4 18L7 15L10 21L13 20L10 14L15 14L4 2Z" fill="#8B5CF6" stroke="white" strokeWidth="2" />
                </svg>
                <span className="px-2 py-0.5 bg-purple-500 text-white text-xs font-medium rounded-full">Kishore</span>
            </div>

            <div className="floating-element absolute bottom-28 right-[18%] flex items-center gap-1">
                <svg className="w-5 h-6" viewBox="0 0 20 24" fill="none">
                    <path d="M4 2L4 18L7 15L10 21L13 20L10 14L15 14L4 2Z" fill="#3B82F6" stroke="white" strokeWidth="2" />
                </svg>
                <span className="px-2 py-0.5 bg-blue-500 text-white text-xs font-medium rounded-full">JS</span>
            </div>

            {/* Main Content - Centered */}
            <div className="relative z-10 max-w-5xl mx-auto px-4 sm:px-6 lg:px-8 w-full text-center">
                {/* Title */}
                <h1 className="hero-title text-4xl sm:text-5xl lg:text-6xl xl:text-7xl font-black text-gray-900 leading-tight mb-8">
                    A digital whiteboard for team{' '}
                    <br className="hidden sm:block" />
                    collaboration and brainstorming.
                </h1>

                {/* Description */}
                <p className="hero-desc text-lg sm:text-xl text-gray-500 max-w-2xl mx-auto mb-10 leading-relaxed">
                    Recent Create's source of inspiration for next UX/UI Design project trial it for Free
                </p>

                {/* CTA Buttons */}
                <div className="hero-buttons flex flex-col sm:flex-row gap-4 justify-center">
                    <Button
                        size="lg"
                        onClick={() => navigate('/signup')}
                        className="bg-gray-900 hover:bg-gray-800 text-white rounded-full px-8 py-6 text-base font-semibold shadow-md hover:shadow-lg transition-all duration-200"
                    >
                        Create a whiteboard for free
                    </Button>
                    <Button
                        size="lg"
                        variant="outline"
                        onClick={() => navigate('/login')}
                        className="border-2 border-gray-900 text-gray-900 hover:bg-gray-50 rounded-full px-8 py-6 text-base font-semibold"
                    >
                        Request a demo
                    </Button>
                </div>
            </div>

            {/* Scroll indicator - no bounce */}
            <div className="absolute bottom-8 left-1/2 -translate-x-1/2 flex flex-col items-center gap-2 text-gray-400">
                <span className="text-xs font-medium uppercase tracking-wider">Scroll</span>
                <div className="w-5 h-8 rounded-full border-2 border-gray-400 flex justify-center pt-1.5">
                    <div className="w-1 h-1.5 rounded-full bg-gray-400" />
                </div>
            </div>

            {/* Dotted section divider */}
            <div className="absolute bottom-0 left-0 right-0 border-b-2 border-dashed border-gray-200" />
        </section>
    );
}
