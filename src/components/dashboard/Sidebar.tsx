import { Link, useLocation, useNavigate } from 'react-router-dom';
import {
    LayoutGrid,
    Star,
    Trash2,
    Settings,
    Users,
    Plus,
    Tag,
    X,
    ChevronDown,
    FolderOpen,
} from 'lucide-react';
import { Button } from '../ui/button';
import { ScrollArea } from '../ui/scroll-area';
import { Separator } from '../ui/separator';
import { Badge } from '../ui/badge';
import { cn } from '../../lib/utils';
import { useBoards } from '../../contexts/BoardContext';

interface SidebarProps {
    isOpen: boolean;
    onClose: () => void;
}

const mainNavItems = [
    { name: 'All Boards', href: '/dashboard', icon: LayoutGrid },
    { name: 'Favorites', href: '/dashboard/favorites', icon: Star },
    { name: 'Trash', href: '/dashboard/trash', icon: Trash2 },
];

const bottomNavItems = [
    { name: 'Team', href: '/dashboard/team', icon: Users },
    { name: 'Settings', href: '/dashboard/settings', icon: Settings },
];

export function Sidebar({ isOpen, onClose }: SidebarProps) {
    const location = useLocation();
    const navigate = useNavigate();
    const { tags, boards, organizations, currentOrganization, setCurrentOrganization, createBoard } = useBoards();

    const handleNewBoard = () => {
        const board = createBoard('Untitled Board');
        navigate(`/board/${board.id}`);
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
                    isOpen ? 'translate-x-0' : '-translate-x-full lg:translate-x-0 lg:hidden'
                )}
            >
                <div className="flex flex-col h-full">
                    {/* Header */}
                    <div className="flex items-center justify-between p-4 border-b border-slate-100">
                        <Link to="/" className="flex items-center gap-2">
                            <div className="w-8 h-8 rounded-lg bg-gradient-to-br from-primary-500 to-accent-500 flex items-center justify-center">
                                <svg
                                    className="w-4 h-4 text-white"
                                    viewBox="0 0 24 24"
                                    fill="none"
                                    stroke="currentColor"
                                    strokeWidth="2.5"
                                    strokeLinecap="round"
                                    strokeLinejoin="round"
                                >
                                    <path d="M12 19l7-7 3 3-7 7-3-3z" />
                                    <path d="M18 13l-1.5-7.5L2 2l3.5 14.5L13 18l5-5z" />
                                </svg>
                            </div>
                            <span className="text-lg font-bold text-slate-900">
                                Canvas<span className="text-primary-600">AI</span>
                            </span>
                        </Link>
                        <button
                            onClick={onClose}
                            className="lg:hidden p-1.5 rounded-lg hover:bg-slate-100 transition-colors"
                        >
                            <X className="w-5 h-5 text-slate-500" />
                        </button>
                    </div>

                    {/* Organization Switcher */}
                    <div className="p-3">
                        <button className="w-full flex items-center justify-between p-2.5 rounded-lg bg-slate-50 hover:bg-slate-100 transition-colors">
                            <div className="flex items-center gap-2">
                                <div className="w-8 h-8 rounded-lg bg-primary-100 flex items-center justify-center">
                                    <FolderOpen className="w-4 h-4 text-primary-600" />
                                </div>
                                <div className="text-left">
                                    <p className="text-sm font-medium text-slate-900 truncate max-w-[140px]">
                                        {currentOrganization?.name || 'Personal'}
                                    </p>
                                    <p className="text-xs text-slate-500">
                                        {boards.length} boards
                                    </p>
                                </div>
                            </div>
                            <ChevronDown className="w-4 h-4 text-slate-400" />
                        </button>
                    </div>

                    {/* New Board Button */}
                    <div className="px-3 mb-2">
                        <Button
                            onClick={handleNewBoard}
                            className="w-full justify-start gap-2"
                            variant="gradient"
                        >
                            <Plus className="w-4 h-4" />
                            New Board
                        </Button>
                    </div>

                    <Separator />

                    {/* Main Navigation */}
                    <ScrollArea className="flex-1 px-3 py-4">
                        <nav className="space-y-1">
                            {mainNavItems.map((item) => {
                                const isActive = location.pathname === item.href;
                                return (
                                    <Link
                                        key={item.name}
                                        to={item.href}
                                        className={cn(
                                            'flex items-center gap-3 px-3 py-2 rounded-lg text-sm font-medium transition-colors',
                                            isActive
                                                ? 'bg-primary-50 text-primary-600'
                                                : 'text-slate-600 hover:bg-slate-100 hover:text-slate-900'
                                        )}
                                    >
                                        <item.icon className="w-5 h-5" />
                                        {item.name}
                                        {item.name === 'Favorites' && (
                                            <Badge variant="secondary" className="ml-auto text-xs">
                                                {boards.filter(b => b.isFavorite).length}
                                            </Badge>
                                        )}
                                    </Link>
                                );
                            })}
                        </nav>

                        {/* Tags Section */}
                        <div className="mt-6">
                            <div className="flex items-center justify-between px-3 mb-2">
                                <span className="text-xs font-semibold text-slate-400 uppercase tracking-wider">
                                    Tags
                                </span>
                                <button className="p-1 rounded hover:bg-slate-100 transition-colors">
                                    <Plus className="w-4 h-4 text-slate-400" />
                                </button>
                            </div>
                            <div className="space-y-1">
                                {tags.slice(0, 6).map((tag) => (
                                    <Link
                                        key={tag.id}
                                        to={`/dashboard?tag=${tag.id}`}
                                        className="flex items-center gap-3 px-3 py-2 rounded-lg text-sm text-slate-600 hover:bg-slate-100 hover:text-slate-900 transition-colors"
                                    >
                                        <div
                                            className="w-3 h-3 rounded-full"
                                            style={{ backgroundColor: tag.color }}
                                        />
                                        {tag.name}
                                        <Badge variant="secondary" className="ml-auto text-xs">
                                            {boards.filter(b => b.tags.some(t => t.id === tag.id)).length}
                                        </Badge>
                                    </Link>
                                ))}
                            </div>
                        </div>
                    </ScrollArea>

                    {/* Bottom Navigation */}
                    <div className="p-3 border-t border-slate-100">
                        <nav className="space-y-1">
                            {bottomNavItems.map((item) => {
                                const isActive = location.pathname === item.href;
                                return (
                                    <Link
                                        key={item.name}
                                        to={item.href}
                                        className={cn(
                                            'flex items-center gap-3 px-3 py-2 rounded-lg text-sm font-medium transition-colors',
                                            isActive
                                                ? 'bg-primary-50 text-primary-600'
                                                : 'text-slate-600 hover:bg-slate-100 hover:text-slate-900'
                                        )}
                                    >
                                        <item.icon className="w-5 h-5" />
                                        {item.name}
                                    </Link>
                                );
                            })}
                        </nav>
                    </div>
                </div>
            </aside>
        </>
    );
}
