import { useEffect, useRef } from "react";
import gsap from "gsap";
import { ScrollTrigger } from "gsap/ScrollTrigger";
import { Sparkles, Zap, Users, Lock, Layers, Palette } from "lucide-react";

gsap.registerPlugin(ScrollTrigger);

const features = [
  {
    icon: Sparkles,
    title: "Smart Brainstorming",
    description:
      "Organize ideas visually with mind maps, sticky notes, and intuitive layout tools.",
    color: "bg-yellow-400",
    iconColor: "text-gray-900",
    rotate: "-rotate-1",
  },
  {
    icon: Zap,
    title: "Lightning Fast",
    description: "Handle thousands of shapes and annotations without any lag.",
    color: "bg-pink-400",
    iconColor: "text-white",
    rotate: "rotate-1",
  },
  {
    icon: Users,
    title: "Real-time Collaboration",
    description:
      "See your team's cursors and edits update instantly. No refresh needed.",
    color: "bg-blue-400",
    iconColor: "text-white",
    rotate: "-rotate-2",
  },
  {
    icon: Lock,
    title: "Enterprise Security",
    description: "Your data is encrypted and secure with SOC 2 compliance.",
    color: "bg-green-400",
    iconColor: "text-white",
    rotate: "rotate-2",
  },
  {
    icon: Layers,
    title: "Infinite Canvas",
    description:
      "Never run out of space. Zoom in for details or out for the big picture.",
    color: "bg-purple-400",
    iconColor: "text-white",
    rotate: "-rotate-1",
  },
  {
    icon: Palette,
    title: "Beautiful Templates",
    description:
      "Start quickly with professionally designed templates for any use case.",
    color: "bg-orange-400",
    iconColor: "text-white",
    rotate: "rotate-1",
  },
];

export function Features() {
  const sectionRef = useRef<HTMLElement>(null);
  const cardsRef = useRef<(HTMLDivElement | null)[]>([]);

  useEffect(() => {
    const ctx = gsap.context(() => {
      gsap.from(".features-header", {
        scrollTrigger: {
          trigger: sectionRef.current,
          start: "top 80%",
        },
        y: 30,
        opacity: 0,
        duration: 0.8,
        ease: "power2.out",
      });

      cardsRef.current.forEach((card, index) => {
        if (card) {
          gsap.from(card, {
            scrollTrigger: {
              trigger: card,
              start: "top 85%",
            },
            y: 40,
            opacity: 0,
            duration: 0.6,
            delay: index * 0.1,
            ease: "power2.out",
          });
        }
      });
    }, sectionRef);

    return () => ctx.revert();
  }, []);

  return (
    <section
      ref={sectionRef}
      id="features"
      className="py-24 lg:py-32 bg-gray-50 relative overflow-hidden"
    >
      {/* Hand-drawn decorative lines */}
      <svg
        className="absolute inset-0 w-full h-full pointer-events-none opacity-20"
        viewBox="0 0 1440 800"
      >
        <path
          d="M100 200 Q 300 150, 400 200 Q 500 250, 600 180"
          stroke="#2D2A26"
          strokeWidth="2"
          strokeDasharray="6 8"
          fill="none"
        />
        <path
          d="M900 600 Q 1000 550, 1100 620 Q 1200 700, 1300 650"
          stroke="#2D2A26"
          strokeWidth="2"
          strokeDasharray="6 8"
          fill="none"
        />
      </svg>

      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 relative z-10">
        {/* Section Header */}
        <div className="features-header text-center max-w-3xl mx-auto mb-20">
          <div className="inline-flex items-center gap-2 bg-yellow-100 text-yellow-800 px-4 py-2 rounded-full text-sm font-medium mb-6">
            <Sparkles className="w-4 h-4" />
            Packed with features
          </div>
          <h2 className="text-4xl sm:text-5xl lg:text-6xl font-black text-gray-900 mb-6">
            Everything you need to{" "}
            <span className="relative">
              collaborate
              <svg
                className="absolute -bottom-2 left-0 w-full"
                viewBox="0 0 200 12"
                fill="none"
              >
                <path
                  d="M2 8 Q 50 2, 100 8 Q 150 14, 198 6"
                  stroke="#FBBF24"
                  strokeWidth="4"
                  strokeLinecap="round"
                  fill="none"
                />
              </svg>
            </span>
          </h2>
          <p className="text-lg text-gray-500">
            Powerful tools designed for creative teams who want to bring ideas
            to life together.
          </p>
        </div>

        {/* Features Grid */}
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6 lg:gap-8">
          {features.map((feature, index) => (
            <div
              key={feature.title}
              ref={(el) => {
                cardsRef.current[index] = el;
              }}
              className={`group relative bg-white rounded-2xl p-6 lg:p-8 border-2 border-gray-100 hover:border-gray-200 shadow-sm hover:shadow-xl transition-all duration-300 ${feature.rotate}`}
            >
              {/* Colored corner accent */}
              <div
                className={`absolute top-0 right-0 w-20 h-20 ${feature.color} opacity-10 rounded-bl-[80px] rounded-tr-2xl`}
              />

              {/* Icon */}
              <div
                className={`w-14 h-14 ${feature.color} rounded-2xl flex items-center justify-center mb-5 shadow-lg transform group-hover:scale-110 transition-transform duration-300`}
              >
                <feature.icon className={`w-7 h-7 ${feature.iconColor}`} />
              </div>

              {/* Content */}
              <h3 className="text-xl font-bold text-gray-900 mb-3">
                {feature.title}
              </h3>
              <p className="text-gray-500 leading-relaxed">
                {feature.description}
              </p>

              {/* Hover arrow */}
              <div className="mt-4 flex items-center text-gray-400 group-hover:text-gray-900 transition-colors">
                <span className="text-sm font-medium">Learn more</span>
                <svg
                  className="w-4 h-4 ml-1 transform group-hover:translate-x-1 transition-transform"
                  fill="none"
                  viewBox="0 0 24 24"
                  stroke="currentColor"
                >
                  <path
                    strokeLinecap="round"
                    strokeLinejoin="round"
                    strokeWidth={2}
                    d="M9 5l7 7-7 7"
                  />
                </svg>
              </div>
            </div>
          ))}
        </div>
      </div>
    </section>
  );
}
