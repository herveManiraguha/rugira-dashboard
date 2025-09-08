import React, { useState, useEffect } from 'react';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Badge } from '@/components/ui/badge';
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from '@/components/ui/table';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { 
  Search, 
  Plus, 
  Edit2, 
  Archive, 
  Users as UsersIcon,
  Building2,
  MoreHorizontal
} from 'lucide-react';
import { useToast } from '@/hooks/use-toast';
import { 
  DropdownMenu, 
  DropdownMenuContent, 
  DropdownMenuItem, 
  DropdownMenuTrigger 
} from '@/components/ui/dropdown-menu';
import { AddEditOrgModal } from './AddEditOrgModal';
import { MembersDrawer } from './MembersDrawer';
import { organizationsApi, type Organization, type OrgRole } from '@/lib/api/organizations';
import { useAuth } from '@/contexts/AuthContext';

export function OrganizationsTab() {
  const [organizations, setOrganizations] = useState<Organization[]>([]);
  const [loading, setLoading] = useState(true);
  const [searchQuery, setSearchQuery] = useState('');
  const [statusFilter, setStatusFilter] = useState<'all' | 'active' | 'archived'>('all');
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [editingOrg, setEditingOrg] = useState<Organization | null>(null);
  const [selectedOrgForMembers, setSelectedOrgForMembers] = useState<Organization | null>(null);
  const [isMembersDrawerOpen, setIsMembersDrawerOpen] = useState(false);
  const { toast } = useToast();
  const { user } = useAuth();
  
  const canManageOrgs = true; // For demo purposes, allow all actions

  useEffect(() => {
    loadOrganizations();
  }, []);

  const loadOrganizations = async () => {
    setLoading(true);
    try {
      const data = await organizationsApi.listOrganizations({
        query: searchQuery,
        status: statusFilter === 'all' ? undefined : statusFilter
      });
      setOrganizations(data);
    } catch (error) {
      toast({
        title: "Failed to load organizations",
        description: "Please try again later",
        variant: "destructive"
      });
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    const timer = setTimeout(() => {
      loadOrganizations();
    }, 300);
    return () => clearTimeout(timer);
  }, [searchQuery, statusFilter]);

  const handleCreateOrg = () => {
    setEditingOrg(null);
    setIsModalOpen(true);
  };

  const handleEditOrg = (org: Organization) => {
    setEditingOrg(org);
    setIsModalOpen(true);
  };

  const handleArchiveToggle = async (org: Organization) => {
    try {
      await organizationsApi.updateOrganization(org.id, {
        status: org.status === 'active' ? 'archived' : 'active'
      });
      toast({
        title: `Organization ${org.status === 'active' ? 'archived' : 'unarchived'}`,
        description: `${org.name} has been ${org.status === 'active' ? 'archived' : 'unarchived'}.`
      });
      loadOrganizations();
    } catch (error) {
      toast({
        title: "Action failed",
        description: "Could not update organization status",
        variant: "destructive"
      });
    }
  };

  const handleShowMembers = (org: Organization) => {
    setSelectedOrgForMembers(org);
    setIsMembersDrawerOpen(true);
  };

  const filteredOrgs = organizations.filter(org => {
    const matchesSearch = org.name.toLowerCase().includes(searchQuery.toLowerCase());
    const matchesStatus = statusFilter === 'all' || org.status === statusFilter;
    return matchesSearch && matchesStatus;
  });

  if (loading && organizations.length === 0) {
    return (
      <div className="flex items-center justify-center h-64">
        <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-red-600"></div>
      </div>
    );
  }

  return (
    <div className="space-y-6">
      {/* Toolbar */}
      <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-3 sm:gap-4">
        <div className="flex items-center gap-2 flex-1 sm:max-w-md">
          <div className="relative flex-1">
            <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 h-4 w-4 text-gray-400" />
            <Input
              placeholder="Search organizations..."
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
              className="pl-10"
              data-testid="search-organizations"
            />
          </div>
          <Select value={statusFilter} onValueChange={(v) => setStatusFilter(v as any)}>
            <SelectTrigger className="w-32" data-testid="filter-status">
              <SelectValue placeholder="All" />
            </SelectTrigger>
            <SelectContent>
              <SelectItem value="all">All</SelectItem>
              <SelectItem value="active">Active</SelectItem>
              <SelectItem value="archived">Archived</SelectItem>
            </SelectContent>
          </Select>
        </div>
        {canManageOrgs && (
          <Button 
            onClick={handleCreateOrg}
            className="bg-brand-red hover:bg-red-700 w-full sm:w-auto"
            data-testid="button-add-organization"
          >
            <Plus className="h-4 w-4 mr-2" />
            <span className="hidden sm:inline">Add Organization</span>
            <span className="sm:hidden">Add</span>
          </Button>
        )}
      </div>

      {/* Organizations Table */}
      {filteredOrgs.length === 0 ? (
        <Card>
          <CardContent className="text-center py-12">
            <Building2 className="h-12 w-12 text-gray-400 mx-auto mb-4" />
            <h3 className="text-lg font-medium text-gray-900">No organizations yet</h3>
            <p className="text-gray-600 mt-2">
              Create your first organization to start assigning users.
            </p>
            {canManageOrgs && (
              <Button 
                onClick={handleCreateOrg}
                className="mt-4 bg-brand-red hover:bg-red-700"
              >
                <Plus className="h-4 w-4 mr-2" />
                Add Organization
              </Button>
            )}
          </CardContent>
        </Card>
      ) : (
        <Card>
          {/* Mobile Card View */}
          <div className="block sm:hidden space-y-3 p-4">
            {filteredOrgs.map((org) => (
              <Card key={org.id} className="border">
                <CardContent className="p-3 space-y-2">
                  <div className="flex items-start justify-between">
                    <div>
                      <div className="font-medium text-sm">{org.name}</div>
                      <div className="text-xs text-gray-500 mt-1">
                        {org.memberCount || 0} members • Created {new Date(org.createdAt).toLocaleDateString()}
                      </div>
                    </div>
                    <Badge 
                      className={org.status === 'active' ? 'bg-green-100 text-green-800' : 'bg-gray-100 text-gray-800'}
                    >
                      {org.status}
                    </Badge>
                  </div>
                  <div className="flex gap-2 pt-2">
                    <Button 
                      size="sm" 
                      variant="outline" 
                      className="flex-1 text-xs"
                      onClick={() => handleShowMembers(org)}
                    >
                      <UsersIcon className="h-3 w-3 mr-1" />
                      Members
                    </Button>
                    {canManageOrgs && (
                      <DropdownMenu>
                        <DropdownMenuTrigger asChild>
                          <Button size="sm" variant="outline">
                            <MoreHorizontal className="h-3 w-3" />
                          </Button>
                        </DropdownMenuTrigger>
                        <DropdownMenuContent align="end">
                          <DropdownMenuItem onClick={() => handleEditOrg(org)}>
                            <Edit2 className="h-3 w-3 mr-2" />
                            Edit
                          </DropdownMenuItem>
                          <DropdownMenuItem onClick={() => handleArchiveToggle(org)}>
                            <Archive className="h-3 w-3 mr-2" />
                            {org.status === 'active' ? 'Archive' : 'Unarchive'}
                          </DropdownMenuItem>
                        </DropdownMenuContent>
                      </DropdownMenu>
                    )}
                  </div>
                </CardContent>
              </Card>
            ))}
          </div>
          {/* Desktop Table View */}
          <Table className="hidden sm:table">
            <TableHeader>
              <TableRow>
                <TableHead>Name</TableHead>
                <TableHead>Status</TableHead>
                <TableHead>Members</TableHead>
                <TableHead>Created</TableHead>
                <TableHead>Updated</TableHead>
                <TableHead className="w-12"></TableHead>
              </TableRow>
            </TableHeader>
            <TableBody>
              {filteredOrgs.map((org) => (
                <TableRow key={org.id}>
                  <TableCell className="font-medium">{org.name}</TableCell>
                  <TableCell>
                    <Badge 
                      className={org.status === 'active' ? 'bg-green-100 text-green-800' : 'bg-gray-100 text-gray-800'}
                    >
                      {org.status}
                    </Badge>
                  </TableCell>
                  <TableCell>
                    <Button
                      variant="ghost"
                      size="sm"
                      onClick={() => handleShowMembers(org)}
                      className="text-blue-600 hover:text-blue-800"
                      data-testid={`button-members-${org.id}`}
                    >
                      <UsersIcon className="h-4 w-4 mr-1" />
                      {org.memberCount || 0}
                    </Button>
                  </TableCell>
                  <TableCell className="text-sm text-gray-600">
                    {new Date(org.createdAt).toLocaleDateString()}
                  </TableCell>
                  <TableCell className="text-sm text-gray-600">
                    {new Date(org.updatedAt).toLocaleDateString()}
                  </TableCell>
                  <TableCell>
                    {canManageOrgs && (
                      <DropdownMenu>
                        <DropdownMenuTrigger asChild>
                          <Button variant="ghost" size="sm" data-testid={`menu-org-${org.id}`}>
                            <MoreHorizontal className="h-4 w-4" />
                          </Button>
                        </DropdownMenuTrigger>
                        <DropdownMenuContent align="end">
                          <DropdownMenuItem onClick={() => handleEditOrg(org)}>
                            <Edit2 className="h-4 w-4 mr-2" />
                            Edit
                          </DropdownMenuItem>
                          <DropdownMenuItem onClick={() => handleArchiveToggle(org)}>
                            <Archive className="h-4 w-4 mr-2" />
                            {org.status === 'active' ? 'Archive' : 'Unarchive'}
                          </DropdownMenuItem>
                          <DropdownMenuItem onClick={() => handleShowMembers(org)}>
                            <UsersIcon className="h-4 w-4 mr-2" />
                            Members
                          </DropdownMenuItem>
                        </DropdownMenuContent>
                      </DropdownMenu>
                    )}
                  </TableCell>
                </TableRow>
              ))}
            </TableBody>
          </Table>
        </Card>
      )}

      {/* Add/Edit Organization Modal */}
      <AddEditOrgModal
        open={isModalOpen}
        onClose={() => {
          setIsModalOpen(false);
          setEditingOrg(null);
        }}
        organization={editingOrg}
        onSuccess={() => {
          setIsModalOpen(false);
          setEditingOrg(null);
          loadOrganizations();
        }}
      />

      {/* Members Drawer */}
      <MembersDrawer
        open={isMembersDrawerOpen}
        onClose={() => {
          setIsMembersDrawerOpen(false);
          setSelectedOrgForMembers(null);
        }}
        organization={selectedOrgForMembers}
        onUpdate={() => loadOrganizations()}
      />
    </div>
  );
}