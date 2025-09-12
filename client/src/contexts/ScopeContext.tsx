import React, { createContext, useContext, useState, useEffect, ReactNode } from 'react';
import { useLocation } from 'wouter';
import { TradingEnvironment } from './EnvironmentContext';
import { 
  hierarchicalOrganizations,
  defaultOrganization,
  defaultTenant,
  defaultPortfolio,
  defaultMode,
  type Organization as HierarchicalOrg,
  type Tenant,
  type Portfolio as HierarchicalPortfolio,
  type Mode
} from '@shared/hierarchicalData';

export interface Organization extends HierarchicalOrg {}
export interface Portfolio extends HierarchicalPortfolio {}

interface ScopeState {
  organization: Organization | null;
  tenant: Tenant | null;
  portfolio: Portfolio | null;
  mode: Mode | null;
}

interface ScopeContextType extends ScopeState {
  organizations: Organization[];
  setOrganization: (org: Organization) => void;
  setTenant: (tenant: Tenant) => void;
  setPortfolio: (portfolio: Portfolio) => void;
  setMode: (mode: Mode) => Promise<boolean>;
  isRugiraStaff: boolean;
  scopeReady: boolean;
  getLiveSwitchSummary: () => { venues: string[]; limits: string; riskShields: boolean };
}

const ScopeContext = createContext<ScopeContextType | null>(null);

const STORAGE_KEY = 'rugira_scope';

interface ScopeProviderProps {
  children: ReactNode;
}

export function ScopeProvider({ children }: ScopeProviderProps) {
  const [location, setLocation] = useLocation();
  const [scopeReady, setScopeReady] = useState(false);
  
  // Initialize with defaults from hierarchical data
  const [organization, setOrganizationState] = useState<Organization | null>(null);
  const [tenant, setTenantState] = useState<Tenant | null>(null);
  const [portfolio, setPortfolioState] = useState<Portfolio | null>(null);
  const [mode, setModeState] = useState<Mode | null>(null);
  
  // Check if user is Rugira staff (feature flag)
  const isRugiraStaff = sessionStorage.getItem('rugira_staff') === 'true';

  // Load scope from URL or storage on mount
  useEffect(() => {
    const loadScope = () => {
      // Try to load from storage first
      let loadedOrg: Organization | null = null;
      let loadedTenant: Tenant | null = null;
      let loadedPortfolio: Portfolio | null = null;
      let loadedMode: Mode | null = null;
      
      const stored = sessionStorage.getItem(STORAGE_KEY);
      if (stored) {
        try {
          const parsed = JSON.parse(stored);
          loadedOrg = hierarchicalOrganizations.find(o => o.id === parsed.organizationId) || null;
          if (loadedOrg) {
            loadedTenant = loadedOrg.tenants.find(t => t.id === parsed.tenantId) || null;
            if (loadedTenant) {
              loadedPortfolio = loadedTenant.portfolios.find(p => p.id === parsed.portfolioId) || null;
              if (loadedPortfolio) {
                loadedMode = loadedPortfolio.modes.find(m => m.id === parsed.modeId) || null;
              }
            }
          }
        } catch (e) {
          console.error('Failed to parse stored scope');
        }
      }
      
      // Final fallback to defaults
      if (!loadedOrg) {
        loadedOrg = defaultOrganization;
      }
      if (!loadedTenant && loadedOrg) {
        loadedTenant = loadedOrg.tenants[0];
      }
      if (!loadedPortfolio && loadedTenant) {
        loadedPortfolio = loadedTenant.portfolios[0];
      }
      if (!loadedMode && loadedPortfolio) {
        loadedMode = loadedPortfolio.modes[0];
      }
      
      setOrganizationState(loadedOrg);
      setTenantState(loadedTenant);
      setPortfolioState(loadedPortfolio);
      setModeState(loadedMode);
      setScopeReady(true);
    };
    
    loadScope();
  }, []);

  // Persist scope changes
  const persistScope = () => {
    if (organization && tenant && portfolio && mode) {
      const scopeData = {
        organizationId: organization.id,
        tenantId: tenant.id,
        portfolioId: portfolio.id,
        modeId: mode.id
      };
      sessionStorage.setItem(STORAGE_KEY, JSON.stringify(scopeData));
    }
  };

  useEffect(() => {
    if (scopeReady && organization && tenant && portfolio && mode) {
      persistScope();
    }
  }, [organization, tenant, portfolio, mode, scopeReady]);

  const setOrganization = (org: Organization) => {
    setOrganizationState(org);
    // Reset to first tenant and its first portfolio
    const firstTenant = org.tenants[0];
    setTenantState(firstTenant);
    if (firstTenant) {
      const firstPortfolio = firstTenant.portfolios[0];
      setPortfolioState(firstPortfolio);
      if (firstPortfolio) {
        setModeState(firstPortfolio.modes[0]);
      }
    }
    
    // Emit audit event
    console.log('Audit event: scope.organization.changed', { from: organization?.id, to: org.id });
  };

  const setTenant = (newTenant: Tenant) => {
    setTenantState(newTenant);
    // Reset to first portfolio in the tenant
    const firstPortfolio = newTenant.portfolios[0];
    setPortfolioState(firstPortfolio);
    if (firstPortfolio) {
      setModeState(firstPortfolio.modes[0]);
    }
    
    // Emit audit event
    console.log('Audit event: scope.tenant.changed', { from: tenant?.id, to: newTenant.id });
  };

  const setPortfolio = (newPortfolio: Portfolio) => {
    setPortfolioState(newPortfolio);
    // Reset to first mode in the portfolio
    setModeState(newPortfolio.modes[0]);
    
    // Emit audit event
    console.log('Audit event: scope.portfolio.changed', { from: portfolio?.id, to: newPortfolio.id });
  };

  const setMode = async (newMode: Mode): Promise<boolean> => {
    // If switching to Live and it's not enabled, return false
    if (newMode.name === 'Live' && !newMode.enabled) {
      return false;
    }
    
    setModeState(newMode);
    
    // Emit audit event
    console.log('Audit event: scope.mode.changed', { 
      from: mode?.name, 
      to: newMode.name,
      organization: organization?.name,
      tenant: tenant?.name,
      portfolio: portfolio?.name
    });
    
    return true;
  };

  const getLiveSwitchSummary = () => {
    // Mock summary for Live mode
    return {
      venues: ['BX Digital', 'SDX', 'SIX'],
      limits: 'CHF 1M daily, CHF 100K per order',
      riskShields: true
    };
  };

  const contextValue: ScopeContextType = {
    organization,
    tenant,
    portfolio,
    mode,
    organizations: hierarchicalOrganizations,
    setOrganization,
    setTenant,
    setPortfolio,
    setMode,
    isRugiraStaff,
    scopeReady,
    getLiveSwitchSummary
  };

  return (
    <ScopeContext.Provider value={contextValue}>
      {children}
    </ScopeContext.Provider>
  );
}

export function useScope() {
  const context = useContext(ScopeContext);
  if (!context) {
    throw new Error('useScope must be used within ScopeProvider');
  }
  return context;
}