import { Trash2, RotateCcw, Trash } from 'lucide-react';
import { DashboardLayout } from '../components/dashboard/DashboardLayout';
import { Button } from '../components/ui/button';
import { Badge } from '../components/ui/badge';
import { useBoards } from '../contexts/BoardContext';
import { formatRelativeTime } from '../lib/utils';
import { toast } from 'sonner';

export function TrashPage() {
    const { deletedBoards, restoreBoard, permanentlyDeleteBoard } = useBoards();

    const handleRestore = (id: string, title: string) => {
        restoreBoard(id);
        toast.success(`"${title}" restored`);
    };

    const handlePermanentDelete = (id: string, title: string) => {
        permanentlyDeleteBoard(id);
        toast.success(`"${title}" permanently deleted`);
    };

    const handleEmptyTrash = () => {
        deletedBoards.forEach(board => permanentlyDeleteBoard(board.id));
        toast.success('Trash emptied');
    };

    return (
        <DashboardLayout>
            {/* Page Header */}
            <div className="mb-8">
                <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4">
                    <div>
                        <div className="flex items-center gap-3 mb-2">
                            <div className="w-10 h-10 rounded-xl bg-red-100 flex items-center justify-center">
                                <Trash2 className="w-5 h-5 text-red-600" />
                            </div>
                            <h1 className="text-2xl lg:text-3xl font-bold text-slate-900">
                                Trash
                            </h1>
                            {deletedBoards.length > 0 && (
                                <Badge variant="secondary">{deletedBoards.length}</Badge>
                            )}
                        </div>
                        <p className="text-slate-500">
                            Deleted boards are kept for 30 days before permanent removal
                        </p>
                    </div>
                    {deletedBoards.length > 0 && (
                        <Button variant="destructive" onClick={handleEmptyTrash} className="gap-2">
                            <Trash className="w-4 h-4" />
                            Empty Trash
                        </Button>
                    )}
                </div>
            </div>

            {/* Deleted Boards List */}
            {deletedBoards.length === 0 ? (
                <div className="flex flex-col items-center justify-center py-16 text-center">
                    <div className="w-20 h-20 rounded-2xl bg-slate-100 flex items-center justify-center mb-6">
                        <Trash2 className="w-10 h-10 text-slate-400" />
                    </div>
                    <h3 className="text-lg font-semibold text-slate-900 mb-2">Trash is empty</h3>
                    <p className="text-slate-500 max-w-sm">
                        Deleted boards will appear here. You can restore them or permanently delete them.
                    </p>
                </div>
            ) : (
                <div className="space-y-3">
                    {deletedBoards.map((board) => (
                        <div
                            key={board.id}
                            className="flex items-center gap-4 p-4 bg-white rounded-xl border border-slate-200"
                        >
                            <div className="w-12 h-12 rounded-lg bg-slate-100 flex items-center justify-center flex-shrink-0">
                                <Trash2 className="w-5 h-5 text-slate-400" />
                            </div>
                            <div className="flex-1 min-w-0">
                                <h3 className="font-medium text-slate-900 truncate">{board.title}</h3>
                                <p className="text-sm text-slate-500">
                                    Deleted {formatRelativeTime(board.deletedAt || board.updatedAt)}
                                </p>
                            </div>
                            <div className="flex items-center gap-2">
                                <Button
                                    variant="outline"
                                    size="sm"
                                    onClick={() => handleRestore(board.id, board.title)}
                                    className="gap-2"
                                >
                                    <RotateCcw className="w-4 h-4" />
                                    Restore
                                </Button>
                                <Button
                                    variant="ghost"
                                    size="sm"
                                    onClick={() => handlePermanentDelete(board.id, board.title)}
                                    className="text-red-600 hover:text-red-700 hover:bg-red-50"
                                >
                                    Delete
                                </Button>
                            </div>
                        </div>
                    ))}
                </div>
            )}
        </DashboardLayout>
    );
}
