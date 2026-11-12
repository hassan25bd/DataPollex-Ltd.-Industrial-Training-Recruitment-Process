import express from 'express';
import {
  getLectureById,
  createLecture,
  updateLecture,
  deleteLecture,
} from '../controllers/lectureController.js';
import { protect } from '../middleware/authMiddleware.js';

const router = express.Router();

router.route('/').post(protect, createLecture);

router
  .route('/:id')
  .get(getLectureById)
  .put(protect, updateLecture)
  .delete(protect, deleteLecture);

export default router;
