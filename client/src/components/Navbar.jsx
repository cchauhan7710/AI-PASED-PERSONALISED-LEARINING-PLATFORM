import React from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { useAuth } from '../context/AuthContext';
import { Compass, User, LogOut, Sparkles, BookOpen } from 'lucide-react';

export default function Navbar() {
  const { user, logoutUser } = useAuth();
  const navigate = useNavigate();

  const handleLogout = () => {
    logoutUser();
    navigate('/login');
  };

  return (
    <nav className="bg-slate-900/90 backdrop-blur-md border-b border-slate-800/80 sticky top-0 z-50 px-4 lg:px-8 py-3">
      <div className="max-w-7xl mx-auto flex items-center justify-between">
        {/* Brand Logo */}
        <Link to={user ? "/dashboard" : "/"} className="flex items-center gap-3 group">
          <div className="w-10 h-10 rounded-xl bg-gradient-to-tr from-blue-600 to-sky-500 flex items-center justify-center text-white shadow-md shadow-blue-500/20 group-hover:scale-105 transition-transform">
            <Compass className="w-6 h-6 animate-pulse-slow" />
          </div>
          <div>
            <span className="font-bold text-lg text-white tracking-tight flex items-center gap-1.5">
              PathGen <span className="text-[11px] px-2 py-0.5 rounded-full bg-blue-500/10 text-blue-400 border border-blue-500/20 font-medium">AI 2.0</span>
            </span>
            <p className="text-[11px] text-slate-400 -mt-0.5 font-normal">Personalized Learning Roadmap</p>
          </div>
        </Link>

        {/* Navigation Links */}
        <div className="flex items-center gap-4">
          {user ? (
            <>
              <Link to="/dashboard" className="hidden sm:flex items-center gap-2 text-sm text-slate-300 hover:text-white px-3 py-1.5 rounded-lg hover:bg-slate-800 transition">
                <BookOpen className="w-4 h-4 text-blue-400" />
                Dashboard
              </Link>
              <Link to="/roadmap" className="hidden sm:flex items-center gap-2 text-sm text-slate-300 hover:text-white px-3 py-1.5 rounded-lg hover:bg-slate-800 transition">
                <Compass className="w-4 h-4 text-sky-400" />
                Roadmap
              </Link>
              <Link to="/ai-tutor" className="flex items-center gap-2 text-sm bg-blue-500/10 hover:bg-blue-500/20 text-blue-300 border border-blue-500/25 px-3 py-1.5 rounded-lg transition font-medium">
                <Sparkles className="w-4 h-4 text-blue-400" />
                AI Tutor
              </Link>

              <div className="flex items-center gap-3 pl-3 border-l border-slate-800">
                <div className="w-8 h-8 rounded-full bg-slate-800 border border-slate-700 flex items-center justify-center text-blue-400 font-bold text-xs">
                  {user.name ? user.name[0].toUpperCase() : 'S'}
                </div>
                <span className="text-xs text-slate-300 font-medium hidden md:inline">{user.name}</span>
                <button
                  onClick={handleLogout}
                  className="text-slate-400 hover:text-rose-400 p-2 rounded-lg hover:bg-slate-800/80 transition"
                  title="Logout"
                >
                  <LogOut className="w-4 h-4" />
                </button>
              </div>
            </>
          ) : (
            <>
              <Link to="/login" className="text-sm font-medium text-slate-300 hover:text-white px-4 py-2 rounded-lg hover:bg-slate-800 transition">
                Log In
              </Link>
              <Link to="/register" className="text-sm font-medium bg-blue-600 hover:bg-blue-500 text-white px-4 py-2 rounded-lg shadow-md shadow-blue-600/25 transition">
                Get Started
              </Link>
            </>
          )}
        </div>
      </div>
    </nav>
  );
}
