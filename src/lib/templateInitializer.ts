/**
 * Template Initializer - Excalidraw Version
 * 
 * Temporary stub - templates disabled during TLDraw -> Excalidraw migration
 * Will be reimplemented with Excalidraw elements
 */

export type TemplateId =
    | 'template-blank'
    | 'template-brainstorming'
    | 'template-flowchart'
    | 'template-wireframe'
    | 'template-mind-map'
    | 'template-kanban'
    | 'template-timeline'
    | 'template-math'
    | 'template-org-chart'
    | 'template-network'
    | 'template-process';

/**
 * Get initial board data for a template
 * @param templateId - The template identifier
 * @returns Empty object for now (templates to be reimplemented)
 */
export function getTemplateInitialData(templateId: TemplateId): Record<string, any> {
    console.log(`[Template] Template ${templateId} requested - returning empty data (migration in progress)`);

    // Return empty data - templates will be reimplemented with Excalidraw
    return {};
}

/**
 * Check if a template has pre-populated content
 * @param templateId - The template identifier
 * @returns false for now (templates to be reimplemented for Excalidraw)
 */
export function hasTemplateContent(templateId: string): boolean {
    console.log(`[Template] Checking template content for ${templateId} - returning false (migration in progress)`);
    // All templates return false during migration - content will be reimplemented for Excalidraw
    return false;
}

/**
 * Get template content (Excalidraw elements)
 * @param templateId - The template identifier
 * @returns Empty object for now (templates to be reimplemented)
 */
export function getTemplateContent(templateId: string): Record<string, any> {
    console.log(`[Template] Getting template content for ${templateId} - returning empty (migration in progress)`);
    // Return empty content - templates will be reimplemented with Excalidraw elements
    return {
        elements: [],
        appState: {},
        version: 2,
    };
}

// Export template metadata
export const TEMPLATE_METADATA: Record<TemplateId, { name: string; description: string }> = {
    'template-blank': {
        name: 'Blank Canvas',
        description: 'Start with an empty whiteboard'
    },
    'template-brainstorming': {
        name: 'Brainstorming',
        description: 'Organize ideas and concepts'
    },
    'template-flowchart': {
        name: 'Flowchart',
        description: 'Create process flows'
    },
    'template-wireframe': {
        name: 'Wireframe',
        description: 'Design UI layouts'
    },
    'template-mind-map': {
        name: 'Mind Map',
        description: 'Visual thinking tool'
    },
    'template-kanban': {
        name: 'Kanban Board',
        description: 'Task management'
    },
    'template-timeline': {
        name: 'Timeline',
        description: 'Project planning'
    },
    'template-math': {
        name: 'Math Equation',
        description: 'Mathematical notation'
    },
    'template-org-chart': {
        name: 'Org Chart',
        description: 'Organizational structure'
    },
    'template-network': {
        name: 'Network Diagram',
        description: 'System architecture'
    },
    'template-process': {
        name: 'Process Map',
        description: 'Workflow visualization'
    }
};
