import dotenv from 'dotenv';
import mongoose from 'mongoose';
import User from '../models/User.js';
import Course from '../models/Course.js';
import Lecture from '../models/Lecture.js';

dotenv.config();

const seedData = async () => {
  try {
    await mongoose.connect(process.env.MONGODB_URI);
    console.log('MongoDB connected for seeding...');

    // Clear existing data
    await User.deleteMany();
    await Course.deleteMany();
    await Lecture.deleteMany();
    console.log('Existing data cleared.');

    // 1. Create Admin User
    const admin = await User.create({
      name: 'System Admin',
      email: 'admin@lms.com',
      password: 'admin123',
      role: 'admin',
    });
    console.log(`Admin created: ${admin.email} (password: admin123)`);

    // 2. Create Courses
    const course1 = await Course.create({
      title: 'Full-Stack Web Development with MERN',
      description:
        'Master modern full-stack web development using MongoDB, Express.js, React, and Node.js. Build scalable, real-world web applications from scratch with clean architectural practices.',
      price: 49.99,
      thumbnail:
        'https://images.unsplash.com/photo-1633356122544-f134324a6cee?w=800&auto=format&fit=crop&q=80',
    });

    const course2 = await Course.create({
      title: 'Mastering TypeScript & Modern React',
      description:
        'Take your frontend skills to the professional level with static typing, custom hooks, reusable design patterns, and clean component architecture in React.',
      price: 39.99,
      thumbnail:
        'https://images.unsplash.com/photo-1517694712202-14dd9538aa97?w=800&auto=format&fit=crop&q=80',
    });

    const course3 = await Course.create({
      title: 'Backend Engineering with Node.js & REST APIs',
      description:
        'Learn how to design robust, secure, and production-ready backend architectures. Deep dive into JWT authentication, database modeling, error handling, and performance tuning.',
      price: 59.99,
      thumbnail:
        'https://images.unsplash.com/photo-1526374965328-7f61d4dc18c5?w=800&auto=format&fit=crop&q=80',
    });

    console.log('Sample courses created.');

    // 3. Create Lectures for Course 1
    await Lecture.create([
      {
        course: course1._id,
        title: '01. Introduction to MERN Stack Architecture',
        description:
          'Overview of full-stack architecture, how client and server communicate, and setting up the development environment.',
        videoUrl: 'https://www.youtube.com/watch?v=7CqJlxBYj-M',
        order: 1,
      },
      {
        course: course1._id,
        title: '02. Express.js Server Setup & Routing',
        description:
          'Creating a Node.js project, installing Express, structuring routes, and handling incoming JSON payloads.',
        videoUrl: 'https://www.youtube.com/watch?v=-MTSQjw5DrM',
        order: 2,
      },
      {
        course: course1._id,
        title: '03. Connecting MongoDB & Data Modeling with Mongoose',
        description:
          'Configuring MongoDB connection, creating Mongoose schemas, validation rules, and CRUD operations.',
        videoUrl: 'https://www.youtube.com/watch?v=ofme2o29ngU',
        order: 3,
      },
      {
        course: course1._id,
        title: '04. Building Interactive UI with React Components',
        description:
          'Frontend setup with Vite and React, managing state with hooks, and consuming backend REST APIs.',
        videoUrl: 'https://www.youtube.com/watch?v=bMknfKXIFA8',
        order: 4,
      },
    ]);

    // 4. Create Lectures for Course 2
    await Lecture.create([
      {
        course: course2._id,
        title: '01. TypeScript Core Fundamentals',
        description:
          'Understanding basic types, interfaces, type aliases, union types, and compile-time type safety.',
        videoUrl: 'https://www.youtube.com/watch?v=BwuLxPH8IDs',
        order: 1,
      },
      {
        course: course2._id,
        title: '02. Typing React Components and Props',
        description:
          'How to type functional components, event handlers, children, and state hooks properly.',
        videoUrl: 'https://www.youtube.com/watch?v=ydkQlJhodio',
        order: 2,
      },
      {
        course: course2._id,
        title: '03. Building Custom React Hooks with Generics',
        description:
          'Extracting reusable logic into generic custom hooks with complete type inference and safety.',
        videoUrl: 'https://www.youtube.com/watch?v=1jMJdbLBy1E',
        order: 3,
      },
    ]);

    // 5. Create Lectures for Course 3
    await Lecture.create([
      {
        course: course3._id,
        title: '01. RESTful API Design Principles',
        description:
          'Best practices for HTTP methods, status codes, resource naming, and consistent response formats.',
        videoUrl: 'https://www.youtube.com/watch?v=iYM2zFP3Zn0',
        order: 1,
      },
      {
        course: course3._id,
        title: '02. Secure Authentication with JWT & Bcrypt',
        description:
          'Hashing passwords with bcrypt, generating signed JWT tokens, and protecting routes with auth middleware.',
        videoUrl: 'https://www.youtube.com/watch?v=mbsmsi7l3r4',
        order: 2,
      },
      {
        course: course3._id,
        title: '03. Containerizing Node.js Apps with Docker',
        description:
          'Writing Dockerfiles, multi-stage builds, docker-compose configuration, and environment isolation.',
        videoUrl: 'https://www.youtube.com/watch?v=9zUHg7xjIqQ',
        order: 3,
      },
    ]);

    console.log('Sample lectures created.');
    console.log('\n==============================================');
    console.log(' Database seeded successfully!');
    console.log(' Admin Credentials:');
    console.log('   Email:    admin@lms.com');
    console.log('   Password: admin123');
    console.log('==============================================\n');

    process.exit(0);
  } catch (error) {
    console.error('Seeding failed:', error);
    process.exit(1);
  }
};

seedData();
