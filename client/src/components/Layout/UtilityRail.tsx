import React, { useState } from 'react';
import { cn } from '@/lib/utils';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import { ScrollArea } from '@/components/ui/scroll-area';
import { 
  ChevronLeft, 
  ChevronRight, 
  CheckCircle, 
  AlertTriangle,
  Activity,
  Bell,
  FileCheck,
  Clock,
  X
} from 'lucide-react';
import { useAuth } from '@/contexts/AuthContext';

interface ApprovalItem {
  id: string;
  type: string;
  description: string;
  requester: string;
  timestamp: string;
}

interface ActivityItem {
  id: string;
  type: 'bot_start' | 'bot_stop' | 'venue_change' | 'export';
  message: string;
  timestamp: string;
}

interface Alert {
  id: string;
  severity: 'warning' | 'error' | 'info';
  message: string;
  timestamp: string;
  acknowledged: boolean;
}

export function UtilityRail() {
  const [isCollapsed, setIsCollapsed] = useState(false);
  const { tenantRoles } = useAuth();
  const canApprove = tenantRoles?.includes('admin') || tenantRoles?.includes('compliance');
  
  // Mock data - would come from API in production
  const approvals: ApprovalItem[] = canApprove ? [
    {
      id: '1',
      type: 'Mode Change',
      description: 'BTCUSD-MM-01 from Paper to Live',
      requester: 'Martin Keller',
      timestamp: '02/09/2025, 15:44:54'
    },
    {
      id: '2',
      type: 'Risk Increase',
      description: 'ETHUSD-ARB-02 Daily loss limit: $5,000 → $10,000',
      requester: 'Lin Zhang',
      timestamp: '02/09/2025, 14:44:54'
    }
  ] : [];

  const activities: ActivityItem[] = [
    {
      id: '1',
      type: 'bot_start',
      message: 'Alpha Arbitrage Bot started',
      timestamp: '5m ago'
    },
    {
      id: '2',
      type: 'venue_change',
      message: 'BX Digital connected',
      timestamp: '12m ago'
    },
    {
      id: '3',
      type: 'export',
      message: 'P&L Report exported',
      timestamp: '1h ago'
    }
  ];

  const [alerts, setAlerts] = useState<Alert[]>([
    {
      id: '1',
      severity: 'warning',
      message: 'API rate limit exceeded on Kraken',
      timestamp: '18m ago',
      acknowledged: false
    },
    {
      id: '2',
      severity: 'info',
      message: 'Scheduled maintenance tonight 2-3 AM',
      timestamp: '2h ago',
      acknowledged: false
    }
  ]);

  const acknowledgeAlert = (id: string) => {
    setAlerts(prev => prev.map(alert => 
      alert.id === id ? { ...alert, acknowledged: true } : alert
    ).filter(alert => !alert.acknowledged || alert.id !== id));
  };

  const getActivityIcon = (type: ActivityItem['type']) => {
    switch (type) {
      case 'bot_start':
      case 'bot_stop':
        return <Activity className="h-3.5 w-3.5" />;
      case 'venue_change':
        return <CheckCircle className="h-3.5 w-3.5" />;
      case 'export':
        return <FileCheck className="h-3.5 w-3.5" />;
    }
  };

  const getSeverityColor = (severity: Alert['severity']) => {
    switch (severity) {
      case 'error':
        return 'text-red-600 bg-red-50';
      case 'warning':
        return 'text-amber-600 bg-amber-50';
      case 'info':
        return 'text-blue-600 bg-blue-50';
    }
  };

  if (isCollapsed) {
    return (
      <div className="w-12 border-l border-gray-200 bg-white">
        <Button
          variant="ghost"
          size="sm"
          onClick={() => setIsCollapsed(false)}
          className="mt-4 ml-2 h-8 w-8 p-0"
        >
          <ChevronLeft className="h-4 w-4" />
        </Button>
      </div>
    );
  }

  return (
    <div className="w-80 border-l border-gray-200 bg-white">
      <div className="flex items-center justify-between border-b border-gray-200 px-4 py-3">
        <h3 className="text-sm font-medium text-gray-900">Activity</h3>
        <Button
          variant="ghost"
          size="sm"
          onClick={() => setIsCollapsed(true)}
          className="h-8 w-8 p-0"
        >
          <ChevronRight className="h-4 w-4" />
        </Button>
      </div>
      
      <ScrollArea className="h-[calc(100vh-120px)]">
        <div className="p-4 space-y-6">
          {/* Approvals Section */}
          {approvals.length > 0 && (
            <div>
              <div className="mb-3 flex items-center justify-between">
                <h4 className="text-xs font-medium uppercase tracking-wider text-gray-500">
                  Pending Approvals
                </h4>
                <Badge variant="destructive" className="text-xs">
                  {approvals.length}
                </Badge>
              </div>
              <div className="space-y-2">
                {approvals.map(approval => (
                  <div 
                    key={approval.id}
                    className="rounded-lg border border-gray-200 bg-gray-50 p-3 hover:bg-gray-100 cursor-pointer transition-colors"
                  >
                    <div className="mb-1 flex items-center justify-between">
                      <span className="text-xs font-medium text-gray-900">
                        {approval.type}
                      </span>
                      <Clock className="h-3 w-3 text-gray-400" />
                    </div>
                    <p className="mb-1 text-xs text-gray-600">
                      {approval.description}
                    </p>
                    <p className="text-xs text-gray-500">
                      {approval.requester} • {approval.timestamp}
                    </p>
                  </div>
                ))}
              </div>
            </div>
          )}

          {/* Activity Feed */}
          <div>
            <h4 className="mb-3 text-xs font-medium uppercase tracking-wider text-gray-500">
              Recent Activity
            </h4>
            <div className="space-y-2">
              {activities.map(activity => (
                <div key={activity.id} className="flex items-start gap-2">
                  <div className={cn(
                    "mt-0.5 flex h-6 w-6 items-center justify-center rounded-full",
                    activity.type === 'export' ? "bg-blue-100 text-blue-600" : "bg-green-100 text-green-600"
                  )}>
                    {getActivityIcon(activity.type)}
                  </div>
                  <div className="flex-1">
                    <p className="text-xs text-gray-700">{activity.message}</p>
                    <p className="text-xs text-gray-500">{activity.timestamp}</p>
                  </div>
                </div>
              ))}
            </div>
          </div>

          {/* Alerts */}
          {alerts.length > 0 && (
            <div>
              <h4 className="mb-3 text-xs font-medium uppercase tracking-wider text-gray-500">
                System Alerts
              </h4>
              <div className="space-y-2">
                {alerts.map(alert => (
                  <div
                    key={alert.id}
                    className={cn(
                      "rounded-lg border p-3",
                      getSeverityColor(alert.severity)
                    )}
                  >
                    <div className="flex items-start justify-between">
                      <div className="flex items-start gap-2">
                        {alert.severity === 'warning' ? (
                          <AlertTriangle className="mt-0.5 h-3.5 w-3.5" />
                        ) : alert.severity === 'error' ? (
                          <X className="mt-0.5 h-3.5 w-3.5" />
                        ) : (
                          <Bell className="mt-0.5 h-3.5 w-3.5" />
                        )}
                        <div>
                          <p className="text-xs font-medium">{alert.message}</p>
                          <p className="mt-1 text-xs opacity-75">{alert.timestamp}</p>
                        </div>
                      </div>
                      <Button
                        variant="ghost"
                        size="sm"
                        onClick={() => acknowledgeAlert(alert.id)}
                        className="h-6 px-2 text-xs"
                      >
                        Dismiss
                      </Button>
                    </div>
                  </div>
                ))}
              </div>
            </div>
          )}
        </div>
      </ScrollArea>
    </div>
  );
}