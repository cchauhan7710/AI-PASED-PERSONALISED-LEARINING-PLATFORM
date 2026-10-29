import React from 'react';
import { NavLink } from 'react-router-dom';
import {
  LayoutDashboard,
  MapPin,
  CheckSquare,
  Sparkles,
  User,
  HelpCircle,
  TrendingUp
} from 'lucide-react';

export default function Sidebar() {
  const navItems = [
    { name: 'Dashboard', path: '/dashboard', icon: LayoutDashboard },
    { name: 'Personalized Roadmap', path: '/roadmap', icon: MapPin },
    { name: 'Skill Assessment', path: '/assessment', icon: CheckSquare },
    { name: 'AI Tutor', path: '/ai-tutor', icon: Sparkles },
    { name: 'Student Profile', path: '/profile', icon: User }
  ];

  return (
    <aside className="w-64 bg-slate-900/95 border-r border-slate-800/80 p-4 flex flex-col justify-between hidden md:flex min-h-[calc(100vh-65px)]">
      <div className="space-y-6">
        <div className="px-3 py-2 text-xs font-semibold text-slate-500 uppercase tracking-wider">
          Learning System
        </div>

        <nav className="space-y-1">
          {navItems.map((item) => {
            const Icon = item.icon;
            return (
              <NavLink
                key={item.path}
                to={item.path}
                className={({ isActive }) =>
                  `flex items-center gap-3 px-3.5 py-2.5 rounded-xl text-sm font-medium transition ${
                    isActive
                      ? 'bg-blue-600/10 text-blue-400 border border-blue-500/25 font-semibold shadow-sm'
                      : 'text-slate-400 hover:text-slate-200 hover:bg-slate-800/60'
                  }`
                }
              >
                <Icon className="w-4 h-4" />
                {item.name}
              </NavLink>
            );
          })}
        </nav>
      </div>

      {/* Adaptive Status Card */}
      <div className="bg-slate-950/70 border border-slate-800/80 rounded-2xl p-4 space-y-2.5">
        <div className="flex items-center gap-2 text-xs text-blue-400 font-semibold">
          <TrendingUp className="w-4 h-4" />
          Adaptive Learning
        </div>
        <p className="text-xs text-slate-400 leading-relaxed">
          Roadmap dynamically adjusts based on your quiz performance score.
        </p>
      </div>
    </aside>
  );
}
