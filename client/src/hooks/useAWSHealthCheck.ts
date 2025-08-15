import { useState, useEffect } from 'react';

interface AWSHealthStatus {
  status: 'healthy' | 'degraded' | 'unhealthy' | 'checking';
  region: string;
  lastChecked: Date;
  responseTime: number;
  services: {
    ec2: 'operational' | 'degraded' | 'down';
    rds: 'operational' | 'degraded' | 'down';
    lambda: 'operational' | 'degraded' | 'down';
    apiGateway: 'operational' | 'degraded' | 'down';
  };
}

export function useAWSHealthCheck() {
  const [healthStatus, setHealthStatus] = useState<AWSHealthStatus>({
    status: 'checking',
    region: 'us-east-1',
    lastChecked: new Date(),
    responseTime: 0,
    services: {
      ec2: 'operational',
      rds: 'operational',
      lambda: 'operational',
      apiGateway: 'operational'
    }
  });

  const [isLoading, setIsLoading] = useState(true);

  const checkAWSHealth = async () => {
    setIsLoading(true);
    
    try {
      const startTime = Date.now();
      
      // Simulate AWS health check API call
      await new Promise(resolve => setTimeout(resolve, Math.random() * 1000 + 500));
      
      const endTime = Date.now();
      const responseTime = endTime - startTime;
      
      // Simulate different health statuses
      const healthScenarios = [
        {
          status: 'healthy' as const,
          services: {
            ec2: 'operational' as const,
            rds: 'operational' as const,
            lambda: 'operational' as const,
            apiGateway: 'operational' as const
          }
        },
        {
          status: 'degraded' as const,
          services: {
            ec2: 'operational' as const,
            rds: 'degraded' as const,
            lambda: 'operational' as const,
            apiGateway: 'operational' as const
          }
        },
        {
          status: 'healthy' as const,
          services: {
            ec2: 'operational' as const,
            rds: 'operational' as const,
            lambda: 'degraded' as const,
            apiGateway: 'operational' as const
          }
        }
      ];
      
      // 85% chance of healthy, 15% chance of degraded/issues
      const scenario = Math.random() < 0.85 
        ? healthScenarios[0] 
        : healthScenarios[Math.floor(Math.random() * healthScenarios.length)];
      
      setHealthStatus({
        ...scenario,
        region: 'us-east-1',
        lastChecked: new Date(),
        responseTime
      });
      
    } catch (error) {
      setHealthStatus(prev => ({
        ...prev,
        status: 'unhealthy',
        lastChecked: new Date(),
        services: {
          ec2: 'down',
          rds: 'down',
          lambda: 'down',
          apiGateway: 'down'
        }
      }));
    } finally {
      setIsLoading(false);
    }
  };

  useEffect(() => {
    // Initial check
    checkAWSHealth();
    
    // Check every 30 seconds
    const interval = setInterval(checkAWSHealth, 30000);
    
    return () => clearInterval(interval);
  }, []);

  return {
    healthStatus,
    isLoading,
    refetch: checkAWSHealth
  };
}