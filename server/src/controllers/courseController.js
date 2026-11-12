import Course from '../models/Course.js';
import Lecture from '../models/Lecture.js';

// @desc    Get all courses
// @route   GET /api/courses
// @access  Public
export const getCourses = async (req, res, next) => {
  try {
    const courses = await Course.find().sort({ createdAt: -1 });

    // Attach lecture counts to each course
    const coursesWithCount = await Promise.all(
      courses.map(async (course) => {
        const count = await Lecture.countDocuments({ course: course._id });
        return {
          ...course.toObject(),
          lectureCount: count,
        };
      })
    );

    res.json({
      success: true,
      count: coursesWithCount.length,
      data: coursesWithCount,
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
    const course = await Course.findById(req.params.id);

    if (!course) {
      return res.status(404).json({
        success: false,
        message: 'Course not found',
      });
    }

    const lectures = await Lecture.find({ course: course._id }).sort({ order: 1, createdAt: 1 });

    res.json({
      success: true,
      data: {
        ...course.toObject(),
        lectures,
      },
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

    const course = await Course.create({
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
    const course = await Course.findById(req.params.id);

    if (!course) {
      return res.status(404).json({
        success: false,
        message: 'Course not found',
      });
    }

    const { title, description, price, thumbnail } = req.body;

    if (title !== undefined) course.title = title;
    if (description !== undefined) course.description = description;
    if (price !== undefined) course.price = Number(price);
    if (thumbnail !== undefined) course.thumbnail = thumbnail;

    const updatedCourse = await course.save();

    res.json({
      success: true,
      message: 'Course updated successfully',
      data: updatedCourse,
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
    const course = await Course.findById(req.params.id);

    if (!course) {
      return res.status(404).json({
        success: false,
        message: 'Course not found',
      });
    }

    // Cascade delete lectures associated with this course
    await Lecture.deleteMany({ course: course._id });
    await course.deleteOne();

    res.json({
      success: true,
      message: 'Course and associated lectures deleted successfully',
    });
  } catch (error) {
    next(error);
  }
};
