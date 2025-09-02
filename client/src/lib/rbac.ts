// Role-Based Access Control (RBAC) helper
import { ExtendedUser } from '@/contexts/AuthContext';

export type Permission = 
  | 'view_bots'
  | 'edit_bots'
  | 'start_stop_bots'
  | 'view_strategies'
  | 'edit_strategies'
  | 'view_venues'
  | 'connect_venues'
  | 'view_reports'
  | 'export_reports'
  | 'view_compliance'
  | 'export_compliance'
  | 'approve_changes'
  | 'view_monitoring'
  | 'view_admin'
  | 'edit_settings';

// Permission matrix by role
const rolePermissions: Record<string, Permission[]> = {
  admin: [
    'view_bots', 'edit_bots', 'start_stop_bots',
    'view_strategies', 'edit_strategies',
    'view_venues', 'connect_venues',
    'view_reports', 'export_reports',
    'view_compliance', 'export_compliance',
    'approve_changes',
    'view_monitoring',
    'view_admin',
    'edit_settings'
  ],
  compliance: [
    'view_bots',
    'view_strategies',
    'view_venues',
    'view_reports', 'export_reports',
    'view_compliance', 'export_compliance',
    'approve_changes',
    'view_monitoring'
  ],
  trader: [
    'view_bots', 'edit_bots', 'start_stop_bots',
    'view_strategies', 'edit_strategies',
    'view_venues',
    'view_reports',
    'view_compliance',
    'view_monitoring'
  ],
  analyst: [
    'view_bots',
    'view_strategies',
    'view_venues',
    'view_reports',
    'view_compliance',
    'view_monitoring'
  ],
  viewer: [
    'view_bots',
    'view_strategies',
    'view_venues',
    'view_reports',
    'view_monitoring'
  ],
  auditor: [
    'view_bots',
    'view_strategies',
    'view_venues',
    'view_reports',
    'view_compliance',
    'export_compliance',
    'view_monitoring'
  ]
};

export class RBACHelper {
  private user: ExtendedUser | null;
  private currentTenant: string | null;

  constructor(user: ExtendedUser | null, currentTenant: string | null) {
    this.user = user;
    this.currentTenant = currentTenant;
  }

  private getCurrentRole(): string | null {
    if (!this.user || !this.currentTenant) return null;
    const roles = this.user.tenant_roles?.[this.currentTenant];
    if (!roles || roles.length === 0) return null;
    // Return highest priority role
    const priority = ['admin', 'compliance', 'trader', 'analyst', 'auditor', 'viewer'];
    for (const role of priority) {
      if (roles.includes(role)) return role;
    }
    return roles[0];
  }

  can(permission: Permission): boolean {
    const role = this.getCurrentRole();
    if (!role) return false;
    const permissions = rolePermissions[role] || [];
    return permissions.includes(permission);
  }

  canView(resource: string): boolean {
    return this.can(`view_${resource}` as Permission);
  }

  canEdit(resource: string): boolean {
    return this.can(`edit_${resource}` as Permission);
  }

  canExport(resource: string): boolean {
    return this.can(`export_${resource}` as Permission);
  }

  getDisabledReason(permission: Permission): string {
    const role = this.getCurrentRole();
    if (!role) return 'Authentication required';

    if (permission.includes('export')) {
      if (role === 'viewer') return 'Viewers cannot export data';
      if (role === 'analyst') return 'Requires Compliance approval';
      if (role === 'trader') return 'Requires Compliance approval';
    }

    if (permission.includes('approve')) {
      return 'Requires Admin or Compliance role';
    }

    if (permission === 'start_stop_bots') {
      if (role === 'viewer' || role === 'analyst') {
        return 'Requires Trader role or higher';
      }
    }

    if (permission === 'connect_venues') {
      if (role !== 'admin') {
        return 'Requires Admin role';
      }
    }

    return 'Insufficient permissions';
  }
}

export function useRBAC(user: ExtendedUser | null, currentTenant: string | null): RBACHelper {
  return new RBACHelper(user, currentTenant);
}