import React, { useState, useEffect } from 'react';
import { Bell, CheckCircle, AlertTriangle, XCircle, Info, RefreshCw } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { Popover, PopoverContent, PopoverTrigger } from '@/components/ui/popover';
import { Badge } from '@/components/ui/badge';
import { Separator } from '@/components/ui/separator';
import { cn } from '@/lib/utils';

interface Notification {
  id: string;
  type: 'success' | 'warning' | 'error' | 'info';
  title: string;
  message: string;
  timestamp: string;
  read: boolean;
  category: string;
  actionUrl?: string;
}

// Demo notifications data
const generateDemoNotifications = (): Notification[] => {
  const now = new Date();
  const notifications: Notification[] = [
    {
      id: '1',
      type: 'error',
      title: 'Failed to execute order on FTX',
      message: 'Error: Insufficient balance',
      timestamp: new Date(now.getTime() - 7 * 60 * 1000).toISOString(), // 7 minutes ago
      read: false,
      category: 'Trading'
    },
    {
      id: '2',
      type: 'success',
      title: 'Gamma Momentum Bot closed profitable trade',
      message: 'SOL-USDT • Size: $800 • Fee: $0.60',
      timestamp: new Date(now.getTime() - 11 * 60 * 1000).toISOString(), // 11 minutes ago
      read: false,
      category: 'Trading'
    },
    {
      id: '3',
      type: 'info',
      title: 'Beta Grid Trading opened new position',
      message: 'ETH-USDT • Size: $1,200 • Fee: $1.20',
      timestamp: new Date(now.getTime() - 15 * 60 * 1000).toISOString(), // 15 minutes ago
      read: true,
      category: 'Trading'
    },
    {
      id: '4',
      type: 'warning',
      title: 'API rate limit exceeded on Kraken',
      message: 'Error: Insufficient balance',
      timestamp: new Date(now.getTime() - 18 * 60 * 1000).toISOString(), // 18 minutes ago
      read: true,
      category: 'System'
    },
    {
      id: '5',
      type: 'success',
      title: 'Weekly P&L Report Generated',
      message: 'Your weekly performance report is ready',
      timestamp: new Date(now.getTime() - 2 * 60 * 60 * 1000).toISOString(), // 2 hours ago
      read: true,
      category: 'Reports'
    },
    {
      id: '6',
      type: 'info',
      title: 'System Maintenance Complete',
      message: 'All systems are now operational',
      timestamp: new Date(now.getTime() - 4 * 60 * 60 * 1000).toISOString(), // 4 hours ago
      read: true,
      category: 'System'
    }
  ];

  return notifications;
};

export default function NotificationButton() {
  const [notifications, setNotifications] = useState<Notification[]>([]);
  const [isOpen, setIsOpen] = useState(false);
  const [lastUpdated, setLastUpdated] = useState<Date>(new Date());

  useEffect(() => {
    // Load initial notifications
    setNotifications(generateDemoNotifications());
    setLastUpdated(new Date());
  }, []);

  const unreadCount = notifications.filter(n => !n.read).length;

  const getNotificationIcon = (type: string) => {
    switch (type) {
      case 'success':
        return <CheckCircle className="h-4 w-4 text-green-500 flex-shrink-0" />;
      case 'warning':
        return <AlertTriangle className="h-4 w-4 text-yellow-500 flex-shrink-0" />;
      case 'error':
        return <XCircle className="h-4 w-4 text-red-500 flex-shrink-0" />;
      case 'info':
        return <Info className="h-4 w-4 text-blue-500 flex-shrink-0" />;
      default:
        return <Bell className="h-4 w-4 text-gray-500 flex-shrink-0" />;
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

  const markAsRead = (id: string) => {
    setNotifications(prev => 
      prev.map(n => n.id === id ? { ...n, read: true } : n)
    );
  };

  const markAllAsRead = () => {
    setNotifications(prev => 
      prev.map(n => ({ ...n, read: true }))
    );
  };

  const handleRefresh = () => {
    setNotifications(generateDemoNotifications());
    setLastUpdated(new Date());
  };

  return (
    <Popover open={isOpen} onOpenChange={setIsOpen}>
      <PopoverTrigger asChild>
        <Button 
          variant="ghost" 
          size="sm" 
          className="relative hover:bg-gray-100 transition-colors"
          data-testid="button-notifications"
        >
          <Bell className="h-4 w-4" />
          {unreadCount > 0 && (
            <Badge 
              variant="destructive" 
              className="absolute -top-1 -right-1 h-5 w-5 text-xs p-0 flex items-center justify-center min-w-[1.25rem]"
            >
              {unreadCount > 9 ? '9+' : unreadCount}
            </Badge>
          )}
        </Button>
      </PopoverTrigger>
      
      <PopoverContent 
        className="w-96 p-0 shadow-lg border" 
        align="end"
        sideOffset={8}
      >
        {/* Header */}
        <div className="p-4 border-b bg-gray-50 flex items-center justify-between">
          <div className="flex items-center space-x-2">
            <h3 className="text-sm font-semibold text-gray-900">Notifications</h3>
            {unreadCount > 0 && (
              <Badge variant="secondary" className="text-xs">
                {unreadCount} new
              </Badge>
            )}
          </div>
          <div className="flex items-center space-x-2">
            {unreadCount > 0 && (
              <Button
                variant="ghost"
                size="sm"
                onClick={markAllAsRead}
                className="text-xs h-6 px-2 text-blue-600 hover:text-blue-700"
              >
                Mark all read
              </Button>
            )}
            <Button
              variant="ghost"
              size="sm"
              onClick={handleRefresh}
              className="h-6 w-6 p-0"
              title="Refresh notifications"
            >
              <RefreshCw className="h-3 w-3" />
            </Button>
          </div>
        </div>

        {/* Notifications List */}
        <div className="max-h-96 overflow-y-auto">
          {notifications.length === 0 ? (
            <div className="p-8 text-center text-gray-500">
              <Bell className="h-12 w-12 mx-auto mb-3 text-gray-300" />
              <p className="text-sm">No notifications yet</p>
            </div>
          ) : (
            notifications.slice(0, 8).map((notification, index) => (
              <div key={notification.id}>
                <div
                  className={cn(
                    "p-4 hover:bg-gray-50 cursor-pointer transition-colors",
                    !notification.read && "bg-blue-50 border-l-2 border-blue-500"
                  )}
                  onClick={() => markAsRead(notification.id)}
                >
                  <div className="flex items-start space-x-3">
                    {getNotificationIcon(notification.type)}
                    <div className="flex-1 min-w-0">
                      <div className="flex items-start justify-between">
                        <p className="text-sm font-medium text-gray-900 line-clamp-1">
                          {notification.title}
                        </p>
                        {!notification.read && (
                          <div className="w-2 h-2 bg-blue-500 rounded-full flex-shrink-0 mt-1.5 ml-2"></div>
                        )}
                      </div>
                      <p className="text-xs text-gray-600 mt-1 line-clamp-2">
                        {notification.message}
                      </p>
                      <div className="flex items-center justify-between mt-2">
                        <p className="text-xs text-gray-400">
                          {formatTimeAgo(notification.timestamp)}
                        </p>
                        <Badge variant="outline" className="text-xs">
                          {notification.category}
                        </Badge>
                      </div>
                    </div>
                  </div>
                </div>
                {index < Math.min(notifications.length - 1, 7) && (
                  <Separator className="mx-4" />
                )}
              </div>
            ))
          )}
        </div>

        {/* Footer */}
        {notifications.length > 0 && (
          <div className="p-3 border-t bg-gray-50">
            <div className="text-center">
              <Button
                variant="ghost"
                size="sm"
                className="text-sm text-gray-600 hover:text-gray-900 w-full"
                onClick={() => setIsOpen(false)}
              >
                View all notifications
              </Button>
            </div>
            <div className="text-center mt-1">
              <p className="text-xs text-gray-400">
                Last updated: {lastUpdated.toLocaleTimeString()}
              </p>
            </div>
          </div>
        )}
      </PopoverContent>
    </Popover>
  );
}