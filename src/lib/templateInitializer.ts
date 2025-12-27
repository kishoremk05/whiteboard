import { createShapeId, type TLRecord, type TLShapeId } from '@tldraw/tldraw';

/**
 * Template Initializer
 * 
 * Generates pre-populated tldraw content for each template type.
 * Each template creates actual TLRecord objects (shapes) that appear
 * on the whiteboard when the template is selected.
 */

// Helper to generate unique shape IDs
let shapeCounter = 0;
const generateShapeId = (): TLShapeId => {
    shapeCounter++;
    return createShapeId(`shape-${Date.now()}-${shapeCounter}`);
};

// Factory function to create a geo shape (rectangle, circle, etc.)
const createGeoShape = (
    x: number,
    y: number,
    width: number,
    height: number,
    options: {
        geo?: 'rectangle' | 'ellipse' | 'triangle' | 'diamond' | 'pentagon' | 'hexagon';
        color?: string;
        fill?: 'none' | 'semi' | 'solid' | 'pattern';
        text?: string;
    } = {}
): TLRecord => {
    const id = generateShapeId();
    const textContent = options.text || '';
    return {
        id,
        type: 'geo',
        typeName: 'shape',
        x,
        y,
        rotation: 0,
        index: `a${shapeCounter}` as any,
        parentId: 'page:page' as any,
        isLocked: false,
        opacity: 1,
        props: {
            w: width,
            h: height,
            geo: options.geo || 'rectangle',
            color: options.color || 'black',
            labelColor: 'black',
            fill: options.fill || 'none',
            dash: 'draw',
            size: 'm',
            font: 'draw',
            align: 'middle',
            verticalAlign: 'middle',
            growY: 0,
            url: '',
            scale: 1,
            richText: {
                type: 'doc',
                content: [{ type: 'paragraph', content: textContent ? [{ type: 'text', text: textContent }] : [] }],
            },
        },
        meta: {},
    } as any;
};

// Factory function to create a text shape
const createTextShape = (
    x: number,
    y: number,
    text: string,
    options: {
        width?: number;
        scale?: number;
        color?: string;
        font?: 'draw' | 'sans' | 'serif' | 'mono';
        size?: 's' | 'm' | 'l' | 'xl';
    } = {}
): TLRecord => {
    const id = generateShapeId();
    return {
        id,
        type: 'text',
        typeName: 'shape',
        x,
        y,
        rotation: 0,
        index: `a${shapeCounter}` as any,
        parentId: 'page:page' as any,
        isLocked: false,
        opacity: 1,
        props: {
            color: options.color || 'black',
            size: options.size || 'm',
            w: options.width || 200,
            font: options.font || 'draw',
            textAlign: 'start',
            autoSize: true,
            scale: options.scale || 1,
            richText: {
                type: 'doc',
                content: [{ type: 'paragraph', content: text ? [{ type: 'text', text }] : [] }],
            },
        },
        meta: {},
    } as any;
};

// Factory function to create an arrow
const createArrowShape = (
    startX: number,
    startY: number,
    endX: number,
    endY: number,
    options: {
        color?: string;
        start?: 'none' | 'arrow' | 'dot';
        end?: 'none' | 'arrow' | 'dot';
    } = {}
): TLRecord => {
    const id = generateShapeId();
    return {
        id,
        type: 'arrow',
        typeName: 'shape',
        x: startX,
        y: startY,
        rotation: 0,
        index: `a${shapeCounter}` as any,
        parentId: 'page:page' as any,
        isLocked: false,
        opacity: 1,
        props: {
            dash: 'draw',
            size: 'm',
            fill: 'none',
            color: options.color || 'black',
            labelColor: 'black',
            bend: 0,
            start: {
                type: 'point',
                x: 0,
                y: 0,
            },
            end: {
                type: 'point',
                x: endX - startX,
                y: endY - startY,
            },
            arrowheadStart: options.start || 'none',
            arrowheadEnd: options.end || 'arrow',
            font: 'draw',
            scale: 1,
            richText: {
                type: 'doc',
                content: [{ type: 'paragraph', content: [] }],
            },
        },
        meta: {},
    } as any;
};

// Template: Math & Equations
export const getMathTemplate = (): Record<string, TLRecord> => {
    const shapes: TLRecord[] = [];

    // Title
    shapes.push(
        createTextShape(100, 50, '📐 Math Problem', {
            size: 'xl',
            font: 'sans',
            width: 400,
        })
    );

    // Problem Section
    shapes.push(
        createGeoShape(100, 150, 600, 120, {
            geo: 'rectangle',
            color: 'blue',
            fill: 'semi',
            text: 'Problem\n\nWrite your equation or problem here...',
        })
    );

    // Steps Section
    shapes.push(
        createGeoShape(100, 300, 600, 250, {
            geo: 'rectangle',
            color: 'violet',
            fill: 'semi',
            text: 'Steps / Solution\n\n1. \n2. \n3. ',
        })
    );

    // Final Answer Section
    shapes.push(
        createGeoShape(100, 580, 600, 100, {
            geo: 'rectangle',
            color: 'green',
            fill: 'semi',
            text: 'Final Answer\n\n',
        })
    );

    // Example equation
    shapes.push(
        createTextShape(750, 150, '∑(x) = x₁ + x₂ + ... + xₙ', {
            font: 'mono',
            color: 'blue',
            size: 'l',
            width: 300,
        })
    );

    // Helper text
    shapes.push(
        createTextShape(750, 250, 'Common Symbols:\n∑ ∫ √ π ∞ ≈ ≠ ≤ ≥\n± × ÷ ° ² ³', {
            font: 'sans',
            color: 'grey',
            size: 's',
            width: 250,
        })
    );

    // Convert to record
    const record: Record<string, TLRecord> = {};
    shapes.forEach((shape) => {
        record[shape.id] = shape;
    });
    return record;
};

// Template: Mind Map (Central node + branches)
export const getMindMapTemplate = (): Record<string, TLRecord> => {
    const shapes: TLRecord[] = [];
    const centerX = 500;
    const centerY = 350;

    // Central topic
    const centerShape = createGeoShape(centerX - 100, centerY - 50, 200, 100, {
        geo: 'ellipse',
        color: 'yellow',
        fill: 'solid',
        text: 'Main Topic',
    });
    shapes.push(centerShape);

    // Branch ideas with different colors and positions
    const branches = [
        { x: centerX - 400, y: centerY - 200, text: 'Idea 1', color: 'blue' },
        { x: centerX + 200, y: centerY - 200, text: 'Idea 2', color: 'green' },
        { x: centerX - 400, y: centerY + 100, text: 'Idea 3', color: 'red' },
        { x: centerX + 200, y: centerY + 100, text: 'Idea 4', color: 'violet' },
    ];

    branches.forEach((branch) => {
        shapes.push(
            createGeoShape(branch.x, branch.y, 150, 80, {
                geo: 'rectangle',
                color: branch.color,
                fill: 'solid',
                text: branch.text,
            })
        );

        // Arrow from center to branch
        shapes.push(
            createArrowShape(
                centerX,
                centerY,
                branch.x + 75,
                branch.y + 40,
                { color: 'black', end: 'arrow' }
            )
        );
    });

    const record: Record<string, TLRecord> = {};
    shapes.forEach((shape) => {
        record[shape.id] = shape;
    });
    return record;
};

// Template: Brainstorming
export const getBrainstormTemplate = (): Record<string, TLRecord> => {
    const shapes: TLRecord[] = [];

    // Title
    shapes.push(
        createTextShape(100, 50, '💡 Brainstorming Session', {
            size: 'xl',
            font: 'sans',
            width: 400,
        })
    );

    // Sticky notes in various positions
    const notes = [
        { x: 100, y: 150, text: 'Idea...', color: 'yellow' },
        { x: 320, y: 150, text: 'Thought...', color: 'blue' },
        { x: 540, y: 150, text: 'Concept...', color: 'green' },
        { x: 100, y: 310, text: 'Question...', color: 'red' },
        { x: 320, y: 310, text: 'Solution...', color: 'violet' },
        { x: 540, y: 310, text: 'Action...', color: 'orange' },
        { x: 760, y: 150, text: 'Note...', color: 'blue' },
        { x: 760, y: 310, text: 'Insight...', color: 'green' },
    ];

    notes.forEach((note) => {
        shapes.push(
            createGeoShape(note.x, note.y, 200, 140, {
                geo: 'rectangle',
                color: note.color,
                fill: 'solid',
                text: note.text,
            })
        );
    });

    const record: Record<string, TLRecord> = {};
    shapes.forEach((shape) => {
        record[shape.id] = shape;
    });
    return record;
};

// Template: Kanban Board
export const getKanbanTemplate = (): Record<string, TLRecord> => {
    const shapes: TLRecord[] = [];

    // Column headers
    const columns = [
        { x: 100, title: 'To Do', color: 'red' },
        { x: 400, title: 'In Progress', color: 'yellow' },
        { x: 700, title: 'Done', color: 'green' },
    ];

    columns.forEach((col) => {
        // Column header
        shapes.push(
            createGeoShape(col.x, 100, 250, 60, {
                geo: 'rectangle',
                color: col.color,
                fill: 'solid',
                text: col.title,
            })
        );

        // Sample cards
        shapes.push(
            createGeoShape(col.x, 180, 250, 100, {
                geo: 'rectangle',
                color: 'grey',
                fill: 'semi',
                text: `Task ${col.title === 'To Do' ? '1' : col.title === 'In Progress' ? '3' : '5'}\n\nDescription...`,
            })
        );

        shapes.push(
            createGeoShape(col.x, 300, 250, 100, {
                geo: 'rectangle',
                color: 'grey',
                fill: 'semi',
                text: `Task ${col.title === 'To Do' ? '2' : col.title === 'In Progress' ? '4' : '6'}\n\nDescription...`,
            })
        );
    });

    const record: Record<string, TLRecord> = {};
    shapes.forEach((shape) => {
        record[shape.id] = shape;
    });
    return record;
};

// Template: Teaching & Lectures
export const getTeachingTemplate = (): Record<string, TLRecord> => {
    const shapes: TLRecord[] = [];

    // Lesson title
    shapes.push(
        createGeoShape(100, 50, 800, 80, {
            geo: 'rectangle',
            color: 'blue',
            fill: 'solid',
            text: '📚 Lesson Title\n\nTopic: ___________  |  Date: ___________',
        })
    );

    // Content sections
    shapes.push(
        createGeoShape(100, 160, 380, 200, {
            geo: 'rectangle',
            color: 'blue',
            fill: 'semi',
            text: 'Section 1: Introduction\n\nKey points:\n• \n• \n• ',
        })
    );

    shapes.push(
        createGeoShape(520, 160, 380, 200, {
            geo: 'rectangle',
            color: 'violet',
            fill: 'semi',
            text: 'Section 2: Main Content\n\nExplanation:\n',
        })
    );

    shapes.push(
        createGeoShape(100, 390, 380, 200, {
            geo: 'rectangle',
            color: 'green',
            fill: 'semi',
            text: 'Section 3: Examples\n\nExample 1:\n\nExample 2:',
        })
    );

    shapes.push(
        createGeoShape(520, 390, 380, 200, {
            geo: 'rectangle',
            color: 'yellow',
            fill: 'semi',
            text: 'Section 4: Summary\n\nKey Takeaways:\n• \n• ',
        })
    );

    const record: Record<string, TLRecord> = {};
    shapes.forEach((shape) => {
        record[shape.id] = shape;
    });
    return record;
};

// Template: Meeting Notes
export const getMeetingTemplate = (): Record<string, TLRecord> => {
    const shapes: TLRecord[] = [];

    // Meeting header
    shapes.push(
        createGeoShape(100, 50, 800, 100, {
            geo: 'rectangle',
            color: 'blue',
            fill: 'solid',
            text: '📅 Meeting Notes\n\nDate: ___________  |  Attendees: ___________',
        })
    );

    // Agenda
    shapes.push(
        createGeoShape(100, 180, 380, 180, {
            geo: 'rectangle',
            color: 'blue',
            fill: 'semi',
            text: 'Agenda\n\n1. \n2. \n3. ',
        })
    );

    // Discussion notes
    shapes.push(
        createGeoShape(520, 180, 380, 180, {
            geo: 'rectangle',
            color: 'yellow',
            fill: 'semi',
            text: 'Discussion Notes\n\n',
        })
    );

    // Action items
    shapes.push(
        createGeoShape(100, 390, 380, 200, {
            geo: 'rectangle',
            color: 'red',
            fill: 'semi',
            text: 'Action Items\n\n☐ Task 1 - Owner:\n☐ Task 2 - Owner:\n☐ Task 3 - Owner:',
        })
    );

    // Next steps
    shapes.push(
        createGeoShape(520, 390, 380, 200, {
            geo: 'rectangle',
            color: 'green',
            fill: 'semi',
            text: 'Next Steps\n\nNext Meeting: ___________\n\nFollow-up Required:\n',
        })
    );

    const record: Record<string, TLRecord> = {};
    shapes.forEach((shape) => {
        record[shape.id] = shape;
    });
    return record;
};

// Template: Wireframe
export const getWireframeTemplate = (): Record<string, TLRecord> => {
    const shapes: TLRecord[] = [];

    // Header
    shapes.push(
        createGeoShape(100, 50, 800, 60, {
            geo: 'rectangle',
            color: 'grey',
            fill: 'pattern',
            text: 'Header / Navigation',
        })
    );

    // Sidebar
    shapes.push(
        createGeoShape(100, 130, 150, 500, {
            geo: 'rectangle',
            color: 'grey',
            fill: 'pattern',
            text: 'Sidebar\n\nMenu\nItem 1\nItem 2\nItem 3',
        })
    );

    // Main content area
    shapes.push(
        createGeoShape(270, 130, 630, 300, {
            geo: 'rectangle',
            color: 'blue',
            fill: 'semi',
            text: 'Main Content Area\n\n[Component Placeholder]',
        })
    );

    // Cards section
    shapes.push(
        createGeoShape(270, 450, 200, 180, {
            geo: 'rectangle',
            color: 'grey',
            fill: 'semi',
            text: 'Card 1\n\nContent',
        })
    );

    shapes.push(
        createGeoShape(490, 450, 200, 180, {
            geo: 'rectangle',
            color: 'grey',
            fill: 'semi',
            text: 'Card 2\n\nContent',
        })
    );

    shapes.push(
        createGeoShape(710, 450, 190, 180, {
            geo: 'rectangle',
            color: 'grey',
            fill: 'semi',
            text: 'Card 3\n\nContent',
        })
    );

    const record: Record<string, TLRecord> = {};
    shapes.forEach((shape) => {
        record[shape.id] = shape;
    });
    return record;
};

// Template: Physics Diagrams
export const getPhysicsTemplate = (): Record<string, TLRecord> => {
    const shapes: TLRecord[] = [];

    // Title
    shapes.push(
        createTextShape(100, 50, '⚛️ Physics Diagram', {
            size: 'xl',
            font: 'sans',
            width: 400,
        })
    );

    // X-axis arrow
    shapes.push(
        createArrowShape(300, 500, 520, 500, {
            color: 'black',
            end: 'arrow',
        })
    );

    // Y-axis arrow
    shapes.push(
        createArrowShape(300, 500, 300, 220, {
            color: 'black',
            end: 'arrow',
        })
    );

    // Coordinate axes labels
    shapes.push(
        createTextShape(500, 520, 'X', {
            size: 's',
            font: 'sans',
        })
    );

    shapes.push(
        createTextShape(280, 200, 'Y', {
            size: 's',
            font: 'sans',
        })
    );

    // Example vector
    shapes.push(
        createArrowShape(300, 500, 450, 350, {
            color: 'red',
            end: 'arrow',
        })
    );

    shapes.push(
        createTextShape(470, 320, 'F⃗ (Force)', {
            size: 'm',
            font: 'sans',
            color: 'red',
        })
    );

    // Workspace area
    shapes.push(
        createGeoShape(600, 150, 400, 400, {
            geo: 'rectangle',
            color: 'blue',
            fill: 'semi',
            text: 'Workspace\n\nDraw your diagram here...\n\nUse arrows for vectors\nUse shapes for objects',
        })
    );

    const record: Record<string, TLRecord> = {};
    shapes.forEach((shape) => {
        record[shape.id] = shape;
    });
    return record;
};

// Template: Blank Canvas
export const getBlankTemplate = (): Record<string, TLRecord> => {
    // Truly empty - no shapes
    return {};
};

/**
 * Main function to get template content by template ID
 */
export const getTemplateContent = (templateId: string): Record<string, TLRecord> => {
    switch (templateId) {
        case 'template-math':
            return getMathTemplate();
        case 'template-brainstorm':
            return getMindMapTemplate();
        case 'template-meeting':
            return getMeetingTemplate();
        case 'template-kanban':
            return getKanbanTemplate();
        case 'template-teaching':
            return getTeachingTemplate();
        case 'template-wireframe':
            return getWireframeTemplate();
        case 'template-physics':
            return getPhysicsTemplate();
        case 'template-blank':
        default:
            return getBlankTemplate();
    }
};

/**
 * Check if a template has pre-populated content
 */
export const hasTemplateContent = (templateId: string): boolean => {
    const content = getTemplateContent(templateId);
    return Object.keys(content).length > 0;
};
