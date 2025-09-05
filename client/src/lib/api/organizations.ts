import axios from 'axios';

export interface Organization {
  id: string;
  name: string;
  status: 'active' | 'archived';
  memberCount: number;
  createdAt: string;
  updatedAt: string;
}

export interface OrgRole {
  id: string;
  orgId: string;
  userId: string;
  userEmail: string;
  userName?: string;
  role: 'org_admin' | 'trader' | 'analyst' | 'viewer' | 'compliance';
  createdAt: string;
}

export interface CreateOrgRequest {
  name: string;
}

export interface UpdateOrgRequest {
  name?: string;
  status?: 'active' | 'archived';
}

export interface AddOrgRoleRequest {
  user_id: string;
  role: 'org_admin' | 'trader' | 'analyst' | 'viewer' | 'compliance';
}

export interface ListOrgsParams {
  query?: string;
  status?: 'active' | 'archived';
  page?: number;
  limit?: number;
}

export const organizationsApi = {
  async listOrganizations(params?: ListOrgsParams): Promise<Organization[]> {
    const response = await axios.get('/api/admin/orgs', { params });
    return response.data;
  },

  async createOrganization(data: CreateOrgRequest): Promise<Organization> {
    const response = await axios.post('/api/admin/orgs', data);
    return response.data;
  },

  async updateOrganization(id: string, data: UpdateOrgRequest): Promise<Organization> {
    const response = await axios.patch(`/api/admin/orgs/${id}`, data);
    return response.data;
  },

  async archiveOrganization(id: string): Promise<void> {
    await axios.post(`/api/admin/orgs/${id}/archive`);
  },

  async listOrgRoles(orgId: string): Promise<OrgRole[]> {
    const response = await axios.get(`/api/admin/orgs/${orgId}/roles`);
    return response.data;
  },

  async addOrgRole(orgId: string, data: AddOrgRoleRequest): Promise<OrgRole> {
    const response = await axios.post(`/api/admin/orgs/${orgId}/roles`, data);
    return response.data;
  },

  async removeOrgRole(orgId: string, bindingId: string): Promise<void> {
    await axios.delete(`/api/admin/orgs/${orgId}/roles/${bindingId}`);
  },
  
  async getUserOrganizations(userId: string): Promise<Organization[]> {
    const response = await axios.get(`/api/admin/users/${userId}/orgs`);
    return response.data;
  }
};