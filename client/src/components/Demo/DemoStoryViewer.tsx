import React from 'react';
import { useDemoMode } from '../../contexts/DemoContext';
import { Button } from '../ui/button';
import { Progress } from '../ui/progress';
import { Play, RotateCcw, Square } from 'lucide-react';

export default function DemoStoryViewer() {
  const { 
    isDemoMode, 
    isReadOnly,
    currentStoryEvent, 
    storyProgress, 
    isStoryPlaying, 
    startStory, 
    resetStory, 
    stopStory 
  } = useDemoMode();

  if (!isDemoMode || isReadOnly) return null;

  return (
    <div className="bg-white dark:bg-gray-800 rounded-lg border border-gray-200 dark:border-gray-700 p-6">
      <div className="flex items-center justify-between mb-4">
        <h3 className="text-lg font-semibold text-gray-900 dark:text-white">
          Demo Story (90 seconds)
        </h3>
        <div className="flex space-x-2">
          {!isStoryPlaying ? (
            <Button 
              onClick={startStory}
              size="sm"
              className="bg-[#E10600] hover:bg-[#C10500]"
              data-testid="button-start-story"
            >
              <Play className="w-4 h-4 mr-2" />
              {storyProgress > 0 ? 'Resume' : 'Start Demo'}
            </Button>
          ) : (
            <Button 
              onClick={stopStory}
              size="sm"
              variant="outline"
              data-testid="button-stop-story"
            >
              <Square className="w-4 h-4 mr-2" />
              Stop
            </Button>
          )}
          <Button 
            onClick={resetStory}
            size="sm"
            variant="outline"
            data-testid="button-reset-story"
          >
            <RotateCcw className="w-4 h-4 mr-2" />
            Reset
          </Button>
        </div>
      </div>

      <div className="space-y-4">
        <div>
          <div className="flex justify-between text-sm text-gray-600 dark:text-gray-400 mb-2">
            <span>Progress</span>
            <span>{Math.round(storyProgress)}%</span>
          </div>
          <Progress value={storyProgress} className="h-2" />
        </div>

        {currentStoryEvent && (
          <div className="bg-blue-50 dark:bg-blue-900/20 border border-blue-200 dark:border-blue-800 rounded-lg p-4">
            <div className="flex items-start space-x-3">
              <div className="w-2 h-2 bg-blue-500 rounded-full mt-2 flex-shrink-0"></div>
              <div>
                <h4 className="font-medium text-blue-900 dark:text-blue-100 mb-1">
                  Live Event
                </h4>
                <p className="text-sm text-blue-700 dark:text-blue-300">
                  {currentStoryEvent.description}
                </p>
                <p className="text-xs text-blue-600 dark:text-blue-400 mt-1">
                  {Math.round((currentStoryEvent.timestamp / 90) * 100)}% complete
                </p>
              </div>
            </div>
          </div>
        )}

        <div className="text-xs text-gray-500 dark:text-gray-400">
          Watch as a bot activates, places trades, triggers risk management, and generates compliance alerts in real-time.
        </div>
      </div>
    </div>
  );
}