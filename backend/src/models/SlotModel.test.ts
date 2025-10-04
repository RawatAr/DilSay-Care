import { SlotModel } from './SlotModel';
import knex from '../config/database';

describe('SlotModel', () => {
  let slotModel: SlotModel;

  beforeAll(() => {
    slotModel = new SlotModel();
  });

  afterEach(async () => {
    // Clean up the database after each test
    await knex('slots').del();
    await knex('slot_exceptions').del();
  });

  afterAll(async () => {
    await knex.destroy();
  });

  it('should create a slot', async () => {
    const slotData = {
      day_of_week: 1,
      start_time: '09:00',
      end_time: '10:00',
      created_for_date: '2024-01-08',
    };

    const createdSlot = await slotModel.createSlot(slotData);

    expect(createdSlot).toBeDefined();
    expect(createdSlot.day_of_week).toBe(slotData.day_of_week);
    expect(createdSlot.start_time).toBe(slotData.start_time);
    expect(createdSlot.end_time).toBe(slotData.end_time);
    expect(createdSlot.created_for_date).toBe(slotData.created_for_date);
    expect(createdSlot.is_recurring).toBe(true);
  });

  it('should get a slot by id', async () => {
    const slotData = {
      day_of_week: 2,
      start_time: '14:00',
      end_time: '16:00',
      created_for_date: '2024-01-09',
    };
    const [createdSlot] = await knex('slots').insert(slotData).returning('*');

    const retrievedSlot = await slotModel.getSlotById(createdSlot.id);

    expect(retrievedSlot).toBeDefined();
    expect(retrievedSlot?.day_of_week).toBe(slotData.day_of_week);
    expect(retrievedSlot?.start_time).toBe(slotData.start_time);
    expect(retrievedSlot?.end_time).toBe(slotData.end_time);
  });

  it('should update a slot', async () => {
    const slotData = {
      day_of_week: 3,
      start_time: '10:00',
      end_time: '12:00',
      created_for_date: '2024-01-10',
    };
    const [createdSlot] = await knex('slots').insert(slotData).returning('*');

    const updates = {
      start_time: '11:00',
      end_time: '13:00',
    };
    const updatedSlot = await slotModel.updateSlot(createdSlot.id, updates);

    expect(updatedSlot).toBeDefined();
    expect(updatedSlot?.start_time).toBe(updates.start_time);
    expect(updatedSlot?.end_time).toBe(updates.end_time);
  });

  it('should delete a slot', async () => {
    const slotData = {
      day_of_week: 4,
      start_time: '15:00',
      end_time: '17:00',
      created_for_date: '2024-01-11',
    };
    const [createdSlot] = await knex('slots').insert(slotData).returning('*');

    const deleted = await slotModel.deleteSlot(createdSlot.id);
    expect(deleted).toBe(true);

    const retrievedSlot = await slotModel.getSlotById(createdSlot.id);
    expect(retrievedSlot).toBeUndefined();
  });

  it('should get slots for week', async () => {
    const slotData1 = {
      day_of_week: 1,
      start_time: '09:00',
      end_time: '10:00',
      created_for_date: '2024-01-08',
    };
    const slotData2 = {
      day_of_week: 2,
      start_time: '14:00',
      end_time: '16:00',
      created_for_date: '2024-01-09',
    };
    await knex('slots').insert([slotData1, slotData2]);

    const startDate = new Date('2024-01-07'); // Sunday
    const weekSlots = await slotModel.getSlotsForWeek(startDate);

    expect(weekSlots).toBeDefined();
    expect(weekSlots.length).toBe(7);

    const mondaySlots = weekSlots.find(day => day.day_of_week === 1);
    expect(mondaySlots).toBeDefined();
    expect(mondaySlots?.slots.length).toBe(1);
  });

  it('should create a slot exception', async () => {
    const slotData = {
      day_of_week: 5,
      start_time: '11:00',
      end_time: '13:00',
      created_for_date: '2024-01-12',
    };
    const [createdSlot] = await knex('slots').insert(slotData).returning('*');

    const exceptionDate = '2024-01-12';
    const exception = await slotModel.createSlotException(createdSlot.id, exceptionDate, '14:00', '15:00');

    expect(exception).toBeDefined();
    expect(exception.slot_id).toBe(createdSlot.id);
    expect(exception.exception_date).toBe(exceptionDate);
    expect(exception.start_time).toBe('14:00');
    expect(exception.end_time).toBe('15:00');
  });

  it('should update a slot exception', async () => {
      const slotData = {
        day_of_week: 5,
        start_time: '11:00',
        end_time: '13:00',
        created_for_date: '2024-01-12',
      };
      const [createdSlot] = await knex('slots').insert(slotData).returning('*');

      const exceptionDate = '2024-01-12';
      await slotModel.createSlotException(createdSlot.id, exceptionDate, '14:00', '15:00');

      const updates = {
        start_time: '16:00',
        end_time: '17:00',
      };

      const updatedException = await slotModel.updateSlotException(
        createdSlot.id,
        exceptionDate,
        updates.start_time,
        updates.end_time
      );

      expect(updatedException).toBeDefined();
      expect(updatedException?.start_time).toBe(updates.start_time);
      expect(updatedException?.end_time).toBe(updates.end_time);
    });

  it('should delete a slot exception', async () => {
    const slotData = {
      day_of_week: 6,
      start_time: '16:00',
      end_time: '18:00',
      created_for_date: '2024-01-13',
    };
    const [createdSlot] = await knex('slots').insert(slotData).returning('*');

    const exceptionDate = '2024-01-13';
    await slotModel.createSlotException(createdSlot.id, exceptionDate, '14:00', '15:00');

    const deleted = await slotModel.deleteSlotException(createdSlot.id, exceptionDate);
    expect(deleted).toBe(true);

    const exception = await knex('slot_exceptions')
      .where({
        slot_id: createdSlot.id,
        exception_date: exceptionDate,
      })
      .first();
    expect(exception).toBeUndefined();
  });
});
