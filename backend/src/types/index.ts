export interface Slot {
  id: number;
  day_of_week: number;
  start_time: string;
  end_time: string;
  created_for_date: string;
  is_recurring: boolean;
  created_at: string;
  updated_at: string;
}

export interface SlotException {
  id: number;
  slot_id: number;
  exception_date: string;
  start_time: string | null;
  end_time: string | null;
  created_at: string;
  updated_at: string;
}

export interface SlotWithExceptions extends Slot {
  exceptions: SlotException[];
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

export interface WeekSlotsResponse {
  date: string;
  day_of_week: number;
  slots: Array<{
    id: number;
    start_time: string;
    end_time: string;
    is_exception: boolean;
  }>;
}
