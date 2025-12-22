import { supabase } from '../supabase';
import type { BoardPresence } from '../../types/database.types';

/**
 * Presence Service
 * Real-time presence tracking for board collaboration
 */

export interface PresenceUser {
    id: string;
    user_id: string;
    cursor_x: number;
    cursor_y: number;
    last_seen_at: string;
    user_profile?: {
        name: string;
        email: string;
    };
}

/**
 * Get current presence for a board
 */
export async function getBoardPresence(boardId: string): Promise<BoardPresence[]> {
    // Only get presence updated in last 30 seconds (active users)
    const thirtySecondsAgo = new Date(Date.now() - 30000).toISOString();

    const { data, error } = await supabase
        .from('board_presence')
        .select('*')
        .eq('board_id', boardId)
        .gte('last_seen_at', thirtySecondsAgo);

    if (error) throw error;
    return data || [];
}

/**
 * Get presence with user profile info
 */
export async function getBoardPresenceWithUsers(boardId: string): Promise<PresenceUser[]> {
    const thirtySecondsAgo = new Date(Date.now() - 30000).toISOString();

    const { data, error } = await supabase
        .from('board_presence')
        .select(`
      *,
      user_profile:user_profiles(name, email)
    `)
        .eq('board_id', boardId)
        .gte('last_seen_at', thirtySecondsAgo);

    if (error) throw error;
    return (data || []) as PresenceUser[];
}

/**
 * Join a board (register presence)
 */
export async function joinBoard(boardId: string, userId: string): Promise<BoardPresence> {
    // Upsert presence record
    const { data, error } = await supabase
        .from('board_presence')
        .upsert({
            board_id: boardId,
            user_id: userId,
            cursor_x: 0,
            cursor_y: 0,
            last_seen_at: new Date().toISOString(),
        }, {
            onConflict: 'board_id,user_id',
        })
        .select()
        .single();

    if (error) throw error;
    return data;
}

/**
 * Leave a board (remove presence)
 */
export async function leaveBoard(boardId: string, userId: string): Promise<void> {
    const { error } = await supabase
        .from('board_presence')
        .delete()
        .eq('board_id', boardId)
        .eq('user_id', userId);

    if (error) throw error;
}

/**
 * Update cursor position
 */
export async function updateCursorPosition(
    boardId: string,
    userId: string,
    cursorX: number,
    cursorY: number
): Promise<void> {
    const { error } = await supabase
        .from('board_presence')
        .upsert({
            board_id: boardId,
            user_id: userId,
            cursor_x: cursorX,
            cursor_y: cursorY,
            last_seen_at: new Date().toISOString(),
        }, {
            onConflict: 'board_id,user_id',
        });

    if (error) throw error;
}

/**
 * Subscribe to presence changes using Supabase Realtime
 */
export function subscribeToPresence(
    boardId: string,
    onPresenceChange: (presences: BoardPresence[]) => void
) {
    const channel = supabase
        .channel(`presence:${boardId}`)
        .on(
            'postgres_changes',
            {
                event: '*',
                schema: 'public',
                table: 'board_presence',
                filter: `board_id=eq.${boardId}`,
            },
            async () => {
                // Refetch all presence when any change occurs
                const presences = await getBoardPresence(boardId);
                onPresenceChange(presences);
            }
        )
        .subscribe();

    return () => {
        supabase.removeChannel(channel);
    };
}

/**
 * Use Supabase Presence (broadcast-based, more efficient for cursors)
 */
export function useBroadcastPresence(
    boardId: string,
    userId: string,
    userName: string,
    onPresenceSync: (state: Record<string, { cursor_x: number; cursor_y: number; name: string }[]>) => void
) {
    const channel = supabase.channel(`room:${boardId}`, {
        config: {
            presence: {
                key: userId,
            },
        },
    });

    channel
        .on('presence', { event: 'sync' }, () => {
            const state = channel.presenceState();
            onPresenceSync(state as Record<string, { cursor_x: number; cursor_y: number; name: string }[]>);
        })
        .subscribe(async (status) => {
            if (status === 'SUBSCRIBED') {
                await channel.track({
                    cursor_x: 0,
                    cursor_y: 0,
                    name: userName,
                    online_at: new Date().toISOString(),
                });
            }
        });

    const updatePosition = (cursorX: number, cursorY: number) => {
        channel.track({
            cursor_x: cursorX,
            cursor_y: cursorY,
            name: userName,
            online_at: new Date().toISOString(),
        });
    };

    const cleanup = () => {
        supabase.removeChannel(channel);
    };

    return { updatePosition, cleanup };
}
