import React, { useState, useEffect, useRef } from "react";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { useNotificationStore, useApiStore } from "../../stores/index.tsx";
import StatusIndicator from "../UI/StatusIndicator";
import { Link } from "wouter";
import { Bell, User, ChevronDown, StopCircle } from "lucide-react";

interface TopBarProps {
  onMenuToggle?: () => void;
}

export default function TopBar({ onMenuToggle }: TopBarProps) {
  const { count, notifications, markAsRead, markAllAsRead } = useNotificationStore();
  const { isConnected } = useApiStore();
  const [currentUser] = useState({ name: 'John Trader' });
  const [showUserMenu, setShowUserMenu] = useState(false);
  const [showNotifications, setShowNotifications] = useState(false);

  const notificationRef = useRef<HTMLDivElement>(null);

  // Debug logging
  useEffect(() => {
    console.log('TopBar mounted, notifications count:', count);
    console.log('Notifications:', notifications);
  }, []);

  useEffect(() => {
    console.log('showNotifications state changed to:', showNotifications);
  }, [showNotifications]);

  const toggleNotifications = (e: React.MouseEvent) => {
    e.stopPropagation();
    e.preventDefault();
    console.log('Bell clicked! Current state:', showNotifications, 'Count:', count);
    setShowNotifications(prev => {
      const newState = !prev;
      console.log('Setting showNotifications to:', newState);
      return newState;
    });
  };

  const handleNotificationClick = (id: string, e: React.MouseEvent) => {
    e.stopPropagation();
    markAsRead(id);
  };

  const handleMarkAllRead = (e: React.MouseEvent) => {
    e.stopPropagation();
    markAllAsRead();
  };

  // Close notification dropdown when clicking outside
  useEffect(() => {
    const handleClickOutside = (event: MouseEvent) => {
      if (notificationRef.current && !notificationRef.current.contains(event.target as Node)) {
        setShowNotifications(false);
      }
    };

    if (showNotifications) {
      document.addEventListener('mousedown', handleClickOutside);
    }

    return () => {
      document.removeEventListener('mousedown', handleClickOutside);
    };
  }, [showNotifications]);

  const getNotificationIcon = (type: string) => {
    switch (type) {
      case 'success': return 'fas fa-check-circle text-green-500';
      case 'warning': return 'fas fa-exclamation-triangle text-yellow-500';
      case 'error': return 'fas fa-exclamation-circle text-red-500';
      case 'info': return 'fas fa-info-circle text-blue-500';
      default: return 'fas fa-bell text-gray-500';
    }
  };

  const formatTimeAgo = (timestamp: string) => {
    const now = new Date();
    const time = new Date(timestamp);
    const diffInMinutes = Math.floor((now.getTime() - time.getTime()) / (1000 * 60));
    
    if (diffInMinutes < 1) return 'Just now';
    if (diffInMinutes < 60) return `${diffInMinutes}m ago`;
    if (diffInMinutes < 1440) return `${Math.floor(diffInMinutes / 60)}h ago`;
    return `${Math.floor(diffInMinutes / 1440)}d ago`;
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
    <header className="bg-white border-b border-gray-200 px-3 sm:px-4 md:px-6 py-3 md:py-4 overflow-visible">
      <div className="flex items-center justify-between overflow-visible">
        {/* Left side - Mobile Menu and Tenant */}
        <div className="flex items-center space-x-2 sm:space-x-4">
          {/* Mobile Menu Button */}
          {onMenuToggle && (
            <button
              onClick={onMenuToggle}
              className="lg:hidden p-2 rounded-lg hover:bg-gray-100 transition-colors"
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

        {/* Top Bar Actions */}
        <div className="flex items-center space-x-2 md:space-x-4 overflow-visible">
          {/* Notifications */}
          <div className="relative overflow-visible" ref={notificationRef}>
            <button 
              type="button"
              className="relative p-2 text-gray-600 hover:text-brand-red transition-colors rounded-lg hover:bg-gray-50" 
              onClick={toggleNotifications}
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
            
            {/* Notification Dropdown */}
            {showNotifications && (
              <div 
                className="absolute right-0 mt-2 w-80 sm:w-96 bg-white rounded-lg shadow-xl border border-gray-200 z-[9999] overflow-hidden"
                style={{ 
                  position: 'absolute',
                  top: '100%',
                  right: 0,
                  marginTop: '0.5rem',
                  zIndex: 9999
                }}
                onClick={(e) => e.stopPropagation()}
              >
                <div className="p-4 border-b border-gray-200 bg-gray-50 flex items-center justify-between">
                  <h3 className="text-sm font-semibold text-gray-900">Notifications</h3>
                  {notifications.filter(n => !n.read).length > 0 && (
                    <button 
                      onClick={handleMarkAllRead}
                      className="text-xs text-brand-red hover:text-red-700 font-medium"
                    >
                      Mark all as read
                    </button>
                  )}
                </div>
                
                <div className="max-h-96 overflow-y-auto">
                  {notifications.length === 0 ? (
                    <div className="p-8 text-center text-gray-500">
                      <Bell className="h-12 w-12 mx-auto mb-3 text-gray-300" />
                      <p className="text-sm">No notifications yet</p>
                    </div>
                  ) : (
                    notifications.map((notification) => (
                      <div 
                        key={notification.id}
                        className={`p-4 border-b border-gray-100 hover:bg-gray-50 cursor-pointer transition-colors ${
                          !notification.read ? 'bg-blue-50' : ''
                        }`}
                        onClick={(e) => handleNotificationClick(notification.id, e)}
                      >
                        <div className="flex items-start space-x-3">
                          <i className={getNotificationIcon(notification.type)} />
                          <div className="flex-1 min-w-0">
                            <p className="text-sm font-medium text-gray-900">
                              {notification.title}
                            </p>
                            <p className="text-xs text-gray-500 mt-1">
                              {notification.message}
                            </p>
                            <p className="text-xs text-gray-400 mt-2">
                              {formatTimeAgo(notification.timestamp)}
                            </p>
                          </div>
                          {!notification.read && (
                            <div className="w-2 h-2 bg-brand-red rounded-full flex-shrink-0 mt-1.5"></div>
                          )}
                        </div>
                      </div>
                    ))
                  )}
                </div>
                
                {notifications.length > 0 && (
                  <Link href="/notifications">
                    <div className="p-3 text-center text-sm text-brand-red hover:bg-gray-50 font-medium cursor-pointer">
                      View all notifications
                    </div>
                  </Link>
                )}
              </div>
            )}
          </div>

          {/* Kill Switch - Hidden on mobile */}
          <button 
            type="button"
            className="hidden sm:flex btn-secondary text-xs px-2 md:px-3 py-1 md:py-1.5 border-2 border-brand-red items-center"
            onClick={emergencyStop}
            data-testid="button-kill-switch"
            disabled={!isConnected}
          >
            <StopCircle className="h-4 w-4 md:mr-1" />
            <span className="hidden md:inline">Kill Switch</span>
          </button>

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