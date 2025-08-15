import React from 'react';
import { Badge } from '@/components/ui/badge';
import { Button } from '@/components/ui/button';
import {
  Popover,
  PopoverContent,
  PopoverTrigger,
} from '@/components/ui/popover';
import { Cloud, CloudOff, AlertTriangle, RefreshCw } from 'lucide-react';
import { useAWSHealthCheck } from '@/hooks/useAWSHealthCheck';

export default function AWSStatusIndicator() {
  const { healthStatus, isLoading, refetch } = useAWSHealthCheck();

  const getStatusColor = () => {
    switch (healthStatus.status) {
      case 'healthy':
        return 'text-green-700 border-green-200 bg-green-50 hover:bg-green-100';
      case 'degraded':
        return 'text-yellow-700 border-yellow-200 bg-yellow-50 hover:bg-yellow-100';
      case 'unhealthy':
        return 'text-red-700 border-red-200 bg-red-50 hover:bg-red-100';
      case 'checking':
        return 'text-gray-700 border-gray-200 bg-gray-50 hover:bg-gray-100';
      default:
        return 'text-gray-700 border-gray-200 bg-gray-50 hover:bg-gray-100';
    }
  };

  const getStatusIcon = () => {
    if (isLoading) {
      return <RefreshCw className="w-3 h-3 animate-spin" />;
    }

    switch (healthStatus.status) {
      case 'healthy':
        return <Cloud className="w-3 h-3" />;
      case 'degraded':
        return <AlertTriangle className="w-3 h-3" />;
      case 'unhealthy':
        return <CloudOff className="w-3 h-3" />;
      case 'checking':
        return <RefreshCw className="w-3 h-3 animate-spin" />;
      default:
        return <Cloud className="w-3 h-3" />;
    }
  };

  const getStatusText = () => {
    switch (healthStatus.status) {
      case 'healthy':
        return 'AWS OK';
      case 'degraded':
        return 'AWS Degraded';
      case 'unhealthy':
        return 'AWS Down';
      case 'checking':
        return 'Checking...';
      default:
        return 'AWS Unknown';
    }
  };

  const getServiceStatusColor = (status: string) => {
    switch (status) {
      case 'operational':
        return 'text-green-600';
      case 'degraded':
        return 'text-yellow-600';
      case 'down':
        return 'text-red-600';
      default:
        return 'text-gray-600';
    }
  };

  return (
    <Popover>
      <PopoverTrigger asChild>
        <Button
          variant="outline"
          size="sm"
          className={`cursor-pointer transition-colors border ${getStatusColor()}`}
          data-testid="badge-aws-status"
        >
          <div className="flex items-center gap-1">
            {getStatusIcon()}
            {getStatusText()}
          </div>
        </Button>
      </PopoverTrigger>
      <PopoverContent className="w-80" align="end">
        <div className="space-y-4">
          <div className="flex items-center justify-between">
            <h4 className="font-semibold">AWS Infrastructure Status</h4>
            <Button
              variant="ghost"
              size="sm"
              onClick={refetch}
              disabled={isLoading}
              data-testid="button-refresh-aws-status"
            >
              <RefreshCw className={`w-4 h-4 ${isLoading ? 'animate-spin' : ''}`} />
            </Button>
          </div>
          
          <div className="space-y-2">
            <div className="flex justify-between text-sm">
              <span className="text-gray-600">Region:</span>
              <span className="font-medium">{healthStatus.region}</span>
            </div>
            <div className="flex justify-between text-sm">
              <span className="text-gray-600">Response Time:</span>
              <span className="font-medium">{healthStatus.responseTime}ms</span>
            </div>
            <div className="flex justify-between text-sm">
              <span className="text-gray-600">Last Checked:</span>
              <span className="font-medium">
                {healthStatus.lastChecked.toLocaleTimeString()}
              </span>
            </div>
          </div>

          <div className="border-t pt-3">
            <h5 className="font-medium text-sm mb-2">Service Status</h5>
            <div className="space-y-1">
              <div className="flex justify-between text-sm">
                <span>EC2 (Compute):</span>
                <span className={`font-medium ${getServiceStatusColor(healthStatus.services.ec2)}`}>
                  {healthStatus.services.ec2}
                </span>
              </div>
              <div className="flex justify-between text-sm">
                <span>RDS (Database):</span>
                <span className={`font-medium ${getServiceStatusColor(healthStatus.services.rds)}`}>
                  {healthStatus.services.rds}
                </span>
              </div>
              <div className="flex justify-between text-sm">
                <span>Lambda (Functions):</span>
                <span className={`font-medium ${getServiceStatusColor(healthStatus.services.lambda)}`}>
                  {healthStatus.services.lambda}
                </span>
              </div>
              <div className="flex justify-between text-sm">
                <span>API Gateway:</span>
                <span className={`font-medium ${getServiceStatusColor(healthStatus.services.apiGateway)}`}>
                  {healthStatus.services.apiGateway}
                </span>
              </div>
            </div>
          </div>

          <div className="text-xs text-gray-500 pt-2 border-t">
            This is a simulated AWS health check. In production, this will connect to real AWS Health Dashboard API.
          </div>
        </div>
      </PopoverContent>
    </Popover>
  );
}