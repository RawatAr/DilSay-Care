import React, { useState } from 'react';
import { format, addDays, startOfWeek, isToday, isSameDay, addWeeks } from 'date-fns';
import { DaySlots } from '../types';
import { ChevronDown, ChevronLeft, ChevronRight, Plus, Trash2, Edit } from 'lucide-react';
import { MonthYearPicker } from './MonthYearPicker';

interface WeeklyCalendarProps {
  weeks: DaySlots[][];
  loading: boolean;
  onLoadMore: () => void;
  onNavigateWeek: (direction: 'prev' | 'next') => void;
  onCreateSlot: (dayOfWeek: number, date: string) => void;
  onEditSlot: (id: number, date: string, startTime: string, endTime: string, isException: boolean) => void;
  onUpdateSlot: (id: number, updates: { start_time?: string; end_time?: string }) => void;
  onDeleteSlot: (id: number) => void;
  onUpdateSlotForDate: (id: number, date: string, updates: { start_time?: string; end_time?: string }) => void;
  onDeleteSlotForDate: (id: number, date: string) => void;
  isModalOpen?: boolean;
}

export const WeeklyCalendar: React.FC<WeeklyCalendarProps> = ({
  weeks,
  loading,
  onLoadMore,
  onNavigateWeek,
  onCreateSlot,
  onEditSlot,
  onUpdateSlot,
  onDeleteSlot,
  onUpdateSlotForDate,
  onDeleteSlotForDate,
  isModalOpen = false,
}) => {
  const [isLoadingMore, setIsLoadingMore] = useState(false);
  const [isMonthPickerOpen, setIsMonthPickerOpen] = useState(false);

  const handleLoadMore = async () => {
    setIsLoadingMore(true);
    await onLoadMore();
    setIsLoadingMore(false);
  };

  const handleScroll = (e: React.UIEvent<HTMLDivElement>) => {
    const { scrollTop, scrollHeight, clientHeight } = e.currentTarget;
    const isNearBottom = scrollTop + clientHeight >= scrollHeight - 100;
    
    if (isNearBottom && !loading && !isLoadingMore) {
      handleLoadMore();
    }
  };

  // Get all days from all weeks
  const allDays = weeks.flat();
  const weekStart = allDays.length > 0 ? startOfWeek(new Date(allDays[0].date), { weekStartsOn: 1 }) : startOfWeek(new Date(), { weekStartsOn: 1 });

  const dayNames = ['S', 'M', 'T', 'W', 'T', 'F', 'S'];
  const dates = Array.from({ length: 7 }, (_, i) => addDays(weekStart, i));

  return (
    <div className="flex-1 overflow-hidden bg-gray-50">
      {/* Date Picker Header - Exact match to photo */}
      <div className="bg-white border-b border-gray-200 p-4">
        {/* Day Selector - Horizontal row like in photo */}
        <div className="flex justify-between items-center mb-4">
          {dayNames.map((day, index) => {
            const date = dates[index];
            const isCurrentDay = isToday(date);
            
            return (
              <div key={index} className="flex flex-col items-center">
                <div className="text-xs text-gray-500 mb-1">{day}</div>
                <div className={`w-8 h-8 rounded-lg flex items-center justify-center text-sm font-medium ${
                  isCurrentDay 
                    ? 'bg-purple-600 text-white' 
                    : 'text-gray-700 hover:bg-gray-100'
                }`}>
                  {format(date, 'd')}
                </div>
              </div>
            );
          })}
        </div>
        
        {/* Month/Year Selector - Centered like in photo */}
        <div className="flex items-center justify-center space-x-4">
          <button onClick={() => onNavigateWeek('prev')} className="p-1 hover:bg-gray-100 rounded">
            <ChevronLeft className="w-4 h-4 text-gray-600" />
          </button>
                    <button 
            onClick={() => setIsMonthPickerOpen(true)}
            className="flex items-center space-x-2 text-gray-700 hover:text-gray-900"
          >
            <span className="font-medium">{format(weekStart, 'MMMM yyyy')}</span>
            <ChevronDown className="w-4 h-4" />
          </button>
          <button onClick={() => onNavigateWeek('next')} className="p-1 hover:bg-gray-100 rounded">
            <ChevronRight className="w-4 h-4 text-gray-600" />
          </button>
        </div>
      </div>

      {/* Schedule List - Vertical list like in photo */}
      <div 
        className="flex-1 overflow-y-auto"
        onScroll={handleScroll}
      >
        <div className="p-4 space-y-1 max-w-4xl mx-auto">
          {allDays.map((dayData, index) => {
            const date = new Date(dayData.date);
            const isCurrentDay = isToday(date);
            const slots = dayData.slots || [];
            
            return (
              <div key={index} className="bg-white rounded-lg p-4 border border-gray-200">
                <div className="flex items-center justify-between">
                  {/* Day name and date */}
                  <div className="flex items-center space-x-2">
                    <h3 className={`font-medium ${
                      isCurrentDay ? 'text-blue-600' : 'text-gray-900'
                    }`}>
                      {format(date, 'EEE, d MMMM')}
                      {isCurrentDay && <span className="ml-2 text-xs">(Today)</span>}
                    </h3>
                  </div>
                  
                  {/* Time slot input and action buttons */}
                  <div className="flex items-center space-x-2">
                    {slots.length === 0 ? (
                      <div className="flex items-center space-x-2">
                        <input
                          type="text"
                          value="00:00 - 00:00"
                          readOnly
                          className="w-32 px-3 py-2 border border-gray-300 rounded-lg text-sm text-gray-500 bg-gray-50"
                        />
                        <button
                          onClick={() => onCreateSlot(dayData.day_of_week, format(date, 'yyyy-MM-dd'))}
                          disabled={isModalOpen}
                          className="w-8 h-8 rounded-full bg-gray-100 text-gray-600 hover:bg-gray-200 disabled:opacity-50 flex items-center justify-center"
                        >
                          <Plus className="w-4 h-4" />
                        </button>
                        <button className="w-8 h-8 rounded-full bg-gray-100 text-gray-600 hover:bg-gray-200 flex items-center justify-center">
                          <Trash2 className="w-4 h-4" />
                        </button>
                      </div>
                    ) : (
                      slots.map((slot, slotIndex) => (
                        <div key={slot.id} className="flex items-center space-x-2">
                          <span className="text-sm font-medium text-gray-900">
                            {slot.start_time} - {slot.end_time}
                          </span>
                          <button
                            onClick={() => onEditSlot(slot.id, format(date, 'yyyy-MM-dd'), slot.start_time, slot.end_time, slot.is_exception)}
                            className="w-8 h-8 rounded-full bg-gray-100 text-gray-600 hover:bg-gray-200 flex items-center justify-center"
                          >
                            <Edit className="w-4 h-4" />
                          </button>
                          {slots.length < 2 && (
                            <button
                              onClick={() => onCreateSlot(dayData.day_of_week, format(date, 'yyyy-MM-dd'))}
                              disabled={isModalOpen}
                              className="w-8 h-8 rounded-full bg-gray-100 text-gray-600 hover:bg-gray-200 disabled:opacity-50 flex items-center justify-center"
                            >
                              <Plus className="w-4 h-4" />
                            </button>
                          )}
                          <button
                            onClick={() => {
                              if (slot.is_exception) {
                                onDeleteSlotForDate(slot.id, format(date, 'yyyy-MM-dd'));
                              } else {
                                onDeleteSlot(slot.id);
                              }
                            }}
                            className="w-8 h-8 rounded-full bg-gray-100 text-gray-600 hover:bg-gray-200 flex items-center justify-center"
                          >
                            <Trash2 className="w-4 h-4" />
                          </button>
                        </div>
                      ))
                    )}
                  </div>
                </div>
              </div>
            );
          })}
        </div>
        
        {/* Loading indicator */}
        {loading && (
          <div className="flex justify-center py-8">
            <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-purple-600"></div>
          </div>
        )}
        
        {isLoadingMore && (
          <div className="flex justify-center py-4">
            <div className="animate-spin rounded-full h-6 w-6 border-b-2 border-purple-600"></div>
          </div>
        )}
            </div>

      {/* Month/Year Picker Modal */}
      <MonthYearPicker
        isOpen={isMonthPickerOpen}
        onClose={() => setIsMonthPickerOpen(false)}
        currentDate={weekStart}
        onSelect={(date) => {
          // Navigate to the selected month
          const today = new Date();
          const targetDate = new Date(date.getFullYear(), date.getMonth(), 1);
          const monthsDiff = (targetDate.getFullYear() - today.getFullYear()) * 12 + 
                            (targetDate.getMonth() - today.getMonth());
          
          if (monthsDiff > 0) {
            for (let i = 0; i < monthsDiff; i++) {
              onNavigateWeek('next');
            }
          } else if (monthsDiff < 0) {
            for (let i = 0; i < Math.abs(monthsDiff); i++) {
              onNavigateWeek('prev');
            }
          }
        }}
      />
    </div>
  );
};
