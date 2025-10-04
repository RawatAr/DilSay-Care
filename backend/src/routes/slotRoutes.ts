import { Router } from 'express';
import { SlotController } from '../controllers/SlotController';

const router = Router();
const slotController = new SlotController();

// Create a new slot
router.post('/', slotController.createSlot.bind(slotController));

// Get slots for a specific week
router.get('/week', slotController.getSlotsForWeek.bind(slotController));

// Get slots for a specific date
router.get('/date/:date', slotController.getSlotsForDate.bind(slotController));

// Update a slot (affects all recurring instances)
router.put('/:id', slotController.updateSlot.bind(slotController));

// Delete a slot (affects all recurring instances)
router.delete('/:id', slotController.deleteSlot.bind(slotController));

// Update a slot for a specific date (creates exception)
router.put('/:id/date', slotController.updateSlotForDate.bind(slotController));

// Delete a slot for a specific date (creates exception)
router.delete('/:id/date', slotController.deleteSlotForDate.bind(slotController));

export default router;
