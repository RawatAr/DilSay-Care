export interface Slot {
  id: number;
  start_time: string;
  end_time: string;
  is_exception: boolean;
}

export interface DaySlots {
  date: string;
  day_of_week: number;
  slots: Slot[];
}

export interface CreateSlotRequest {
  day_of_week: number;
  start_time: string;
  end_time: string;
  created_for_date: string;
}

export interface UpdateSlotRequest {
  start_time?: string;
  end_time?: string;
}

export interface WeekData {
  startDate: Date;
  endDate: Date;
  days: DaySlots[];
}
