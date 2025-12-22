/**
 * Supabase Database Types
 * These types match the Supabase PostgreSQL schema
 */

// ============================================================================
// User & Authentication
// ============================================================================

export interface UserProfile {
    id: string; // uuid, primary key
    email: string | null;
    name: string | null;
    is_admin: boolean | null;
    is_suspended: boolean | null;
    metadata: Record<string, unknown> | null; // jsonb
    last_login_at: string | null; // timestamp
    created_at: string | null; // timestamp
    updated_at: string | null; // timestamp
}

export interface LoginActivity {
    id: string; // uuid, primary key
    user_id: string | null; // uuid
    ip_address: string | null;
    user_agent: string | null;
    device_fingerprint: string | null;
    trusted_device: boolean | null;
    login_at: string | null; // timestamp
}

export interface TrustedDevice {
    id: string; // uuid, primary key
    user_id: string | null; // uuid
    device_fingerprint: string | null;
    device_name: string | null;
    last_used_at: string | null; // timestamp
    created_at: string | null; // timestamp
}

// ============================================================================
// Whiteboards & Folders
// ============================================================================

export interface DbWhiteboard {
    id: string; // uuid, primary key
    title: string | null;
    data: Record<string, unknown> | null; // jsonb - stores tldraw snapshot
    preview: string | null; // text - base64 image or URL
    user_id: string | null; // uuid - owner
    folder_id: string | null; // uuid
    metadata: Record<string, unknown> | null; // jsonb - for favorites, tags, etc
    created_at: string | null; // timestamp
    updated_at: string | null; // timestamp
}

export interface Folder {
    id: string; // uuid, primary key
    name: string | null;
    user_id: string | null; // uuid
    created_at: string | null; // timestamp
    updated_at: string | null; // timestamp
}

// ============================================================================
// Collaboration
// ============================================================================

export interface CollaboratorRecord {
    id: string; // uuid, primary key
    whiteboard_id: string | null; // uuid
    user_id: string | null; // uuid
    email: string | null;
    role: 'editor' | 'viewer' | 'admin' | null;
    invite_code: string | null; // varchar
    invite_code_expires_at: string | null; // timestamp
    invited_at: string | null; // timestamp
}

export interface BoardPresence {
    id: string; // uuid, primary key
    board_id: string | null; // text
    user_id: string | null; // uuid
    cursor_x: number | null; // double
    cursor_y: number | null; // double
    last_seen_at: string | null; // timestamp
    created_at: string | null; // timestamp
}

// ============================================================================
// Comments & Activity
// ============================================================================

export interface BoardComment {
    id: string; // uuid, primary key
    board_id: string | null; // text
    user_id: string | null; // uuid
    content: string | null;
    position_x: number | null; // double
    position_y: number | null; // double
    resolved: boolean | null;
    created_at: string | null; // timestamp
    updated_at: string | null; // timestamp
}

export interface BoardActivity {
    id: string; // uuid, primary key
    board_id: string | null; // text
    user_id: string | null; // uuid
    action_type: string | null;
    snapshot_data: Record<string, unknown> | null; // jsonb
    created_at: string | null; // timestamp
}

// ============================================================================
// Templates
// ============================================================================

export interface DbTemplate {
    id: string; // uuid, primary key
    name: string | null;
    description: string | null;
    category: string | null;
    preview: string | null;
    data: Record<string, unknown> | null; // jsonb
    created_at: string | null; // timestamp
}

// ============================================================================
// Subscriptions & Usage
// ============================================================================

export interface Subscription {
    id: string; // uuid, primary key
    user_id: string | null; // uuid
    plan_id: string | null;
    status: string | null;
    stripe_customer_id: string | null;
    stripe_subscription_id: string | null;
    current_period_start: string | null; // timestamp
    current_period_end: string | null; // timestamp
    cancel_at_period_end: boolean | null;
    upgraded_by_admin: string | null; // uuid
    upgraded_at: string | null; // timestamp
    created_at: string | null; // timestamp
    updated_at: string | null; // timestamp
}

export interface UsageTracking {
    id: string; // uuid, primary key
    user_id: string | null; // uuid
    period_start: string | null; // timestamp
    period_end: string | null; // timestamp
    whiteboards_count: number | null; // integer
    ai_generations_count: number | null; // integer
    created_at: string | null; // timestamp
    updated_at: string | null; // timestamp
}

// ============================================================================
// Admin & Logging
// ============================================================================

export interface AdminLog {
    id: string; // uuid, primary key
    admin_user_id: string | null; // uuid
    action: string | null;
    target_user_id: string | null; // uuid
    details: Record<string, unknown> | null; // jsonb
    ip_address: string | null;
    created_at: string | null; // timestamp
}

export interface ErrorLog {
    id: string; // uuid, primary key
    user_id: string | null; // uuid
    error_type: string | null;
    error_message: string | null;
    stack_trace: string | null;
    endpoint: string | null;
    details: Record<string, unknown> | null; // jsonb
    created_at: string | null; // timestamp
}

export interface SystemMetric {
    id: string; // uuid, primary key
    metric_type: string | null;
    metric_value: number | null; // numeric
    details: Record<string, unknown> | null; // jsonb
    recorded_at: string | null; // timestamp
}

// ============================================================================
// Insert/Update Types (for mutations)
// ============================================================================

export type WhiteboardInsert = Omit<DbWhiteboard, 'id' | 'created_at' | 'updated_at' | 'metadata'> & {
    id?: string;
    created_at?: string;
    updated_at?: string;
    metadata?: Record<string, unknown> | null;
};

export type WhiteboardUpdate = Partial<Omit<DbWhiteboard, 'id' | 'created_at'>>;

export type CommentInsert = Omit<BoardComment, 'id' | 'created_at' | 'updated_at'> & {
    id?: string;
    created_at?: string;
    updated_at?: string;
};

export type CommentUpdate = Partial<Omit<BoardComment, 'id' | 'created_at'>>;

export type CollaboratorInsert = Partial<Omit<CollaboratorRecord, 'id' | 'invited_at'>> & {
    id?: string;
    invited_at?: string;
    whiteboard_id?: string;
};

export type CollaboratorUpdate = Partial<Omit<CollaboratorRecord, 'id' | 'invited_at'>>;

export type FolderInsert = Omit<Folder, 'id' | 'created_at' | 'updated_at'> & {
    id?: string;
    created_at?: string;
    updated_at?: string;
};

export type FolderUpdate = Partial<Omit<Folder, 'id' | 'created_at'>>;
