import React, { useState, useEffect, useRef } from "react";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { useNotificationStore, useApiStore } from "../../stores/index.tsx";
import StatusIndicator from "../UI/StatusIndicator";
import { Link } from "wouter";
import { Bell, User, ChevronDown, StopCircle } from "lucide-react";

export default function TopBar() {
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
    <header className="bg-white border-b border-gray-200 px-6 py-4">
      <div className="flex items-center justify-between">
        {/* Tenant Switcher - Shadcn Select */}
        <div className="flex items-center space-x-4">
          <Select defaultValue="default" data-testid="select-tenant">
            <SelectTrigger className="w-[180px] font-semibold bg-white">
              <SelectValue />
            </SelectTrigger>
            <SelectContent className="bg-white" style={{ backgroundColor: 'white', opacity: 1 }}>
              <SelectItem value="default">Default Tenant</SelectItem>
              <SelectItem value="switch">Switch Tenant (Pro)</SelectItem>
            </SelectContent>
          </Select>
          <span className="inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium bg-brand-green text-white">
            <StatusIndicator status="online" className="mr-1" />
            LIVE
          </span>
        </div>

        {/* Top Bar Actions */}
        <div className="flex items-center space-x-4">
          {/* Notifications */}
          <div className="relative">
            <button 
              type="button"
              className="relative p-2 text-gray-600 hover:text-brand-red transition-colors rounded-lg hover:bg-gray-50" 
              onClick={() => setShowNotifications(!showNotifications)}
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

            {/* SIMPLE TEST - This should always show */}
            <div 
              className="absolute right-0 mt-2 w-48 h-24 bg-red-500 text-white p-4 rounded border"
              style={{ zIndex: 9999, top: '100%' }}
            >
              TEST PANEL VISIBLE
            </div>

            {showNotifications && (
              <div 
                className="absolute right-0 mt-2 w-96 bg-white rounded-lg shadow-xl border border-gray-200 max-h-96 overflow-hidden"
                style={{ zIndex: 50, top: '100%' }}
              >
                <div className="p-4 border-b border-gray-200 flex items-center justify-between">
                  <h3 className="text-lg font-semibold text-gray-900">Notifications</h3>
                  <button 
                    onClick={handleMarkAllRead}
                    className="text-sm text-brand-red hover:text-brand-red-dark font-medium"
                  >
                    Mark all read
                  </button>
                </div>
                
                <div className="max-h-80 overflow-y-auto">
                  {notifications.slice(0, 8).map((notification) => (
                    <div 
                      key={notification.id}
                      className={`p-4 border-b border-gray-100 hover:bg-gray-50 cursor-pointer transition-colors ${!notification.read ? 'bg-blue-50' : ''}`}
                      onClick={(e) => handleNotificationClick(notification.id, e)}
                    >
                      <div className="flex items-start space-x-3">
                        <div className="flex-shrink-0 mt-1">
                          <i className={`${getNotificationIcon(notification.type)} text-sm`}></i>
                        </div>
                        <div className="flex-1 min-w-0">
                          <div className="flex items-center justify-between">
                            <p className={`text-sm font-medium text-gray-900 ${!notification.read ? 'font-semibold' : ''}`}>
                              {notification.title}
                            </p>
                            {!notification.read && (
                              <div className="w-2 h-2 bg-brand-red rounded-full flex-shrink-0 ml-2"></div>
                            )}
                          </div>
                          <p className="text-sm text-gray-600 mt-1">
                            {notification.message}
                          </p>
                          <div className="flex items-center justify-between mt-2">
                            <span className="text-xs text-gray-500">
                              {formatTimeAgo(notification.timestamp)}
                            </span>
                            {notification.actionUrl && (
                              <Link href={notification.actionUrl}>
                                <button 
                                  className="text-xs text-brand-red hover:text-brand-red-dark font-medium"
                                  onClick={(e) => {
                                    e.stopPropagation();
                                    setShowNotifications(false);
                                  }}
                                >
                                  View Details
                                </button>
                              </Link>
                            )}
                          </div>
                        </div>
                      </div>
                    </div>
                  ))}
                  
                  {notifications.length === 0 && (
                    <div className="p-8 text-center text-gray-500">
                      <i className="fas fa-bell-slash text-3xl text-gray-300 mb-3"></i>
                      <p>No notifications</p>
                    </div>
                  )}
                </div>
                
                {notifications.length > 8 && (
                  <div className="p-3 border-t border-gray-200 text-center">
                    <button className="text-sm text-brand-red hover:text-brand-red-dark font-medium">
                      View All Notifications
                    </button>
                  </div>
                )}
              </div>
            )}
          </div>

          {/* Kill Switch */}
          <button 
            type="button"
            className="btn-secondary text-xs px-3 py-1.5 border-2 border-brand-red flex items-center"
            onClick={emergencyStop}
            data-testid="button-kill-switch"
            disabled={!isConnected}
          >
            <StopCircle className="h-4 w-4 mr-1" />
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
                <User className="h-4 w-4 text-gray-600" />
              </div>
              <span data-testid="text-user-name">{currentUser.name}</span>
              <ChevronDown className="h-4 w-4" />
            </button>
            
            {/* User dropdown would go here */}
          </div>
        </div>
      </div>
    </header>
  );
}