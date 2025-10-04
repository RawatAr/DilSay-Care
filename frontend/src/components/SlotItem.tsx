import React, { useState, useEffect } from 'react';
import { Slot } from '../types';
import { Edit2, Trash2, Save, X } from 'lucide-react';

interface SlotItemProps {
  slot: Slot;
  date: string;
  onUpdate: (updates: { start_time?: string; end_time?: string }) => void;
  onDelete: () => void;
  onUpdateForDate: (updates: { start_time?: string; end_time?: string }) => void;
  onDeleteForDate: () => void;
}

export const SlotItem: React.FC<SlotItemProps> = ({
  slot,
  date,
  onUpdate,
  onDelete,
  onUpdateForDate,
  onDeleteForDate,
}) => {
  const [isEditing, setIsEditing] = useState(false);
  const [startTime, setStartTime] = useState(slot.start_time);
  const [endTime, setEndTime] = useState(slot.end_time);
  const [showActions, setShowActions] = useState(false);

  // Update local state when slot prop changes
  useEffect(() => {
    setStartTime(slot.start_time);
    setEndTime(slot.end_time);
  }, [slot.start_time, slot.end_time]);

  const handleSave = () => {
    if (startTime && endTime && startTime < endTime) {
      if (slot.is_exception) {
        onUpdateForDate({ start_time: startTime, end_time: endTime });
      } else {
        onUpdate({ start_time: startTime, end_time: endTime });
      }
      setIsEditing(false);
    }
  };

  const handleCancel = () => {
    setStartTime(slot.start_time);
    setEndTime(slot.end_time);
    setIsEditing(false);
  };

  const handleDelete = () => {
    if (slot.is_exception) {
      onDeleteForDate();
    } else {
      onDelete();
    }
  };

  const formatTime = (time: string) => {
    const [hours, minutes] = time.split(':');
    const hour = parseInt(hours);
    const ampm = hour >= 12 ? 'PM' : 'AM';
    const displayHour = hour === 0 ? 12 : hour > 12 ? hour - 12 : hour;
    return `${displayHour}:${minutes} ${ampm}`;
  };

  return (
    <div
      className={`p-3 rounded-lg border transition-all ${
        slot.is_exception
          ? 'bg-yellow-50 border-yellow-200'
          : 'bg-blue-50 border-blue-200'
      } hover:shadow-sm`}
      onMouseEnter={() => setShowActions(true)}
      onMouseLeave={() => setShowActions(false)}
    >
      {isEditing ? (
        <div className="space-y-2">
          <div className="grid grid-cols-2 gap-2">
            <div>
              <label className="block text-xs font-medium text-gray-600 mb-1">
                Start Time
              </label>
              <input
                type="time"
                value={startTime}
                onChange={(e) => setStartTime(e.target.value)}
                className="w-full px-2 py-1 text-sm border border-gray-300 rounded focus:outline-none focus:ring-1 focus:ring-purple-500"
              />
            </div>
            <div>
              <label className="block text-xs font-medium text-gray-600 mb-1">
                End Time
              </label>
              <input
                type="time"
                value={endTime}
                onChange={(e) => setEndTime(e.target.value)}
                className="w-full px-2 py-1 text-sm border border-gray-300 rounded focus:outline-none focus:ring-1 focus:ring-purple-500"
              />
            </div>
          </div>
          <div className="flex space-x-1">
            <button
              onClick={handleSave}
              className="flex-1 flex items-center justify-center space-x-1 px-2 py-1 bg-green-600 text-white text-xs rounded hover:bg-green-700"
            >
              <Save className="w-3 h-3" />
              <span>Save</span>
            </button>
            <button
              onClick={handleCancel}
              className="flex-1 flex items-center justify-center space-x-1 px-2 py-1 bg-gray-500 text-white text-xs rounded hover:bg-gray-600"
            >
              <X className="w-3 h-3" />
              <span>Cancel</span>
            </button>
          </div>
        </div>
      ) : (
        <div className="space-y-1">
          <div className="flex items-center justify-between">
            <div className="text-sm font-medium text-gray-900">
              {formatTime(slot.start_time)} - {formatTime(slot.end_time)}
            </div>
            {slot.is_exception && (
              <span className="text-xs bg-yellow-100 text-yellow-800 px-2 py-1 rounded">
                Modified
              </span>
            )}
          </div>
          
          {showActions && (
            <div className="flex space-x-1 mt-2">
              <button
                onClick={() => setIsEditing(true)}
                className="flex-1 flex items-center justify-center space-x-1 px-2 py-1 bg-blue-600 text-white text-xs rounded hover:bg-blue-700"
              >
                <Edit2 className="w-3 h-3" />
                <span>Edit</span>
              </button>
              <button
                onClick={handleDelete}
                className="flex-1 flex items-center justify-center space-x-1 px-2 py-1 bg-red-600 text-white text-xs rounded hover:bg-red-700"
              >
                <Trash2 className="w-3 h-3" />
                <span>Delete</span>
              </button>
            </div>
          )}
        </div>
      )}
    </div>
  );
};
