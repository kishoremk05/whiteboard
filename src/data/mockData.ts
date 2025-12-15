import type { Board, Tag, User, Organization, Template } from '../types';

// Tags defined first as they're used in generateBoards
export const mockTags: Tag[] = [
    { id: 'tag-1', name: 'Work', color: '#6366f1', createdAt: new Date().toISOString() },
    { id: 'tag-2', name: 'Personal', color: '#10b981', createdAt: new Date().toISOString() },
    { id: 'tag-3', name: 'Important', color: '#f43f5e', createdAt: new Date().toISOString() },
    { id: 'tag-4', name: 'Ideas', color: '#f59e0b', createdAt: new Date().toISOString() },
    { id: 'tag-5', name: 'Archive', color: '#64748b', createdAt: new Date().toISOString() },
    { id: 'tag-6', name: 'Design', color: '#a855f7', createdAt: new Date().toISOString() },
    { id: 'tag-7', name: 'Development', color: '#06b6d4', createdAt: new Date().toISOString() },
    { id: 'tag-8', name: 'Marketing', color: '#ec4899', createdAt: new Date().toISOString() },
];

// Generate a large dataset for testing performance
const generateBoards = (count: number): Board[] => {
    const boards: Board[] = [];
    const titles = [
        'Project Brainstorm', 'Weekly Planning', 'Design System', 'User Research',
        'Sprint Retrospective', 'Product Roadmap', 'Team Standup', 'Feature Planning',
        'Customer Journey', 'Wireframes', 'Architecture Diagram', 'Meeting Notes',
        'Idea Board', 'Mind Map', 'Strategy Session', 'Quarterly Review',
        'Training Materials', 'Process Flow', 'Data Analysis', 'Marketing Plan'
    ];

    const descriptions = [
        'Collaborative workspace for team ideas',
        'Planning and organizing tasks',
        'Visual documentation and notes',
        'Brainstorming session results',
        'Project timeline and milestones'
    ];

    for (let i = 0; i < count; i++) {
        const createdDate = new Date(Date.now() - Math.random() * 90 * 24 * 60 * 60 * 1000);
        const updatedDate = new Date(createdDate.getTime() + Math.random() * 30 * 24 * 60 * 60 * 1000);

        boards.push({
            id: `board-${i + 1}`,
            title: `${titles[i % titles.length]} ${Math.floor(i / titles.length) + 1}`,
            description: descriptions[i % descriptions.length],
            thumbnail: `https://picsum.photos/seed/${i}/400/300`,
            createdAt: createdDate.toISOString(),
            updatedAt: updatedDate.toISOString(),
            ownerId: 'user-1',
            isFavorite: Math.random() > 0.8,
            isDeleted: false,
            tags: i % 3 === 0 ? [mockTags[i % mockTags.length]] : [],
            collaborators: [],
        });
    }

    return boards;
};

export const mockBoards: Board[] = generateBoards(100);

export const mockDeletedBoards: Board[] = [
    {
        id: 'deleted-1',
        title: 'Old Project Notes',
        description: 'Archived project documentation',
        createdAt: new Date(Date.now() - 60 * 24 * 60 * 60 * 1000).toISOString(),
        updatedAt: new Date(Date.now() - 7 * 24 * 60 * 60 * 1000).toISOString(),
        deletedAt: new Date(Date.now() - 7 * 24 * 60 * 60 * 1000).toISOString(),
        ownerId: 'user-1',
        isFavorite: false,
        isDeleted: true,
        tags: [],
        collaborators: [],
    },
    {
        id: 'deleted-2',
        title: 'Draft Ideas',
        description: 'Unused brainstorm results',
        createdAt: new Date(Date.now() - 30 * 24 * 60 * 60 * 1000).toISOString(),
        updatedAt: new Date(Date.now() - 3 * 24 * 60 * 60 * 1000).toISOString(),
        deletedAt: new Date(Date.now() - 3 * 24 * 60 * 60 * 1000).toISOString(),
        ownerId: 'user-1',
        isFavorite: false,
        isDeleted: true,
        tags: [],
        collaborators: [],
    },
];

export const mockUser: User = {
    id: 'user-1',
    email: 'alex@example.com',
    name: 'Alex Johnson',
    avatar: 'https://i.pravatar.cc/150?u=alex',
    bio: 'Product designer passionate about creating intuitive experiences.',
    createdAt: new Date(Date.now() - 365 * 24 * 60 * 60 * 1000).toISOString(),
    updatedAt: new Date().toISOString(),
    subscription: 'pro',
    preferences: {
        theme: 'system',
        language: 'en',
        notifications: {
            email: true,
            push: true,
            updates: false,
        },
        defaultView: 'grid',
    },
};

export const mockOrganizations: Organization[] = [
    {
        id: 'org-1',
        name: 'Acme Design Studio',
        slug: 'acme-design',
        logo: 'https://i.pravatar.cc/150?u=acme',
        createdAt: new Date(Date.now() - 180 * 24 * 60 * 60 * 1000).toISOString(),
        ownerId: 'user-1',
        subscription: 'team',
        members: [
            {
                userId: 'user-1',
                role: 'admin',
                joinedAt: new Date(Date.now() - 180 * 24 * 60 * 60 * 1000).toISOString(),
                user: { id: 'user-1', name: 'Alex Johnson', email: 'alex@example.com', avatar: 'https://i.pravatar.cc/150?u=alex' },
            },
            {
                userId: 'user-2',
                role: 'editor',
                joinedAt: new Date(Date.now() - 90 * 24 * 60 * 60 * 1000).toISOString(),
                user: { id: 'user-2', name: 'Sam Wilson', email: 'sam@example.com', avatar: 'https://i.pravatar.cc/150?u=sam' },
            },
            {
                userId: 'user-3',
                role: 'viewer',
                joinedAt: new Date(Date.now() - 30 * 24 * 60 * 60 * 1000).toISOString(),
                user: { id: 'user-3', name: 'Jordan Lee', email: 'jordan@example.com', avatar: 'https://i.pravatar.cc/150?u=jordan' },
            },
        ],
    },
    {
        id: 'org-2',
        name: 'Personal Workspace',
        slug: 'personal',
        createdAt: new Date(Date.now() - 365 * 24 * 60 * 60 * 1000).toISOString(),
        ownerId: 'user-1',
        subscription: 'free',
        members: [
            {
                userId: 'user-1',
                role: 'admin',
                joinedAt: new Date(Date.now() - 365 * 24 * 60 * 60 * 1000).toISOString(),
                user: { id: 'user-1', name: 'Alex Johnson', email: 'alex@example.com', avatar: 'https://i.pravatar.cc/150?u=alex' },
            },
        ],
    },
];

export const mockTemplates: Template[] = [
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
