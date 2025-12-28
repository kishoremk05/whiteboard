/**
 * Template Initializer - TLDraw Version
 * 
 * Provides template shapes and content for TLDraw whiteboards
 */

export type TemplateId =
    | 'template-blank'
    | 'template-brainstorming'
    | 'template-brainstorm'
    | 'template-flowchart'
    | 'template-wireframe'
    | 'template-mind-map'
    | 'template-mindmap'
    | 'template-kanban'
    | 'template-timeline'
    | 'template-math'
    | 'template-org-chart'
    | 'template-network'
    | 'template-process'
    | 'template-calculus'
    | 'template-quadratic';

/**
 * Check if a template has pre-populated content
 * @param templateId - The template identifier
 * @returns true if template has content, false for blank templates
 */
export function hasTemplateContent(templateId: string): boolean {
    if (templateId === 'template-blank') {
        return false;
    }
    return false; // Templates start empty, users add via Library button
}

/**
 * Get template content
 * @param templateId - The template identifier
 * @returns Empty shapes array
 */
export function getTemplateContent(templateId: string): { shapes: unknown[] } {
    console.log(`[Template] Getting content for template: ${templateId}`);
    return { shapes: [] };
}

/**
 * Get initial board data for a template
 * @param templateId - The template identifier
 * @returns Board data with shapes
 */
export function getTemplateInitialData(templateId: TemplateId): Record<string, unknown> {
    console.log(`[Template] Getting initial data for template: ${templateId}`);
    return { shapes: [], version: 1 };
}

// Export template metadata
export const TEMPLATE_METADATA: Record<string, { name: string; description: string }> = {
    'template-blank': { name: 'Blank Canvas', description: 'Start with an empty whiteboard' },
    'template-brainstorming': { name: 'Brainstorming', description: 'Organize ideas and concepts' },
    'template-brainstorm': { name: 'Brainstorming', description: 'Organize ideas and concepts' },
    'template-flowchart': { name: 'Flowchart', description: 'Create process flows' },
    'template-wireframe': { name: 'Wireframe', description: 'Design UI layouts' },
    'template-mind-map': { name: 'Mind Map', description: 'Visual thinking tool' },
    'template-mindmap': { name: 'Mind Map', description: 'Visual thinking tool' },
    'template-kanban': { name: 'Kanban Board', description: 'Task management' },
    'template-timeline': { name: 'Timeline', description: 'Project planning' },
    'template-math': { name: 'Math Equation', description: 'Mathematical notation' },
    'template-calculus': { name: 'Calculus', description: 'Derivatives and integrals' },
    'template-quadratic': { name: 'Quadratic', description: 'Quadratic equations' },
    'template-org-chart': { name: 'Org Chart', description: 'Organizational structure' },
    'template-network': { name: 'Network Diagram', description: 'System architecture' },
    'template-process': { name: 'Process Map', description: 'Workflow visualization' }
};
