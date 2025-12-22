import type { ReactNode } from 'react';
import { FolderOpen } from 'lucide-react';
import { cn } from '../../lib/utils';

interface EmptyStateProps {
    icon?: ReactNode;
    iconBgColor?: string;
    iconColor?: string;
    title: string;
    description: string;
    action?: ReactNode;
    secondaryAction?: ReactNode;
    className?: string;
}

export function EmptyState({ 
    icon, 
    iconBgColor = 'bg-slate-100',
    iconColor = 'text-slate-400',
    title, 
    description, 
    action,
    secondaryAction,
    className,
}: EmptyStateProps) {
    return (
        <div className={cn(
            "flex flex-col items-center justify-center py-16 px-4 text-center animate-in fade-in-0 slide-in-from-bottom-4 duration-500",
            className
        )}>
            <div className={cn(
                "w-20 h-20 rounded-2xl flex items-center justify-center mb-6 shadow-lg",
                iconBgColor
            )}>
                <div className={iconColor}>
                    {icon || <FolderOpen className="w-10 h-10" />}
                </div>
            </div>
            <h3 className="text-xl font-semibold text-slate-900 mb-2">{title}</h3>
            <p className="text-slate-500 max-w-sm mb-6 leading-relaxed">{description}</p>
            {(action || secondaryAction) && (
                <div className="flex items-center gap-3">
                    {secondaryAction}
                    {action}
                </div>
            )}
        </div>
    );
}

