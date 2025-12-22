export interface User {
    id: string;
    email: string;
    name: string;
    avatar?: string;
    bio?: string;
    createdAt: string;
    updatedAt: string;
    subscription: 'free' | 'pro' | 'team';
    preferences: UserPreferences;
}

export interface UserPreferences {
    theme: 'light' | 'dark' | 'system';
    language: string;
    notifications: {
        email: boolean;
        push: boolean;
        updates: boolean;
    };
    defaultView: 'grid' | 'list';
}

export interface Tag {
    id: string;
    name: string;
    color: string;
    createdAt: string;
}

export interface Collaborator {
    userId: string;
    role: 'owner' | 'editor' | 'viewer';
    user: Pick<User, 'id' | 'name' | 'email' | 'avatar'>;
}

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
    tags: Tag[];
    collaborators: Collaborator[];
    template?: string;
    data?: unknown;
    isShared?: boolean;
}

// Re-export database types
export * from './database.types';

export interface OrganizationMember {
    userId: string;
    role: 'admin' | 'editor' | 'viewer';
    joinedAt: string;
    user: Pick<User, 'id' | 'name' | 'email' | 'avatar'>;
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

export interface Template {
    id: string;
    name: string;
    description: string;
    thumbnail: string;
    category: 'general' | 'education' | 'business' | 'creative';
    data?: unknown;
}

export interface SearchResult {
    type: 'board' | 'tag' | 'action';
    id: string;
    title: string;
    subtitle?: string;
    icon?: string;
    action?: () => void;
}

export interface ExportOptions {
    format: 'pdf' | 'png' | 'svg';
    quality?: 'low' | 'medium' | 'high';
    background?: boolean;
    scale?: number;
}

export interface Notification {
    id: string;
    type: 'info' | 'success' | 'warning' | 'error';
    title: string;
    message?: string;
    createdAt: string;
    read: boolean;
}

export interface TeamInvitation {
    id: string;
    organizationId: string;
    organizationName?: string;
    organizationLogo?: string;
    inviterId: string;
    inviterName?: string;
    inviteeEmail: string;
    inviteeId?: string;
    role: 'admin' | 'editor' | 'viewer';
    status: 'pending' | 'accepted' | 'declined' | 'cancelled';
    inviteToken?: string;
    expiresAt?: string;
    createdAt: string;
    updatedAt: string;
}

