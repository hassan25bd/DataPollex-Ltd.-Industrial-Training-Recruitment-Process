import express from 'express';
import {
  getCourses,
  getCourseById,
  createCourse,
  updateCourse,
  deleteCourse,
} from '../controllers/courseController.js';
import {
  getLecturesByCourse,
  createLecture,
} from '../controllers/lectureController.js';
import { protect } from '../middleware/authMiddleware.js';

const router = express.Router();

// Course CRUD routes
router.route('/').get(getCourses).post(protect, createCourse);

router
  .route('/:id')
  .get(getCourseById)
  .put(protect, updateCourse)
  .delete(protect, deleteCourse);

// Nested lecture routes under course
router
  .route('/:courseId/lectures')
  .get(getLecturesByCourse)
  .post(protect, createLecture);

export default router;
