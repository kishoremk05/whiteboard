import { supabase } from '../supabase';
import type { BoardComment, CommentInsert, CommentUpdate } from '../../types/database.types';

/**
 * Comment Service
 * CRUD operations for board_comments table
 */

/**
 * Fetch all comments for a specific board
 */
export async function fetchComments(boardId: string): Promise<BoardComment[]> {
    const { data, error } = await supabase
        .from('board_comments')
        .select('*')
        .eq('board_id', boardId)
        .order('created_at', { ascending: true });

    if (error) throw error;
    return data || [];
}

/**
 * Fetch comments with user profile info
 */
export async function fetchCommentsWithUsers(boardId: string): Promise<(BoardComment & { user_profile?: { name: string; email: string } })[]> {
    const { data, error } = await supabase
        .from('board_comments')
        .select(`
      *,
      user_profile:user_profiles(name, email)
    `)
        .eq('board_id', boardId)
        .order('created_at', { ascending: true });

    if (error) throw error;
    return data || [];
}

/**
 * Create a new comment
 */
export async function createComment(comment: CommentInsert): Promise<BoardComment> {
    const { data, error } = await supabase
        .from('board_comments')
        .insert(comment)
        .select()
        .single();

    if (error) throw error;
    return data;
}

/**
 * Update an existing comment
 */
export async function updateComment(id: string, updates: CommentUpdate): Promise<BoardComment> {
    const { data, error } = await supabase
        .from('board_comments')
        .update({ ...updates, updated_at: new Date().toISOString() })
        .eq('id', id)
        .select()
        .single();

    if (error) throw error;
    return data;
}

/**
 * Resolve a comment
 */
export async function resolveComment(id: string): Promise<BoardComment> {
    return updateComment(id, { resolved: true });
}

/**
 * Unresolve a comment
 */
export async function unresolveComment(id: string): Promise<BoardComment> {
    return updateComment(id, { resolved: false });
}

/**
 * Delete a comment
 */
export async function deleteComment(id: string): Promise<void> {
    const { error } = await supabase
        .from('board_comments')
        .delete()
        .eq('id', id);

    if (error) throw error;
}

/**
 * Fetch unresolved comments count for a board
 */
export async function getUnresolvedCount(boardId: string): Promise<number> {
    const { count, error } = await supabase
        .from('board_comments')
        .select('*', { count: 'exact', head: true })
        .eq('board_id', boardId)
        .eq('resolved', false);

    if (error) throw error;
    return count || 0;
}

/**
 * Subscribe to comment changes for real-time updates
 */
export function subscribeToComments(
    boardId: string,
    onInsert: (comment: BoardComment) => void,
    onUpdate: (comment: BoardComment) => void,
    onDelete: (id: string) => void
) {
    const channel = supabase
        .channel(`comments:${boardId}`)
        .on(
            'postgres_changes',
            {
                event: 'INSERT',
                schema: 'public',
                table: 'board_comments',
                filter: `board_id=eq.${boardId}`,
            },
            (payload) => onInsert(payload.new as BoardComment)
        )
        .on(
            'postgres_changes',
            {
                event: 'UPDATE',
                schema: 'public',
                table: 'board_comments',
                filter: `board_id=eq.${boardId}`,
            },
            (payload) => onUpdate(payload.new as BoardComment)
        )
        .on(
            'postgres_changes',
            {
                event: 'DELETE',
                schema: 'public',
                table: 'board_comments',
                filter: `board_id=eq.${boardId}`,
            },
            (payload) => onDelete((payload.old as { id: string }).id)
        )
        .subscribe();

    return () => {
        supabase.removeChannel(channel);
    };
}
