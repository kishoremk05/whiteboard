import { useState, useEffect } from 'react';
import { Users, Loader2, Crown, Edit, Eye, Check, X } from 'lucide-react';
import { Badge } from '../ui/badge';
import { Avatar, AvatarFallback, AvatarImage } from '../ui/avatar';
import {
    Dialog,
    DialogContent,
    DialogDescription,
    DialogHeader,
    DialogTitle,
} from '../ui/dialog';
import { toast } from 'sonner';
import { addCollaborator, fetchCollaborators, removeCollaborator, type CollaboratorWithUser } from '../../lib/services/collaboratorService';
import { useBoards } from '../../contexts/BoardContext';
import { getInitials, cn } from '../../lib/utils';

interface TeamCollaborateModalProps {
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

export function TeamCollaborateModal({ open, onOpenChange, boardId, boardTitle }: TeamCollaborateModalProps) {
    const { currentOrganization } = useBoards();
    const [collaborators, setCollaborators] = useState<CollaboratorWithUser[]>([]);
    const [isLoading, setIsLoading] = useState(true);
    const [processingMemberId, setProcessingMemberId] = useState<string | null>(null);

    const members = currentOrganization?.members || [];

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
            // Don't show error toast, just continue with empty collaborators list
            // This allows the modal to still work even if the table doesn't exist yet
            setCollaborators([]);
        } finally {
            setIsLoading(false);
        }
    };

    const getCollaboratorRecord = (userId: string) => {
        return collaborators.find(collab => collab.user_id === userId);
    };

    const isAlreadyCollaborator = (userId: string) => {
        return collaborators.some(collab => collab.user_id === userId);
    };

    const handleToggleMember = async (memberEmail: string, memberId: string, memberName: string) => {
        const existingCollab = getCollaboratorRecord(memberId);
        
        if (existingCollab) {
            // Remove collaborator
            await handleRemoveMember(existingCollab.id, memberName);
        } else {
            // Add collaborator
            await handleAddMember(memberEmail, memberId, memberName);
        }
    };

    const handleAddMember = async (memberEmail: string, memberId: string, memberName: string) => {
        setProcessingMemberId(memberId);
        try {
            await addCollaborator(boardId, memberEmail, 'editor');
            toast.success(`${memberName} added as collaborator`);
            loadCollaborators();
        } catch (error: any) {
            console.error('Error adding collaborator:', error);
            if (error.message?.includes('duplicate')) {
                toast.error('This user is already a collaborator');
            } else {
                toast.error('Failed to add collaborator');
            }
        } finally {
            setProcessingMemberId(null);
        }
    };

    const handleRemoveMember = async (collaboratorId: string, memberName: string) => {
        setProcessingMemberId(collaboratorId);
        try {
            await removeCollaborator(collaboratorId);
            toast.success(`${memberName} removed from collaborators`);
            loadCollaborators();
        } catch (error: any) {
            console.error('Error removing collaborator:', error);
            toast.error('Failed to remove collaborator');
        } finally {
            setProcessingMemberId(null);
        }
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
                            <DialogTitle>Add Team Members</DialogTitle>
                            <DialogDescription>
                                Click on a team member to add them to "{boardTitle}"
                            </DialogDescription>
                        </div>
                    </div>
                </DialogHeader>

                <div className="py-4">
                    {/* Team Members List */}
                    <div className="space-y-2 max-h-96 overflow-y-auto">
                        {isLoading ? (
                            <div className="flex items-center justify-center py-8">
                                <Loader2 className="w-6 h-6 animate-spin text-slate-400" />
                            </div>
                        ) : members.length === 0 ? (
                            <div className="text-center py-8">
                                <Users className="w-12 h-12 text-slate-300 mx-auto mb-3" />
                                <p className="text-sm text-slate-500">No team members found</p>
                                <p className="text-xs text-slate-400 mt-1">Invite members to your organization first</p>
                            </div>
                        ) : (
                            members.map((member) => {
                                const RoleIcon = roleIcons[member.role as keyof typeof roleIcons] || Eye;
                                const isCollaborator = isAlreadyCollaborator(member.userId);
                                const isProcessing = processingMemberId === member.userId || 
                                                    processingMemberId === getCollaboratorRecord(member.userId)?.id;

                                return (
                                    <button
                                        key={member.userId}
                                        onClick={() => !isProcessing && handleToggleMember(member.user.email, member.userId, member.user.name)}
                                        disabled={isProcessing}
                                        className={cn(
                                            "w-full flex items-center gap-3 p-3 rounded-lg border transition-all",
                                            isCollaborator
                                                ? "bg-green-50 border-green-200 hover:bg-green-100 hover:border-green-300"
                                                : "bg-slate-50 border-slate-200 hover:bg-slate-100 hover:border-slate-300 hover:shadow-md",
                                            isProcessing && "opacity-50 cursor-wait",
                                            !isProcessing && "cursor-pointer"
                                        )}
                                    >
                                        <div className="relative">
                                            <Avatar className="w-10 h-10 ring-2 ring-white shadow-sm">
                                                <AvatarImage src={member.user.avatar} />
                                                <AvatarFallback className="bg-gradient-to-br from-gray-700 to-gray-900 text-white font-semibold text-sm">
                                                    {getInitials(member.user.name)}
                                                </AvatarFallback>
                                            </Avatar>
                                            {member.role === 'admin' && (
                                                <div className="absolute -bottom-1 -right-1 w-5 h-5 rounded-full bg-amber-500 flex items-center justify-center ring-2 ring-white">
                                                    <Crown className="w-3 h-3 text-white" />
                                                </div>
                                            )}
                                        </div>
                                        <div className="flex-1 min-w-0 text-left">
                                            <p className="font-medium text-slate-900 truncate">{member.user.name}</p>
                                            <p className="text-sm text-slate-500 truncate">{member.user.email}</p>
                                        </div>
                                        {isProcessing ? (
                                            <Loader2 className="w-5 h-5 animate-spin text-slate-400" />
                                        ) : isCollaborator ? (
                                            <div className="flex items-center gap-2">
                                                <Badge className="bg-green-100 text-green-700 border-green-200">
                                                    <Check className="w-3 h-3 mr-1" />
                                                    Added
                                                </Badge>
                                                <div className="w-6 h-6 rounded-full bg-red-100 flex items-center justify-center">
                                                    <X className="w-4 h-4 text-red-600" />
                                                </div>
                                            </div>
                                        ) : (
                                            <Badge className={cn("border font-medium", roleColors[member.role as keyof typeof roleColors] || roleColors.viewer)}>
                                                <RoleIcon className="w-3 h-3 mr-1" />
                                                {member.role}
                                            </Badge>
                                        )}
                                    </button>
                                );
                            })
                        )}
                    </div>

                    {/* Info Text */}
                    <div className="mt-4 p-3 bg-blue-50 border border-blue-200 rounded-lg">
                        <p className="text-xs text-blue-700">
                            💡 <strong>Tip:</strong> Click on a member to add them as a collaborator. Click again to remove them.
                        </p>
                    </div>
                </div>
            </DialogContent>
        </Dialog>
    );
}
