import { Request, Response } from 'express';
import { SlotModel } from '../models/SlotModel';
import { startOfWeek, addWeeks, format, parseISO } from 'date-fns';
import Joi from 'joi';

const slotModel = new SlotModel();

const createSlotSchema = Joi.object({
  day_of_week: Joi.number().integer().min(0).max(6).required(),
  start_time: Joi.string().pattern(/^([0-1]?[0-9]|2[0-3]):[0-5][0-9]$/).required(),
  end_time: Joi.string().pattern(/^([0-1]?[0-9]|2[0-3]):[0-5][0-9]$/).required(),
  created_for_date: Joi.string().isoDate().required()
});

const updateSlotSchema = Joi.object({
  start_time: Joi.string().pattern(/^([0-1]?[0-9]|2[0-3]):[0-5][0-9]$/),
  end_time: Joi.string().pattern(/^([0-1]?[0-9]|2[0-3]):[0-5][0-9]$/)
});

export class SlotController {
  async createSlot(req: Request, res: Response) {
    try {
      const { error, value } = createSlotSchema.validate(req.body);
      if (error) {
        return res.status(400).json({ error: error.details[0].message });
      }

      // Validate that start_time is before end_time
      if (value.start_time >= value.end_time) {
        return res.status(400).json({ error: 'Start time must be before end time' });
      }

      // Check if there are already two slots for this date
      const existingSlots = await slotModel.getSlotsForDate(value.created_for_date);
      if (existingSlots && existingSlots.length >= 2) {
        return res.status(400).json({ error: 'Maximum of 2 slots allowed per date' });
      }

      const slot = await slotModel.createSlot(value);
      res.status(201).json(slot);
    } catch (error: any) {
      console.error('Error creating slot:', error);
      res.status(500).json({ error: 'Internal server error', message: error.message });
    }
  }

  async getSlotsForWeek(req: Request, res: Response) {
    try {
      const { startDate } = req.query;
      
      if (!startDate || typeof startDate !== 'string') {
        return res.status(400).json({ error: 'startDate query parameter is required' });
      }

      const parsedDate = parseISO(startDate);
      if (isNaN(parsedDate.getTime())) {
        return res.status(400).json({ error: 'Invalid startDate format. Use YYYY-MM-DD' });
      }

      const weekStart = startOfWeek(parsedDate, { weekStartsOn: 1 }); // Start week on Monday
      const weekSlots = await slotModel.getSlotsForWeek(weekStart);
      
      res.json(weekSlots);
    } catch (error: any) {
      console.error('Error fetching week slots:', error);
      res.status(500).json({ error: 'Internal server error', message: error.message });
    }
  }

  async updateSlot(req: Request, res: Response) {
    try {
      const { id } = req.params;
      const slotId = parseInt(id);

      if (isNaN(slotId)) {
        return res.status(400).json({ error: 'Invalid slot ID' });
      }

      const { error, value } = updateSlotSchema.validate(req.body);
      if (error) {
        return res.status(400).json({ error: error.details[0].message });
      }

      // Validate that start_time is before end_time if both are provided
      if (value.start_time && value.end_time && value.start_time >= value.end_time) {
        return res.status(400).json({ error: 'Start time must be before end time' });
      }

      const updatedSlot = await slotModel.updateSlot(slotId, value);
      if (!updatedSlot) {
        return res.status(404).json({ error: 'Slot not found' });
      }

      res.json(updatedSlot);
    } catch (error: any) {
      console.error('Error updating slot:', error);
      res.status(500).json({ error: 'Internal server error', message: error.message });
    }
  }

  async deleteSlot(req: Request, res: Response) {
    try {
      const { id } = req.params;
      const slotId = parseInt(id);

      if (isNaN(slotId)) {
        return res.status(400).json({ error: 'Invalid slot ID' });
      }

      const deleted = await slotModel.deleteSlot(slotId);
      if (!deleted) {
        return res.status(404).json({ error: 'Slot not found' });
      }

      res.status(204).send();
    } catch (error: any) {
      console.error('Error deleting slot:', error);
      res.status(500).json({ error: 'Internal server error', message: error.message });
    }
  }

  async updateSlotForDate(req: Request, res: Response) {
    try {
      const { id } = req.params;
      const { date } = req.body;
      const slotId = parseInt(id);

      if (isNaN(slotId)) {
        return res.status(400).json({ error: 'Invalid slot ID' });
      }

      if (!date) {
        return res.status(400).json({ error: 'Date is required' });
      }

      const { error, value } = updateSlotSchema.validate(req.body);
      if (error) {
        return res.status(400).json({ error: error.details[0].message });
      }

      // Validate that start_time is before end_time if both are provided
      if (value.start_time && value.end_time && value.start_time >= value.end_time) {
        return res.status(400).json({ error: 'Start time must be before end time' });
      }

      // Check if slot exists
      const slot = await slotModel.getSlotById(slotId);
      if (!slot) {
        return res.status(404).json({ error: 'Slot not found' });
      }

      // Create or update exception for this specific date
      const exception = await slotModel.updateSlotException(
        slotId,
        date,
        value.start_time,
        value.end_time
      );

      if (!exception) {
        // Create new exception
        const newException = await slotModel.createSlotException(
          slotId,
          date,
          value.start_time,
          value.end_time
        );
        res.json(newException);
      } else {
        res.json(exception);
      }
    } catch (error: any) {
      console.error('Error updating slot for date:', error);
      res.status(500).json({ error: 'Internal server error', message: error.message });
    }
  }

  async deleteSlotForDate(req: Request, res: Response) {
    try {
      const { id } = req.params;
      const { date } = req.body;
      const slotId = parseInt(id);

      if (isNaN(slotId)) {
        return res.status(400).json({ error: 'Invalid slot ID' });
      }

      if (!date) {
        return res.status(400).json({ error: 'Date is required' });
      }

      // Check if slot exists
      const slot = await slotModel.getSlotById(slotId);
      if (!slot) {
        return res.status(404).json({ error: 'Slot not found' });
      }

      // Create exception to delete slot for this date (null times)
      const exception = await slotModel.createSlotException(slotId, date);
      
      res.json(exception);
    } catch (error: any) {
      console.error('Error deleting slot for date:', error);
      res.status(500).json({ error: 'Internal server error', message: error.message });
    }
  }

  async getSlotsForDate(req: Request, res: Response) {
    try {
      const { date } = req.params;
      
      if (!date) {
        return res.status(400).json({ error: 'Date parameter is required' });
      }

      const parsedDate = parseISO(date);
      if (isNaN(parsedDate.getTime())) {
        return res.status(400).json({ error: 'Invalid date format. Use YYYY-MM-DD' });
      }

      const slots = await slotModel.getSlotsForDate(date);
      res.json(slots);
    } catch (error: any) {
      console.error('Error fetching slots for date:', error);
      res.status(500).json({ error: 'Internal server error', message: error.message });
    }
  }
}
