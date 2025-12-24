import { supabase } from '../lib/supabase';
import type { TeamInvitation } from '../types';

/**
 * Team Invitation Service
 * Handles all team invitation operations including sending, accepting, declining, and managing invitations
 */

export const invitationService = {
    /**
     * Send a team invitation
     * Checks if user exists and sends appropriate invitation
     */
    async sendTeamInvitation(
        email: string,
        role: 'admin' | 'editor' | 'viewer',
        organizationId: string
    ): Promise<{ success: boolean; invitation?: TeamInvitation; error?: string }> {
        try {
            // Get current user
            const { data: { user } } = await supabase.auth.getUser();
            if (!user) {
                return { success: false, error: 'Not authenticated' };
            }

            // Check if user with this email already exists
            const { data: existingUser } = await supabase
                .from('user_profiles')
                .select('id, email')
                .eq('email', email.toLowerCase())
                .single();

            // Check if user is already a member
            if (existingUser) {
                const { data: existingMember } = await supabase
                    .from('organization_members')
                    .select('id')
                    .eq('organization_id', organizationId)
                    .eq('user_id', existingUser.id)
                    .single();

                if (existingMember) {
                    return { success: false, error: 'User is already a member of this organization' };
                }
            }

            // Check if there's already a pending invitation
            const { data: existingInvitation } = await supabase
                .from('team_invitations')
                .select('id, status')
                .eq('organization_id', organizationId)
                .eq('invitee_email', email.toLowerCase())
                .eq('status', 'pending')
                .single();

            if (existingInvitation) {
                return { success: false, error: 'An invitation has already been sent to this email' };
            }

            // Create invitation
            const { data: invitation, error } = await supabase
                .from('team_invitations')
                .insert({
                    organization_id: organizationId,
                    inviter_id: user.id,
                    invitee_email: email.toLowerCase(),
                    invitee_id: existingUser?.id || null,
                    role,
                    status: 'pending',
                })
                .select(`
                    *,
                    organizations:organization_id (
                        name,
                        logo
                    ),
                    inviter:inviter_id (
                        name
                    )
                `)
                .single();

            if (error) {
                console.error('Error creating invitation:', error);
                return { success: false, error: error.message };
            }

            // Transform the data
            const transformedInvitation: TeamInvitation = {
                id: invitation.id,
                organizationId: invitation.organization_id,
                organizationName: invitation.organizations?.name,
                organizationLogo: invitation.organizations?.logo,
                inviterId: invitation.inviter_id,
                inviterName: invitation.inviter?.name,
                inviteeEmail: invitation.invitee_email,
                inviteeId: invitation.invitee_id,
                role: invitation.role,
                status: invitation.status,
                inviteToken: invitation.invite_token,
                expiresAt: invitation.expires_at,
                createdAt: invitation.created_at,
                updatedAt: invitation.updated_at,
            };

            // TODO: Send email notification
            // await this.sendInvitationEmail(transformedInvitation, existingUser ? 'existing' : 'new');

            return { success: true, invitation: transformedInvitation };
        } catch (error) {
            console.error('Error sending invitation:', error);
            return { success: false, error: 'Failed to send invitation' };
        }
    },

    /**
     * Get pending invitations sent by the organization
     */
    async getPendingInvitations(organizationId: string): Promise<TeamInvitation[]> {
        try {
            const { data, error } = await supabase
                .from('team_invitations')
                .select(`
                    *,
                    organizations:organization_id (
                        name,
                        logo
                    ),
                    inviter:inviter_id (
                        name
                    )
                `)
                .eq('organization_id', organizationId)
                .in('status', ['pending'])
                .order('created_at', { ascending: false });

            if (error) {
                console.error('Error fetching pending invitations:', error);
                return [];
            }

            return data.map(inv => ({
                id: inv.id,
                organizationId: inv.organization_id,
                organizationName: inv.organizations?.name,
                organizationLogo: inv.organizations?.logo,
                inviterId: inv.inviter_id,
                inviterName: inv.inviter?.name,
                inviteeEmail: inv.invitee_email,
                inviteeId: inv.invitee_id,
                role: inv.role,
                status: inv.status,
                inviteToken: inv.invite_token,
                expiresAt: inv.expires_at,
                createdAt: inv.created_at,
                updatedAt: inv.updated_at,
            }));
        } catch (error) {
            console.error('Error fetching pending invitations:', error);
            return [];
        }
    },

    /**
     * Get invitations received by the current user
     */
    async getReceivedInvitations(): Promise<TeamInvitation[]> {
        try {
            const { data: { user } } = await supabase.auth.getUser();
            if (!user) return [];

            const { data, error } = await supabase
                .from('team_invitations')
                .select(`
                    *,
                    organizations:organization_id (
                        name,
                        logo
                    ),
                    inviter:inviter_id (
                        name
                    )
                `)
                .or(`invitee_email.eq.${user.email},invitee_id.eq.${user.id}`)
                .eq('status', 'pending')
                .order('created_at', { ascending: false });

            if (error) {
                console.error('Error fetching received invitations:', error);
                return [];
            }

            return data.map(inv => ({
                id: inv.id,
                organizationId: inv.organization_id,
                organizationName: inv.organizations?.name,
                organizationLogo: inv.organizations?.logo,
                inviterId: inv.inviter_id,
                inviterName: inv.inviter?.name,
                inviteeEmail: inv.invitee_email,
                inviteeId: inv.invitee_id,
                role: inv.role,
                status: inv.status,
                inviteToken: inv.invite_token,
                expiresAt: inv.expires_at,
                createdAt: inv.created_at,
                updatedAt: inv.updated_at,
            }));
        } catch (error) {
            console.error('Error fetching received invitations:', error);
            return [];
        }
    },

    /**
     * Accept an invitation
     */
    async acceptInvitation(invitationId: string): Promise<{ success: boolean; error?: string }> {
        try {
            const { data: { user } } = await supabase.auth.getUser();
            if (!user) {
                return { success: false, error: 'Not authenticated' };
            }

            // Get the invitation
            const { data: invitation, error: fetchError } = await supabase
                .from('team_invitations')
                .select('*')
                .eq('id', invitationId)
                .single();

            if (fetchError || !invitation) {
                return { success: false, error: 'Invitation not found' };
            }

            // Check if invitation is still valid
            if (invitation.status !== 'pending') {
                return { success: false, error: 'Invitation is no longer valid' };
            }

            if (invitation.expires_at && new Date(invitation.expires_at) < new Date()) {
                return { success: false, error: 'Invitation has expired' };
            }

            // Add user to organization
            const { error: memberError } = await supabase
                .from('organization_members')
                .insert({
                    organization_id: invitation.organization_id,
                    user_id: user.id,
                    role: invitation.role,
                });

            if (memberError) {
                console.error('Error adding member:', memberError);
                return { success: false, error: 'Failed to join organization' };
            }

            // Update invitation status
            const { error: updateError } = await supabase
                .from('team_invitations')
                .update({ status: 'accepted' })
                .eq('id', invitationId);

            if (updateError) {
                console.error('Error updating invitation:', updateError);
            }

            return { success: true };
        } catch (error) {
            console.error('Error accepting invitation:', error);
            return { success: false, error: 'Failed to accept invitation' };
        }
    },

    /**
     * Decline an invitation
     */
    async declineInvitation(invitationId: string): Promise<{ success: boolean; error?: string }> {
        try {
            const { error } = await supabase
                .from('team_invitations')
                .update({ status: 'declined' })
                .eq('id', invitationId);

            if (error) {
                console.error('Error declining invitation:', error);
                return { success: false, error: error.message };
            }

            return { success: true };
        } catch (error) {
            console.error('Error declining invitation:', error);
            return { success: false, error: 'Failed to decline invitation' };
        }
    },

    /**
     * Cancel a sent invitation
     */
    async cancelInvitation(invitationId: string): Promise<{ success: boolean; error?: string }> {
        try {
            const { error } = await supabase
                .from('team_invitations')
                .update({ status: 'cancelled' })
                .eq('id', invitationId);

            if (error) {
                console.error('Error cancelling invitation:', error);
                return { success: false, error: error.message };
            }

            return { success: true };
        } catch (error) {
            console.error('Error cancelling invitation:', error);
            return { success: false, error: 'Failed to cancel invitation' };
        }
    },

    /**
     * Resend an invitation
     */
    async resendInvitation(invitationId: string): Promise<{ success: boolean; error?: string }> {
        try {
            // Get the invitation
            const { data: invitation, error: fetchError } = await supabase
                .from('team_invitations')
                .select('*')
                .eq('id', invitationId)
                .single();

            if (fetchError || !invitation) {
                return { success: false, error: 'Invitation not found' };
            }

            // Update expiry date
            const { error } = await supabase
                .from('team_invitations')
                .update({
                    expires_at: new Date(Date.now() + 7 * 24 * 60 * 60 * 1000).toISOString(),
                })
                .eq('id', invitationId);

            if (error) {
                console.error('Error resending invitation:', error);
                return { success: false, error: error.message };
            }

            // TODO: Send email notification again
            // await this.sendInvitationEmail(invitation, invitation.invitee_id ? 'existing' : 'new');

            return { success: true };
        } catch (error) {
            console.error('Error resending invitation:', error);
            return { success: false, error: 'Failed to resend invitation' };
        }
    },

    /**
     * Remove a member from an organization
     */
    async removeMember(
        organizationId: string,
        userId: string
    ): Promise<{ success: boolean; error?: string }> {
        try {
            const { data: { user } } = await supabase.auth.getUser();
            if (!user) {
                return { success: false, error: 'Not authenticated' };
            }

            // Check if current user is admin of the organization
            const { data: currentMember } = await supabase
                .from('organization_members')
                .select('role')
                .eq('organization_id', organizationId)
                .eq('user_id', user.id)
                .single();

            if (!currentMember || currentMember.role !== 'admin') {
                return { success: false, error: 'Only admins can remove members' };
            }

            // Prevent removing yourself
            if (userId === user.id) {
                return { success: false, error: 'You cannot remove yourself from the organization' };
            }

            // Remove the member
            const { error } = await supabase
                .from('organization_members')
                .delete()
                .eq('organization_id', organizationId)
                .eq('user_id', userId);

            if (error) {
                console.error('Error removing member:', error);
                return { success: false, error: error.message };
            }

            return { success: true };
        } catch (error) {
            console.error('Error removing member:', error);
            return { success: false, error: 'Failed to remove member' };
        }
    },

    /**
     * Send invitation email (placeholder for future implementation)
     */
    async sendInvitationEmail(
        invitation: TeamInvitation,
        userType: 'existing' | 'new'
    ): Promise<void> {
        // TODO: Implement email sending using Supabase Edge Functions or external service
        console.log('Sending invitation email:', { invitation, userType });
    },
};
