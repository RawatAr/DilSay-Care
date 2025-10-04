import React, { useState } from 'react';
import { format, isToday } from 'date-fns';
import { DaySlots, Slot } from '../types';
import { SlotItem } from './SlotItem';
import { Plus, Calendar } from 'lucide-react';

interface DayColumnProps {
  date: Date;
  dayData?: DaySlots;
  isToday: boolean;
  onCreateSlot: () => void;
  onUpdateSlot: (id: number, updates: { start_time?: string; end_time?: string }) => void;
  onDeleteSlot: (id: number) => void;
  onUpdateSlotForDate: (id: number, updates: { start_time?: string; end_time?: string }) => void;
  onDeleteSlotForDate: (id: number) => void;
  isModalOpen?: boolean;
}

export const DayColumn: React.FC<DayColumnProps> = ({
  date,
  dayData,
  isToday,
  onCreateSlot,
  onUpdateSlot,
  onDeleteSlot,
  onUpdateSlotForDate,
  onDeleteSlotForDate,
  isModalOpen = false,
}) => {
  const slots = dayData?.slots || [];
  const canAddSlot = slots.length < 2;

  const handleCreateSlot = () => {
    if (canAddSlot) {
      onCreateSlot();
    }
  };

  return (
    <div className={`min-h-[200px] p-2 rounded-lg border ${
      isToday 
        ? 'bg-purple-50 border-purple-200' 
        : 'bg-white border-gray-200'
    }`}>
      {/* Day Header */}
      <div className="mb-3">
        <div className={`text-sm font-medium ${
          isToday ? 'text-purple-700' : 'text-gray-600'
        }`}>
          {format(date, 'EEE, d MMM')}
          {isToday && <span className="ml-1 text-xs">(Today)</span>}
        </div>
      </div>

      {/* Slots */}
      <div className="space-y-2">
        {slots.map((slot) => (
          <SlotItem
            key={slot.id}
            slot={slot}
            date={format(date, 'yyyy-MM-dd')}
            onUpdate={(updates) => onUpdateSlot(slot.id, updates)}
            onDelete={() => onDeleteSlot(slot.id)}
            onUpdateForDate={(updates) => onUpdateSlotForDate(slot.id, updates)}
            onDeleteForDate={() => onDeleteSlotForDate(slot.id)}
          />
        ))}

        {/* Add Slot Button */}
        {canAddSlot && (
          <button
            onClick={handleCreateSlot}
            disabled={isModalOpen}
            className={`w-full p-2 rounded-lg border-2 border-dashed transition-colors ${
              isToday
                ? 'border-purple-300 hover:border-purple-400 hover:bg-purple-100'
                : 'border-gray-300 hover:border-gray-400 hover:bg-gray-50'
            } disabled:opacity-50 disabled:cursor-not-allowed`}
          >
            <div className="flex items-center justify-center space-x-2">
              <Plus className="w-4 h-4" />
              <span className="text-sm font-medium">
                {isModalOpen ? 'Creating...' : 'Add Slot'}
              </span>
            </div>
          </button>
        )}

        {/* Max slots reached */}
        {!canAddSlot && (
          <div className="text-center py-2">
            <Calendar className="w-6 h-6 mx-auto text-gray-400 mb-1" />
            <p className="text-xs text-gray-500">Max 2 slots per day</p>
          </div>
        )}
      </div>
    </div>
  );
};
