-- Fix infinite recursion in collaborators RLS policies
-- Drop existing policies
DROP POLICY IF EXISTS "Owners and admins can add collaborators" ON collaborators;

DROP POLICY IF EXISTS "Owners and admins can update collaborators" ON collaborators;

DROP POLICY IF EXISTS "Owners and admins can remove collaborators" ON collaborators;

-- Recreate INSERT policy without infinite recursion
-- Only whiteboard owners can add collaborators (simpler, no recursion)
CREATE POLICY "Owners can add collaborators" ON collaborators FOR
INSERT
WITH
    CHECK (
        whiteboard_id IN (
            SELECT id
            FROM whiteboards
            WHERE
                user_id = auth.uid ()
        )
    );

-- Recreate UPDATE policy without infinite recursion
CREATE POLICY "Owners can update collaborators" ON collaborators FOR
UPDATE USING (
    whiteboard_id IN (
        SELECT id
        FROM whiteboards
        WHERE
            user_id = auth.uid ()
    )
);

-- Recreate DELETE policy without infinite recursion
CREATE POLICY "Owners can remove collaborators" ON collaborators FOR DELETE USING (
    whiteboard_id IN (
        SELECT id
        FROM whiteboards
        WHERE
            user_id = auth.uid ()
    )
);