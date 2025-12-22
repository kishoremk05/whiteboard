import { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { MoreHorizontal, Star, Trash2, Copy, Edit3, ExternalLink } from 'lucide-react';
import type { Board } from '../../types';
import { Badge } from '../ui/badge';
import {
    DropdownMenu,
    DropdownMenuContent,
    DropdownMenuItem,
    DropdownMenuSeparator,
    DropdownMenuTrigger,
} from '../ui/dropdown-menu';
import { useBoards } from '../../contexts/BoardContext';
import { formatRelativeTime, cn } from '../../lib/utils';

interface BoardCardProps {
    board: Board;
    viewMode?: 'grid' | 'list';
}

export function BoardCard({ board, viewMode = 'grid' }: BoardCardProps) {
    const navigate = useNavigate();
    const { toggleFavorite, deleteBoard, duplicateBoard } = useBoards();
    const [isHovered, setIsHovered] = useState(false);

    const handleClick = () => {
        navigate(`/board/${board.id}`);
    };

    const handleFavorite = (e: React.MouseEvent) => {
        e.stopPropagation();
        toggleFavorite(board.id);
    };

    const handleDelete = (e: React.MouseEvent) => {
        e.stopPropagation();
        deleteBoard(board.id);
    };

    const handleDuplicate = (e: React.MouseEvent) => {
        e.stopPropagation();
        duplicateBoard(board.id);
    };

    if (viewMode === 'list') {
        return (
            <div
                onClick={handleClick}
                onMouseEnter={() => setIsHovered(true)}
                onMouseLeave={() => setIsHovered(false)}
                className="flex items-center gap-4 p-4 bg-white rounded-xl border border-slate-200 hover:border-slate-300 hover:shadow-md transition-all cursor-pointer"
            >
                {/* Thumbnail */}
                <div className="w-16 h-12 rounded-lg bg-slate-100 overflow-hidden flex-shrink-0">
                    {board.thumbnail ? (
                        <img
                            src={board.thumbnail}
                            alt={board.title}
                            className="w-full h-full object-cover"
                        />
                    ) : (
                        <div className="w-full h-full flex items-center justify-center">
                            <Edit3 className="w-5 h-5 text-slate-400" />
                        </div>
                    )}
                </div>

                {/* Info */}
                <div className="flex-1 min-w-0">
                    <h3 className="font-medium text-slate-900 truncate">{board.title}</h3>
                    <p className="text-sm text-slate-500">
                        Edited {formatRelativeTime(board.updatedAt)}
                    </p>
                </div>

                {/* Tags */}
                <div className="hidden md:flex items-center gap-1">
                    {board.tags?.slice(0, 2).map((tag) => (
                        <Badge
                            key={tag.id}
                            variant="secondary"
                            className="text-xs"
                            style={{ backgroundColor: `${tag.color}20`, color: tag.color }}
                        >
                            {tag.name}
                        </Badge>
                    ))}
                </div>

                {/* Actions */}
                <div className="flex items-center gap-1">
                    <button
                        onClick={handleFavorite}
                        className={cn(
                            'p-2 rounded-lg transition-colors',
                            board.isFavorite
                                ? 'text-amber-500'
                                : 'text-slate-400 hover:text-amber-500 hover:bg-slate-100'
                        )}
                    >
                        <Star className={cn('w-4 h-4', board.isFavorite && 'fill-current')} />
                    </button>
                    <DropdownMenu>
                        <DropdownMenuTrigger asChild>
                            <button
                                onClick={(e) => e.stopPropagation()}
                                className="p-2 rounded-lg text-slate-400 hover:text-slate-600 hover:bg-slate-100 transition-colors"
                            >
                                <MoreHorizontal className="w-4 h-4" />
                            </button>
                        </DropdownMenuTrigger>
                        <DropdownMenuContent align="end">
                            <DropdownMenuItem onClick={() => navigate(`/board/${board.id}`)}>
                                <ExternalLink className="w-4 h-4 mr-2" />
                                Open
                            </DropdownMenuItem>
                            <DropdownMenuItem onClick={handleDuplicate}>
                                <Copy className="w-4 h-4 mr-2" />
                                Duplicate
                            </DropdownMenuItem>
                            <DropdownMenuSeparator />
                            <DropdownMenuItem onClick={handleDelete} className="text-red-600">
                                <Trash2 className="w-4 h-4 mr-2" />
                                Delete
                            </DropdownMenuItem>
                        </DropdownMenuContent>
                    </DropdownMenu>
                </div>
            </div>
        );
    }

    return (
        <div
            onClick={handleClick}
            onMouseEnter={() => setIsHovered(true)}
            onMouseLeave={() => setIsHovered(false)}
            className="group bg-white rounded-xl border border-slate-200 overflow-hidden hover:border-slate-300 hover:shadow-lg transition-all cursor-pointer board-card"
        >
            {/* Thumbnail */}
            <div className="relative aspect-[4/3] bg-slate-100 overflow-hidden">
                {board.thumbnail ? (
                    <img
                        src={board.thumbnail}
                        alt={board.title}
                        className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-300"
                    />
                ) : (
                    <div className="w-full h-full flex items-center justify-center">
                        <div className="text-center">
                            <Edit3 className="w-10 h-10 text-slate-300 mx-auto mb-2" />
                            <span className="text-sm text-slate-400">Empty board</span>
                        </div>
                    </div>
                )}

                {/* Hover Overlay */}
                <div
                    className={cn(
                        'absolute inset-0 bg-gradient-to-t from-black/60 via-transparent to-transparent transition-opacity',
                        isHovered ? 'opacity-100' : 'opacity-0'
                    )}
                />

                {/* Top Actions */}
                <div className="absolute top-2 right-2 flex items-center gap-1">
                    <button
                        onClick={handleFavorite}
                        className={cn(
                            'p-2 rounded-lg backdrop-blur-sm transition-all',
                            board.isFavorite
                                ? 'bg-amber-500 text-white'
                                : 'bg-white/80 text-slate-600 hover:bg-white opacity-0 group-hover:opacity-100'
                        )}
                    >
                        <Star className={cn('w-4 h-4', board.isFavorite && 'fill-current')} />
                    </button>
                    <DropdownMenu>
                        <DropdownMenuTrigger asChild>
                            <button
                                onClick={(e) => e.stopPropagation()}
                                className="p-2 rounded-lg bg-white/80 text-slate-600 hover:bg-white backdrop-blur-sm transition-all opacity-0 group-hover:opacity-100"
                            >
                                <MoreHorizontal className="w-4 h-4" />
                            </button>
                        </DropdownMenuTrigger>
                        <DropdownMenuContent align="end">
                            <DropdownMenuItem onClick={() => navigate(`/board/${board.id}`)}>
                                <ExternalLink className="w-4 h-4 mr-2" />
                                Open
                            </DropdownMenuItem>
                            <DropdownMenuItem onClick={handleDuplicate}>
                                <Copy className="w-4 h-4 mr-2" />
                                Duplicate
                            </DropdownMenuItem>
                            <DropdownMenuSeparator />
                            <DropdownMenuItem onClick={handleDelete} className="text-red-600">
                                <Trash2 className="w-4 h-4 mr-2" />
                                Delete
                            </DropdownMenuItem>
                        </DropdownMenuContent>
                    </DropdownMenu>
                </div>

                {/* Tags on Thumbnail */}
                {board.tags && board.tags.length > 0 && (
                    <div className="absolute bottom-2 left-2 flex items-center gap-1">
                        {board.tags.slice(0, 2).map((tag) => (
                            <Badge
                                key={tag.id}
                                className="text-xs backdrop-blur-sm"
                                style={{ backgroundColor: tag.color, color: 'white' }}
                            >
                                {tag.name}
                            </Badge>
                        ))}
                    </div>
                )}
            </div>

            {/* Info */}
            <div className="p-4">
                <h3 className="font-medium text-slate-900 truncate mb-1">{board.title}</h3>
                <p className="text-sm text-slate-500">
                    Edited {formatRelativeTime(board.updatedAt)}
                </p>
            </div>
        </div>
    );
}
