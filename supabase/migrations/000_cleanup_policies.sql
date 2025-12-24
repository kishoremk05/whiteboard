-- ============================================================================
-- CLEANUP: Remove all RLS policies from whiteboards
-- ============================================================================
-- Run this first to clear any problematic policies, then run migration 009

-- Drop all existing policies on whiteboards table
DROP POLICY IF EXISTS "Users can view their own whiteboards" ON whiteboards;

DROP POLICY IF EXISTS "Users can view shared whiteboards" ON whiteboards;

DROP POLICY IF EXISTS "Users can view organization whiteboards" ON whiteboards;

DROP POLICY IF EXISTS "Users can view their deleted whiteboards" ON whiteboards;

DROP POLICY IF EXISTS "Users can insert their own whiteboards" ON whiteboards;

DROP POLICY IF EXISTS "Users can update their own whiteboards" ON whiteboards;

DROP POLICY IF EXISTS "Users can delete their own whiteboards" ON whiteboards;

-- Also drop any variations that might exist
DROP POLICY IF EXISTS "whiteboards_select_policy" ON whiteboards;

DROP POLICY IF EXISTS "whiteboards_insert_policy" ON whiteboards;

DROP POLICY IF EXISTS "whiteboards_update_policy" ON whiteboards;

DROP POLICY IF EXISTS "whiteboards_delete_policy" ON whiteboards;

-- Temporarily disable RLS to allow queries
ALTER TABLE whiteboards DISABLE ROW LEVEL SECURITY;

-- Re-enable RLS
ALTER TABLE whiteboards ENABLE ROW LEVEL SECURITY;

-- Now the table has no policies - you can run migration 009 to add them back