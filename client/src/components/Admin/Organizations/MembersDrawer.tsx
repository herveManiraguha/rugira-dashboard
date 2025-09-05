import React, { useState, useEffect } from 'react';
import { X, Trash2, Plus, User } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Badge } from '@/components/ui/badge';
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from '@/components/ui/select';
import { useToast } from '@/hooks/use-toast';
import { organizationsApi, type Organization, type OrgRole } from '@/lib/api/organizations';
import { useAuth } from '@/contexts/AuthContext';

interface MembersDrawerProps {
  open: boolean;
  onClose: () => void;
  organization: Organization | null;
  onUpdate?: () => void;
  preFilteredUser?: string;
}

export function MembersDrawer({
  open,
  onClose,
  organization,
  onUpdate,
  preFilteredUser
}: MembersDrawerProps) {
  const [members, setMembers] = useState<OrgRole[]>([]);
  const [loading, setLoading] = useState(false);
  const [addingMember, setAddingMember] = useState(false);
  const [selectedUserId, setSelectedUserId] = useState('');
  const [selectedRole, setSelectedRole] = useState<string>('viewer');
  const [availableUsers, setAvailableUsers] = useState<any[]>([]);
  const [userSearch, setUserSearch] = useState('');
  const { toast } = useToast();
  const { user } = useAuth();
  
  const canManageMembers = true; // For demo purposes, allow all actions

  useEffect(() => {
    if (open && organization) {
      loadMembers();
      loadAvailableUsers();
    }
  }, [open, organization]);

  const loadMembers = async () => {
    if (!organization) return;
    
    setLoading(true);
    try {
      const data = await organizationsApi.listOrgRoles(organization.id);
      setMembers(data);
    } catch (error) {
      toast({
        title: "Failed to load members",
        description: "Please try again later",
        variant: "destructive"
      });
    } finally {
      setLoading(false);
    }
  };

  const loadAvailableUsers = async () => {
    try {
      // This would be replaced with actual user API
      const mockUsers = [
        { id: '1', email: 'hans.mueller@rugira.ch', name: 'Hans Mueller' },
        { id: '2', email: 'emma.chen@tradepro.com', name: 'Emma Chen' },
        { id: '3', email: 'marco.rossi@cryptofund.it', name: 'Marco Rossi' },
        { id: '4', email: 'sarah.j@quanthedge.com', name: 'Sarah Johnson' },
      ];
      setAvailableUsers(mockUsers);
    } catch (error) {
      // Handle error
    }
  };

  const handleAddMember = async () => {
    if (!organization || !selectedUserId || !selectedRole) return;
    
    setAddingMember(true);
    try {
      await organizationsApi.addOrgRole(organization.id, {
        user_id: selectedUserId,
        role: selectedRole as any
      });
      toast({
        title: "Member added",
        description: "User has been added to the organization."
      });
      setSelectedUserId('');
      setSelectedRole('viewer');
      setUserSearch('');
      loadMembers();
      if (onUpdate) onUpdate();
    } catch (error: any) {
      if (error?.response?.status === 403) {
        toast({
          title: "Permission denied",
          description: "You don't have permission to manage this organization.",
          variant: "destructive"
        });
      } else {
        toast({
          title: "Failed to add member",
          description: "Please try again later",
          variant: "destructive"
        });
      }
    } finally {
      setAddingMember(false);
    }
  };

  const handleRemoveMember = async (bindingId: string) => {
    if (!organization) return;
    
    try {
      await organizationsApi.removeOrgRole(organization.id, bindingId);
      toast({
        title: "Member removed",
        description: "User has been removed from the organization."
      });
      loadMembers();
      if (onUpdate) onUpdate();
    } catch (error: any) {
      if (error?.response?.status === 403) {
        toast({
          title: "Permission denied",
          description: "You don't have permission to manage this organization.",
          variant: "destructive"
        });
      } else {
        toast({
          title: "Failed to remove member",
          description: "Please try again later",
          variant: "destructive"
        });
      }
    }
  };

  const getRoleBadgeColor = (role: string) => {
    switch (role) {
      case 'org_admin': return 'bg-red-100 text-red-800';
      case 'trader': return 'bg-blue-100 text-blue-800';
      case 'analyst': return 'bg-green-100 text-green-800';
      case 'compliance': return 'bg-purple-100 text-purple-800';
      default: return 'bg-gray-100 text-gray-800';
    }
  };

  const filteredUsers = availableUsers.filter(u => 
    u.email.toLowerCase().includes(userSearch.toLowerCase()) ||
    u.name.toLowerCase().includes(userSearch.toLowerCase())
  );

  if (!open) return null;

  return (
    <div className="fixed inset-0 z-50 flex">
      <div 
        className="fixed inset-0 bg-black/50" 
        onClick={onClose}
        aria-hidden="true"
      />
      
      <div className="fixed right-0 top-0 h-full w-full max-w-md bg-white shadow-xl">
        <div className="flex h-full flex-col">
          {/* Header */}
          <div className="border-b px-6 py-4">
            <div className="flex items-center justify-between">
              <div className="flex items-center gap-2">
                <h2 className="text-lg font-semibold">
                  Members — {organization?.name || ''}
                </h2>
                <Badge variant="secondary">
                  {members.length}
                </Badge>
              </div>
              <Button
                variant="ghost"
                size="sm"
                onClick={onClose}
                className="h-8 w-8 p-0"
              >
                <X className="h-4 w-4" />
              </Button>
            </div>
            {preFilteredUser && (
              <p className="mt-2 text-sm text-gray-600">
                Show orgs for: {preFilteredUser}
              </p>
            )}
          </div>

          {/* Members List */}
          <div className="flex-1 overflow-y-auto p-6">
            {loading ? (
              <div className="flex items-center justify-center py-8">
                <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-red-600"></div>
              </div>
            ) : members.length === 0 ? (
              <div className="text-center py-8">
                <User className="h-12 w-12 text-gray-400 mx-auto mb-3" />
                <p className="text-gray-600">No members yet</p>
                <p className="text-sm text-gray-500 mt-1">
                  Add users to this organization below
                </p>
              </div>
            ) : (
              <div className="space-y-3">
                {members.map((member) => (
                  <div
                    key={member.id}
                    className="flex items-center justify-between rounded-lg border p-3"
                  >
                    <div>
                      <p className="font-medium">{member.userEmail}</p>
                      <Badge className={`mt-1 ${getRoleBadgeColor(member.role)}`}>
                        {member.role}
                      </Badge>
                    </div>
                    {canManageMembers && (
                      <Button
                        variant="ghost"
                        size="sm"
                        onClick={() => handleRemoveMember(member.id)}
                        className="h-8 w-8 p-0 text-red-600 hover:text-red-700 hover:bg-red-50"
                        data-testid={`button-remove-member-${member.id}`}
                      >
                        <Trash2 className="h-4 w-4" />
                      </Button>
                    )}
                  </div>
                ))}
              </div>
            )}
          </div>

          {/* Add Member Form */}
          {canManageMembers && (
            <div className="border-t p-6">
              <h3 className="font-medium mb-4">Add Member</h3>
              <div className="space-y-4">
                <div>
                  <Label htmlFor="user-search">User</Label>
                  <Input
                    id="user-search"
                    value={userSearch}
                    onChange={(e) => setUserSearch(e.target.value)}
                    placeholder="Search by email or name..."
                    data-testid="input-user-search"
                  />
                  {userSearch && filteredUsers.length > 0 && (
                    <div className="absolute z-10 mt-1 w-full rounded-md bg-white shadow-lg border max-h-48 overflow-y-auto">
                      {filteredUsers.map((u) => (
                        <button
                          key={u.id}
                          className="w-full text-left px-3 py-2 hover:bg-gray-50 focus:bg-gray-50"
                          onClick={() => {
                            setSelectedUserId(u.id);
                            setUserSearch(u.email);
                          }}
                        >
                          <p className="font-medium">{u.name}</p>
                          <p className="text-sm text-gray-500">{u.email}</p>
                        </button>
                      ))}
                    </div>
                  )}
                </div>

                <div>
                  <Label htmlFor="role">Role</Label>
                  <Select value={selectedRole} onValueChange={setSelectedRole}>
                    <SelectTrigger id="role" data-testid="select-role">
                      <SelectValue />
                    </SelectTrigger>
                    <SelectContent>
                      <SelectItem value="org_admin">Org Admin</SelectItem>
                      <SelectItem value="trader">Trader</SelectItem>
                      <SelectItem value="analyst">Analyst</SelectItem>
                      <SelectItem value="viewer">Viewer</SelectItem>
                      <SelectItem value="compliance">Compliance</SelectItem>
                    </SelectContent>
                  </Select>
                </div>

                <Button
                  onClick={handleAddMember}
                  disabled={!selectedUserId || !selectedRole || addingMember}
                  className="w-full bg-brand-red hover:bg-red-700"
                  data-testid="button-add-member"
                >
                  {addingMember ? (
                    <div className="flex items-center gap-2">
                      <div className="animate-spin rounded-full h-4 w-4 border-b-2 border-white"></div>
                      Adding...
                    </div>
                  ) : (
                    <>
                      <Plus className="h-4 w-4 mr-2" />
                      Add Member
                    </>
                  )}
                </Button>
              </div>
            </div>
          )}
        </div>
      </div>
    </div>
  );
}