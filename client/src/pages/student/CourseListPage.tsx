import React, { useState, useEffect } from 'react';
import { Link } from 'react-router-dom';
import { courseApi } from '../../services/api';
import type { Course } from '../../types';
import { LoadingSpinner } from '../../components/common/LoadingSpinner';
import { EmptyState } from '../../components/common/EmptyState';
import {
  Search,
  Film,
  Sparkles,
  ArrowRight,
  RefreshCw,
  GraduationCap,
} from 'lucide-react';

export const CourseListPage: React.FC = () => {
  const [courses, setCourses] = useState<Course[]>([]);
  const [loading, setLoading] = useState<boolean>(true);
  const [error, setError] = useState<string | null>(null);
  const [searchQuery, setSearchQuery] = useState<string>('');

  const fetchCourses = async () => {
    try {
      setLoading(true);
      setError(null);
      const res = await courseApi.getAll();
      setCourses(res.data || []);
    } catch (err) {
      setError(err instanceof Error ? err.message : 'Failed to load courses');
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchCourses();
  }, []);

  const filteredCourses = courses.filter((course) => {
    const q = searchQuery.toLowerCase().trim();
    return (
      course.title.toLowerCase().includes(q) ||
      course.description.toLowerCase().includes(q)
    );
  });

  return (
    <div className="flex-1 pb-16">
      {/* Hero Header */}
      <section className="bg-gradient-to-b from-indigo-900 via-indigo-800 to-indigo-950 text-white py-16 px-4 sm:px-6 lg:px-8 relative overflow-hidden">
        <div className="absolute inset-0 bg-[radial-gradient(#ffffff15_1px,transparent_1px)] [background-size:16px_16px] pointer-events-none opacity-40" />
        <div className="max-w-5xl mx-auto text-center relative z-10">
          <div className="inline-flex items-center gap-2 px-3.5 py-1.5 rounded-full bg-indigo-500/20 text-indigo-200 border border-indigo-400/30 text-xs font-semibold mb-6 backdrop-blur-xs">
            <Sparkles className="w-3.5 h-3.5 text-indigo-300" />
            <span>Industrial Training Recruitment Task • DataPollex Ltd.</span>
          </div>

          <h1 className="text-3xl sm:text-5xl font-extrabold tracking-tight text-white mb-4 sm:leading-tight">
            Learn In-Demand Tech Skills with <br className="hidden sm:inline" />
            <span className="text-indigo-300">Structured Video Lectures</span>
          </h1>

          <p className="text-base sm:text-lg text-indigo-100/90 max-w-2xl mx-auto mb-8 font-light">
            Browse our curated courses and watch high-quality lectures directly inside our simplified
            Learning Management System.
          </p>

          {/* Search Bar */}
          <div className="max-w-xl mx-auto relative">
            <div className="absolute inset-y-0 left-0 pl-4 flex items-center pointer-events-none text-slate-400">
              <Search className="w-5 h-5 text-indigo-300" />
            </div>
            <input
              type="text"
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
              placeholder="Search courses by title or keyword..."
              className="w-full pl-11 pr-4 py-3.5 rounded-2xl bg-white/10 text-white placeholder-indigo-200/60 border border-white/20 focus:outline-hidden focus:ring-2 focus:ring-indigo-400 focus:bg-white/15 backdrop-blur-md transition text-sm shadow-xl"
            />
            {searchQuery && (
              <button
                onClick={() => setSearchQuery('')}
                className="absolute inset-y-0 right-0 pr-4 flex items-center text-xs text-indigo-200 hover:text-white"
              >
                Clear
              </button>
            )}
          </div>
        </div>
      </section>

      {/* Main Course Grid Content */}
      <main className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 mt-10">
        <div className="flex items-center justify-between mb-8 pb-4 border-b border-slate-200">
          <div>
            <h2 className="text-2xl font-bold text-slate-900 tracking-tight">Available Courses</h2>
            <p className="text-sm text-slate-500 mt-1">
              Explore dynamic courses fetched directly from the database.
            </p>
          </div>
          <button
            onClick={fetchCourses}
            disabled={loading}
            className="inline-flex items-center gap-2 px-3 py-2 rounded-xl text-xs font-medium text-slate-600 hover:text-indigo-600 hover:bg-indigo-50 border border-slate-200 transition"
            title="Refresh courses from database"
          >
            <RefreshCw className={`w-3.5 h-3.5 ${loading ? 'animate-spin' : ''}`} />
            <span>Refresh</span>
          </button>
        </div>

        {/* Loading State */}
        {loading && (
          <div className="py-16">
            <LoadingSpinner text="Fetching courses from database..." size="lg" />
          </div>
        )}

        {/* Error State */}
        {error && !loading && (
          <div className="max-w-md mx-auto my-12 p-6 bg-rose-50 border border-rose-200 rounded-2xl text-center">
            <p className="text-sm font-semibold text-rose-700 mb-2">Unable to load courses</p>
            <p className="text-xs text-rose-600 mb-4">{error}</p>
            <button
              onClick={fetchCourses}
              className="px-4 py-2 bg-rose-600 hover:bg-rose-700 text-white rounded-xl text-xs font-medium transition"
            >
              Try Again
            </button>
          </div>
        )}

        {/* Empty State */}
        {!loading && !error && filteredCourses.length === 0 && (
          <EmptyState
            title={searchQuery ? 'No matching courses found' : 'No courses available yet'}
            description={
              searchQuery
                ? `No results for "${searchQuery}". Try searching for another topic.`
                : 'The admin has not added any courses yet. Please check back later or log in as admin to create courses.'
            }
            actionText={searchQuery ? 'Clear Search' : undefined}
            onAction={searchQuery ? () => setSearchQuery('') : undefined}
          />
        )}

        {/* Course Cards Grid */}
        {!loading && !error && filteredCourses.length > 0 && (
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
            {filteredCourses.map((course) => (
              <div
                key={course._id}
                className="bg-white rounded-2xl overflow-hidden border border-slate-200 shadow-xs hover:shadow-xl hover:border-indigo-200 transition-all duration-300 flex flex-col group"
              >
                {/* Thumbnail */}
                <div className="relative aspect-video w-full overflow-hidden bg-slate-100">
                  <img
                    src={course.thumbnail}
                    alt={course.title}
                    className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-500"
                    onError={(e) => {
                      // Fallback placeholder image
                      (e.target as HTMLImageElement).src =
                        'https://images.unsplash.com/photo-1516321318423-f06f85e504b3?w=800&auto=format&fit=crop&q=80';
                    }}
                  />
                  <div className="absolute top-3 right-3 bg-white/95 backdrop-blur-xs text-indigo-700 font-bold px-3 py-1 rounded-full text-xs shadow-md border border-indigo-100">
                    {course.price === 0 ? 'FREE' : `$${course.price.toFixed(2)}`}
                  </div>
                  <div className="absolute bottom-3 left-3 bg-slate-900/80 backdrop-blur-xs text-white text-[11px] font-medium px-2.5 py-1 rounded-lg flex items-center gap-1.5">
                    <Film className="w-3.5 h-3.5 text-indigo-400" />
                    <span>{course.lectureCount ?? 0} Lectures</span>
                  </div>
                </div>

                {/* Content */}
                <div className="p-6 flex-1 flex flex-col justify-between">
                  <div>
                    <h3 className="text-lg font-bold text-slate-900 group-hover:text-indigo-600 transition-colors line-clamp-1 mb-2">
                      {course.title}
                    </h3>
                    <p className="text-sm text-slate-500 line-clamp-3 mb-6 leading-relaxed">
                      {course.description}
                    </p>
                  </div>

                  <div className="pt-4 border-t border-slate-100 flex items-center justify-between">
                    <span className="text-xs text-slate-400 font-medium flex items-center gap-1">
                      <GraduationCap className="w-4 h-4 text-indigo-500" />
                      Self-paced Video
                    </span>
                    <Link
                      to={`/courses/${course._id}`}
                      className="inline-flex items-center gap-1.5 px-4 py-2 bg-indigo-50 group-hover:bg-indigo-600 text-indigo-600 group-hover:text-white rounded-xl text-xs font-semibold transition-all duration-200"
                    >
                      <span>View Course</span>
                      <ArrowRight className="w-3.5 h-3.5" />
                    </Link>
                  </div>
                </div>
              </div>
            ))}
          </div>
        )}
      </main>
    </div>
  );
};
