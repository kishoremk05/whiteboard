import { useState, useEffect } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import { ArrowLeft, Share, Download, MoreHorizontal, Star, Users } from 'lucide-react';
import { Button } from '../components/ui/button';
import { Input } from '../components/ui/input';
import {
    DropdownMenu,
    DropdownMenuContent,
    DropdownMenuItem,
    DropdownMenuSeparator,
    DropdownMenuTrigger,
} from '../components/ui/dropdown-menu';
import { ExportModal } from '../components/dashboard/ExportModal';
import { useBoards } from '../contexts/BoardContext';
import { cn } from '../lib/utils';
import { toast } from 'sonner';

export function Board() {
    const { id } = useParams();
    const navigate = useNavigate();
    const { boards, updateBoard, toggleFavorite } = useBoards();
    const [isEditing, setIsEditing] = useState(false);
    const [title, setTitle] = useState('');
    const [exportModalOpen, setExportModalOpen] = useState(false);

    const board = boards.find(b => b.id === id);

    useEffect(() => {
        if (board) {
            setTitle(board.title);
        }
    }, [board]);

    if (!board) {
        return (
            <div className="min-h-screen flex items-center justify-center bg-slate-50">
                <div className="text-center">
                    <h2 className="text-2xl font-bold text-slate-900 mb-2">Board not found</h2>
                    <p className="text-slate-500 mb-4">This board may have been deleted.</p>
                    <Button onClick={() => navigate('/dashboard')}>
                        <ArrowLeft className="w-4 h-4 mr-2" />
                        Back to Dashboard
                    </Button>
                </div>
            </div>
        );
    }

    const handleTitleSubmit = () => {
        if (title.trim() && title !== board.title) {
            updateBoard(board.id, { title: title.trim() });
            toast.success('Board renamed');
        }
        setIsEditing(false);
    };

    const handleShare = () => {
        navigator.clipboard.writeText(window.location.href);
        toast.success('Link copied to clipboard');
    };

    return (
        <div className="min-h-screen flex flex-col bg-slate-100">
            {/* Board Header */}
            <header className="bg-white border-b border-slate-200 px-4 py-2 flex items-center justify-between z-10">
                <div className="flex items-center gap-3">
                    <Button
                        variant="ghost"
                        size="icon"
                        onClick={() => navigate('/dashboard')}
                    >
                        <ArrowLeft className="w-5 h-5" />
                    </Button>

                    {isEditing ? (
                        <Input
                            value={title}
                            onChange={(e) => setTitle(e.target.value)}
                            onBlur={handleTitleSubmit}
                            onKeyDown={(e) => e.key === 'Enter' && handleTitleSubmit()}
                            autoFocus
                            className="max-w-xs font-medium"
                        />
                    ) : (
                        <button
                            onClick={() => setIsEditing(true)}
                            className="text-lg font-medium text-slate-900 hover:text-primary-600 transition-colors"
                        >
                            {board.title}
                        </button>
                    )}

                    <button
                        onClick={() => toggleFavorite(board.id)}
                        className={cn(
                            'p-1.5 rounded-lg transition-colors',
                            board.isFavorite
                                ? 'text-amber-500 hover:text-amber-600'
                                : 'text-slate-400 hover:text-amber-500'
                        )}
                    >
                        <Star className={cn('w-5 h-5', board.isFavorite && 'fill-current')} />
                    </button>
                </div>

                <div className="flex items-center gap-2">
                    {/* Collaborators */}
                    <div className="hidden sm:flex items-center -space-x-2 mr-2">
                        <div className="w-8 h-8 rounded-full bg-primary-500 text-white flex items-center justify-center text-sm font-medium ring-2 ring-white">
                            A
                        </div>
                        <div className="w-8 h-8 rounded-full bg-accent-500 text-white flex items-center justify-center text-sm font-medium ring-2 ring-white">
                            B
                        </div>
                        <button className="w-8 h-8 rounded-full bg-slate-100 text-slate-600 flex items-center justify-center text-sm ring-2 ring-white hover:bg-slate-200 transition-colors">
                            <Users className="w-4 h-4" />
                        </button>
                    </div>

                    <Button variant="outline" size="sm" onClick={handleShare} className="gap-2">
                        <Share className="w-4 h-4" />
                        Share
                    </Button>

                    <Button
                        variant="outline"
                        size="sm"
                        onClick={() => setExportModalOpen(true)}
                        className="gap-2"
                    >
                        <Download className="w-4 h-4" />
                        Export
                    </Button>

                    <DropdownMenu>
                        <DropdownMenuTrigger asChild>
                            <Button variant="ghost" size="icon">
                                <MoreHorizontal className="w-5 h-5" />
                            </Button>
                        </DropdownMenuTrigger>
                        <DropdownMenuContent align="end">
                            <DropdownMenuItem onClick={() => setIsEditing(true)}>
                                Rename
                            </DropdownMenuItem>
                            <DropdownMenuItem onClick={() => toggleFavorite(board.id)}>
                                {board.isFavorite ? 'Remove from favorites' : 'Add to favorites'}
                            </DropdownMenuItem>
                            <DropdownMenuSeparator />
                            <DropdownMenuItem className="text-red-600">
                                Delete
                            </DropdownMenuItem>
                        </DropdownMenuContent>
                    </DropdownMenu>
                </div>
            </header>

            {/* Canvas Area */}
            <main className="flex-1 relative">
                {/* Placeholder for TLDraw Canvas */}
                <div className="absolute inset-0 flex items-center justify-center">
                    <div className="text-center p-8 bg-white rounded-xl shadow-lg max-w-md">
                        <div className="w-16 h-16 rounded-2xl bg-primary-100 flex items-center justify-center mx-auto mb-4">
                            <svg
                                className="w-8 h-8 text-primary-600"
                                viewBox="0 0 24 24"
                                fill="none"
                                stroke="currentColor"
                                strokeWidth="2"
                                strokeLinecap="round"
                                strokeLinejoin="round"
                            >
                                <path d="M12 19l7-7 3 3-7 7-3-3z" />
                                <path d="M18 13l-1.5-7.5L2 2l3.5 14.5L13 18l5-5z" />
                            </svg>
                        </div>
                        <h3 className="text-xl font-semibold text-slate-900 mb-2">
                            Canvas Ready
                        </h3>
                        <p className="text-slate-500 mb-4">
                            This is where the TLDraw canvas would be rendered.
                            The canvas integration is ready but TLDraw is not included in the demo.
                        </p>
                        <p className="text-sm text-slate-400">
                            Install @tldraw/tldraw to enable the full whiteboard experience.
                        </p>
                    </div>
                </div>

                {/* Canvas Background Pattern */}
                <div
                    className="absolute inset-0 opacity-[0.03]"
                    style={{
                        backgroundImage: `
              linear-gradient(to right, #6366f1 1px, transparent 1px),
              linear-gradient(to bottom, #6366f1 1px, transparent 1px)
            `,
                        backgroundSize: '24px 24px',
                    }}
                />
            </main>

            {/* Export Modal */}
            <ExportModal
                open={exportModalOpen}
                onOpenChange={setExportModalOpen}
                boardTitle={board.title}
            />
        </div>
    );
}
