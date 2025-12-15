import { useState, useEffect, useCallback } from 'react';
import { useNavigate } from 'react-router-dom';
import {
    Command,
    CommandDialog,
    CommandEmpty,
    CommandGroup,
    CommandInput,
    CommandItem,
    CommandList,
    CommandSeparator,
} from 'cmdk';
import {
    Search,
    FileText,
    Star,
    Trash2,
    Settings,
    Users,
    Plus,
    Tag,
    ExternalLink,
} from 'lucide-react';
import { useBoards } from '../../contexts/BoardContext';
import { cn } from '../../lib/utils';

interface CommandPaletteProps {
    open: boolean;
    onOpenChange: (open: boolean) => void;
}

export function CommandPalette({ open, onOpenChange }: CommandPaletteProps) {
    const navigate = useNavigate();
    const { boards, tags, createBoard, searchBoards } = useBoards();
    const [search, setSearch] = useState('');

    // Filter boards based on search
    const filteredBoards = search ? searchBoards(search).slice(0, 5) : boards.slice(0, 5);

    // Keyboard shortcut to open
    useEffect(() => {
        const down = (e: KeyboardEvent) => {
            if (e.key === 'k' && (e.metaKey || e.ctrlKey)) {
                e.preventDefault();
                onOpenChange(!open);
            }
        };

        document.addEventListener('keydown', down);
        return () => document.removeEventListener('keydown', down);
    }, [open, onOpenChange]);

    const handleSelect = useCallback(
        (action: string) => {
            onOpenChange(false);
            setSearch('');

            switch (action) {
                case 'new-board':
                    const board = createBoard('Untitled Board');
                    navigate(`/board/${board.id}`);
                    break;
                case 'all-boards':
                    navigate('/dashboard');
                    break;
                case 'favorites':
                    navigate('/dashboard/favorites');
                    break;
                case 'trash':
                    navigate('/dashboard/trash');
                    break;
                case 'settings':
                    navigate('/dashboard/settings');
                    break;
                case 'team':
                    navigate('/dashboard/team');
                    break;
                default:
                    if (action.startsWith('board:')) {
                        const boardId = action.replace('board:', '');
                        navigate(`/board/${boardId}`);
                    } else if (action.startsWith('tag:')) {
                        const tagId = action.replace('tag:', '');
                        navigate(`/dashboard?tag=${tagId}`);
                    }
            }
        },
        [navigate, createBoard, onOpenChange]
    );

    return (
        <CommandDialog open={open} onOpenChange={onOpenChange}>
            <Command className="rounded-lg border shadow-2xl">
                <div className="flex items-center border-b border-slate-200 px-3">
                    <Search className="w-4 h-4 text-slate-400 mr-2" />
                    <CommandInput
                        placeholder="Search boards, actions..."
                        value={search}
                        onValueChange={setSearch}
                        className="flex h-12 w-full rounded-md bg-transparent py-3 text-sm outline-none placeholder:text-slate-500"
                    />
                </div>
                <CommandList className="max-h-[400px] overflow-y-auto p-2">
                    <CommandEmpty className="py-8 text-center text-sm text-slate-500">
                        No results found.
                    </CommandEmpty>

                    {/* Quick Actions */}
                    <CommandGroup heading="Quick Actions">
                        <CommandItem
                            onSelect={() => handleSelect('new-board')}
                            className="flex items-center gap-3 px-3 py-2 rounded-lg cursor-pointer aria-selected:bg-primary-50"
                        >
                            <div className="w-8 h-8 rounded-lg bg-primary-100 flex items-center justify-center">
                                <Plus className="w-4 h-4 text-primary-600" />
                            </div>
                            <div>
                                <p className="font-medium text-slate-900">New Board</p>
                                <p className="text-xs text-slate-500">Create a blank board</p>
                            </div>
                        </CommandItem>
                    </CommandGroup>

                    <CommandSeparator className="my-2" />

                    {/* Recent Boards */}
                    {filteredBoards.length > 0 && (
                        <CommandGroup heading="Boards">
                            {filteredBoards.map((board) => (
                                <CommandItem
                                    key={board.id}
                                    onSelect={() => handleSelect(`board:${board.id}`)}
                                    className="flex items-center gap-3 px-3 py-2 rounded-lg cursor-pointer aria-selected:bg-slate-100"
                                >
                                    <div className="w-8 h-8 rounded-lg bg-slate-100 flex items-center justify-center">
                                        <FileText className="w-4 h-4 text-slate-500" />
                                    </div>
                                    <div className="flex-1 min-w-0">
                                        <p className="font-medium text-slate-900 truncate">{board.title}</p>
                                        {board.tags.length > 0 && (
                                            <div className="flex items-center gap-1 mt-0.5">
                                                {board.tags.slice(0, 2).map((tag) => (
                                                    <span
                                                        key={tag.id}
                                                        className="inline-flex items-center text-xs px-1.5 py-0.5 rounded"
                                                        style={{ backgroundColor: `${tag.color}20`, color: tag.color }}
                                                    >
                                                        {tag.name}
                                                    </span>
                                                ))}
                                            </div>
                                        )}
                                    </div>
                                    <ExternalLink className="w-4 h-4 text-slate-400" />
                                </CommandItem>
                            ))}
                        </CommandGroup>
                    )}

                    <CommandSeparator className="my-2" />

                    {/* Navigation */}
                    <CommandGroup heading="Navigation">
                        <CommandItem
                            onSelect={() => handleSelect('all-boards')}
                            className="flex items-center gap-3 px-3 py-2 rounded-lg cursor-pointer aria-selected:bg-slate-100"
                        >
                            <FileText className="w-4 h-4 text-slate-500" />
                            <span>All Boards</span>
                        </CommandItem>
                        <CommandItem
                            onSelect={() => handleSelect('favorites')}
                            className="flex items-center gap-3 px-3 py-2 rounded-lg cursor-pointer aria-selected:bg-slate-100"
                        >
                            <Star className="w-4 h-4 text-slate-500" />
                            <span>Favorites</span>
                        </CommandItem>
                        <CommandItem
                            onSelect={() => handleSelect('trash')}
                            className="flex items-center gap-3 px-3 py-2 rounded-lg cursor-pointer aria-selected:bg-slate-100"
                        >
                            <Trash2 className="w-4 h-4 text-slate-500" />
                            <span>Trash</span>
                        </CommandItem>
                        <CommandItem
                            onSelect={() => handleSelect('team')}
                            className="flex items-center gap-3 px-3 py-2 rounded-lg cursor-pointer aria-selected:bg-slate-100"
                        >
                            <Users className="w-4 h-4 text-slate-500" />
                            <span>Team</span>
                        </CommandItem>
                        <CommandItem
                            onSelect={() => handleSelect('settings')}
                            className="flex items-center gap-3 px-3 py-2 rounded-lg cursor-pointer aria-selected:bg-slate-100"
                        >
                            <Settings className="w-4 h-4 text-slate-500" />
                            <span>Settings</span>
                        </CommandItem>
                    </CommandGroup>

                    {/* Tags */}
                    {tags.length > 0 && (
                        <>
                            <CommandSeparator className="my-2" />
                            <CommandGroup heading="Tags">
                                {tags.slice(0, 5).map((tag) => (
                                    <CommandItem
                                        key={tag.id}
                                        onSelect={() => handleSelect(`tag:${tag.id}`)}
                                        className="flex items-center gap-3 px-3 py-2 rounded-lg cursor-pointer aria-selected:bg-slate-100"
                                    >
                                        <div
                                            className="w-3 h-3 rounded-full"
                                            style={{ backgroundColor: tag.color }}
                                        />
                                        <span>{tag.name}</span>
                                    </CommandItem>
                                ))}
                            </CommandGroup>
                        </>
                    )}
                </CommandList>

                {/* Footer */}
                <div className="flex items-center justify-between px-3 py-2 border-t border-slate-200 text-xs text-slate-500">
                    <div className="flex items-center gap-4">
                        <span className="flex items-center gap-1">
                            <kbd className="px-1.5 py-0.5 rounded bg-slate-100 font-mono">↑↓</kbd>
                            navigate
                        </span>
                        <span className="flex items-center gap-1">
                            <kbd className="px-1.5 py-0.5 rounded bg-slate-100 font-mono">↵</kbd>
                            select
                        </span>
                        <span className="flex items-center gap-1">
                            <kbd className="px-1.5 py-0.5 rounded bg-slate-100 font-mono">esc</kbd>
                            close
                        </span>
                    </div>
                </div>
            </Command>
        </CommandDialog>
    );
}
