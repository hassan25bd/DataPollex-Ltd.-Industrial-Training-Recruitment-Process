import Lecture from '../models/Lecture.js';
import Course from '../models/Course.js';
import { isDbConnected } from '../config/db.js';
import { dataStore } from '../services/dataStore.js';

// @desc    Get lectures for a specific course
// @route   GET /api/courses/:courseId/lectures
// @access  Public
export const getLecturesByCourse = async (req, res, next) => {
  try {
    const { courseId } = req.params;

    if (isDbConnected()) {
      try {
        const course = await Course.findById(courseId);
        if (course) {
          const lectures = await Lecture.find({ course: courseId }).sort({ order: 1, createdAt: 1 });
          return res.json({
            success: true,
            count: lectures.length,
            data: lectures,
          });
        }
      } catch (err) {
        console.warn('Database getLecturesByCourse fallback to cloud data store:', err.message);
      }
    }

    const lectures = await dataStore.findLecturesByCourse(courseId);
    res.json({
      success: true,
      count: lectures.length,
      data: lectures,
    });
  } catch (error) {
    next(error);
  }
};

// @desc    Get single lecture by ID
// @route   GET /api/lectures/:id
// @access  Public
export const getLectureById = async (req, res, next) => {
  try {
    if (isDbConnected()) {
      try {
        const lecture = await Lecture.findById(req.params.id).populate('course', 'title');
        if (lecture) {
          return res.json({
            success: true,
            data: lecture,
          });
        }
      } catch (err) {
        console.warn('Database getLectureById fallback to cloud data store:', err.message);
      }
    }

    const lecture = await dataStore.findLectureById(req.params.id);
    if (!lecture) {
      return res.status(404).json({
        success: false,
        message: 'Lecture not found',
      });
    }

    res.json({
      success: true,
      data: lecture,
    });
  } catch (error) {
    next(error);
  }
};

// @desc    Create new lecture for a course
// @route   POST /api/courses/:courseId/lectures (or POST /api/lectures)
// @access  Private (Admin)
export const createLecture = async (req, res, next) => {
  try {
    const courseId = req.params.courseId || req.body.courseId || req.body.course;
    const { title, description, videoUrl, order } = req.body;

    if (!courseId) {
      return res.status(400).json({
        success: false,
        message: 'Course ID is required',
      });
    }

    if (!title || !videoUrl) {
      return res.status(400).json({
        success: false,
        message: 'Please provide lecture title and video URL',
      });
    }

    if (isDbConnected()) {
      try {
        const course = await Course.findById(courseId);
        if (course) {
          let lectureOrder = order;
          if (lectureOrder === undefined) {
            const highestOrderLecture = await Lecture.findOne({ course: courseId }).sort({ order: -1 });
            lectureOrder = highestOrderLecture ? highestOrderLecture.order + 1 : 1;
          }

          const lecture = await Lecture.create({
            course: courseId,
            title,
            description: description || '',
            videoUrl,
            order: lectureOrder,
          });

          return res.status(201).json({
            success: true,
            message: 'Lecture created successfully',
            data: lecture,
          });
        }
      } catch (err) {
        console.warn('Database createLecture fallback to cloud data store:', err.message);
      }
    }

    const lecture = await dataStore.createLecture({
      courseId,
      title,
      description,
      videoUrl,
      order,
    });

    res.status(201).json({
      success: true,
      message: 'Lecture created successfully',
      data: lecture,
    });
  } catch (error) {
    next(error);
  }
};

// @desc    Update lecture
// @route   PUT /api/lectures/:id
// @access  Private (Admin)
export const updateLecture = async (req, res, next) => {
  try {
    const { title, description, videoUrl, order, courseId } = req.body;

    if (isDbConnected()) {
      try {
        const lecture = await Lecture.findById(req.params.id);
        if (lecture) {
          if (title !== undefined) lecture.title = title;
          if (description !== undefined) lecture.description = description;
          if (videoUrl !== undefined) lecture.videoUrl = videoUrl;
          if (order !== undefined) lecture.order = Number(order);
          if (courseId !== undefined) lecture.course = courseId;

          const updatedLecture = await lecture.save();
          return res.json({
            success: true,
            message: 'Lecture updated successfully',
            data: updatedLecture,
          });
        }
      } catch (err) {
        console.warn('Database updateLecture fallback to cloud data store:', err.message);
      }
    }

    const updated = await dataStore.updateLecture(req.params.id, {
      title,
      description,
      videoUrl,
      order,
      courseId,
    });

    if (!updated) {
      return res.status(404).json({
        success: false,
        message: 'Lecture not found',
      });
    }

    res.json({
      success: true,
      message: 'Lecture updated successfully',
      data: updated,
    });
  } catch (error) {
    next(error);
  }
};

// @desc    Delete lecture
// @route   DELETE /api/lectures/:id
// @access  Private (Admin)
export const deleteLecture = async (req, res, next) => {
  try {
    if (isDbConnected()) {
      try {
        const lecture = await Lecture.findById(req.params.id);
        if (lecture) {
          await lecture.deleteOne();
          return res.json({
            success: true,
            message: 'Lecture deleted successfully',
          });
        }
      } catch (err) {
        console.warn('Database deleteLecture fallback to cloud data store:', err.message);
      }
    }

    const deleted = await dataStore.deleteLecture(req.params.id);
    if (!deleted) {
      return res.status(404).json({
        success: false,
        message: 'Lecture not found',
      });
    }

    res.json({
      success: true,
      message: 'Lecture deleted successfully',
    });
  } catch (error) {
    next(error);
  }
};
