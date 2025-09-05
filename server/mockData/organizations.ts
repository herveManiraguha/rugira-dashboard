export const mockOrganizations = [
  {
    id: 'org-1',
    name: 'Alpha Capital AG',
    status: 'active',
    memberCount: 5,
    createdAt: '2024-01-15T10:00:00Z',
    updatedAt: '2024-12-01T14:30:00Z'
  },
  {
    id: 'org-2',
    name: 'TradePro Singapore',
    status: 'active',
    memberCount: 3,
    createdAt: '2024-02-20T09:00:00Z',
    updatedAt: '2024-11-28T16:45:00Z'
  },
  {
    id: 'org-3',
    name: 'CryptoFund Italia',
    status: 'active',
    memberCount: 2,
    createdAt: '2024-03-10T11:30:00Z',
    updatedAt: '2024-11-25T10:15:00Z'
  },
  {
    id: 'org-4',
    name: 'Nordic Trading AB',
    status: 'active',
    memberCount: 4,
    createdAt: '2024-04-05T13:00:00Z',
    updatedAt: '2024-11-20T09:30:00Z'
  },
  {
    id: 'org-5',
    name: 'Gulf Trading LLC',
    status: 'active',
    memberCount: 6,
    createdAt: '2024-05-12T08:45:00Z',
    updatedAt: '2024-11-15T11:00:00Z'
  },
  {
    id: 'org-6',
    name: 'Legacy Partners (Archived)',
    status: 'archived',
    memberCount: 0,
    createdAt: '2023-08-10T10:00:00Z',
    updatedAt: '2024-06-01T12:00:00Z'
  }
];

export const mockOrgRoles = [
  // Alpha Capital AG
  { id: 'role-1', orgId: 'org-1', userId: '1', userEmail: 'hans.mueller@rugira.ch', userName: 'Hans Mueller', role: 'org_admin', createdAt: '2024-01-15T10:00:00Z' },
  { id: 'role-2', orgId: 'org-1', userId: '2', userEmail: 'emma.chen@tradepro.com', userName: 'Emma Chen', role: 'trader', createdAt: '2024-01-20T11:00:00Z' },
  { id: 'role-3', orgId: 'org-1', userId: '4', userEmail: 'sarah.j@quanthedge.com', userName: 'Sarah Johnson', role: 'analyst', createdAt: '2024-02-01T09:30:00Z' },
  { id: 'role-4', orgId: 'org-1', userId: '8', userEmail: 'pierre.dubois@tradeparis.fr', userName: 'Pierre Dubois', role: 'viewer', createdAt: '2024-02-15T14:00:00Z' },
  { id: 'role-5', orgId: 'org-1', userId: '20', userEmail: 'klaus.weber@germanfunds.de', userName: 'Klaus Weber', role: 'compliance', createdAt: '2024-03-01T10:30:00Z' },
  
  // TradePro Singapore
  { id: 'role-6', orgId: 'org-2', userId: '2', userEmail: 'emma.chen@tradepro.com', userName: 'Emma Chen', role: 'org_admin', createdAt: '2024-02-20T09:00:00Z' },
  { id: 'role-7', orgId: 'org-2', userId: '7', userEmail: 'h.tanaka@cryptoasia.jp', userName: 'Hiroshi Tanaka', role: 'trader', createdAt: '2024-03-01T10:00:00Z' },
  { id: 'role-8', orgId: 'org-2', userId: '14', userEmail: 'david.kim@koreafintech.kr', userName: 'David Kim', role: 'trader', createdAt: '2024-03-10T11:30:00Z' },
  
  // CryptoFund Italia
  { id: 'role-9', orgId: 'org-3', userId: '3', userEmail: 'marco.rossi@cryptofund.it', userName: 'Marco Rossi', role: 'org_admin', createdAt: '2024-03-10T11:30:00Z' },
  { id: 'role-10', orgId: 'org-3', userId: '11', userEmail: 'ingrid.larsson@nordicfunds.se', userName: 'Ingrid Larsson', role: 'analyst', createdAt: '2024-04-01T09:00:00Z' },
  
  // Nordic Trading AB
  { id: 'role-11', orgId: 'org-4', userId: '11', userEmail: 'ingrid.larsson@nordicfunds.se', userName: 'Ingrid Larsson', role: 'org_admin', createdAt: '2024-04-05T13:00:00Z' },
  { id: 'role-12', orgId: 'org-4', userId: '1', userEmail: 'hans.mueller@rugira.ch', userName: 'Hans Mueller', role: 'compliance', createdAt: '2024-04-10T14:00:00Z' },
  { id: 'role-13', orgId: 'org-4', userId: '4', userEmail: 'sarah.j@quanthedge.com', userName: 'Sarah Johnson', role: 'trader', createdAt: '2024-04-15T10:30:00Z' },
  { id: 'role-14', orgId: 'org-4', userId: '8', userEmail: 'pierre.dubois@tradeparis.fr', userName: 'Pierre Dubois', role: 'analyst', createdAt: '2024-04-20T11:00:00Z' },
  
  // Gulf Trading LLC
  { id: 'role-15', orgId: 'org-5', userId: '13', userEmail: 'fatima.rashid@gulftrading.ae', userName: 'Fatima Al-Rashid', role: 'org_admin', createdAt: '2024-05-12T08:45:00Z' },
  { id: 'role-16', orgId: 'org-5', userId: '17', userEmail: 'raj.patel@mumbaitrading.in', userName: 'Raj Patel', role: 'trader', createdAt: '2024-05-20T09:30:00Z' },
  { id: 'role-17', orgId: 'org-5', userId: '20', userEmail: 'klaus.weber@germanfunds.de', userName: 'Klaus Weber', role: 'trader', createdAt: '2024-05-25T10:00:00Z' },
  { id: 'role-18', orgId: 'org-5', userId: '14', userEmail: 'david.kim@koreafintech.kr', userName: 'David Kim', role: 'analyst', createdAt: '2024-06-01T11:00:00Z' },
  { id: 'role-19', orgId: 'org-5', userId: '1', userEmail: 'hans.mueller@rugira.ch', userName: 'Hans Mueller', role: 'viewer', createdAt: '2024-06-10T09:00:00Z' },
  { id: 'role-20', orgId: 'org-5', userId: '17', userEmail: 'raj.patel@mumbaitrading.in', userName: 'Raj Patel', role: 'compliance', createdAt: '2024-06-15T10:30:00Z' }
];