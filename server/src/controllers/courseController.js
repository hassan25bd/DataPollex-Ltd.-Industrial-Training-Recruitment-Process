import Course from '../models/Course.js';
import Lecture from '../models/Lecture.js';
import { isDbConnected } from '../config/db.js';
import { dataStore } from '../services/dataStore.js';

// @desc    Get all courses
// @route   GET /api/courses
// @access  Public
export const getCourses = async (req, res, next) => {
  try {
    if (isDbConnected()) {
      try {
        const courses = await Course.find().sort({ createdAt: -1 });

        const coursesWithCount = await Promise.all(
          courses.map(async (course) => {
            const count = await Lecture.countDocuments({ course: course._id });
            return {
              ...course.toObject(),
              lectureCount: count,
            };
          })
        );

        return res.json({
          success: true,
          count: coursesWithCount.length,
          data: coursesWithCount,
        });
      } catch (err) {
        console.warn('Database query fallback to cloud data store:', err.message);
      }
    }

    // Fallback data store for Vercel cloud serverless
    const courses = await dataStore.findCourses();
    res.json({
      success: true,
      count: courses.length,
      data: courses,
    });
  } catch (error) {
    next(error);
  }
};

// @desc    Get single course with its lectures
// @route   GET /api/courses/:id
// @access  Public
export const getCourseById = async (req, res, next) => {
  try {
    if (isDbConnected()) {
      try {
        const course = await Course.findById(req.params.id);

        if (course) {
          const lectures = await Lecture.find({ course: course._id }).sort({ order: 1, createdAt: 1 });
          return res.json({
            success: true,
            data: {
              ...course.toObject(),
              lectures,
            },
          });
        }
      } catch (err) {
        console.warn('Database findById fallback to cloud data store:', err.message);
      }
    }

    const course = await dataStore.findCourseById(req.params.id);
    if (!course) {
      return res.status(404).json({
        success: false,
        message: 'Course not found',
      });
    }

    res.json({
      success: true,
      data: course,
    });
  } catch (error) {
    next(error);
  }
};

// @desc    Create new course
// @route   POST /api/courses
// @access  Private (Admin)
export const createCourse = async (req, res, next) => {
  try {
    const { title, description, price, thumbnail } = req.body;

    if (!title || !description || price === undefined || !thumbnail) {
      return res.status(400).json({
        success: false,
        message: 'Please provide title, description, price, and thumbnail URL',
      });
    }

    if (isDbConnected()) {
      try {
        const course = await Course.create({
          title,
          description,
          price: Number(price),
          thumbnail,
        });

        return res.status(201).json({
          success: true,
          message: 'Course created successfully',
          data: course,
        });
      } catch (err) {
        console.warn('Database createCourse fallback to cloud data store:', err.message);
      }
    }

    const course = await dataStore.createCourse({
      title,
      description,
      price: Number(price),
      thumbnail,
    });

    res.status(201).json({
      success: true,
      message: 'Course created successfully',
      data: course,
    });
  } catch (error) {
    next(error);
  }
};

// @desc    Update course
// @route   PUT /api/courses/:id
// @access  Private (Admin)
export const updateCourse = async (req, res, next) => {
  try {
    const { title, description, price, thumbnail } = req.body;

    if (isDbConnected()) {
      try {
        const course = await Course.findById(req.params.id);
        if (course) {
          if (title !== undefined) course.title = title;
          if (description !== undefined) course.description = description;
          if (price !== undefined) course.price = Number(price);
          if (thumbnail !== undefined) course.thumbnail = thumbnail;

          const updatedCourse = await course.save();
          return res.json({
            success: true,
            message: 'Course updated successfully',
            data: updatedCourse,
          });
        }
      } catch (err) {
        console.warn('Database updateCourse fallback to cloud data store:', err.message);
      }
    }

    const updated = await dataStore.updateCourse(req.params.id, {
      title,
      description,
      price,
      thumbnail,
    });

    if (!updated) {
      return res.status(404).json({
        success: false,
        message: 'Course not found',
      });
    }

    res.json({
      success: true,
      message: 'Course updated successfully',
      data: updated,
    });
  } catch (error) {
    next(error);
  }
};

// @desc    Delete course and its associated lectures
// @route   DELETE /api/courses/:id
// @access  Private (Admin)
export const deleteCourse = async (req, res, next) => {
  try {
    if (isDbConnected()) {
      try {
        const course = await Course.findById(req.params.id);
        if (course) {
          await Lecture.deleteMany({ course: course._id });
          await course.deleteOne();

          return res.json({
            success: true,
            message: 'Course and associated lectures deleted successfully',
          });
        }
      } catch (err) {
        console.warn('Database deleteCourse fallback to cloud data store:', err.message);
      }
    }

    const deleted = await dataStore.deleteCourse(req.params.id);
    if (!deleted) {
      return res.status(404).json({
        success: false,
        message: 'Course not found',
      });
    }

    res.json({
      success: true,
      message: 'Course and associated lectures deleted successfully',
    });
  } catch (error) {
    next(error);
  }
};
