import { templates } from "../../data/mockData";
import type { DbTemplate, WhiteboardInsert } from "../../types/database.types";
import { createWhiteboard } from "./whiteboardService";

const toDbTemplate = (template: {
  id: string;
  name: string;
  description: string;
  category: string;
  thumbnail: string;
}): DbTemplate => ({
  id: template.id,
  name: template.name,
  description: template.description,
  category: template.category,
  preview: template.thumbnail,
  data: {},
  created_at: new Date().toISOString(),
  updated_at: new Date().toISOString(),
});

export async function fetchTemplates(): Promise<DbTemplate[]> {
  return templates.map(toDbTemplate);
}

export async function fetchTemplatesByCategory(
  category: string,
): Promise<DbTemplate[]> {
  return templates.filter((t) => t.category === category).map(toDbTemplate);
}

export async function fetchTemplate(id: string): Promise<DbTemplate | null> {
  const template = templates.find((t) => t.id === id);
  return template ? toDbTemplate(template) : null;
}

export async function getTemplateCategories(): Promise<string[]> {
  return [...new Set(templates.map((t) => t.category))].sort();
}

export async function createFromTemplate(
  templateId: string,
  userId: string,
  title?: string,
): Promise<Awaited<ReturnType<typeof createWhiteboard>>> {
  const template = await fetchTemplate(templateId);
  if (!template) throw new Error("Template not found");

  const whiteboard: WhiteboardInsert = {
    title: title || template.name || "Untitled Board",
    data: template.data,
    preview: template.preview,
    user_id: userId,
    folder_id: null,
  };

  return createWhiteboard(whiteboard);
}

export async function searchTemplates(query: string): Promise<DbTemplate[]> {
  const lower = query.toLowerCase();
  return templates
    .filter(
      (t) =>
        t.name.toLowerCase().includes(lower) ||
        t.description.toLowerCase().includes(lower),
    )
    .map(toDbTemplate);
}
