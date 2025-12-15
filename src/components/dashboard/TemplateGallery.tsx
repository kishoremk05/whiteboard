import { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { Sparkles, GraduationCap, Briefcase, Lightbulb, Palette, FileText, Presentation, LayoutGrid } from 'lucide-react';
import {
    Dialog,
    DialogContent,
    DialogDescription,
    DialogHeader,
    DialogTitle,
} from '../ui/dialog';
import { Button } from '../ui/button';
import { Badge } from '../ui/badge';
import { mockTemplates } from '../../data/mockData';
import { useBoards } from '../../contexts/BoardContext';
import { cn } from '../../lib/utils';

interface TemplateGalleryProps {
    open: boolean;
    onOpenChange: (open: boolean) => void;
}

const categoryIcons: Record<string, React.ReactNode> = {
    general: <Sparkles className="w-4 h-4" />,
    education: <GraduationCap className="w-4 h-4" />,
    business: <Briefcase className="w-4 h-4" />,
    creative: <Palette className="w-4 h-4" />,
};

const templateIcons: Record<string, React.ReactNode> = {
    'template-blank': <LayoutGrid className="w-8 h-8" />,
    'template-math': <span className="text-2xl">∑</span>,
    'template-physics': <span className="text-2xl">⚛</span>,
    'template-brainstorm': <Lightbulb className="w-8 h-8" />,
    'template-teaching': <Presentation className="w-8 h-8" />,
    'template-meeting': <FileText className="w-8 h-8" />,
    'template-wireframe': <LayoutGrid className="w-8 h-8" />,
    'template-kanban': <LayoutGrid className="w-8 h-8" />,
};

const categoryColors: Record<string, string> = {
    general: 'bg-slate-100 text-slate-600',
    education: 'bg-blue-100 text-blue-600',
    business: 'bg-emerald-100 text-emerald-600',
    creative: 'bg-rose-100 text-rose-600',
};

export function TemplateGallery({ open, onOpenChange }: TemplateGalleryProps) {
    const navigate = useNavigate();
    const { createBoard } = useBoards();
    const [selectedCategory, setSelectedCategory] = useState<string | null>(null);
    const [selectedTemplate, setSelectedTemplate] = useState<string | null>(null);

    const filteredTemplates = selectedCategory
        ? mockTemplates.filter((t) => t.category === selectedCategory)
        : mockTemplates;

    const handleCreateFromTemplate = () => {
        const template = mockTemplates.find((t) => t.id === selectedTemplate);
        if (template) {
            const board = createBoard(template.name, template.id);
            navigate(`/board/${board.id}`);
            onOpenChange(false);
        }
    };

    const categories = ['general', 'education', 'business', 'creative'];

    return (
        <Dialog open={open} onOpenChange={onOpenChange}>
            <DialogContent className="max-w-3xl max-h-[85vh] overflow-hidden flex flex-col">
                <DialogHeader>
                    <DialogTitle className="text-xl">Choose a Template</DialogTitle>
                    <DialogDescription>
                        Start with a pre-designed template or create from scratch
                    </DialogDescription>
                </DialogHeader>

                {/* Category Filters */}
                <div className="flex flex-wrap gap-2 py-4">
                    <Button
                        variant={selectedCategory === null ? 'default' : 'outline'}
                        size="sm"
                        onClick={() => setSelectedCategory(null)}
                    >
                        All
                    </Button>
                    {categories.map((category) => (
                        <Button
                            key={category}
                            variant={selectedCategory === category ? 'default' : 'outline'}
                            size="sm"
                            onClick={() => setSelectedCategory(category)}
                            className="gap-2 capitalize"
                        >
                            {categoryIcons[category]}
                            {category}
                        </Button>
                    ))}
                </div>

                {/* Templates Grid */}
                <div className="flex-1 overflow-y-auto py-2">
                    <div className="grid grid-cols-2 md:grid-cols-3 gap-4">
                        {filteredTemplates.map((template) => (
                            <button
                                key={template.id}
                                onClick={() => setSelectedTemplate(template.id)}
                                className={cn(
                                    'relative p-4 rounded-xl border-2 text-left transition-all hover:shadow-md',
                                    selectedTemplate === template.id
                                        ? 'border-primary-500 bg-primary-50 shadow-md'
                                        : 'border-slate-200 bg-white hover:border-slate-300'
                                )}
                            >
                                {/* Icon */}
                                <div
                                    className={cn(
                                        'w-14 h-14 rounded-xl flex items-center justify-center mb-3',
                                        categoryColors[template.category]
                                    )}
                                >
                                    {templateIcons[template.id] || <Sparkles className="w-8 h-8" />}
                                </div>

                                {/* Info */}
                                <h4 className="font-semibold text-slate-900 mb-1">{template.name}</h4>
                                <p className="text-sm text-slate-500 line-clamp-2">
                                    {template.description}
                                </p>

                                {/* Category Badge */}
                                <Badge
                                    variant="secondary"
                                    className="absolute top-3 right-3 capitalize text-xs"
                                >
                                    {template.category}
                                </Badge>

                                {/* Selected Indicator */}
                                {selectedTemplate === template.id && (
                                    <div className="absolute inset-0 rounded-xl ring-2 ring-primary-500 ring-offset-2" />
                                )}
                            </button>
                        ))}
                    </div>
                </div>

                {/* Footer */}
                <div className="flex items-center justify-between pt-4 border-t border-slate-100">
                    <Button variant="ghost" onClick={() => onOpenChange(false)}>
                        Cancel
                    </Button>
                    <Button
                        variant="gradient"
                        onClick={handleCreateFromTemplate}
                        disabled={!selectedTemplate}
                    >
                        Create Board
                    </Button>
                </div>
            </DialogContent>
        </Dialog>
    );
}
