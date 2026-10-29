import React, { useState, useEffect } from 'react';
import { Link } from 'react-router-dom';
import { getProgress, getRoadmap } from '../services/api';
import { useAuth } from '../context/AuthContext';
import { ResponsiveContainer, BarChart, Bar, XAxis, YAxis, Tooltip, Cell, AreaChart, Area } from 'recharts';
import { LayoutDashboard, Award, Flame, Clock, CheckCircle, ArrowRight, Sparkles, MapPin, RefreshCw, BookOpen } from 'lucide-react';

export default function Dashboard() {
  const { user } = useAuth();

  const [progress, setProgress] = useState(null);
  const [roadmap, setRoadmap] = useState(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    fetchDashboardData();
  }, []);

  const fetchDashboardData = async () => {
    try {
      setLoading(true);
      const [progRes, roadRes] = await Promise.all([
        getProgress().catch(() => null),
        getRoadmap().catch(() => null)
      ]);

      if (progRes?.data?.data) {
        setProgress(progRes.data.data);
      }
      if (roadRes?.data?.data) {
        setRoadmap(roadRes.data.data);
      }
    } catch (err) {
      console.error('Error fetching dashboard data:', err);
    } finally {
      setLoading(false);
    }
  };

  if (loading) {
    return (
      <div className="min-h-screen bg-[#0b0f19] flex flex-col items-center justify-center text-slate-400">
        <RefreshCw className="w-8 h-8 animate-spin text-blue-500 mb-3" />
        <p className="text-sm">Loading Student Dashboard...</p>
      </div>
    );
  }

  const skillData = progress?.skillProgress || [
    { skill: 'HTML', percentage: 90 },
    { skill: 'CSS', percentage: 70 },
    { skill: 'JavaScript', percentage: 40 },
    { skill: 'React', percentage: 20 },
    { skill: 'Node.js', percentage: 10 },
    { skill: 'MongoDB', percentage: 0 }
  ];

  const weeklyData = [
    { day: 'Mon', hours: 2.5 },
    { day: 'Tue', hours: 3.0 },
    { day: 'Wed', hours: 1.5 },
    { day: 'Thu', hours: 4.0 },
    { day: 'Fri', hours: 2.0 },
    { day: 'Sat', hours: 3.5 },
    { day: 'Sun', hours: 2.0 }
  ];

  // Professional harmonious data visualization palette (Deep Cobalt -> Electric Blue -> Cyan -> Teal -> Emerald)
  const barColors = ['#2563eb', '#3b82f6', '#0ea5e9', '#06b6d4', '#14b8a6', '#10b981'];

  return (
    <div className="min-h-screen bg-[#0b0f19] p-4 lg:p-8 max-w-7xl mx-auto space-y-8">
      {/* Welcome Banner */}
      <div className="bg-gradient-to-r from-slate-900 via-slate-900 to-blue-950/40 border border-slate-800 rounded-3xl p-6 sm:p-10 shadow-xl shadow-blue-950/10 flex flex-col md:flex-row md:items-center justify-between gap-6">
        <div className="space-y-2">
          <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-blue-500/10 border border-blue-500/20 text-blue-400 text-xs font-semibold uppercase tracking-wider">
            <Sparkles className="w-3.5 h-3.5" />
            Student Overview
          </div>
          <h1 className="text-2xl sm:text-4xl font-extrabold text-white tracking-tight">
            Welcome Back, {user?.name || 'Student'}! 👋
          </h1>
          <p className="text-xs sm:text-sm text-slate-300">
            Goal: <strong className="text-blue-400 font-semibold">{progress?.careerGoal || 'MERN Stack Developer'}</strong> • Target Duration: <strong className="text-sky-400 font-semibold">{progress?.estimatedDuration || '10 weeks'}</strong>
          </p>
        </div>

        <Link
          to="/roadmap"
          className="px-6 py-3.5 rounded-2xl bg-blue-600 hover:bg-blue-500 text-white font-bold text-xs flex items-center justify-center gap-2 shadow-md shadow-blue-600/25 transition hover:scale-[1.02] shrink-0"
        >
          <MapPin className="w-4 h-4" /> View Full Roadmap
        </Link>
      </div>

      {/* Top 4 Metrics Row */}
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
        {/* Overall Progress */}
        <div className="p-5 rounded-2xl bg-slate-900/90 border border-slate-800 space-y-2.5">
          <div className="flex items-center justify-between text-slate-400 text-xs font-semibold uppercase">
            <span>Overall Progress</span>
            <Award className="w-4 h-4 text-blue-400" />
          </div>
          <div className="text-3xl font-extrabold text-white">
            {progress?.overallProgressPercentage || 25}%
          </div>
          <div className="w-full bg-slate-950 h-2 rounded-full overflow-hidden border border-slate-800/80">
            <div
              className="bg-gradient-to-r from-blue-600 to-sky-500 h-full rounded-full transition-all duration-500"
              style={{ width: `${progress?.overallProgressPercentage || 25}%` }}
            />
          </div>
        </div>

        {/* Streak */}
        <div className="p-5 rounded-2xl bg-slate-900/90 border border-slate-800 space-y-2.5">
          <div className="flex items-center justify-between text-slate-400 text-xs font-semibold uppercase">
            <span>Learning Streak</span>
            <Flame className="w-4 h-4 text-amber-400" />
          </div>
          <div className="text-3xl font-extrabold text-white flex items-baseline gap-1">
            {progress?.learningStreakDays || 4} <span className="text-xs text-slate-400 font-medium">Days Active</span>
          </div>
          <p className="text-[11px] text-emerald-400 font-medium">🔥 Consistent daily study streak!</p>
        </div>

        {/* Study Time */}
        <div className="p-5 rounded-2xl bg-slate-900/90 border border-slate-800 space-y-2.5">
          <div className="flex items-center justify-between text-slate-400 text-xs font-semibold uppercase">
            <span>Weekly Study Time</span>
            <Clock className="w-4 h-4 text-sky-400" />
          </div>
          <div className="text-3xl font-extrabold text-white">
            {progress?.weeklyStudyHours || 14} <span className="text-xs text-slate-400 font-medium">Hours</span>
          </div>
          <p className="text-[11px] text-slate-400">Target: 10 hrs/week satisfied</p>
        </div>

        {/* Completed Topics */}
        <div className="p-5 rounded-2xl bg-slate-900/90 border border-slate-800 space-y-2.5">
          <div className="flex items-center justify-between text-slate-400 text-xs font-semibold uppercase">
            <span>Completed Topics</span>
            <CheckCircle className="w-4 h-4 text-emerald-400" />
          </div>
          <div className="text-3xl font-extrabold text-white">
            {progress?.completedTopics?.length || 2} <span className="text-xs text-slate-400 font-medium">Modules</span>
          </div>
          <p className="text-[11px] text-slate-400 truncate">Current: {progress?.currentTopic || 'JavaScript Fundamentals'}</p>
        </div>
      </div>

      {/* AI Recommendation Alert Card */}
      <div className="p-5 rounded-2xl bg-slate-900/80 border border-slate-800 flex flex-col sm:flex-row items-start sm:items-center justify-between gap-4">
        <div className="flex items-start gap-3">
          <div className="w-9 h-9 rounded-xl bg-blue-500/10 border border-blue-500/20 text-blue-400 flex items-center justify-center shrink-0 mt-0.5">
            <Sparkles className="w-5 h-5" />
          </div>
          <div>
            <h4 className="text-sm font-bold text-blue-300">AI Recommendation</h4>
            <p className="text-xs text-slate-300 mt-0.5 leading-relaxed">
              “Spend 3 more hours practicing JavaScript functions and array methods before unlocking the React Hooks module.”
            </p>
          </div>
        </div>

        <Link
          to={`/topic/${encodeURIComponent(progress?.currentTopic || 'JavaScript Fundamentals')}`}
          className="px-4 py-2 rounded-xl bg-blue-600 hover:bg-blue-500 text-white text-xs font-semibold shrink-0 transition shadow-sm"
        >
          Resume Study
        </Link>
      </div>

      {/* Recharts Analytics Section */}
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        {/* Skill Progress Bar Chart */}
        <div className="p-6 rounded-2xl bg-slate-900/90 border border-slate-800 space-y-4">
          <div className="flex items-center justify-between">
            <h3 className="text-base font-bold text-white flex items-center gap-2">
              <Award className="w-5 h-5 text-blue-400" /> Skill Level Mastery Breakdown
            </h3>
            <span className="text-xs text-slate-400 font-medium">% Competency</span>
          </div>

          <div className="h-64 w-full">
            <ResponsiveContainer width="100%" height="100%">
              <BarChart data={skillData} layout="vertical" margin={{ top: 5, right: 30, left: 20, bottom: 5 }}>
                <XAxis type="number" domain={[0, 100]} stroke="#64748b" fontSize={11} />
                <YAxis dataKey="skill" type="category" stroke="#94a3b8" fontSize={12} width={80} />
                <Tooltip
                  contentStyle={{ backgroundColor: '#0f172a', borderColor: '#334155', borderRadius: '10px', color: '#f8fafc', fontSize: '12px' }}
                />
                <Bar dataKey="percentage" radius={[0, 6, 6, 0]}>
                  {skillData.map((entry, index) => (
                    <Cell key={`cell-${index}`} fill={barColors[index % barColors.length]} />
                  ))}
                </Bar>
              </BarChart>
            </ResponsiveContainer>
          </div>
        </div>

        {/* Weekly Progress Area Chart */}
        <div className="p-6 rounded-2xl bg-slate-900/90 border border-slate-800 space-y-4">
          <div className="flex items-center justify-between">
            <h3 className="text-base font-bold text-white flex items-center gap-2">
              <Clock className="w-5 h-5 text-sky-400" /> Weekly Learning Activity
            </h3>
            <span className="text-xs text-slate-400 font-medium">Hours Studied / Day</span>
          </div>

          <div className="h-64 w-full">
            <ResponsiveContainer width="100%" height="100%">
              <AreaChart data={weeklyData} margin={{ top: 10, right: 30, left: 0, bottom: 0 }}>
                <defs>
                  <linearGradient id="colorHours" x1="0" y1="0" x2="0" y2="1">
                    <stop offset="5%" stopColor="#3b82f6" stopOpacity={0.4}/>
                    <stop offset="95%" stopColor="#3b82f6" stopOpacity={0}/>
                  </linearGradient>
                </defs>
                <XAxis dataKey="day" stroke="#64748b" fontSize={12} />
                <YAxis stroke="#64748b" fontSize={12} />
                <Tooltip
                  contentStyle={{ backgroundColor: '#0f172a', borderColor: '#334155', borderRadius: '10px', color: '#f8fafc', fontSize: '12px' }}
                />
                <Area type="monotone" dataKey="hours" stroke="#3b82f6" strokeWidth={2} fillOpacity={1} fill="url(#colorHours)" />
              </AreaChart>
            </ResponsiveContainer>
          </div>
        </div>
      </div>
    </div>
  );
}
