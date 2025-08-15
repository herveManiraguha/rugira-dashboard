import React from 'react';
import { Badge } from '@/components/ui/badge';
import { cn } from '@/lib/utils';
import { CheckCircle, Clock, AlertTriangle, XCircle, Pause } from 'lucide-react';

export type StatusType = 'online' | 'offline' | 'warning' | 'error' | 'pending' | 'paused';

interface StatusBadgeProps {
  status: StatusType;
  label?: string;
  showIcon?: boolean;
  className?: string;
}

export function StatusBadge({ 
  status, 
  label, 
  showIcon = true, 
  className 
}: StatusBadgeProps) {
  const getStatusConfig = (status: StatusType) => {
    switch (status) {
      case 'online':
        return {
          label: label || 'Online',
          icon: CheckCircle,
          className: 'status-positive'
        };
      case 'offline':
        return {
          label: label || 'Offline',
          icon: XCircle,
          className: 'status-negative'
        };
      case 'warning':
        return {
          label: label || 'Warning',
          icon: AlertTriangle,
          className: 'status-warning'
        };
      case 'error':
        return {
          label: label || 'Error',
          icon: XCircle,
          className: 'status-negative'
        };
      case 'pending':
        return {
          label: label || 'Pending',
          icon: Clock,
          className: 'status-neutral'
        };
      case 'paused':
        return {
          label: label || 'Paused',
          icon: Pause,
          className: 'status-neutral'
        };
      default:
        return {
          label: label || 'Unknown',
          icon: XCircle,
          className: 'status-neutral'
        };
    }
  };

  const config = getStatusConfig(status);
  const Icon = config.icon;

  return (
    <Badge 
      className={cn(config.className, className)}
      data-testid={`status-badge-${status}`}
    >
      {showIcon && <Icon className="h-3 w-3 mr-1" />}
      {config.label}
    </Badge>
  );
}

// Predefined status badge variants for common use cases
export const StatusBadges = {
  BotRunning: () => <StatusBadge status="online" label="Running" />,
  BotStopped: () => <StatusBadge status="offline" label="Stopped" />,
  BotError: () => <StatusBadge status="error" label="Error" />,
  BotPaused: () => <StatusBadge status="paused" label="Paused" />,
  
  ExchangeConnected: () => <StatusBadge status="online" label="Connected" />,
  ExchangeDisconnected: () => <StatusBadge status="offline" label="Disconnected" />,
  ExchangeError: () => <StatusBadge status="error" label="Connection Error" />,
  
  SystemHealthy: () => <StatusBadge status="online" label="Healthy" />,
  SystemDegraded: () => <StatusBadge status="warning" label="Degraded" />,
  SystemDown: () => <StatusBadge status="error" label="Down" />,
} as const;