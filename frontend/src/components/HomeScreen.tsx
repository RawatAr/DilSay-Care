import React from 'react';
import { Calendar, Clock, Plus, TrendingUp, Users } from 'lucide-react';

export const HomeScreen: React.FC = () => {
  const today = new Date();
  const currentHour = today.getHours();
  
  const getGreeting = () => {
    if (currentHour < 12) return 'Good Morning';
    if (currentHour < 18) return 'Good Afternoon';
    return 'Good Evening';
  };

  const getTimeOfDay = () => {
    if (currentHour < 12) return 'morning';
    if (currentHour < 18) return 'afternoon';
    return 'evening';
  };

  return (
    <div className="flex-1 overflow-y-auto bg-gray-50">
      <div className="p-4 space-y-6">
        {/* Welcome Section */}
        <div className="bg-gradient-to-r from-purple-600 to-purple-700 rounded-2xl p-6 text-white">
          <h2 className="text-2xl font-bold mb-2">{getGreeting()}!</h2>
          <p className="text-purple-100">
            Ready to manage your {getTimeOfDay()} schedule?
          </p>
        </div>

        {/* Quick Stats */}
        <div className="grid grid-cols-2 gap-4">
          <div className="bg-white rounded-xl p-4 shadow-sm">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-sm text-gray-600">Today's Slots</p>
                <p className="text-2xl font-bold text-gray-900">3</p>
              </div>
              <div className="p-3 bg-blue-100 rounded-lg">
                <Calendar className="w-6 h-6 text-blue-600" />
              </div>
            </div>
          </div>
          
          <div className="bg-white rounded-xl p-4 shadow-sm">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-sm text-gray-600">Total Hours</p>
                <p className="text-2xl font-bold text-gray-900">6h</p>
              </div>
              <div className="p-3 bg-green-100 rounded-lg">
                <Clock className="w-6 h-6 text-green-600" />
              </div>
            </div>
          </div>
        </div>

        {/* Quick Actions */}
        <div className="bg-white rounded-xl p-6 shadow-sm">
          <h3 className="text-lg font-semibold text-gray-900 mb-4">Quick Actions</h3>
          <div className="space-y-3">
            <button className="w-full flex items-center justify-between p-4 bg-purple-50 rounded-lg hover:bg-purple-100 transition-colors">
              <div className="flex items-center space-x-3">
                <div className="p-2 bg-purple-600 rounded-lg">
                  <Plus className="w-5 h-5 text-white" />
                </div>
                <div className="text-left">
                  <p className="font-medium text-gray-900">Add New Slot</p>
                  <p className="text-sm text-gray-600">Create a recurring time slot</p>
                </div>
              </div>
              <div className="text-gray-400">
                <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 5l7 7-7 7" />
                </svg>
              </div>
            </button>
            
            <button className="w-full flex items-center justify-between p-4 bg-gray-50 rounded-lg hover:bg-gray-100 transition-colors">
              <div className="flex items-center space-x-3">
                <div className="p-2 bg-gray-600 rounded-lg">
                  <Calendar className="w-5 h-5 text-white" />
                </div>
                <div className="text-left">
                  <p className="font-medium text-gray-900">View Schedule</p>
                  <p className="text-sm text-gray-600">See your weekly calendar</p>
                </div>
              </div>
              <div className="text-gray-400">
                <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 5l7 7-7 7" />
                </svg>
              </div>
            </button>
          </div>
        </div>

        {/* Today's Schedule Preview */}
        <div className="bg-white rounded-xl p-6 shadow-sm">
          <h3 className="text-lg font-semibold text-gray-900 mb-4">Today's Schedule</h3>
          <div className="space-y-3">
            <div className="flex items-center justify-between p-3 bg-blue-50 rounded-lg">
              <div className="flex items-center space-x-3">
                <div className="w-3 h-3 bg-blue-500 rounded-full"></div>
                <div>
                  <p className="font-medium text-gray-900">Morning Session</p>
                  <p className="text-sm text-gray-600">09:00 - 11:00</p>
                </div>
              </div>
              <span className="text-xs bg-blue-100 text-blue-800 px-2 py-1 rounded-full">Active</span>
            </div>
            
            <div className="flex items-center justify-between p-3 bg-gray-50 rounded-lg">
              <div className="flex items-center space-x-3">
                <div className="w-3 h-3 bg-gray-400 rounded-full"></div>
                <div>
                  <p className="font-medium text-gray-900">Afternoon Session</p>
                  <p className="text-sm text-gray-600">14:00 - 16:00</p>
                </div>
              </div>
              <span className="text-xs bg-gray-100 text-gray-600 px-2 py-1 rounded-full">Upcoming</span>
            </div>
          </div>
        </div>

        {/* Tips Section */}
        <div className="bg-gradient-to-r from-green-50 to-blue-50 rounded-xl p-6">
          <div className="flex items-start space-x-3">
            <div className="p-2 bg-green-500 rounded-lg">
              <TrendingUp className="w-5 h-5 text-white" />
            </div>
            <div>
              <h4 className="font-semibold text-gray-900 mb-1">Pro Tip</h4>
              <p className="text-sm text-gray-700">
                Create recurring slots to save time. Your schedule will automatically populate for future weeks!
              </p>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};
