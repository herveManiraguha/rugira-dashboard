import React, { useState, useEffect } from 'react';
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
} from '@/components/ui/dialog';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Alert, AlertDescription } from '@/components/ui/alert';
import { AlertCircle } from 'lucide-react';
import { useToast } from '@/hooks/use-toast';
import { organizationsApi, type Organization } from '@/lib/api/organizations';

interface AddEditOrgModalProps {
  open: boolean;
  onClose: () => void;
  organization?: Organization | null;
  onSuccess: () => void;
}

export function AddEditOrgModal({
  open,
  onClose,
  organization,
  onSuccess
}: AddEditOrgModalProps) {
  const [name, setName] = useState('');
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState('');
  const { toast } = useToast();
  const isEditMode = !!organization;

  useEffect(() => {
    if (organization) {
      setName(organization.name);
    } else {
      setName('');
    }
    setError('');
  }, [organization, open]);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    
    if (!name.trim()) {
      setError('Organization name is required');
      return;
    }

    setLoading(true);
    setError('');

    try {
      if (isEditMode && organization) {
        await organizationsApi.updateOrganization(organization.id, { name });
        toast({
          title: "Organization updated",
          description: `${name} has been updated successfully.`
        });
      } else {
        await organizationsApi.createOrganization({ name });
        toast({
          title: "Organization created",
          description: `${name} has been created successfully.`
        });
      }
      onSuccess();
    } catch (error: any) {
      if (error?.response?.status === 409) {
        setError('An organization with this name already exists');
      } else if (error?.response?.status === 403) {
        toast({
          title: "Permission denied",
          description: "You don't have permission to manage this organization.",
          variant: "destructive"
        });
        onClose();
      } else {
        toast({
          title: isEditMode ? "Failed to update organization" : "Failed to create organization",
          description: "Please try again later",
          variant: "destructive"
        });
      }
    } finally {
      setLoading(false);
    }
  };

  const handleKeyDown = (e: React.KeyboardEvent) => {
    if (e.key === 'Escape' && !loading) {
      onClose();
    }
  };

  return (
    <Dialog open={open} onOpenChange={(open) => !open && onClose()}>
      <DialogContent onKeyDown={handleKeyDown} className="sm:max-w-md">
        <DialogHeader>
          <DialogTitle>
            {isEditMode ? 'Edit Organization' : 'Add Organization'}
          </DialogTitle>
        </DialogHeader>
        
        <form onSubmit={handleSubmit} className="space-y-4">
          <div>
            <Label htmlFor="org-name">
              Name <span className="text-red-500">*</span>
            </Label>
            <Input
              id="org-name"
              value={name}
              onChange={(e) => {
                setName(e.target.value);
                setError('');
              }}
              placeholder="Enter organization name"
              disabled={loading}
              autoFocus
              data-testid="input-org-name"
            />
            {error && (
              <Alert variant="destructive" className="mt-2">
                <AlertCircle className="h-4 w-4" />
                <AlertDescription>{error}</AlertDescription>
              </Alert>
            )}
          </div>

          <div className="flex justify-end gap-2">
            <Button
              type="button"
              variant="outline"
              onClick={onClose}
              disabled={loading}
            >
              Cancel
            </Button>
            <Button
              type="submit"
              disabled={loading || !name.trim()}
              className="bg-brand-red hover:bg-red-700"
            >
              {loading ? (
                <div className="flex items-center gap-2">
                  <div className="animate-spin rounded-full h-4 w-4 border-b-2 border-white"></div>
                  {isEditMode ? 'Updating...' : 'Creating...'}
                </div>
              ) : (
                isEditMode ? 'Update' : 'Create'
              )}
            </Button>
          </div>
        </form>
      </DialogContent>
    </Dialog>
  );
}