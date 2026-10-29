import React, { useState, useEffect } from 'react';
import { askAITutor, getProgress } from '../services/api';
import { Sparkles, Send, Bot, User, HelpCircle, Code, CheckCircle, RefreshCw } from 'lucide-react';

export default function AITutor() {
  const [query, setQuery] = useState('');
  const [currentTopic, setCurrentTopic] = useState('JavaScript Fundamentals');
  const [careerGoal, setCareerGoal] = useState('MERN Stack Developer');
  const [messages, setMessages] = useState([
    {
      sender: 'ai',
      text: 'Hello! I am your AI Learning Tutor. I know your current learning goal and topic. Ask me any question, request a code example, or ask for a practice problem!',
      practiceQuestion: null
    }
  ]);
  const [loading, setLoading] = useState(false);
  const [selectedPracticeOption, setSelectedPracticeOption] = useState(null);

  useEffect(() => {
    fetchContext();
  }, []);

  const fetchContext = async () => {
    try {
      const res = await getProgress();
      if (res.data && res.data.data) {
        setCurrentTopic(res.data.data.currentTopic || 'JavaScript Fundamentals');
        setCareerGoal(res.data.data.careerGoal || 'MERN Stack Developer');
      }
    } catch (err) {
      console.error('Error fetching tutor context:', err);
    }
  };

  const handleSend = async (e) => {
    e.preventDefault();
    if (!query.trim() || loading) return;

    const userText = query.trim();
    setQuery('');
    setSelectedPracticeOption(null);

    const newMessages = [...messages, { sender: 'user', text: userText }];
    setMessages(newMessages);
    setLoading(true);

    try {
      const res = await askAITutor({
        query: userText,
        currentTopic,
        chatHistory: newMessages.slice(-4)
      });

      const tutorReply = res.data.data;
      setMessages([
        ...newMessages,
        {
          sender: 'ai',
          text: tutorReply.reply,
          practiceQuestion: tutorReply.practiceQuestion
        }
      ]);
    } catch (err) {
      setMessages([
        ...newMessages,
        {
          sender: 'ai',
          text: 'I had trouble connecting to the AI server. Focus on your current topic prerequisites and practice code in the editor!',
          practiceQuestion: null
        }
      ]);
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="min-h-screen bg-[#0b0f19] p-4 lg:p-8 max-w-4xl mx-auto flex flex-col space-y-6">
      {/* Header Banner */}
      <div className="bg-gradient-to-r from-slate-900 via-slate-900 to-blue-950/40 border border-slate-800 rounded-3xl p-6 shadow-xl shadow-blue-950/10 flex items-center justify-between gap-4">
        <div>
          <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-blue-500/10 border border-blue-500/20 text-blue-400 text-xs font-semibold uppercase tracking-wider mb-2">
            <Sparkles className="w-3.5 h-3.5" />
            Interactive AI Tutor
          </div>
          <h1 className="text-2xl font-extrabold text-white tracking-tight">24/7 AI Learning Assistant</h1>
          <p className="text-xs text-slate-300 mt-1">
            Goal: <strong className="text-blue-400 font-semibold">{careerGoal}</strong> • Currently Learning: <strong className="text-sky-400 font-semibold">{currentTopic}</strong>
          </p>
        </div>
        <Bot className="w-12 h-12 text-blue-400 shrink-0 hidden sm:block" />
      </div>

      {/* Chat Conversation Area */}
      <div className="bg-slate-900/90 border border-slate-800 rounded-3xl p-6 flex-1 min-h-[420px] flex flex-col justify-between space-y-4 shadow-xl">
        <div className="space-y-4 max-h-[500px] overflow-y-auto pr-2">
          {messages.map((msg, idx) => (
            <div
              key={idx}
              className={`flex gap-3 text-xs leading-relaxed ${
                msg.sender === 'user' ? 'justify-end' : 'justify-start'
              }`}
            >
              {msg.sender === 'ai' && (
                <div className="w-8 h-8 rounded-xl bg-blue-500/10 border border-blue-500/20 text-blue-400 flex items-center justify-center shrink-0">
                  <Bot className="w-4 h-4" />
                </div>
              )}

              <div
                className={`p-4 rounded-2xl max-w-lg space-y-3 ${
                  msg.sender === 'user'
                    ? 'bg-blue-600 text-white rounded-tr-none shadow-sm shadow-blue-600/20'
                    : 'bg-slate-950 border border-slate-800 text-slate-200 rounded-tl-none'
                }`}
              >
                <div className="whitespace-pre-wrap">{msg.text}</div>

                {/* Optional Generated Practice Question */}
                {msg.practiceQuestion && (
                  <div className="mt-3 p-4 rounded-xl bg-slate-900 border border-slate-800 space-y-3">
                    <span className="text-[11px] font-bold text-sky-400 uppercase tracking-wider block">
                      💡 Practice Question
                    </span>
                    <p className="font-semibold text-white">{msg.practiceQuestion.question}</p>

                    <div className="space-y-1.5">
                      {msg.practiceQuestion.options.map((opt, optIdx) => {
                        const isSelected = selectedPracticeOption === optIdx;
                        const isCorrect = optIdx === msg.practiceQuestion.correctAnswer;
                        return (
                          <button
                            key={optIdx}
                            onClick={() => setSelectedPracticeOption(optIdx)}
                            className={`w-full text-left px-3 py-2 rounded-lg text-xs transition flex items-center justify-between border ${
                              isSelected
                                ? isCorrect
                                  ? 'bg-emerald-500/20 border-emerald-500 text-emerald-300 font-bold'
                                  : 'bg-rose-500/20 border-rose-500 text-rose-300 font-bold'
                                : 'bg-slate-950 border-slate-800 text-slate-300 hover:border-slate-700'
                            }`}
                          >
                            <span>{opt}</span>
                            {isSelected && (
                              <span className="text-[10px] uppercase font-bold">
                                {isCorrect ? '✓ Correct' : '✗ Incorrect'}
                              </span>
                            )}
                          </button>
                        );
                      })}
                    </div>

                    {selectedPracticeOption !== null && (
                      <p className="text-[11px] text-slate-400 pt-1 border-t border-slate-800">
                        {msg.practiceQuestion.explanation}
                      </p>
                    )}
                  </div>
                )}
              </div>

              {msg.sender === 'user' && (
                <div className="w-8 h-8 rounded-xl bg-slate-800 border border-slate-700 text-slate-300 flex items-center justify-center shrink-0">
                  <User className="w-4 h-4" />
                </div>
              )}
            </div>
          ))}

          {loading && (
            <div className="flex items-center gap-2 text-xs text-blue-400">
              <RefreshCw className="w-4 h-4 animate-spin" />
              AI Tutor is analyzing and generating response...
            </div>
          )}
        </div>

        {/* Input Bar */}
        <form onSubmit={handleSend} className="pt-4 border-t border-slate-800 flex gap-3">
          <input
            type="text"
            value={query}
            onChange={(e) => setQuery(e.target.value)}
            placeholder={`Ask about ${currentTopic} (e.g. "What is closure?", "Give me an example")...`}
            className="flex-1 bg-slate-950 border border-slate-800 rounded-xl px-4 py-3 text-xs text-slate-100 placeholder-slate-500 focus:outline-none focus:border-blue-500"
          />
          <button
            type="submit"
            disabled={loading || !query.trim()}
            className="px-5 py-3 rounded-xl bg-blue-600 hover:bg-blue-500 text-white text-xs font-semibold flex items-center gap-2 shadow-sm shadow-blue-600/20 transition disabled:opacity-50"
          >
            Send <Send className="w-3.5 h-3.5" />
          </button>
        </form>
      </div>
    </div>
  );
}
