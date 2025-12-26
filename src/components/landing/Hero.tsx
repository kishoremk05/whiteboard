import { useEffect, useRef } from "react";
import { useNavigate } from "react-router-dom";
import gsap from "gsap";
import { Pencil, Square, Circle, Type } from "lucide-react";
import { Button } from "../ui/button";
import { useAuth } from "../../contexts/AuthContext";

export function Hero() {
  const navigate = useNavigate();
  const { isAuthenticated } = useAuth();
  const heroRef = useRef<HTMLDivElement>(null);

  const handleCreateBoard = () => {
    // If user is logged in, go to dashboard; otherwise go to signup
    if (isAuthenticated) {
      navigate("/dashboard");
    } else {
      navigate("/signup");
    }
  };

  useEffect(() => {
    if (!heroRef.current) return;

    const ctx = gsap.context(() => {
      const tl = gsap.timeline({ defaults: { ease: "power2.out" } });

      // Animate main content
      tl.from(".hero-title", {
        y: 40,
        opacity: 0,
        duration: 0.8,
      });

      tl.from(
        ".hero-desc",
        {
          y: 24,
          opacity: 0,
          duration: 0.6,
        },
        "-=0.4"
      );

      tl.from(
        ".hero-badges",
        {
          y: 20,
          opacity: 0,
          duration: 0.5,
        },
        "-=0.3"
      );

      tl.from(
        ".hero-trust",
        {
          opacity: 0,
          duration: 0.4,
        },
        "-=0.2"
      );

      // Animate floating elements
      tl.from(
        ".floating-element",
        {
          scale: 0,
          opacity: 0,
          duration: 0.5,
          stagger: 0.1,
          ease: "back.out(1.7)",
        },
        "-=0.3"
      );
    }, heroRef);

    return () => ctx.revert();
  }, []);

  return (
    <section
      ref={heroRef}
      className="relative min-h-screen flex items-center pt-20 pb-16 overflow-hidden bg-gradient-to-br from-gray-50 via-white to-blue-50"
    >
      {/* Whiteboard grid background */}
      <div className="absolute inset-0">
        <div
          className="absolute inset-0 opacity-[0.03]"
          style={{
            backgroundImage: `
              linear-gradient(to right, #e5e7eb 1px, transparent 1px),
              linear-gradient(to bottom, #e5e7eb 1px, transparent 1px)
            `,
            backgroundSize: '40px 40px'
          }}
        />
      </div>

      {/* Whiteboard tool icons floating around */}
      <div className="floating-element absolute top-24 left-8 lg:left-16 w-14 h-14 bg-white rounded-lg shadow-lg flex items-center justify-center transform -rotate-6">
        <Pencil className="w-7 h-7 text-blue-600" />
      </div>

      <div className="floating-element absolute top-32 right-12 lg:right-24 w-14 h-14 bg-white rounded-lg shadow-lg flex items-center justify-center transform rotate-12">
        <Type className="w-7 h-7 text-purple-600" />
      </div>

      <div className="floating-element absolute bottom-32 left-12 lg:left-20 w-14 h-14 bg-white rounded-lg shadow-lg flex items-center justify-center transform rotate-6">
        <Square className="w-7 h-7 text-green-600" />
      </div>

      <div className="floating-element absolute top-1/3 right-8 lg:right-16 w-14 h-14 bg-white rounded-lg shadow-lg flex items-center justify-center transform -rotate-12">
        <Circle className="w-7 h-7 text-orange-600" />
      </div>

      {/* Sticky notes cluster - top left */}
      <div className="floating-element absolute top-40 left-4 lg:left-12 space-y-3">
        {/* Yellow sticky note */}
        <div className="w-32 lg:w-40 h-28 lg:h-32 bg-yellow-200 shadow-md transform -rotate-3 p-3">
          <div className="w-8 h-1 bg-yellow-300 mb-2"></div>
          <div className="space-y-1.5">
            <div className="h-1 bg-yellow-400/40 w-3/4"></div>
            <div className="h-1 bg-yellow-400/40 w-full"></div>
            <div className="h-1 bg-yellow-400/40 w-2/3"></div>
          </div>
          <p className="text-xs text-gray-700 font-medium mt-2">Brainstorm</p>
        </div>
      </div>

      {/* Sticky notes - top right */}
      <div className="floating-element absolute top-48 right-4 lg:right-12 space-y-2">
        {/* Pink sticky note */}
        <div className="w-28 lg:w-36 h-24 lg:h-28 bg-pink-200 shadow-md transform rotate-6 p-3">
          <div className="space-y-1">
            <div className="h-1 bg-pink-400/40 w-full"></div>
            <div className="h-1 bg-pink-400/40 w-5/6"></div>
            <div className="h-1 bg-pink-400/40 w-3/4"></div>
          </div>
          <p className="text-xs text-gray-700 font-medium mt-2">Ideas</p>
        </div>
      </div>

      {/* Hand-drawn shapes - left side */}
      <div className="floating-element absolute top-1/2 left-8 lg:left-16">
        {/* Hand-drawn circle */}
        <svg className="w-20 h-20 lg:w-28 lg:h-28" viewBox="0 0 100 100">
          <circle
            cx="50"
            cy="50"
            r="35"
            fill="none"
            stroke="#3B82F6"
            strokeWidth="3"
            strokeLinecap="round"
            strokeDasharray="2,2"
          />
        </svg>
      </div>

      {/* Hand-drawn arrow - pointing to center */}
      <div className="floating-element absolute bottom-1/3 right-16 lg:right-32">
        <svg className="w-24 h-16 lg:w-32 lg:h-20" viewBox="0 0 120 80">
          <path
            d="M10 40 Q40 20, 90 35"
            fill="none"
            stroke="#10B981"
            strokeWidth="3"
            strokeLinecap="round"
          />
          <path
            d="M85 32 L95 35 L87 40"
            fill="none"
            stroke="#10B981"
            strokeWidth="3"
            strokeLinecap="round"
            strokeLinejoin="round"
          />
        </svg>
      </div>

      {/* Collaboration cursors */}
      <div className="floating-element absolute top-1/3 left-1/4 flex items-center gap-2">
        <svg className="w-5 h-6" viewBox="0 0 20 24" fill="none">
          <path
            d="M4 2L4 18L7 15L10 21L13 20L10 14L15 14L4 2Z"
            fill="#8B5CF6"
            stroke="white"
            strokeWidth="2"
          />
        </svg>
        <span className="px-2 py-1 bg-purple-500 text-white text-xs font-semibold rounded shadow-sm">
          Sarah
        </span>
      </div>

      <div className="floating-element absolute bottom-1/3 right-1/4 flex items-center gap-2">
        <svg className="w-5 h-6" viewBox="0 0 20 24" fill="none">
          <path
            d="M4 2L4 18L7 15L10 21L13 20L10 14L15 14L4 2Z"
            fill="#3B82F6"
            stroke="white"
            strokeWidth="2"
          />
        </svg>
        <span className="px-2 py-1 bg-blue-500 text-white text-xs font-semibold rounded shadow-sm">
          Mike
        </span>
      </div>

      {/* Sketched mind map connection */}
      <div className="floating-element absolute top-2/3 left-1/3 hidden lg:block">
        <svg className="w-32 h-24" viewBox="0 0 150 100">
          <path
            d="M10 50 Q75 20, 140 50"
            fill="none"
            stroke="#F59E0B"
            strokeWidth="2"
            strokeLinecap="round"
            strokeDasharray="4,4"
          />
        </svg>
      </div>

      {/* Main Content - Centered */}
      <div className="relative z-10 max-w-6xl mx-auto px-4 sm:px-6 lg:px-8 w-full text-center">
        {/* Title with whiteboard theme */}
        <h1 className="hero-title text-4xl sm:text-5xl lg:text-6xl xl:text-7xl font-black text-gray-900 leading-tight mb-6">
          Your Infinite Digital
          <br className="hidden sm:block" />
          <span className="relative inline-block">
            Whiteboard
            {/* Underline sketch effect */}
            <svg
              className="absolute -bottom-2 left-0 w-full h-4"
              viewBox="0 0 300 12"
              preserveAspectRatio="none"
            >
              <path
                d="M5 8 Q150 2, 295 8"
                fill="none"
                stroke="#3B82F6"
                strokeWidth="3"
                strokeLinecap="round"
              />
            </svg>
          </span>
        </h1>

        {/* Description */}
        <p className="hero-desc text-lg sm:text-xl text-gray-600 max-w-3xl mx-auto mb-10 leading-relaxed">
          Collaborate visually in real-time. Sketch ideas, share feedback, and build together on an endless canvas designed for teams.
        </p>

        {/* Feature badges */}
        <div className="hero-badges flex flex-wrap justify-center gap-3 mb-10">
          <span className="px-4 py-2 bg-white text-gray-700 text-sm font-medium rounded-full shadow-sm border border-gray-200">
            ✏️ Draw & Sketch
          </span>
          <span className="px-4 py-2 bg-white text-gray-700 text-sm font-medium rounded-full shadow-sm border border-gray-200">
            📝 Sticky Notes
          </span>
          <span className="px-4 py-2 bg-white text-gray-700 text-sm font-medium rounded-full shadow-sm border border-gray-200">
            👥 Real-time Collaboration
          </span>
          <span className="px-4 py-2 bg-white text-gray-700 text-sm font-medium rounded-full shadow-sm border border-gray-200">
            🎨 Shapes & Text
          </span>
        </div>

        {/* CTA Buttons */}
        <div className="hero-buttons flex flex-col sm:flex-row gap-4 justify-center">
          <Button
            size="lg"
            onClick={handleCreateBoard}
            className="bg-gray-900 hover:bg-blue-700 text-white rounded-lg px-8 py-6 text-base font-semibold shadow-lg hover:shadow-xl transition-all duration-200"
          >
            Start Drawing for Free
          </Button>
          <Button
            size="lg"
            variant="outline"
            onClick={() => navigate("/login")}
            className="border-2 border-gray-900 text-gray-900 hover:bg-gray-50 rounded-lg px-8 py-6 text-base font-semibold"
          >
            See How It Works
          </Button>
        </div>

        {/* Trust indicators */}
        <p className="hero-trust text-sm text-gray-500 mt-8">
          Trusted by 10,000+ teams worldwide for visual collaboration
        </p>
      </div>

      {/* Scroll indicator */}
      <div className="absolute bottom-8 left-1/2 -translate-x-1/2 flex flex-col items-center gap-2 text-gray-400">
        <span className="text-xs font-medium uppercase tracking-wider">
          Scroll
        </span>
        <div className="w-5 h-8 rounded-full border-2 border-gray-400 flex justify-center pt-1.5">
          <div className="w-1 h-1.5 rounded-full bg-gray-400" />
        </div>
      </div>
    </section>
  );
}
