import { useState, useEffect } from 'react';
import { Users, UserPlus, MoreHorizontal, Mail, Crown, Edit, Eye, Trash2, Search, Shield, Check, Clock, Link, Send, CheckCircle, XCircle, Building2 } from 'lucide-react';
import { DashboardLayout } from '../components/dashboard/DashboardLayout';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '../components/ui/card';
import { Button } from '../components/ui/button';
import { Input } from '../components/ui/input';
import { Label } from '../components/ui/label';
import { Badge } from '../components/ui/badge';
import { Avatar, AvatarFallback, AvatarImage } from '../components/ui/avatar';
import {
    Dialog,
    DialogContent,
    DialogDescription,
    DialogHeader,
    DialogTitle,
    DialogFooter,
} from '../components/ui/dialog';
import {
    DropdownMenu,
    DropdownMenuContent,
    DropdownMenuItem,
    DropdownMenuSeparator,
    DropdownMenuTrigger,
} from '../components/ui/dropdown-menu';
import { useBoards } from '../contexts/BoardContext';
import { getInitials, cn } from '../lib/utils';
import { toast } from 'sonner';
import { invitationService } from '../services/invitationService';
import { CreateOrganizationModal } from '../components/team/CreateOrganizationModal';
import type { TeamInvitation } from '../types';

const roleIcons = {
    admin: Crown,
    editor: Edit,
    viewer: Eye,
};

const roleColors = {
    admin: 'bg-amber-100 text-amber-700 border-amber-200',
    editor: 'bg-blue-100 text-blue-700 border-blue-200',
    viewer: 'bg-slate-100 text-slate-700 border-slate-200',
};

const roleDescriptions = {
    admin: 'Full access to all features and settings',
    editor: 'Can create and edit boards',
    viewer: 'Can only view boards',
};

export function Team() {
    const { currentOrganization } = useBoards();
    const [inviteModalOpen, setInviteModalOpen] = useState(false);
    const [createOrgModalOpen, setCreateOrgModalOpen] = useState(false);
    const [inviteEmail, setInviteEmail] = useState('');
    const [inviteRole, setInviteRole] = useState<'admin' | 'editor' | 'viewer'>('editor');
    const [isInviting, setIsInviting] = useState(false);
    const [searchQuery, setSearchQuery] = useState('');
    const [inviteSent, setInviteSent] = useState(false);
    
    // Invitation states
    const [pendingInvitations, setPendingInvitations] = useState<TeamInvitation[]>([]);
    const [receivedInvitations, setReceivedInvitations] = useState<TeamInvitation[]>([]);
    const [loadingInvitations, setLoadingInvitations] = useState(true);

    const members = currentOrganization?.members || [];
    
    const filteredMembers = members.filter(member => 
        member.user.name.toLowerCase().includes(searchQuery.toLowerCase()) ||
        member.user.email.toLowerCase().includes(searchQuery.toLowerCase())
    );

    // Load invitations
    useEffect(() => {
        loadInvitations();
    }, [currentOrganization?.id]);

    const loadInvitations = async () => {
        setLoadingInvitations(true);
        try {
            const [pending, received] = await Promise.all([
                currentOrganization?.id ? invitationService.getPendingInvitations(currentOrganization.id) : Promise.resolve([]),
                invitationService.getReceivedInvitations(),
            ]);
            setPendingInvitations(pending);
            setReceivedInvitations(received);
        } catch (error) {
            console.error('Error loading invitations:', error);
        } finally {
            setLoadingInvitations(false);
        }
    };

    const handleInvite = async () => {
        if (!inviteEmail) {
            toast.error('Please enter an email address');
            return;
        }

        if (!currentOrganization?.id) {
            toast.error('No organization selected');
            return;
        }

        setIsInviting(true);
        const result = await invitationService.sendTeamInvitation(
            inviteEmail,
            inviteRole,
            currentOrganization.id
        );
        setIsInviting(false);

        if (result.success) {
            setInviteSent(true);
            toast.success(`Invitation sent to ${inviteEmail}`);
            loadInvitations(); // Reload invitations
            
            setTimeout(() => {
                setInviteModalOpen(false);
                setInviteEmail('');
                setInviteSent(false);
            }, 2000);
        } else {
            toast.error(result.error || 'Failed to send invitation');
        }
    };

    const handleAcceptInvitation = async (invitationId: string) => {
        const result = await invitationService.acceptInvitation(invitationId);
        if (result.success) {
            toast.success('Invitation accepted! Welcome to the team!');
            loadInvitations();
            // Reload the page to refresh organization data
            window.location.reload();
        } else {
            toast.error(result.error || 'Failed to accept invitation');
        }
    };

    const handleDeclineInvitation = async (invitationId: string) => {
        const result = await invitationService.declineInvitation(invitationId);
        if (result.success) {
            toast.success('Invitation declined');
            loadInvitations();
        } else {
            toast.error(result.error || 'Failed to decline invitation');
        }
    };

    const handleCancelInvitation = async (invitationId: string) => {
        const result = await invitationService.cancelInvitation(invitationId);
        if (result.success) {
            toast.success('Invitation cancelled');
            loadInvitations();
        } else {
            toast.error(result.error || 'Failed to cancel invitation');
        }
    };

    const handleResendInvitation = async (invitationId: string) => {
        const result = await invitationService.resendInvitation(invitationId);
        if (result.success) {
            toast.success('Invitation resent');
        } else {
            toast.error(result.error || 'Failed to resend invitation');
        }
    };

    const copyInviteLink = () => {
        navigator.clipboard.writeText('https://canvasai.app/invite/abc123');
        toast.success('Invite link copied to clipboard');
    };

    const stats = currentOrganization ? [
        {
            label: 'Team Members',
            value: members.length,
            icon: Users,
            bgColor: 'bg-blue-50',
            iconColor: 'text-blue-600',
        },
        {
            label: 'Admins',
            value: members.filter(m => m.role === 'admin').length,
            icon: Crown,
            bgColor: 'bg-amber-50',
            iconColor: 'text-amber-600',
        },
        {
            label: 'Pending Invites',
            value: pendingInvitations.length,
            icon: Mail,
            bgColor: 'bg-emerald-50',
            iconColor: 'text-emerald-600',
        },
    ] : [];

    // If no organization, show create organization screen
    if (!currentOrganization) {
        return (
            <DashboardLayout>
                <div className="relative min-h-[calc(100vh-120px)]">
                    {/* Dot pattern background */}
                    <div 
                        className="absolute inset-0 pointer-events-none"
                        style={{
                            backgroundImage: 'radial-gradient(circle, #d4d4d4 1px, transparent 1px)',
                            backgroundSize: '24px 24px',
                        }}
                    />

                    <div className="relative z-10 flex flex-col items-center justify-center min-h-[60vh]">
                        <div className="max-w-md text-center">
                            <div className="w-20 h-20 rounded-full bg-gray-100 flex items-center justify-center mx-auto mb-6">
                                <Building2 className="w-10 h-10 text-gray-400" />
                            </div>
                            <h2 className="text-2xl font-bold text-gray-900 mb-3">
                                No Organization Yet
                            </h2>
                            <p className="text-gray-500 mb-8">
                                Create an organization to start inviting team members and collaborating on boards together.
                            </p>
                            <Button
                                onClick={() => setCreateOrgModalOpen(true)}
                                className="gap-2 bg-gray-900 hover:bg-gray-800 text-white"
                                size="lg"
                            >
                                <Building2 className="w-5 h-5" />
                                Create Organization
                            </Button>
                        </div>
                    </div>

                    {/* Invitations Received (even without organization) */}
                    {receivedInvitations.length > 0 && (
                        <div className="relative z-10 max-w-4xl mx-auto mt-8">
                            <Card className="border-blue-200 bg-blue-50/50 shadow-sm">
                                <CardHeader className="border-b border-blue-100">
                                    <CardTitle className="flex items-center gap-2 text-blue-900">
                                        <Mail className="w-5 h-5" />
                                        Invitations Received
                                    </CardTitle>
                                    <CardDescription className="text-blue-700">
                                        You have {receivedInvitations.length} pending invitation{receivedInvitations.length !== 1 ? 's' : ''}
                                    </CardDescription>
                                </CardHeader>
                                <CardContent className="p-6">
                                    <div className="space-y-3">
                                        {receivedInvitations.map((invitation) => (
                                            <div
                                                key={invitation.id}
                                                className="flex items-center gap-4 p-4 rounded-lg bg-white border border-blue-200 hover:border-blue-300 transition-colors"
                                            >
                                                <div className="w-12 h-12 rounded-full bg-blue-100 flex items-center justify-center">
                                                    <Users className="w-6 h-6 text-blue-600" />
                                                </div>
                                                <div className="flex-1 min-w-0">
                                                    <p className="font-semibold text-slate-900">
                                                        {invitation.organizationName || 'Organization'}
                                                    </p>
                                                    <p className="text-sm text-slate-600">
                                                        Invited by {invitation.inviterName || 'Team Admin'} as{' '}
                                                        <span className="font-medium">{invitation.role}</span>
                                                    </p>
                                                    <p className="text-xs text-slate-400 mt-1">
                                                        {new Date(invitation.createdAt).toLocaleDateString()}
                                                    </p>
                                                </div>
                                                <div className="flex items-center gap-2">
                                                    <Button
                                                        size="sm"
                                                        onClick={() => handleAcceptInvitation(invitation.id)}
                                                        className="gap-2 bg-green-600 hover:bg-green-700 text-white"
                                                    >
                                                        <CheckCircle className="w-4 h-4" />
                                                        Accept
                                                    </Button>
                                                    <Button
                                                        size="sm"
                                                        variant="ghost"
                                                        onClick={() => handleDeclineInvitation(invitation.id)}
                                                        className="gap-2 text-red-600 hover:text-red-700 hover:bg-red-50"
                                                    >
                                                        <XCircle className="w-4 h-4" />
                                                        Decline
                                                    </Button>
                                                </div>
                                            </div>
                                        ))}
                                    </div>
                                </CardContent>
                            </Card>
                        </div>
                    )}

                    {/* Create Organization Modal */}
                    <CreateOrganizationModal
                        open={createOrgModalOpen}
                        onOpenChange={setCreateOrgModalOpen}
                        onSuccess={() => {
                            window.location.reload();
                        }}
                    />
                </div>
            </DashboardLayout>
        );
    }

    return (
        <DashboardLayout>
            <div className="relative min-h-[calc(100vh-120px)]">
                {/* Dot pattern background - same as Dashboard */}
                <div 
                    className="absolute inset-0 pointer-events-none"
                    style={{
                        backgroundImage: 'radial-gradient(circle, #d4d4d4 1px, transparent 1px)',
                        backgroundSize: '24px 24px',
                    }}
                />

                <div className="relative z-10">
                    {/* Page Header */}
                    <div className="mb-10">
                        <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4">
                            <div>
                                <h1 className="text-2xl lg:text-3xl font-bold text-gray-900 tracking-tight">
                                    Team
                                </h1>
                                <p className="text-gray-500 mt-1 text-sm lg:text-base">
                                    Manage your team members and permissions
                                </p>
                            </div>
                            <div className="flex items-center gap-3">
                                <Button
                                    variant="outline"
                                    onClick={copyInviteLink}
                                    className="gap-2 bg-white border-2 border-gray-200 text-gray-700 hover:bg-gray-50 hover:border-gray-300 rounded-lg px-4 py-2 font-medium text-sm"
                                >
                                    <Link className="w-4 h-4" />
                                    Copy Invite Link
                                </Button>
                                <Button
                                    onClick={() => setInviteModalOpen(true)}
                                    className="gap-2 bg-gray-900 hover:bg-gray-800 text-white rounded-lg px-4 py-2 font-medium text-sm shadow-sm"
                                >
                                    <UserPlus className="w-4 h-4" />
                                    Invite Member
                                </Button>
                            </div>
                        </div>
                    </div>

                    {/* Team Stats */}
                    <div className="grid grid-cols-1 sm:grid-cols-3 gap-4 mb-8">
                        {stats.map((stat, index) => (
                            <Card 
                                key={stat.label}
                                className={cn(
                                    "border-slate-200 bg-white shadow-sm hover:shadow-md transition-all duration-300",
                                    "animate-in fade-in-0 slide-in-from-bottom-4"
                                )}
                                style={{ animationDelay: `${index * 100}ms`, animationFillMode: 'both' }}
                            >
                                <CardContent className="p-6">
                                    <div className="flex items-center gap-4">
                                        <div className={cn(
                                            "w-14 h-14 rounded-xl flex items-center justify-center",
                                            stat.bgColor
                                        )}>
                                            <stat.icon className={cn("w-7 h-7", stat.iconColor)} />
                                        </div>
                                        <div>
                                            <p className="text-3xl font-bold text-slate-900">{stat.value}</p>
                                            <p className="text-sm text-slate-500">{stat.label}</p>
                                        </div>
                                    </div>
                                </CardContent>
                            </Card>
                        ))}
                    </div>

                    {/* Invitations Received Section */}
                    {receivedInvitations.length > 0 && (
                        <Card className="border-blue-200 bg-blue-50/50 shadow-sm mb-6">
                            <CardHeader className="border-b border-blue-100">
                                <CardTitle className="flex items-center gap-2 text-blue-900">
                                    <Mail className="w-5 h-5" />
                                    Invitations Received
                                </CardTitle>
                                <CardDescription className="text-blue-700">
                                    You have {receivedInvitations.length} pending invitation{receivedInvitations.length !== 1 ? 's' : ''}
                                </CardDescription>
                            </CardHeader>
                            <CardContent className="p-6">
                                <div className="space-y-3">
                                    {receivedInvitations.map((invitation) => (
                                        <div
                                            key={invitation.id}
                                            className="flex items-center gap-4 p-4 rounded-lg bg-white border border-blue-200 hover:border-blue-300 transition-colors"
                                        >
                                            <div className="w-12 h-12 rounded-full bg-blue-100 flex items-center justify-center">
                                                <Users className="w-6 h-6 text-blue-600" />
                                            </div>
                                            <div className="flex-1 min-w-0">
                                                <p className="font-semibold text-slate-900">
                                                    {invitation.organizationName || 'Organization'}
                                                </p>
                                                <p className="text-sm text-slate-600">
                                                    Invited by {invitation.inviterName || 'Team Admin'} as{' '}
                                                    <span className="font-medium">{invitation.role}</span>
                                                </p>
                                                <p className="text-xs text-slate-400 mt-1">
                                                    {new Date(invitation.createdAt).toLocaleDateString()}
                                                </p>
                                            </div>
                                            <div className="flex items-center gap-2">
                                                <Button
                                                    size="sm"
                                                    onClick={() => handleAcceptInvitation(invitation.id)}
                                                    className="gap-2 bg-green-600 hover:bg-green-700 text-white"
                                                >
                                                    <CheckCircle className="w-4 h-4" />
                                                    Accept
                                                </Button>
                                                <Button
                                                    size="sm"
                                                    variant="ghost"
                                                    onClick={() => handleDeclineInvitation(invitation.id)}
                                                    className="gap-2 text-red-600 hover:text-red-700 hover:bg-red-50"
                                                >
                                                    <XCircle className="w-4 h-4" />
                                                    Decline
                                                </Button>
                                            </div>
                                        </div>
                                    ))}
                                </div>
                            </CardContent>
                        </Card>
                    )}

                    {/* Members Section */}
                    <Card className="border-slate-200 bg-white shadow-sm mb-6">
                        <CardHeader className="border-b border-slate-100">
                            <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4">
                                <div>
                                    <CardTitle className="flex items-center gap-2">
                                        <Users className="w-5 h-5 text-gray-900" />
                                        Members
                                    </CardTitle>
                                    <CardDescription>
                                        {currentOrganization?.name || 'Your organization'} has {members.length} members
                                    </CardDescription>
                                </div>
                                <div className="relative">
                                    <Search className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-slate-400" />
                                    <Input
                                        placeholder="Search members..."
                                        value={searchQuery}
                                        onChange={(e) => setSearchQuery(e.target.value)}
                                        className="pl-9 w-full sm:w-64 border-slate-200"
                                    />
                                </div>
                            </div>
                        </CardHeader>
                        <CardContent className="p-0">
                            <div className="divide-y divide-slate-100">
                                {filteredMembers.map((member, index) => {
                                    const RoleIcon = roleIcons[member.role];
                                    return (
                                        <div
                                            key={member.userId}
                                            className={cn(
                                                "flex items-center gap-4 p-5 hover:bg-slate-50 transition-colors",
                                                "animate-in fade-in-0 slide-in-from-left-2"
                                            )}
                                            style={{ animationDelay: `${index * 50}ms`, animationFillMode: 'both' }}
                                        >
                                            <div className="relative">
                                                <Avatar className="w-12 h-12 ring-2 ring-white shadow-sm">
                                                    <AvatarImage src={member.user.avatar} />
                                                    <AvatarFallback className="bg-gradient-to-br from-gray-700 to-gray-900 text-white font-semibold">
                                                        {getInitials(member.user.name)}
                                                    </AvatarFallback>
                                                </Avatar>
                                                {member.role === 'admin' && (
                                                    <div className="absolute -bottom-1 -right-1 w-5 h-5 rounded-full bg-amber-500 flex items-center justify-center ring-2 ring-white">
                                                        <Crown className="w-3 h-3 text-white" />
                                                    </div>
                                                )}
                                            </div>
                                            <div className="flex-1 min-w-0">
                                                <div className="flex items-center gap-2 mb-0.5">
                                                    <p className="font-semibold text-slate-900">{member.user.name}</p>
                                                </div>
                                                <p className="text-sm text-slate-500 truncate">{member.user.email}</p>
                                            </div>
                                            <div className="hidden md:flex items-center gap-2 text-xs text-slate-400">
                                                <Clock className="w-3.5 h-3.5" />
                                                <span>Active 2h ago</span>
                                            </div>
                                            <Badge className={cn("border font-medium", roleColors[member.role])}>
                                                <RoleIcon className="w-3 h-3 mr-1.5" />
                                                {member.role.charAt(0).toUpperCase() + member.role.slice(1)}
                                            </Badge>
                                            <DropdownMenu>
                                                <DropdownMenuTrigger asChild>
                                                    <button className="p-2 rounded-lg hover:bg-slate-100 transition-colors">
                                                        <MoreHorizontal className="w-5 h-5 text-slate-400" />
                                                    </button>
                                                </DropdownMenuTrigger>
                                                <DropdownMenuContent align="end" className="w-48">
                                                    <DropdownMenuItem className="gap-2">
                                                        <Shield className="w-4 h-4" />
                                                        Change Role
                                                    </DropdownMenuItem>
                                                    <DropdownMenuItem className="gap-2">
                                                        <Mail className="w-4 h-4" />
                                                        Send Message
                                                    </DropdownMenuItem>
                                                    <DropdownMenuSeparator />
                                                    <DropdownMenuItem className="text-red-600 focus:text-red-600 focus:bg-red-50 gap-2">
                                                        <Trash2 className="w-4 h-4" />
                                                        Remove Member
                                                    </DropdownMenuItem>
                                                </DropdownMenuContent>
                                            </DropdownMenu>
                                        </div>
                                    );
                                })}
                            </div>

                            {filteredMembers.length === 0 && (
                                <div className="p-12 text-center">
                                    <div className="w-16 h-16 rounded-2xl bg-slate-100 flex items-center justify-center mx-auto mb-4">
                                        <Search className="w-8 h-8 text-slate-400" />
                                    </div>
                                    <p className="text-slate-900 font-medium mb-1">No members found</p>
                                    <p className="text-slate-500 text-sm">Try adjusting your search query</p>
                                </div>
                            )}
                        </CardContent>
                    </Card>

                    {/* Pending Invitations (Sent) Section */}
                    <Card className="border-slate-200 bg-white shadow-sm">
                        <CardHeader>
                            <CardTitle className="flex items-center gap-2">
                                <Mail className="w-5 h-5 text-gray-900" />
                                Pending Invitations (Sent)
                            </CardTitle>
                            <CardDescription>
                                Invitations you've sent that haven't been accepted yet
                            </CardDescription>
                        </CardHeader>
                        <CardContent>
                            {loadingInvitations ? (
                                <div className="flex items-center justify-center py-8">
                                    <div className="w-8 h-8 border-4 border-slate-200 border-t-slate-900 rounded-full animate-spin" />
                                </div>
                            ) : pendingInvitations.length === 0 ? (
                                <div className="text-center py-8">
                                    <Mail className="w-12 h-12 text-slate-300 mx-auto mb-3" />
                                    <p className="text-slate-500 text-sm">No pending invitations</p>
                                </div>
                            ) : (
                                <div className="space-y-3">
                                    {pendingInvitations.map((invitation) => (
                                        <div
                                            key={invitation.id}
                                            className="flex items-center gap-4 p-4 rounded-lg bg-slate-50 border border-slate-100 hover:bg-slate-100 transition-colors"
                                        >
                                            <div className="w-10 h-10 rounded-full bg-slate-200 flex items-center justify-center">
                                                <Mail className="w-5 h-5 text-slate-600" />
                                            </div>
                                            <div className="flex-1 min-w-0">
                                                <p className="font-medium text-slate-900">{invitation.inviteeEmail}</p>
                                                <p className="text-sm text-slate-500">
                                                    Sent {new Date(invitation.createdAt).toLocaleDateString()}
                                                </p>
                                            </div>
                                            <Badge className={cn("border font-medium", roleColors[invitation.role])}>
                                                {invitation.role.charAt(0).toUpperCase() + invitation.role.slice(1)}
                                            </Badge>
                                            <Button
                                                variant="ghost"
                                                size="sm"
                                                onClick={() => handleResendInvitation(invitation.id)}
                                                className="text-slate-600 hover:bg-slate-200"
                                            >
                                                Resend
                                            </Button>
                                            <Button
                                                variant="ghost"
                                                size="sm"
                                                onClick={() => handleCancelInvitation(invitation.id)}
                                                className="text-red-500 hover:text-red-600 hover:bg-red-50"
                                            >
                                                Cancel
                                            </Button>
                                        </div>
                                    ))}
                                </div>
                            )}
                        </CardContent>
                    </Card>
                </div>
            </div>

            {/* Invite Modal */}
            <Dialog open={inviteModalOpen} onOpenChange={setInviteModalOpen}>
                <DialogContent className="sm:max-w-md">
                    {!inviteSent ? (
                        <>
                            <DialogHeader>
                                <div className="flex items-center gap-3 mb-2">
                                    <div className="w-10 h-10 rounded-xl bg-gray-900 flex items-center justify-center">
                                        <UserPlus className="w-5 h-5 text-white" />
                                    </div>
                                    <div>
                                        <DialogTitle>Invite Team Member</DialogTitle>
                                        <DialogDescription>
                                            Send an invitation to collaborate
                                        </DialogDescription>
                                    </div>
                                </div>
                            </DialogHeader>
                            <div className="space-y-5 py-4">
                                <div className="space-y-2">
                                    <Label htmlFor="email" className="text-slate-700">Email Address</Label>
                                    <Input
                                        id="email"
                                        type="email"
                                        placeholder="colleague@company.com"
                                        value={inviteEmail}
                                        onChange={(e) => setInviteEmail(e.target.value)}
                                        className="h-11"
                                    />
                                </div>
                                <div className="space-y-3">
                                    <Label className="text-slate-700">Select Role</Label>
                                    <div className="grid grid-cols-3 gap-3">
                                        {(['admin', 'editor', 'viewer'] as const).map((role) => {
                                            const Icon = roleIcons[role];
                                            return (
                                                <button
                                                    key={role}
                                                    onClick={() => setInviteRole(role)}
                                                    className={cn(
                                                        'p-4 rounded-xl border-2 text-center transition-all duration-200',
                                                        'hover:shadow-md hover:-translate-y-0.5',
                                                        inviteRole === role
                                                            ? 'border-gray-900 bg-gray-50 shadow-md'
                                                            : 'border-slate-200 hover:border-slate-300'
                                                    )}
                                                >
                                                    <div className={cn(
                                                        'w-10 h-10 rounded-xl flex items-center justify-center mx-auto mb-2',
                                                        inviteRole === role
                                                            ? 'bg-gray-900 text-white'
                                                            : 'bg-slate-100 text-slate-500'
                                                    )}>
                                                        <Icon className="w-5 h-5" />
                                                    </div>
                                                    <span className={cn(
                                                        'text-sm font-semibold capitalize block',
                                                        inviteRole === role ? 'text-gray-900' : 'text-slate-700'
                                                    )}>
                                                        {role}
                                                    </span>
                                                </button>
                                            );
                                        })}
                                    </div>
                                    <p className="text-xs text-slate-500 text-center mt-2">
                                        {roleDescriptions[inviteRole]}
                                    </p>
                                </div>
                            </div>
                            <DialogFooter className="gap-2 sm:gap-0">
                                <Button variant="outline" onClick={() => setInviteModalOpen(false)}>
                                    Cancel
                                </Button>
                                <Button
                                    onClick={handleInvite}
                                    disabled={isInviting || !inviteEmail}
                                    className="gap-2 bg-gray-900 hover:bg-gray-800 text-white"
                                >
                                    {isInviting ? (
                                        <>
                                            <div className="w-4 h-4 border-2 border-white/30 border-t-white rounded-full animate-spin" />
                                            Sending...
                                        </>
                                    ) : (
                                        <>
                                            <Send className="w-4 h-4" />
                                            Send Invitation
                                        </>
                                    )}
                                </Button>
                            </DialogFooter>
                        </>
                    ) : (
                        <div className="py-8 text-center">
                            <div className="w-16 h-16 rounded-full bg-emerald-100 flex items-center justify-center mx-auto mb-4">
                                <Check className="w-8 h-8 text-emerald-600" />
                            </div>
                            <h3 className="text-xl font-semibold text-slate-900 mb-2">
                                Invitation Sent! 🎉
                            </h3>
                            <p className="text-slate-500">
                                We've sent an invite to <span className="font-medium text-slate-700">{inviteEmail}</span>
                            </p>
                        </div>
                    )}
                </DialogContent>
            </Dialog>

            {/* Create Organization Modal */}
            <CreateOrganizationModal
                open={createOrgModalOpen}
                onOpenChange={setCreateOrgModalOpen}
                onSuccess={() => {
                    window.location.reload();
                }}
            />
        </DashboardLayout>
    );
}
