import React, { useState, useEffect } from 'react';
import { useParams, Link } from 'react-router-dom';
import { getTopicDetails } from '../services/api';
import { BookOpen, CheckCircle, Code, Award, ArrowRight, ExternalLink, RefreshCw, Sparkles, Terminal } from 'lucide-react';

export default function TopicDetail() {
  const { topicName } = useParams();
  const [topic, setTopic] = useState(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    fetchDetails();
  }, [topicName]);

  const fetchDetails = async () => {
    try {
      setLoading(true);
      const res = await getTopicDetails(topicName);
      setTopic(res.data.data);
    } catch (err) {
      console.error('Error fetching topic details:', err);
    } finally {
      setLoading(false);
    }
  };

  if (loading) {
    return (
      <div className="min-h-screen bg-[#0b0f19] flex flex-col items-center justify-center text-slate-400">
        <RefreshCw className="w-8 h-8 animate-spin text-blue-500 mb-3" />
        <p className="text-sm">Loading Learning Materials for {topicName}...</p>
      </div>
    );
  }

  if (!topic) {
    return (
      <div className="min-h-screen bg-[#0b0f19] p-8 text-center text-slate-300">
        <p>Topic details not found.</p>
        <Link to="/roadmap" className="inline-block mt-4 px-6 py-2.5 rounded-xl bg-blue-600 hover:bg-blue-500 text-white text-sm font-semibold transition">
          Back to Roadmap
        </Link>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-[#0b0f19] p-4 lg:p-8 max-w-5xl mx-auto space-y-8">
      {/* Header Overview Card */}
      <div className="bg-gradient-to-r from-slate-900 via-slate-900 to-blue-950/40 border border-slate-800 rounded-3xl p-6 sm:p-10 shadow-xl shadow-blue-950/10 space-y-4">
        <div className="flex flex-wrap items-center justify-between gap-3">
          <span className="text-xs font-bold text-blue-400 bg-blue-500/10 border border-blue-500/20 px-3 py-1 rounded-full uppercase tracking-wider">
            {topic.category || 'Core Skill'} • {topic.difficulty || 'Beginner'}
          </span>
          <span className="text-xs text-slate-400 font-medium">
            Est. Study Time: {topic.estimatedHours || 4} Hours
          </span>
        </div>

        <h1 className="text-3xl sm:text-4xl font-extrabold text-white tracking-tight">{topic.name}</h1>
        <p className="text-slate-300 text-sm leading-relaxed max-w-3xl">{topic.description}</p>
      </div>

      {/* Grid: Objectives & Resources */}
      <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
        {/* Objectives */}
        <div className="bg-slate-900/90 border border-slate-800 rounded-2xl p-6 space-y-4">
          <h3 className="text-base font-bold text-white flex items-center gap-2">
            <CheckCircle className="w-5 h-5 text-emerald-400" /> Learning Objectives
          </h3>
          <ul className="space-y-3">
            {(topic.learningObjectives || [
              'Understand fundamental syntax and structure',
              'Master standard design patterns and functions',
              'Implement clean code practices'
            ]).map((obj, idx) => (
              <li key={idx} className="flex items-start gap-2.5 text-xs text-slate-300 leading-relaxed">
                <span className="w-5 h-5 rounded-full bg-emerald-500/10 text-emerald-400 flex items-center justify-center shrink-0 text-[10px] font-bold mt-0.5">
                  ✓
                </span>
                {obj}
              </li>
            ))}
          </ul>
        </div>

        {/* Resources */}
        <div className="bg-slate-900/90 border border-slate-800 rounded-2xl p-6 space-y-4">
          <h3 className="text-base font-bold text-white flex items-center gap-2">
            <BookOpen className="w-5 h-5 text-blue-400" /> Recommended Learning Resources
          </h3>
          <div className="space-y-2.5">
            {(topic.resources || [
              { title: 'Official Documentation & Guide', type: 'Documentation', url: 'https://developer.mozilla.org', estimatedTime: '45 mins' }
            ]).map((res, rIdx) => (
              <a
                key={rIdx}
                href={res.url}
                target="_blank"
                rel="noopener noreferrer"
                className="p-3.5 rounded-xl bg-slate-950 border border-slate-800 hover:border-blue-500/40 text-xs flex items-center justify-between transition group"
              >
                <div>
                  <span className="font-semibold text-slate-200 group-hover:text-blue-300 block">{res.title}</span>
                  <span className="text-[11px] text-slate-400">{res.type} • {res.estimatedTime || '30 mins'}</span>
                </div>
                <ExternalLink className="w-4 h-4 text-slate-500 group-hover:text-blue-400 transition" />
              </a>
            ))}
          </div>
        </div>
      </div>

      {/* Practice Exercise & Starter Code */}
      {topic.practiceExercise && (
        <div className="bg-slate-900/90 border border-slate-800 rounded-2xl p-6 space-y-4">
          <h3 className="text-base font-bold text-white flex items-center gap-2">
            <Code className="w-5 h-5 text-sky-400" /> Practice Exercise: {topic.practiceExercise.title}
          </h3>
          <p className="text-xs text-slate-300">{topic.practiceExercise.instructions}</p>

          <div className="bg-slate-950 border border-slate-800 rounded-xl p-4 font-mono text-xs text-sky-300 relative overflow-x-auto">
            <div className="flex items-center justify-between text-[11px] text-slate-500 border-b border-slate-800 pb-2 mb-3">
              <span className="flex items-center gap-1.5"><Terminal className="w-3.5 h-3.5" /> Starter Code</span>
            </div>
            <pre>{topic.practiceExercise.starterCode}</pre>
          </div>
        </div>
      )}

      {/* Mini Project */}
      {topic.miniProject && (
        <div className="bg-slate-900/90 border border-slate-800 rounded-2xl p-6 space-y-3">
          <h3 className="text-base font-bold text-white flex items-center gap-2">
            <Award className="w-5 h-5 text-amber-400" /> Hands-On Mini Project: {topic.miniProject.title}
          </h3>
          <p className="text-xs text-slate-300 leading-relaxed">{topic.miniProject.description}</p>
        </div>
      )}

      {/* Footer Quiz Action */}
      <div className="pt-6 border-t border-slate-800 flex flex-col sm:flex-row items-center justify-between gap-4">
        <Link to="/roadmap" className="text-xs text-slate-400 hover:text-white transition">
          ← Back to Roadmap
        </Link>

        <Link
          to={`/quiz/${encodeURIComponent(topic.name)}`}
          className="w-full sm:w-auto px-8 py-3.5 rounded-xl bg-blue-600 hover:bg-blue-500 text-white font-bold text-sm flex items-center justify-center gap-2 shadow-md shadow-blue-600/25 transition hover:scale-[1.02]"
        >
          <Sparkles className="w-4 h-4" /> Take Topic Knowledge Quiz <ArrowRight className="w-4 h-4" />
        </Link>
      </div>
    </div>
  );
}
