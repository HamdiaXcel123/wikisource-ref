import express from 'express';
import { protect } from '../middleware/auth.js';
import {
  getDashboardStats,
  getSubmissionTrends,
  getCategoryDistribution,
  getCountryStats,
  getUserPerformance
} from '../controllers/analyticsController.js';

const router = express.Router();

// All routes require authentication
router.use(protect);

router.get('/dashboard', getDashboardStats);
router.get('/trends', getSubmissionTrends);
router.get('/categories', getCategoryDistribution);
router.get('/countries', getCountryStats);
router.get('/performance/:userId?', getUserPerformance);

export default router;
