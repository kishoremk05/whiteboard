import { useState } from "react";
import { ChevronLeft, Info, Sparkles, Loader2 } from "lucide-react";
import { cn } from "../../lib/utils";
import {
  Tooltip,
  TooltipContent,
  TooltipProvider,
  TooltipTrigger,
} from "../ui/tooltip";

export type AIMode = "off" | "feedback" | "suggest" | "solve" | "generate";

interface AIAssistanceToggleProps {
  mode: AIMode;
  onModeChange: (mode: AIMode) => void;
  onAnalyze?: () => void;
  isAnalyzing?: boolean;
  className?: string;
}

const modeDescriptions: Record<AIMode, string> = {
  off: "AI assistance is disabled",
  feedback: "AI provides feedback on your work",
  suggest: "AI suggests improvements and ideas",
  solve: "AI helps solve problems step by step",
  generate: "AI generates drawings from text or images",
};

export function AIAssistanceToggle({
  mode,
  onModeChange,
  onAnalyze,
  isAnalyzing = false,
  className,
}: AIAssistanceToggleProps) {
  const [isCollapsed, setIsCollapsed] = useState(false);

  const modes: { id: AIMode; label: string }[] = [
    { id: "off", label: "Off" },
    { id: "feedback", label: "Feedback" },
    { id: "suggest", label: "Suggest" },
    { id: "solve", label: "Solve" },
    { id: "generate", label: "Generate" },
  ];

  if (isCollapsed) {
    return (
      <div className={cn("flex items-center", className)}>
        <button
          onClick={() => setIsCollapsed(false)}
          className="flex items-center justify-center w-7 h-7 rounded-full bg-white border border-slate-200 shadow-md hover:bg-slate-50 transition-colors"
          aria-label="Expand AI assistance panel"
        >
          <ChevronLeft className="w-4 h-4 text-slate-600 rotate-180" />
        </button>
      </div>
    );
  }

  return (
    <TooltipProvider>
      <div
        className={cn(
          "flex items-center gap-0.5 bg-white rounded-full border border-slate-200 shadow-md px-1 py-0.5",
          className
        )}
      >
        {/* Collapse button */}
        <button
          onClick={() => setIsCollapsed(true)}
          className="flex items-center justify-center w-6 h-6 rounded-full hover:bg-slate-100 transition-colors"
          aria-label="Collapse AI assistance panel"
        >
          <ChevronLeft className="w-4 h-4 text-slate-500" />
        </button>

        {/* Mode buttons */}
        <div className="flex items-center gap-0.5 bg-slate-100 rounded-full p-0.5">
          {modes.map((m) => (
            <button
              key={m.id}
              onClick={() => onModeChange(m.id)}
              className={cn(
                "px-2.5 py-1 text-xs font-medium rounded-full transition-all duration-200",
                mode === m.id
                  ? "bg-white text-slate-900 shadow-sm"
                  : "text-slate-600 hover:text-slate-900 hover:bg-slate-50"
              )}
            >
              {m.label}
            </button>
          ))}
        </div>

        {/* Analyze button - only show when mode is not "off" */}
        {mode !== "off" && onAnalyze && (
          <Tooltip>
            <TooltipTrigger asChild>
              <button
                onClick={onAnalyze}
                disabled={isAnalyzing}
                className={cn(
                  "flex items-center justify-center w-7 h-7 rounded-full transition-all duration-200",
                  isAnalyzing
                    ? "bg-primary-100 text-primary-500"
                    : "bg-primary-500 text-white hover:bg-primary-600 shadow-sm"
                )}
                aria-label="Analyze canvas with AI"
              >
                {isAnalyzing ? (
                  <Loader2 className="w-4 h-4 animate-spin" />
                ) : (
                  <Sparkles className="w-4 h-4" />
                )}
              </button>
            </TooltipTrigger>
            <TooltipContent side="bottom">
              <p className="text-xs">
                {isAnalyzing ? "Analyzing..." : "Analyze canvas with AI"}
              </p>
            </TooltipContent>
          </Tooltip>
        )}

        {/* Info button with tooltip */}
        <Tooltip>
          <TooltipTrigger asChild>
            <button
              className="flex items-center justify-center w-6 h-6 rounded-full hover:bg-slate-100 transition-colors"
              aria-label="AI mode information"
            >
              <Info className="w-4 h-4 text-slate-500" />
            </button>
          </TooltipTrigger>
          <TooltipContent side="top" className="max-w-xs">
            <div className="space-y-2 text-sm">
              <p className="font-semibold">AI Assistance Modes:</p>
              {modes.map((m) => (
                <p key={m.id}>
                  <span className="font-medium">{m.label}:</span>{" "}
                  {modeDescriptions[m.id]}
                </p>
              ))}
            </div>
          </TooltipContent>
        </Tooltip>
      </div>
    </TooltipProvider>
  );
}
