import React from "react";

interface StatusIndicatorProps {
  status: 'online' | 'warning' | 'error' | 'offline' | 'connected' | 'disconnected';
  className?: string;
}

export default function StatusIndicator({ status, className = "" }: StatusIndicatorProps) {
  
  const getStatusClass = () => {
    switch (status) {
      case 'online':
      case 'connected':
        return 'status-online';
      case 'warning':
        return 'status-warning';
      case 'error':
      case 'offline':
      case 'disconnected':
        return 'status-error';
      default:
        return 'status-error';
    }
  };

  return (
    <span 
      className={`status-indicator ${getStatusClass()} ${className}`}
      data-testid="status-indicator"
    ></span>
  );
}