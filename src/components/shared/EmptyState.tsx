import type { ReactNode } from 'react';
import { FolderOpen } from 'lucide-react';

interface EmptyStateProps {
    icon?: ReactNode;
    title: string;
    description: string;
    action?: ReactNode;
}

export function EmptyState({ icon, title, description, action }: EmptyStateProps) {
    return (
        <div className="flex flex-col items-center justify-center py-16 px-4 text-center">
            <div className="w-20 h-20 rounded-2xl bg-slate-100 flex items-center justify-center mb-6">
                {icon || <FolderOpen className="w-10 h-10 text-slate-400" />}
            </div>
            <h3 className="text-lg font-semibold text-slate-900 mb-2">{title}</h3>
            <p className="text-slate-500 max-w-sm mb-6">{description}</p>
            {action}
        </div>
    );
}
