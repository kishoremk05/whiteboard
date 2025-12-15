import { useState } from 'react';
import { useNavigate, useSearchParams } from 'react-router-dom';
import { Plus, Sparkles } from 'lucide-react';
import { DashboardLayout } from '../components/dashboard/DashboardLayout';
import { BoardList } from '../components/dashboard/BoardList';
import { TemplateGallery } from '../components/dashboard/TemplateGallery';
import { Button } from '../components/ui/button';
import { useBoards } from '../contexts/BoardContext';
import { useAuth } from '../contexts/AuthContext';

export function Dashboard() {
    const navigate = useNavigate();
    const [searchParams] = useSearchParams();
    const { user } = useAuth();
    const { boards, tags, filterByTag, createBoard } = useBoards();
    const [templateGalleryOpen, setTemplateGalleryOpen] = useState(false);

    const tagId = searchParams.get('tag');
    const filteredBoards = tagId ? filterByTag(tagId) : boards.filter(b => !b.isDeleted);
    const currentTag = tagId ? tags.find(t => t.id === tagId) : null;

    const handleNewBoard = () => {
        const board = createBoard('Untitled Board');
        navigate(`/board/${board.id}`);
    };

    // Get greeting based on time
    const getGreeting = () => {
        const hour = new Date().getHours();
        if (hour < 12) return 'Good morning';
        if (hour < 18) return 'Good afternoon';
        return 'Good evening';
    };

    return (
        <DashboardLayout>
            {/* Page Header */}
            <div className="mb-8">
                <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4">
                    <div>
                        <h1 className="text-2xl lg:text-3xl font-bold text-slate-900">
                            {currentTag ? (
                                <span className="flex items-center gap-2">
                                    <span
                                        className="inline-block w-4 h-4 rounded-full"
                                        style={{ backgroundColor: currentTag.color }}
                                    />
                                    {currentTag.name}
                                </span>
                            ) : (
                                <>
                                    {getGreeting()}, {user?.name?.split(' ')[0] || 'there'} 👋
                                </>
                            )}
                        </h1>
                        <p className="text-slate-500 mt-1">
                            {currentTag
                                ? `Boards tagged with "${currentTag.name}"`
                                : 'Your creative workspace awaits'}
                        </p>
                    </div>
                    <div className="flex items-center gap-2">
                        <Button
                            variant="outline"
                            onClick={() => setTemplateGalleryOpen(true)}
                            className="gap-2"
                        >
                            <Sparkles className="w-4 h-4" />
                            Templates
                        </Button>
                        <Button variant="gradient" onClick={handleNewBoard} className="gap-2">
                            <Plus className="w-4 h-4" />
                            New Board
                        </Button>
                    </div>
                </div>
            </div>

            {/* Board List */}
            <BoardList
                boards={filteredBoards}
                emptyTitle={currentTag ? `No boards with "${currentTag.name}" tag` : 'No boards yet'}
                emptyDescription={
                    currentTag
                        ? 'Create a new board and add this tag to it.'
                        : "Ready to bring your ideas to life? Create your first board or start from a template."
                }
                onCreateBoard={handleNewBoard}
            />

            {/* Template Gallery Modal */}
            <TemplateGallery
                open={templateGalleryOpen}
                onOpenChange={setTemplateGalleryOpen}
            />
        </DashboardLayout>
    );
}
