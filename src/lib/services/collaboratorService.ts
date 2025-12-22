import { supabase } from '../supabase';
import type { CollaboratorRecord, CollaboratorInsert, CollaboratorUpdate } from '../../types/database.types';

/**
 * Collaborator Service
 * Manage board sharing and collaboration
 */

export interface CollaboratorWithUser extends CollaboratorRecord {
    user_profile?: {
        name: string;
        email: string;
    };
}

/**
 * Fetch all collaborators for a whiteboard
 */
export async function fetchCollaborators(whiteboardId: string): Promise<CollaboratorWithUser[]> {
    // First get collaborators
    const { data: collaborators, error: collabError } = await supabase
        .from('collaborators')
        .select('*')
        .eq('whiteboard_id', whiteboardId);

    if (collabError) throw collabError;
    if (!collaborators || collaborators.length === 0) return [];

    // Then manually fetch user profiles for each collaborator
    const userIds = collaborators
        .map(c => c.user_id)
        .filter(Boolean) as string[];

    if (userIds.length === 0) return collaborators as CollaboratorWithUser[];

    const { data: profiles } = await supabase
        .from('user_profiles')
        .select('id, name, email')
        .in('id', userIds);

    // Combine the data
    return collaborators.map(collab => ({
        ...collab,
        user_profile: profiles?.find(p => p.id === collab.user_id) || undefined
    })) as CollaboratorWithUser[];
}

/**
 * Add a collaborator by email
 */
export async function addCollaborator(
    whiteboardId: string,
    email: string,
    role: 'editor' | 'viewer' | 'admin' = 'viewer'
): Promise<CollaboratorRecord> {
    // First, try to find the user by email
    const { data: userProfile } = await supabase
        .from('user_profiles')
        .select('id')
        .eq('email', email)
        .single();

    const collaborator: CollaboratorInsert = {
        whiteboard_id: whiteboardId,
        email,
        role,
        user_id: userProfile?.id || null,
    };

    const { data, error } = await supabase
        .from('collaborators')
        .insert(collaborator)
        .select()
        .single();

    if (error) throw error;
    return data;
}

/**
 * Update a collaborator's role
 */
export async function updateCollaboratorRole(id: string, role: 'editor' | 'viewer' | 'admin'): Promise<CollaboratorRecord> {
    const { data, error } = await supabase
        .from('collaborators')
        .update({ role } as CollaboratorUpdate)
        .eq('id', id)
        .select()
        .single();

    if (error) throw error;
    return data;
}

/**
 * Remove a collaborator
 */
export async function removeCollaborator(id: string): Promise<void> {
    const { error } = await supabase
        .from('collaborators')
        .delete()
        .eq('id', id);

    if (error) throw error;
}

/**
 * Generate an invite code for a whiteboard
 */
export async function generateInviteCode(
    whiteboardId: string,
    role: 'editor' | 'viewer' = 'viewer',
    expiresInHours: number = 24
): Promise<{ inviteCode: string; expiresAt: string }> {
    // Generate a random invite code
    const inviteCode = crypto.randomUUID().replace(/-/g, '').substring(0, 12);
    const expiresAt = new Date(Date.now() + expiresInHours * 60 * 60 * 1000).toISOString();

    // Create a placeholder collaborator entry with the invite code
    const { error } = await supabase
        .from('collaborators')
        .insert({
            whiteboard_id: whiteboardId,
            role,
            invite_code: inviteCode,
            invite_code_expires_at: expiresAt,
        });

    if (error) throw error;

    return { inviteCode, expiresAt };
}

/**
 * Join a whiteboard using an invite code
 */
export async function joinByInviteCode(inviteCode: string, userId: string, email: string): Promise<CollaboratorRecord> {
    // Find the invite
    const { data: invite, error: findError } = await supabase
        .from('collaborators')
        .select('*')
        .eq('invite_code', inviteCode)
        .single();

    if (findError) throw new Error('Invalid invite code');
    if (!invite) throw new Error('Invite code not found');

    // Check if expired
    if (invite.invite_code_expires_at && new Date(invite.invite_code_expires_at) < new Date()) {
        throw new Error('Invite code has expired');
    }

    // Update the collaborator record with user info
    const { data, error } = await supabase
        .from('collaborators')
        .update({
            user_id: userId,
            email,
            invite_code: null, // Clear the invite code after use
            invite_code_expires_at: null,
        })
        .eq('id', invite.id)
        .select()
        .single();

    if (error) throw error;
    return data;
}

/**
 * Check if a user has access to a whiteboard
 */
export async function checkAccess(
    whiteboardId: string,
    userId: string
): Promise<{ hasAccess: boolean; role: string | null }> {
    // First check if user is the owner
    const { data: whiteboard } = await supabase
        .from('whiteboards')
        .select('user_id')
        .eq('id', whiteboardId)
        .single();

    if (whiteboard?.user_id === userId) {
        return { hasAccess: true, role: 'owner' };
    }

    // Check collaborators
    const { data: collaborator } = await supabase
        .from('collaborators')
        .select('role')
        .eq('whiteboard_id', whiteboardId)
        .eq('user_id', userId)
        .single();

    if (collaborator) {
        return { hasAccess: true, role: collaborator.role };
    }

    return { hasAccess: false, role: null };
}

/**
 * Get all whiteboards a user has access to (owned + shared)
 */
export async function getAccessibleWhiteboards(userId: string): Promise<string[]> {
    // Get owned whiteboards
    const { data: owned } = await supabase
        .from('whiteboards')
        .select('id')
        .eq('user_id', userId);

    // Get shared whiteboards
    const { data: shared } = await supabase
        .from('collaborators')
        .select('whiteboard_id')
        .eq('user_id', userId);

    const ownedIds = (owned || []).map(w => w.id);
    const sharedIds = (shared || []).map(c => c.whiteboard_id).filter(Boolean) as string[];

    return [...new Set([...ownedIds, ...sharedIds])];
}
