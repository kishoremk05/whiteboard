import { useState } from 'react';
import { Users, UserPlus, MoreHorizontal, Mail, Crown, Edit, Eye, Trash2 } from 'lucide-react';
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
import { getInitials } from '../lib/utils';
import { toast } from 'sonner';

const roleIcons = {
    admin: Crown,
    editor: Edit,
    viewer: Eye,
};

const roleColors = {
    admin: 'bg-amber-100 text-amber-700',
    editor: 'bg-blue-100 text-blue-700',
    viewer: 'bg-slate-100 text-slate-700',
};

export function Team() {
    const { currentOrganization } = useBoards();
    const [inviteModalOpen, setInviteModalOpen] = useState(false);
    const [inviteEmail, setInviteEmail] = useState('');
    const [inviteRole, setInviteRole] = useState<'admin' | 'editor' | 'viewer'>('editor');
    const [isInviting, setIsInviting] = useState(false);

    const members = currentOrganization?.members || [];

    const handleInvite = async () => {
        if (!inviteEmail) {
            toast.error('Please enter an email address');
            return;
        }

        setIsInviting(true);
        await new Promise(resolve => setTimeout(resolve, 1500));
        setIsInviting(false);
        setInviteModalOpen(false);
        setInviteEmail('');
        toast.success(`Invitation sent to ${inviteEmail}`);
    };

    return (
        <DashboardLayout>
            {/* Page Header */}
            <div className="mb-8">
                <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4">
                    <div>
                        <div className="flex items-center gap-3 mb-2">
                            <div className="w-10 h-10 rounded-xl bg-primary-100 flex items-center justify-center">
                                <Users className="w-5 h-5 text-primary-600" />
                            </div>
                            <h1 className="text-2xl lg:text-3xl font-bold text-slate-900">
                                Team
                            </h1>
                        </div>
                        <p className="text-slate-500">
                            Manage your team members and their permissions
                        </p>
                    </div>
                    <Button
                        variant="gradient"
                        onClick={() => setInviteModalOpen(true)}
                        className="gap-2"
                    >
                        <UserPlus className="w-4 h-4" />
                        Invite Member
                    </Button>
                </div>
            </div>

            {/* Team Stats */}
            <div className="grid grid-cols-1 sm:grid-cols-3 gap-4 mb-8">
                <Card>
                    <CardContent className="p-6">
                        <div className="flex items-center gap-4">
                            <div className="w-12 h-12 rounded-xl bg-primary-100 flex items-center justify-center">
                                <Users className="w-6 h-6 text-primary-600" />
                            </div>
                            <div>
                                <p className="text-2xl font-bold text-slate-900">{members.length}</p>
                                <p className="text-sm text-slate-500">Team Members</p>
                            </div>
                        </div>
                    </CardContent>
                </Card>
                <Card>
                    <CardContent className="p-6">
                        <div className="flex items-center gap-4">
                            <div className="w-12 h-12 rounded-xl bg-amber-100 flex items-center justify-center">
                                <Crown className="w-6 h-6 text-amber-600" />
                            </div>
                            <div>
                                <p className="text-2xl font-bold text-slate-900">
                                    {members.filter(m => m.role === 'admin').length}
                                </p>
                                <p className="text-sm text-slate-500">Admins</p>
                            </div>
                        </div>
                    </CardContent>
                </Card>
                <Card>
                    <CardContent className="p-6">
                        <div className="flex items-center gap-4">
                            <div className="w-12 h-12 rounded-xl bg-emerald-100 flex items-center justify-center">
                                <Mail className="w-6 h-6 text-emerald-600" />
                            </div>
                            <div>
                                <p className="text-2xl font-bold text-slate-900">0</p>
                                <p className="text-sm text-slate-500">Pending Invites</p>
                            </div>
                        </div>
                    </CardContent>
                </Card>
            </div>

            {/* Members Table */}
            <Card>
                <CardHeader>
                    <CardTitle>Members</CardTitle>
                    <CardDescription>
                        All members of {currentOrganization?.name || 'your organization'}
                    </CardDescription>
                </CardHeader>
                <CardContent>
                    <div className="space-y-4">
                        {members.map((member) => {
                            const RoleIcon = roleIcons[member.role];
                            return (
                                <div
                                    key={member.userId}
                                    className="flex items-center gap-4 p-4 rounded-xl bg-slate-50 hover:bg-slate-100 transition-colors"
                                >
                                    <Avatar className="w-12 h-12">
                                        <AvatarImage src={member.user.avatar} />
                                        <AvatarFallback>
                                            {getInitials(member.user.name)}
                                        </AvatarFallback>
                                    </Avatar>
                                    <div className="flex-1 min-w-0">
                                        <div className="flex items-center gap-2">
                                            <p className="font-medium text-slate-900">{member.user.name}</p>
                                            {member.role === 'admin' && (
                                                <Crown className="w-4 h-4 text-amber-500" />
                                            )}
                                        </div>
                                        <p className="text-sm text-slate-500 truncate">{member.user.email}</p>
                                    </div>
                                    <Badge className={roleColors[member.role]}>
                                        <RoleIcon className="w-3 h-3 mr-1" />
                                        {member.role.charAt(0).toUpperCase() + member.role.slice(1)}
                                    </Badge>
                                    <DropdownMenu>
                                        <DropdownMenuTrigger asChild>
                                            <button className="p-2 rounded-lg hover:bg-slate-200 transition-colors">
                                                <MoreHorizontal className="w-5 h-5 text-slate-500" />
                                            </button>
                                        </DropdownMenuTrigger>
                                        <DropdownMenuContent align="end">
                                            <DropdownMenuItem>Change Role</DropdownMenuItem>
                                            <DropdownMenuSeparator />
                                            <DropdownMenuItem className="text-red-600">
                                                <Trash2 className="w-4 h-4 mr-2" />
                                                Remove
                                            </DropdownMenuItem>
                                        </DropdownMenuContent>
                                    </DropdownMenu>
                                </div>
                            );
                        })}
                    </div>
                </CardContent>
            </Card>

            {/* Invite Modal */}
            <Dialog open={inviteModalOpen} onOpenChange={setInviteModalOpen}>
                <DialogContent>
                    <DialogHeader>
                        <DialogTitle>Invite Team Member</DialogTitle>
                        <DialogDescription>
                            Send an invitation to join your team
                        </DialogDescription>
                    </DialogHeader>
                    <div className="space-y-4 py-4">
                        <div className="space-y-2">
                            <Label htmlFor="email">Email Address</Label>
                            <Input
                                id="email"
                                type="email"
                                placeholder="colleague@company.com"
                                value={inviteEmail}
                                onChange={(e) => setInviteEmail(e.target.value)}
                            />
                        </div>
                        <div className="space-y-2">
                            <Label>Role</Label>
                            <div className="grid grid-cols-3 gap-2">
                                {(['admin', 'editor', 'viewer'] as const).map((role) => {
                                    const Icon = roleIcons[role];
                                    return (
                                        <button
                                            key={role}
                                            onClick={() => setInviteRole(role)}
                                            className={`p-3 rounded-lg border-2 text-center transition-all ${inviteRole === role
                                                    ? 'border-primary-500 bg-primary-50'
                                                    : 'border-slate-200 hover:border-slate-300'
                                                }`}
                                        >
                                            <Icon className={`w-5 h-5 mx-auto mb-1 ${inviteRole === role ? 'text-primary-600' : 'text-slate-500'
                                                }`} />
                                            <span className={`text-sm font-medium capitalize ${inviteRole === role ? 'text-primary-700' : 'text-slate-700'
                                                }`}>
                                                {role}
                                            </span>
                                        </button>
                                    );
                                })}
                            </div>
                        </div>
                    </div>
                    <DialogFooter>
                        <Button variant="outline" onClick={() => setInviteModalOpen(false)}>
                            Cancel
                        </Button>
                        <Button
                            variant="gradient"
                            onClick={handleInvite}
                            disabled={isInviting}
                        >
                            {isInviting ? 'Sending...' : 'Send Invitation'}
                        </Button>
                    </DialogFooter>
                </DialogContent>
            </Dialog>
        </DashboardLayout>
    );
}
