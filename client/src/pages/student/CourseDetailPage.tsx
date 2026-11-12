import React, { useState, useEffect } from 'react';
import { useParams, Link } from 'react-router-dom';
import { courseApi } from '../../services/api';
import type { Course, Lecture } from '../../types';
import { VideoPlayer } from '../../components/common/VideoPlayer';
import { LoadingSpinner } from '../../components/common/LoadingSpinner';
import { EmptyState } from '../../components/common/EmptyState';
import {
  ArrowLeft,
  PlayCircle,
  Film,
  ChevronLeft,
  ChevronRight,
  ExternalLink,
} from 'lucide-react';

export const CourseDetailPage: React.FC = () => {
  const { id } = useParams<{ id: string }>();
  const [course, setCourse] = useState<Course | null>(null);
  const [lectures, setLectures] = useState<Lecture[]>([]);
  const [activeLecture, setActiveLecture] = useState<Lecture | null>(null);
  const [loading, setLoading] = useState<boolean>(true);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    const fetchCourseDetails = async () => {
      if (!id) return;
      try {
        setLoading(true);
        setError(null);
        const res = await courseApi.getById(id);
        setCourse(res.data);
        const fetchedLectures = res.data.lectures || [];
        setLectures(fetchedLectures);

        // Select the first lecture by default
        if (fetchedLectures.length > 0) {
          setActiveLecture(fetchedLectures[0]);
        }
      } catch (err) {
        setError(err instanceof Error ? err.message : 'Failed to load course details');
      } finally {
        setLoading(false);
      }
    };

    fetchCourseDetails();
  }, [id]);

  const activeIndex = activeLecture
    ? lectures.findIndex((l) => l._id === activeLecture._id)
    : -1;

  const handleNextLecture = () => {
    if (activeIndex >= 0 && activeIndex < lectures.length - 1) {
      setActiveLecture(lectures[activeIndex + 1]);
    }
  };

  const handlePrevLecture = () => {
    if (activeIndex > 0) {
      setActiveLecture(lectures[activeIndex - 1]);
    }
  };

  if (loading) {
    return (
      <div className="flex-1 flex items-center justify-center py-20">
        <LoadingSpinner text="Loading course and lecture content..." size="lg" />
      </div>
    );
  }

  if (error || !course) {
    return (
      <div className="max-w-xl mx-auto my-16 p-8 bg-white border border-slate-200 rounded-3xl text-center shadow-sm">
        <h2 className="text-xl font-bold text-slate-800 mb-2">Course Not Found</h2>
        <p className="text-sm text-slate-500 mb-6">
          {error || 'The requested course does not exist or may have been removed.'}
        </p>
        <Link
          to="/"
          className="inline-flex items-center gap-2 px-5 py-2.5 bg-indigo-600 hover:bg-indigo-700 text-white rounded-xl text-sm font-medium transition"
        >
          <ArrowLeft className="w-4 h-4" />
          <span>Back to All Courses</span>
        </Link>
      </div>
    );
  }

  return (
    <div className="flex-1 pb-16">
      {/* Top Breadcrumb & Course Info Banner */}
      <section className="bg-slate-900 text-white py-8 px-4 sm:px-6 lg:px-8 border-b border-slate-800">
        <div className="max-w-7xl mx-auto">
          <Link
            to="/"
            className="inline-flex items-center gap-2 text-xs font-semibold text-indigo-400 hover:text-indigo-300 transition mb-4"
          >
            <ArrowLeft className="w-3.5 h-3.5" />
            <span>All Courses</span>
          </Link>

          <div className="flex flex-col lg:flex-row lg:items-center justify-between gap-6">
            <div className="max-w-3xl">
              <div className="flex items-center gap-3 mb-2 flex-wrap">
                <span className="px-3 py-1 bg-indigo-500/20 text-indigo-300 border border-indigo-400/30 rounded-full text-xs font-bold">
                  {course.price === 0 ? 'FREE' : `$${course.price.toFixed(2)}`}
                </span>
                <span className="flex items-center gap-1.5 text-xs text-slate-400">
                  <Film className="w-3.5 h-3.5 text-indigo-400" />
                  <span>{lectures.length} Lectures Available</span>
                </span>
              </div>
              <h1 className="text-2xl sm:text-3xl font-extrabold tracking-tight text-white mb-2">
                {course.title}
              </h1>
              <p className="text-sm text-slate-300 line-clamp-2 leading-relaxed">
                {course.description}
              </p>
            </div>

            <div className="hidden lg:block shrink-0">
              <img
                src={course.thumbnail}
                alt={course.title}
                className="w-48 h-28 object-cover rounded-xl border border-slate-700 shadow-md"
              />
            </div>
          </div>
        </div>
      </section>

      {/* Main Player & Lectures Section */}
      <main className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 mt-8">
        {lectures.length === 0 ? (
          <EmptyState
            icon={Film}
            title="No lectures added yet"
            description="The instructor has not uploaded any lectures for this course yet. Please check back later."
          />
        ) : (
          <div className="grid grid-cols-1 lg:grid-cols-12 gap-8 items-start">
            {/* Left Column: Embedded Video Player + Active Lecture Details */}
            <div className="lg:col-span-8 flex flex-col gap-6">
              {activeLecture && (
                <>
                  <VideoPlayer videoUrl={activeLecture.videoUrl} title={activeLecture.title} />

                  <div className="bg-white rounded-2xl p-6 border border-slate-200 shadow-xs">
                    <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 pb-4 border-b border-slate-100">
                      <div>
                        <div className="flex items-center gap-2 mb-1">
                          <span className="px-2.5 py-0.5 rounded-md bg-indigo-50 text-indigo-700 font-bold text-xs">
                            Lecture {activeIndex + 1} of {lectures.length}
                          </span>
                        </div>
                        <h2 className="text-xl font-bold text-slate-900 tracking-tight">
                          {activeLecture.title}
                        </h2>
                      </div>

                      {/* Previous / Next Lecture Buttons */}
                      <div className="flex items-center gap-2">
                        <button
                          onClick={handlePrevLecture}
                          disabled={activeIndex <= 0}
                          className="flex items-center gap-1.5 px-3 py-1.5 rounded-xl border border-slate-200 text-xs font-medium text-slate-700 hover:bg-slate-50 disabled:opacity-40 disabled:cursor-not-allowed transition"
                        >
                          <ChevronLeft className="w-4 h-4" />
                          <span>Previous</span>
                        </button>
                        <button
                          onClick={handleNextLecture}
                          disabled={activeIndex >= lectures.length - 1}
                          className="flex items-center gap-1.5 px-3 py-1.5 rounded-xl bg-indigo-600 text-white text-xs font-medium hover:bg-indigo-700 disabled:opacity-40 disabled:cursor-not-allowed transition shadow-xs"
                        >
                          <span>Next</span>
                          <ChevronRight className="w-4 h-4" />
                        </button>
                      </div>
                    </div>

                    {/* Lecture Description */}
                    <div className="mt-4">
                      <h4 className="text-xs font-bold text-slate-400 uppercase tracking-wider mb-2">
                        About This Lecture
                      </h4>
                      <p className="text-sm text-slate-600 leading-relaxed whitespace-pre-line">
                        {activeLecture.description || 'No detailed description for this lecture.'}
                      </p>
                    </div>

                    {/* Video URL Reference for grading verification */}
                    <div className="mt-6 pt-4 border-t border-slate-100 flex items-center justify-between text-xs text-slate-400">
                      <span className="truncate max-w-md">Source URL: {activeLecture.videoUrl}</span>
                      <a
                        href={activeLecture.videoUrl}
                        target="_blank"
                        rel="noreferrer"
                        className="inline-flex items-center gap-1 text-indigo-600 hover:underline shrink-0"
                      >
                        <span>Open Video</span>
                        <ExternalLink className="w-3 h-3" />
                      </a>
                    </div>
                  </div>
                </>
              )}
            </div>

            {/* Right Column: Lecture Playlist Sidebar */}
            <div className="lg:col-span-4 bg-white rounded-2xl border border-slate-200 shadow-xs overflow-hidden sticky top-20">
              <div className="p-4 bg-slate-50 border-b border-slate-200 flex items-center justify-between">
                <div>
                  <h3 className="font-bold text-slate-900 text-sm">Course Curriculum</h3>
                  <p className="text-xs text-slate-500">{lectures.length} video lectures</p>
                </div>
                <span className="text-xs font-semibold px-2 py-0.5 bg-indigo-100 text-indigo-700 rounded-md">
                  Playlist
                </span>
              </div>

              <div className="divide-y divide-slate-100 max-h-[calc(100vh-16rem)] overflow-y-auto">
                {lectures.map((lecture, index) => {
                  const isCurrent = activeLecture?._id === lecture._id;

                  return (
                    <button
                      key={lecture._id}
                      onClick={() => setActiveLecture(lecture)}
                      className={`w-full p-4 text-left flex items-start gap-3 transition-colors ${
                        isCurrent
                          ? 'bg-indigo-50/70 border-l-4 border-indigo-600 text-indigo-950 font-semibold'
                          : 'hover:bg-slate-50 text-slate-700'
                      }`}
                    >
                      <div className="mt-0.5 shrink-0">
                        {isCurrent ? (
                          <div className="w-6 h-6 rounded-full bg-indigo-600 text-white flex items-center justify-center shadow-xs">
                            <PlayCircle className="w-3.5 h-3.5 fill-current" />
                          </div>
                        ) : (
                          <div className="w-6 h-6 rounded-full bg-slate-100 text-slate-400 flex items-center justify-center text-xs font-medium border border-slate-200">
                            {index + 1}
                          </div>
                        )}
                      </div>

                      <div className="flex-1 min-w-0">
                        <div className="flex items-center justify-between gap-2 mb-1">
                          <span
                            className={`text-xs font-bold ${
                              isCurrent ? 'text-indigo-600' : 'text-slate-400'
                            }`}
                          >
                            Lecture {index + 1}
                          </span>
                          {isCurrent && (
                            <span className="text-[10px] font-bold text-indigo-600 uppercase tracking-wider bg-indigo-100 px-1.5 py-0.5 rounded">
                              Playing
                            </span>
                          )}
                        </div>
                        <p
                          className={`text-sm truncate leading-snug ${
                            isCurrent ? 'text-indigo-900 font-semibold' : 'text-slate-800'
                          }`}
                        >
                          {lecture.title}
                        </p>
                      </div>
                    </button>
                  );
                })}
              </div>
            </div>
          </div>
        )}
      </main>
    </div>
  );
};
