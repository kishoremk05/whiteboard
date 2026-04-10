import type {
  DbWhiteboard,
  WhiteboardInsert,
  WhiteboardUpdate,
} from "../../types/database.types";

const whiteboards: DbWhiteboard[] = [];

const byUpdatedDesc = (a: DbWhiteboard, b: DbWhiteboard) =>
  new Date(b.updated_at).getTime() - new Date(a.updated_at).getTime();

export async function fetchUserWhiteboards(userId: string): Promise<DbWhiteboard[]> {
  return whiteboards
    .filter((w) => w.user_id === userId && !w.is_deleted)
    .sort(byUpdatedDesc);
}

export async function fetchSharedWhiteboards(_userId: string): Promise<DbWhiteboard[]> {
  return [];
}

export async function fetchWhiteboard(id: string): Promise<DbWhiteboard | null> {
  return whiteboards.find((w) => w.id === id) || null;
}

export async function createWhiteboard(
  whiteboard: WhiteboardInsert,
): Promise<DbWhiteboard> {
  const now = new Date().toISOString();
  const created: DbWhiteboard = {
    id: `wb-${Date.now()}`,
    title: whiteboard.title,
    data: whiteboard.data,
    preview: whiteboard.preview,
    user_id: whiteboard.user_id,
    folder_id: whiteboard.folder_id,
    metadata: whiteboard.metadata,
    created_at: now,
    updated_at: now,
    is_deleted: false,
    deleted_at: null,
  };

  whiteboards.unshift(created);
  return created;
}

export async function updateWhiteboard(
  id: string,
  updates: WhiteboardUpdate,
): Promise<DbWhiteboard> {
  const index = whiteboards.findIndex((w) => w.id === id);
  if (index < 0) throw new Error(`Could not update board: Board ${id} not found`);

  const next: DbWhiteboard = {
    ...whiteboards[index],
    ...updates,
    updated_at: new Date().toISOString(),
  };

  whiteboards[index] = next;
  return next;
}

export async function deleteWhiteboard(id: string): Promise<DbWhiteboard> {
  return updateWhiteboard(id, {
    is_deleted: true,
    deleted_at: new Date().toISOString(),
  });
}

export async function restoreWhiteboard(id: string): Promise<DbWhiteboard> {
  return updateWhiteboard(id, {
    is_deleted: false,
    deleted_at: null,
  });
}

export async function permanentlyDeleteWhiteboard(id: string): Promise<void> {
  const index = whiteboards.findIndex((w) => w.id === id);
  if (index >= 0) {
    whiteboards.splice(index, 1);
  }
}

export async function fetchDeletedWhiteboards(
  userId: string,
): Promise<DbWhiteboard[]> {
  return whiteboards
    .filter((w) => w.user_id === userId && Boolean(w.is_deleted))
    .sort(byUpdatedDesc);
}

export async function duplicateWhiteboard(
  id: string,
  userId: string,
): Promise<DbWhiteboard> {
  const original = await fetchWhiteboard(id);
  if (!original) throw new Error("Whiteboard not found");

  return createWhiteboard({
    title: `${original.title || "Untitled"} (Copy)`,
    data: original.data,
    preview: original.preview,
    user_id: userId,
    folder_id: original.folder_id,
    metadata: original.metadata || null,
  });
}

export async function fetchWhiteboardsByFolder(
  folderId: string,
): Promise<DbWhiteboard[]> {
  return whiteboards
    .filter((w) => w.folder_id === folderId && !w.is_deleted)
    .sort(byUpdatedDesc);
}

export async function moveToFolder(
  whiteboardId: string,
  folderId: string | null,
): Promise<DbWhiteboard> {
  return updateWhiteboard(whiteboardId, { folder_id: folderId });
}

export async function searchWhiteboards(
  userId: string,
  query: string,
): Promise<DbWhiteboard[]> {
  const lower = query.toLowerCase();
  return whiteboards
    .filter(
      (w) =>
        w.user_id === userId &&
        !w.is_deleted &&
        (w.title || "").toLowerCase().includes(lower),
    )
    .sort(byUpdatedDesc);
}
