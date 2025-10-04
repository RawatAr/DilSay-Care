import knex from '../config/database';
import { Slot, SlotException, SlotWithExceptions, CreateSlotRequest, UpdateSlotRequest, WeekSlotsResponse } from '../types';
import { startOfWeek, endOfWeek, addDays, format, getDay } from 'date-fns';

export class SlotModel {
  async createSlot(slotData: CreateSlotRequest): Promise<Slot> {
    const [slot] = await knex('slots')
      .insert(slotData)
      .returning('*');
    return slot;
  }

  async getSlotById(id: number): Promise<Slot | null> {
    const slot = await knex('slots').where('id', id).first();
    return slot || null;
  }

  async updateSlot(id: number, updates: UpdateSlotRequest): Promise<Slot | null> {
    const [slot] = await knex('slots')
      .where('id', id)
      .update({ ...updates, updated_at: new Date() })
      .returning('*');
    return slot || null;
  }

  async deleteSlot(id: number): Promise<boolean> {
    const deleted = await knex('slots').where('id', id).del();
    return deleted > 0;
  }

  async getSlotsForWeek(startDate: Date): Promise<WeekSlotsResponse[]> {
    const endDate = addDays(startDate, 6);
    const startDateStr = format(startDate, 'yyyy-MM-dd');
    const endDateStr = format(endDate, 'yyyy-MM-dd');

    const weekSlots: WeekSlotsResponse[] = [];
    for (let i = 0; i < 7; i++) {
      const currentDate = addDays(startDate, i);
      const dayOfWeek = getDay(currentDate);
      const dateStr = format(currentDate, 'yyyy-MM-dd');
      
      const slots = await knex('slots')
        .leftJoin('slot_exceptions', function() {
          this.on('slots.id', '=', 'slot_exceptions.slot_id')
            .andOn('slot_exceptions.exception_date', '=', knex.raw('?', dateStr));
        })
        .where('slots.is_recurring', true)
        .andWhere('slots.day_of_week', dayOfWeek)
        .select(
          'slots.id',
          'slots.start_time',
          'slots.end_time',
          'slot_exceptions.start_time as exception_start_time',
          'slot_exceptions.end_time as exception_end_time'
        );

      const daySlots: Array<{
    id: number;
    start_time: string;
    end_time: string;
    is_exception: boolean;
      }> = slots.map(slot => {
        return {
            id: slot.id,
          start_time: slot.exception_start_time !== null ? slot.exception_start_time : slot.start_time,
          end_time: slot.exception_end_time !== null ? slot.exception_end_time : slot.end_time,
          is_exception: slot.exception_start_time !== null
        };
      });

      weekSlots.push({
        date: dateStr,
        day_of_week: dayOfWeek,
        slots: daySlots
      });
        }

    return weekSlots;
  }

  async createSlotException(
    slotId: number,
    exceptionDate: string,
    startTime?: string,
    endTime?: string
  ): Promise<SlotException> {
    const [exception] = await knex('slot_exceptions')
      .insert({
        slot_id: slotId,
        exception_date: exceptionDate,
        start_time: startTime || null,
        end_time: endTime || null
      })
      .returning('*');
    return exception;
  }

  async updateSlotException(
    slotId: number,
    exceptionDate: string,
    startTime?: string,
    endTime?: string
  ): Promise<SlotException | null> {
    const [exception] = await knex('slot_exceptions')
      .where({
        slot_id: slotId,
        exception_date: exceptionDate
      })
      .update({
        start_time: startTime || null,
        end_time: endTime || null,
        updated_at: new Date()
      })
      .returning('*');
    return exception || null;
  }

  async deleteSlotException(slotId: number, exceptionDate: string): Promise<boolean> {
    const deleted = await knex('slot_exceptions')
      .where({
        slot_id: slotId,
        exception_date: exceptionDate
      })
      .del();
    return deleted > 0;
  }

  async getSlotsForDate(date: string): Promise<Array<{
    id: number;
    start_time: string;
    end_time: string;
    is_exception: boolean;
  }>> {
    const dayOfWeek = getDay(new Date(date));

    const slots = await knex('slots')
      .leftJoin('slot_exceptions', function() {
        this.on('slots.id', '=', 'slot_exceptions.slot_id')
          .andOn('slot_exceptions.exception_date', '=', knex.raw('?', date));
      })
      .where('slots.is_recurring', true)
      .andWhere('slots.day_of_week', dayOfWeek)
      .select(
        'slots.id',
        'slots.start_time',
        'slots.end_time',
        'slot_exceptions.start_time as exception_start_time',
        'slot_exceptions.end_time as exception_end_time'
      );

    const result: Array<{
      id: number;
      start_time: string;
      end_time: string;
      is_exception: boolean;
    }> = slots.map(slot => ({
            id: slot.id,
      start_time: slot.exception_start_time !== null ? slot.exception_start_time : slot.start_time,
      end_time: slot.exception_end_time !== null ? slot.exception_end_time : slot.end_time,
      is_exception: slot.exception_start_time !== null,
    }));
    return result;
}
}

