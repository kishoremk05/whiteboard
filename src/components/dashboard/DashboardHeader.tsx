import { useNavigate } from 'react-router-dom';
import { Menu, Search, Bell, Plus } from 'lucide-react';
import { Button } from '../ui/button';
import { Avatar, AvatarFallback, AvatarImage } from '../ui/avatar';
import {
    DropdownMenu,
    DropdownMenuContent,
    DropdownMenuItem,
    DropdownMenuLabel,
    DropdownMenuSeparator,
    DropdownMenuTrigger,
} from '../ui/dropdown-menu';
import { useAuth } from '../../contexts/AuthContext';
import { useBoards } from '../../contexts/BoardContext';
import { getInitials } from '../../lib/utils';

interface DashboardHeaderProps {
    onMenuClick: () => void;
    onSearchClick: () => void;
}

export function DashboardHeader({ onMenuClick, onSearchClick }: DashboardHeaderProps) {
    const navigate = useNavigate();
    const { user, logout } = useAuth();
    const { createBoard } = useBoards();

    const handleNewBoard = () => {
        const board = createBoard('Untitled Board');
        navigate(`/board/${board.id}`);
    };

    const handleLogout = async () => {
        await logout();
        navigate('/');
    };

    return (
        <header className="sticky top-0 z-40 bg-white/80 backdrop-blur-lg border-b border-slate-200">
            <div className="flex items-center justify-between h-16 px-4 md:px-6">
                {/* Left Section */}
                <div className="flex items-center gap-4">
                    <button
                        onClick={onMenuClick}
                        className="p-2 rounded-lg hover:bg-slate-100 transition-colors lg:hidden"
                    >
                        <Menu className="w-5 h-5 text-slate-600" />
                    </button>

                    {/* Search Button */}
                    <button
                        onClick={onSearchClick}
                        className="hidden sm:flex items-center gap-3 px-4 py-2 rounded-lg bg-slate-100 hover:bg-slate-200 transition-colors text-slate-500 w-64"
                    >
                        <Search className="w-4 h-4" />
                        <span className="text-sm">Search boards...</span>
                        <kbd className="ml-auto text-xs bg-white px-1.5 py-0.5 rounded border border-slate-200">
                            ⌘K
                        </kbd>
                    </button>
                    <button
                        onClick={onSearchClick}
                        className="sm:hidden p-2 rounded-lg hover:bg-slate-100 transition-colors"
                    >
                        <Search className="w-5 h-5 text-slate-600" />
                    </button>
                </div>

                {/* Right Section */}
                <div className="flex items-center gap-3">
                    {/* New Board Button */}
                    <Button
                        onClick={handleNewBoard}
                        size="sm"
                        variant="gradient"
                        className="hidden sm:flex"
                    >
                        <Plus className="w-4 h-4" />
                        New Board
                    </Button>
                    <Button
                        onClick={handleNewBoard}
                        size="icon"
                        variant="gradient"
                        className="sm:hidden"
                    >
                        <Plus className="w-4 h-4" />
                    </Button>

                    {/* Notifications */}
                    <button className="relative p-2 rounded-lg hover:bg-slate-100 transition-colors">
                        <Bell className="w-5 h-5 text-slate-600" />
                        <span className="absolute top-1.5 right-1.5 w-2 h-2 bg-primary-500 rounded-full" />
                    </button>

                    {/* User Menu */}
                    <DropdownMenu>
                        <DropdownMenuTrigger asChild>
                            <button className="flex items-center gap-2 p-1 rounded-lg hover:bg-slate-100 transition-colors">
                                <Avatar className="w-8 h-8">
                                    <AvatarImage src={user?.avatar} alt={user?.name} />
                                    <AvatarFallback>
                                        {user?.name ? getInitials(user.name) : 'U'}
                                    </AvatarFallback>
                                </Avatar>
                            </button>
                        </DropdownMenuTrigger>
                        <DropdownMenuContent align="end" className="w-56">
                            <DropdownMenuLabel>
                                <div className="flex flex-col">
                                    <span className="font-medium">{user?.name}</span>
                                    <span className="text-xs text-slate-500">{user?.email}</span>
                                </div>
                            </DropdownMenuLabel>
                            <DropdownMenuSeparator />
                            <DropdownMenuItem onClick={() => navigate('/dashboard/settings')}>
                                Settings
                            </DropdownMenuItem>
                            <DropdownMenuItem onClick={() => navigate('/dashboard/team')}>
                                Team
                            </DropdownMenuItem>
                            <DropdownMenuSeparator />
                            <DropdownMenuItem onClick={handleLogout} className="text-red-600">
                                Log out
                            </DropdownMenuItem>
                        </DropdownMenuContent>
                    </DropdownMenu>
                </div>
            </div>
        </header>
    );
}
