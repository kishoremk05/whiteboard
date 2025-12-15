import { useState, useEffect, useCallback, useRef } from 'react';
import { LayoutGrid, List, SortAsc } from 'lucide-react';
import type { Board } from '../../types';
import { BoardCard } from './BoardCard';
import { BoardCardSkeleton } from './BoardCardSkeleton';
import { EmptyState } from '../shared/EmptyState';
import { Button } from '../ui/button';
import {
    DropdownMenu,
    DropdownMenuContent,
    DropdownMenuItem,
    DropdownMenuTrigger,
} from '../ui/dropdown-menu';
import { cn } from '../../lib/utils';

interface BoardListProps {
    boards: Board[];
    isLoading?: boolean;
    emptyTitle?: string;
    emptyDescription?: string;
    emptyIcon?: React.ReactNode;
    onCreateBoard?: () => void;
}

type SortOption = 'updated' | 'created' | 'name';
type ViewMode = 'grid' | 'list';

const ITEMS_PER_PAGE = 20;

export function BoardList({
    boards,
    isLoading,
    emptyTitle = 'No boards yet',
    emptyDescription = 'Create your first board to get started.',
    emptyIcon,
    onCreateBoard,
}: BoardListProps) {
    const [viewMode, setViewMode] = useState<ViewMode>('grid');
    const [sortBy, setSortBy] = useState<SortOption>('updated');
    const [displayedBoards, setDisplayedBoards] = useState<Board[]>([]);
    const [page, setPage] = useState(1);
    const [hasMore, setHasMore] = useState(true);
    const loaderRef = useRef<HTMLDivElement>(null);

    // Sort boards
    const sortedBoards = [...boards].sort((a, b) => {
        switch (sortBy) {
            case 'updated':
                return new Date(b.updatedAt).getTime() - new Date(a.updatedAt).getTime();
            case 'created':
                return new Date(b.createdAt).getTime() - new Date(a.createdAt).getTime();
            case 'name':
                return a.title.localeCompare(b.title);
            default:
                return 0;
        }
    });

    // Initialize displayed boards
    useEffect(() => {
        setDisplayedBoards(sortedBoards.slice(0, ITEMS_PER_PAGE));
        setPage(1);
        setHasMore(sortedBoards.length > ITEMS_PER_PAGE);
    }, [boards, sortBy]);

    // Load more boards
    const loadMore = useCallback(() => {
        if (!hasMore) return;

        const nextPage = page + 1;
        const startIndex = nextPage * ITEMS_PER_PAGE;
        const endIndex = startIndex + ITEMS_PER_PAGE;
        const newBoards = sortedBoards.slice(0, endIndex);

        setDisplayedBoards(newBoards);
        setPage(nextPage);
        setHasMore(endIndex < sortedBoards.length);
    }, [page, hasMore, sortedBoards]);

    // Intersection Observer for infinite scroll
    useEffect(() => {
        const observer = new IntersectionObserver(
            (entries) => {
                if (entries[0].isIntersecting && hasMore && !isLoading) {
                    loadMore();
                }
            },
            { threshold: 0.1 }
        );

        if (loaderRef.current) {
            observer.observe(loaderRef.current);
        }

        return () => observer.disconnect();
    }, [loadMore, hasMore, isLoading]);

    if (isLoading) {
        return (
            <div className="space-y-6">
                <div className="flex items-center justify-between">
                    <div className="h-8 w-32 bg-slate-200 rounded-lg animate-pulse" />
                    <div className="h-8 w-24 bg-slate-200 rounded-lg animate-pulse" />
                </div>
                <div className={cn(
                    viewMode === 'grid'
                        ? 'grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-4'
                        : 'space-y-3'
                )}>
                    {Array.from({ length: 8 }).map((_, i) => (
                        <BoardCardSkeleton key={i} viewMode={viewMode} />
                    ))}
                </div>
            </div>
        );
    }

    if (boards.length === 0) {
        return (
            <EmptyState
                icon={emptyIcon}
                title={emptyTitle}
                description={emptyDescription}
                action={onCreateBoard && (
                    <Button onClick={onCreateBoard} variant="gradient">
                        Create Board
                    </Button>
                )}
            />
        );
    }

    return (
        <div className="space-y-6">
            {/* Header */}
            <div className="flex items-center justify-between">
                <p className="text-sm text-slate-500">
                    {boards.length} {boards.length === 1 ? 'board' : 'boards'}
                </p>
                <div className="flex items-center gap-2">
                    {/* Sort Dropdown */}
                    <DropdownMenu>
                        <DropdownMenuTrigger asChild>
                            <Button variant="outline" size="sm" className="gap-2">
                                <SortAsc className="w-4 h-4" />
                                Sort
                            </Button>
                        </DropdownMenuTrigger>
                        <DropdownMenuContent align="end">
                            <DropdownMenuItem onClick={() => setSortBy('updated')}>
                                Last modified
                            </DropdownMenuItem>
                            <DropdownMenuItem onClick={() => setSortBy('created')}>
                                Date created
                            </DropdownMenuItem>
                            <DropdownMenuItem onClick={() => setSortBy('name')}>
                                Name
                            </DropdownMenuItem>
                        </DropdownMenuContent>
                    </DropdownMenu>

                    {/* View Mode Toggle */}
                    <div className="flex items-center rounded-lg border border-slate-200 p-1">
                        <button
                            onClick={() => setViewMode('grid')}
                            className={cn(
                                'p-1.5 rounded-md transition-colors',
                                viewMode === 'grid'
                                    ? 'bg-slate-100 text-slate-900'
                                    : 'text-slate-400 hover:text-slate-600'
                            )}
                        >
                            <LayoutGrid className="w-4 h-4" />
                        </button>
                        <button
                            onClick={() => setViewMode('list')}
                            className={cn(
                                'p-1.5 rounded-md transition-colors',
                                viewMode === 'list'
                                    ? 'bg-slate-100 text-slate-900'
                                    : 'text-slate-400 hover:text-slate-600'
                            )}
                        >
                            <List className="w-4 h-4" />
                        </button>
                    </div>
                </div>
            </div>

            {/* Board Grid/List */}
            <div
                className={cn(
                    viewMode === 'grid'
                        ? 'grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-4'
                        : 'space-y-3'
                )}
            >
                {displayedBoards.map((board) => (
                    <BoardCard key={board.id} board={board} viewMode={viewMode} />
                ))}
            </div>

            {/* Infinite Scroll Loader */}
            {hasMore && (
                <div
                    ref={loaderRef}
                    className="flex items-center justify-center py-8"
                >
                    <div className="flex items-center gap-2 text-slate-500">
                        <div className="w-5 h-5 border-2 border-slate-300 border-t-primary-500 rounded-full animate-spin" />
                        <span className="text-sm">Loading more boards...</span>
                    </div>
                </div>
            )}
        </div>
    );
}
