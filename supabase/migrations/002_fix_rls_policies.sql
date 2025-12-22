-- ============================================================================
-- FIX: Remove problematic RLS policies and create simpler ones
-- ============================================================================

-- Drop all existing policies
DROP POLICY IF EXISTS "Users can view their organizations" ON organizations;

DROP POLICY IF EXISTS "Users can create organizations" ON organizations;

DROP POLICY IF EXISTS "Owners can update organizations" ON organizations;

DROP POLICY IF EXISTS "Owners can delete organizations" ON organizations;

DROP POLICY IF EXISTS "Users can view organization members" ON organization_members;

DROP POLICY IF EXISTS "Admins can add members" ON organization_members;

DROP POLICY IF EXISTS "Admins can update members" ON organization_members;

DROP POLICY IF EXISTS "Admins can remove members" ON organization_members;

DROP POLICY IF EXISTS "Users can view sent invitations" ON team_invitations;

DROP POLICY IF EXISTS "Users can view received invitations" ON team_invitations;

DROP POLICY IF EXISTS "Admins can send invitations" ON team_invitations;

DROP POLICY IF EXISTS "Users can update received invitations" ON team_invitations;

DROP POLICY IF EXISTS "Inviters can cancel invitations" ON team_invitations;

-- ============================================================================
-- Simpler RLS Policies (No Circular References)
-- ============================================================================

-- Organizations Policies
CREATE POLICY "Anyone can view organizations they own or are members of" ON organizations FOR
SELECT USING (
        owner_id = auth.uid ()
        OR id IN (
            SELECT organization_id
            FROM organization_members
            WHERE
                user_id = auth.uid ()
        )
    );

CREATE POLICY "Anyone can create organizations" ON organizations FOR
INSERT
WITH
    CHECK (owner_id = auth.uid ());

CREATE POLICY "Owners can update their organizations" ON organizations FOR
UPDATE USING (owner_id = auth.uid ());

CREATE POLICY "Owners can delete their organizations" ON organizations FOR DELETE USING (owner_id = auth.uid ());

-- Organization Members Policies
CREATE POLICY "Members can view their own organization members" ON organization_members FOR
SELECT USING (
        user_id = auth.uid ()
        OR organization_id IN (
            SELECT organization_id
            FROM organization_members
            WHERE
                user_id = auth.uid ()
        )
    );

CREATE POLICY "Organization owners and admins can add members" ON organization_members FOR
INSERT
WITH
    CHECK (
        -- Check if user is owner of the organization
        organization_id IN (
            SELECT id
            FROM organizations
            WHERE
                owner_id = auth.uid ()
        )
        OR
        -- Check if user is admin of the organization
        organization_id IN (
            SELECT organization_id
            FROM organization_members
            WHERE
                user_id = auth.uid ()
                AND role = 'admin'
        )
    );

CREATE POLICY "Organization owners and admins can update members" ON organization_members FOR
UPDATE USING (
    organization_id IN (
        SELECT id
        FROM organizations
        WHERE
            owner_id = auth.uid ()
    )
    OR organization_id IN (
        SELECT organization_id
        FROM organization_members
        WHERE
            user_id = auth.uid ()
            AND role = 'admin'
    )
);

CREATE POLICY "Organization owners and admins can remove members" ON organization_members FOR DELETE USING (
    organization_id IN (
        SELECT id
        FROM organizations
        WHERE
            owner_id = auth.uid ()
    )
    OR organization_id IN (
        SELECT organization_id
        FROM organization_members
        WHERE
            user_id = auth.uid ()
            AND role = 'admin'
    )
);

-- Team Invitations Policies
CREATE POLICY "Users can view invitations they sent" ON team_invitations FOR
SELECT USING (inviter_id = auth.uid ());

CREATE POLICY "Users can view invitations they received" ON team_invitations FOR
SELECT USING (
        invitee_email = (
            SELECT email
            FROM auth.users
            WHERE
                id = auth.uid ()
        )
        OR invitee_id = auth.uid ()
    );

CREATE POLICY "Organization owners and admins can send invitations" ON team_invitations FOR
INSERT
WITH
    CHECK (
        organization_id IN (
            SELECT id
            FROM organizations
            WHERE
                owner_id = auth.uid ()
        )
        OR organization_id IN (
            SELECT organization_id
            FROM organization_members
            WHERE
                user_id = auth.uid ()
                AND role = 'admin'
        )
    );

CREATE POLICY "Users can update invitations they received" ON team_invitations FOR
UPDATE USING (
    invitee_email = (
        SELECT email
        FROM auth.users
        WHERE
            id = auth.uid ()
    )
    OR invitee_id = auth.uid ()
);

CREATE POLICY "Inviters and admins can cancel invitations" ON team_invitations FOR
UPDATE USING (
    inviter_id = auth.uid ()
    OR organization_id IN (
        SELECT organization_id
        FROM organization_members
        WHERE
            user_id = auth.uid ()
            AND role = 'admin'
    )
);