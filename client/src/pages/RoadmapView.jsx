import React, { useState, useEffect } from 'react';
import { Link } from 'react-router-dom';
import { getRoadmap, updateTopicStatus } from '../services/api';
import { MapPin, Clock, BookOpen, CheckCircle, Circle, ArrowRight, Sparkles, AlertCircle, RefreshCw, ChevronDown, ChevronUp } from 'lucide-react';

export default function RoadmapView() {
  const [roadmap, setRoadmap] = useState(null);
  const [loading, setLoading] = useState(true);
  const [expandedTopic, setExpandedTopic] = useState(null);
  const [updating, setUpdating] = useState(false);

  useEffect(() => {
    fetchRoadmap();
  }, []);

  const fetchRoadmap = async () => {
    try {
      setLoading(true);
      const res = await getRoadmap();
      setRoadmap(res.data.data);
    } catch (err) {
      console.error('Error fetching roadmap:', err);
    } finally {
      setLoading(false);
    }
  };

  const handleToggleComplete = async (topicName, currentStatus) => {
    try {
      setUpdating(true);
      await updateTopicStatus({
        topicName,
        isCompleted: !currentStatus
      });
      fetchRoadmap();
    } catch (err) {
      console.error('Error updating topic status:', err);
    } finally {
      setUpdating(false);
    }
  };

  if (loading) {
    return (
      <div className="min-h-screen bg-[#0b0f19] flex flex-col items-center justify-center text-slate-400">
        <RefreshCw className="w-8 h-8 animate-spin text-blue-500 mb-3" />
        <p className="text-sm">Loading AI Personalized Learning Path Roadmap...</p>
      </div>
    );
  }

  if (!roadmap) {
    return (
      <div className="min-h-screen bg-[#0b0f19] p-8 text-center text-slate-300">
        <p>No active roadmap found. Please complete the diagnostic assessment.</p>
        <Link to="/assessment" className="inline-block mt-4 px-6 py-2.5 rounded-xl bg-blue-600 hover:bg-blue-500 text-white text-sm font-semibold transition">
          Take Skill Assessment
        </Link>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-[#0b0f19] p-4 lg:p-8 max-w-6xl mx-auto space-y-8">
      {/* Header Banner */}
      <div className="bg-gradient-to-r from-slate-900 via-slate-900 to-blue-950/40 border border-slate-800 rounded-3xl p-6 sm:p-10 shadow-xl shadow-blue-950/10 relative overflow-hidden space-y-4">
        <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
          <div>
            <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-blue-500/10 border border-blue-500/20 text-blue-400 text-xs font-semibold uppercase tracking-wider mb-2">
              <Sparkles className="w-3.5 h-3.5" />
              AI Personalized Roadmap
            </div>
            <h1 className="text-2xl sm:text-4xl font-extrabold text-white tracking-tight">
              Goal: {roadmap.goal}
            </h1>
            <p className="text-slate-300 text-sm mt-2 max-w-2xl leading-relaxed">
              {roadmap.summary}
            </p>
          </div>

          <div className="bg-slate-950/80 border border-slate-800 rounded-2xl p-4 text-center shrink-0 min-w-[140px]">
            <span className="text-xs text-slate-400 block uppercase font-medium">Est. Duration</span>
            <span className="text-xl font-bold text-blue-400">{roadmap.estimatedDuration}</span>
          </div>
        </div>

        {roadmap.status === 're-adjusted' && (
          <div className="p-3.5 rounded-xl bg-amber-500/10 border border-amber-500/20 text-amber-300 text-xs flex items-center gap-2">
            <AlertCircle className="w-4 h-4 shrink-0 text-amber-400" />
            <span>
              <strong>Adaptive Adjustment Triggered:</strong> Additional practice or revision modules were dynamically inserted based on your quiz performance.
            </span>
          </div>
        )}
      </div>

      {/* Timeline Phases */}
      <div className="space-y-8 relative">
        {roadmap.phases.map((phase) => (
          <div key={phase.phase} className="space-y-4">
            {/* Phase Header */}
            <div className="flex items-center gap-3">
              <div className="w-9 h-9 rounded-xl bg-blue-600 text-white font-extrabold flex items-center justify-center text-sm shadow-sm shadow-blue-600/25">
                {phase.phase}
              </div>
              <div>
                <h2 className="text-lg font-bold text-white flex items-center gap-3">
                  {phase.title}
                  <span className="text-xs font-semibold text-slate-400 bg-slate-900 border border-slate-800 px-2.5 py-0.5 rounded-full">
                    {phase.duration}
                  </span>
                </h2>
                <p className="text-xs text-slate-400 mt-0.5">{phase.reason}</p>
              </div>
            </div>

            {/* Topics Cards */}
            <div className="grid grid-cols-1 gap-4 pl-0 sm:pl-12">
              {phase.topics.map((topic) => {
                const isExpanded = expandedTopic === topic.name;

                let difficultyColor = 'bg-emerald-500/10 text-emerald-400 border-emerald-500/20';
                if (topic.difficulty === 'Basic') difficultyColor = 'bg-sky-500/10 text-sky-400 border-sky-500/20';
                if (topic.difficulty === 'Intermediate') difficultyColor = 'bg-amber-500/10 text-amber-400 border-amber-500/20';
                if (topic.difficulty === 'Advanced') difficultyColor = 'bg-rose-500/10 text-rose-400 border-rose-500/20';

                return (
                  <div
                    key={topic.name}
                    className={`rounded-2xl border transition ${
                      topic.isCompleted
                        ? 'bg-slate-900/40 border-slate-800/60 opacity-85'
                        : 'bg-slate-900/90 border border-slate-800 hover:border-slate-700 shadow-md'
                    }`}
                  >
                    <div className="p-5 sm:p-6 flex flex-col sm:flex-row sm:items-center justify-between gap-4">
                      {/* Left Details */}
                      <div className="space-y-2 flex-1">
                        <div className="flex flex-wrap items-center gap-2">
                          <button
                            onClick={() => handleToggleComplete(topic.name, topic.isCompleted)}
                            className="flex items-center gap-2 group text-left"
                            title="Click to toggle completion status"
                          >
                            {topic.isCompleted ? (
                              <CheckCircle className="w-5 h-5 text-emerald-400 shrink-0" />
                            ) : (
                              <Circle className="w-5 h-5 text-slate-600 group-hover:text-blue-400 shrink-0 transition" />
                            )}
                            <h3 className={`text-base font-bold text-white ${topic.isCompleted ? 'line-through text-slate-400' : ''}`}>
                              {topic.name}
                            </h3>
                          </button>

                          <span className={`px-2.5 py-0.5 rounded-full text-[11px] font-bold border ${difficultyColor}`}>
                            {topic.difficulty}
                          </span>

                          <span className="text-[11px] text-slate-400 flex items-center gap-1">
                            <Clock className="w-3.5 h-3.5 text-slate-500" /> {topic.estimatedHours} hrs
                          </span>
                        </div>

                        <p className="text-xs text-slate-300 leading-relaxed max-w-3xl">{topic.description}</p>

                        {topic.whyRecommended && (
                          <p className="text-[11px] text-blue-400 font-medium bg-blue-500/5 px-3 py-1 rounded-lg border border-blue-500/15 inline-block">
                            💡 <strong>Why Recommended:</strong> {topic.whyRecommended}
                          </p>
                        )}

                        {topic.prerequisites && topic.prerequisites.length > 0 && (
                          <div className="flex items-center gap-1.5 text-[11px] text-slate-400 pt-1">
                            <span>Prerequisites:</span>
                            {topic.prerequisites.map((p) => (
                              <span key={p} className="bg-slate-950 border border-slate-800 px-2 py-0.5 rounded text-slate-300 font-medium">
                                {p}
                              </span>
                            ))}
                          </div>
                        )}
                      </div>

                      {/* Action Buttons */}
                      <div className="flex items-center gap-2 shrink-0 border-t sm:border-t-0 border-slate-800 pt-3 sm:pt-0">
                        <button
                          onClick={() => setExpandedTopic(isExpanded ? null : topic.name)}
                          className="px-3 py-2 rounded-xl bg-slate-950 hover:bg-slate-800 border border-slate-800 text-xs text-slate-300 font-medium flex items-center gap-1.5 transition"
                        >
                          Resources {isExpanded ? <ChevronUp className="w-3.5 h-3.5" /> : <ChevronDown className="w-3.5 h-3.5" />}
                        </button>

                        <Link
                          to={`/topic/${encodeURIComponent(topic.name)}`}
                          className="px-4 py-2 rounded-xl bg-blue-600 hover:bg-blue-500 text-white text-xs font-semibold flex items-center gap-1.5 shadow-sm shadow-blue-600/20 transition"
                        >
                          Study & Take Quiz <ArrowRight className="w-3.5 h-3.5" />
                        </Link>
                      </div>
                    </div>

                    {/* Collapsible Resources Drawer */}
                    {isExpanded && (
                      <div className="border-t border-slate-800 p-5 bg-slate-950/60 rounded-b-2xl space-y-3">
                        <h4 className="text-xs font-bold text-slate-300 uppercase tracking-wider flex items-center gap-2">
                          <BookOpen className="w-4 h-4 text-blue-400" /> Curated Learning Resources
                        </h4>
                        <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
                          {(topic.resources || []).map((res, rIdx) => (
                            <a
                              key={rIdx}
                              href={res.url}
                              target="_blank"
                              rel="noopener noreferrer"
                              className="p-3 rounded-xl bg-slate-900 border border-slate-800 hover:border-blue-500/40 text-xs flex items-center justify-between transition group"
                            >
                              <div>
                                <span className="font-semibold text-slate-200 group-hover:text-blue-300 block">{res.title}</span>
                                <span className="text-[10px] text-slate-500">{res.type} • {res.estimatedTime || '30 mins'}</span>
                              </div>
                              <ArrowRight className="w-3.5 h-3.5 text-slate-500 group-hover:text-blue-400 group-hover:translate-x-0.5 transition" />
                            </a>
                          ))}
                        </div>
                      </div>
                    )}
                  </div>
                );
              })}
            </div>
          </div>
        ))}
      </div>
    </div>
  );
}
