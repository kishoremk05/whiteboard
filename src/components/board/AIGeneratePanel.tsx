import { useState, useRef } from "react";
import { Sparkles, Upload, X, Loader2, Square } from "lucide-react";
import { cn } from "../../lib/utils";
import { Button } from "../ui/button";
import { Input } from "../ui/input";

interface AIGeneratePanelProps {
  onGenerateFromText: (prompt: string) => Promise<void>;
  onGenerateFromImage: (imageBase64: string) => Promise<void>;
  isGenerating: boolean;
  onClose: () => void;
  onStop?: () => void;
  className?: string;
}

export function AIGeneratePanel({
  onGenerateFromText,
  onGenerateFromImage,
  isGenerating,
  onClose,
  onStop,
  className,
}: AIGeneratePanelProps) {
  const [prompt, setPrompt] = useState("");
  const [activeTab, setActiveTab] = useState<"text" | "image">("text");
  const fileInputRef = useRef<HTMLInputElement>(null);

  const handleTextGenerate = async () => {
    if (!prompt.trim()) return;
    await onGenerateFromText(prompt.trim());
    setPrompt("");
  };

  const handleImageUpload = async (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (!file) return;

    const reader = new FileReader();
    reader.onload = async () => {
      const base64 = (reader.result as string).split(",")[1];
      await onGenerateFromImage(base64);
    };
    reader.readAsDataURL(file);
    
    // Reset input
    if (fileInputRef.current) {
      fileInputRef.current.value = "";
    }
  };

  return (
    <div
      className={cn(
        "w-80 bg-white rounded-xl border-2 border-violet-500 shadow-xl overflow-hidden",
        className
      )}
    >
      {/* Header */}
      <div className="flex items-center justify-between px-3 py-2 bg-gradient-to-r from-violet-500 to-purple-500 text-white">
        <div className="flex items-center gap-2">
          <Sparkles className="w-4 h-4" />
          <span className="font-semibold text-sm">AI Generate</span>
        </div>
        <button
          onClick={onClose}
          className="p-1 hover:bg-white/20 rounded-full transition-colors"
          aria-label="Close"
        >
          <X className="w-4 h-4" />
        </button>
      </div>

      {/* Tabs */}
      <div className="flex border-b">
        <button
          onClick={() => setActiveTab("text")}
          className={cn(
            "flex-1 py-2 text-sm font-medium transition-colors",
            activeTab === "text"
              ? "bg-violet-50 text-violet-700 border-b-2 border-violet-500"
              : "text-slate-600 hover:bg-slate-50"
          )}
        >
          Text to Drawing
        </button>
        <button
          onClick={() => setActiveTab("image")}
          className={cn(
            "flex-1 py-2 text-sm font-medium transition-colors",
            activeTab === "image"
              ? "bg-violet-50 text-violet-700 border-b-2 border-violet-500"
              : "text-slate-600 hover:bg-slate-50"
          )}
        >
          Image to Canvas
        </button>
      </div>

      {/* Content */}
      <div className="p-3">
        {isGenerating ? (
          <div className="flex flex-col items-center justify-center py-8 gap-3">
            <Loader2 className="w-8 h-8 text-violet-500 animate-spin" />
            <p className="text-sm text-slate-600">Generating shapes...</p>
            {onStop && (
              <button
                onClick={onStop}
                className="flex items-center gap-2 px-4 py-2 bg-red-500 text-white rounded-lg hover:bg-red-600 transition-colors text-sm"
              >
                <Square className="w-4 h-4 fill-current" />
                Stop
              </button>
            )}
          </div>
        ) : activeTab === "text" ? (
          <div className="space-y-3">
            <p className="text-xs text-slate-500">
              Describe what you want to draw:
            </p>
            <Input
              placeholder="e.g., 'draw a house' or 'flowchart'"
              value={prompt}
              onChange={(e) => setPrompt(e.target.value)}
              onKeyDown={(e) => e.key === "Enter" && handleTextGenerate()}
              className="text-sm"
            />
            <Button
              onClick={handleTextGenerate}
              disabled={!prompt.trim()}
              className="w-full bg-violet-500 hover:bg-violet-600"
            >
              <Sparkles className="w-4 h-4 mr-2" />
              Generate
            </Button>
          </div>
        ) : (
          <div className="space-y-3">
            <p className="text-xs text-slate-500">
              Upload an image to recreate as shapes:
            </p>
            <div
              onClick={() => fileInputRef.current?.click()}
              className="border-2 border-dashed border-slate-300 rounded-lg p-6 text-center cursor-pointer hover:border-violet-400 hover:bg-violet-50 transition-colors"
            >
              <Upload className="w-8 h-8 mx-auto text-slate-400 mb-2" />
              <p className="text-sm text-slate-600">Click to upload image</p>
              <p className="text-xs text-slate-400">PNG, JPG, SVG</p>
            </div>
            <input
              ref={fileInputRef}
              type="file"
              accept="image/*"
              onChange={handleImageUpload}
              className="hidden"
            />
          </div>
        )}
      </div>
    </div>
  );
}
