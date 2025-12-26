import { useNavigate } from "react-router-dom";
import { ArrowRight, Check, Sparkles, Users, Zap } from "lucide-react";
import { Button } from "../ui/button";
import { useAuth } from "../../contexts/AuthContext";

const features = [
  { icon: Check, text: "Unlimited boards" },
  { icon: Users, text: "Real-time collaboration" },
  { icon: Sparkles, text: "Unlimited templates" },
  { icon: Zap, text: "No credit card required" },
];

export function CTA() {
  const navigate = useNavigate();
  const { isAuthenticated } = useAuth();

  return (
    <section className="py-24 lg:py-32 bg-gray-900 relative overflow-hidden">
      {/* Background decoration */}
      <div className="absolute inset-0">
        {/* Gradient orbs */}
        <div className="absolute top-0 left-1/4 w-96 h-96 bg-blue-500/20 rounded-full blur-3xl" />
        <div className="absolute bottom-0 right-1/4 w-96 h-96 bg-purple-500/20 rounded-full blur-3xl" />

        {/* Grid pattern */}
        <div
          className="absolute inset-0 opacity-[0.05]"
          style={{
            backgroundImage: `linear-gradient(rgba(255,255,255,0.1) 1px, transparent 1px), linear-gradient(90deg, rgba(255,255,255,0.1) 1px, transparent 1px)`,
            backgroundSize: "50px 50px",
          }}
        />
      </div>

      <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8 text-center relative z-10">
        {/* Badge */}
        <div className="inline-flex items-center gap-2 bg-white/10 backdrop-blur-sm text-white px-4 py-2 rounded-full text-sm font-medium mb-8 border border-white/20">
          <span className="w-2 h-2 bg-green-400 rounded-full animate-pulse" />
          Free forever for individuals
        </div>

        {/* Headline */}
        <h2 className="text-4xl sm:text-5xl lg:text-6xl font-black text-white mb-6 leading-tight">
          Ready to bring your{" "}
          <span className="relative inline-block">
            ideas
            <svg
              className="absolute -bottom-2 left-0 w-full"
              viewBox="0 0 120 12"
              fill="none"
            >
              <path
                d="M2 8 Q 30 2, 60 8 Q 90 14, 118 6"
                stroke="#FBBF24"
                strokeWidth="4"
                strokeLinecap="round"
                fill="none"
              />
            </svg>
          </span>{" "}
          to life?
        </h2>

        {/* Subheadline */}
        <p className="text-lg lg:text-xl text-gray-400 mb-10 max-w-2xl mx-auto">
          Join thousands of creative teams using CanvasBoard to visualize,
          collaborate, and create together.
        </p>

        {/* Feature Badges */}
        <div className="flex flex-wrap justify-center gap-4 mb-12">
          {features.map((feature) => (
            <div
              key={feature.text}
              className="flex items-center gap-2 bg-white/10 backdrop-blur-sm text-white px-4 py-2 rounded-full text-sm border border-white/10"
            >
              <feature.icon className="w-4 h-4 text-yellow-400" />
              {feature.text}
            </div>
          ))}
        </div>

        {/* CTA Buttons */}
        <div className="flex flex-col sm:flex-row items-center justify-center gap-4">
          <Button
            onClick={() => navigate(isAuthenticated ? "/dashboard" : "/signup")}
            size="lg"
            className="w-full sm:w-auto bg-white text-gray-900 hover:bg-gray-100 rounded-full px-10 py-7 text-lg font-semibold shadow-2xl hover:shadow-white/20 transition-all duration-300 group"
          >
            Get Started Free
            <ArrowRight className="w-5 h-5 ml-2 group-hover:translate-x-1 transition-transform" />
          </Button>
          <Button
            variant="outline"
            onClick={() => navigate("/login")}
            size="lg"
            className="w-full sm:w-auto border-2 border-white/30 text-black hover:bg-white/10 rounded-full px-10 py-7 text-lg font-medium backdrop-blur-sm"
          >
            Request a Demo
          </Button>
        </div>

        {/* Trust badges */}
        <div className="mt-12 flex flex-col items-center gap-4">
          <div className="flex items-center gap-2">
            {[...Array(5)].map((_, i) => (
              <svg
                key={i}
                className="w-5 h-5 text-yellow-400"
                fill="currentColor"
                viewBox="0 0 20 20"
              >
                <path d="M9.049 2.927c.3-.921 1.603-.921 1.902 0l1.07 3.292a1 1 0 00.95.69h3.462c.969 0 1.371 1.24.588 1.81l-2.8 2.034a1 1 0 00-.364 1.118l1.07 3.292c.3.921-.755 1.688-1.54 1.118l-2.8-2.034a1 1 0 00-1.175 0l-2.8 2.034c-.784.57-1.838-.197-1.539-1.118l1.07-3.292a1 1 0 00-.364-1.118L2.98 8.72c-.783-.57-.38-1.81.588-1.81h3.461a1 1 0 00.951-.69l1.07-3.292z" />
              </svg>
            ))}
          </div>
          <p className="text-gray-400 text-sm">
            Trusted by <span className="text-white font-semibold">10,000+</span>{" "}
            teams worldwide
          </p>
        </div>
      </div>
    </section>
  );
}
