import React, { useState, useEffect } from 'react';
import { X } from 'lucide-react';

interface EditSlotModalProps {
  isOpen: boolean;
  onClose: () => void;
  onSubmit: (updates: { start_time: string; end_time: string }) => void;
  initialStartTime: string;
  initialEndTime: string;
}

export const EditSlotModal: React.FC<EditSlotModalProps> = ({
  isOpen,
  onClose,
  onSubmit,
  initialStartTime,
  initialEndTime,
}) => {
  const [startTime, setStartTime] = useState(initialStartTime);
  const [endTime, setEndTime] = useState(initialEndTime);
  const [isSubmitting, setIsSubmitting] = useState(false);

  // Reset form when modal opens
  useEffect(() => {
    if (isOpen) {
      setStartTime(initialStartTime);
      setEndTime(initialEndTime);
      setIsSubmitting(false);
    }
  }, [isOpen, initialStartTime, initialEndTime]);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();

    if (startTime >= endTime) {
      alert('Start time must be before end time');
      return;
    }

    setIsSubmitting(true);
    try {
      await onSubmit({
        start_time: startTime,
        end_time: endTime,
      });
      onClose();
    } catch (error: any) {
      alert(error.message || 'Failed to update slot');
    } finally {
      setIsSubmitting(false);
    }
  };

  if (!isOpen) return null;

  return (
    <div className="fixed inset-0 bg-black bg-opacity-50 flex items-end justify-center z-50 sm:items-center">
      <div className="bg-white rounded-t-2xl sm:rounded-2xl p-6 w-full max-w-md mx-4 sm:mx-0">
        <div className="flex items-center justify-between mb-6">
          <h3 className="text-xl font-semibold text-gray-900">
            Edit Slot
          </h3>
          <button
            onClick={onClose}
            className="p-2 hover:bg-gray-100 rounded-lg"
          >
            <X className="w-5 h-5" />
          </button>
        </div>

        <form onSubmit={handleSubmit} className="space-y-6">
          <div className="space-y-4">
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-2">
                Start Time
              </label>
              <input
                type="time"
                value={startTime}
                onChange={(e) => setStartTime(e.target.value)}
                className="w-full px-4 py-3 border border-gray-300 rounded-xl focus:outline-none focus:ring-2 focus:ring-purple-500 focus:border-transparent text-lg"
                required
              />
            </div>
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-2">
                End Time
              </label>
              <input
                type="time"
                value={endTime}
                onChange={(e) => setEndTime(e.target.value)}
                className="w-full px-4 py-3 border border-gray-300 rounded-xl focus:outline-none focus:ring-2 focus:ring-purple-500 focus:border-transparent text-lg"
                required
              />
            </div>
          </div>

          <div className="flex space-x-3 pt-4">
            <button
              type="button"
              onClick={onClose}
              className="flex-1 px-6 py-3 border border-gray-300 text-gray-700 rounded-xl hover:bg-gray-50 font-medium"
            >
              Cancel
            </button>
            <button
              type="submit"
              disabled={isSubmitting}
              className="flex-1 px-6 py-3 bg-purple-600 text-white rounded-xl hover:bg-purple-700 disabled:opacity-50 font-medium"
            >
              {isSubmitting ? 'Updating...' : 'Update Slot'}
            </button>
          </div>
        </form>
      </div>
    </div>
  );
};