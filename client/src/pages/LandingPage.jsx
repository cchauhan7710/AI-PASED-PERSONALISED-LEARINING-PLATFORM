import React from 'react';
import { Link } from 'react-router-dom';
import { Sparkles, Compass, ShieldCheck, Target, ArrowRight, Brain, Zap, Clock, BookOpen, ChevronRight } from 'lucide-react';

export default function LandingPage() {
  return (
    <div className="min-h-screen bg-[#0b0f19] text-slate-100 flex flex-col">
      {/* Hero Section */}
      <div className="relative overflow-hidden pt-20 pb-16 px-4 lg:px-8 max-w-7xl mx-auto w-full text-center">
        {/* Glow Effects */}
        <div className="absolute top-1/4 left-1/2 -translate-x-1/2 -translate-y-1/2 w-96 h-96 bg-blue-600/10 rounded-full blur-3xl pointer-events-none" />
        <div className="absolute top-1/3 left-1/3 w-64 h-64 bg-sky-600/10 rounded-full blur-3xl pointer-events-none" />

        <div className="inline-flex items-center gap-2 px-4 py-1.5 rounded-full bg-blue-500/10 border border-blue-500/20 text-blue-400 text-xs font-semibold uppercase tracking-wider mb-8 animate-pulse-slow">
          <Sparkles className="w-3.5 h-3.5" />
          AI-Powered Personalized Learning Path Engine
        </div>

        <h1 className="text-4xl sm:text-6xl font-extrabold text-white tracking-tight max-w-4xl mx-auto leading-tight">
          Your goals. Your skills. <br />
          <span className="bg-gradient-to-r from-white via-slate-100 to-blue-400 bg-clip-text text-transparent">
            Your personalized learning path.
          </span>
        </h1>

        <p className="mt-6 text-lg sm:text-xl text-slate-300 max-w-2xl mx-auto leading-relaxed font-normal">
          Stop following rigid static tutorials. Our intelligent system analyzes your current knowledge, skill gaps, time commitment, and preferred learning style to generate an adaptive AI roadmap.
        </p>

        <div className="mt-10 flex flex-col sm:flex-row items-center justify-center gap-4">
          <Link
            to="/register"
            className="w-full sm:w-auto px-8 py-4 rounded-xl bg-blue-600 hover:bg-blue-500 text-white font-semibold flex items-center justify-center gap-2 shadow-md shadow-blue-600/25 transition hover:scale-[1.02]"
          >
            Get Started Free <ArrowRight className="w-5 h-5" />
          </Link>
          <Link
            to="/login"
            className="w-full sm:w-auto px-8 py-4 rounded-xl bg-slate-900/90 hover:bg-slate-800 border border-slate-800 text-slate-200 font-semibold transition"
          >
            Existing Student Login
          </Link>
        </div>

        {/* Feature Cards Grid */}
        <div className="mt-20 grid grid-cols-1 md:grid-cols-3 gap-6 text-left">
          <div className="p-6 rounded-2xl bg-slate-900/90 border border-slate-800 hover:border-blue-500/40 transition group shadow-sm">
            <div className="w-12 h-12 rounded-xl bg-blue-500/10 border border-blue-500/20 text-blue-400 flex items-center justify-center mb-4 group-hover:scale-105 transition">
              <Brain className="w-6 h-6" />
            </div>
            <h3 className="text-lg font-bold text-white mb-2">1. AI Skill Gap Analysis</h3>
            <p className="text-sm text-slate-400 leading-relaxed">
              Take a diagnostic assessment. The AI identifies strong skills, missing prerequisites, and exact areas needing improvement.
            </p>
          </div>

          <div className="p-6 rounded-2xl bg-slate-900/90 border border-slate-800 hover:border-sky-500/40 transition group shadow-sm">
            <div className="w-12 h-12 rounded-xl bg-sky-500/10 border border-sky-500/20 text-sky-400 flex items-center justify-center mb-4 group-hover:scale-105 transition">
              <Compass className="w-6 h-6" />
            </div>
            <h3 className="text-lg font-bold text-white mb-2">2. Structured Prerequisites</h3>
            <p className="text-sm text-slate-400 leading-relaxed">
              No random learning loops. Roadmaps strictly enforce logical prerequisite graphs (e.g. JavaScript before React).
            </p>
          </div>

          <div className="p-6 rounded-2xl bg-slate-900/90 border border-slate-800 hover:border-emerald-500/40 transition group shadow-sm">
            <div className="w-12 h-12 rounded-xl bg-emerald-500/10 border border-emerald-500/20 text-emerald-400 flex items-center justify-center mb-4 group-hover:scale-105 transition">
              <Zap className="w-6 h-6" />
            </div>
            <h3 className="text-lg font-bold text-white mb-2">3. Adaptive Roadmap</h3>
            <p className="text-sm text-slate-400 leading-relaxed">
              Quiz scores dynamically trigger path re-adjustments. Perform poorly? Remedial modules are injected. Excel? Fast-track ahead.
            </p>
          </div>
        </div>

        {/* How It Works Section */}
        <div className="mt-28 border-t border-slate-800/80 pt-16 text-left">
          <div className="text-center mb-12">
            <h2 className="text-3xl font-extrabold text-white tracking-tight">How PathGen Works</h2>
            <p className="text-slate-400 mt-2 text-sm">6 simple steps to personalized career mastery</p>
          </div>

          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6">
            {[
              { step: '01', title: 'Profile Setup', desc: 'Specify your career goal, daily study hours, and preferred learning style.' },
              { step: '02', title: 'Diagnostic Assessment', desc: 'Answer targeted questions to evaluate your baseline skill scores.' },
              { step: '03', title: 'AI Analysis', desc: 'AI categorizes skills into Strong, Improving, and Missing.' },
              { step: '04', title: 'Personalized Roadmap', desc: 'Generate a structured phase-by-phase timeline with curated resources.' },
              { step: '05', title: 'Topic Quizzes', desc: 'Take 3-minute quizzes after each topic to test comprehension.' },
              { step: '06', title: 'Adaptive Re-evaluation', desc: 'AI continuously updates your path based on your real performance.' }
            ].map((s, idx) => (
              <div key={idx} className="p-5 rounded-2xl bg-slate-900/60 border border-slate-800 flex gap-4 items-start">
                <span className="text-sm font-bold text-blue-400 bg-blue-500/10 px-3 py-1.5 rounded-lg border border-blue-500/20">
                  {s.step}
                </span>
                <div>
                  <h4 className="font-semibold text-white text-base">{s.title}</h4>
                  <p className="text-xs text-slate-400 mt-1 leading-relaxed">{s.desc}</p>
                </div>
              </div>
            ))}
          </div>
        </div>

        {/* CTA Footer Banner */}
        <div className="mt-24 bg-gradient-to-r from-slate-900 via-slate-900 to-blue-950/40 border border-slate-800 rounded-3xl p-10 text-center relative overflow-hidden shadow-xl shadow-blue-950/10">
          <h2 className="text-2xl sm:text-3xl font-bold text-white mb-4 tracking-tight">Ready to accelerate your learning?</h2>
          <p className="text-slate-300 text-sm max-w-xl mx-auto mb-6">
            Join thousands of students building personalized learning paths for MERN Stack, Data Science, and DevOps.
          </p>
          <Link
            to="/register"
            className="inline-flex items-center gap-2 px-8 py-3.5 rounded-xl bg-blue-600 hover:bg-blue-500 text-white font-semibold transition shadow-md shadow-blue-600/25"
          >
            Create Your Custom Roadmap Now <ChevronRight className="w-4 h-4" />
          </Link>
        </div>
      </div>
    </div>
  );
}
