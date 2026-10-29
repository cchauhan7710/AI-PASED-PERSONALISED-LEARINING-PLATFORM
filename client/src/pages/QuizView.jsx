import React, { useState, useEffect } from 'react';
import { useParams, Link, useNavigate } from 'react-router-dom';
import { getQuiz, submitQuiz } from '../services/api';
import { Award, AlertTriangle, CheckCircle, ArrowRight, RefreshCw, Sparkles, HelpCircle } from 'lucide-react';

export default function QuizView() {
  const { topicName } = useParams();
  const navigate = useNavigate();

  const [questions, setQuestions] = useState([]);
  const [answers, setAnswers] = useState({});
  const [loading, setLoading] = useState(true);
  const [submitting, setSubmitting] = useState(false);
  const [result, setResult] = useState(null);

  useEffect(() => {
    fetchQuiz();
  }, [topicName]);

  const fetchQuiz = async () => {
    try {
      setLoading(true);
      const res = await getQuiz(topicName);
      setQuestions(res.data.questions || []);
    } catch (err) {
      console.error('Error fetching quiz:', err);
    } finally {
      setLoading(false);
    }
  };

  const handleOptionSelect = (qId, optionIdx) => {
    setAnswers({ ...answers, [qId]: optionIdx });
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setSubmitting(true);
    try {
      const res = await submitQuiz(topicName, { userAnswers: answers });
      setResult(res.data.data);
    } catch (err) {
      console.error('Error submitting quiz:', err);
    } finally {
      setSubmitting(false);
    }
  };

  if (loading) {
    return (
      <div className="min-h-screen bg-[#0b0f19] flex flex-col items-center justify-center text-slate-400">
        <RefreshCw className="w-8 h-8 animate-spin text-blue-500 mb-3" />
        <p className="text-sm">Loading Quiz Questions for {topicName}...</p>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-[#0b0f19] p-4 lg:p-8 flex justify-center">
      <div className="max-w-3xl w-full bg-slate-900/90 border border-slate-800 rounded-3xl p-6 sm:p-10 shadow-xl space-y-8">
        {/* Header */}
        <div className="border-b border-slate-800 pb-6 flex items-center justify-between">
          <div>
            <span className="text-xs font-bold text-blue-400 bg-blue-500/10 border border-blue-500/20 px-3 py-1 rounded-full uppercase tracking-wider">
              Topic Quiz
            </span>
            <h1 className="text-2xl sm:text-3xl font-extrabold text-white mt-2 tracking-tight">{topicName} Quiz</h1>
            <p className="text-xs text-slate-400 mt-1">Test your knowledge to unlock subsequent modules.</p>
          </div>
        </div>

        {result ? (
          <div className="space-y-6">
            {/* Score Banner */}
            <div className={`p-8 rounded-2xl border text-center space-y-3 ${
              result.passed
                ? 'bg-emerald-500/10 border-emerald-500/20'
                : 'bg-rose-500/10 border-rose-500/20'
            }`}>
              {result.passed ? (
                <CheckCircle className="w-12 h-12 text-emerald-400 mx-auto" />
              ) : (
                <AlertTriangle className="w-12 h-12 text-rose-400 mx-auto" />
              )}

              <h2 className="text-2xl font-bold text-white">
                {result.passed ? 'Quiz Passed!' : 'Needs Revision'}
              </h2>

              <div className="text-4xl font-extrabold text-white">
                {result.percentage}% <span className="text-sm font-normal text-slate-400">({result.score}/{result.totalQuestions} Correct)</span>
              </div>

              <p className="text-xs text-slate-300 max-w-md mx-auto">{result.feedback}</p>
            </div>

            {/* AI Recommendation Message */}
            <div className="p-5 rounded-2xl bg-slate-950 border border-slate-800 space-y-2">
              <h4 className="text-sm font-bold text-blue-400 flex items-center gap-2">
                <Sparkles className="w-4 h-4" /> AI Adaptive Recommendation
              </h4>
              <p className="text-xs text-slate-300 leading-relaxed">{result.aiRecommendation}</p>
            </div>

            {/* Navigation Buttons */}
            <div className="pt-4 border-t border-slate-800 flex flex-col sm:flex-row items-center justify-between gap-3">
              <Link to="/roadmap" className="w-full sm:w-auto px-6 py-3 rounded-xl bg-slate-950 border border-slate-800 text-xs text-slate-300 font-semibold text-center hover:bg-slate-800 transition">
                Return to Roadmap
              </Link>

              <Link to="/dashboard" className="w-full sm:w-auto px-6 py-3 rounded-xl bg-blue-600 hover:bg-blue-500 text-white text-xs font-semibold text-center flex items-center justify-center gap-2 shadow-md shadow-blue-600/20 transition">
                Go to Student Dashboard <ArrowRight className="w-4 h-4" />
              </Link>
            </div>
          </div>
        ) : (
          <form onSubmit={handleSubmit} className="space-y-6">
            <div className="space-y-6">
              {questions.map((q, idx) => (
                <div key={q.questionId} className="p-5 rounded-2xl bg-slate-950 border border-slate-800 space-y-4">
                  <div className="flex items-center justify-between">
                    <span className="text-xs font-semibold text-blue-400">Question {idx + 1} of {questions.length}</span>
                  </div>

                  <h3 className="text-sm font-semibold text-white">{q.question}</h3>

                  <div className="grid grid-cols-1 gap-2 pt-1">
                    {q.options.map((option, optIdx) => {
                      const isSelected = answers[q.questionId] === optIdx;
                      return (
                        <button
                          key={optIdx}
                          type="button"
                          onClick={() => handleOptionSelect(q.questionId, optIdx)}
                          className={`w-full text-left px-4 py-3 rounded-xl text-xs font-medium transition flex items-center justify-between border ${
                            isSelected
                              ? 'bg-blue-600/10 text-white border-blue-500 shadow-sm'
                              : 'bg-slate-900 text-slate-300 border-slate-800 hover:border-slate-700'
                          }`}
                        >
                          <span>{option}</span>
                          <div className={`w-3.5 h-3.5 rounded-full border ${isSelected ? 'bg-blue-500 border-blue-400' : 'border-slate-600'}`} />
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
                className="px-8 py-3.5 rounded-xl bg-blue-600 hover:bg-blue-500 text-white font-semibold text-xs flex items-center gap-2 shadow-md shadow-blue-600/25 transition disabled:opacity-50"
              >
                {submitting ? 'Submitting Quiz...' : 'Submit Quiz & Update Adaptive Path'}
                <ArrowRight className="w-4 h-4" />
              </button>
            </div>
          </form>
        )}
      </div>
    </div>
  );
}
