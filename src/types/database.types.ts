export interface DbWhiteboard {
  id: string;
  title: string;
  preview?: string | null;
  created_at: string;
  updated_at: string;
  user_id: string;
  folder_id?: string | null;
  is_deleted?: boolean | null;
  deleted_at?: string | null;
  metadata?: Record<string, unknown> | null;
  data?: unknown;
}

export interface WhiteboardInsert {
  title: string;
  user_id: string;
  data?: unknown;
  preview?: string | null;
  folder_id?: string | null;
  metadata?: Record<string, unknown> | null;
}

export type WhiteboardUpdate = Partial<
  Omit<DbWhiteboard, "id" | "created_at" | "user_id">
>;

export interface DbTemplate {
  id: string;
  name: string;
  description?: string | null;
  category?: string | null;
  preview?: string | null;
  data?: unknown;
  created_at?: string;
  updated_at?: string;
}

export interface BoardComment {
  id: string;
  board_id: string;
  user_id: string;
  content: string;
  resolved?: boolean;
  created_at: string;
  updated_at: string;
}

export interface CommentInsert {
  board_id: string;
  user_id: string;
  content: string;
  resolved?: boolean;
}

export interface CommentUpdate {
  content?: string;
  resolved?: boolean;
  updated_at?: string;
}

export interface BoardPresence {
  id: string;
  board_id: string;
  user_id: string;
  cursor_x: number;
  cursor_y: number;
  last_seen_at: string;
}

export interface CollaboratorRecord {
  id: string;
  whiteboard_id: string;
  user_id: string;
  role: "editor" | "viewer" | "admin";
  created_at: string;
  updated_at: string;
}

export interface Folder {
  id: string;
  name: string;
  user_id: string;
  created_at: string;
  updated_at: string;
}

export interface FolderInsert {
  name: string;
  user_id: string;
}
