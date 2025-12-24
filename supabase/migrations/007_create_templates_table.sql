-- ============================================================================
-- Templates Table Migration
-- ============================================================================
-- This migration creates the templates table and seeds it with initial data

-- Create templates table
CREATE TABLE IF NOT EXISTS templates (
    id TEXT PRIMARY KEY,
    name TEXT NOT NULL,
    description TEXT,
    thumbnail TEXT,
    category TEXT NOT NULL CHECK (
        category IN ('general', 'education', 'business', 'creative')
    ),
    data JSONB DEFAULT '{}'::jsonb,
    preview TEXT,
    is_active BOOLEAN DEFAULT true,
    created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
    updated_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
);

-- Create index for faster category lookups
CREATE INDEX IF NOT EXISTS idx_templates_category ON templates (category);

-- Ensure correct column types and add missing columns
DO $$
BEGIN
    -- Change id from UUID to TEXT if needed (we use string IDs like 'template-blank')
    IF EXISTS (
        SELECT 1 FROM information_schema.columns 
        WHERE table_name = 'templates' 
        AND column_name = 'id' 
        AND data_type = 'uuid'
    ) THEN
        -- Drop dependent constraints/policies first
        DROP POLICY IF EXISTS "Templates are publicly readable" ON templates;
        
        -- Change column type
        ALTER TABLE templates ALTER COLUMN id TYPE TEXT;

END IF;

-- Add thumbnail column if missing
IF NOT EXISTS (
    SELECT 1
    FROM information_schema.columns
    WHERE
        table_name = 'templates'
        AND column_name = 'thumbnail'
) THEN
ALTER TABLE templates
ADD COLUMN thumbnail TEXT;

END IF;

-- Add preview column if missing
IF NOT EXISTS (
    SELECT 1
    FROM information_schema.columns
    WHERE
        table_name = 'templates'
        AND column_name = 'preview'
) THEN
ALTER TABLE templates
ADD COLUMN preview TEXT;

END IF;

-- Add is_active column if missing
IF NOT EXISTS (
    SELECT 1
    FROM information_schema.columns
    WHERE
        table_name = 'templates'
        AND column_name = 'is_active'
) THEN
ALTER TABLE templates
ADD COLUMN is_active BOOLEAN DEFAULT true;

END IF;

END $$;

CREATE INDEX IF NOT EXISTS idx_templates_is_active ON templates (is_active);

-- Enable RLS (templates are public read-only)
ALTER TABLE templates ENABLE ROW LEVEL SECURITY;

-- Drop existing policy if it exists
DROP POLICY IF EXISTS "Templates are publicly readable" ON templates;

-- Allow anyone to read active templates
CREATE POLICY "Templates are publicly readable" ON templates FOR
SELECT USING (is_active = true);

-- Only authenticated users with admin role could insert/update
-- (for future admin panel, not implemented yet)

-- ============================================================================
-- Seed Templates Data
-- ============================================================================

INSERT INTO templates (id, name, description, thumbnail, category, data) VALUES
(
    'template-blank',
    'Blank Canvas',
    'Start with a clean slate. Perfect for any project.',
    '/templates/blank.svg',
    'general',
    '{}'::jsonb
),
(
    'template-math',
    'Math & Equations',
    'Pre-configured grid with math tools and equation support.',
    '/templates/math.svg',
    'education',
    '{"gridEnabled": true, "gridSize": 20, "tools": ["equation", "calculator"]}'::jsonb
),
(
    'template-physics',
    'Physics Diagrams',
    'Tools for drawing physics diagrams, vectors, and circuits.',
    '/templates/physics.svg',
    'education',
    '{"tools": ["vector", "circuit", "diagram"]}'::jsonb
),
(
    'template-brainstorm',
    'Brainstorming',
    'Mind mapping layout with sticky notes and connectors.',
    '/templates/brainstorm.svg',
    'creative',
    '{"layout": "mindmap", "tools": ["sticky-note", "connector"]}'::jsonb
),
(
    'template-teaching',
    'Teaching & Lectures',
    'Presentation-ready layout with sections and annotations.',
    '/templates/teaching.svg',
    'education',
    '{"layout": "presentation", "sections": 5}'::jsonb
),
(
    'template-meeting',
    'Meeting Notes',
    'Structured layout for agendas, notes, and action items.',
    '/templates/meeting.svg',
    'business',
    '{"sections": ["agenda", "notes", "action-items"]}'::jsonb
),
(
    'template-wireframe',
    'Wireframing',
    'UI components and grids for quick wireframing.',
    '/templates/wireframe.svg',
    'creative',
    '{"components": ["buttons", "inputs", "cards"], "gridEnabled": true}'::jsonb
),
(
    'template-kanban',
    'Kanban Board',
    'Visual task management with columns and cards.',
    '/templates/kanban.svg',
    'business',
    '{"columns": ["To Do", "In Progress", "Done"]}'::jsonb
)
ON CONFLICT (id) DO NOTHING;

-- ============================================================================
-- Trigger for updated_at
-- ============================================================================

-- Use the existing update_updated_at_column function
DROP TRIGGER IF EXISTS update_templates_updated_at ON templates;

CREATE TRIGGER update_templates_updated_at
    BEFORE UPDATE ON templates
    FOR EACH ROW
    EXECUTE FUNCTION update_updated_at_column();