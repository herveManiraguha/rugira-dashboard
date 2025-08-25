import React from "react";
import { Link, useLocation } from "wouter";
import { useBotsStore, useApiStore } from "../../stores";
import StatusIndicator from "../UI/StatusIndicator";

export default function Sidebar() {
  const [location] = useLocation();
  const { activeBotCount } = useBotsStore();
  const { isConnected, lastUpdate } = useApiStore();
  
  const complianceAlerts = 2; // This would come from compliance store
  
  const formatLastUpdate = (date: Date | null) => {
    if (!date) return '';
    
    const now = new Date();
    const diffMs = now.getTime() - date.getTime();
    const diffSeconds = Math.floor(diffMs / 1000);
    
    if (diffSeconds < 60) return `${diffSeconds} seconds ago`;
    if (diffSeconds < 3600) return `${Math.floor(diffSeconds / 60)} minutes ago`;
    return `${Math.floor(diffSeconds / 3600)} hours ago`;
  };

  const isActive = (path: string) => {
    return location === path;
  };

  return (
    <aside className="hidden xl:block w-64 bg-white border-r border-gray-200 fixed h-full z-30 overflow-y-auto">
      {/* Brand Header */}
      <div className="p-6 border-b border-gray-200">
        <div className="flex items-center space-x-3">
          <div className="w-8 h-8 bg-brand-red rounded-lg flex items-center justify-center">
            <i className="fas fa-chart-line text-white text-sm"></i>
          </div>
          <div>
            <h2 className="text-lg font-bold text-text-900">Rugira</h2>
            <p className="text-xs text-text-500">Trading Dashboard</p>
          </div>
        </div>
      </div>

      {/* Navigation Menu */}
      <nav className="p-4">
        <ul className="space-y-2">
          {/* Overview */}
          <li>
            <Link
              to="/"
              className={`nav-item flex items-center space-x-3 px-3 py-2 text-sm ${isActive('/') ? 'active' : ''}`}
              data-testid="nav-overview"
            >
              <i className="fas fa-chart-area w-5"></i>
              <span>Overview</span>
            </Link>
          </li>

          {/* Build Group */}
          <li className="pt-4">
            <div className="px-3 py-1 text-xs font-semibold text-gray-500 uppercase tracking-wider">
              Build
            </div>
          </li>
          <li>
            <Link
              to="/exchanges"
              className={`nav-item flex items-center space-x-3 px-3 py-2 text-sm ${isActive('/exchanges') ? 'active' : ''}`}
              data-testid="nav-exchanges"
            >
              <i className="fas fa-building w-5"></i>
              <span>Exchanges</span>
            </Link>
          </li>
          <li>
            <Link
              to="/strategies"
              className={`nav-item flex items-center space-x-3 px-3 py-2 text-sm ${isActive('/strategies') ? 'active' : ''}`}
              data-testid="nav-strategies"
            >
              <i className="fas fa-brain w-5"></i>
              <span>Strategies</span>
            </Link>
          </li>
          <li>
            <Link
              to="/backtesting"
              className={`nav-item flex items-center space-x-3 px-3 py-2 text-sm ${isActive('/backtesting') ? 'active' : ''}`}
              data-testid="nav-backtesting"
            >
              <i className="fas fa-flask w-5"></i>
              <span>Backtesting</span>
            </Link>
          </li>

          {/* Run Group */}
          <li className="pt-4">
            <div className="px-3 py-1 text-xs font-semibold text-gray-500 uppercase tracking-wider">
              Run
            </div>
          </li>
          <li>
            <Link
              to="/bots"
              className={`nav-item flex items-center space-x-3 px-3 py-2 text-sm ${isActive('/bots') ? 'active' : ''}`}
              data-testid="nav-bots"
            >
              <i className="fas fa-robot w-5"></i>
              <span>Bots</span>
              {activeBotCount > 0 && (
                <span 
                  className="ml-auto bg-brand-red text-white text-xs px-2 py-0.5 rounded-full"
                  data-testid="text-active-bot-count"
                >
                  {activeBotCount}
                </span>
              )}
            </Link>
          </li>
          <li>
            <Link
              to="/monitoring"
              className={`nav-item flex items-center space-x-3 px-3 py-2 text-sm ${isActive('/monitoring') ? 'active' : ''}`}
              data-testid="nav-monitoring"
            >
              <i className="fas fa-eye w-5"></i>
              <span>Monitoring</span>
            </Link>
          </li>

          {/* Govern Group */}
          <li className="pt-4">
            <div className="px-3 py-1 text-xs font-semibold text-gray-500 uppercase tracking-wider">
              Govern
            </div>
          </li>
          <li>
            <Link
              to="/reports"
              className={`nav-item flex items-center space-x-3 px-3 py-2 text-sm ${isActive('/reports') ? 'active' : ''}`}
              data-testid="nav-reports"
            >
              <i className="fas fa-chart-bar w-5"></i>
              <span>Reports</span>
            </Link>
          </li>
          <li>
            <Link
              to="/compliance"
              className={`nav-item flex items-center space-x-3 px-3 py-2 text-sm ${isActive('/compliance') ? 'active' : ''}`}
              data-testid="nav-compliance"
            >
              <i className="fas fa-shield-alt w-5"></i>
              <span>Compliance</span>
              {complianceAlerts > 0 && (
                <span 
                  className="ml-auto bg-yellow-500 text-white text-xs px-2 py-0.5 rounded-full"
                  data-testid="text-compliance-alerts"
                >
                  {complianceAlerts}
                </span>
              )}
            </Link>
          </li>

          {/* System Group */}
          <li className="pt-4">
            <div className="px-3 py-1 text-xs font-semibold text-gray-500 uppercase tracking-wider">
              System
            </div>
          </li>
          <li>
            <Link
              to="/admin"
              className={`nav-item flex items-center space-x-3 px-3 py-2 text-sm ${isActive('/admin') ? 'active' : ''}`}
              data-testid="nav-admin"
            >
              <i className="fas fa-cog w-5"></i>
              <span>Admin</span>
            </Link>
          </li>
          <li>
            <Link
              to="/help"
              className={`nav-item flex items-center space-x-3 px-3 py-2 text-sm ${isActive('/help') ? 'active' : ''}`}
              data-testid="nav-help"
            >
              <i className="fas fa-question-circle w-5"></i>
              <span>Help</span>
            </Link>
          </li>
        </ul>
      </nav>

      {/* Connection Status */}
      <div className="p-4 mt-auto border-t border-gray-200">
        <div className="flex items-center space-x-2 text-xs text-text-500">
          <StatusIndicator status={isConnected ? 'connected' : 'disconnected'} />
          <span data-testid="text-api-status">
            API {isConnected ? 'Connected' : 'Disconnected'}
          </span>
        </div>
        {lastUpdate && (
          <div className="text-xs text-text-500 mt-1" data-testid="text-last-update">
            Last update: {formatLastUpdate(lastUpdate)}
          </div>
        )}
      </div>
    </aside>
  );
}