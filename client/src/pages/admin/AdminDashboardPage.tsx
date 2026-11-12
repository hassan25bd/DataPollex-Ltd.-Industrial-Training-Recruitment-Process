import React, { useState, useEffect } from 'react';
import { useAuth } from '../../context/AuthContext';
import { courseApi, lectureApi } from '../../services/api';
import type { Course, Lecture } from '../../types';
import { Modal } from '../../components/common/Modal';
import { LoadingSpinner } from '../../components/common/LoadingSpinner';
import { EmptyState } from '../../components/common/EmptyState';
import {
  BookOpen,
  Film,
  Plus,
  Pencil,
  Trash2,
  ExternalLink,
  AlertTriangle,
  CheckCircle2,
  XCircle,
  Eye,
} from 'lucide-react';

export const AdminDashboardPage: React.FC = () => {
  const { admin } = useAuth();

  // Active Tab: 'courses' or 'lectures'
  const [activeTab, setActiveTab] = useState<'courses' | 'lectures'>('courses');

  // Data State
  const [courses, setCourses] = useState<Course[]>([]);
  const [lectures, setLectures] = useState<Lecture[]>([]);
  const [selectedCourseId, setSelectedCourseId] = useState<string>('');
  const [loading, setLoading] = useState<boolean>(true);
  const [toastMessage, setToastMessage] = useState<{ type: 'success' | 'error'; text: string } | null>(null);

  // Course Modal State
  const [isCourseModalOpen, setIsCourseModalOpen] = useState<boolean>(false);
  const [editingCourse, setEditingCourse] = useState<Course | null>(null);
  const [courseFormData, setCourseFormData] = useState({
    title: '',
    description: '',
    price: '',
    thumbnail: '',
  });

  // Lecture Modal State
  const [isLectureModalOpen, setIsLectureModalOpen] = useState<boolean>(false);
  const [editingLecture, setEditingLecture] = useState<Lecture | null>(null);
  const [lectureFormData, setLectureFormData] = useState({
    courseId: '',
    title: '',
    description: '',
    videoUrl: '',
    order: 1,
  });

  // Delete Modal State
  const [deleteConfirm, setDeleteConfirm] = useState<{
    isOpen: boolean;
    type: 'course' | 'lecture';
    id: string;
    title: string;
  }>({
    isOpen: false,
    type: 'course',
    id: '',
    title: '',
  });

  const [formSubmitting, setFormSubmitting] = useState<boolean>(false);

  // Show Toast Helper
  const showToast = (type: 'success' | 'error', text: string) => {
    setToastMessage({ type, text });
    setTimeout(() => {
      setToastMessage(null);
    }, 4000);
  };

  // Fetch all courses
  const fetchCourses = async () => {
    try {
      const res = await courseApi.getAll();
      const courseList = res.data || [];
      setCourses(courseList);

      // Default selected course for lecture view if none selected
      if (!selectedCourseId && courseList.length > 0) {
        setSelectedCourseId(courseList[0]._id);
      }
    } catch (err) {
      showToast('error', err instanceof Error ? err.message : 'Failed to fetch courses');
    }
  };

  // Fetch lectures for selected course
  const fetchLecturesForCourse = async (courseId: string) => {
    if (!courseId) {
      setLectures([]);
      return;
    }
    try {
      const res = await lectureApi.getByCourse(courseId);
      setLectures(res.data || []);
    } catch (err) {
      showToast('error', err instanceof Error ? err.message : 'Failed to fetch lectures');
    }
  };

  // Initial load
  useEffect(() => {
    const init = async () => {
      setLoading(true);
      await fetchCourses();
      setLoading(false);
    };
    init();
  }, []);

  // When selectedCourseId changes, fetch its lectures
  useEffect(() => {
    if (selectedCourseId) {
      fetchLecturesForCourse(selectedCourseId);
    }
  }, [selectedCourseId]);

  // Total lectures count across all courses
  const totalLecturesCount = courses.reduce((acc, c) => acc + (c.lectureCount || 0), 0);

  // ==========================================
  // COURSE MODAL HANDLERS
  // ==========================================
  const handleOpenCreateCourse = () => {
    setEditingCourse(null);
    setCourseFormData({
      title: '',
      description: '',
      price: '29.99',
      thumbnail: 'https://images.unsplash.com/photo-1516321318423-f06f85e504b3?w=800&auto=format&fit=crop&q=80',
    });
    setIsCourseModalOpen(true);
  };

  const handleOpenEditCourse = (course: Course) => {
    setEditingCourse(course);
    setCourseFormData({
      title: course.title,
      description: course.description,
      price: course.price.toString(),
      thumbnail: course.thumbnail,
    });
    setIsCourseModalOpen(true);
  };

  const handleSaveCourse = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!courseFormData.title || !courseFormData.description || !courseFormData.thumbnail) {
      showToast('error', 'Please fill in all required course fields');
      return;
    }

    try {
      setFormSubmitting(true);
      const payload = {
        title: courseFormData.title.trim(),
        description: courseFormData.description.trim(),
        price: parseFloat(courseFormData.price) || 0,
        thumbnail: courseFormData.thumbnail.trim(),
      };

      if (editingCourse) {
        await courseApi.update(editingCourse._id, payload);
        showToast('success', 'Course updated successfully');
      } else {
        await courseApi.create(payload);
        showToast('success', 'New course created successfully');
      }

      setIsCourseModalOpen(false);
      await fetchCourses();
    } catch (err) {
      showToast('error', err instanceof Error ? err.message : 'Error saving course');
    } finally {
      setFormSubmitting(false);
    }
  };

  // ==========================================
  // LECTURE MODAL HANDLERS
  // ==========================================
  const handleOpenCreateLecture = (courseId?: string) => {
    setEditingLecture(null);
    const targetCourse = courseId || selectedCourseId || (courses[0]?._id ?? '');
    setLectureFormData({
      courseId: targetCourse,
      title: '',
      description: '',
      videoUrl: 'https://www.youtube.com/watch?v=7CqJlxBYj-M',
      order: lectures.length + 1,
    });
    setIsLectureModalOpen(true);
  };

  const handleOpenEditLecture = (lecture: Lecture) => {
    setEditingLecture(lecture);
    const courseId =
      typeof lecture.course === 'string' ? lecture.course : lecture.course._id;
    setLectureFormData({
      courseId,
      title: lecture.title,
      description: lecture.description || '',
      videoUrl: lecture.videoUrl,
      order: lecture.order || 1,
    });
    setIsLectureModalOpen(true);
  };

  const handleSaveLecture = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!lectureFormData.courseId || !lectureFormData.title || !lectureFormData.videoUrl) {
      showToast('error', 'Please provide course, title, and video URL');
      return;
    }

    try {
      setFormSubmitting(true);
      const payload = {
        courseId: lectureFormData.courseId,
        title: lectureFormData.title.trim(),
        description: lectureFormData.description.trim(),
        videoUrl: lectureFormData.videoUrl.trim(),
        order: Number(lectureFormData.order) || 1,
      };

      if (editingLecture) {
        await lectureApi.update(editingLecture._id, payload);
        showToast('success', 'Lecture updated successfully');
      } else {
        await lectureApi.create(payload);
        showToast('success', 'Lecture added to course successfully');
      }

      setIsLectureModalOpen(false);
      await fetchCourses();
      if (selectedCourseId) {
        await fetchLecturesForCourse(selectedCourseId);
      }
    } catch (err) {
      showToast('error', err instanceof Error ? err.message : 'Error saving lecture');
    } finally {
      setFormSubmitting(false);
    }
  };

  // ==========================================
  // DELETE HANDLERS
  // ==========================================
  const handleConfirmDelete = async () => {
    try {
      setFormSubmitting(true);
      if (deleteConfirm.type === 'course') {
        await courseApi.delete(deleteConfirm.id);
        showToast('success', 'Course and associated lectures deleted');
        await fetchCourses();
        if (selectedCourseId === deleteConfirm.id) {
          const remaining = courses.filter((c) => c._id !== deleteConfirm.id);
          setSelectedCourseId(remaining[0]?._id || '');
        }
      } else {
        await lectureApi.delete(deleteConfirm.id);
        showToast('success', 'Lecture deleted successfully');
        await fetchCourses();
        if (selectedCourseId) {
          await fetchLecturesForCourse(selectedCourseId);
        }
      }
      setDeleteConfirm({ isOpen: false, type: 'course', id: '', title: '' });
    } catch (err) {
      showToast('error', err instanceof Error ? err.message : 'Deletion failed');
    } finally {
      setFormSubmitting(false);
    }
  };

  return (
    <div className="flex-1 pb-16">
      {/* Toast Notification Banner */}
      {toastMessage && (
        <div
          className={`fixed bottom-6 right-6 z-50 flex items-center gap-2 px-4 py-3 rounded-2xl shadow-xl text-sm font-semibold transition-all duration-300 ${
            toastMessage.type === 'success'
              ? 'bg-emerald-600 text-white shadow-emerald-900/20'
              : 'bg-rose-600 text-white shadow-rose-900/20'
          }`}
        >
          {toastMessage.type === 'success' ? (
            <CheckCircle2 className="w-5 h-5 shrink-0" />
          ) : (
            <XCircle className="w-5 h-5 shrink-0" />
          )}
          <span>{toastMessage.text}</span>
        </div>
      )}

      {/* Admin Dashboard Header */}
      <section className="bg-slate-900 text-white py-10 px-4 sm:px-6 lg:px-8 border-b border-slate-800">
        <div className="max-w-7xl mx-auto flex flex-col md:flex-row md:items-center justify-between gap-6">
          <div>
            <div className="flex items-center gap-2 text-indigo-400 text-xs font-bold uppercase tracking-wider mb-2">
              <span className="w-2 h-2 rounded-full bg-emerald-400 animate-pulse" />
              <span>Admin Management Dashboard</span>
            </div>
            <h1 className="text-2xl sm:text-3xl font-extrabold tracking-tight">
              Course & Lecture Management
            </h1>
            <p className="text-sm text-slate-400 mt-1">
              Logged in as <span className="text-slate-200 font-semibold">{admin?.name}</span> ({admin?.email})
            </p>
          </div>

          {/* Quick Metrics Bar */}
          <div className="flex items-center gap-3">
            <div className="bg-slate-800/80 border border-slate-700/80 px-4 py-2.5 rounded-2xl flex items-center gap-3">
              <div className="w-9 h-9 rounded-xl bg-indigo-500/20 text-indigo-400 flex items-center justify-center">
                <BookOpen className="w-5 h-5" />
              </div>
              <div>
                <p className="text-[11px] text-slate-400 font-medium uppercase">Courses</p>
                <p className="text-lg font-bold text-white">{courses.length}</p>
              </div>
            </div>

            <div className="bg-slate-800/80 border border-slate-700/80 px-4 py-2.5 rounded-2xl flex items-center gap-3">
              <div className="w-9 h-9 rounded-xl bg-emerald-500/20 text-emerald-400 flex items-center justify-center">
                <Film className="w-5 h-5" />
              </div>
              <div>
                <p className="text-[11px] text-slate-400 font-medium uppercase">Lectures</p>
                <p className="text-lg font-bold text-white">{totalLecturesCount}</p>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* Main Admin Content */}
      <main className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 mt-8">
        {/* Navigation Tabs */}
        <div className="flex items-center justify-between border-b border-slate-200 pb-3 mb-6 gap-4 flex-wrap">
          <div className="flex items-center gap-2">
            <button
              onClick={() => setActiveTab('courses')}
              className={`flex items-center gap-2 px-4 py-2.5 rounded-xl text-sm font-semibold transition ${
                activeTab === 'courses'
                  ? 'bg-indigo-600 text-white shadow-xs'
                  : 'text-slate-600 hover:text-slate-900 hover:bg-slate-100'
              }`}
            >
              <BookOpen className="w-4 h-4" />
              <span>Courses ({courses.length})</span>
            </button>

            <button
              onClick={() => setActiveTab('lectures')}
              className={`flex items-center gap-2 px-4 py-2.5 rounded-xl text-sm font-semibold transition ${
                activeTab === 'lectures'
                  ? 'bg-indigo-600 text-white shadow-xs'
                  : 'text-slate-600 hover:text-slate-900 hover:bg-slate-100'
              }`}
            >
              <Film className="w-4 h-4" />
              <span>Lectures Management</span>
            </button>
          </div>

          <div>
            {activeTab === 'courses' ? (
              <button
                onClick={handleOpenCreateCourse}
                className="inline-flex items-center gap-2 px-4 py-2.5 bg-indigo-600 hover:bg-indigo-700 text-white text-sm font-semibold rounded-xl transition shadow-xs"
              >
                <Plus className="w-4 h-4" />
                <span>Add New Course</span>
              </button>
            ) : (
              <button
                onClick={() => handleOpenCreateLecture(selectedCourseId)}
                disabled={courses.length === 0}
                className="inline-flex items-center gap-2 px-4 py-2.5 bg-indigo-600 hover:bg-indigo-700 text-white text-sm font-semibold rounded-xl transition shadow-xs disabled:opacity-50"
              >
                <Plus className="w-4 h-4" />
                <span>Add Lecture</span>
              </button>
            )}
          </div>
        </div>

        {/* Loading Spinner */}
        {loading && (
          <div className="py-16">
            <LoadingSpinner text="Fetching data..." size="lg" />
          </div>
        )}

        {/* ======================================================== */}
        {/* TAB 1: COURSES MANAGEMENT */}
        {/* ======================================================== */}
        {!loading && activeTab === 'courses' && (
          <div>
            {courses.length === 0 ? (
              <EmptyState
                icon={BookOpen}
                title="No courses created yet"
                description="Get started by creating your first course with title, description, price, and thumbnail URL."
                actionText="Create First Course"
                onAction={handleOpenCreateCourse}
              />
            ) : (
              <div className="bg-white rounded-2xl border border-slate-200 shadow-xs overflow-hidden">
                <div className="overflow-x-auto">
                  <table className="w-full text-left border-collapse">
                    <thead>
                      <tr className="bg-slate-50/80 border-b border-slate-200 text-slate-500 uppercase text-[11px] font-bold tracking-wider">
                        <th className="py-4 px-6">Course</th>
                        <th className="py-4 px-4">Price</th>
                        <th className="py-4 px-4">Lectures</th>
                        <th className="py-4 px-4">Created Date</th>
                        <th className="py-4 px-6 text-right">Actions</th>
                      </tr>
                    </thead>
                    <tbody className="divide-y divide-slate-100 text-sm">
                      {courses.map((course) => (
                        <tr key={course._id} className="hover:bg-slate-50/70 transition-colors">
                          {/* Course Thumbnail & Title */}
                          <td className="py-4 px-6">
                            <div className="flex items-center gap-3.5">
                              <img
                                src={course.thumbnail}
                                alt={course.title}
                                className="w-14 h-10 object-cover rounded-lg border border-slate-200 shrink-0"
                                onError={(e) => {
                                  (e.target as HTMLImageElement).src =
                                    'https://images.unsplash.com/photo-1516321318423-f06f85e504b3?w=800&auto=format&fit=crop&q=80';
                                }}
                              />
                              <div className="min-w-0">
                                <p className="font-bold text-slate-900 truncate max-w-md">
                                  {course.title}
                                </p>
                                <p className="text-xs text-slate-400 line-clamp-1 max-w-md mt-0.5">
                                  {course.description}
                                </p>
                              </div>
                            </div>
                          </td>

                          {/* Price */}
                          <td className="py-4 px-4 font-semibold text-slate-800">
                            {course.price === 0 ? (
                              <span className="text-emerald-600 bg-emerald-50 px-2 py-0.5 rounded text-xs">
                                Free
                              </span>
                            ) : (
                              `$${course.price.toFixed(2)}`
                            )}
                          </td>

                          {/* Lectures Count & Quick Link */}
                          <td className="py-4 px-4">
                            <button
                              onClick={() => {
                                setSelectedCourseId(course._id);
                                setActiveTab('lectures');
                              }}
                              className="inline-flex items-center gap-1.5 px-2.5 py-1 rounded-lg text-xs font-semibold bg-indigo-50 text-indigo-700 hover:bg-indigo-100 transition"
                              title="Manage Lectures for this course"
                            >
                              <Film className="w-3.5 h-3.5" />
                              <span>{course.lectureCount ?? 0} Lectures</span>
                            </button>
                          </td>

                          {/* Created Date */}
                          <td className="py-4 px-4 text-xs text-slate-400">
                            {new Date(course.createdAt).toLocaleDateString()}
                          </td>

                          {/* Action Buttons */}
                          <td className="py-4 px-6 text-right">
                            <div className="flex items-center justify-end gap-1.5">
                              <a
                                href={`/courses/${course._id}`}
                                target="_blank"
                                rel="noreferrer"
                                className="p-2 text-slate-400 hover:text-slate-600 hover:bg-slate-100 rounded-lg transition"
                                title="View student page"
                              >
                                <Eye className="w-4 h-4" />
                              </a>
                              <button
                                onClick={() => handleOpenEditCourse(course)}
                                className="p-2 text-indigo-600 hover:text-indigo-800 hover:bg-indigo-50 rounded-lg transition"
                                title="Edit Course"
                              >
                                <Pencil className="w-4 h-4" />
                              </button>
                              <button
                                onClick={() =>
                                  setDeleteConfirm({
                                    isOpen: true,
                                    type: 'course',
                                    id: course._id,
                                    title: course.title,
                                  })
                                }
                                className="p-2 text-rose-500 hover:text-rose-700 hover:bg-rose-50 rounded-lg transition"
                                title="Delete Course"
                              >
                                <Trash2 className="w-4 h-4" />
                              </button>
                            </div>
                          </td>
                        </tr>
                      ))}
                    </tbody>
                  </table>
                </div>
              </div>
            )}
          </div>
        )}

        {/* ======================================================== */}
        {/* TAB 2: LECTURES MANAGEMENT */}
        {/* ======================================================== */}
        {!loading && activeTab === 'lectures' && (
          <div>
            {/* Course Selector Filter Header */}
            <div className="bg-white p-4 rounded-2xl border border-slate-200 shadow-xs mb-6 flex flex-col sm:flex-row sm:items-center justify-between gap-4">
              <div className="flex items-center gap-3">
                <span className="text-xs font-bold text-slate-500 uppercase tracking-wider shrink-0">
                  Select Course:
                </span>
                <select
                  value={selectedCourseId}
                  onChange={(e) => setSelectedCourseId(e.target.value)}
                  className="bg-slate-50 border border-slate-200 rounded-xl px-3 py-2 text-sm font-semibold text-slate-800 focus:outline-hidden focus:ring-2 focus:ring-indigo-500 max-w-md w-full"
                >
                  {courses.map((course) => (
                    <option key={course._id} value={course._id}>
                      {course.title} ({course.lectureCount ?? 0} lectures)
                    </option>
                  ))}
                </select>
              </div>

              {selectedCourseId && (
                <button
                  onClick={() => handleOpenCreateLecture(selectedCourseId)}
                  className="inline-flex items-center gap-2 px-3.5 py-2 bg-indigo-600 hover:bg-indigo-700 text-white text-xs font-semibold rounded-xl transition"
                >
                  <Plus className="w-4 h-4" />
                  <span>Add Lecture to This Course</span>
                </button>
              )}
            </div>

            {/* Lecture Listing */}
            {lectures.length === 0 ? (
              <EmptyState
                icon={Film}
                title="No lectures for this course yet"
                description="Add video lectures with title, description, and embedded video URL."
                actionText="Add First Lecture"
                onAction={() => handleOpenCreateLecture(selectedCourseId)}
              />
            ) : (
              <div className="bg-white rounded-2xl border border-slate-200 shadow-xs overflow-hidden">
                <div className="overflow-x-auto">
                  <table className="w-full text-left border-collapse">
                    <thead>
                      <tr className="bg-slate-50/80 border-b border-slate-200 text-slate-500 uppercase text-[11px] font-bold tracking-wider">
                        <th className="py-4 px-6 w-16">#</th>
                        <th className="py-4 px-4">Lecture Title</th>
                        <th className="py-4 px-4">Video URL</th>
                        <th className="py-4 px-4">Description</th>
                        <th className="py-4 px-6 text-right">Actions</th>
                      </tr>
                    </thead>
                    <tbody className="divide-y divide-slate-100 text-sm">
                      {lectures.map((lecture, index) => (
                        <tr key={lecture._id} className="hover:bg-slate-50/70 transition-colors">
                          <td className="py-4 px-6 font-bold text-slate-400">
                            {lecture.order || index + 1}
                          </td>
                          <td className="py-4 px-4 font-bold text-slate-900 max-w-xs truncate">
                            {lecture.title}
                          </td>
                          <td className="py-4 px-4 text-xs text-indigo-600 font-mono max-w-xs truncate">
                            <a
                              href={lecture.videoUrl}
                              target="_blank"
                              rel="noreferrer"
                              className="hover:underline flex items-center gap-1"
                            >
                              <span className="truncate">{lecture.videoUrl}</span>
                              <ExternalLink className="w-3 h-3 shrink-0" />
                            </a>
                          </td>
                          <td className="py-4 px-4 text-xs text-slate-500 max-w-sm truncate">
                            {lecture.description || '—'}
                          </td>
                          <td className="py-4 px-6 text-right">
                            <div className="flex items-center justify-end gap-2">
                              <button
                                onClick={() => handleOpenEditLecture(lecture)}
                                className="p-2 text-indigo-600 hover:text-indigo-800 hover:bg-indigo-50 rounded-lg transition"
                                title="Edit Lecture"
                              >
                                <Pencil className="w-4 h-4" />
                              </button>
                              <button
                                onClick={() =>
                                  setDeleteConfirm({
                                    isOpen: true,
                                    type: 'lecture',
                                    id: lecture._id,
                                    title: lecture.title,
                                  })
                                }
                                className="p-2 text-rose-500 hover:text-rose-700 hover:bg-rose-50 rounded-lg transition"
                                title="Delete Lecture"
                              >
                                <Trash2 className="w-4 h-4" />
                              </button>
                            </div>
                          </td>
                        </tr>
                      ))}
                    </tbody>
                  </table>
                </div>
              </div>
            )}
          </div>
        )}
      </main>

      {/* ======================================================== */}
      {/* COURSE CREATE / EDIT MODAL */}
      {/* ======================================================== */}
      <Modal
        isOpen={isCourseModalOpen}
        onClose={() => setIsCourseModalOpen(false)}
        title={editingCourse ? 'Edit Course' : 'Create New Course'}
      >
        <form onSubmit={handleSaveCourse} className="space-y-4">
          <div>
            <label className="block text-xs font-bold text-slate-700 uppercase tracking-wider mb-1">
              Course Title *
            </label>
            <input
              type="text"
              required
              value={courseFormData.title}
              onChange={(e) => setCourseFormData({ ...courseFormData, title: e.target.value })}
              placeholder="e.g. Full-Stack Web Development with MERN"
              className="w-full px-3.5 py-2.5 rounded-xl border border-slate-200 text-sm focus:ring-2 focus:ring-indigo-500 focus:outline-hidden"
            />
          </div>

          <div>
            <label className="block text-xs font-bold text-slate-700 uppercase tracking-wider mb-1">
              Price (USD) *
            </label>
            <input
              type="number"
              step="0.01"
              min="0"
              required
              value={courseFormData.price}
              onChange={(e) => setCourseFormData({ ...courseFormData, price: e.target.value })}
              placeholder="e.g. 49.99 (or 0 for Free)"
              className="w-full px-3.5 py-2.5 rounded-xl border border-slate-200 text-sm focus:ring-2 focus:ring-indigo-500 focus:outline-hidden"
            />
          </div>

          <div>
            <label className="block text-xs font-bold text-slate-700 uppercase tracking-wider mb-1">
              Thumbnail Image URL *
            </label>
            <input
              type="url"
              required
              value={courseFormData.thumbnail}
              onChange={(e) => setCourseFormData({ ...courseFormData, thumbnail: e.target.value })}
              placeholder="https://images.unsplash.com/..."
              className="w-full px-3.5 py-2.5 rounded-xl border border-slate-200 text-sm focus:ring-2 focus:ring-indigo-500 focus:outline-hidden"
            />
            {courseFormData.thumbnail && (
              <div className="mt-2 relative w-full h-32 bg-slate-100 rounded-xl overflow-hidden border border-slate-200">
                <img
                  src={courseFormData.thumbnail}
                  alt="Thumbnail Preview"
                  className="w-full h-full object-cover"
                  onError={(e) => {
                    (e.target as HTMLImageElement).src =
                      'https://images.unsplash.com/photo-1516321318423-f06f85e504b3?w=800&auto=format&fit=crop&q=80';
                  }}
                />
                <span className="absolute bottom-1 right-1 bg-black/70 text-white text-[10px] px-2 py-0.5 rounded">
                  Image Preview
                </span>
              </div>
            )}
          </div>

          <div>
            <label className="block text-xs font-bold text-slate-700 uppercase tracking-wider mb-1">
              Description *
            </label>
            <textarea
              required
              rows={4}
              value={courseFormData.description}
              onChange={(e) => setCourseFormData({ ...courseFormData, description: e.target.value })}
              placeholder="Comprehensive description of the course content, curriculum, and outcomes..."
              className="w-full px-3.5 py-2.5 rounded-xl border border-slate-200 text-sm focus:ring-2 focus:ring-indigo-500 focus:outline-hidden"
            />
          </div>

          <div className="pt-4 border-t border-slate-100 flex items-center justify-end gap-3">
            <button
              type="button"
              onClick={() => setIsCourseModalOpen(false)}
              className="px-4 py-2.5 border border-slate-200 text-slate-700 hover:bg-slate-50 text-sm font-medium rounded-xl transition"
            >
              Cancel
            </button>
            <button
              type="submit"
              disabled={formSubmitting}
              className="px-5 py-2.5 bg-indigo-600 hover:bg-indigo-700 text-white text-sm font-semibold rounded-xl transition shadow-xs disabled:opacity-50"
            >
              {formSubmitting ? 'Saving...' : editingCourse ? 'Update Course' : 'Create Course'}
            </button>
          </div>
        </form>
      </Modal>

      {/* ======================================================== */}
      {/* LECTURE CREATE / EDIT MODAL */}
      {/* ======================================================== */}
      <Modal
        isOpen={isLectureModalOpen}
        onClose={() => setIsLectureModalOpen(false)}
        title={editingLecture ? 'Edit Lecture' : 'Add New Lecture'}
      >
        <form onSubmit={handleSaveLecture} className="space-y-4">
          <div>
            <label className="block text-xs font-bold text-slate-700 uppercase tracking-wider mb-1">
              Select Course *
            </label>
            <select
              required
              value={lectureFormData.courseId}
              onChange={(e) => setLectureFormData({ ...lectureFormData, courseId: e.target.value })}
              className="w-full px-3.5 py-2.5 rounded-xl border border-slate-200 text-sm focus:ring-2 focus:ring-indigo-500 focus:outline-hidden bg-white"
            >
              <option value="" disabled>
                -- Select a Course --
              </option>
              {courses.map((c) => (
                <option key={c._id} value={c._id}>
                  {c.title}
                </option>
              ))}
            </select>
          </div>

          <div>
            <label className="block text-xs font-bold text-slate-700 uppercase tracking-wider mb-1">
              Lecture Title *
            </label>
            <input
              type="text"
              required
              value={lectureFormData.title}
              onChange={(e) => setLectureFormData({ ...lectureFormData, title: e.target.value })}
              placeholder="e.g. 01. Introduction to Full-Stack Architecture"
              className="w-full px-3.5 py-2.5 rounded-xl border border-slate-200 text-sm focus:ring-2 focus:ring-indigo-500 focus:outline-hidden"
            />
          </div>

          <div>
            <label className="block text-xs font-bold text-slate-700 uppercase tracking-wider mb-1">
              Video URL (YouTube / Vimeo / Embed) *
            </label>
            <input
              type="url"
              required
              value={lectureFormData.videoUrl}
              onChange={(e) => setLectureFormData({ ...lectureFormData, videoUrl: e.target.value })}
              placeholder="https://www.youtube.com/watch?v=..."
              className="w-full px-3.5 py-2.5 rounded-xl border border-slate-200 text-sm focus:ring-2 focus:ring-indigo-500 focus:outline-hidden"
            />
            <p className="text-[11px] text-slate-400 mt-1">
              Paste standard YouTube link (watch, share, or shorts), Vimeo, or direct MP4 stream URL.
            </p>
          </div>

          <div>
            <label className="block text-xs font-bold text-slate-700 uppercase tracking-wider mb-1">
              Order Number (Sequence in Course)
            </label>
            <input
              type="number"
              min="1"
              value={lectureFormData.order}
              onChange={(e) =>
                setLectureFormData({ ...lectureFormData, order: parseInt(e.target.value) || 1 })
              }
              className="w-full px-3.5 py-2.5 rounded-xl border border-slate-200 text-sm focus:ring-2 focus:ring-indigo-500 focus:outline-hidden"
            />
          </div>

          <div>
            <label className="block text-xs font-bold text-slate-700 uppercase tracking-wider mb-1">
              Lecture Description
            </label>
            <textarea
              rows={3}
              value={lectureFormData.description}
              onChange={(e) => setLectureFormData({ ...lectureFormData, description: e.target.value })}
              placeholder="Topics covered in this lecture..."
              className="w-full px-3.5 py-2.5 rounded-xl border border-slate-200 text-sm focus:ring-2 focus:ring-indigo-500 focus:outline-hidden"
            />
          </div>

          <div className="pt-4 border-t border-slate-100 flex items-center justify-end gap-3">
            <button
              type="button"
              onClick={() => setIsLectureModalOpen(false)}
              className="px-4 py-2.5 border border-slate-200 text-slate-700 hover:bg-slate-50 text-sm font-medium rounded-xl transition"
            >
              Cancel
            </button>
            <button
              type="submit"
              disabled={formSubmitting}
              className="px-5 py-2.5 bg-indigo-600 hover:bg-indigo-700 text-white text-sm font-semibold rounded-xl transition shadow-xs disabled:opacity-50"
            >
              {formSubmitting ? 'Saving...' : editingLecture ? 'Update Lecture' : 'Save Lecture'}
            </button>
          </div>
        </form>
      </Modal>

      {/* ======================================================== */}
      {/* DELETE CONFIRMATION MODAL */}
      {/* ======================================================== */}
      <Modal
        isOpen={deleteConfirm.isOpen}
        onClose={() => setDeleteConfirm({ isOpen: false, type: 'course', id: '', title: '' })}
        title={`Confirm Delete ${deleteConfirm.type === 'course' ? 'Course' : 'Lecture'}`}
        maxWidth="md"
      >
        <div className="text-center py-2">
          <div className="w-12 h-12 rounded-full bg-rose-100 text-rose-600 flex items-center justify-center mx-auto mb-4">
            <AlertTriangle className="w-6 h-6" />
          </div>
          <h4 className="text-base font-bold text-slate-900 mb-2">
            Are you sure you want to delete this {deleteConfirm.type}?
          </h4>
          <p className="text-xs text-slate-500 mb-2 font-medium">"{deleteConfirm.title}"</p>
          {deleteConfirm.type === 'course' && (
            <p className="text-xs text-rose-600 bg-rose-50 p-2.5 rounded-xl mb-6">
              Warning: Deleting this course will also automatically delete all lectures associated with it!
            </p>
          )}

          <div className="flex items-center justify-center gap-3">
            <button
              type="button"
              onClick={() => setDeleteConfirm({ isOpen: false, type: 'course', id: '', title: '' })}
              className="px-4 py-2 border border-slate-200 text-slate-700 hover:bg-slate-50 text-xs font-semibold rounded-xl transition"
            >
              No, Keep It
            </button>
            <button
              type="button"
              onClick={handleConfirmDelete}
              disabled={formSubmitting}
              className="px-4 py-2 bg-rose-600 hover:bg-rose-700 text-white text-xs font-semibold rounded-xl transition shadow-xs disabled:opacity-50"
            >
              {formSubmitting ? 'Deleting...' : 'Yes, Delete Permanently'}
            </button>
          </div>
        </div>
      </Modal>
    </div>
  );
};
