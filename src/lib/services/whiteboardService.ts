import { supabase } from '../supabase';
import type { DbWhiteboard, WhiteboardInsert, WhiteboardUpdate } from '../../types/database.types';

/**
 * Whiteboard Service
 * CRUD operations for whiteboards table
 */

/**
 * Fetch all whiteboards for a specific user
 */
export async function fetchUserWhiteboards(userId: string): Promise<DbWhiteboard[]> {
    const { data, error } = await supabase
        .from('whiteboards')
        .select('*')
        .eq('user_id', userId)
        .or('is_deleted.is.null,is_deleted.eq.false')
        .order('updated_at', { ascending: false });

    if (error) throw error;
    return data || [];
}

/**
 * Fetch whiteboards shared with a user (as collaborator)
 */
export async function fetchSharedWhiteboards(userId: string): Promise<DbWhiteboard[]> {
    try {
        const { data, error } = await supabase
            .from('collaborators')
            .select('whiteboard_id')
            .eq('user_id', userId);

        if (error) {
            console.error('Error fetching collaborators:', error);
            // Return empty array on error to prevent showing all boards
            return [];
        }

        if (!data || data.length === 0) return [];

        const whiteboardIds = data.map(c => c.whiteboard_id).filter(Boolean) as string[];

        if (whiteboardIds.length === 0) return [];

        const { data: whiteboards, error: wbError } = await supabase
            .from('whiteboards')
            .select('*')
            .in('id', whiteboardIds)
            .order('updated_at', { ascending: false });

        if (wbError) {
            console.error('Error fetching shared whiteboards:', wbError);
            return [];
        }

        return whiteboards || [];
    } catch (err) {
        console.error('Unexpected error in fetchSharedWhiteboards:', err);
        return [];
    }
}

/**
 * Fetch a single whiteboard by ID
 */
export async function fetchWhiteboard(id: string): Promise<DbWhiteboard | null> {
    const { data, error } = await supabase
        .from('whiteboards')
        .select('*')
        .eq('id', id)
        .single();

    if (error) {
        if (error.code === 'PGRST116') return null; // Not found
        throw error;
    }
    return data;
}

/**
 * Create a new whiteboard
 */
export async function createWhiteboard(whiteboard: WhiteboardInsert): Promise<DbWhiteboard> {
    const { data, error } = await supabase
        .from('whiteboards')
        .insert(whiteboard)
        .select()
        .single();

    if (error) throw error;
    return data;
}

/**
 * Update an existing whiteboard
 */
export async function updateWhiteboard(id: string, updates: WhiteboardUpdate): Promise<DbWhiteboard> {
    const { data, error } = await supabase
        .from('whiteboards')
        .update({ ...updates, updated_at: new Date().toISOString() })
        .eq('id', id)
        .select()
        .single();

    if (error) throw error;
    return data;
}

/**
 * Soft delete a whiteboard (move to trash)
 */
export async function deleteWhiteboard(id: string): Promise<DbWhiteboard> {
    const { data, error } = await supabase
        .from('whiteboards')
        .update({
            is_deleted: true,
            deleted_at: new Date().toISOString(),
            updated_at: new Date().toISOString()
        })
        .eq('id', id)
        .select()
        .single();

    if (error) throw error;
    return data;
}

/**
 * Restore a deleted whiteboard from trash
 */
export async function restoreWhiteboard(id: string): Promise<DbWhiteboard> {
    const { data, error } = await supabase
        .from('whiteboards')
        .update({
            is_deleted: false,
            deleted_at: null,
            updated_at: new Date().toISOString()
        })
        .eq('id', id)
        .select()
        .single();

    if (error) throw error;
    return data;
}

/**
 * Permanently delete a whiteboard (hard delete)
 */
export async function permanentlyDeleteWhiteboard(id: string): Promise<void> {
    const { error } = await supabase
        .from('whiteboards')
        .delete()
        .eq('id', id);

    if (error) throw error;
}

/**
 * Fetch deleted whiteboards (trash)
 */
export async function fetchDeletedWhiteboards(userId: string): Promise<DbWhiteboard[]> {
    const { data, error } = await supabase
        .from('whiteboards')
        .select('*')
        .eq('user_id', userId)
        .eq('is_deleted', true)
        .order('deleted_at', { ascending: false });

    if (error) throw error;
    return data || [];
}

/**
 * Duplicate a whiteboard
 */
export async function duplicateWhiteboard(id: string, userId: string): Promise<DbWhiteboard> {
    // Fetch original
    const original = await fetchWhiteboard(id);
    if (!original) throw new Error('Whiteboard not found');

    // Create copy
    const duplicate: WhiteboardInsert = {
        title: `${original.title || 'Untitled'} (Copy)`,
        data: original.data,
        preview: original.preview,
        user_id: userId,
        folder_id: original.folder_id,
    };

    return createWhiteboard(duplicate);
}

/**
 * Fetch whiteboards in a specific folder
 */
export async function fetchWhiteboardsByFolder(folderId: string): Promise<DbWhiteboard[]> {
    const { data, error } = await supabase
        .from('whiteboards')
        .select('*')
        .eq('folder_id', folderId)
        .order('updated_at', { ascending: false });

    if (error) throw error;
    return data || [];
}

/**
 * Move whiteboard to a folder
 */
export async function moveToFolder(whiteboardId: string, folderId: string | null): Promise<DbWhiteboard> {
    return updateWhiteboard(whiteboardId, { folder_id: folderId });
}

/**
 * Search whiteboards by title
 */
export async function searchWhiteboards(userId: string, query: string): Promise<DbWhiteboard[]> {
    const { data, error } = await supabase
        .from('whiteboards')
        .select('*')
        .eq('user_id', userId)
        .ilike('title', `%${query}%`)
        .order('updated_at', { ascending: false });

    if (error) throw error;
    return data || [];
}
