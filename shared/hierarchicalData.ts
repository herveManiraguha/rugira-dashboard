// Hierarchical data structure for Organizations -> Tenants -> Portfolios -> Modes

export interface Mode {
  id: string;
  name: 'Demo' | 'Paper' | 'Live';
  description: string;
  enabled: boolean;
}

export interface Portfolio {
  id: string;
  name: string;
  risk_profile: 'conservative' | 'moderate' | 'aggressive';
  modes: Mode[];
  created_at: string;
  updated_at: string;
}

export interface Tenant {
  id: string;
  name: string;
  type: 'Production' | 'Test' | 'Active';
  portfolios: Portfolio[];
  created_at: string;
  updated_at: string;
}

export interface Organization {
  id: string;
  name: string;
  status: 'active' | 'archived';
  tenants: Tenant[];
  memberCount: number;
  created_at: string;
  updated_at: string;
}

// Mode configurations
const demoMode: Mode = {
  id: 'mode-demo',
  name: 'Demo',
  description: 'Simulated data',
  enabled: true
};

const paperMode: Mode = {
  id: 'mode-paper',
  name: 'Paper',
  description: 'Real connections, virtual money',
  enabled: true
};

const liveMode: Mode = {
  id: 'mode-live',
  name: 'Live',
  description: 'Real trading',
  enabled: true
};

// Complete hierarchical data structure
export const hierarchicalOrganizations: Organization[] = [
  {
    id: 'org-rugira',
    name: 'Rugira AG',
    status: 'active',
    memberCount: 12,
    created_at: '2024-01-01T10:00:00Z',
    updated_at: '2024-12-29T14:30:00Z',
    tenants: [
      {
        id: 'tenant-rugira-prod',
        name: 'Production',
        type: 'Production',
        created_at: '2024-01-15T10:00:00Z',
        updated_at: '2024-12-29T14:30:00Z',
        portfolios: [
          {
            id: 'portfolio-equity-desk',
            name: 'Equity Desk',
            risk_profile: 'moderate',
            created_at: '2024-01-20T10:00:00Z',
            updated_at: '2024-12-29T14:30:00Z',
            modes: [demoMode, paperMode, liveMode]
          },
          {
            id: 'portfolio-crypto-desk',
            name: 'Crypto Desk',
            risk_profile: 'aggressive',
            created_at: '2024-02-15T11:00:00Z',
            updated_at: '2024-12-29T14:30:00Z',
            modes: [demoMode, paperMode, { ...liveMode, enabled: false }]
          }
        ]
      },
      {
        id: 'tenant-rugira-test',
        name: 'Test',
        type: 'Test',
        created_at: '2024-01-15T10:00:00Z',
        updated_at: '2024-12-29T14:30:00Z',
        portfolios: [
          {
            id: 'portfolio-test-equity',
            name: 'Test Equity Desk',
            risk_profile: 'conservative',
            created_at: '2024-03-01T09:00:00Z',
            updated_at: '2024-12-29T14:30:00Z',
            modes: [demoMode, paperMode]
          }
        ]
      }
    ]
  },
  {
    id: 'org-alpha',
    name: 'Alpha Capital AG',
    status: 'active',
    memberCount: 8,
    created_at: '2024-01-15T10:00:00Z',
    updated_at: '2024-12-01T14:30:00Z',
    tenants: [
      {
        id: 'tenant-alpha-prod',
        name: 'Production',
        type: 'Production',
        created_at: '2024-01-20T10:00:00Z',
        updated_at: '2024-12-01T14:30:00Z',
        portfolios: [
          {
            id: 'portfolio-alpha-main',
            name: 'Main Trading Desk',
            risk_profile: 'moderate',
            created_at: '2024-01-25T10:00:00Z',
            updated_at: '2024-12-01T14:30:00Z',
            modes: [demoMode, paperMode, liveMode]
          },
          {
            id: 'portfolio-alpha-fx',
            name: 'FX Desk',
            risk_profile: 'conservative',
            created_at: '2024-02-10T11:00:00Z',
            updated_at: '2024-12-01T14:30:00Z',
            modes: [demoMode, paperMode, liveMode]
          }
        ]
      },
      {
        id: 'tenant-alpha-test',
        name: 'Test',
        type: 'Test',
        created_at: '2024-01-20T10:00:00Z',
        updated_at: '2024-12-01T14:30:00Z',
        portfolios: [
          {
            id: 'portfolio-alpha-test-main',
            name: 'Test Trading Desk',
            risk_profile: 'aggressive',
            created_at: '2024-03-15T10:00:00Z',
            updated_at: '2024-12-01T14:30:00Z',
            modes: [demoMode, paperMode]
          }
        ]
      },
      {
        id: 'tenant-alpha-client',
        name: 'Client Alpha',
        type: 'Active',
        created_at: '2024-02-01T10:00:00Z',
        updated_at: '2024-12-01T14:30:00Z',
        portfolios: [
          {
            id: 'portfolio-alpha-client-main',
            name: 'Client Portfolio',
            risk_profile: 'conservative',
            created_at: '2024-02-05T10:00:00Z',
            updated_at: '2024-12-01T14:30:00Z',
            modes: [demoMode, paperMode, liveMode]
          }
        ]
      }
    ]
  },
  {
    id: 'org-zurich',
    name: 'Zurich Family Office',
    status: 'active',
    memberCount: 5,
    created_at: '2024-02-01T09:00:00Z',
    updated_at: '2024-11-28T16:45:00Z',
    tenants: [
      {
        id: 'tenant-zurich-prod',
        name: 'Production',
        type: 'Production',
        created_at: '2024-02-05T09:00:00Z',
        updated_at: '2024-11-28T16:45:00Z',
        portfolios: [
          {
            id: 'portfolio-zurich-wealth',
            name: 'Wealth Management',
            risk_profile: 'conservative',
            created_at: '2024-02-10T09:00:00Z',
            updated_at: '2024-11-28T16:45:00Z',
            modes: [demoMode, paperMode, liveMode]
          },
          {
            id: 'portfolio-zurich-alternative',
            name: 'Alternative Investments',
            risk_profile: 'moderate',
            created_at: '2024-03-01T10:00:00Z',
            updated_at: '2024-11-28T16:45:00Z',
            modes: [demoMode, paperMode, liveMode]
          }
        ]
      },
      {
        id: 'tenant-zurich-test',
        name: 'Test',
        type: 'Test',
        created_at: '2024-02-05T09:00:00Z',
        updated_at: '2024-11-28T16:45:00Z',
        portfolios: [
          {
            id: 'portfolio-zurich-test-wealth',
            name: 'Test Wealth Management',
            risk_profile: 'conservative',
            created_at: '2024-03-20T10:00:00Z',
            updated_at: '2024-11-28T16:45:00Z',
            modes: [demoMode, paperMode]
          }
        ]
      }
    ]
  }
];

// Helper functions to navigate the hierarchy
export function getOrganizationById(orgId: string): Organization | undefined {
  return hierarchicalOrganizations.find(org => org.id === orgId);
}

export function getTenantById(tenantId: string): Tenant | undefined {
  for (const org of hierarchicalOrganizations) {
    const tenant = org.tenants.find(t => t.id === tenantId);
    if (tenant) return tenant;
  }
  return undefined;
}

export function getPortfolioById(portfolioId: string): Portfolio | undefined {
  for (const org of hierarchicalOrganizations) {
    for (const tenant of org.tenants) {
      const portfolio = tenant.portfolios.find(p => p.id === portfolioId);
      if (portfolio) return portfolio;
    }
  }
  return undefined;
}

export function getOrganizationForTenant(tenantId: string): Organization | undefined {
  for (const org of hierarchicalOrganizations) {
    if (org.tenants.some(t => t.id === tenantId)) {
      return org;
    }
  }
  return undefined;
}

export function getTenantForPortfolio(portfolioId: string): Tenant | undefined {
  for (const org of hierarchicalOrganizations) {
    for (const tenant of org.tenants) {
      if (tenant.portfolios.some(p => p.id === portfolioId)) {
        return tenant;
      }
    }
  }
  return undefined;
}

// Default selections
export const defaultOrganization = hierarchicalOrganizations[0]; // Rugira AG
export const defaultTenant = defaultOrganization.tenants[0]; // Production
export const defaultPortfolio = defaultTenant.portfolios[0]; // Equity Desk
export const defaultMode = defaultPortfolio.modes[0]; // Demo