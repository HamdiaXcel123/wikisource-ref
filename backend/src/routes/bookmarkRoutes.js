import express from 'express';
import { protect } from '../middleware/auth.js';
import {
  getBookmarks,
  addBookmark,
  updateBookmark,
  deleteBookmark,
  checkBookmark
} from '../controllers/bookmarkController.js';

const router = express.Router();

// All routes require authentication
router.use(protect);

router.get('/', getBookmarks);
router.post('/', addBookmark);
router.put('/:id', updateBookmark);
router.delete('/:id', deleteBookmark);
router.get('/check/:submissionId', checkBookmark);

export default router;
