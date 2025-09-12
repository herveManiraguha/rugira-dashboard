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
  type: 'Production' | 'Test' | 'Active' | 'Advisory' | 'Managed' | 'Prop' | 'Brokerage' | 'Prime' | 'Family' | 'Institutional' | 'EU';
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

const allModes = [demoMode, paperMode, liveMode];

// Complete hierarchical data structure based on provided data
export const hierarchicalOrganizations: Organization[] = [
  {
    id: 'org-bahnhofstrasse',
    name: 'Bahnhofstrasse Family Office',
    status: 'active',
    memberCount: 12,
    created_at: '2024-01-01T10:00:00Z',
    updated_at: '2024-12-29T14:30:00Z',
    tenants: [
      {
        id: 'tenant-atlas-discretionary',
        name: 'Atlas FO - Discretionary',
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
            modes: allModes
          },
          {
            id: 'portfolio-rwa-arbitrage',
            name: 'RWA Arbitrage',
            risk_profile: 'aggressive',
            created_at: '2024-02-15T11:00:00Z',
            updated_at: '2024-12-29T14:30:00Z',
            modes: allModes
          }
        ]
      },
      {
        id: 'tenant-atlas-advisory',
        name: 'Atlas FO - Advisory',
        type: 'Advisory',
        created_at: '2024-01-15T10:00:00Z',
        updated_at: '2024-12-29T14:30:00Z',
        portfolios: [
          {
            id: 'portfolio-index-rebalance',
            name: 'Index Rebalance',
            risk_profile: 'conservative',
            created_at: '2024-03-01T09:00:00Z',
            updated_at: '2024-12-29T14:30:00Z',
            modes: allModes
          },
          {
            id: 'portfolio-yield-strategies',
            name: 'Yield Strategies',
            risk_profile: 'moderate',
            created_at: '2024-03-15T09:00:00Z',
            updated_at: '2024-12-29T14:30:00Z',
            modes: allModes
          }
        ]
      }
    ]
  },
  {
    id: 'org-helvetia',
    name: 'Helvetia Fund I',
    status: 'active',
    memberCount: 8,
    created_at: '2024-01-15T10:00:00Z',
    updated_at: '2024-12-01T14:30:00Z',
    tenants: [
      {
        id: 'tenant-master-fund',
        name: 'Master Fund',
        type: 'Production',
        created_at: '2024-01-20T10:00:00Z',
        updated_at: '2024-12-01T14:30:00Z',
        portfolios: [
          {
            id: 'portfolio-directional-crypto',
            name: 'Directional Crypto',
            risk_profile: 'aggressive',
            created_at: '2024-01-25T10:00:00Z',
            updated_at: '2024-12-01T14:30:00Z',
            modes: allModes
          },
          {
            id: 'portfolio-delta-neutral',
            name: 'Delta Neutral',
            risk_profile: 'moderate',
            created_at: '2024-02-10T11:00:00Z',
            updated_at: '2024-12-01T14:30:00Z',
            modes: allModes
          }
        ]
      },
      {
        id: 'tenant-usd-feeder',
        name: 'USD Feeder',
        type: 'Production',
        created_at: '2024-01-20T10:00:00Z',
        updated_at: '2024-12-01T14:30:00Z',
        portfolios: [
          {
            id: 'portfolio-liquidity-provision',
            name: 'Liquidity Provision',
            risk_profile: 'conservative',
            created_at: '2024-03-15T10:00:00Z',
            updated_at: '2024-12-01T14:30:00Z',
            modes: allModes
          },
          {
            id: 'portfolio-basis-arbitrage',
            name: 'Basis Arbitrage',
            risk_profile: 'moderate',
            created_at: '2024-03-20T10:00:00Z',
            updated_at: '2024-12-01T14:30:00Z',
            modes: allModes
          }
        ]
      }
    ]
  },
  {
    id: 'org-limmat',
    name: 'Limmat Capital Partners',
    status: 'active',
    memberCount: 10,
    created_at: '2024-02-01T09:00:00Z',
    updated_at: '2024-11-28T16:45:00Z',
    tenants: [
      {
        id: 'tenant-managed-accounts',
        name: 'Managed Accounts',
        type: 'Managed',
        created_at: '2024-02-05T09:00:00Z',
        updated_at: '2024-11-28T16:45:00Z',
        portfolios: [
          {
            id: 'portfolio-execution-algos',
            name: 'Execution Algos',
            risk_profile: 'moderate',
            created_at: '2024-02-10T09:00:00Z',
            updated_at: '2024-11-28T16:45:00Z',
            modes: allModes
          },
          {
            id: 'portfolio-otc-liquidity',
            name: 'OTC Liquidity',
            risk_profile: 'conservative',
            created_at: '2024-03-01T10:00:00Z',
            updated_at: '2024-11-28T16:45:00Z',
            modes: allModes
          }
        ]
      },
      {
        id: 'tenant-prop-trading',
        name: 'Prop Trading',
        type: 'Prop',
        created_at: '2024-02-05T09:00:00Z',
        updated_at: '2024-11-28T16:45:00Z',
        portfolios: [
          {
            id: 'portfolio-high-frequency',
            name: 'High-Frequency',
            risk_profile: 'aggressive',
            created_at: '2024-03-20T10:00:00Z',
            updated_at: '2024-11-28T16:45:00Z',
            modes: allModes
          },
          {
            id: 'portfolio-defi-routing',
            name: 'DeFi Routing',
            risk_profile: 'aggressive',
            created_at: '2024-04-01T10:00:00Z',
            updated_at: '2024-11-28T16:45:00Z',
            modes: allModes
          }
        ]
      }
    ]
  },
  {
    id: 'org-rigibridge',
    name: 'RigiBridge Digital Broker',
    status: 'active',
    memberCount: 15,
    created_at: '2024-03-01T09:00:00Z',
    updated_at: '2024-11-25T16:45:00Z',
    tenants: [
      {
        id: 'tenant-brokerage',
        name: 'Brokerage',
        type: 'Brokerage',
        created_at: '2024-03-05T09:00:00Z',
        updated_at: '2024-11-25T16:45:00Z',
        portfolios: [
          {
            id: 'portfolio-client-mm',
            name: 'Client MM',
            risk_profile: 'moderate',
            created_at: '2024-03-10T09:00:00Z',
            updated_at: '2024-11-25T16:45:00Z',
            modes: allModes
          },
          {
            id: 'portfolio-best-ex-routing',
            name: 'Best-Ex Routing',
            risk_profile: 'conservative',
            created_at: '2024-03-15T10:00:00Z',
            updated_at: '2024-11-25T16:45:00Z',
            modes: allModes
          }
        ]
      },
      {
        id: 'tenant-prime-services',
        name: 'Prime Services',
        type: 'Prime',
        created_at: '2024-03-05T09:00:00Z',
        updated_at: '2024-11-25T16:45:00Z',
        portfolios: [
          {
            id: 'portfolio-options-hedging',
            name: 'Options Hedging',
            risk_profile: 'moderate',
            created_at: '2024-03-20T10:00:00Z',
            updated_at: '2024-11-25T16:45:00Z',
            modes: allModes
          },
          {
            id: 'portfolio-tokenized-assets',
            name: 'Tokenized Assets',
            risk_profile: 'conservative',
            created_at: '2024-04-01T10:00:00Z',
            updated_at: '2024-11-25T16:45:00Z',
            modes: [demoMode, paperMode, { ...liveMode, enabled: false }]
          }
        ]
      }
    ]
  },
  {
    id: 'org-alpstein',
    name: 'Alpstein Wealth',
    status: 'active',
    memberCount: 7,
    created_at: '2024-04-01T09:00:00Z',
    updated_at: '2024-11-20T16:45:00Z',
    tenants: [
      {
        id: 'tenant-family-spv',
        name: 'Family SPV 2025',
        type: 'Family',
        created_at: '2024-04-05T09:00:00Z',
        updated_at: '2024-11-20T16:45:00Z',
        portfolios: [
          {
            id: 'portfolio-conservative',
            name: 'Conservative Portfolio',
            risk_profile: 'conservative',
            created_at: '2024-04-10T09:00:00Z',
            updated_at: '2024-11-20T16:45:00Z',
            modes: allModes
          },
          {
            id: 'portfolio-fx-crypto-overlay',
            name: 'FX-Crypto Overlay',
            risk_profile: 'moderate',
            created_at: '2024-04-15T10:00:00Z',
            updated_at: '2024-11-20T16:45:00Z',
            modes: allModes
          }
        ]
      },
      {
        id: 'tenant-advisory-mandates',
        name: 'Advisory Mandates',
        type: 'Advisory',
        created_at: '2024-04-05T09:00:00Z',
        updated_at: '2024-11-20T16:45:00Z',
        portfolios: [
          {
            id: 'portfolio-quant-macro',
            name: 'Quant Macro',
            risk_profile: 'aggressive',
            created_at: '2024-04-20T10:00:00Z',
            updated_at: '2024-11-20T16:45:00Z',
            modes: allModes
          },
          {
            id: 'portfolio-event-driven',
            name: 'Event-Driven',
            risk_profile: 'moderate',
            created_at: '2024-05-01T10:00:00Z',
            updated_at: '2024-11-20T16:45:00Z',
            modes: allModes
          }
        ]
      }
    ]
  },
  {
    id: 'org-glacier',
    name: 'Glacier Street Advisors',
    status: 'active',
    memberCount: 9,
    created_at: '2024-05-01T09:00:00Z',
    updated_at: '2024-11-15T16:45:00Z',
    tenants: [
      {
        id: 'tenant-institutional',
        name: 'Institutional Desk',
        type: 'Institutional',
        created_at: '2024-05-05T09:00:00Z',
        updated_at: '2024-11-15T16:45:00Z',
        portfolios: [
          {
            id: 'portfolio-systematic-trend',
            name: 'Systematic Trend',
            risk_profile: 'moderate',
            created_at: '2024-05-10T09:00:00Z',
            updated_at: '2024-11-15T16:45:00Z',
            modes: allModes
          },
          {
            id: 'portfolio-volatility-harvest',
            name: 'Volatility Harvest',
            risk_profile: 'aggressive',
            created_at: '2024-05-15T10:00:00Z',
            updated_at: '2024-11-15T16:45:00Z',
            modes: allModes
          }
        ]
      },
      {
        id: 'tenant-eu-mandates',
        name: 'EU Mandates',
        type: 'EU',
        created_at: '2024-05-05T09:00:00Z',
        updated_at: '2024-11-15T16:45:00Z',
        portfolios: [
          {
            id: 'portfolio-index-arbitrage',
            name: 'Index Arbitrage',
            risk_profile: 'moderate',
            created_at: '2024-05-20T10:00:00Z',
            updated_at: '2024-11-15T16:45:00Z',
            modes: allModes
          },
          {
            id: 'portfolio-liquidity-ops',
            name: 'Liquidity Ops',
            risk_profile: 'conservative',
            created_at: '2024-06-01T10:00:00Z',
            updated_at: '2024-11-15T16:45:00Z',
            modes: allModes
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
export const defaultOrganization = hierarchicalOrganizations[0]; // Bahnhofstrasse Family Office
export const defaultTenant = defaultOrganization.tenants[0]; // Atlas FO - Discretionary
export const defaultPortfolio = defaultTenant.portfolios[0]; // Equity Desk
export const defaultMode = defaultPortfolio.modes[0]; // Demo