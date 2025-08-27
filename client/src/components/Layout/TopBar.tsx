import React, { useState, useRef } from "react";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { useNotificationStore, useApiStore } from "../../stores/index.tsx";
import StatusIndicator from "../UI/StatusIndicator";
import NotificationDropdown from "./NotificationDropdown";
import { GlobalSearch } from "@/components/ui/global-search";
import { LiveIndicator } from "@/components/ui/live-indicator";
import { LastUpdated } from "@/components/ui/last-updated";
import { ConfirmationDialog } from "@/components/ui/confirmation-dialog";
import { Bell, User, ChevronDown, StopCircle } from "lucide-react";
import { ThemeToggle } from "@/components/ThemeToggle";

interface TopBarProps {
  onMenuToggle?: () => void;
}

export default function TopBar({ onMenuToggle }: TopBarProps) {
  const { count, notifications, markAsRead, markAllAsRead } = useNotificationStore();
  const { isConnected } = useApiStore();
  const [currentUser] = useState({ name: 'John Trader' });
  const [showUserMenu, setShowUserMenu] = useState(false);
  const [showNotifications, setShowNotifications] = useState(false);

  const notificationButtonRef = useRef<HTMLDivElement>(null);

  const handleToggleNotifications = () => {
    setShowNotifications(!showNotifications);
  };

  const handleCloseNotifications = () => {
    setShowNotifications(false);
  };

  const handleMarkAsRead = (id: string) => {
    markAsRead(id);
  };

  const handleMarkAllAsRead = () => {
    markAllAsRead();
  };

  const emergencyStop = () => {
    // Call emergency stop API
    console.log('Emergency stop activated. All bots have been halted.');
  };

  const toggleUserMenu = () => {
    setShowUserMenu(!showUserMenu);
  };

  return (
    <header className="bg-navbar-bg border-b border-navbar-border px-3 sm:px-4 md:px-6 py-3 md:py-4 overflow-visible">
      <div className="flex items-center justify-between overflow-visible space-grid-md">
        {/* Left side - Mobile Menu and Tenant */}
        <div className="flex items-center space-x-2 sm:space-x-4">
          {/* Mobile Menu Button */}
          {onMenuToggle && (
            <button
              onClick={onMenuToggle}
              className="lg:hidden p-2 rounded-lg hover:bg-hover-surface transition-colors"
              data-testid="button-mobile-menu"
            >
              <svg className="h-5 w-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M4 6h16M4 12h16M4 18h16" />
              </svg>
            </button>
          )}
          
          {/* Tenant Switcher - Hidden on mobile */}
          <div className="hidden sm:block">
            <Select defaultValue="default" data-testid="select-tenant">
              <SelectTrigger className="w-[140px] md:w-[180px] font-semibold bg-white text-sm md:text-base">
                <SelectValue />
              </SelectTrigger>
              <SelectContent className="bg-white" style={{ backgroundColor: 'white', opacity: 1 }}>
                <SelectItem value="default">Default Tenant</SelectItem>
                <SelectItem value="switch">Switch Tenant (Pro)</SelectItem>
              </SelectContent>
            </Select>
          </div>
          
          {/* Status Badge */}
          <span className="hidden sm:inline-flex items-center px-2 md:px-2.5 py-0.5 rounded-full text-xs font-medium bg-brand-green text-white">
            <StatusIndicator status="online" className="mr-1" />
            LIVE
          </span>
        </div>

        {/* Center - Global Search and Live Status */}
        <div className="hidden lg:flex items-center space-x-4 mx-4 flex-1 justify-center">
          <GlobalSearch />
          <LiveIndicator isConnected={isConnected} />
          <LastUpdated timestamp={new Date()} className="text-xs" />
        </div>

        {/* Top Bar Actions */}
        <div className="flex items-center space-x-2 md:space-x-4 overflow-visible">
          {/* Theme Toggle */}
          <ThemeToggle />
          
          {/* Notifications */}
          <div className="relative" ref={notificationButtonRef}>
            <button 
              type="button"
              className="relative p-2 text-gray-600 hover:text-brand-red transition-colors rounded-lg hover:bg-gray-50" 
              onClick={handleToggleNotifications}
              data-testid="button-notifications"
            >
              <Bell className="h-5 w-5" />
              {count > 0 && (
                <span 
                  className="absolute -top-1 -right-1 bg-brand-red text-white text-xs rounded-full w-5 h-5 flex items-center justify-center font-medium"
                  data-testid="text-notification-count"
                >
                  {count}
                </span>
              )}
            </button>
          </div>
          
          {/* Notification Dropdown Portal */}
          <NotificationDropdown
            isOpen={showNotifications}
            onClose={handleCloseNotifications}
            notifications={notifications}
            onMarkAsRead={handleMarkAsRead}
            onMarkAllAsRead={handleMarkAllAsRead}
            anchorRef={notificationButtonRef}
          />

          {/* Kill Switch - Enhanced with Confirmation Dialog */}
          <ConfirmationDialog
            trigger={
              <button 
                type="button"
                className="hidden sm:flex btn-secondary text-xs px-2 md:px-3 py-1 md:py-1.5 border-2 border-brand-red items-center danger-action"
                disabled={!isConnected}
                data-testid="button-kill-switch"
              >
                <StopCircle className="h-4 w-4 md:mr-1" />
                <span className="hidden md:inline">Kill Switch</span>
              </button>
            }
            title="Emergency Stop Confirmation"
            description="This will immediately halt all trading operations across all bots. All open orders will be cancelled and positions will be maintained."
            confirmText="Stop All Trading"
            requiresTyping="PAUSE"
            onConfirm={emergencyStop}
            variant="destructive"
          />

          {/* User Menu */}
          <div className="relative">
            <button 
              className="flex items-center space-x-1 md:space-x-2 text-sm"
              onClick={toggleUserMenu}
              data-testid="button-user-menu"
            >
              <div className="w-8 h-8 bg-gray-200 rounded-full flex items-center justify-center">
                <User className="h-4 w-4 text-gray-600" />
              </div>
              <span className="hidden md:inline" data-testid="text-user-name">{currentUser.name}</span>
              <ChevronDown className="h-4 w-4 hidden md:block" />
            </button>
            
            {/* User dropdown would go here */}
          </div>
        </div>
      </div>
    </header>
  );
}