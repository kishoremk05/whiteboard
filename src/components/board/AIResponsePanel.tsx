import { X, Sparkles, AlertCircle } from "lucide-react";
import { cn } from "../../lib/utils";
import { type AIMode } from "./AIAssistanceToggle";

// Generate mode uses a different panel, so exclude it here
type AnalyzeMode = Exclude<AIMode, "off" | "generate">;

interface AIResponsePanelProps {
  mode: AnalyzeMode;
  content: string | null;
  error: string | null;
  isLoading: boolean;
  onClose: () => void;
  className?: string;
}

const modeColors: Record<AnalyzeMode, string> = {
  feedback: "border-blue-500 bg-blue-50",
  suggest: "border-purple-500 bg-purple-50",
  solve: "border-green-500 bg-green-50",
};

const modeIcons: Record<AnalyzeMode, string> = {
  feedback: "💬",
  suggest: "💡",
  solve: "🧮",
};

const modeTitles: Record<AnalyzeMode, string> = {
  feedback: "AI Feedback",
  suggest: "AI Suggestions",
  solve: "AI Solution",
};

export function AIResponsePanel({
  mode,
  content,
  error,
  isLoading,
  onClose,
  className,
}: AIResponsePanelProps) {
  return (
    <div
      className={cn(
        "w-80 max-h-96 bg-white rounded-xl border-2 shadow-xl overflow-hidden flex flex-col",
        modeColors[mode],
        className
      )}
    >
      {/* Header */}
      <div className="flex items-center justify-between px-3 py-2 border-b bg-white/80">
        <div className="flex items-center gap-2">
          <span className="text-lg">{modeIcons[mode]}</span>
          <span className="font-semibold text-sm text-slate-800">
            {modeTitles[mode]}
          </span>
        </div>
        <button
          onClick={onClose}
          className="p-1 hover:bg-slate-100 rounded-full transition-colors"
          aria-label="Close AI panel"
        >
          <X className="w-4 h-4 text-slate-500" />
        </button>
      </div>

      {/* Content */}
      <div className="flex-1 overflow-y-auto p-3">
        {isLoading ? (
          <div className="flex flex-col items-center justify-center py-8 gap-3">
            <div className="relative">
              <Sparkles className="w-8 h-8 text-primary-500 animate-pulse" />
              <div className="absolute inset-0 animate-spin">
                <div className="w-2 h-2 bg-primary-400 rounded-full absolute top-0 left-1/2 -translate-x-1/2" />
              </div>
            </div>
            <p className="text-sm text-slate-600 animate-pulse">
              Analyzing your canvas...
            </p>
          </div>
        ) : error ? (
          <div className="flex flex-col items-center justify-center py-6 gap-2 text-center">
            <AlertCircle className="w-8 h-8 text-red-500" />
            <p className="text-sm text-red-600">{error}</p>
          </div>
        ) : content ? (
          <div className="prose prose-sm prose-slate max-w-none">
            {/* Simple markdown-like rendering */}
            {content.split("\n").map((line, i) => {
              // Handle headers
              if (line.startsWith("### ")) {
                return (
                  <h4 key={i} className="font-bold text-slate-800 mt-3 mb-1">
                    {line.slice(4)}
                  </h4>
                );
              }
              if (line.startsWith("## ")) {
                return (
                  <h3 key={i} className="font-bold text-slate-800 mt-3 mb-1">
                    {line.slice(3)}
                  </h3>
                );
              }
              if (line.startsWith("# ")) {
                return (
                  <h2 key={i} className="font-bold text-slate-900 mt-3 mb-1">
                    {line.slice(2)}
                  </h2>
                );
              }
              // Handle bullet points
              if (line.startsWith("- ") || line.startsWith("* ")) {
                return (
                  <p key={i} className="text-slate-700 pl-4 my-0.5">
                    • {line.slice(2)}
                  </p>
                );
              }
              // Handle numbered lists
              if (/^\d+\.\s/.test(line)) {
                return (
                  <p key={i} className="text-slate-700 pl-4 my-0.5">
                    {line}
                  </p>
                );
              }
              // Handle bold text with **
              if (line.includes("**")) {
                const parts = line.split(/\*\*(.+?)\*\*/g);
                return (
                  <p key={i} className="text-slate-700 my-1">
                    {parts.map((part, j) =>
                      j % 2 === 1 ? (
                        <strong key={j}>{part}</strong>
                      ) : (
                        <span key={j}>{part}</span>
                      )
                    )}
                  </p>
                );
              }
              // Empty lines
              if (!line.trim()) {
                return <div key={i} className="h-2" />;
              }
              // Regular text
              return (
                <p key={i} className="text-slate-700 my-1">
                  {line}
                </p>
              );
            })}
          </div>
        ) : (
          <div className="flex flex-col items-center justify-center py-8 text-center">
            <Sparkles className="w-8 h-8 text-slate-300 mb-2" />
            <p className="text-sm text-slate-500">
              Click the ✨ button to analyze your canvas
            </p>
          </div>
        )}
      </div>
    </div>
  );
}
