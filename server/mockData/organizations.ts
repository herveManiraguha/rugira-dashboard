// Generate UUID v4
function generateUUID(): string {
  return 'xxxxxxxx-xxxx-4xxx-yxxx-xxxxxxxxxxxx'.replace(/[xy]/g, (c) => {
    const r = Math.random() * 16 | 0;
    const v = c === 'x' ? r : (r & 0x3 | 0x8);
    return v.toString(16);
  });
}

interface Organization {
  id: string;
  org_id: string;
  name: string;
  status: 'active' | 'archived';
  memberCount: number;
  created_at: string;
  updated_at: string;
  deleted_at: string | null;
  createdAt?: string; // Keep for backward compatibility
  updatedAt?: string; // Keep for backward compatibility
}

export const mockOrganizations: Organization[] = [
  {
    id: 'org-1', // keeping old id for backward compatibility
    org_id: '123e4567-e89b-12d3-a456-426614174000',
    name: 'Bahnhofstrasse Family Office',
    status: 'active' as const,
    memberCount: 5,
    created_at: '2024-01-15T10:00:00Z',
    updated_at: '2024-12-01T14:30:00Z',
    deleted_at: null,
    createdAt: '2024-01-15T10:00:00Z', // Keep for UI compatibility
    updatedAt: '2024-12-01T14:30:00Z'  // Keep for UI compatibility
  },
  {
    id: 'org-2',
    org_id: '223e4567-e89b-12d3-a456-426614174001',
    name: 'TradePro Singapore',
    status: 'active' as const,
    memberCount: 3,
    created_at: '2024-02-20T09:00:00Z',
    updated_at: '2024-11-28T16:45:00Z',
    deleted_at: null,
    createdAt: '2024-02-20T09:00:00Z',
    updatedAt: '2024-11-28T16:45:00Z'
  },
  {
    id: 'org-3',
    org_id: '323e4567-e89b-12d3-a456-426614174002',
    name: 'CryptoFund Italia',
    status: 'active' as const,
    memberCount: 2,
    created_at: '2024-03-10T11:30:00Z',
    updated_at: '2024-11-25T10:15:00Z',
    deleted_at: null,
    createdAt: '2024-03-10T11:30:00Z',
    updatedAt: '2024-11-25T10:15:00Z'
  },
  {
    id: 'org-4',
    org_id: '423e4567-e89b-12d3-a456-426614174003',
    name: 'Nordic Trading AB',
    status: 'active' as const,
    memberCount: 4,
    created_at: '2024-04-05T13:00:00Z',
    updated_at: '2024-11-20T09:30:00Z',
    deleted_at: null,
    createdAt: '2024-04-05T13:00:00Z',
    updatedAt: '2024-11-20T09:30:00Z'
  },
  {
    id: 'org-5',
    org_id: '523e4567-e89b-12d3-a456-426614174004',
    name: 'Gulf Trading LLC',
    status: 'active' as const,
    memberCount: 6,
    created_at: '2024-05-12T08:45:00Z',
    updated_at: '2024-11-15T11:00:00Z',
    deleted_at: null,
    createdAt: '2024-05-12T08:45:00Z',
    updatedAt: '2024-11-15T11:00:00Z'
  },
  {
    id: 'org-6',
    org_id: '623e4567-e89b-12d3-a456-426614174005',
    name: 'Legacy Partners (Archived)',
    status: 'archived' as const,
    memberCount: 0,
    created_at: '2023-08-10T10:00:00Z',
    updated_at: '2024-06-01T12:00:00Z',
    deleted_at: '2024-06-01T12:00:00Z', // soft deleted
    createdAt: '2023-08-10T10:00:00Z',
    updatedAt: '2024-06-01T12:00:00Z'
  }
];

// Portfolios/Desks under organizations
export const mockPortfolios = [
  // Alpha Capital AG portfolios
  {
    portfolio_id: '11111111-aaaa-4aaa-aaaa-111111111111',
    org_id: '123e4567-e89b-12d3-a456-426614174000',
    name: 'Equity Desk',
    risk_profile: 'moderate',
    default_mode: 'paper',
    live_enabled: true,
    created_by: 'hans.mueller@rugira.ch',
    created_at: '2024-01-20T10:00:00Z',
    updated_at: '2024-12-01T14:30:00Z',
    deleted_at: null
  },
  {
    portfolio_id: '11111111-bbbb-4bbb-bbbb-111111111111',
    org_id: '123e4567-e89b-12d3-a456-426614174000',
    name: 'Crypto Desk',
    risk_profile: 'aggressive',
    default_mode: 'paper',
    live_enabled: false,
    created_by: 'hans.mueller@rugira.ch',
    created_at: '2024-02-15T11:00:00Z',
    updated_at: '2024-11-28T16:45:00Z',
    deleted_at: null
  },
  // TradePro Singapore portfolios
  {
    portfolio_id: '22222222-aaaa-4aaa-aaaa-222222222222',
    org_id: '223e4567-e89b-12d3-a456-426614174001',
    name: 'Asia Pacific Desk',
    risk_profile: 'conservative',
    default_mode: 'demo',
    live_enabled: true,
    created_by: 'emma.chen@tradepro.com',
    created_at: '2024-03-01T09:00:00Z',
    updated_at: '2024-11-25T10:15:00Z',
    deleted_at: null
  },
  // CryptoFund Italia portfolio
  {
    portfolio_id: '33333333-aaaa-4aaa-aaaa-333333333333',
    org_id: '323e4567-e89b-12d3-a456-426614174002',
    name: 'DeFi Trading Desk',
    risk_profile: 'aggressive',
    default_mode: 'paper',
    live_enabled: true,
    created_by: 'marco.rossi@cryptofund.it',
    created_at: '2024-03-15T11:30:00Z',
    updated_at: '2024-11-20T09:30:00Z',
    deleted_at: null
  },
  // Nordic Trading AB portfolios
  {
    portfolio_id: '44444444-aaaa-4aaa-aaaa-444444444444',
    org_id: '423e4567-e89b-12d3-a456-426614174003',
    name: 'Nordic Equities',
    risk_profile: 'moderate',
    default_mode: 'paper',
    live_enabled: false,
    created_by: 'ingrid.larsson@nordicfunds.se',
    created_at: '2024-04-10T13:00:00Z',
    updated_at: '2024-11-15T11:00:00Z',
    deleted_at: null
  },
  // Gulf Trading LLC portfolios
  {
    portfolio_id: '55555555-aaaa-4aaa-aaaa-555555555555',
    org_id: '523e4567-e89b-12d3-a456-426614174004',
    name: 'Middle East Desk',
    risk_profile: 'moderate',
    default_mode: 'paper',
    live_enabled: true,
    created_by: 'fatima.rashid@gulftrading.ae',
    created_at: '2024-05-15T08:45:00Z',
    updated_at: '2024-11-10T12:00:00Z',
    deleted_at: null
  },
  {
    portfolio_id: '55555555-bbbb-4bbb-bbbb-555555555555',
    org_id: '523e4567-e89b-12d3-a456-426614174004',
    name: 'Commodities Desk',
    risk_profile: 'conservative',
    default_mode: 'demo',
    live_enabled: true,
    created_by: 'fatima.rashid@gulftrading.ae',
    created_at: '2024-06-01T09:00:00Z',
    updated_at: '2024-11-05T14:30:00Z',
    deleted_at: null
  }
];

// User organization roles (org-level)
export const mockUserOrgRoles = [
  // Alpha Capital AG user roles
  { id: 'uor-001', user_id: 'user-001', org_id: '123e4567-e89b-12d3-a456-426614174000', role: 'admin', userEmail: 'hans.mueller@rugira.ch', userName: 'Hans Mueller', created_at: '2024-01-15T10:00:00Z' },
  { id: 'uor-002', user_id: 'user-002', org_id: '123e4567-e89b-12d3-a456-426614174000', role: 'trader', userEmail: 'emma.chen@tradepro.com', userName: 'Emma Chen', created_at: '2024-01-20T11:00:00Z' },
  { id: 'uor-003', user_id: 'user-004', org_id: '123e4567-e89b-12d3-a456-426614174000', role: 'analyst', userEmail: 'sarah.j@quanthedge.com', userName: 'Sarah Johnson', created_at: '2024-02-01T09:30:00Z' },
  { id: 'uor-004', user_id: 'user-008', org_id: '123e4567-e89b-12d3-a456-426614174000', role: 'viewer', userEmail: 'pierre.dubois@tradeparis.fr', userName: 'Pierre Dubois', created_at: '2024-02-15T14:00:00Z' },
  { id: 'uor-005', user_id: 'user-020', org_id: '123e4567-e89b-12d3-a456-426614174000', role: 'compliance', userEmail: 'klaus.weber@germanfunds.de', userName: 'Klaus Weber', created_at: '2024-03-01T10:30:00Z' },
  
  // TradePro Singapore user roles
  { id: 'uor-006', user_id: 'user-002', org_id: '223e4567-e89b-12d3-a456-426614174001', role: 'admin', userEmail: 'emma.chen@tradepro.com', userName: 'Emma Chen', created_at: '2024-02-20T09:00:00Z' },
  { id: 'uor-007', user_id: 'user-007', org_id: '223e4567-e89b-12d3-a456-426614174001', role: 'trader', userEmail: 'h.tanaka@cryptoasia.jp', userName: 'Hiroshi Tanaka', created_at: '2024-03-01T10:00:00Z' },
  { id: 'uor-008', user_id: 'user-014', org_id: '223e4567-e89b-12d3-a456-426614174001', role: 'trader', userEmail: 'david.kim@koreafintech.kr', userName: 'David Kim', created_at: '2024-03-10T11:30:00Z' },
  
  // CryptoFund Italia user roles
  { id: 'uor-009', user_id: 'user-003', org_id: '323e4567-e89b-12d3-a456-426614174002', role: 'admin', userEmail: 'marco.rossi@cryptofund.it', userName: 'Marco Rossi', created_at: '2024-03-10T11:30:00Z' },
  { id: 'uor-010', user_id: 'user-011', org_id: '323e4567-e89b-12d3-a456-426614174002', role: 'analyst', userEmail: 'ingrid.larsson@nordicfunds.se', userName: 'Ingrid Larsson', created_at: '2024-04-01T09:00:00Z' },
  
  // Nordic Trading AB user roles
  { id: 'uor-011', user_id: 'user-011', org_id: '423e4567-e89b-12d3-a456-426614174003', role: 'admin', userEmail: 'ingrid.larsson@nordicfunds.se', userName: 'Ingrid Larsson', created_at: '2024-04-05T13:00:00Z' },
  { id: 'uor-012', user_id: 'user-001', org_id: '423e4567-e89b-12d3-a456-426614174003', role: 'compliance', userEmail: 'hans.mueller@rugira.ch', userName: 'Hans Mueller', created_at: '2024-04-10T14:00:00Z' },
  { id: 'uor-013', user_id: 'user-004', org_id: '423e4567-e89b-12d3-a456-426614174003', role: 'trader', userEmail: 'sarah.j@quanthedge.com', userName: 'Sarah Johnson', created_at: '2024-04-15T10:30:00Z' },
  { id: 'uor-014', user_id: 'user-008', org_id: '423e4567-e89b-12d3-a456-426614174003', role: 'analyst', userEmail: 'pierre.dubois@tradeparis.fr', userName: 'Pierre Dubois', created_at: '2024-04-20T11:00:00Z' },
  
  // Gulf Trading LLC user roles
  { id: 'uor-015', user_id: 'user-013', org_id: '523e4567-e89b-12d3-a456-426614174004', role: 'admin', userEmail: 'fatima.rashid@gulftrading.ae', userName: 'Fatima Al-Rashid', created_at: '2024-05-12T08:45:00Z' },
  { id: 'uor-016', user_id: 'user-017', org_id: '523e4567-e89b-12d3-a456-426614174004', role: 'trader', userEmail: 'raj.patel@mumbaitrading.in', userName: 'Raj Patel', created_at: '2024-05-20T09:30:00Z' },
  { id: 'uor-017', user_id: 'user-020', org_id: '523e4567-e89b-12d3-a456-426614174004', role: 'trader', userEmail: 'klaus.weber@germanfunds.de', userName: 'Klaus Weber', created_at: '2024-05-25T10:00:00Z' },
  { id: 'uor-018', user_id: 'user-014', org_id: '523e4567-e89b-12d3-a456-426614174004', role: 'analyst', userEmail: 'david.kim@koreafintech.kr', userName: 'David Kim', created_at: '2024-06-01T11:00:00Z' },
  { id: 'uor-019', user_id: 'user-001', org_id: '523e4567-e89b-12d3-a456-426614174004', role: 'viewer', userEmail: 'hans.mueller@rugira.ch', userName: 'Hans Mueller', created_at: '2024-06-10T09:00:00Z' },
  { id: 'uor-020', user_id: 'user-017', org_id: '523e4567-e89b-12d3-a456-426614174004', role: 'compliance', userEmail: 'raj.patel@mumbaitrading.in', userName: 'Raj Patel', created_at: '2024-06-15T10:30:00Z' }
];

// User portfolio roles (portfolio-level overrides)
export const mockUserPortfolioRoles = [
  // Equity Desk (Alpha Capital)
  { id: 'upr-001', user_id: 'user-002', portfolio_id: '11111111-aaaa-4aaa-aaaa-111111111111', role: 'trader', created_at: '2024-01-25T10:00:00Z' },
  { id: 'upr-002', user_id: 'user-004', portfolio_id: '11111111-aaaa-4aaa-aaaa-111111111111', role: 'analyst', created_at: '2024-02-05T11:00:00Z' },
  
  // Crypto Desk (Alpha Capital)
  { id: 'upr-003', user_id: 'user-002', portfolio_id: '11111111-bbbb-4bbb-bbbb-111111111111', role: 'admin', created_at: '2024-02-20T12:00:00Z' },
  
  // Asia Pacific Desk (TradePro)
  { id: 'upr-004', user_id: 'user-007', portfolio_id: '22222222-aaaa-4aaa-aaaa-222222222222', role: 'trader', created_at: '2024-03-05T09:00:00Z' },
  { id: 'upr-005', user_id: 'user-014', portfolio_id: '22222222-aaaa-4aaa-aaaa-222222222222', role: 'trader', created_at: '2024-03-15T10:00:00Z' },
  
  // Middle East Desk (Gulf Trading)
  { id: 'upr-006', user_id: 'user-017', portfolio_id: '55555555-aaaa-4aaa-aaaa-555555555555', role: 'trader', created_at: '2024-05-25T09:00:00Z' },
  { id: 'upr-007', user_id: 'user-020', portfolio_id: '55555555-aaaa-4aaa-aaaa-555555555555', role: 'trader', created_at: '2024-06-01T10:00:00Z' }
];

// Policies (org-level live transition policies)
export const mockPolicies = [
  {
    policy_id: 'pol-001',
    org_id: '123e4567-e89b-12d3-a456-426614174000',
    require_mfa_for_live: true,
    require_approval_for_live: true,
    pretrade_profile_id: 'ptp-001',
    notes: 'Standard risk controls for Alpha Capital',
    created_at: '2024-01-15T10:00:00Z',
    updated_at: '2024-11-01T12:00:00Z'
  },
  {
    policy_id: 'pol-002',
    org_id: '223e4567-e89b-12d3-a456-426614174001',
    require_mfa_for_live: true,
    require_approval_for_live: false,
    pretrade_profile_id: 'ptp-002',
    notes: 'Streamlined approval for experienced traders',
    created_at: '2024-02-20T09:00:00Z',
    updated_at: '2024-10-15T14:00:00Z'
  },
  {
    policy_id: 'pol-003',
    org_id: '523e4567-e89b-12d3-a456-426614174004',
    require_mfa_for_live: true,
    require_approval_for_live: true,
    pretrade_profile_id: 'ptp-003',
    notes: 'Enhanced controls for Gulf Trading operations',
    created_at: '2024-05-12T08:45:00Z',
    updated_at: '2024-11-20T10:00:00Z'
  }
];

// Export the old mockOrgRoles for backward compatibility
export const mockOrgRoles = mockUserOrgRoles.map(role => ({
  id: role.id,
  orgId: mockOrganizations.find(org => org.org_id === role.org_id)?.id || '',
  userId: role.user_id.replace('user-00', '').replace('user-0', ''),
  userEmail: role.userEmail,
  userName: role.userName,
  role: role.role === 'admin' ? 'org_admin' : role.role,
  createdAt: role.created_at
}));