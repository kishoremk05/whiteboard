import { createContext, useContext, useState, ReactNode } from 'react';
import type { Board, Tag, Organization } from '../types';
import { mockBoards, mockTags, mockOrganizations, mockDeletedBoards } from '../data/mockData';
import { generateId } from '../lib/utils';

interface BoardContextType {
    boards: Board[];
    deletedBoards: Board[];
    tags: Tag[];
    organizations: Organization[];
    currentOrganization: Organization | null;
    isLoading: boolean;

    // Board actions
    createBoard: (title: string, template?: string) => Board;
    updateBoard: (id: string, updates: Partial<Board>) => void;
    deleteBoard: (id: string) => void;
    restoreBoard: (id: string) => void;
    permanentlyDeleteBoard: (id: string) => void;
    duplicateBoard: (id: string) => Board;
    toggleFavorite: (id: string) => void;

    // Tag actions
    createTag: (name: string, color: string) => Tag;
    updateTag: (id: string, updates: Partial<Tag>) => void;
    deleteTag: (id: string) => void;
    addTagToBoard: (boardId: string, tagId: string) => void;
    removeTagFromBoard: (boardId: string, tagId: string) => void;

    // Organization actions
    setCurrentOrganization: (org: Organization | null) => void;

    // Filtering
    filterByTag: (tagId: string | null) => Board[];
    searchBoards: (query: string) => Board[];
}

const BoardContext = createContext<BoardContextType | undefined>(undefined);

export function BoardProvider({ children }: { children: ReactNode }) {
    const [boards, setBoards] = useState<Board[]>(mockBoards);
    const [deletedBoards, setDeletedBoards] = useState<Board[]>(mockDeletedBoards);
    const [tags, setTags] = useState<Tag[]>(mockTags);
    const [organizations] = useState<Organization[]>(mockOrganizations);
    const [currentOrganization, setCurrentOrganization] = useState<Organization | null>(mockOrganizations[0]);
    const [isLoading] = useState(false);

    const createBoard = (title: string, template?: string): Board => {
        const newBoard: Board = {
            id: `board-${generateId()}`,
            title,
            createdAt: new Date().toISOString(),
            updatedAt: new Date().toISOString(),
            ownerId: 'user-1',
            organizationId: currentOrganization?.id,
            isFavorite: false,
            isDeleted: false,
            tags: [],
            collaborators: [],
            template,
        };
        setBoards(prev => [newBoard, ...prev]);
        return newBoard;
    };

    const updateBoard = (id: string, updates: Partial<Board>) => {
        setBoards(prev =>
            prev.map(board =>
                board.id === id
                    ? { ...board, ...updates, updatedAt: new Date().toISOString() }
                    : board
            )
        );
    };

    const deleteBoard = (id: string) => {
        const board = boards.find(b => b.id === id);
        if (board) {
            const deletedBoard = {
                ...board,
                isDeleted: true,
                deletedAt: new Date().toISOString(),
            };
            setBoards(prev => prev.filter(b => b.id !== id));
            setDeletedBoards(prev => [deletedBoard, ...prev]);
        }
    };

    const restoreBoard = (id: string) => {
        const board = deletedBoards.find(b => b.id === id);
        if (board) {
            const restoredBoard = {
                ...board,
                isDeleted: false,
                deletedAt: undefined,
                updatedAt: new Date().toISOString(),
            };
            setDeletedBoards(prev => prev.filter(b => b.id !== id));
            setBoards(prev => [restoredBoard, ...prev]);
        }
    };

    const permanentlyDeleteBoard = (id: string) => {
        setDeletedBoards(prev => prev.filter(b => b.id !== id));
    };

    const duplicateBoard = (id: string): Board => {
        const original = boards.find(b => b.id === id);
        if (!original) throw new Error('Board not found');

        const duplicate: Board = {
            ...original,
            id: `board-${generateId()}`,
            title: `${original.title} (Copy)`,
            createdAt: new Date().toISOString(),
            updatedAt: new Date().toISOString(),
            isFavorite: false,
        };
        setBoards(prev => [duplicate, ...prev]);
        return duplicate;
    };

    const toggleFavorite = (id: string) => {
        setBoards(prev =>
            prev.map(board =>
                board.id === id
                    ? { ...board, isFavorite: !board.isFavorite, updatedAt: new Date().toISOString() }
                    : board
            )
        );
    };

    const createTag = (name: string, color: string): Tag => {
        const newTag: Tag = {
            id: `tag-${generateId()}`,
            name,
            color,
            createdAt: new Date().toISOString(),
        };
        setTags(prev => [...prev, newTag]);
        return newTag;
    };

    const updateTag = (id: string, updates: Partial<Tag>) => {
        setTags(prev =>
            prev.map(tag => (tag.id === id ? { ...tag, ...updates } : tag))
        );
    };

    const deleteTag = (id: string) => {
        setTags(prev => prev.filter(tag => tag.id !== id));
        // Remove tag from all boards
        setBoards(prev =>
            prev.map(board => ({
                ...board,
                tags: board.tags.filter(tag => tag.id !== id),
            }))
        );
    };

    const addTagToBoard = (boardId: string, tagId: string) => {
        const tag = tags.find(t => t.id === tagId);
        if (!tag) return;

        setBoards(prev =>
            prev.map(board =>
                board.id === boardId && !board.tags.some(t => t.id === tagId)
                    ? { ...board, tags: [...board.tags, tag], updatedAt: new Date().toISOString() }
                    : board
            )
        );
    };

    const removeTagFromBoard = (boardId: string, tagId: string) => {
        setBoards(prev =>
            prev.map(board =>
                board.id === boardId
                    ? { ...board, tags: board.tags.filter(t => t.id !== tagId), updatedAt: new Date().toISOString() }
                    : board
            )
        );
    };

    const filterByTag = (tagId: string | null): Board[] => {
        if (!tagId) return boards;
        return boards.filter(board => board.tags.some(tag => tag.id === tagId));
    };

    const searchBoards = (query: string): Board[] => {
        const lowerQuery = query.toLowerCase();
        return boards.filter(
            board =>
                board.title.toLowerCase().includes(lowerQuery) ||
                board.description?.toLowerCase().includes(lowerQuery) ||
                board.tags.some(tag => tag.name.toLowerCase().includes(lowerQuery))
        );
    };

    return (
        <BoardContext.Provider
            value={{
                boards,
                deletedBoards,
                tags,
                organizations,
                currentOrganization,
                isLoading,
                createBoard,
                updateBoard,
                deleteBoard,
                restoreBoard,
                permanentlyDeleteBoard,
                duplicateBoard,
                toggleFavorite,
                createTag,
                updateTag,
                deleteTag,
                addTagToBoard,
                removeTagFromBoard,
                setCurrentOrganization,
                filterByTag,
                searchBoards,
            }}
        >
            {children}
        </BoardContext.Provider>
    );
}

export function useBoards() {
    const context = useContext(BoardContext);
    if (context === undefined) {
        throw new Error('useBoards must be used within a BoardProvider');
    }
    return context;
}
