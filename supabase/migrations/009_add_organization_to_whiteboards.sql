-- ============================================================================
-- Add Organization Scoping to Whiteboards
-- ============================================================================
-- This migration adds organization_id to whiteboards for multi-org support

-- Add organization_id column to whiteboards table
ALTER TABLE whiteboards
ADD COLUMN IF NOT EXISTS organization_id UUID REFERENCES organizations (id) ON DELETE SET NULL;

-- Create index for faster organization queries
CREATE INDEX IF NOT EXISTS idx_whiteboards_organization_id ON whiteboards (organization_id);

-- Update RLS policies to include organization scoping
-- Drop existing policies
DROP POLICY IF EXISTS "Users can view their own whiteboards" ON whiteboards;

DROP POLICY IF EXISTS "Users can view shared whiteboards" ON whiteboards;

DROP POLICY IF EXISTS "Users can view organization whiteboards" ON whiteboards;

DROP POLICY IF EXISTS "Users can view their deleted whiteboards" ON whiteboards;

DROP POLICY IF EXISTS "Users can insert their own whiteboards" ON whiteboards;

DROP POLICY IF EXISTS "Users can update their own whiteboards" ON whiteboards;

DROP POLICY IF EXISTS "Users can delete their own whiteboards" ON whiteboards;

-- Recreate policies with organization awareness
-- Users can view their own whiteboards
CREATE POLICY "Users can view their own whiteboards" ON whiteboards FOR
SELECT USING (
        user_id = auth.uid ()
        AND (
            is_deleted = false
            OR is_deleted IS NULL
        )
    );

-- Users can view shared whiteboards
CREATE POLICY "Users can view shared whiteboards" ON whiteboards FOR
SELECT USING (
        EXISTS (
            SELECT 1
            FROM collaborators
            WHERE
                collaborators.whiteboard_id = whiteboards.id
                AND collaborators.user_id = auth.uid ()
        )
        AND (
            is_deleted = false
            OR is_deleted IS NULL
        )
    );

-- Users can view whiteboards in their organizations
CREATE POLICY "Users can view organization whiteboards" ON whiteboards FOR
SELECT USING (
        EXISTS (
            SELECT 1
            FROM organization_members
            WHERE
                organization_members.organization_id = whiteboards.organization_id
                AND organization_members.user_id = auth.uid ()
        )
        AND (
            is_deleted = false
            OR is_deleted IS NULL
        )
    );

-- Users can view their deleted whiteboards
CREATE POLICY "Users can view their deleted whiteboards" ON whiteboards FOR
SELECT USING (
        user_id = auth.uid ()
        AND is_deleted = true
    );

-- Users can insert whiteboards they own
CREATE POLICY "Users can insert their own whiteboards" ON whiteboards FOR
INSERT
WITH
    CHECK (user_id = auth.uid ());

-- Users can update whiteboards they own
CREATE POLICY "Users can update their own whiteboards" ON whiteboards FOR
UPDATE USING (user_id = auth.uid ())
WITH
    CHECK (user_id = auth.uid ());

-- Users can delete whiteboards they own
CREATE POLICY "Users can delete their own whiteboards" ON whiteboards FOR DELETE USING (user_id = auth.uid ());

-- Add comment explaining organization_id
COMMENT ON COLUMN whiteboards.organization_id IS 'Optional organization the whiteboard belongs to. NULL for personal boards.';