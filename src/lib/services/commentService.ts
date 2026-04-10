import type {
  BoardComment,
  CommentInsert,
  CommentUpdate,
} from "../../types/database.types";

const commentsByBoard = new Map<string, BoardComment[]>();

type CommentWithUser = BoardComment & {
  user_profile?: { name: string; email: string };
};

export async function fetchComments(boardId: string): Promise<BoardComment[]> {
  return commentsByBoard.get(boardId) || [];
}

export async function fetchCommentsWithUsers(
  boardId: string,
): Promise<CommentWithUser[]> {
  return (commentsByBoard.get(boardId) || []).map((comment) => ({
    ...comment,
    user_profile: { name: "Collaborator", email: "collaborator@example.com" },
  }));
}

export async function createComment(comment: CommentInsert): Promise<BoardComment> {
  const now = new Date().toISOString();
  const created: BoardComment = {
    id: `comment-${Date.now()}`,
    board_id: comment.board_id,
    user_id: comment.user_id,
    content: comment.content,
    resolved: comment.resolved ?? false,
    created_at: now,
    updated_at: now,
  };

  const existing = commentsByBoard.get(comment.board_id) || [];
  commentsByBoard.set(comment.board_id, [...existing, created]);
  return created;
}

export async function updateComment(
  id: string,
  updates: CommentUpdate,
): Promise<BoardComment> {
  for (const [boardId, comments] of commentsByBoard.entries()) {
    const idx = comments.findIndex((c) => c.id === id);
    if (idx >= 0) {
      const next: BoardComment = {
        ...comments[idx],
        ...updates,
        updated_at: new Date().toISOString(),
      };
      const cloned = [...comments];
      cloned[idx] = next;
      commentsByBoard.set(boardId, cloned);
      return next;
    }
  }

  throw new Error("Comment not found");
}

export async function resolveComment(id: string): Promise<BoardComment> {
  return updateComment(id, { resolved: true });
}

export async function unresolveComment(id: string): Promise<BoardComment> {
  return updateComment(id, { resolved: false });
}

export async function deleteComment(id: string): Promise<void> {
  for (const [boardId, comments] of commentsByBoard.entries()) {
    const next = comments.filter((c) => c.id !== id);
    if (next.length !== comments.length) {
      commentsByBoard.set(boardId, next);
      return;
    }
  }
}

export async function getUnresolvedCount(boardId: string): Promise<number> {
  return (commentsByBoard.get(boardId) || []).filter((c) => !c.resolved).length;
}

export function subscribeToComments(
  _boardId: string,
  _onInsert: (comment: BoardComment) => void,
  _onUpdate: (comment: BoardComment) => void,
  _onDelete: (id: string) => void,
) {
  return () => {};
}
