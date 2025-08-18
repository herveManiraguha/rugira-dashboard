import React, { useState, useEffect } from 'react';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { Button } from '@/components/ui/button';
import { Calendar } from '@/components/ui/calendar';
import { Popover, PopoverContent, PopoverTrigger } from '@/components/ui/popover';
import { CalendarIcon } from 'lucide-react';
import { format } from 'date-fns';

export type TimeRange = '24h' | '7d' | '30d' | 'ytd' | 'custom';

interface TimeRangeData {
  value: TimeRange;
  label: string;
  from: Date;
  to: Date;
}

interface TimeRangeSelectorProps {
  value?: TimeRange;
  onChange: (range: TimeRangeData) => void;
  className?: string;
}

export function TimeRangeSelector({ value = '24h', onChange, className }: TimeRangeSelectorProps) {
  const [selectedRange, setSelectedRange] = useState<TimeRange>(value);
  const [customFrom, setCustomFrom] = useState<Date>();
  const [customTo, setCustomTo] = useState<Date>();
  const [isCustomOpen, setIsCustomOpen] = useState(false);

  // Load from localStorage on mount
  useEffect(() => {
    const saved = localStorage.getItem('rugira-time-range');
    if (saved) {
      try {
        const parsed = JSON.parse(saved);
        setSelectedRange(parsed.value);
        if (parsed.value === 'custom') {
          setCustomFrom(new Date(parsed.from));
          setCustomTo(new Date(parsed.to));
        }
      } catch (e) {
        // Ignore invalid saved data
      }
    }
  }, []);

  const getTimeRangeData = (range: TimeRange): TimeRangeData => {
    const now = new Date();
    const startOfDay = new Date(now.getFullYear(), now.getMonth(), now.getDate());
    
    switch (range) {
      case '24h':
        return {
          value: range,
          label: '24 Hours',
          from: new Date(now.getTime() - 24 * 60 * 60 * 1000),
          to: now
        };
      case '7d':
        return {
          value: range,
          label: '7 Days',
          from: new Date(now.getTime() - 7 * 24 * 60 * 60 * 1000),
          to: now
        };
      case '30d':
        return {
          value: range,
          label: '30 Days',
          from: new Date(now.getTime() - 30 * 24 * 60 * 60 * 1000),
          to: now
        };
      case 'ytd':
        return {
          value: range,
          label: 'Year to Date',
          from: new Date(now.getFullYear(), 0, 1),
          to: now
        };
      case 'custom':
        return {
          value: range,
          label: 'Custom Range',
          from: customFrom || startOfDay,
          to: customTo || now
        };
      default:
        return getTimeRangeData('24h');
    }
  };

  const handleRangeChange = (newRange: TimeRange) => {
    setSelectedRange(newRange);
    
    if (newRange !== 'custom') {
      const rangeData = getTimeRangeData(newRange);
      
      // Save to localStorage
      localStorage.setItem('rugira-time-range', JSON.stringify(rangeData));
      
      onChange(rangeData);
    } else {
      setIsCustomOpen(true);
    }
  };

  const handleCustomApply = () => {
    if (customFrom && customTo) {
      const rangeData: TimeRangeData = {
        value: 'custom',
        label: `${format(customFrom, 'MMM dd')} - ${format(customTo, 'MMM dd')}`,
        from: customFrom,
        to: customTo
      };
      
      // Save to localStorage
      localStorage.setItem('rugira-time-range', JSON.stringify(rangeData));
      
      onChange(rangeData);
      setIsCustomOpen(false);
    }
  };

  const currentData = getTimeRangeData(selectedRange);

  return (
    <div className={className}>
      <Select value={selectedRange} onValueChange={handleRangeChange}>
        <SelectTrigger className="w-[120px] sm:w-[140px] text-xs sm:text-sm" data-testid="time-range-selector">
          <SelectValue>
            {selectedRange === 'custom' && customFrom && customTo ? 
              `${format(customFrom, 'MMM dd')} - ${format(customTo, 'MMM dd')}` :
              currentData.label
            }
          </SelectValue>
        </SelectTrigger>
        <SelectContent>
          <SelectItem value="24h">24 Hours</SelectItem>
          <SelectItem value="7d">7 Days</SelectItem>
          <SelectItem value="30d">30 Days</SelectItem>
          <SelectItem value="ytd">Year to Date</SelectItem>
          <SelectItem value="custom">Custom Range</SelectItem>
        </SelectContent>
      </Select>

      <Popover open={isCustomOpen} onOpenChange={setIsCustomOpen}>
        <PopoverTrigger asChild>
          <Button style={{ display: 'none' }} />
        </PopoverTrigger>
        <PopoverContent className="w-auto p-0 max-w-[90vw] sm:max-w-none" align="start">
          <div className="p-3 sm:p-4 space-y-3 sm:space-y-4">
            <div className="space-y-2">
              <label className="text-sm font-medium">From:</label>
              <Popover>
                <PopoverTrigger asChild>
                  <Button variant="outline" className="w-full justify-start text-left font-normal">
                    <CalendarIcon className="mr-2 h-4 w-4" />
                    {customFrom ? format(customFrom, 'PPP') : 'Pick a date'}
                  </Button>
                </PopoverTrigger>
                <PopoverContent className="w-auto p-0">
                  <Calendar
                    mode="single"
                    selected={customFrom}
                    onSelect={setCustomFrom}
                    initialFocus
                  />
                </PopoverContent>
              </Popover>
            </div>
            
            <div className="space-y-2">
              <label className="text-sm font-medium">To:</label>
              <Popover>
                <PopoverTrigger asChild>
                  <Button variant="outline" className="w-full justify-start text-left font-normal">
                    <CalendarIcon className="mr-2 h-4 w-4" />
                    {customTo ? format(customTo, 'PPP') : 'Pick a date'}
                  </Button>
                </PopoverTrigger>
                <PopoverContent className="w-auto p-0">
                  <Calendar
                    mode="single"
                    selected={customTo}
                    onSelect={setCustomTo}
                    initialFocus
                  />
                </PopoverContent>
              </Popover>
            </div>
            
            <div className="flex space-x-2">
              <Button size="sm" onClick={handleCustomApply} disabled={!customFrom || !customTo}>
                Apply
              </Button>
              <Button size="sm" variant="outline" onClick={() => setIsCustomOpen(false)}>
                Cancel
              </Button>
            </div>
          </div>
        </PopoverContent>
      </Popover>
    </div>
  );
}