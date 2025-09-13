import React from "react";

interface KPICardProps {
  label: string;
  value: number | string;
  change?: number;
  comparison: string;
  icon: string;
  type?: 'currency' | 'percentage' | 'number' | 'time';
  'data-testid'?: string;
}

export default function KPICard({ 
  label, 
  value, 
  change, 
  comparison, 
  icon, 
  type = 'number',
  'data-testid': testId 
}: KPICardProps) {
  
  const iconClass = `fas fa-${icon}`;
  
  const formattedValue = () => {
    if (typeof value === 'string') return value;
    
    switch (type) {
      case 'currency':
        return new Intl.NumberFormat('de-CH', {
          style: 'currency',
          currency: 'CHF'
        }).format(value as number);
      case 'percentage':
        return `${value}%`;
      case 'time':
        return `${value}ms`;
      default:
        return value.toString();
    }
  };
  
  const formattedChange = () => {
    if (change === undefined) return '';
    const sign = change >= 0 ? '+' : '';
    return type === 'percentage' ? `${sign}${change}%` : `${sign}${change}`;
  };
  
  const changeClass = () => {
    if (change === undefined) return 'text-text-500';
    return change >= 0 ? 'text-brand-green' : 'text-brand-red';
  };

  return (
    <div className="kpi-card" data-testid={testId}>
      <div className="flex items-center justify-between mb-3">
        <div className="feature-icon">
          <i className={iconClass}></i>
        </div>
        <span 
          className={`text-xs font-medium ${changeClass()}`}
          data-testid="text-kpi-change"
        >
          {formattedChange()}
        </span>
      </div>
      <h3 className="text-sm font-medium text-text-500 mb-1" data-testid="text-kpi-label">
        {label}
      </h3>
      <p className="text-2xl font-bold text-text-900" data-testid="text-kpi-value">
        {formattedValue()}
      </p>
      <div className="mt-2 text-xs text-text-500" data-testid="text-kpi-comparison">
        {comparison}
      </div>
    </div>
  );
}