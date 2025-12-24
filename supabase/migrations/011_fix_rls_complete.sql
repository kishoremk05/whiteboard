-- ============================================================================
-- COMPLETE FIX: Reset all RLS policies on whiteboards
-- ============================================================================
-- Run this to completely reset whiteboards RLS to working state

-- Step 1: Drop ALL existing policies on whiteboards
DROP POLICY IF EXISTS "Users can view their own whiteboards" ON whiteboards;

DROP POLICY IF EXISTS "Users can view shared whiteboards" ON whiteboards;

DROP POLICY IF EXISTS "Users can view organization whiteboards" ON whiteboards;

DROP POLICY IF EXISTS "Users can view their deleted whiteboards" ON whiteboards;

DROP POLICY IF EXISTS "Users can insert their own whiteboards" ON whiteboards;

DROP POLICY IF EXISTS "Users can update their own whiteboards" ON whiteboards;

DROP POLICY IF EXISTS "Users can delete their own whiteboards" ON whiteboards;

DROP POLICY IF EXISTS "whiteboards_select" ON whiteboards;

DROP POLICY IF EXISTS "whiteboards_insert" ON whiteboards;

DROP POLICY IF EXISTS "whiteboards_update" ON whiteboards;

DROP POLICY IF EXISTS "whiteboards_delete" ON whiteboards;

DROP POLICY IF EXISTS "allow_select" ON whiteboards;

DROP POLICY IF EXISTS "allow_insert" ON whiteboards;

DROP POLICY IF EXISTS "allow_update" ON whiteboards;

DROP POLICY IF EXISTS "allow_delete" ON whiteboards;

-- Step 2: Enable RLS
ALTER TABLE whiteboards ENABLE ROW LEVEL SECURITY;

-- Step 3: Create simple, working policies
-- SELECT: Users can see their own boards
CREATE POLICY "whiteboards_select_own" ON whiteboards FOR
SELECT USING (user_id = auth.uid ());

-- INSERT: Users can create boards for themselves
CREATE POLICY "whiteboards_insert_own" ON whiteboards FOR
INSERT
WITH
    CHECK (user_id = auth.uid ());

-- UPDATE: Users can update their own boards
CREATE POLICY "whiteboards_update_own" ON whiteboards FOR
UPDATE USING (user_id = auth.uid ())
WITH
    CHECK (user_id = auth.uid ());

-- DELETE: Users can delete their own boards
CREATE POLICY "whiteboards_delete_own" ON whiteboards FOR DELETE USING (user_id = auth.uid ());

-- Verify policies were created
SELECT
    schemaname,
    tablename,
    policyname,
    permissive,
    roles,
    cmd,
    qual,
    with_check
FROM pg_policies
WHERE
    tablename = 'whiteboards';