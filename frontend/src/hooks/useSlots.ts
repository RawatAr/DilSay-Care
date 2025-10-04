import { useState, useEffect, useCallback } from 'react';
import { DaySlots, CreateSlotRequest, UpdateSlotRequest } from '../types';
import { slotApi } from '../services/api';
import { startOfWeek, addWeeks, format } from 'date-fns';
import toast from 'react-hot-toast';

export const useSlots = (initialStartDate?: Date) => {
  const [weeks, setWeeks] = useState<DaySlots[][]>([]);
  const [loading, setLoading] = useState(false);
  const [currentStartDate, setCurrentStartDate] = useState(
    initialStartDate || startOfWeek(new Date(), { weekStartsOn: 1 })
  );

  const loadWeek = useCallback(async (startDate: Date) => {
    const startDateStr = format(startDate, 'yyyy-MM-dd');
    
    try {
      setLoading(true);
      const weekData = await slotApi.getWeekSlots(startDateStr);
      return weekData;
    } catch (error) {
      console.error('Error loading week:', error);
      toast.error('Failed to load schedule data');
      return null;
    } finally {
      setLoading(false);
    }
  }, []);

  const loadInitialWeeks = useCallback(async () => {
    const initialWeeks = [];
    
    // Load current week
    const currentWeek = await loadWeek(currentStartDate);
    if (currentWeek) {
      initialWeeks.push(currentWeek);
    }
    
    // Load next 3 weeks for better UX
    for (let i = 1; i <= 3; i++) {
      const nextWeekStart = addWeeks(currentStartDate, i);
      const nextWeek = await loadWeek(nextWeekStart);
      if (nextWeek) {
        initialWeeks.push(nextWeek);
      }
    }
    
    setWeeks(initialWeeks);
  }, [currentStartDate, loadWeek]);

  const loadMoreWeeks = useCallback(async () => {
    if (weeks.length === 0) return;
    
    // Load the next week after the last loaded week
    const lastWeekStart = addWeeks(currentStartDate, weeks.length);
    const newWeek = await loadWeek(lastWeekStart);
    
    if (newWeek) {
      setWeeks(prev => [...prev, newWeek]);
    }
  }, [weeks.length, currentStartDate, loadWeek]);

  const createSlot = useCallback(async (slotData: CreateSlotRequest) => {
    try {
      await slotApi.createSlot(slotData);
      toast.success('Slot created successfully');
      
      // Reload all weeks to ensure data is fresh
      loadInitialWeeks();
    } catch (error) {
      console.error('Error creating slot:', error);
      toast.error('Failed to create slot');
    }
  }, [loadInitialWeeks]);

  const updateSlot = useCallback(async (id: number, updates: UpdateSlotRequest) => {
    try {
      await slotApi.updateSlot(id, updates);
      toast.success('Slot updated successfully');
      
      // Reload all weeks to reflect changes
      loadInitialWeeks();
    } catch (error) {
      console.error('Error updating slot:', error);
      toast.error('Failed to update slot');
    }
  }, [loadInitialWeeks]);

  const deleteSlot = useCallback(async (id: number) => {
    try {
      await slotApi.deleteSlot(id);
      toast.success('Slot deleted successfully');
      
      // Reload all weeks to reflect changes
      loadInitialWeeks();
    } catch (error) {
      console.error('Error deleting slot:', error);
      toast.error('Failed to delete slot');
    }
  }, [loadInitialWeeks]);

  const updateSlotForDate = useCallback(async (id: number, date: string, updates: UpdateSlotRequest) => {
    try {
      await slotApi.updateSlotForDate(id, date, updates);
      toast.success('Slot updated for this date');
      
      // Reload all weeks to ensure data is fresh
      loadInitialWeeks();
    } catch (error) {
      console.error('Error updating slot for date:', error);
      toast.error('Failed to update slot for this date');
    }
  }, [loadInitialWeeks]);

  const deleteSlotForDate = useCallback(async (id: number, date: string) => {
    try {
      await slotApi.deleteSlotForDate(id, date);
      toast.success('Slot deleted for this date');

      // Reload all weeks to ensure data is fresh
      loadInitialWeeks();
    } catch (error) {
      console.error('Error deleting slot for date:', error);
      toast.error('Failed to delete slot for this date');
    }
  }, [loadInitialWeeks]);

  const navigateWeek = useCallback((direction: 'prev' | 'next') => {
    setCurrentStartDate(prev => addWeeks(prev, direction === 'next' ? 1 : -1));
  }, []);

  const refresh = useCallback(async () => {
    await loadInitialWeeks();
  }, [loadInitialWeeks]);

  useEffect(() => {
    loadInitialWeeks();
  }, [loadInitialWeeks]);

  return {
    weeks,
    loading,
    currentStartDate,
    setCurrentStartDate,
    loadMoreWeeks,
    navigateWeek,
    refresh,
    createSlot,
    updateSlot,
    deleteSlot,
    updateSlotForDate,
    deleteSlotForDate,
  };
};
