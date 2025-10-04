import React, { useState } from 'react';
import { Toaster } from 'react-hot-toast';
import { useSlots } from './hooks/useSlots';
import { WeeklyCalendar } from './components/WeeklyCalendar';
import { CreateSlotModal } from './components/CreateSlotModal';
import { EditSlotModal } from './components/EditSlotModal';
import { HomeScreen } from './components/HomeScreen';
import { Menu, Calendar, Home } from 'lucide-react';

function App() {
  const {
    weeks,
    loading,
    loadMoreWeeks,
    navigateWeek,
    refresh,
    createSlot,
    updateSlot,
    deleteSlot,
    updateSlotForDate,
    deleteSlotForDate,
  } = useSlots();

  const [isCreateModalOpen, setIsCreateModalOpen] = useState(false);
  const [createSlotData, setCreateSlotData] = useState<{
    dayOfWeek: number;
    date: string;
  } | null>(null);
  const [isEditModalOpen, setIsEditModalOpen] = useState(false);
  const [editSlotData, setEditSlotData] = useState<{
    id: number;
    date: string;
    startTime: string;
    endTime: string;
    isException: boolean;
  } | null>(null);
  const [activeTab, setActiveTab] = useState<'home' | 'schedule'>('schedule');
  const [isMenuOpen, setIsMenuOpen] = useState(false);

  const handleCreateSlot = (dayOfWeek: number, date: string) => {
    setCreateSlotData({ dayOfWeek, date });
    setIsCreateModalOpen(true);
  };

  const handleCreateSlotSubmit = async (slotData: {
    day_of_week: number;
    start_time: string;
    end_time: string;
    created_for_date: string;
  }) => {
    await createSlot(slotData);
    setIsCreateModalOpen(false);
    setCreateSlotData(null);
  };

  const handleEditSlot = (id: number, date: string, startTime: string, endTime: string, isException: boolean) => {
    setEditSlotData({ id, date, startTime, endTime, isException });
    setIsEditModalOpen(true);
  };

  const handleEditSlotSubmit = async (updates: { start_time: string; end_time: string }) => {
    if (editSlotData) {
      if (editSlotData.isException) {
        await updateSlotForDate(editSlotData.id, editSlotData.date, updates);
      } else {
        await updateSlot(editSlotData.id, updates);
      }
    }
    setIsEditModalOpen(false);
    setEditSlotData(null);
  };

  return (
    <div className="min-h-screen bg-gray-50 flex flex-col">
      <Toaster position="top-right" />
      
      {/* Header */}
      <header className="bg-white border-b border-gray-200 px-4 py-3 sm:px-6">
        <div className="flex items-center justify-between">
          <div className="flex items-center space-x-3">
                        <button 
              onClick={() => setIsMenuOpen(!isMenuOpen)}
              className="p-2 rounded-lg hover:bg-gray-100"
            >
              <Menu className="w-5 h-5 text-gray-600" />
            </button>
            <h1 className="text-lg sm:text-xl font-semibold text-gray-900">
              Your Schedule
            </h1>
          </div>
                    <button
            onClick={refresh}
            className="px-4 py-2 bg-purple-600 text-white rounded-lg text-sm font-medium hover:bg-purple-700 transition-colors"
          >
            Refresh
          </button>
        </div>
      </header>

            {/* Sidebar Menu */}
      {isMenuOpen && (
        <div className="fixed inset-0 z-50">
          <div 
            className="absolute inset-0 bg-black bg-opacity-50"
            onClick={() => setIsMenuOpen(false)}
          />
          <div className="absolute left-0 top-0 bottom-0 w-64 bg-white shadow-xl">
            <div className="p-4">
              <div className="flex items-center justify-between mb-6">
                <h2 className="text-xl font-semibold text-gray-900">Menu</h2>
                <button
                  onClick={() => setIsMenuOpen(false)}
                  className="p-2 rounded-lg hover:bg-gray-100"
                >
                  <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12" />
                  </svg>
                </button>
              </div>
              <nav className="space-y-2">
                <button
                  onClick={() => { setActiveTab('home'); setIsMenuOpen(false); }}
                  className="w-full flex items-center space-x-3 px-4 py-3 rounded-lg hover:bg-gray-100 text-left"
                >
                  <Home className="w-5 h-5 text-gray-600" />
                  <span className="text-gray-700">Home</span>
                </button>
                <button
                  onClick={() => { setActiveTab('schedule'); setIsMenuOpen(false); }}
                  className="w-full flex items-center space-x-3 px-4 py-3 rounded-lg hover:bg-gray-100 text-left"
                >
                  <Calendar className="w-5 h-5 text-gray-600" />
                  <span className="text-gray-700">Schedule</span>
                </button>
                <button
                  onClick={() => { refresh(); setIsMenuOpen(false); }}
                  className="w-full flex items-center space-x-3 px-4 py-3 rounded-lg hover:bg-gray-100 text-left"
                >
                  <svg className="w-5 h-5 text-gray-600" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M4 4v5h.582m15.356 2A8.001 8.001 0 004.582 9m0 0H9m11 11v-5h-.581m0 0a8.003 8.003 0 01-15.357-2m15.357 2H15" />
                  </svg>
                  <span className="text-gray-700">Refresh Schedule</span>
                </button>
              </nav>
            </div>
          </div>
        </div>
      )}

      {/* Main Content */}
      <main className="flex-1 flex flex-col overflow-hidden pb-16">
        {activeTab === 'home' ? (
          <HomeScreen />
        ) : (
          <WeeklyCalendar
            weeks={weeks}
            loading={loading}
            onLoadMore={loadMoreWeeks}
            onNavigateWeek={navigateWeek}
            onCreateSlot={handleCreateSlot}
            onEditSlot={handleEditSlot}
            onUpdateSlot={updateSlot}
            onDeleteSlot={deleteSlot}
            onUpdateSlotForDate={updateSlotForDate}
            onDeleteSlotForDate={deleteSlotForDate}
            isModalOpen={isCreateModalOpen}
          />
        )}
      </main>

            {/* Bottom Navigation - Fixed */}
      <nav className="fixed bottom-0 left-0 right-0 bg-white border-t border-gray-200 px-4 py-2 z-40">
        <div className="flex items-center justify-around">
          <button
            onClick={() => setActiveTab('home')}
            className={`flex flex-col items-center py-2 px-4 rounded-lg transition-colors ${
              activeTab === 'home'
                ? 'text-purple-600 bg-purple-50'
                : 'text-gray-600 hover:text-gray-800'
            }`}
          >
            <Home className="w-5 h-5 mb-1" />
            <span className="text-xs font-medium">Home</span>
          </button>
          <div className="w-px h-8 bg-gray-200"></div>
          <button
            onClick={() => setActiveTab('schedule')}
            className={`flex flex-col items-center py-2 px-4 rounded-lg transition-colors ${
              activeTab === 'schedule'
                ? 'text-purple-600 bg-purple-50'
                : 'text-gray-600 hover:text-gray-800'
            }`}
          >
            <Calendar className="w-5 h-5 mb-1" />
            <span className="text-xs font-medium">Schedule</span>
          </button>
        </div>
      </nav>

      {/* Create Slot Modal */}
      {createSlotData && (
        <CreateSlotModal
          isOpen={isCreateModalOpen}
          onClose={() => {
            setIsCreateModalOpen(false);
            setCreateSlotData(null);
          }}
          onSubmit={handleCreateSlotSubmit}
          dayOfWeek={createSlotData.dayOfWeek}
          date={createSlotData.date}
        />
      )}

      {/* Edit Slot Modal */}
      {editSlotData && (
        <EditSlotModal
          isOpen={isEditModalOpen}
          onClose={() => {
            setIsEditModalOpen(false);
            setEditSlotData(null);
          }}
          onSubmit={handleEditSlotSubmit}
          initialStartTime={editSlotData.startTime}
          initialEndTime={editSlotData.endTime}
        />
      )}
    </div>
  );
}

export default App;
