import { Skeleton } from '../ui/skeleton';
import { cn } from '../../lib/utils';

interface BoardCardSkeletonProps {
    viewMode?: 'grid' | 'list';
}

export function BoardCardSkeleton({ viewMode = 'grid' }: BoardCardSkeletonProps) {
    if (viewMode === 'list') {
        return (
            <div className="flex items-center gap-4 p-4 bg-white rounded-xl border border-slate-200">
                <Skeleton className="w-16 h-12 rounded-lg flex-shrink-0" />
                <div className="flex-1 space-y-2">
                    <Skeleton className="h-4 w-3/4" />
                    <Skeleton className="h-3 w-1/2" />
                </div>
                <div className="hidden md:flex items-center gap-2">
                    <Skeleton className="h-5 w-16 rounded-full" />
                    <Skeleton className="h-5 w-16 rounded-full" />
                </div>
                <Skeleton className="w-8 h-8 rounded-lg" />
            </div>
        );
    }

    return (
        <div className="bg-white rounded-xl border border-slate-200 overflow-hidden">
            <Skeleton className="aspect-[4/3]" />
            <div className="p-4 space-y-2">
                <Skeleton className="h-5 w-3/4" />
                <Skeleton className="h-4 w-1/2" />
            </div>
        </div>
    );
}
