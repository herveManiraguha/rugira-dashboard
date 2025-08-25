import React, { useState } from 'react';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import AIAssistantChat from './AIAssistantChat';
import { 
  Bot, 
  MessageCircle, 
  X,
  Sparkles
} from 'lucide-react';
import { cn } from '@/lib/utils';

interface AIAssistantFloatProps {
  className?: string;
}

export default function AIAssistantFloat({ className }: AIAssistantFloatProps) {
  const [isOpen, setIsOpen] = useState(false);
  const [isMinimized, setIsMinimized] = useState(false);
  const [hasUnread, setHasUnread] = useState(false);

  const handleToggle = () => {
    if (isOpen) {
      setIsOpen(false);
      setIsMinimized(false);
    } else {
      setIsOpen(true);
      setIsMinimized(false);
      setHasUnread(false);
    }
  };

  const handleMinimize = () => {
    setIsMinimized(true);
    setHasUnread(false);
  };

  const handleMaximize = () => {
    setIsMinimized(false);
    setHasUnread(false);
  };

  const handleClose = () => {
    setIsOpen(false);
    setIsMinimized(false);
  };

  return (
    <div className={cn("fixed bottom-6 right-6 z-50", className)}>
      {/* Chat Window */}
      {isOpen && (
        <div className="mb-4 animate-in slide-in-from-bottom-5 duration-300">
          <div className="relative">
            <AIAssistantChat
              isMinimized={isMinimized}
              onMinimize={handleMinimize}
              onMaximize={handleMaximize}
              className="shadow-2xl border border-gray-200 bg-white"
            />
            {/* Close button for maximized chat */}
            {!isMinimized && (
              <Button
                variant="ghost"
                size="sm"
                onClick={handleClose}
                className="absolute -top-2 -right-2 h-6 w-6 p-0 bg-white border shadow-sm hover:bg-gray-50"
                data-testid="button-close-chat"
              >
                <X className="w-3 h-3" />
              </Button>
            )}
          </div>
        </div>
      )}

      {/* Floating Action Button */}
      <div className="relative">
        <Button
          onClick={handleToggle}
          size="lg"
          className={cn(
            "h-14 w-14 rounded-full shadow-lg hover:shadow-xl transition-all duration-300 transform hover:scale-110",
            "bg-gradient-to-r from-blue-600 to-indigo-600 hover:from-blue-700 hover:to-indigo-700",
            "border-2 border-white",
            isOpen ? "rotate-180" : "rotate-0"
          )}
          data-testid="button-ai-assistant-toggle"
        >
          {isOpen ? (
            <X className="w-6 h-6 text-white" />
          ) : (
            <div className="relative">
              <Bot className="w-6 h-6 text-white" />
              {/* Sparkle animation */}
              <Sparkles className="absolute -top-1 -right-1 w-3 h-3 text-yellow-300 animate-pulse" />
            </div>
          )}
        </Button>

        {/* Notification Badge */}
        {hasUnread && !isOpen && (
          <div className="absolute -top-1 -right-1">
            <div className="w-4 h-4 bg-red-500 rounded-full flex items-center justify-center animate-bounce">
              <div className="w-2 h-2 bg-white rounded-full"></div>
            </div>
          </div>
        )}

        {/* Tooltip */}
        {!isOpen && (
          <div className="absolute bottom-full right-0 mb-2 opacity-0 hover:opacity-100 transition-opacity duration-300 pointer-events-none">
            <div className="bg-gray-900 bg-opacity-95 text-white text-sm px-3 py-2 rounded-lg shadow-xl whitespace-nowrap backdrop-blur-sm">
              AI Trading Assistant
              <div className="absolute top-full right-4 w-0 h-0 border-l-4 border-r-4 border-t-4 border-l-transparent border-r-transparent border-t-gray-900"></div>
            </div>
          </div>
        )}
      </div>

      {/* Pulsing Ring Animation */}
      {!isOpen && (
        <div className="absolute inset-0 rounded-full bg-blue-400 animate-ping opacity-20 pointer-events-none"></div>
      )}
    </div>
  );
}