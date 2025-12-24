-- ============================================================================
-- Soft Delete Implementation for Whiteboards
-- ============================================================================
-- This migration adds soft delete functionality to the whiteboards table

-- Add soft delete columns to whiteboards table
ALTER TABLE whiteboards
ADD COLUMN IF NOT EXISTS is_deleted BOOLEAN DEFAULT false,
ADD COLUMN IF NOT EXISTS deleted_at TIMESTAMP
WITH
    TIME ZONE;

-- Create index for faster queries on deleted boards
CREATE INDEX IF NOT EXISTS idx_whiteboards_is_deleted ON whiteboards (is_deleted);

CREATE INDEX IF NOT EXISTS idx_whiteboards_deleted_at ON whiteboards (deleted_at);

-- Update existing RLS policies to exclude deleted boards by default
-- First, drop existing policies if they exist
DROP POLICY IF EXISTS "Users can view their own whiteboards" ON whiteboards;

DROP POLICY IF EXISTS "Users can view shared whiteboards" ON whiteboards;

-- Recreate policies with is_deleted filter
CREATE POLICY "Users can view their own whiteboards" ON whiteboards FOR
SELECT USING (
        user_id = auth.uid ()
        AND (
            is_deleted = false
            OR is_deleted IS NULL
        )
    );

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

-- Policy for viewing deleted boards (trash)
CREATE POLICY "Users can view their deleted whiteboards" ON whiteboards FOR
SELECT USING (
        user_id = auth.uid ()
        AND is_deleted = true
    );

-- Add comment explaining the soft delete design
COMMENT ON COLUMN whiteboards.is_deleted IS 'Soft delete flag. When true, board appears in trash.';

COMMENT ON COLUMN whiteboards.deleted_at IS 'Timestamp when board was moved to trash.';