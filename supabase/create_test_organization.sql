-- ============================================================================
-- Create Test Organization - Quick Setup Script
-- ============================================================================
-- Run this in Supabase SQL Editor to create your first organization
-- Replace 'your-email@example.com' with your actual email address
-- ============================================================================

-- Step 1: Create an organization
INSERT INTO
    organizations (name, slug, owner_id)
VALUES (
        'My Organization', -- Change this to your organization name
        'my-organization', -- Change this to a unique slug (lowercase, no spaces)
        (
            SELECT id
            FROM user_profiles
            WHERE
                email = 'your-email@example.com'
            LIMIT 1
        )
    ) RETURNING *;

-- Step 2: Add yourself as an admin member
INSERT INTO
    organization_members (
        organization_id,
        user_id,
        role
    )
VALUES (
        (
            SELECT id
            FROM organizations
            WHERE
                slug = 'my-organization'
        ),
        (
            SELECT id
            FROM user_profiles
            WHERE
                email = 'your-email@example.com'
            LIMIT 1
        ),
        'admin'
    ) RETURNING *;

-- ============================================================================
-- Verification Query - Run this to verify everything worked
-- ============================================================================

SELECT
    o.name as organization_name,
    o.slug,
    om.role,
    up.name as your_name,
    up.email
FROM
    organizations o
    JOIN organization_members om ON om.organization_id = o.id
    JOIN user_profiles up ON up.id = om.user_id
WHERE
    up.email = 'your-email@example.com';

-- ============================================================================
-- IMPORTANT: Replace 'your-email@example.com' with your actual email!
-- ============================================================================