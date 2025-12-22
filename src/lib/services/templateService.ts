import { supabase } from '../supabase';
import type { DbTemplate, WhiteboardInsert } from '../../types/database.types';
import { createWhiteboard } from './whiteboardService';

/**
 * Template Service
 * Fetch templates and create boards from templates
 */

/**
 * Fetch all templates
 */
export async function fetchTemplates(): Promise<DbTemplate[]> {
    const { data, error } = await supabase
        .from('templates')
        .select('*')
        .order('name', { ascending: true });

    if (error) throw error;
    return data || [];
}

/**
 * Fetch templates by category
 */
export async function fetchTemplatesByCategory(category: string): Promise<DbTemplate[]> {
    const { data, error } = await supabase
        .from('templates')
        .select('*')
        .eq('category', category)
        .order('name', { ascending: true });

    if (error) throw error;
    return data || [];
}

/**
 * Fetch a single template by ID
 */
export async function fetchTemplate(id: string): Promise<DbTemplate | null> {
    const { data, error } = await supabase
        .from('templates')
        .select('*')
        .eq('id', id)
        .single();

    if (error) {
        if (error.code === 'PGRST116') return null;
        throw error;
    }
    return data;
}

/**
 * Get unique template categories
 */
export async function getTemplateCategories(): Promise<string[]> {
    const { data, error } = await supabase
        .from('templates')
        .select('category')
        .not('category', 'is', null);

    if (error) throw error;

    const categories = [...new Set((data || []).map(t => t.category).filter(Boolean))] as string[];
    return categories.sort();
}

/**
 * Create a whiteboard from a template
 */
export async function createFromTemplate(
    templateId: string,
    userId: string,
    title?: string
): Promise<Awaited<ReturnType<typeof createWhiteboard>>> {
    // Fetch the template
    const template = await fetchTemplate(templateId);
    if (!template) throw new Error('Template not found');

    // Create whiteboard with template data
    const whiteboard: WhiteboardInsert = {
        title: title || template.name || 'Untitled Board',
        data: template.data,
        preview: template.preview,
        user_id: userId,
        folder_id: null,
    };

    return createWhiteboard(whiteboard);
}

/**
 * Search templates by name or description
 */
export async function searchTemplates(query: string): Promise<DbTemplate[]> {
    const { data, error } = await supabase
        .from('templates')
        .select('*')
        .or(`name.ilike.%${query}%,description.ilike.%${query}%`)
        .order('name', { ascending: true });

    if (error) throw error;
    return data || [];
}
