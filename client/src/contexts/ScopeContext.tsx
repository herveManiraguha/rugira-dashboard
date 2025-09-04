import React, { createContext, useContext, useState, useEffect, ReactNode } from 'react';
import { useLocation } from 'wouter';
import { TradingEnvironment } from './EnvironmentContext';

export interface Organization {
  id: string;
  name: string;
  slug: string;
  roles: string[];
  isPinned?: boolean;
  isRecent?: boolean;
  portfolios?: Portfolio[];
}

export interface Portfolio {
  id: string;
  name: string;
  slug: string;
  hasLiveEnabled?: boolean;
  isDefault?: boolean;
  organization?: string;
}

interface ScopeState {
  organization: Organization | null;
  portfolio: Portfolio | null;
  mode: TradingEnvironment;
}

interface ScopeContextType extends ScopeState {
  organizations: Organization[];
  setOrganization: (org: Organization) => void;
  setPortfolio: (portfolio: Portfolio) => void;
  setMode: (mode: TradingEnvironment, requireConfirmation?: boolean) => Promise<boolean>;
  isRugiraStaff: boolean;
  scopeReady: boolean;
  getLiveSwitchSummary: () => { venues: string[]; limits: string; riskShields: boolean };
}

const ScopeContext = createContext<ScopeContextType | null>(null);

const STORAGE_KEY = 'rugira_scope';

// Demo organizations data
const DEMO_ORGANIZATIONS: Organization[] = [
  {
    id: 'rugira-ag',
    name: 'Rugira AG',
    slug: 'rugira-ag',
    roles: ['admin', 'trader'],
    isPinned: true,
    portfolios: [
      { id: 'delta-arb', name: 'Delta Arbitrage', slug: 'delta-arbitrage', hasLiveEnabled: true },
      { id: 'macro-desk', name: 'Macro Desk', slug: 'macro-desk', hasLiveEnabled: true, isDefault: true }
    ]
  },
  {
    id: 'alpha-capital',
    name: 'Alpha Capital AG',
    slug: 'alpha-capital',
    roles: ['admin'],
    isPinned: true,
    portfolios: [
      { id: 'arb-01', name: 'Arb 01', slug: 'arb-01', hasLiveEnabled: true, isDefault: true },
      { id: 'discretionary', name: 'Discretionary', slug: 'discretionary', hasLiveEnabled: false }
    ]
  },
  {
    id: 'zurich-fo',
    name: 'Zurich Family Office',
    slug: 'zurich-family-office',
    roles: ['viewer'],
    isRecent: true,
    portfolios: [
      { id: 'fo-core', name: 'FO-Core', slug: 'fo-core', hasLiveEnabled: false, isDefault: true }
    ]
  }
];

interface ScopeProviderProps {
  children: ReactNode;
}

export function ScopeProvider({ children }: ScopeProviderProps) {
  const [location, setLocation] = useLocation();
  const [scopeReady, setScopeReady] = useState(false);
  
  // Initialize with defaults
  const [organization, setOrganizationState] = useState<Organization | null>(null);
  const [portfolio, setPortfolioState] = useState<Portfolio | null>(null);
  const [mode, setModeState] = useState<TradingEnvironment>('Paper');
  
  // Check if user is Rugira staff (feature flag)
  const isRugiraStaff = sessionStorage.getItem('rugira_staff') === 'true';

  // Load scope from URL or storage on mount
  useEffect(() => {
    const loadScope = () => {
      // Try to load from storage first
      let loadedOrg: Organization | null = null;
      let loadedPortfolio: Portfolio | null = null;
      let loadedMode: TradingEnvironment = 'Paper';
      
      const stored = sessionStorage.getItem(STORAGE_KEY);
      if (stored) {
        try {
          const parsed = JSON.parse(stored);
          loadedOrg = DEMO_ORGANIZATIONS.find(o => o.id === parsed.organizationId) || null;
          if (loadedOrg) {
            loadedPortfolio = loadedOrg.portfolios?.find(p => p.id === parsed.portfolioId) || null;
          }
          loadedMode = parsed.mode || 'Paper';
        } catch (e) {
          console.error('Failed to parse stored scope');
        }
      }
      
      // Final fallback to defaults
      if (!loadedOrg) {
        loadedOrg = DEMO_ORGANIZATIONS.find(o => o.slug === 'alpha-capital') || DEMO_ORGANIZATIONS[0];
      }
      if (!loadedPortfolio && loadedOrg) {
        loadedPortfolio = loadedOrg.portfolios?.find(p => p.isDefault) || loadedOrg.portfolios?.[0] || null;
      }
      
      setOrganizationState(loadedOrg);
      setPortfolioState(loadedPortfolio);
      setModeState(loadedMode);
      setScopeReady(true);
    };
    
    loadScope();
  }, []);

  // Persist scope changes
  const persistScope = () => {
    if (organization && portfolio) {
      const scopeData = {
        organizationId: organization.id,
        portfolioId: portfolio.id,
        mode
      };
      sessionStorage.setItem(STORAGE_KEY, JSON.stringify(scopeData));
      
      // For now, don't update URL to avoid breaking existing routes
      // TODO: Implement proper URL routing with scope
      // const basePath = location.split('/').slice(2).join('/') || 'overview';
      // const newPath = `/${organization.slug}/${portfolio.slug}/${basePath}?mode=${mode.toLowerCase()}`;
      // if (location !== newPath) {
      //   setLocation(newPath);
      // }
    }
  };

  useEffect(() => {
    if (scopeReady && organization && portfolio) {
      persistScope();
    }
  }, [organization, portfolio, mode, scopeReady]);

  const setOrganization = (org: Organization) => {
    setOrganizationState(org);
    // Reset portfolio to default for new org
    const defaultPortfolio = org.portfolios?.find(p => p.isDefault) || org.portfolios?.[0];
    if (defaultPortfolio) {
      setPortfolioState(defaultPortfolio);
    }
    
    // Emit audit event
    console.log('Audit event: scope.organization.changed', { from: organization?.id, to: org.id });
  };

  const setPortfolio = (newPortfolio: Portfolio) => {
    setPortfolioState(newPortfolio);
    
    // Emit audit event
    console.log('Audit event: scope.portfolio.changed', { from: portfolio?.id, to: newPortfolio.id });
  };

  const setMode = async (newMode: TradingEnvironment, requireConfirmation = true): Promise<boolean> => {
    // If switching to Live and confirmation required, this will be handled by the component
    if (newMode === 'Live' && requireConfirmation) {
      return false; // Component should handle confirmation
    }
    
    setModeState(newMode);
    
    // Emit audit event
    console.log('Audit event: scope.mode.changed', { 
      from: mode, 
      to: newMode,
      organization: organization?.name,
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
    portfolio,
    mode,
    organizations: DEMO_ORGANIZATIONS,
    setOrganization,
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