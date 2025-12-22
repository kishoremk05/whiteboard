// Template content - Stores metadata and instructions for each template
// The actual canvas content is managed by tldraw
export const templateContent: Record<string, Record<string, unknown>> = {
    'template-blank': {},

    'template-math': {
        templateType: 'math',
        name: 'Math & Equations',
        description: 'Pre-configured for mathematical work',
    },

    'template-physics': {
        templateType: 'physics',
        name: 'Physics Diagrams',
        description: 'Tools for physics diagrams and vectors',
    },

    'template-brainstorm': {
        templateType: 'brainstorm',
        name: 'Brainstorming',
        description: 'Ideal for mind mapping and idea generation',
    },

    'template-teaching': {
        templateType: 'teaching',
        name: 'Teaching & Lectures',
        description: 'Perfect for lesson planning and presentations',
    },

    'template-meeting': {
        templateType: 'meeting',
        name: 'Meeting Notes',
        description: 'Structured format for meeting notes',
    },

    'template-wireframe': {
        templateType: 'wireframe',
        name: 'Wireframe',
        description: 'UI/UX design and mockups',
    },

    'template-kanban': {
        templateType: 'kanban',
        name: 'Kanban Board',
        description: 'Task management board',
    },
};

// Helper to check if template exists
export const hasTemplateContent = (templateId: string): boolean => {
    return templateId in templateContent;
};
