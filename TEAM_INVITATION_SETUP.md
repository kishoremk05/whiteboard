# Team Invitation System - Setup Guide

## 📋 Overview

This implementation adds a complete team invitation system to your whiteboard application. Users can:
- ✅ Send invitations to existing or new users
- ✅ View invitations they've sent (with Resend/Cancel)
- ✅ View invitations they've received (with Accept/Decline)
- ✅ Automatically check if user exists before sending invitation
- ✅ Join organizations by accepting invitations

---

## 🚀 Setup Instructions

### Step 1: Run Database Migration

You need to run the SQL migration script in your Supabase database.

**Option A: Using Supabase Dashboard**
1. Go to your Supabase project dashboard
2. Navigate to **SQL Editor**
3. Open the file: `supabase/migrations/001_team_invitations.sql`
4. Copy the entire content
5. Paste it into the SQL Editor
6. Click **Run** to execute

**Option B: Using Supabase CLI** (if you have it installed)
```bash
supabase db push
```

### Step 2: Verify Tables Created

After running the migration, verify these tables exist in your database:
- ✅ `organizations`
- ✅ `organization_members`
- ✅ `team_invitations`

You can check this in Supabase Dashboard → **Table Editor**

### Step 3: Create a Test Organization (Optional)

To test the invitation system, you'll need at least one organization. You can create one manually:

```sql
-- Insert a test organization
INSERT INTO organizations (name, slug, owner_id)
VALUES (
  'My Test Organization',
  'my-test-org',
  (SELECT id FROM user_profiles WHERE email = 'your-email@example.com' LIMIT 1)
);

-- Add yourself as an admin member
INSERT INTO organization_members (organization_id, user_id, role)
VALUES (
  (SELECT id FROM organizations WHERE slug = 'my-test-org'),
  (SELECT id FROM user_profiles WHERE email = 'your-email@example.com' LIMIT 1),
  'admin'
);
```

Replace `'your-email@example.com'` with your actual email.

---

## 🧪 Testing the System

### Test 1: Send Invitation to Existing User

1. Navigate to `/dashboard/team`
2. Click **"Invite Member"**
3. Enter the email of an existing user
4. Select a role (Admin, Editor, or Viewer)
5. Click **"Send Invitation"**
6. ✅ The invitation should appear in "Pending Invitations (Sent)"

### Test 2: Accept Invitation

1. Log in as the user who received the invitation
2. Navigate to `/dashboard/team`
3. You should see the invitation in **"Invitations Received"** section
4. Click **"Accept"**
5. ✅ You should now be a member of that organization
6. ✅ The page will reload and show the new organization

### Test 3: Decline Invitation

1. Log in as a user who received an invitation
2. Navigate to `/dashboard/team`
3. Click **"Decline"** on an invitation
4. ✅ The invitation should disappear

### Test 4: Cancel Sent Invitation

1. Log in as the user who sent the invitation
2. Navigate to `/dashboard/team`
3. In "Pending Invitations (Sent)", click **"Cancel"**
4. ✅ The invitation should be removed

### Test 5: Resend Invitation

1. Navigate to `/dashboard/team`
2. In "Pending Invitations (Sent)", click **"Resend"**
3. ✅ The expiry date should be extended by 7 days

---

## 📁 Files Created/Modified

### New Files
- ✅ `supabase/migrations/001_team_invitations.sql` - Database schema
- ✅ `src/services/invitationService.ts` - Backend service for invitations

### Modified Files
- ✅ `src/types/index.ts` - Added `TeamInvitation` interface
- ✅ `src/pages/Team.tsx` - Complete rewrite with invitation features

---

## 🔧 Configuration

### Email Notifications (Optional - Future Enhancement)

The system includes placeholder functions for email notifications:
- `invitationService.sendInvitationEmail()`

To enable email sending, you can:
1. Use **Supabase Edge Functions** with a service like Resend or SendGrid
2. Use **Supabase Auth Hooks** to trigger emails
3. Integrate a third-party email service

Example email templates are included in the implementation plan.

---

## 🎨 UI Features

### Invitations Received Section
- Blue-themed card highlighting new invitations
- Shows: Organization name, inviter name, role offered
- Actions: Accept (green) or Decline (red)

### Members Section
- List of current organization members
- Search functionality
- Role badges with icons
- Member management dropdown

### Pending Invitations (Sent) Section
- Shows invitations you've sent
- Displays: Email, role, sent date
- Actions: Resend or Cancel

---

## 🔒 Security Features

### Row Level Security (RLS)
All tables have RLS policies enabled:
- Users can only view invitations they sent or received
- Only admins can send invitations
- Users can only accept/decline their own invitations
- Inviters can cancel their own invitations

### Automatic User Linking
When a new user signs up with an email that has pending invitations:
- The system automatically links the invitation to their user ID
- They can immediately see and accept the invitation

---

## 🐛 Troubleshooting

### Issue: "Not authenticated" error
**Solution**: Make sure you're logged in and have a valid session

### Issue: "No organization selected" error
**Solution**: You need to create an organization first (see Step 3 above)

### Issue: Invitations not showing up
**Solution**: 
1. Check if the database migration ran successfully
2. Verify RLS policies are enabled
3. Check browser console for errors

### Issue: Can't send invitations
**Solution**: 
1. Verify you're an admin of the organization
2. Check if the email already has a pending invitation
3. Verify the user isn't already a member

---

## 📊 Database Schema Reference

### team_invitations
```
id                  UUID PRIMARY KEY
organization_id     UUID (FK to organizations)
inviter_id          UUID (FK to user_profiles)
invitee_email       TEXT
invitee_id          UUID (FK to user_profiles, nullable)
role                TEXT (admin/editor/viewer)
status              TEXT (pending/accepted/declined/cancelled)
invite_token        TEXT (unique)
expires_at          TIMESTAMP (defaults to 7 days)
created_at          TIMESTAMP
updated_at          TIMESTAMP
```

### organizations
```
id              UUID PRIMARY KEY
name            TEXT
slug            TEXT UNIQUE
logo            TEXT (nullable)
owner_id        UUID (FK to user_profiles)
subscription    TEXT (free/pro/team)
created_at      TIMESTAMP
updated_at      TIMESTAMP
```

### organization_members
```
id                  UUID PRIMARY KEY
organization_id     UUID (FK to organizations)
user_id             UUID (FK to user_profiles)
role                TEXT (admin/editor/viewer)
joined_at           TIMESTAMP
```

---

## 🎯 Next Steps

1. **Email Integration**: Implement actual email sending
2. **Notifications**: Add in-app notifications for invitations
3. **Organization Switcher**: Allow users to switch between organizations
4. **Member Management**: Add ability to change roles and remove members
5. **Invitation Analytics**: Track invitation acceptance rates

---

## 💡 Tips

- Invitations expire after 7 days by default
- Users can be members of multiple organizations
- Only admins can send invitations
- Accepting an invitation automatically adds you to the organization
- The system prevents duplicate invitations to the same email

---

## 📞 Support

If you encounter any issues:
1. Check the browser console for errors
2. Verify Supabase connection
3. Check RLS policies in Supabase dashboard
4. Review the implementation plan for detailed architecture

---

**Happy Collaborating! 🎉**
