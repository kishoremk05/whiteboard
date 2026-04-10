import type { CollaboratorRecord } from '../../types/database.types';

// Mock types
interface CollaboratorRecord {
  id: string;
  whiteboard_id: string;
  user_id: string;
  role: 'editor' | 'viewer' | 'admin';
  created_at: string;
  updated_at: string;
}

/**
 * Collaborator Service
 * Manage board sharing and collaboration
 */

export interface CollaboratorWithUser extends CollaboratorRecord {
    email?: string;
    user_profile?: {
        name: string;
        email: string;
    };
}

/**
 * Fetch all collaborators for a whiteboard
 */
export async function fetchCollaborators(_whiteboardId: string): Promise<CollaboratorWithUser[]> {
    // Mock implementation
    return [];
}

/**
 * Add a collaborator by email
 */
export async function addCollaborator(
    whiteboardId: string,
    email: string,
    role: 'editor' | 'viewer' | 'admin' = 'viewer'
): Promise<CollaboratorRecord> {
    // Mock implementation
    return {
        id: `collab-${Date.now()}`,
        whiteboard_id: whiteboardId,
        user_id: 'mock-user-id',
        role,
        created_at: new Date().toISOString(),
        updated_at: new Date().toISOString()
    };
}

/**
 * Update a collaborator's role
 */
export async function updateCollaboratorRole(id: string, role: 'editor' | 'viewer' | 'admin'): Promise<CollaboratorRecord> {
    // Mock implementation
    return {
        id,
        whiteboard_id: 'mock-whiteboard-id',
        user_id: 'mock-user-id',
        role,
        created_at: new Date().toISOString(),
        updated_at: new Date().toISOString()
    };
}

/**
 * Remove a collaborator
 */
export async function removeCollaborator(id: string): Promise<void> {
    // Mock implementation
    console.log('Mock removeCollaborator:', id);
}

/**
 * Generate an invite code for a whiteboard
 */
export async function generateInviteCode(
    whiteboardId: string,
    role: 'editor' | 'viewer' = 'viewer',
    expiresInHours: number = 24
): Promise<{ inviteCode: string; expiresAt: string }> {
    // Mock implementation
    const inviteCode = `mock-invite-${Date.now()}`;
    const expiresAt = new Date(Date.now() + expiresInHours * 60 * 60 * 1000).toISOString();
    return { inviteCode, expiresAt };
}

/**
 * Join a whiteboard using an invite code
 */
export async function joinByInviteCode(_inviteCode: string, userId: string, _email: string): Promise<CollaboratorRecord> {
    // Mock implementation
    return {
        id: `collab-${Date.now()}`,
        whiteboard_id: 'mock-whiteboard-id',
        user_id: userId,
        role: 'viewer',
        created_at: new Date().toISOString(),
        updated_at: new Date().toISOString()
    };
}

/**
 * Check if a user has access to a whiteboard
 */
export async function checkAccess(
    _whiteboardId: string,
    _userId: string
): Promise<{ hasAccess: boolean; role: string | null }> {
    // Mock implementation - always return owner access
    return { hasAccess: true, role: 'owner' };
}

/**
 * Get all whiteboards a user has access to (owned + shared)
 */
export async function getAccessibleWhiteboards(_userId: string): Promise<string[]> {
    // Mock implementation
    return [];
}
