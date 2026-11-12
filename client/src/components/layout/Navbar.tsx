import React from 'react';
import { Link, useNavigate, useLocation } from 'react-router-dom';
import { useAuth } from '../../context/AuthContext';
import { BookOpen, ShieldCheck, LogOut, LogIn, LayoutDashboard } from 'lucide-react';

export const Navbar: React.FC = () => {
  const { admin, isAuthenticated, logout } = useAuth();
  const navigate = useNavigate();
  const location = useLocation();

  const handleLogout = () => {
    logout();
    navigate('/admin/login');
  };

  const isActive = (path: string) => location.pathname === path;

  return (
    <header className="sticky top-0 z-40 bg-white border-b border-slate-200 shadow-xs">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="flex items-center justify-between h-16">
          {/* Logo & Platform Name */}
          <Link
            to="/"
            className="flex items-center gap-2.5 text-indigo-600 hover:text-indigo-700 transition"
          >
            <div className="w-10 h-10 rounded-xl bg-indigo-600 flex items-center justify-center text-white shadow-md shadow-indigo-100">
              <BookOpen className="w-5 h-5" />
            </div>
            <div>
              <span className="text-xl font-bold tracking-tight text-slate-900">
                EduForge <span className="text-indigo-600 font-extrabold">LMS</span>
              </span>
              <span className="hidden sm:block text-[11px] text-slate-400 font-medium -mt-1 tracking-wider uppercase">
                Learning Portal
              </span>
            </div>
          </Link>

          {/* Navigation Links */}
          <nav className="flex items-center gap-1.5 sm:gap-3">
            <Link
              to="/"
              className={`px-3 py-2 rounded-lg text-sm font-medium transition ${
                isActive('/')
                  ? 'bg-indigo-50 text-indigo-700 font-semibold'
                  : 'text-slate-600 hover:text-slate-900 hover:bg-slate-100'
              }`}
            >
              Courses
            </Link>

            {isAuthenticated ? (
              <>
                <Link
                  to="/admin"
                  className={`flex items-center gap-1.5 px-3 py-2 rounded-lg text-sm font-medium transition ${
                    isActive('/admin')
                      ? 'bg-indigo-50 text-indigo-700 font-semibold'
                      : 'text-slate-600 hover:text-slate-900 hover:bg-slate-100'
                  }`}
                >
                  <LayoutDashboard className="w-4 h-4" />
                  <span>Admin Dashboard</span>
                </Link>

                <div className="hidden md:flex items-center gap-2 pl-2 border-l border-slate-200">
                  <div className="flex items-center gap-1.5 text-xs bg-emerald-50 text-emerald-700 px-2.5 py-1 rounded-full font-medium border border-emerald-200">
                    <ShieldCheck className="w-3.5 h-3.5" />
                    <span>{admin?.name || 'Admin'}</span>
                  </div>
                  <button
                    onClick={handleLogout}
                    className="flex items-center gap-1.5 px-3 py-1.5 rounded-lg text-xs font-medium text-rose-600 hover:bg-rose-50 hover:text-rose-700 transition"
                    title="Sign Out"
                  >
                    <LogOut className="w-3.5 h-3.5" />
                    <span>Logout</span>
                  </button>
                </div>

                <button
                  onClick={handleLogout}
                  className="md:hidden p-2 rounded-lg text-rose-600 hover:bg-rose-50"
                  title="Logout"
                >
                  <LogOut className="w-4 h-4" />
                </button>
              </>
            ) : (
              <Link
                to="/admin/login"
                className={`flex items-center gap-1.5 px-3.5 py-2 rounded-lg text-sm font-medium transition ${
                  isActive('/admin/login')
                    ? 'bg-slate-900 text-white'
                    : 'bg-slate-800 text-white hover:bg-slate-900 shadow-xs'
                }`}
              >
                <LogIn className="w-4 h-4" />
                <span>Admin Login</span>
              </Link>
            )}
          </nav>
        </div>
      </div>
    </header>
  );
};
