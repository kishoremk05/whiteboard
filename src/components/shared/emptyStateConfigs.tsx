import type { ReactNode } from 'react';
import { FolderOpen, Star, Trash2, Search, Plus, FileText, Sparkles } from 'lucide-react';

interface EmptyStateConfig {
    icon: ReactNode;
    iconBgColor: string;
    iconColor: string;
    title: string;
    description: string;
    actionLabel?: string;
}

export const emptyStateConfigs: Record<string, EmptyStateConfig> = {
    noBoards: {
        icon: <FileText className="w-10 h-10" />,
        iconBgColor: 'bg-gradient-to-br from-primary-100 to-accent-100',
        iconColor: 'text-primary-500',
        title: 'No boards yet',
        description: 'Ready to bring your ideas to life? Create your first board or start from a template.',
        actionLabel: 'Create Your First Board',
    },
    noFavorites: {
        icon: <Star className="w-10 h-10" />,
        iconBgColor: 'bg-gradient-to-br from-amber-50 to-orange-100',
        iconColor: 'text-amber-500',
        title: 'No favorites yet',
        description: 'Star your important boards to find them quickly here. Click the star icon on any board to add it to favorites.',
    },
    emptyTrash: {
        icon: <Trash2 className="w-10 h-10" />,
        iconBgColor: 'bg-gradient-to-br from-slate-100 to-slate-200',
        iconColor: 'text-slate-400',
        title: 'Trash is empty',
        description: 'Deleted boards will appear here. You can restore them within 30 days or permanently delete them.',
    },
    noSearchResults: {
        icon: <Search className="w-10 h-10" />,
        iconBgColor: 'bg-gradient-to-br from-blue-50 to-indigo-100',
        iconColor: 'text-blue-500',
        title: 'No results found',
        description: 'Try adjusting your search terms or filters to find what you\'re looking for.',
    },
    emptyFolder: {
        icon: <FolderOpen className="w-10 h-10" />,
        iconBgColor: 'bg-gradient-to-br from-slate-100 to-slate-200',
        iconColor: 'text-slate-400',
        title: 'This folder is empty',
        description: 'Add boards to this folder to organize your work.',
        actionLabel: 'Add Board',
    },
    noTaggedBoards: {
        icon: <Sparkles className="w-10 h-10" />,
        iconBgColor: 'bg-gradient-to-br from-purple-50 to-violet-100',
        iconColor: 'text-purple-500',
        title: 'No boards with this tag',
        description: 'Create a new board and add this tag to it, or add the tag to existing boards.',
        actionLabel: 'Create Board',
    },
    newUser: {
        icon: <Plus className="w-10 h-10" />,
        iconBgColor: 'bg-gradient-to-br from-emerald-50 to-teal-100',
        iconColor: 'text-emerald-500',
        title: 'Welcome to your workspace',
        description: 'Get started by creating your first board or exploring templates.',
        actionLabel: 'Create Board',
    },
};
