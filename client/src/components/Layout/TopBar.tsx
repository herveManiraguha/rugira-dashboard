import React, { useState, useEffect, useRef } from "react";
import { useNotificationStore, useApiStore } from "../../stores";
import StatusIndicator from "../UI/StatusIndicator";
import { Link } from "wouter";

export default function TopBar() {
  const { count, notifications, markAsRead, markAllAsRead } = useNotificationStore();
  const { isConnected } = useApiStore();
  const [currentUser] = useState({ name: 'John Trader' });
  const [showUserMenu, setShowUserMenu] = useState(false);
  const [showNotifications, setShowNotifications] = useState(false);
  const notificationRef = useRef<HTMLDivElement>(null);

  const toggleNotifications = (e: React.MouseEvent) => {
    e.stopPropagation();
    setShowNotifications(!showNotifications);
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
          <div className="relative" ref={notificationRef}>
            <button 
              className="relative p-2 text-text-500 hover:text-brand-red transition-colors" 
              onClick={toggleNotifications}
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

            {/* Notification Dropdown */}
            {showNotifications && (
              <div 
                className="absolute right-0 mt-2 w-96 bg-white rounded-lg shadow-xl border border-gray-200 z-50 max-h-96 overflow-hidden"
                onClick={(e) => e.stopPropagation()}
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