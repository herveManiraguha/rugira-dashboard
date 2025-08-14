import React, { useState } from "react";
import { useNotificationStore, useApiStore } from "../../stores";
import StatusIndicator from "../UI/StatusIndicator";

export default function TopBar() {
  const { count, resetCount } = useNotificationStore();
  const { isConnected } = useApiStore();
  const [currentUser] = useState({ name: 'John Trader' });
  const [showUserMenu, setShowUserMenu] = useState(false);

  const showNotifications = () => {
    // Implement notification panel
    resetCount();
  };

  const emergencyStop = () => {
    if (!window.confirm('Are you sure you want to activate the emergency stop? This will halt all trading operations.')) {
      return;
    }
    
    // Call emergency stop API
    alert('Emergency stop activated. All bots have been halted.');
  };

  const toggleUserMenu = () => {
    setShowUserMenu(!showUserMenu);
  };

  return (
    <header className="bg-white border-b border-gray-200 px-6 py-4">
      <div className="flex items-center justify-between">
        {/* Tenant Switcher */}
        <div className="flex items-center space-x-4">
          <select 
            className="border border-gray-300 rounded-rugira px-3 py-2 text-sm bg-white focus:border-brand-red focus:ring-2 focus:ring-brand-red focus:ring-opacity-20"
            data-testid="select-tenant"
          >
            <option>Acme Trading LLC</option>
            <option>Demo Account</option>
          </select>
          <span className="inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium bg-brand-green text-white">
            <StatusIndicator status="online" className="mr-1" />
            LIVE
          </span>
        </div>

        {/* Top Bar Actions */}
        <div className="flex items-center space-x-4">
          {/* Notifications */}
          <button 
            className="relative p-2 text-text-500 hover:text-brand-red transition-colors" 
            onClick={showNotifications}
            data-testid="button-notifications"
          >
            <i className="fas fa-bell text-lg"></i>
            {count > 0 && (
              <span 
                className="absolute -top-1 -right-1 bg-brand-red text-white text-xs rounded-full w-5 h-5 flex items-center justify-center"
                data-testid="text-notification-count"
              >
                {count}
              </span>
            )}
          </button>

          {/* Kill Switch */}
          <button 
            className="btn-secondary text-xs px-3 py-1.5 border-2 border-brand-red"
            onClick={emergencyStop}
            data-testid="button-kill-switch"
            disabled={!isConnected}
          >
            <i className="fas fa-stop-circle mr-1"></i>
            Kill Switch
          </button>

          {/* User Menu */}
          <div className="relative">
            <button 
              className="flex items-center space-x-2 text-sm"
              onClick={toggleUserMenu}
              data-testid="button-user-menu"
            >
              <div className="w-8 h-8 bg-gray-200 rounded-full flex items-center justify-center">
                <i className="fas fa-user text-text-500"></i>
              </div>
              <span data-testid="text-user-name">{currentUser.name}</span>
              <i className="fas fa-chevron-down text-xs"></i>
            </button>
            
            {/* User dropdown would go here */}
          </div>
        </div>
      </div>
    </header>
  );
}