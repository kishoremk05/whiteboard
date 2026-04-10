import type { BoardPresence } from "../../types/database.types";

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

const presenceByBoard = new Map<string, BoardPresence[]>();

export async function getBoardPresence(boardId: string): Promise<BoardPresence[]> {
  return presenceByBoard.get(boardId) || [];
}

export async function getBoardPresenceWithUsers(
  boardId: string,
): Promise<PresenceUser[]> {
  return (presenceByBoard.get(boardId) || []).map((presence) => ({
    ...presence,
    user_profile: {
      name: "Active User",
      email: "user@example.com",
    },
  }));
}

export async function joinBoard(
  boardId: string,
  userId: string,
): Promise<BoardPresence> {
  const now = new Date().toISOString();
  const current = presenceByBoard.get(boardId) || [];
  const existing = current.find((p) => p.user_id === userId);

  const joined: BoardPresence =
    existing || {
      id: `presence-${Date.now()}`,
      board_id: boardId,
      user_id: userId,
      cursor_x: 0,
      cursor_y: 0,
      last_seen_at: now,
    };

  const next = [...current.filter((p) => p.user_id !== userId), joined];
  presenceByBoard.set(boardId, next);
  return joined;
}

export async function leaveBoard(boardId: string, userId: string): Promise<void> {
  const current = presenceByBoard.get(boardId) || [];
  presenceByBoard.set(
    boardId,
    current.filter((p) => p.user_id !== userId),
  );
}

export async function updateCursorPosition(
  boardId: string,
  userId: string,
  cursorX: number,
  cursorY: number,
): Promise<void> {
  const current = presenceByBoard.get(boardId) || [];
  const now = new Date().toISOString();
  const existing = current.find((p) => p.user_id === userId);

  const updated: BoardPresence = existing
    ? {
        ...existing,
        cursor_x: cursorX,
        cursor_y: cursorY,
        last_seen_at: now,
      }
    : {
        id: `presence-${Date.now()}`,
        board_id: boardId,
        user_id: userId,
        cursor_x: cursorX,
        cursor_y: cursorY,
        last_seen_at: now,
      };

  const next = [...current.filter((p) => p.user_id !== userId), updated];
  presenceByBoard.set(boardId, next);
}

export function subscribeToPresence(
  _boardId: string,
  _onPresenceChange: (presences: BoardPresence[]) => void,
) {
  return () => {};
}

export function useBroadcastPresence(
  _boardId: string,
  _userId: string,
  _userName: string,
  _onPresenceSync: (
    state: Record<string, { cursor_x: number; cursor_y: number; name: string }[]>,
  ) => void,
) {
  const updatePosition = (_cursorX: number, _cursorY: number) => {};
  const cleanup = () => {};
  return { updatePosition, cleanup };
}
