import React from 'react';
import { Button } from '@/components/ui/button';
import { cn } from '@/lib/utils';
import { Grid3X3, List, Plus } from 'lucide-react';

interface StandardPageLayoutProps {
  title: string;
  subtitle?: string;
  viewMode?: 'cards' | 'grid' | 'list';
  onViewModeChange?: (mode: 'cards' | 'grid' | 'list') => void;
  showViewModes?: boolean;
  actionButton?: {
    label: string;
    onClick: () => void;
    icon?: React.ReactNode;
  };
  additionalControls?: React.ReactNode;
  children: React.ReactNode;
  className?: string;
}

export function StandardPageLayout({
  title,
  subtitle,
  viewMode,
  onViewModeChange,
  showViewModes = false,
  actionButton,
  additionalControls,
  children,
  className
}: StandardPageLayoutProps) {
  return (
    <div className={cn("space-y-3", className)}>
      {/* Header Section */}
      <div className="mb-1">
        <div className="flex flex-col sm:flex-row sm:items-start sm:justify-between gap-4">
          {/* Title and Subtitle Section */}
          <div className="flex-1">
            <h1 className="text-2xl font-bold text-gray-900 dark:text-white" data-testid="page-title">
              {title}
            </h1>
            {subtitle && (
              <p className="mt-1 text-sm text-gray-600 dark:text-gray-400 max-w-3xl" data-testid="page-subtitle">
                {subtitle}
              </p>
            )}
          </div>
          
          {/* Controls Section - Always positioned at the same spot */}
          <div className="flex items-center gap-2 min-w-fit">
            {/* Additional Controls (filters, etc) */}
            {additionalControls}
            
            {/* View Mode Toggle - Consistent position */}
            {showViewModes && onViewModeChange && (
              <div className="hidden sm:flex items-center bg-gray-100 dark:bg-gray-800 rounded-lg p-1 gap-1">
                <Button
                  variant={viewMode === 'cards' ? 'default' : 'ghost'}
                  size="sm"
                  onClick={() => onViewModeChange('cards')}
                  className={cn(
                    "h-8 px-3 transition-all",
                    viewMode === 'cards' 
                      ? "bg-white dark:bg-gray-700 shadow-sm text-gray-900 dark:text-white" 
                      : "hover:bg-gray-200 dark:hover:bg-gray-700 text-gray-600 dark:text-gray-400"
                  )}
                  data-testid="view-mode-cards"
                >
                  <Grid3X3 className="h-4 w-4" />
                  <span className="ml-1.5 text-xs">Cards</span>
                </Button>
                <Button
                  variant={viewMode === 'list' || viewMode === 'grid' ? 'default' : 'ghost'}
                  size="sm"
                  onClick={() => onViewModeChange(viewMode === 'list' ? 'grid' : 'list')}
                  className={cn(
                    "h-8 px-3 transition-all",
                    (viewMode === 'list' || viewMode === 'grid')
                      ? "bg-white dark:bg-gray-700 shadow-sm text-gray-900 dark:text-white" 
                      : "hover:bg-gray-200 dark:hover:bg-gray-700 text-gray-600 dark:text-gray-400"
                  )}
                  data-testid="view-mode-list"
                >
                  <List className="h-4 w-4" />
                  <span className="ml-1.5 text-xs">List</span>
                </Button>
              </div>
            )}
            
            {/* Action Button - Always in the same position */}
            {actionButton && (
              <Button
                onClick={actionButton.onClick}
                className="h-9 sm:h-10 px-4"
                data-testid="page-action-button"
              >
                {actionButton.icon || <Plus className="h-4 w-4 mr-2" />}
                {actionButton.label}
              </Button>
            )}
          </div>
        </div>
      </div>
      
      {/* Main Content Area */}
      <div id="main-content">
        {children}
      </div>
    </div>
  );
}