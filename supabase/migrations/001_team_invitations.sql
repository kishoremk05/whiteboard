-- ============================================================================
-- Team Invitation System - Database Migration
-- ============================================================================

-- Enable UUID extension if not already enabled
CREATE EXTENSION IF NOT EXISTS "uuid-ossp";

-- ============================================================================
-- Organizations Table
-- ============================================================================

CREATE TABLE IF NOT EXISTS organizations (
    id UUID PRIMARY KEY DEFAULT uuid_generate_v4 (),
    name TEXT NOT NULL,
    slug TEXT UNIQUE NOT NULL,
    logo TEXT,
    owner_id UUID NOT NULL REFERENCES user_profiles (id) ON DELETE CASCADE,
    subscription TEXT DEFAULT 'free' CHECK (
        subscription IN ('free', 'pro', 'team')
    ),
    created_at TIMESTAMP
    WITH
        TIME ZONE DEFAULT NOW(),
        updated_at TIMESTAMP
    WITH
        TIME ZONE DEFAULT NOW()
);

-- Create index for faster lookups
CREATE INDEX IF NOT EXISTS idx_organizations_owner_id ON organizations (owner_id);

CREATE INDEX IF NOT EXISTS idx_organizations_slug ON organizations (slug);

-- ============================================================================
-- Organization Members Table
-- ============================================================================

CREATE TABLE IF NOT EXISTS organization_members (
    id UUID PRIMARY KEY DEFAULT uuid_generate_v4 (),
    organization_id UUID NOT NULL REFERENCES organizations (id) ON DELETE CASCADE,
    user_id UUID NOT NULL REFERENCES user_profiles (id) ON DELETE CASCADE,
    role TEXT NOT NULL CHECK (
        role IN ('admin', 'editor', 'viewer')
    ),
    joined_at TIMESTAMP
    WITH
        TIME ZONE DEFAULT NOW(),
        UNIQUE (organization_id, user_id)
);

-- Create indexes for faster lookups
CREATE INDEX IF NOT EXISTS idx_organization_members_user_id ON organization_members (user_id);

CREATE INDEX IF NOT EXISTS idx_organization_members_organization_id ON organization_members (organization_id);

-- ============================================================================
-- Team Invitations Table
-- ============================================================================

CREATE TABLE IF NOT EXISTS team_invitations (
    id UUID PRIMARY KEY DEFAULT uuid_generate_v4 (),
    organization_id UUID NOT NULL REFERENCES organizations (id) ON DELETE CASCADE,
    inviter_id UUID NOT NULL REFERENCES user_profiles (id) ON DELETE CASCADE,
    invitee_email TEXT NOT NULL,
    invitee_id UUID REFERENCES user_profiles (id) ON DELETE SET NULL,
    role TEXT NOT NULL CHECK (
        role IN ('admin', 'editor', 'viewer')
    ),
    status TEXT NOT NULL DEFAULT 'pending' CHECK (
        status IN (
            'pending',
            'accepted',
            'declined',
            'cancelled'
        )
    ),
    invite_token TEXT UNIQUE DEFAULT encode (gen_random_bytes (32), 'hex'),
    expires_at TIMESTAMP
    WITH
        TIME ZONE DEFAULT(NOW() + INTERVAL '7 days'),
        created_at TIMESTAMP
    WITH
        TIME ZONE DEFAULT NOW(),
        updated_at TIMESTAMP
    WITH
        TIME ZONE DEFAULT NOW()
);

-- Create indexes for faster lookups
CREATE INDEX IF NOT EXISTS idx_team_invitations_invitee_email ON team_invitations (invitee_email);

CREATE INDEX IF NOT EXISTS idx_team_invitations_invitee_id ON team_invitations (invitee_id);

CREATE INDEX IF NOT EXISTS idx_team_invitations_organization_id ON team_invitations (organization_id);

CREATE INDEX IF NOT EXISTS idx_team_invitations_status ON team_invitations (status);

CREATE INDEX IF NOT EXISTS idx_team_invitations_token ON team_invitations (invite_token);

-- ============================================================================
-- Row Level Security (RLS) Policies
-- ============================================================================

-- Enable RLS on all tables
ALTER TABLE organizations ENABLE ROW LEVEL SECURITY;

ALTER TABLE organization_members ENABLE ROW LEVEL SECURITY;

ALTER TABLE team_invitations ENABLE ROW LEVEL SECURITY;

-- Organizations Policies
-- Users can view organizations they are members of
CREATE POLICY "Users can view their organizations" ON organizations FOR
SELECT USING (
        owner_id = auth.uid ()
        OR EXISTS (
            SELECT 1
            FROM organization_members
            WHERE
                organization_id = organizations.id
                AND user_id = auth.uid ()
        )
    );

-- Users can create organizations
CREATE POLICY "Users can create organizations" ON organizations FOR
INSERT
WITH
    CHECK (owner_id = auth.uid ());

-- Owners can update their organizations
CREATE POLICY "Owners can update organizations" ON organizations FOR
UPDATE USING (owner_id = auth.uid ());

-- Owners can delete their organizations
CREATE POLICY "Owners can delete organizations" ON organizations FOR DELETE USING (owner_id = auth.uid ());

-- Organization Members Policies
-- Users can view members of organizations they belong to
CREATE POLICY "Users can view organization members" ON organization_members FOR
SELECT USING (
        EXISTS (
            SELECT 1
            FROM organization_members om
            WHERE
                om.organization_id = organization_members.organization_id
                AND om.user_id = auth.uid ()
        )
    );

-- Admins can add members
CREATE POLICY "Admins can add members" ON organization_members FOR
INSERT
WITH
    CHECK (
        EXISTS (
            SELECT 1
            FROM organization_members
            WHERE
                organization_id = organization_members.organization_id
                AND user_id = auth.uid ()
                AND role = 'admin'
        )
        OR EXISTS (
            SELECT 1
            FROM organizations
            WHERE
                id = organization_members.organization_id
                AND owner_id = auth.uid ()
        )
    );

-- Admins can update member roles
CREATE POLICY "Admins can update members" ON organization_members FOR
UPDATE USING (
    EXISTS (
        SELECT 1
        FROM organization_members om
        WHERE
            om.organization_id = organization_members.organization_id
            AND om.user_id = auth.uid ()
            AND om.role = 'admin'
    )
    OR EXISTS (
        SELECT 1
        FROM organizations
        WHERE
            id = organization_members.organization_id
            AND owner_id = auth.uid ()
    )
);

-- Admins can remove members
CREATE POLICY "Admins can remove members" ON organization_members FOR DELETE USING (
    EXISTS (
        SELECT 1
        FROM organization_members om
        WHERE
            om.organization_id = organization_members.organization_id
            AND om.user_id = auth.uid ()
            AND om.role = 'admin'
    )
    OR EXISTS (
        SELECT 1
        FROM organizations
        WHERE
            id = organization_members.organization_id
            AND owner_id = auth.uid ()
    )
);

-- Team Invitations Policies
-- Users can view invitations they sent
CREATE POLICY "Users can view sent invitations" ON team_invitations FOR
SELECT USING (
        inviter_id = auth.uid ()
        OR EXISTS (
            SELECT 1
            FROM organization_members
            WHERE
                organization_id = team_invitations.organization_id
                AND user_id = auth.uid ()
                AND role IN ('admin', 'editor')
        )
    );

-- Users can view invitations they received
CREATE POLICY "Users can view received invitations" ON team_invitations FOR
SELECT USING (
        invitee_email = (
            SELECT email
            FROM user_profiles
            WHERE
                id = auth.uid ()
        )
        OR invitee_id = auth.uid ()
    );

-- Admins can send invitations
CREATE POLICY "Admins can send invitations" ON team_invitations FOR
INSERT
WITH
    CHECK (
        EXISTS (
            SELECT 1
            FROM organization_members
            WHERE
                organization_id = team_invitations.organization_id
                AND user_id = auth.uid ()
                AND role = 'admin'
        )
        OR EXISTS (
            SELECT 1
            FROM organizations
            WHERE
                id = team_invitations.organization_id
                AND owner_id = auth.uid ()
        )
    );

-- Users can update invitations they received (accept/decline)
CREATE POLICY "Users can update received invitations" ON team_invitations FOR
UPDATE USING (
    invitee_email = (
        SELECT email
        FROM user_profiles
        WHERE
            id = auth.uid ()
    )
    OR invitee_id = auth.uid ()
);

-- Inviters can cancel their invitations
CREATE POLICY "Inviters can cancel invitations" ON team_invitations FOR
UPDATE USING (
    inviter_id = auth.uid ()
    OR EXISTS (
        SELECT 1
        FROM organization_members
        WHERE
            organization_id = team_invitations.organization_id
            AND user_id = auth.uid ()
            AND role = 'admin'
    )
);

-- ============================================================================
-- Triggers for updated_at timestamps
-- ============================================================================

-- Function to update updated_at timestamp
CREATE OR REPLACE FUNCTION update_updated_at_column()
RETURNS TRIGGER AS $$
BEGIN
  NEW.updated_at = NOW();
  RETURN NEW;
END;
$$ LANGUAGE plpgsql;

-- Trigger for organizations
DROP TRIGGER IF EXISTS update_organizations_updated_at ON organizations;

CREATE TRIGGER update_organizations_updated_at
  BEFORE UPDATE ON organizations
  FOR EACH ROW
  EXECUTE FUNCTION update_updated_at_column();

-- Trigger for team_invitations
DROP TRIGGER IF EXISTS update_team_invitations_updated_at ON team_invitations;

CREATE TRIGGER update_team_invitations_updated_at
  BEFORE UPDATE ON team_invitations
  FOR EACH ROW
  EXECUTE FUNCTION update_updated_at_column();

-- ============================================================================
-- Helper Functions
-- ============================================================================

-- Function to automatically set invitee_id when user signs up with invited email
CREATE OR REPLACE FUNCTION link_invitation_to_user()
RETURNS TRIGGER AS $$
BEGIN
  UPDATE team_invitations
  SET invitee_id = NEW.id
  WHERE invitee_email = NEW.email
    AND invitee_id IS NULL
    AND status = 'pending';
  RETURN NEW;
END;
$$ LANGUAGE plpgsql;

-- Trigger to link invitations when user signs up
DROP TRIGGER IF EXISTS link_invitations_on_signup ON user_profiles;

CREATE TRIGGER link_invitations_on_signup
  AFTER INSERT ON user_profiles
  FOR EACH ROW
  EXECUTE FUNCTION link_invitation_to_user();