import { useState } from 'react';
import { Check, ChevronDown, Plus, Building2, Users } from 'lucide-react';
import {
    DropdownMenu,
    DropdownMenuContent,
    DropdownMenuItem,
    DropdownMenuSeparator,
    DropdownMenuTrigger,
    DropdownMenuLabel,
} from '../ui/dropdown-menu';
import { useBoards } from '../../contexts/BoardContext';
import { cn } from '../../lib/utils';
import { toast } from 'sonner';

export function OrgSwitcher() {
    const { organizations, currentOrganization, setCurrentOrganization, boards } = useBoards();
    const [isOpen, setIsOpen] = useState(false);

    const handleOrgSelect = (org: typeof organizations[0]) => {
        setCurrentOrganization(org);
        setIsOpen(false);
        toast.success(`Switched to ${org.name}`);
    };

    const boardCount = boards.filter(b => 
        !b.isDeleted && (!currentOrganization || b.organizationId === currentOrganization.id)
    ).length;

    return (
        <DropdownMenu open={isOpen} onOpenChange={setIsOpen}>
            <DropdownMenuTrigger asChild>
                <button className="w-full flex items-center justify-between p-2.5 rounded-lg bg-slate-50 hover:bg-slate-100 transition-colors group">
                    <div className="flex items-center gap-2">
                        <div className="w-8 h-8 rounded-lg bg-gray-900 flex items-center justify-center">
                            {currentOrganization?.logo ? (
                                <img 
                                    src={currentOrganization.logo} 
                                    alt={currentOrganization.name} 
                                    className="w-full h-full rounded-lg object-cover"
                                />
                            ) : (
                                <Building2 className="w-4 h-4 text-white" />
                            )}
                        </div>
                        <div className="text-left">
                            <p className="text-sm font-medium text-slate-900 truncate max-w-[140px]">
                                {currentOrganization?.name || 'Personal'}
                            </p>
                            <p className="text-xs text-slate-500">
                                {boardCount} {boardCount === 1 ? 'board' : 'boards'}
                            </p>
                        </div>
                    </div>
                    <ChevronDown className={cn(
                        "w-4 h-4 text-slate-400 transition-transform duration-200",
                        isOpen && "rotate-180"
                    )} />
                </button>
            </DropdownMenuTrigger>
            <DropdownMenuContent align="start" className="w-64">
                <DropdownMenuLabel className="text-xs text-slate-500 font-normal">
                    Switch workspace
                </DropdownMenuLabel>
                <DropdownMenuSeparator />
                
                {organizations.map((org) => {
                    const orgBoardCount = boards.filter(b => 
                        !b.isDeleted && b.organizationId === org.id
                    ).length;
                    const isSelected = currentOrganization?.id === org.id;

                    return (
                        <DropdownMenuItem
                            key={org.id}
                            onClick={() => handleOrgSelect(org)}
                            className={cn(
                                "flex items-center gap-3 py-2.5 cursor-pointer",
                                isSelected && "bg-slate-100"
                            )}
                        >
                            <div className={cn(
                                "w-9 h-9 rounded-lg flex items-center justify-center flex-shrink-0",
                                isSelected 
                                    ? "bg-gray-900" 
                                    : "bg-slate-100"
                            )}>
                                {org.logo ? (
                                    <img 
                                        src={org.logo} 
                                        alt={org.name} 
                                        className="w-full h-full rounded-lg object-cover"
                                    />
                                ) : (
                                    <Building2 className={cn(
                                        "w-4 h-4",
                                        isSelected ? "text-white" : "text-slate-500"
                                    )} />
                                )}
                            </div>
                            <div className="flex-1 min-w-0">
                                <p className={cn(
                                    "text-sm font-medium truncate",
                                    isSelected ? "text-slate-700" : "text-slate-900"
                                )}>
                                    {org.name}
                                </p>
                                <div className="flex items-center gap-2 text-xs text-slate-500">
                                    <span>{orgBoardCount} boards</span>
                                    <span className="w-1 h-1 rounded-full bg-slate-300" />
                                    <Users className="w-3 h-3" />
                                    <span>{org.members.length}</span>
                                </div>
                            </div>
                            {isSelected && (
                                <Check className="w-4 h-4 text-slate-600 flex-shrink-0" />
                            )}
                        </DropdownMenuItem>
                    );
                })}

                <DropdownMenuSeparator />
                <DropdownMenuItem 
                    className="flex items-center gap-3 py-2.5 text-slate-600 cursor-pointer"
                    onClick={() => toast.info('Create workspace feature coming soon!')}
                >
                    <div className="w-9 h-9 rounded-lg bg-slate-100 flex items-center justify-center">
                        <Plus className="w-4 h-4 text-slate-500" />
                    </div>
                    <span className="text-sm font-medium">Create workspace</span>
                </DropdownMenuItem>
            </DropdownMenuContent>
        </DropdownMenu>
    );
}
