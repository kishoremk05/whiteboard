-- Create collaborators table
CREATE TABLE IF NOT EXISTS collaborators (
    id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
    whiteboard_id UUID REFERENCES whiteboards(id) ON DELETE CASCADE,
    user_id UUID REFERENCES user_profiles(id) ON DELETE CASCADE,
    email TEXT,
    role TEXT CHECK (role IN ('admin', 'editor', 'viewer')) DEFAULT 'viewer',
    invite_code TEXT,
    invite_code_expires_at TIMESTAMPTZ,
    invited_at TIMESTAMPTZ DEFAULT NOW(),
    created_at TIMESTAMPTZ DEFAULT NOW(),
    updated_at TIMESTAMPTZ DEFAULT NOW(),

-- Ensure either user_id or email is provided
CONSTRAINT collaborator_identity CHECK (
    user_id IS NOT NULL
    OR email IS NOT NULL
),

-- Prevent duplicate collaborators
UNIQUE(whiteboard_id, user_id), UNIQUE(whiteboard_id, email) );

-- Create index for faster lookups
CREATE INDEX IF NOT EXISTS idx_collaborators_whiteboard_id ON collaborators (whiteboard_id);

CREATE INDEX IF NOT EXISTS idx_collaborators_user_id ON collaborators (user_id);

CREATE INDEX IF NOT EXISTS idx_collaborators_email ON collaborators (email);

CREATE INDEX IF NOT EXISTS idx_collaborators_invite_code ON collaborators (invite_code);

-- Enable RLS
ALTER TABLE collaborators ENABLE ROW LEVEL SECURITY;

-- RLS Policies for collaborators table

-- 1. Users can view collaborators for whiteboards they own or are collaborators on
CREATE POLICY "Users can view collaborators for accessible whiteboards" ON collaborators FOR
SELECT USING (
        -- User owns the whiteboard
        whiteboard_id IN (
            SELECT id
            FROM whiteboards
            WHERE
                user_id = auth.uid ()
        )
        OR
        -- User is a collaborator on the whiteboard
        user_id = auth.uid ()
        OR
        -- User's email matches (for pending invites)
        email = (
            SELECT email
            FROM user_profiles
            WHERE
                id = auth.uid ()
        )
    );

-- 2. Whiteboard owners and admins can insert collaborators
CREATE POLICY "Owners and admins can add collaborators" ON collaborators FOR
INSERT
WITH
    CHECK (
        -- User owns the whiteboard
        whiteboard_id IN (
            SELECT id
            FROM whiteboards
            WHERE
                user_id = auth.uid ()
        )
        OR
        -- User is an admin collaborator on the whiteboard
        EXISTS (
            SELECT 1
            FROM collaborators
            WHERE
                whiteboard_id = collaborators.whiteboard_id
                AND user_id = auth.uid ()
                AND role = 'admin'
        )
    );

-- 3. Whiteboard owners and admins can update collaborators
CREATE POLICY "Owners and admins can update collaborators" ON collaborators FOR
UPDATE USING (
    -- User owns the whiteboard
    whiteboard_id IN (
        SELECT id
        FROM whiteboards
        WHERE
            user_id = auth.uid ()
    )
    OR
    -- User is an admin collaborator on the whiteboard
    EXISTS (
        SELECT 1
        FROM collaborators c
        WHERE
            c.whiteboard_id = collaborators.whiteboard_id
            AND c.user_id = auth.uid ()
            AND c.role = 'admin'
    )
);

-- 4. Whiteboard owners and admins can delete collaborators
CREATE POLICY "Owners and admins can remove collaborators" ON collaborators FOR DELETE USING (
    -- User owns the whiteboard
    whiteboard_id IN (
        SELECT id
        FROM whiteboards
        WHERE
            user_id = auth.uid ()
    )
    OR
    -- User is an admin collaborator on the whiteboard
    EXISTS (
        SELECT 1
        FROM collaborators c
        WHERE
            c.whiteboard_id = collaborators.whiteboard_id
            AND c.user_id = auth.uid ()
            AND c.role = 'admin'
    )
);

-- Create updated_at trigger
CREATE OR REPLACE FUNCTION update_updated_at_column()
RETURNS TRIGGER AS $$
BEGIN
    NEW.updated_at = NOW();
    RETURN NEW;
END;
$$ LANGUAGE plpgsql;

CREATE TRIGGER update_collaborators_updated_at
    BEFORE UPDATE ON collaborators
    FOR EACH ROW
    EXECUTE FUNCTION update_updated_at_column();