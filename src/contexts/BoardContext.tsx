import { createContext, useContext, useState, useEffect, useCallback } from 'react';
import type { ReactNode } from 'react';
import { useAuth } from './AuthContext';
import { supabase } from '../lib/supabase';
import {
  fetchUserWhiteboards,
  fetchSharedWhiteboards,
  createWhiteboard as createWhiteboardService,
  updateWhiteboard as updateWhiteboardService,
  deleteWhiteboard as deleteWhiteboardService,
  duplicateWhiteboard as duplicateWhiteboardService,
} from '../lib/services/whiteboardService';

import type { DbWhiteboard, Folder, FolderInsert } from '../types/database.types';

// Board type for the app (combines DB type with UI state)
export interface Board {
  id: string;
  title: string;
  description?: string;
  thumbnail?: string;
  createdAt: string;
  updatedAt: string;
  ownerId: string;
  organizationId?: string;
  folderId?: string;
  isFavorite: boolean;
  isDeleted: boolean;
  deletedAt?: string;

  collaborators: Collaborator[];
  template?: string;
  data?: unknown;
  isShared?: boolean;
}



export interface Collaborator {
  userId: string;
  role: 'owner' | 'editor' | 'viewer';
  user: {
    id: string;
    name: string;
    email: string;
    avatar?: string;
  };
}

export interface Organization {
  id: string;
  name: string;
  slug: string;
  logo?: string;
  createdAt: string;
  ownerId: string;
  members: OrganizationMember[];
  subscription: 'free' | 'pro' | 'team';
}

export interface OrganizationMember {
  userId: string;
  role: 'admin' | 'editor' | 'viewer';
  joinedAt: string;
  user: {
    id: string;
    name: string;
    email: string;
    avatar?: string;
  };
}

interface BoardContextType {
  boards: Board[];
  deletedBoards: Board[];
  folders: Folder[];
  tags: any[];

  organizations: Organization[];
  currentOrganization: Organization | null;
  isLoading: boolean;
  error: string | null;

  // Board actions
  createBoard: (title: string, template?: string, folderId?: string) => Promise<Board>;
  updateBoard: (id: string, updates: Partial<Board>) => Promise<void>;
  deleteBoard: (id: string) => Promise<void>;
  restoreBoard: (id: string) => Promise<void>;
  permanentlyDeleteBoard: (id: string) => Promise<void>;
  duplicateBoard: (id: string) => Promise<Board>;
  toggleFavorite: (id: string) => Promise<void>;
  refreshBoards: () => Promise<void>;
  filterByTag: (tagId: string) => Board[];

  // Folder actions
  createFolder: (name: string) => Promise<Folder>;
  updateFolder: (id: string, name: string) => Promise<void>;
  deleteFolder: (id: string) => Promise<void>;
  moveToFolder: (boardId: string, folderId: string | null) => Promise<void>;

  // Organization actions
  setCurrentOrganization: (org: Organization | null) => void;

  // Filtering
  filterByFolder: (folderId: string | null) => Board[];
  searchBoards: (query: string) => Board[];
}

const BoardContext = createContext<BoardContextType | undefined>(undefined);

/**
 * Transform DB whiteboard to app Board type
 */
function transformWhiteboard(wb: DbWhiteboard, isShared = false): Board {
  // Read favorite status from metadata
  const metadata = wb.metadata as Record<string, unknown> | null;
  const isFavorite = metadata?.is_favorite === true;
  
  // Note: Tags will be populated separately after tags are loaded
  // The tag_ids are stored in metadata.tag_ids
  
  return {
    id: wb.id,
    title: wb.title || 'Untitled',
    description: undefined,
    thumbnail: wb.preview || undefined,
    createdAt: wb.created_at || new Date().toISOString(),
    updatedAt: wb.updated_at || new Date().toISOString(),
    ownerId: wb.user_id || '',
    folderId: wb.folder_id || undefined,
    isFavorite,
    isDeleted: false,
    collaborators: [],
    data: wb.data,
    isShared,
  };
}



export function BoardProvider({ children }: { children: ReactNode }) {
  const { user, isAuthenticated } = useAuth();
  const [boards, setBoards] = useState<Board[]>([]);
  const [deletedBoards, setDeletedBoards] = useState<Board[]>([]);
  const [folders, setFolders] = useState<Folder[]>([]);
  const [organizations, setOrganizations] = useState<Organization[]>([]);
  const [currentOrganization, setCurrentOrganization] = useState<Organization | null>(null);
  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);

  /**
   * Fetch all boards for the current user
   */
  const refreshBoards = useCallback(async () => {
    if (!user?.id) return;

    setIsLoading(true);
    setError(null);

    try {
      // Fetch owned whiteboards
      const ownedWhiteboards = await fetchUserWhiteboards(user.id);
      const ownedBoards = ownedWhiteboards.map(wb => transformWhiteboard(wb, false));

      // Fetch shared whiteboards
      const sharedWhiteboards = await fetchSharedWhiteboards(user.id);
      const sharedBoards = sharedWhiteboards.map(wb => transformWhiteboard(wb, true));

      // Combine and deduplicate
      const allBoards = [...ownedBoards, ...sharedBoards];
      const uniqueBoards = allBoards.filter(
        (board, index, self) => self.findIndex(b => b.id === board.id) === index
      );

      setBoards(uniqueBoards);

      // Fetch folders
      const { data: folderData } = await supabase
        .from('folders')
        .select('*')
        .eq('user_id', user.id)
        .order('name', { ascending: true });

      setFolders(folderData || []);
    } catch (err) {
      console.error('Failed to fetch boards:', err);
      setError(err instanceof Error ? err.message : 'Failed to fetch boards');
    } finally {
      setIsLoading(false);
    }
  }, [user?.id]);

  /**
   * Fetch organizations for the current user
   */
  const refreshOrganizations = useCallback(async () => {
    if (!user?.id) return;

    try {
      // Fetch organizations where user is a member
      const { data: memberData, error: memberError } = await supabase
        .from('organization_members')
        .select(`
          organization_id,
          role,
          joined_at,
          organizations:organization_id (
            id,
            name,
            slug,
            logo,
            owner_id,
            subscription,
            created_at
          )
        `)
        .eq('user_id', user.id);

      if (memberError) {
        console.error('Error fetching organizations:', memberError);
        return;
      }

      if (!memberData || memberData.length === 0) {
        setOrganizations([]);
        setCurrentOrganization(null);
        return;
      }

      // Transform the data to Organization format
      const orgs: Organization[] = await Promise.all(
        memberData.map(async (membership: any) => {
          const org = membership.organizations;
          
          // Fetch all members for this organization
          const { data: allMembers } = await supabase
            .from('organization_members')
            .select(`
              user_id,
              role,
              joined_at,
              user_profiles:user_id (
                id,
                name,
                email
              )
            `)
            .eq('organization_id', org.id);

          const members: OrganizationMember[] = (allMembers || []).map((m: any) => ({
            userId: m.user_id,
            role: m.role,
            joinedAt: m.joined_at,
            user: {
              id: m.user_profiles?.id || m.user_id,
              name: m.user_profiles?.name || 'Unknown',
              email: m.user_profiles?.email || '',
              avatar: undefined,
            },
          }));

          return {
            id: org.id,
            name: org.name,
            slug: org.slug,
            logo: org.logo,
            createdAt: org.created_at,
            ownerId: org.owner_id,
            members,
            subscription: org.subscription || 'free',
          };
        })
      );

      setOrganizations(orgs);

      // Set current organization if not already set
      if (!currentOrganization && orgs.length > 0) {
        setCurrentOrganization(orgs[0]);
      }
    } catch (err) {
      console.error('Failed to fetch organizations:', err);
    }
  }, [user?.id, currentOrganization]);

  /**
   * Load boards when user is authenticated
   */
  useEffect(() => {
    if (isAuthenticated && user?.id) {
      refreshBoards();
      refreshOrganizations();
    } else {
      setBoards([]);
      setFolders([]);
      setOrganizations([]);
      setCurrentOrganization(null);
    }
  }, [isAuthenticated, user?.id, refreshBoards, refreshOrganizations]);



  /**
   * Subscribe to real-time board changes
   */
  useEffect(() => {
    if (!user?.id) return;

    const channel = supabase
      .channel('boards-changes')
      .on(
        'postgres_changes',
        {
          event: '*',
          schema: 'public',
          table: 'whiteboards',
          filter: `user_id=eq.${user.id}`,
        },
        () => {
          // Refresh boards on any change
          refreshBoards();
        }
      )
      .subscribe();

    return () => {
      supabase.removeChannel(channel);
    };
  }, [user?.id, refreshBoards]);

  /**
   * Create a new board
   */
  const createBoard = async (title: string, template?: string, folderId?: string): Promise<Board> => {
    if (!user?.id) {
      console.error('createBoard failed: Not authenticated');
      throw new Error('Not authenticated');
    }

    try {
      console.log('Creating board with:', { title, user_id: user.id, template, folderId });
      
      // Get template content if template is specified
      let boardData: Record<string, unknown> | null = null;
      if (template) {
        const { templateContent } = await import('../data/templateContent');
        const content = templateContent[template];
        if (content && Object.keys(content).length > 0) {
          boardData = content as Record<string, unknown>;
          console.log('Loading template content for:', template);
        } else {
          boardData = { template }; // Fallback to just storing template ID
        }
      }
      
      const newWhiteboard = await createWhiteboardService({
        title,
        user_id: user.id,
        folder_id: folderId || null,
        data: boardData,
        preview: null,
      });

      console.log('Created whiteboard:', newWhiteboard);

      if (!newWhiteboard || !newWhiteboard.id) {
        console.error('createWhiteboardService returned invalid data:', newWhiteboard);
        throw new Error('Failed to create board - no ID returned');
      }

      const newBoard = transformWhiteboard(newWhiteboard);
      setBoards(prev => [newBoard, ...prev]);
      return newBoard;
    } catch (error) {
      console.error('Error creating board:', error);
      throw error;
    }
  };

  /**
   * Update a board
   */
  const updateBoard = async (id: string, updates: Partial<Board>): Promise<void> => {
    const dbUpdates: Record<string, unknown> = {};
    if (updates.title !== undefined) dbUpdates.title = updates.title;
    if (updates.data !== undefined) dbUpdates.data = updates.data as Record<string, unknown>;
    if (updates.thumbnail !== undefined) dbUpdates.preview = updates.thumbnail;
    if (updates.folderId !== undefined) dbUpdates.folder_id = updates.folderId;

    await updateWhiteboardService(id, dbUpdates);

    setBoards(prev =>
      prev.map(board =>
        board.id === id
          ? { ...board, ...updates, updatedAt: new Date().toISOString() }
          : board
      )
    );
  };

  /**
   * Delete a board (hard delete)
   */
  const deleteBoard = async (id: string): Promise<void> => {
    const board = boards.find(b => b.id === id);
    if (board) {
      // Move to deleted boards for undo capability
      setDeletedBoards(prev => [{ ...board, isDeleted: true, deletedAt: new Date().toISOString() }, ...prev]);
      setBoards(prev => prev.filter(b => b.id !== id));
      
      // Delete from database
      await deleteWhiteboardService(id);
    }
  };

  /**
   * Restore a deleted board (note: this creates a new board since we hard delete)
   */
  const restoreBoard = async (id: string): Promise<void> => {
    const board = deletedBoards.find(b => b.id === id);
    if (board && user?.id) {
      // Re-create the board
      const newWhiteboard = await createWhiteboardService({
        title: board.title,
        user_id: user.id,
        folder_id: board.folderId || null,
        data: board.data as Record<string, unknown> | null,
        preview: board.thumbnail || null,
      });

      const restoredBoard = transformWhiteboard(newWhiteboard);
      setDeletedBoards(prev => prev.filter(b => b.id !== id));
      setBoards(prev => [restoredBoard, ...prev]);
    }
  };

  /**
   * Permanently delete a board
   */
  const permanentlyDeleteBoard = async (id: string): Promise<void> => {
    setDeletedBoards(prev => prev.filter(b => b.id !== id));
  };

  /**
   * Duplicate a board
   */
  const duplicateBoard = async (id: string): Promise<Board> => {
    if (!user?.id) throw new Error('Not authenticated');

    const newWhiteboard = await duplicateWhiteboardService(id, user.id);
    const newBoard = transformWhiteboard(newWhiteboard);
    setBoards(prev => [newBoard, ...prev]);
    return newBoard;
  };

  /**
   * Toggle favorite status
   */
  const toggleFavorite = async (id: string): Promise<void> => {
    const board = boards.find(b => b.id === id);
    if (!board) return;
    
    const newFavoriteStatus = !board.isFavorite;
    
    try {
      // Update local state optimistically
      setBoards(prev =>
        prev.map(b =>
          b.id === id
            ? { ...b, isFavorite: newFavoriteStatus, updatedAt: new Date().toISOString() }
            : b
        )
      );
      
      // Save to database via metadata
      await updateWhiteboardService(id, {
        metadata: { is_favorite: newFavoriteStatus } as Record<string, unknown>,
      });
    } catch (error) {
      console.error('Failed to toggle favorite:', error);
      // Revert on error
      setBoards(prev =>
        prev.map(b =>
          b.id === id
            ? { ...b, isFavorite: !newFavoriteStatus }
            : b
        )
      );
    }
  };

  // Folder actions
  const createFolder = async (name: string): Promise<Folder> => {
    if (!user?.id) throw new Error('Not authenticated');

    const folderData: FolderInsert = {
      name,
      user_id: user.id,
    };

    const { data, error: insertError } = await supabase
      .from('folders')
      .insert(folderData)
      .select()
      .single();

    if (insertError) throw insertError;

    setFolders(prev => [...prev, data]);
    return data;
  };

  const updateFolder = async (id: string, name: string): Promise<void> => {
    const { error: updateError } = await supabase
      .from('folders')
      .update({ name, updated_at: new Date().toISOString() })
      .eq('id', id);

    if (updateError) throw updateError;

    setFolders(prev =>
      prev.map(folder => (folder.id === id ? { ...folder, name } : folder))
    );
  };

  const deleteFolder = async (id: string): Promise<void> => {
    // Move boards out of folder first
    await supabase
      .from('whiteboards')
      .update({ folder_id: null })
      .eq('folder_id', id);

    const { error: deleteError } = await supabase
      .from('folders')
      .delete()
      .eq('id', id);

    if (deleteError) throw deleteError;

    setFolders(prev => prev.filter(f => f.id !== id));
    setBoards(prev =>
      prev.map(board =>
        board.folderId === id ? { ...board, folderId: undefined } : board
      )
    );
  };

  const moveToFolder = async (boardId: string, folderId: string | null): Promise<void> => {
    await updateBoard(boardId, { folderId: folderId || undefined });
  };



  const filterByFolder = (folderId: string | null): Board[] => {
    if (!folderId) return boards.filter(board => !board.folderId);
    return boards.filter(board => board.folderId === folderId);
  };

  const searchBoards = (query: string): Board[] => {
    const lowerQuery = query.toLowerCase();
    return boards.filter(
      board =>
        board.title.toLowerCase().includes(lowerQuery) ||
        board.description?.toLowerCase().includes(lowerQuery)
    );
  };

  const filterByTag = (tagId: string): Board[] => {
    return boards.filter(board => !board.isDeleted);
  };

  return (
    <BoardContext.Provider
      value={{
        boards,
        deletedBoards,
        folders,
        tags: [],
        organizations,
        currentOrganization,
        isLoading,
        error,
        createBoard,
        updateBoard,
        deleteBoard,
        restoreBoard,
        permanentlyDeleteBoard,
        duplicateBoard,
        toggleFavorite,
        refreshBoards,
        createFolder,
        updateFolder,
        deleteFolder,
        moveToFolder,
        setCurrentOrganization,
        filterByFolder,
        searchBoards,
        filterByTag,
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
