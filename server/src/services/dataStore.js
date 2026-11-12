import bcrypt from 'bcryptjs';

// Initial pre-seeded data for cloud serverless environments
let users = [
  {
    _id: 'admin_master_1',
    name: 'System Admin',
    email: 'admin@lms.com',
    password: '$2b$10$R8E5UMOHMxRW4d4sNYoJEeYDegF1rqPOLet6OZ4NKNNNUx1UU7Oeq', // admin123
    role: 'admin',
    createdAt: new Date().toISOString(),
    async matchPassword(entered) {
      return await bcrypt.compare(entered, this.password);
    },
  },
];

let courses = [
  {
    _id: 'course_mern_101',
    title: 'Full-Stack Web Development with MERN',
    description:
      'Master modern full-stack web development using MongoDB, Express.js, React, and Node.js. Build scalable, real-world web applications from scratch with clean architectural practices.',
    price: 49.99,
    thumbnail:
      'https://images.unsplash.com/photo-1633356122544-f134324a6cee?w=800&auto=format&fit=crop&q=80',
    createdAt: new Date(Date.now() - 3600000 * 24).toISOString(),
    updatedAt: new Date(Date.now() - 3600000 * 24).toISOString(),
  },
  {
    _id: 'course_ts_102',
    title: 'Mastering TypeScript & Modern React',
    description:
      'Take your frontend skills to the professional level with static typing, custom hooks, reusable design patterns, and clean component architecture in React.',
    price: 39.99,
    thumbnail:
      'https://images.unsplash.com/photo-1517694712202-14dd9538aa97?w=800&auto=format&fit=crop&q=80',
    createdAt: new Date(Date.now() - 3600000 * 48).toISOString(),
    updatedAt: new Date(Date.now() - 3600000 * 48).toISOString(),
  },
  {
    _id: 'course_node_103',
    title: 'Backend Engineering with Node.js & REST APIs',
    description:
      'Learn how to design robust, secure, and production-ready backend architectures. Deep dive into JWT authentication, database modeling, error handling, and performance tuning.',
    price: 59.99,
    thumbnail:
      'https://images.unsplash.com/photo-1526374965328-7f61d4dc18c5?w=800&auto=format&fit=crop&q=80',
    createdAt: new Date(Date.now() - 3600000 * 72).toISOString(),
    updatedAt: new Date(Date.now() - 3600000 * 72).toISOString(),
  },
];

let lectures = [
  {
    _id: 'lec_mern_1',
    course: 'course_mern_101',
    title: '01. Introduction to MERN Stack Architecture',
    description:
      'Overview of full-stack architecture, how client and server communicate, and setting up the development environment.',
    videoUrl: 'https://www.youtube.com/watch?v=7CqJlxBYj-M',
    order: 1,
    createdAt: new Date().toISOString(),
  },
  {
    _id: 'lec_mern_2',
    course: 'course_mern_101',
    title: '02. Express.js Server Setup & Routing',
    description:
      'Creating a Node.js project, installing Express, structuring routes, and handling incoming JSON payloads.',
    videoUrl: 'https://www.youtube.com/watch?v=-MTSQjw5DrM',
    order: 2,
    createdAt: new Date().toISOString(),
  },
  {
    _id: 'lec_mern_3',
    course: 'course_mern_101',
    title: '03. Connecting MongoDB & Data Modeling with Mongoose',
    description:
      'Configuring MongoDB connection, creating Mongoose schemas, validation rules, and CRUD operations.',
    videoUrl: 'https://www.youtube.com/watch?v=ofme2o29ngU',
    order: 3,
    createdAt: new Date().toISOString(),
  },
  {
    _id: 'lec_mern_4',
    course: 'course_mern_101',
    title: '04. Building Interactive UI with React Components',
    description:
      'Frontend setup with Vite and React, managing state with hooks, and consuming backend REST APIs.',
    videoUrl: 'https://www.youtube.com/watch?v=bMknfKXIFA8',
    order: 4,
    createdAt: new Date().toISOString(),
  },
  {
    _id: 'lec_ts_1',
    course: 'course_ts_102',
    title: '01. TypeScript Core Fundamentals',
    description:
      'Understanding basic types, interfaces, type aliases, union types, and compile-time type safety.',
    videoUrl: 'https://www.youtube.com/watch?v=BwuLxPH8IDs',
    order: 1,
    createdAt: new Date().toISOString(),
  },
  {
    _id: 'lec_ts_2',
    course: 'course_ts_102',
    title: '02. Typing React Components and Props',
    description:
      'How to type functional components, event handlers, children, and state hooks properly.',
    videoUrl: 'https://www.youtube.com/watch?v=ydkQlJhodio',
    order: 2,
    createdAt: new Date().toISOString(),
  },
  {
    _id: 'lec_ts_3',
    course: 'course_ts_102',
    title: '03. Building Custom React Hooks with Generics',
    description:
      'Extracting reusable logic into generic custom hooks with complete type inference and safety.',
    videoUrl: 'https://www.youtube.com/watch?v=1jMJdbLBy1E',
    order: 3,
    createdAt: new Date().toISOString(),
  },
  {
    _id: 'lec_node_1',
    course: 'course_node_103',
    title: '01. RESTful API Design Principles',
    description:
      'Best practices for HTTP methods, status codes, resource naming, and consistent response formats.',
    videoUrl: 'https://www.youtube.com/watch?v=iYM2zFP3Zn0',
    order: 1,
    createdAt: new Date().toISOString(),
  },
  {
    _id: 'lec_node_2',
    course: 'course_node_103',
    title: '02. Secure Authentication with JWT & Bcrypt',
    description:
      'Hashing passwords with bcrypt, generating signed JWT tokens, and protecting routes with auth middleware.',
    videoUrl: 'https://www.youtube.com/watch?v=mbsmsi7l3r4',
    order: 2,
    createdAt: new Date().toISOString(),
  },
  {
    _id: 'lec_node_3',
    course: 'course_node_103',
    title: '03. Containerizing Node.js Apps with Docker',
    description:
      'Writing Dockerfiles, multi-stage builds, docker-compose configuration, and environment isolation.',
    videoUrl: 'https://www.youtube.com/watch?v=9zUHg7xjIqQ',
    order: 3,
    createdAt: new Date().toISOString(),
  },
];

export const dataStore = {
  findUserByEmail: async (email) => {
    return users.find((u) => u.email.toLowerCase() === email.toLowerCase()) || null;
  },
  findUserById: async (id) => {
    return users.find((u) => u._id === id.toString()) || null;
  },

  findCourses: async () => {
    return courses.map((course) => {
      const count = lectures.filter((l) => l.course === course._id).length;
      return {
        ...course,
        lectureCount: count,
      };
    });
  },
  findCourseById: async (id) => {
    const course = courses.find((c) => c._id === id.toString());
    if (!course) return null;
    const courseLectures = lectures
      .filter((l) => l.course === course._id)
      .sort((a, b) => a.order - b.order);
    return {
      ...course,
      lectures: courseLectures,
    };
  },
  createCourse: async ({ title, description, price, thumbnail }) => {
    const newCourse = {
      _id: 'course_' + Date.now(),
      title,
      description,
      price: Number(price),
      thumbnail,
      createdAt: new Date().toISOString(),
      updatedAt: new Date().toISOString(),
    };
    courses.unshift(newCourse);
    return newCourse;
  },
  updateCourse: async (id, data) => {
    const course = courses.find((c) => c._id === id.toString());
    if (!course) return null;
    if (data.title !== undefined) course.title = data.title;
    if (data.description !== undefined) course.description = data.description;
    if (data.price !== undefined) course.price = Number(data.price);
    if (data.thumbnail !== undefined) course.thumbnail = data.thumbnail;
    course.updatedAt = new Date().toISOString();
    return course;
  },
  deleteCourse: async (id) => {
    const initialLen = courses.length;
    courses = courses.filter((c) => c._id !== id.toString());
    if (courses.length === initialLen) return false;
    lectures = lectures.filter((l) => l.course !== id.toString());
    return true;
  },

  findLecturesByCourse: async (courseId) => {
    return lectures
      .filter((l) => l.course === courseId.toString())
      .sort((a, b) => a.order - b.order);
  },
  findLectureById: async (id) => {
    return lectures.find((l) => l._id === id.toString()) || null;
  },
  createLecture: async ({ courseId, title, description, videoUrl, order }) => {
    const newLecture = {
      _id: 'lec_' + Date.now(),
      course: courseId.toString(),
      title,
      description: description || '',
      videoUrl,
      order: Number(order) || 1,
      createdAt: new Date().toISOString(),
      updatedAt: new Date().toISOString(),
    };
    lectures.push(newLecture);
    return newLecture;
  },
  updateLecture: async (id, data) => {
    const lecture = lectures.find((l) => l._id === id.toString());
    if (!lecture) return null;
    if (data.title !== undefined) lecture.title = data.title;
    if (data.description !== undefined) lecture.description = data.description;
    if (data.videoUrl !== undefined) lecture.videoUrl = data.videoUrl;
    if (data.order !== undefined) lecture.order = Number(data.order);
    if (data.courseId !== undefined) lecture.course = data.courseId.toString();
    lecture.updatedAt = new Date().toISOString();
    return lecture;
  },
  deleteLecture: async (id) => {
    const initialLen = lectures.length;
    lectures = lectures.filter((l) => l._id !== id.toString());
    return lectures.length < initialLen;
  },
};
