import { useState, useEffect } from 'react';
import { Users, X, Mail, Loader2, Trash2, Crown, Edit, Eye } from 'lucide-react';
import { Button } from '../ui/button';
import { Input } from '../ui/input';
import { Label } from '../ui/label';
import { Badge } from '../ui/badge';
import {
    Dialog,
    DialogContent,
    DialogDescription,
    DialogHeader,
    DialogTitle,
} from '../ui/dialog';
import { toast } from 'sonner';
import { addCollaborator, fetchCollaborators, removeCollaborator, type CollaboratorWithUser } from '../../lib/services/collaboratorService';
import { cn } from '../../lib/utils';

interface ShareBoardModalProps {
    open: boolean;
    onOpenChange: (open: boolean) => void;
    boardId: string;
    boardTitle: string;
}

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

export function ShareBoardModal({ open, onOpenChange, boardId, boardTitle }: ShareBoardModalProps) {
    const [email, setEmail] = useState('');
    const [role, setRole] = useState<'editor' | 'viewer' | 'admin'>('editor');
    const [isAdding, setIsAdding] = useState(false);
    const [collaborators, setCollaborators] = useState<CollaboratorWithUser[]>([]);
    const [isLoading, setIsLoading] = useState(true);

    useEffect(() => {
        if (open) {
            loadCollaborators();
        }
    }, [open, boardId]);

    const loadCollaborators = async () => {
        setIsLoading(true);
        try {
            const data = await fetchCollaborators(boardId);
            setCollaborators(data);
        } catch (error) {
            console.error('Error loading collaborators:', error);
            toast.error('Failed to load collaborators');
        } finally {
            setIsLoading(false);
        }
    };

    const handleAddCollaborator = async () => {
        if (!email.trim()) {
            toast.error('Please enter an email address');
            return;
        }

        // Basic email validation
        const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
        if (!emailRegex.test(email)) {
            toast.error('Please enter a valid email address');
            return;
        }

        setIsAdding(true);
        try {
            await addCollaborator(boardId, email.trim(), role);
            toast.success(`${email} added as ${role}`);
            setEmail('');
            setRole('editor');
            loadCollaborators();
        } catch (error: any) {
            console.error('Error adding collaborator:', error);
            if (error.message?.includes('duplicate')) {
                toast.error('This user is already a collaborator');
            } else if (error.message?.includes('not found')) {
                toast.error('User not found. They need to create an account first.');
            } else {
                toast.error('Failed to add collaborator');
            }
        } finally {
            setIsAdding(false);
        }
    };

    const handleRemoveCollaborator = async (collaboratorId: string, collaboratorEmail: string) => {
        try {
            await removeCollaborator(collaboratorId);
            toast.success(`${collaboratorEmail} removed`);
            loadCollaborators();
        } catch (error) {
            console.error('Error removing collaborator:', error);
            toast.error('Failed to remove collaborator');
        }
    };

    const copyShareLink = () => {
        const link = `${window.location.origin}/board/${boardId}`;
        navigator.clipboard.writeText(link);
        toast.success('Board link copied to clipboard');
    };

    return (
        <Dialog open={open} onOpenChange={onOpenChange}>
            <DialogContent className="sm:max-w-lg">
                <DialogHeader>
                    <div className="flex items-center gap-3 mb-2">
                        <div className="w-10 h-10 rounded-xl bg-gray-900 flex items-center justify-center">
                            <Users className="w-5 h-5 text-white" />
                        </div>
                        <div>
                            <DialogTitle>Share Board</DialogTitle>
                            <DialogDescription>
                                Invite people to collaborate on "{boardTitle}"
                            </DialogDescription>
                        </div>
                    </div>
                </DialogHeader>

                <div className="space-y-6 py-4">
                    {/* Add Collaborator Form */}
                    <div className="space-y-4">
                        <div className="space-y-2">
                            <Label htmlFor="email" className="text-slate-700">
                                Email Address
                            </Label>
                            <Input
                                id="email"
                                type="email"
                                placeholder="colleague@company.com"
                                value={email}
                                onChange={(e) => setEmail(e.target.value)}
                                onKeyDown={(e) => {
                                    if (e.key === 'Enter') {
                                        handleAddCollaborator();
                                    }
                                }}
                                className="h-11"
                                disabled={isAdding}
                            />
                        </div>

                        <div className="space-y-2">
                            <Label className="text-slate-700">Permission</Label>
                            <div className="grid grid-cols-3 gap-2">
                                {(['viewer', 'editor', 'admin'] as const).map((r) => {
                                    const Icon = roleIcons[r];
                                    return (
                                        <button
                                            key={r}
                                            onClick={() => setRole(r)}
                                            disabled={isAdding}
                                            className={cn(
                                                'p-3 rounded-lg border-2 text-center transition-all duration-200',
                                                'hover:shadow-md',
                                                role === r
                                                    ? 'border-gray-900 bg-gray-50 shadow-md'
                                                    : 'border-slate-200 hover:border-slate-300'
                                            )}
                                        >
                                            <div className={cn(
                                                'w-8 h-8 rounded-lg flex items-center justify-center mx-auto mb-1',
                                                role === r
                                                    ? 'bg-gray-900 text-white'
                                                    : 'bg-slate-100 text-slate-500'
                                            )}>
                                                <Icon className="w-4 h-4" />
                                            </div>
                                            <span className={cn(
                                                'text-xs font-semibold capitalize block',
                                                role === r ? 'text-gray-900' : 'text-slate-700'
                                            )}>
                                                {r}
                                            </span>
                                        </button>
                                    );
                                })}
                            </div>
                            <p className="text-xs text-slate-500">
                                {role === 'admin' && 'Full access - can manage collaborators and settings'}
                                {role === 'editor' && 'Can edit and make changes to the board'}
                                {role === 'viewer' && 'Can only view the board, no editing'}
                            </p>
                        </div>

                        <Button
                            onClick={handleAddCollaborator}
                            disabled={isAdding || !email.trim()}
                            className="w-full gap-2 bg-gray-900 hover:bg-gray-800 text-white"
                        >
                            {isAdding ? (
                                <>
                                    <Loader2 className="w-4 h-4 animate-spin" />
                                    Adding...
                                </>
                            ) : (
                                <>
                                    <Mail className="w-4 h-4" />
                                    Add Collaborator
                                </>
                            )}
                        </Button>
                    </div>

                    {/* Divider */}
                    <div className="relative">
                        <div className="absolute inset-0 flex items-center">
                            <div className="w-full border-t border-slate-200"></div>
                        </div>
                        <div className="relative flex justify-center text-xs uppercase">
                            <span className="bg-white px-2 text-slate-500">Current Collaborators</span>
                        </div>
                    </div>

                    {/* Collaborators List */}
                    <div className="space-y-2 max-h-64 overflow-y-auto">
                        {isLoading ? (
                            <div className="flex items-center justify-center py-8">
                                <Loader2 className="w-6 h-6 animate-spin text-slate-400" />
                            </div>
                        ) : collaborators.length === 0 ? (
                            <div className="text-center py-8">
                                <Users className="w-12 h-12 text-slate-300 mx-auto mb-3" />
                                <p className="text-sm text-slate-500">No collaborators yet</p>
                                <p className="text-xs text-slate-400 mt-1">Add someone above to start collaborating</p>
                            </div>
                        ) : (
                            collaborators.map((collaborator) => {
                                const RoleIcon = roleIcons[collaborator.role as keyof typeof roleIcons] || Eye;
                                return (
                                    <div
                                        key={collaborator.id}
                                        className="flex items-center gap-3 p-3 rounded-lg bg-slate-50 border border-slate-100 hover:bg-slate-100 transition-colors"
                                    >
                                        <div className="w-10 h-10 rounded-full bg-gray-900 flex items-center justify-center text-white font-semibold">
                                            {collaborator.user_profile?.name?.charAt(0).toUpperCase() || 
                                             collaborator.email?.charAt(0).toUpperCase() || '?'}
                                        </div>
                                        <div className="flex-1 min-w-0">
                                            <p className="font-medium text-slate-900 truncate">
                                                {collaborator.user_profile?.name || 'Pending'}
                                            </p>
                                            <p className="text-sm text-slate-500 truncate">
                                                {collaborator.email}
                                            </p>
                                        </div>
                                        <Badge className={cn("border font-medium", roleColors[collaborator.role as keyof typeof roleColors] || roleColors.viewer)}>
                                            <RoleIcon className="w-3 h-3 mr-1" />
                                            {collaborator.role}
                                        </Badge>
                                        <button
                                            onClick={() => handleRemoveCollaborator(collaborator.id, collaborator.email || 'User')}
                                            className="p-2 rounded-lg text-slate-400 hover:text-red-600 hover:bg-red-50 transition-colors"
                                        >
                                            <Trash2 className="w-4 h-4" />
                                        </button>
                                    </div>
                                );
                            })
                        )}
                    </div>

                    {/* Copy Link Button */}
                    <Button
                        variant="outline"
                        onClick={copyShareLink}
                        className="w-full gap-2"
                    >
                        <Mail className="w-4 h-4" />
                        Copy Board Link
                    </Button>
                </div>
            </DialogContent>
        </Dialog>
    );
}
