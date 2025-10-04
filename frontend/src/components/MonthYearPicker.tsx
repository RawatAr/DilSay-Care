import React, { useState } from 'react';
import { ChevronLeft, ChevronRight, X } from 'lucide-react';

interface MonthYearPickerProps {
  isOpen: boolean;
  onClose: () => void;
  currentDate: Date;
  onSelect: (date: Date) => void;
}

export const MonthYearPicker: React.FC<MonthYearPickerProps> = ({
  isOpen,
  onClose,
  currentDate,
  onSelect,
}) => {
  const [selectedYear, setSelectedYear] = useState(currentDate.getFullYear());
  const [selectedMonth, setSelectedMonth] = useState(currentDate.getMonth());

  const months = [
    'January', 'February', 'March', 'April', 'May', 'June',
    'July', 'August', 'September', 'October', 'November', 'December'
  ];

  const years = Array.from({ length: 10 }, (_, i) => selectedYear - 5 + i);

  const handleConfirm = () => {
    const newDate = new Date(selectedYear, selectedMonth, 1);
    onSelect(newDate);
    onClose();
  };

  if (!isOpen) return null;

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center">
      <div 
        className="absolute inset-0 bg-black bg-opacity-50"
        onClick={onClose}
      />
      <div className="relative bg-white rounded-2xl p-6 w-full max-w-md mx-4 shadow-xl">
        {/* Header */}
        <div className="flex items-center justify-between mb-6">
          <h3 className="text-xl font-semibold text-gray-900">
            Select Month & Year
          </h3>
          <button
            onClick={onClose}
            className="p-2 hover:bg-gray-100 rounded-lg transition-colors"
          >
            <X className="w-5 h-5 text-gray-600" />
          </button>
        </div>

        {/* Year Selector */}
        <div className="mb-6">
          <div className="flex items-center justify-between mb-3">
            <button
              onClick={() => setSelectedYear(selectedYear - 1)}
              className="p-2 hover:bg-gray-100 rounded-lg transition-colors"
            >
              <ChevronLeft className="w-5 h-5 text-gray-600" />
            </button>
            <span className="text-lg font-semibold text-gray-900">{selectedYear}</span>
            <button
              onClick={() => setSelectedYear(selectedYear + 1)}
              className="p-2 hover:bg-gray-100 rounded-lg transition-colors"
            >
              <ChevronRight className="w-5 h-5 text-gray-600" />
            </button>
          </div>
          
          <div className="grid grid-cols-5 gap-2">
            {years.map((year) => (
              <button
                key={year}
                onClick={() => setSelectedYear(year)}
                className={`py-2 px-3 rounded-lg text-sm font-medium transition-colors ${
                  year === selectedYear
                    ? 'bg-purple-600 text-white'
                    : 'bg-gray-100 text-gray-700 hover:bg-gray-200'
                }`}
              >
                {year}
              </button>
            ))}
          </div>
        </div>

        {/* Month Selector */}
        <div className="mb-6">
          <h4 className="text-sm font-medium text-gray-700 mb-3">Month</h4>
          <div className="grid grid-cols-3 gap-2">
            {months.map((month, index) => (
              <button
                key={month}
                onClick={() => setSelectedMonth(index)}
                className={`py-3 px-4 rounded-lg text-sm font-medium transition-colors ${
                  index === selectedMonth
                    ? 'bg-purple-600 text-white'
                    : 'bg-gray-100 text-gray-700 hover:bg-gray-200'
                }`}
              >
                {month.slice(0, 3)}
              </button>
            ))}
          </div>
        </div>

        {/* Actions */}
        <div className="flex space-x-3">
          <button
            onClick={onClose}
            className="flex-1 px-6 py-3 border border-gray-300 text-gray-700 rounded-xl hover:bg-gray-50 font-medium transition-colors"
          >
            Cancel
          </button>
          <button
            onClick={handleConfirm}
            className="flex-1 px-6 py-3 bg-purple-600 text-white rounded-xl hover:bg-purple-700 font-medium transition-colors"
          >
            Confirm
          </button>
        </div>
      </div>
    </div>
  );
};
