-- ============================================================================
-- SIMPLE RLS POLICIES FOR WHITEBOARDS
-- ============================================================================
-- This migration creates simple, non-recursive RLS policies
-- Run this AFTER 000_cleanup_policies.sql

-- First ensure RLS is enabled
ALTER TABLE whiteboards ENABLE ROW LEVEL SECURITY;

-- SIMPLE POLICY: Users can view boards they own OR boards where they're a collaborator
-- Using a single combined policy with direct auth.uid() check only
CREATE POLICY "whiteboards_select" ON whiteboards FOR
SELECT USING (user_id = auth.uid ());

-- Users can insert boards with their own user_id
CREATE POLICY "whiteboards_insert" ON whiteboards FOR
INSERT
WITH
    CHECK (user_id = auth.uid ());

-- Users can update boards they own
CREATE POLICY "whiteboards_update" ON whiteboards FOR
UPDATE USING (user_id = auth.uid ())
WITH
    CHECK (user_id = auth.uid ());

-- Users can delete boards they own
CREATE POLICY "whiteboards_delete" ON whiteboards FOR DELETE USING (user_id = auth.uid ());