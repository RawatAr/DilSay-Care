import axios from 'axios';
import { DaySlots, CreateSlotRequest, UpdateSlotRequest } from '../types';

const API_BASE_URL = import.meta.env.VITE_API_URL || 'http://localhost:3001/api';

const api = axios.create({
  baseURL: API_BASE_URL,
  headers: {
    'Content-Type': 'application/json',
  },
});

export const slotApi = {
  // Get slots for a specific week
  getWeekSlots: async (startDate: string): Promise<DaySlots[]> => {
    try {
    const response = await api.get(`/slots/week?startDate=${startDate}`);
    return response.data;
    } catch (error: any) {
      throw new Error(error.response?.data?.message || 'Failed to fetch week slots');
    }
  },

  // Get slots for a specific date
  getDateSlots: async (date: string): Promise<DaySlots> => {
    try {
    const response = await api.get(`/slots/date/${date}`);
    return response.data;
    } catch (error: any) {
      throw new Error(error.response?.data?.message || 'Failed to fetch date slots');
    }
  },

  // Create a new slot
  createSlot: async (slotData: CreateSlotRequest) => {
    try {
    const response = await api.post('/slots', slotData);
    return response.data;
    } catch (error: any) {
      throw new Error(error.response?.data?.message || 'Failed to create slot');
    }
  },

  // Update a slot (affects all recurring instances)
  updateSlot: async (id: number, updates: UpdateSlotRequest) => {
    try {
    const response = await api.put(`/slots/${id}`, updates);
    return response.data;
    } catch (error: any) {
      throw new Error(error.response?.data?.message || 'Failed to update slot');
    }
  },

  // Delete a slot (affects all recurring instances)
  deleteSlot: async (id: number) => {
    try {
    await api.delete(`/slots/${id}`);
    } catch (error: any) {
      throw new Error(error.response?.data?.message || 'Failed to delete slot');
    }
  },

  // Update a slot for a specific date (creates exception)
  updateSlotForDate: async (id: number, date: string, updates: UpdateSlotRequest) => {
    try {
    const response = await api.put(`/slots/${id}/date`, { date, ...updates });
    return response.data;
    } catch (error: any) {
      throw new Error(error.response?.data?.message || 'Failed to update slot for date');
    }
  },

  // Delete a slot for a specific date (creates exception)
  deleteSlotForDate: async (id: number, date: string) => {
    try {
    const response = await api.delete(`/slots/${id}/date`, { data: { date } });
    return response.data;
    } catch (error: any) {
      throw new Error(error.response?.data?.message || 'Failed to delete slot for date');
    }
  },
};

export default api;

