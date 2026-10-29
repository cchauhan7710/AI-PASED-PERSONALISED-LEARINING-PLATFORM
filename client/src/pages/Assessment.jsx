import React, { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { getAssessmentQuestions, submitAssessment, generateRoadmap, getProfile } from '../services/api';
import { CheckCircle, AlertTriangle, ArrowRight, Brain, Award, BarChart2, Sparkles, RefreshCw } from 'lucide-react';

export default function Assessment() {
  const navigate = useNavigate();

  const [careerGoal, setCareerGoal] = useState('MERN Stack Developer');
  const [questions, setQuestions] = useState([]);
  const [answers, setAnswers] = useState({});
  const [loading, setLoading] = useState(true);
  const [submitting, setSubmitting] = useState(false);
  const [generating, setGenerating] = useState(false);
  const [result, setResult] = useState(null);

  useEffect(() => {
    const fetchQuestions = async () => {
      try {
        setLoading(true);
        const profRes = await getProfile().catch(() => null);
        const goal = profRes?.data?.data?.careerGoal || 'MERN Stack Developer';
        setCareerGoal(goal);

        const res = await getAssessmentQuestions(goal);
        setQuestions(res.data.questions || []);
      } catch (err) {
        console.error('Error fetching questions:', err);
      } finally {
        setLoading(false);
      }
    };
    fetchQuestions();
  }, []);

  const handleOptionSelect = (qId, optionIdx) => {
    setAnswers({ ...answers, [qId]: optionIdx });
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setSubmitting(true);
    try {
      const res = await submitAssessment({
        careerGoal,
        userAnswers: answers
      });
      setResult(res.data.data);
    } catch (err) {
      console.error('Error submitting assessment:', err);
    } finally {
      setSubmitting(false);
    }
  };

  const handleGenerateRoadmap = async () => {
    setGenerating(true);
    try {
      await generateRoadmap();
      navigate('/roadmap');
    } catch (err) {
      console.error('Error generating roadmap:', err);
    } finally {
      setGenerating(false);
    }
  };

  if (loading) {
    return (
      <div className="min-h-screen bg-[#0b0f19] flex flex-col items-center justify-center text-slate-400">
        <RefreshCw className="w-8 h-8 animate-spin text-blue-500 mb-3" />
        <p className="text-sm">Loading Diagnostic Questions for {careerGoal}...</p>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-[#0b0f19] p-4 lg:p-8 flex justify-center">
      <div className="max-w-4xl w-full bg-slate-900/90 border border-slate-800 rounded-3xl p-6 sm:p-10 shadow-xl space-y-8">
        {/* Header */}
        <div className="border-b border-slate-800 pb-6 flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4">
          <div>
            <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-blue-500/10 border border-blue-500/20 text-blue-400 text-xs font-semibold uppercase tracking-wider mb-2">
              <Brain className="w-3.5 h-3.5" />
              Diagnostic Skill Assessment
            </div>
            <h1 className="text-2xl sm:text-3xl font-extrabold text-white tracking-tight">Skill Evaluation: {careerGoal}</h1>
            <p className="text-xs text-slate-400 mt-1">Answer questions to evaluate your baseline skill levels accurately.</p>
          </div>
        </div>

        {/* If result already generated, display Skill Gap Breakdown */}
        {result ? (
          <div className="space-y-8">
            <div className="bg-gradient-to-r from-slate-900 via-slate-900 to-blue-950/40 border border-slate-800 rounded-2xl p-6 sm:p-8 text-center space-y-4">
              <Award className="w-12 h-12 text-blue-400 mx-auto" />
              <h2 className="text-2xl font-bold text-white">Assessment Complete!</h2>
              <div className="text-4xl font-extrabold text-blue-400">
                {result.percentage}% <span className="text-sm font-normal text-slate-400">Overall Score ({result.totalScore}/{result.totalQuestions})</span>
              </div>
            </div>

            {/* Skill Level Table / Badges */}
            <div className="space-y-4">
              <h3 className="text-lg font-bold text-white flex items-center gap-2">
                <BarChart2 className="w-5 h-5 text-blue-400" /> Skill Breakdown & Score Levels
              </h3>
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
                {result.skillBreakdown.map((sb) => {
                  let badgeColor = 'bg-emerald-500/10 text-emerald-400 border-emerald-500/20';
                  if (sb.level === 'Beginner') badgeColor = 'bg-rose-500/10 text-rose-400 border-rose-500/20';
                  if (sb.level === 'Basic') badgeColor = 'bg-amber-500/10 text-amber-400 border-amber-500/20';
                  if (sb.level === 'Intermediate') badgeColor = 'bg-sky-500/10 text-sky-400 border-sky-500/20';

                  return (
                    <div key={sb.skill} className="p-4 rounded-xl bg-slate-950 border border-slate-800 flex items-center justify-between">
                      <div>
                        <span className="font-semibold text-white text-sm">{sb.skill}</span>
                        <p className="text-xs text-slate-400">{sb.score}/{sb.total} Correct ({sb.percentage}%)</p>
                      </div>
                      <span className={`px-3 py-1 rounded-full text-xs font-bold border ${badgeColor}`}>
                        {sb.level}
                      </span>
                    </div>
                  );
                })}
              </div>
            </div>

            {/* Skill Gap Categories (Strong vs Needs Improvement vs Missing) */}
            <div className="grid grid-cols-1 sm:grid-cols-3 gap-4">
              <div className="p-5 rounded-2xl bg-slate-950 border border-emerald-500/20">
                <h4 className="text-sm font-bold text-emerald-400 flex items-center gap-2 mb-3">
                  <CheckCircle className="w-4 h-4" /> Strong Skills
                </h4>
                <div className="flex flex-wrap gap-1.5">
                  {result.strongSkills && result.strongSkills.length > 0 ? (
                    result.strongSkills.map((s) => (
                      <span key={s} className="px-2.5 py-1 rounded-lg bg-emerald-500/10 text-emerald-300 text-xs font-medium border border-emerald-500/20">{s}</span>
                    ))
                  ) : (
                    <span className="text-xs text-slate-500 italic">None identified</span>
                  )}
                </div>
              </div>

              <div className="p-5 rounded-2xl bg-slate-950 border border-amber-500/20">
                <h4 className="text-sm font-bold text-amber-400 flex items-center gap-2 mb-3">
                  <AlertTriangle className="w-4 h-4" /> Needs Improvement
                </h4>
                <div className="flex flex-wrap gap-1.5">
                  {result.improvementSkills && result.improvementSkills.length > 0 ? (
                    result.improvementSkills.map((s) => (
                      <span key={s} className="px-2.5 py-1 rounded-lg bg-amber-500/10 text-amber-300 text-xs font-medium border border-amber-500/20">{s}</span>
                    ))
                  ) : (
                    <span className="text-xs text-slate-500 italic">None identified</span>
                  )}
                </div>
              </div>

              <div className="p-5 rounded-2xl bg-slate-950 border border-rose-500/20">
                <h4 className="text-sm font-bold text-rose-400 flex items-center gap-2 mb-3">
                  <Brain className="w-4 h-4" /> Missing Prerequisites
                </h4>
                <div className="flex flex-wrap gap-1.5">
                  {result.missingSkills && result.missingSkills.length > 0 ? (
                    result.missingSkills.map((s) => (
                      <span key={s} className="px-2.5 py-1 rounded-lg bg-rose-500/10 text-rose-300 text-xs font-medium border border-rose-500/20">{s}</span>
                    ))
                  ) : (
                    <span className="text-xs text-slate-500 italic">None identified</span>
                  )}
                </div>
              </div>
            </div>

            {/* CTA button to generate roadmap */}
            <div className="pt-6 border-t border-slate-800 text-center">
              <button
                onClick={handleGenerateRoadmap}
                disabled={generating}
                className="w-full sm:w-auto px-10 py-4 rounded-2xl bg-blue-600 hover:bg-blue-500 text-white font-bold text-sm flex items-center justify-center gap-3 shadow-md shadow-blue-600/25 transition hover:scale-[1.02]"
              >
                {generating ? (
                  <>
                    <RefreshCw className="w-5 h-5 animate-spin" />
                    AI Generating Personalized Roadmap...
                  </>
                ) : (
                  <>
                    <Sparkles className="w-5 h-5" />
                    Generate AI Personalized Roadmap
                    <ArrowRight className="w-5 h-5" />
                  </>
                )}
              </button>
            </div>
          </div>
        ) : (
          /* Question Form */
          <form onSubmit={handleSubmit} className="space-y-8">
            <div className="space-y-6">
              {questions.map((q, idx) => (
                <div key={q.questionId} className="p-5 sm:p-6 rounded-2xl bg-slate-950 border border-slate-800 space-y-4">
                  <div className="flex items-center justify-between gap-2">
                    <span className="text-xs font-semibold text-blue-400 bg-blue-500/10 px-2.5 py-1 rounded-md border border-blue-500/20">
                      Question {idx + 1} of {questions.length} • {q.skill}
                    </span>
                    <span className="text-[11px] text-slate-400 uppercase tracking-wider">{q.difficulty}</span>
                  </div>

                  <h3 className="text-base font-semibold text-white">{q.question}</h3>

                  <div className="grid grid-cols-1 gap-2.5 pt-2">
                    {q.options.map((option, optIdx) => {
                      const isSelected = answers[q.questionId] === optIdx;
                      return (
                        <button
                          key={optIdx}
                          type="button"
                          onClick={() => handleOptionSelect(q.questionId, optIdx)}
                          className={`w-full text-left px-4 py-3 rounded-xl text-sm font-medium transition flex items-center justify-between border ${
                            isSelected
                              ? 'bg-blue-600/10 text-white border-blue-500 shadow-sm'
                              : 'bg-slate-900 text-slate-300 border-slate-800 hover:border-slate-700'
                          }`}
                        >
                          <span>{option}</span>
                          <div className={`w-4 h-4 rounded-full border ${isSelected ? 'bg-blue-500 border-blue-400' : 'border-slate-600'}`} />
                        </button>
                      );
                    })}
                  </div>
                </div>
              ))}
            </div>

            <div className="pt-4 border-t border-slate-800 flex justify-end">
              <button
                type="submit"
                disabled={submitting || Object.keys(answers).length === 0}
                className="px-8 py-3.5 rounded-xl bg-blue-600 hover:bg-blue-500 text-white font-semibold text-sm flex items-center gap-2 shadow-md shadow-blue-600/25 transition disabled:opacity-50"
              >
                {submitting ? 'Evaluating Assessment...' : 'Submit Answers & Calculate Skill Level'}
                <ArrowRight className="w-4 h-4" />
              </button>
            </div>
          </form>
        )}
      </div>
    </div>
  );
}
