import { Link, useLocation, useNavigate } from 'react-router-dom';
import {
    LayoutGrid,
    Zap,
    Settings,
    ChevronDown,
    Palette,
} from 'lucide-react';
import { Avatar, AvatarFallback, AvatarImage } from '../ui/avatar';
import { Button } from '../ui/button';
import {
    DropdownMenu,
    DropdownMenuContent,
    DropdownMenuItem,
    DropdownMenuSeparator,
    DropdownMenuTrigger,
} from '../ui/dropdown-menu';

import { cn, getInitials } from '../../lib/utils';
import { useBoards } from '../../contexts/BoardContext';
import { useAuth } from '../../contexts/AuthContext';

interface SidebarProps {
    isOpen: boolean;
    onClose: () => void;
}

export function Sidebar({ isOpen, onClose }: SidebarProps) {
    const location = useLocation();
    const navigate = useNavigate();
    const { boards, createBoard } = useBoards();
    const { user, logout } = useAuth();

    // Get recent boards (last 2)
    const recentBoards = [...boards]
        .filter(b => !b.isDeleted)
        .sort((a, b) => new Date(b.updatedAt).getTime() - new Date(a.updatedAt).getTime())
        .slice(0, 2);

    const handleNewBoard = async () => {
        const board = await createBoard('Untitled Board');
        navigate(`/board/${board.id}`);
    };

    const handleLogout = async () => {
        await logout();
        navigate('/');
    };

    return (
        <>
            {/* Overlay for mobile */}
            {isOpen && (
                <div
                    className="fixed inset-0 bg-black/50 z-40 lg:hidden"
                    onClick={onClose}
                />
            )}

            {/* Sidebar */}
            <aside
                className={cn(
                    'fixed top-0 left-0 z-50 h-full w-64 bg-white border-r border-slate-200 transition-transform duration-300',
                    isOpen ? 'translate-x-0' : '-translate-x-full lg:translate-x-0'
                )}
            >
                <div className="flex flex-col h-full">
                    {/* User Profile Section */}
                    <div className="p-4">
                        <div className="flex items-center gap-3 mb-1">
                            <Avatar className="w-10 h-10 ring-2 ring-slate-100">
                                <AvatarImage src={user?.avatar} alt={user?.name} />
                                <AvatarFallback className="bg-gray-900 text-white font-semibold">
                                    {user?.name ? getInitials(user.name) : 'U'}
                                </AvatarFallback>
                            </Avatar>
                            <div className="flex-1 min-w-0">
                                <h2 className="text-sm font-semibold text-slate-900">
                                    Hey, {user?.name?.split(' ')[0] || 'User'}
                                </h2>
                                <p className="text-xs text-slate-500">Ready to whiteboard?</p>
                            </div>
                        </div>
                    </div>

                    {/* New Whiteboard Button */}
                    <div className="px-4 pb-3">
                        <Button
                            onClick={handleNewBoard}
                            className="w-full bg-gray-900 hover:bg-gray-800 text-white gap-2 justify-start"
                        >
                            <Zap className="w-4 h-4" />
                            New Whiteboard
                        </Button>
                    </div>

                    {/* All Boards */}
                    <div className="px-4 pb-2">
                        <Link
                            to="/dashboard"
                            className={cn(
                                'flex items-center gap-3 px-3 py-2 rounded-lg text-sm font-medium transition-colors',
                                location.pathname === '/dashboard'
                                    ? 'bg-gray-900 text-white'
                                    : 'text-slate-600 hover:bg-slate-100'
                            )}
                        >
                            <LayoutGrid className="w-4 h-4" />
                            All Boards
                        </Link>
                    </div>

                    {/* Recent Boards */}
                    <div className="px-4 pb-3">
                        <h3 className="text-xs font-semibold text-slate-400 uppercase tracking-wider mb-2 px-3">
                            Recent Boards
                        </h3>
                        <div className="space-y-1">
                            {recentBoards.map((board) => (
                                <Link
                                    key={board.id}
                                    to={`/board/${board.id}`}
                                    className="flex items-center gap-3 px-3 py-2 rounded-lg text-sm text-slate-600 hover:bg-slate-100 transition-colors group"
                                >
                                    <div className="w-4 h-4 flex items-center justify-center">
                                        <Palette className="w-3.5 h-3.5 text-slate-400 group-hover:text-slate-600" />
                                    </div>
                                    <span className="truncate">{board.title}</span>
                                </Link>
                            ))}
                            {recentBoards.length === 0 && (
                                <p className="text-xs text-slate-400 px-3 py-2">No recent boards</p>
                            )}
                        </div>
                    </div>

                    <div className="flex-1" />

                    {/* Bottom Navigation */}
                    <div className="p-4 border-t border-slate-100">
                        <Link
                            to="/dashboard/settings"
                            className={cn(
                                'flex items-center gap-3 px-3 py-2 rounded-lg text-sm transition-colors',
                                location.pathname === '/dashboard/settings'
                                    ? 'bg-slate-100 text-slate-900'
                                    : 'text-slate-600 hover:bg-slate-100'
                            )}
                        >
                            <Settings className="w-4 h-4" />
                            Settings
                        </Link>
                    </div>

                    {/* User Profile Dropdown */}
                    <div className="p-4 border-t border-slate-100">
                        <DropdownMenu>
                            <DropdownMenuTrigger asChild>
                                <button className="w-full flex items-center gap-3 px-3 py-2 rounded-lg hover:bg-slate-100 transition-colors">
                                    <Avatar className="w-8 h-8">
                                        <AvatarImage src={user?.avatar} alt={user?.name} />
                                        <AvatarFallback className="bg-gray-900 text-white text-xs font-semibold">
                                            {user?.name ? getInitials(user.name) : 'U'}
                                        </AvatarFallback>
                                    </Avatar>
                                    <div className="flex-1 text-left min-w-0">
                                        <p className="text-sm font-medium text-slate-900 truncate">
                                            {user?.name || 'User'}
                                        </p>
                                        <p className="text-xs text-slate-500">Creator</p>
                                    </div>
                                    <ChevronDown className="w-4 h-4 text-slate-400" />
                                </button>
                            </DropdownMenuTrigger>
                            <DropdownMenuContent align="end" className="w-56">
                                <DropdownMenuItem onClick={() => navigate('/dashboard/settings')}>
                                    <Settings className="w-4 h-4 mr-2" />
                                    Settings
                                </DropdownMenuItem>
                                <DropdownMenuSeparator />
                                <DropdownMenuItem onClick={handleLogout} className="text-red-600">
                                    Log out
                                </DropdownMenuItem>
                            </DropdownMenuContent>
                        </DropdownMenu>
                    </div>
                </div>
            </aside>
        </>
    );
}
