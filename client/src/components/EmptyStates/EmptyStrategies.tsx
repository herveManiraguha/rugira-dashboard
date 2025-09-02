import React from 'react';
import { Button } from "@/components/ui/button";
import { Target, Plus } from 'lucide-react';

interface EmptyStrategiesProps {
  onCreateStrategy: () => void;
}

export function EmptyStrategies({ onCreateStrategy }: EmptyStrategiesProps) {
  return (
    <div className="flex flex-col items-center justify-center py-12 px-4">
      <div className="mb-6">
        <div className="w-24 h-24 bg-gray-100 dark:bg-gray-800 rounded-full flex items-center justify-center">
          <Target className="w-12 h-12 text-gray-400" />
        </div>
      </div>
      
      <h3 className="text-xl font-semibold text-gray-900 dark:text-white mb-2">
        No Strategies Created
      </h3>
      <p className="text-gray-600 dark:text-gray-400 text-center max-w-sm mb-6">
        Design and test trading strategies before deploying them to your bots.
      </p>
      
      <Button onClick={onCreateStrategy} size="lg">
        <Plus className="w-4 h-4 mr-2" />
        Create Strategy
      </Button>
    </div>
  );
}