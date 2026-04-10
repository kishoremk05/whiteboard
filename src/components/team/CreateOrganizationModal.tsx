import { useState } from "react";
import { Building2, Plus, Loader2 } from "lucide-react";
import { Button } from "../ui/button";
import { Input } from "../ui/input";
import { Label } from "../ui/label";
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogHeader,
  DialogTitle,
  DialogFooter,
} from "../ui/dialog";
// import { supabase } from '../../lib/supabase';
import { toast } from "sonner";

interface CreateOrganizationModalProps {
  open: boolean;
  onOpenChange: (open: boolean) => void;
  onSuccess: () => void;
}

export function CreateOrganizationModal({
  open,
  onOpenChange,
  onSuccess,
}: CreateOrganizationModalProps) {
  const [orgName, setOrgName] = useState("");
  const [isCreating, setIsCreating] = useState(false);

  const generateSlug = (name: string): string => {
    return name
      .toLowerCase()
      .replace(/[^a-z0-9]+/g, "-")
      .replace(/^-+|-+$/g, "");
  };

  const handleCreate = async () => {
    if (!orgName.trim()) {
      toast.error("Please enter an organization name");
      return;
    }

    setIsCreating(true);

    try {
      // Mock organization creation
      await new Promise((resolve) => setTimeout(resolve, 1000));

      const slug = generateSlug(orgName);

      // Mock organization data
      const newOrg = {
        id: `org-${Date.now()}`,
        name: orgName.trim(),
        slug,
        owner_id: "mock-user-id",
        subscription: "free",
      };

      toast.success("Organization created successfully!");
      setOrgName("");
      onOpenChange(false);
      onSuccess();
    } catch (error) {
      console.error("Error creating organization:", error);
      toast.error("Failed to create organization");
    } finally {
      setIsCreating(false);
    }
  };

  return (
    <Dialog open={open} onOpenChange={onOpenChange}>
      <DialogContent className="sm:max-w-md">
        <DialogHeader>
          <div className="flex items-center gap-3 mb-2">
            <div className="w-10 h-10 rounded-xl bg-gray-900 flex items-center justify-center">
              <Building2 className="w-5 h-5 text-white" />
            </div>
            <div>
              <DialogTitle>Create Organization</DialogTitle>
              <DialogDescription>
                Start collaborating with your team
              </DialogDescription>
            </div>
          </div>
        </DialogHeader>
        <div className="space-y-4 py-4">
          <div className="space-y-2">
            <Label htmlFor="orgName" className="text-slate-700">
              Organization Name
            </Label>
            <Input
              id="orgName"
              type="text"
              placeholder="My Awesome Team"
              value={orgName}
              onChange={(e) => setOrgName(e.target.value)}
              className="h-11"
              disabled={isCreating}
            />
            {orgName && (
              <p className="text-xs text-slate-500">
                Slug: {generateSlug(orgName)}
              </p>
            )}
          </div>
        </div>
        <DialogFooter className="gap-2 sm:gap-0">
          <Button
            variant="outline"
            onClick={() => onOpenChange(false)}
            disabled={isCreating}
          >
            Cancel
          </Button>
          <Button
            onClick={handleCreate}
            disabled={isCreating || !orgName.trim()}
            className="gap-2 bg-gray-900 hover:bg-gray-800 text-white"
          >
            {isCreating ? (
              <>
                <Loader2 className="w-4 h-4 animate-spin" />
                Creating...
              </>
            ) : (
              <>
                <Plus className="w-4 h-4" />
                Create Organization
              </>
            )}
          </Button>
        </DialogFooter>
      </DialogContent>
    </Dialog>
  );
}
