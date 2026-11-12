import React from 'react';
import { BookOpen, GraduationCap } from 'lucide-react';

export const Footer: React.FC = () => {
  return (
    <footer className="mt-auto bg-white border-t border-slate-200">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
        <div className="flex flex-col sm:flex-row items-center justify-between gap-4">
          <div className="flex items-center gap-2 text-slate-700">
            <div className="w-8 h-8 rounded-lg bg-indigo-600 flex items-center justify-center text-white">
              <BookOpen className="w-4 h-4" />
            </div>
            <span className="font-semibold tracking-tight text-slate-900">
              EduForge LMS
            </span>
            <span className="text-xs text-slate-400">|</span>
            <span className="text-xs text-slate-500">
              Industrial Training Recruitment Task
            </span>
          </div>

          <div className="flex items-center gap-6 text-sm text-slate-500">
            <span className="flex items-center gap-1.5 text-xs text-slate-400">
              <GraduationCap className="w-4 h-4 text-indigo-500" />
              Simplified Full-Stack Learning System
            </span>
          </div>
        </div>

        <div className="mt-6 pt-6 border-t border-slate-100 flex flex-col sm:flex-row items-center justify-between text-xs text-slate-400 gap-2">
          <p>© {new Date().getFullYear()} DataPollex Ltd. Assessment Submission. Built with MERN Stack.</p>
          <p className="text-slate-400">Frontend: React + TS | Backend: Node + Express + MongoDB</p>
        </div>
      </div>
    </footer>
  );
};
