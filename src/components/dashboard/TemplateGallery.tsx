import { useState, useEffect } from "react";
import { useNavigate } from "react-router-dom";
import {
  Sparkles,
  GraduationCap,
  Briefcase,
  Lightbulb,
  Palette,
  FileText,
  Presentation,
  LayoutGrid,
  Check,
  ArrowRight,
  Eye,
  Users,
  Star,
  Zap,
  X,
  Loader2,
} from "lucide-react";
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogHeader,
  DialogTitle,
} from "../ui/dialog";
import { Button } from "../ui/button";
import { Badge } from "../ui/badge";
import { fetchTemplates } from "../../lib/services/templateService";
import { useBoards } from "../../contexts/BoardContext";
import { cn } from "../../lib/utils";
import type { DbTemplate } from "../../types/database.types";

interface TemplateGalleryProps {
  open: boolean;
  onOpenChange: (open: boolean) => void;
}

const templateIcons: Record<string, React.ReactNode> = {
  "template-blank": <LayoutGrid className="w-8 h-8" />,
  "template-math": <span className="text-2xl">∑</span>,
  "template-physics": <span className="text-2xl">⚛</span>,
  "template-brainstorm": <Lightbulb className="w-8 h-8" />,
  "template-teaching": <Presentation className="w-8 h-8" />,
  "template-meeting": <FileText className="w-8 h-8" />,
  "template-wireframe": <LayoutGrid className="w-8 h-8" />,
  "template-kanban": <LayoutGrid className="w-8 h-8" />,
};

const categoryColors: Record<
  string,
  { bg: string; text: string; gradient: string }
> = {
  general: {
    bg: "bg-slate-100",
    text: "text-slate-600",
    gradient: "from-slate-400 to-slate-600",
  },
  education: {
    bg: "bg-blue-100",
    text: "text-blue-600",
    gradient: "from-blue-400 to-blue-600",
  },
  business: {
    bg: "bg-emerald-100",
    text: "text-emerald-600",
    gradient: "from-emerald-400 to-emerald-600",
  },
  creative: {
    bg: "bg-rose-100",
    text: "text-rose-600",
    gradient: "from-rose-400 to-rose-600",
  },
};

const templateStats: Record<string, { uses: string; rating: number }> = {
  "template-blank": { uses: "10K+", rating: 4.8 },
  "template-math": { uses: "5.2K", rating: 4.9 },
  "template-physics": { uses: "3.1K", rating: 4.7 },
  "template-brainstorm": { uses: "8.5K", rating: 4.9 },
  "template-teaching": { uses: "6.3K", rating: 4.8 },
  "template-meeting": { uses: "12K+", rating: 4.6 },
  "template-wireframe": { uses: "4.7K", rating: 4.7 },
  "template-kanban": { uses: "9.1K", rating: 4.8 },
};

export function TemplateGallery({ open, onOpenChange }: TemplateGalleryProps) {
  const navigate = useNavigate();
  const { createBoard } = useBoards();
  const [selectedCategory, setSelectedCategory] = useState<string | null>(null);
  const [selectedTemplate, setSelectedTemplate] = useState<string | null>(null);
  const [previewTemplate, setPreviewTemplate] = useState<string | null>(null);
  const [isCreating, setIsCreating] = useState(false);
  const [templates, setTemplates] = useState<DbTemplate[]>([]);
  const [isLoading, setIsLoading] = useState(true);

  // Fetch templates from database
  useEffect(() => {
    const loadTemplates = async () => {
      try {
        const data = await fetchTemplates();
        setTemplates(data);
      } catch (error) {
        console.error("Failed to load templates:", error);
      } finally {
        setIsLoading(false);
      }
    };
    loadTemplates();
  }, []);

  const filteredTemplates = selectedCategory
    ? templates.filter((t) => t.category === selectedCategory)
    : templates;

  const handleCreateFromTemplate = async () => {
    const template = templates.find((t) => t.id === selectedTemplate);
    if (template && template.name) {
      setIsCreating(true);
      // Simulate creation delay for better UX
      await new Promise((resolve) => setTimeout(resolve, 800));
      const board = await createBoard(template.name, template.id);
      navigate(`/board/${board.id}`);
      onOpenChange(false);
      setIsCreating(false);
    }
  };

  const previewedTemplate = templates.find((t) => t.id === previewTemplate);

  // Reset selection when dialog opens
  useEffect(() => {
    if (open) {
      setSelectedTemplate(null);
      setPreviewTemplate(null);
      setSelectedCategory(null);
    }
  }, [open]);

  return (
    <Dialog open={open} onOpenChange={onOpenChange}>
      <DialogContent className="max-w-4xl max-h-[90vh] overflow-hidden flex flex-col p-0">
        {/* Header */}
        <div className="px-6 pt-6 pb-4 border-b border-slate-100">
          <DialogHeader>
            <div className="flex items-center gap-3 mb-1">
              <div className="w-10 h-10 rounded-xl bg-slate-900 flex items-center justify-center">
                <Sparkles className="w-5 h-5 text-white" />
              </div>
              <div>
                <DialogTitle className="text-xl">Choose a Template</DialogTitle>
                <DialogDescription>
                  Start with a pre-designed template or create from scratch
                </DialogDescription>
              </div>
            </div>
          </DialogHeader>

          {/* Category Filters */}
          <div className="flex flex-wrap gap-2 mt-4">
            <button
              onClick={() => setSelectedCategory(null)}
              className={cn(
                "px-4 py-2 rounded-lg font-medium text-sm transition-all flex items-center gap-2",
                selectedCategory === null
                  ? "bg-slate-900 text-white shadow-sm"
                  : "bg-white border border-slate-200 text-slate-700 hover:bg-slate-50"
              )}
            >
              <Zap className="w-4 h-4" />
              All Templates
            </button>
            <button
              onClick={() => setSelectedCategory("general")}
              className={cn(
                "px-4 py-2 rounded-lg font-medium text-sm transition-all flex items-center gap-2",
                selectedCategory === "general"
                  ? "bg-slate-100 border border-slate-200 text-slate-900"
                  : "bg-white border border-slate-200 text-slate-700 hover:bg-slate-50"
              )}
            >
              <Sparkles className="w-4 h-4" />
              General
            </button>
            <button
              onClick={() => setSelectedCategory("education")}
              className={cn(
                "px-4 py-2 rounded-lg font-medium text-sm transition-all flex items-center gap-2",
                selectedCategory === "education"
                  ? "bg-slate-100 border border-slate-200 text-slate-900"
                  : "bg-white border border-slate-200 text-slate-700 hover:bg-slate-50"
              )}
            >
              <GraduationCap className="w-4 h-4" />
              Education
            </button>
            <button
              onClick={() => setSelectedCategory("business")}
              className={cn(
                "px-4 py-2 rounded-lg font-medium text-sm transition-all flex items-center gap-2",
                selectedCategory === "business"
                  ? "bg-slate-100 border border-slate-200 text-slate-900"
                  : "bg-white border border-slate-200 text-slate-700 hover:bg-slate-50"
              )}
            >
              <Briefcase className="w-4 h-4" />
              Business
            </button>
            <button
              onClick={() => setSelectedCategory("creative")}
              className={cn(
                "px-4 py-2 rounded-lg font-medium text-sm transition-all flex items-center gap-2",
                selectedCategory === "creative"
                  ? "bg-slate-100 border border-slate-200 text-slate-900"
                  : "bg-white border border-slate-200 text-slate-700 hover:bg-slate-50"
              )}
            >
              <Palette className="w-4 h-4" />
              Creative
            </button>
          </div>
        </div>

        {/* Content */}
        <div className="flex-1 overflow-hidden flex">
          {/* Loading State */}
          {isLoading ? (
            <div className="flex-1 flex items-center justify-center py-16">
              <div className="flex flex-col items-center gap-3">
                <Loader2 className="w-8 h-8 text-slate-400 animate-spin" />
                <p className="text-sm text-slate-500">Loading templates...</p>
              </div>
            </div>
          ) : (
            <>
              {/* Templates Grid */}
              <div
                className={cn(
                  "flex-1 overflow-y-auto p-6 transition-all duration-300",
                  previewTemplate ? "w-1/2" : "w-full"
                )}
              >
                <div
                  className={cn(
                    "grid gap-4 transition-all duration-300",
                    previewTemplate
                      ? "grid-cols-1 lg:grid-cols-2"
                      : "grid-cols-2 md:grid-cols-3"
                  )}
                >
                  {filteredTemplates.map((template, index) => {
                    // Safely get category, fallback to 'general'
                    const category = template.category && ['general', 'education', 'business', 'creative'].includes(template.category) 
                      ? template.category 
                      : 'general';
                    const colors = categoryColors[category as keyof typeof categoryColors];
                    const stats = templateStats[template.id] || {
                      uses: "1K+",
                      rating: 4.5,
                    };

                    return (
                      <div
                        key={template.id}
                        onClick={() => setSelectedTemplate(template.id)}
                        onDoubleClick={() => setPreviewTemplate(template.id)}
                        className={cn(
                          "group relative p-4 rounded-2xl border-2 text-left transition-all duration-300 cursor-pointer",
                          "hover:shadow-lg hover:-translate-y-0.5",
                          "animate-in fade-in-0 slide-in-from-bottom-2",
                          selectedTemplate === template.id
                            ? "border-primary-500 bg-primary-50/50 shadow-lg shadow-primary-500/10"
                            : "border-slate-200 bg-white hover:border-slate-300"
                        )}
                        style={{
                          animationDelay: `${index * 50}ms`,
                          animationFillMode: "both",
                        }}
                      >
                        {/* Icon */}
                        <div className="flex items-start justify-between mb-3">
                          <div
                            className={cn(
                              "w-14 h-14 rounded-xl flex items-center justify-center transition-transform duration-300 group-hover:scale-110",
                              colors.bg,
                              colors.text
                        )}
                      >
                        {templateIcons[template.id] || (
                          <Sparkles className="w-8 h-8" />
                        )}
                      </div>
                      <button
                        onClick={(e) => {
                          e.stopPropagation();
                          setPreviewTemplate(template.id);
                        }}
                        className="p-2 rounded-lg text-slate-400 hover:text-slate-600 hover:bg-slate-100 transition-colors opacity-0 group-hover:opacity-100"
                        title="Preview template"
                      >
                        <Eye className="w-4 h-4" />
                      </button>
                    </div>

                        {/* Info */}
                        <h4 className="font-semibold text-slate-900 mb-1 group-hover:text-primary-600 transition-colors">
                          {template.name || 'Untitled Template'}
                        </h4>
                        <p className="text-sm text-slate-500 line-clamp-2 mb-3">
                          {template.description || 'No description'}
                        </p>

                    {/* Stats */}
                    <div className="flex items-center gap-3 text-xs text-slate-400">
                      <div className="flex items-center gap-1">
                        <Users className="w-3 h-3" />
                        <span>{stats.uses} uses</span>
                      </div>
                      <div className="flex items-center gap-1">
                        <Star className="w-3 h-3 fill-amber-400 text-amber-400" />
                        <span>{stats.rating}</span>
                      </div>
                    </div>

                        {/* Category Badge */}
                        <Badge
                          variant="secondary"
                          className={cn(
                            "absolute top-3 right-3 capitalize text-xs rounded-full opacity-0 group-hover:opacity-100 transition-opacity",
                            colors.bg,
                            colors.text
                          )}
                        >
                          {template.category || 'general'}
                        </Badge>

                        {/* Selected Indicator */}
                        {selectedTemplate === template.id && (
                          <div className="absolute top-3 right-3 w-6 h-6 rounded-full bg-primary-500 flex items-center justify-center shadow-lg">
                            <Check className="w-3.5 h-3.5 text-white" />
                          </div>
                        )}
                      </div>
                    );
                  })}
                </div>
              </div>
            </>
          )}

          {/* Preview Panel */}
          {previewTemplate && previewedTemplate && (
            <div className="w-1/2 border-l border-slate-100 bg-slate-50 p-6 animate-in slide-in-from-right-4 duration-300">
              <div className="flex items-center justify-between mb-4">
                <h3 className="font-semibold text-slate-900">Preview</h3>
                <button
                  onClick={() => setPreviewTemplate(null)}
                  className="p-1.5 rounded-lg text-slate-400 hover:text-slate-600 hover:bg-white transition-colors"
                >
                  <X className="w-4 h-4" />
                </button>
              </div>

              {/* Preview Content */}
              <div className="bg-white rounded-2xl border border-slate-200 overflow-hidden shadow-sm">
                {/* Preview Image */}
                <div className="aspect-video bg-gradient-to-br from-slate-100 to-slate-50 flex items-center justify-center">
                  <div
                    className={cn(
                      "w-20 h-20 rounded-2xl flex items-center justify-center",
                      categoryColors[previewedTemplate?.category || 'general'].bg,
                      categoryColors[previewedTemplate?.category || 'general'].text
                    )}
                  >
                    {templateIcons[previewedTemplate?.id || ''] || (
                      <Sparkles className="w-10 h-10" />
                    )}
                  </div>
                </div>

                {/* Preview Info */}
                <div className="p-4">
                  <div className="flex items-center gap-2 mb-2">
                    <Badge
                      className={cn(
                        "capitalize text-xs rounded-full",
                        categoryColors[previewedTemplate?.category || 'general'].bg,
                        categoryColors[previewedTemplate?.category || 'general'].text
                      )}
                    >
                      {previewedTemplate?.category || 'general'}
                    </Badge>
                    <div className="flex items-center gap-1 text-xs text-slate-400">
                      <Star className="w-3 h-3 fill-amber-400 text-amber-400" />
                      <span>
                        {templateStats[previewedTemplate?.id || '']?.rating || 4.5}
                      </span>
                    </div>
                  </div>
                  <h4 className="font-semibold text-lg text-slate-900 mb-2">
                    {previewedTemplate?.name || 'Untitled Template'}
                  </h4>
                  <p className="text-sm text-slate-600 mb-4">
                    {previewedTemplate?.description || 'No description'}
                  </p>

                  {/* Features list */}
                  <div className="space-y-2 mb-4">
                    {[
                      "Pre-configured layout",
                      "Customizable elements",
                      "AI-ready components",
                    ].map((feature, i) => (
                      <div
                        key={i}
                        className="flex items-center gap-2 text-sm text-slate-600"
                      >
                        <div className="w-4 h-4 rounded-full bg-primary-100 flex items-center justify-center">
                          <Check className="w-2.5 h-2.5 text-primary-600" />
                        </div>
                        {feature}
                      </div>
                    ))}
                  </div>

                  <Button
                    variant="gradient"
                    className="w-full"
                    onClick={() => {
                      setSelectedTemplate(previewedTemplate.id);
                      handleCreateFromTemplate();
                    }}
                  >
                    Use This Template
                    <ArrowRight className="w-4 h-4 ml-2" />
                  </Button>
                </div>
              </div>
            </div>
          )}
        </div>

        {/* Footer */}
        <div className="flex items-center justify-between px-6 py-4 border-t border-slate-100 bg-slate-50/50">
          <div className="text-sm text-slate-500">
            {selectedTemplate ? (
              <span className="flex items-center gap-2">
                <Check className="w-4 h-4 text-primary-500" />
                Template selected
              </span>
            ) : (
              "Double-click to preview"
            )}
          </div>
          <div className="flex items-center gap-3">
            <Button variant="ghost" onClick={() => onOpenChange(false)}>
              Cancel
            </Button>
            <Button
              onClick={handleCreateFromTemplate}
              disabled={!selectedTemplate || isCreating}
              className="min-w-[140px] bg-slate-900 hover:bg-slate-800 text-white"
            >
              {isCreating ? (
                <>
                  <div className="w-4 h-4 border-2 border-white/30 border-t-white rounded-full animate-spin mr-2" />
                  Creating...
                </>
              ) : (
                <>
                  Create Board
                  <ArrowRight className="w-4 h-4 ml-2" />
                </>
              )}
            </Button>
          </div>
        </div>
      </DialogContent>
    </Dialog>
  );
}
