# Simplified Learning Management System (LMS)

A full-stack Learning Management System developed for the **DataPollex Ltd. — Industrial Training Recruitment Process**.

The platform is designed with two core experiences:
1. **Student Panel (Public)**: Browse available courses, view detailed course curriculums, and stream video lectures with an embedded responsive player.
2. **Admin Dashboard (Protected)**: Secure authentication and comprehensive management (CRUD) for courses and video lectures.

---

## 🛠️ Tech Stack

- **Frontend**: React (Vite) + TypeScript + Tailwind CSS + Lucide Icons + React Router DOM
- **Backend**: Node.js + Express.js (Modular MVC Pattern)
- **Database**: MongoDB with Mongoose ODM
- **Authentication**: JWT (JSON Web Tokens) & Bcrypt password hashing
- **Tooling**: Concurrently (run full stack with a single command)

---

## ✨ Features & Functional Scope

### 1. Student Panel
- **Course Catalog**: Dynamically displays all published courses with title, thumbnail, description, price badge, and total lecture count.
- **Search & Filter**: Real-time client-side search by course title or description.
- **Course Details**: Dedicated page presenting course overview and full curriculum playlist.
- **Embedded Video Player**: Streams lectures using an embedded player supporting standard YouTube links (watch, share, shorts), Vimeo, and direct MP4 URLs.
- **Interactive Playlist**: Click any lecture in the curriculum to switch videos smoothly, with previous/next navigation buttons.

### 2. Admin Dashboard
- **Admin Authentication**: JWT-based authentication restricting all course and lecture mutation endpoints to authenticated admins.
- **Course Management (CRUD)**:
  - Create courses with title, description, price, and thumbnail URL.
  - Live thumbnail preview inside the creation/edit modal.
  - Table view of all courses with quick access to course analytics and lecture management.
  - Edit existing course metadata.
  - Delete courses with confirmation (automatically cascade-deletes all associated lectures).
- **Lecture Management (CRUD)**:
  - Filter and manage lectures by course.
  - Add lectures with title, description, video URL, and order number.
  - Edit lecture information or update video links.
  - Delete lectures with real-time updates.

---

## 🔑 Test Credentials (Evaluation)

For evaluation purposes, the database seed script generates the following default admin credentials:

| Role | Email | Password |
| :--- | :--- | :--- |
| **System Admin** | `admin@lms.com` | `admin123` |

> **Note**: An **"Auto-fill Demo"** button is also available directly on the Admin Login page (`/admin/login`) for convenience during evaluation.

---

## 🚀 Quick Start & Local Setup Instructions

### Prerequisites
- [Node.js](https://nodejs.org/) (v18 or higher recommended)
- [MongoDB](https://www.mongodb.com/) installed and running locally on port `27017` (or a MongoDB Atlas connection string)

### 1. Clone the Repository
```bash
git clone https://github.com/hassan25bd/DataPollex-Ltd.-Industrial-Training-Recruitment-Process.git
cd DataPollex-Ltd.-Industrial-Training-Recruitment-Process
```

### 2. Install Dependencies
Run the root script to install dependencies for both the server and client in one step:
```bash
npm run install:all
```
*(Alternatively, run `npm install` inside both the `/server` and `/client` directories separately).*

### 3. Environment Configuration
The backend environment file is located at `server/.env`. A template is provided at `server/.env.example`:
```env
PORT=5000
MONGODB_URI=mongodb://127.0.0.1:27017/lms_db
JWT_SECRET=supersecret_lms_jwt_key_2026
CLIENT_URL=http://localhost:5173
```
*If you are using MongoDB Atlas, replace `MONGODB_URI` with your connection string.*

### 4. Seed the Database
Populate the database with the initial admin account and realistic sample courses and lectures:
```bash
npm run seed
```

### 5. Start Development Server
Launch both the backend API and frontend application concurrently:
```bash
npm run dev
```

- **Frontend Application**: [http://localhost:5173](http://localhost:5173)
- **Backend API Server**: [http://localhost:5000](http://localhost:5000)
- **Health Check**: [http://localhost:5000/api/health](http://localhost:5000/api/health)

---

## 📂 Project Architecture

The project strictly follows standard separation of concerns and MVC architecture:

```text
├── client/                      # React Frontend (Vite + TypeScript)
│   ├── src/
│   │   ├── components/
│   │   │   ├── common/          # Reusable UI: VideoPlayer, Modal, EmptyState, LoadingSpinner
│   │   │   └── layout/          # Navbar, Footer, ProtectedRoute
│   │   ├── context/             # AuthContext (JWT auth state & methods)
│   │   ├── pages/
│   │   │   ├── admin/           # AdminLoginPage, AdminDashboardPage
│   │   │   └── student/         # CourseListPage, CourseDetailPage
│   │   ├── services/            # API client layer (Fetch wrapper with Bearer token)
│   │   ├── types/               # TypeScript interfaces (Course, Lecture, User, ApiResponse)
│   │   ├── App.tsx              # Application Routing
│   │   └── main.tsx             # Entry Point
│   └── vite.config.ts           # Vite + Tailwind plugin and backend proxy
│
├── server/                      # Node.js + Express Backend (MVC)
│   ├── src/
│   │   ├── config/              # Database connection (Mongoose)
│   │   ├── controllers/         # Business logic (auth, courses, lectures)
│   │   ├── middleware/          # JWT protect middleware, centralized error handling
│   │   ├── models/              # Mongoose schemas (User, Course, Lecture)
│   │   ├── routes/              # Express API route declarations
│   │   ├── scripts/             # Database seed script (seed.js)
│   │   ├── app.js               # Express application configuration
│   │   └── server.js            # Server entry point
│   ├── .env.example             # Sample environment variables
│   └── package.json
│
├── package.json                 # Root script runner (concurrently)
└── README.md                    # Project documentation
```

---

## 📡 API Endpoints Reference

### Authentication
| Method | Endpoint | Access | Description |
| :--- | :--- | :--- | :--- |
| `POST` | `/api/auth/login` | Public | Admin login, returns signed JWT token |
| `GET` | `/api/auth/me` | Private (Admin) | Returns currently authenticated admin info |

### Courses
| Method | Endpoint | Access | Description |
| :--- | :--- | :--- | :--- |
| `GET` | `/api/courses` | Public | Get all courses with lecture counts |
| `GET` | `/api/courses/:id` | Public | Get single course and its associated lectures |
| `POST` | `/api/courses` | Private (Admin) | Create a new course |
| `PUT` | `/api/courses/:id` | Private (Admin) | Update an existing course |
| `DELETE` | `/api/courses/:id` | Private (Admin) | Delete a course and all its lectures |

### Lectures
| Method | Endpoint | Access | Description |
| :--- | :--- | :--- | :--- |
| `GET` | `/api/courses/:courseId/lectures` | Public | Get all lectures for a specific course |
| `GET` | `/api/lectures/:id` | Public | Get single lecture by ID |
| `POST` | `/api/lectures` | Private (Admin) | Add a lecture to a course |
| `PUT` | `/api/lectures/:id` | Private (Admin) | Update an existing lecture |
| `DELETE` | `/api/lectures/:id` | Private (Admin) | Delete a lecture |

---

## 🛡️ Input Validation & Error Handling

- **Mongoose Validation**: Required fields, minimum length constraints, price ranges (`min: 0`), and URL checks.
- **Cascade Deletions**: Removing a course automatically purges orphaned lectures.
- **Centralized Error Middleware**: Formats CastErrors, validation errors, and duplicate key issues into standard JSON responses (`{ success: false, message: "..." }`).
- **Frontend States**: Explicit loading skeletons, empty state illustrations, error alerts with retry buttons, and delete confirmation dialogs.

---

## 📄 License
This project is submitted for the DataPollex Ltd. Industrial Training Assessment. All rights reserved.
