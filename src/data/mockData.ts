import type { Template } from '../types';

// Templates represent available app features, not dummy user data
export const templates: Template[] = [
    {
        id: 'template-blank',
        name: 'Blank Canvas',
        description: 'Start with a clean slate. Perfect for any project.',
        thumbnail: '/templates/blank.svg',
        category: 'general',
    },
    {
        id: 'template-math',
        name: 'Math & Equations',
        description: 'Pre-configured grid with math tools and equation support.',
        thumbnail: '/templates/math.svg',
        category: 'education',
    },
    {
        id: 'template-physics',
        name: 'Physics Diagrams',
        description: 'Tools for drawing physics diagrams, vectors, and circuits.',
        thumbnail: '/templates/physics.svg',
        category: 'education',
    },
    {
        id: 'template-brainstorm',
        name: 'Brainstorming',
        description: 'Mind mapping layout with sticky notes and connectors.',
        thumbnail: '/templates/brainstorm.svg',
        category: 'creative',
    },
    {
        id: 'template-teaching',
        name: 'Teaching & Lectures',
        description: 'Presentation-ready layout with sections and annotations.',
        thumbnail: '/templates/teaching.svg',
        category: 'education',
    },
    {
        id: 'template-meeting',
        name: 'Meeting Notes',
        description: 'Structured layout for agendas, notes, and action items.',
        thumbnail: '/templates/meeting.svg',
        category: 'business',
    },
    {
        id: 'template-wireframe',
        name: 'Wireframing',
        description: 'UI components and grids for quick wireframing.',
        thumbnail: '/templates/wireframe.svg',
        category: 'creative',
    },
    {
        id: 'template-kanban',
        name: 'Kanban Board',
        description: 'Visual task management with columns and cards.',
        thumbnail: '/templates/kanban.svg',
        category: 'business',
    },
];
