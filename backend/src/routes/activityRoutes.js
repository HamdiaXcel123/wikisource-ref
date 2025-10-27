import express from 'express';
import { protect } from '../middleware/auth.js';
import {
  getActivities,
  getCommunityActivities
} from '../controllers/activityController.js';

const router = express.Router();

router.get('/community', getCommunityActivities);

// Protected routes
router.use(protect);
router.get('/', getActivities);

export default router;
