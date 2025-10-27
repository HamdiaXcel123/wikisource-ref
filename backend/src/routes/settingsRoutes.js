import express from 'express';
import { protect } from '../middleware/auth.js';
import {
  getSettings,
  updateSettings,
  resetSettings
} from '../controllers/settingsController.js';

const router = express.Router();

// All routes require authentication
router.use(protect);

router.get('/', getSettings);
router.put('/', updateSettings);
router.post('/reset', resetSettings);

export default router;
