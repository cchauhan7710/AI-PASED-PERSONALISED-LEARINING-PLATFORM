import React, { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { getProfile, updateProfile } from '../services/api';
import { Target, Clock, BookOpen, Sparkles, CheckCircle2, ChevronRight } from 'lucide-react';

export default function ProfileSetup() {
  const navigate = useNavigate();

  const [educationLevel, setEducationLevel] = useState('Undergraduate');
  const [careerGoalSelect, setCareerGoalSelect] = useState('MERN Stack Developer');
  const [customGoal, setCustomGoal] = useState('');
  const [experienceLevel, setExperienceLevel] = useState('Beginner');
  const [existingSkills, setExistingSkills] = useState(['HTML', 'CSS']);
  const [interests, setInterests] = useState(['Web Development', 'Full Stack Apps']);
  const [dailyStudyHours, setDailyStudyHours] = useState(2);
  const [weeklyStudyDays, setWeeklyStudyDays] = useState(5);
  const [preferredLearningStyle, setPreferredLearningStyle] = useState('Project-based');

  const [loading, setLoading] = useState(false);
  const [saving, setSaving] = useState(false);

  const careerOptions = [
    'MERN Stack Developer',
    'Full Stack Developer',
    'Frontend Developer',
    'Backend Developer',
    'Data Analyst',
    'Data Scientist',
    'AI/ML Engineer',
    'Cybersecurity Engineer',
    'Cloud Engineer',
    'Other'
  ];

  const skillOptions = [
    'HTML', 'CSS', 'JavaScript', 'DOM', 'React', 'Node.js',
    'Express.js', 'MongoDB', 'SQL', 'Python', 'Pandas', 'Git'
  ];

  useEffect(() => {
    const fetchExistingProfile = async () => {
      try {
        setLoading(true);
        const res = await getProfile();
        if (res.data && res.data.data) {
          const p = res.data.data;
          setEducationLevel(p.educationLevel || 'Undergraduate');
          if (careerOptions.includes(p.careerGoal)) {
            setCareerGoalSelect(p.careerGoal);
          } else {
            setCareerGoalSelect('Other');
            setCustomGoal(p.careerGoal);
          }
          setExperienceLevel(p.experienceLevel || 'Beginner');
          setExistingSkills(p.existingSkills || []);
          setInterests(p.interests || []);
          setDailyStudyHours(p.dailyStudyHours || 2);
          setWeeklyStudyDays(p.weeklyStudyDays || 5);
          setPreferredLearningStyle(p.preferredLearningStyle || 'Project-based');
        }
      } catch (err) {
        // No existing profile found, proceed with default
      } finally {
        setLoading(false);
      }
    };
    fetchExistingProfile();
  }, []);

  const toggleSkill = (skill) => {
    if (existingSkills.includes(skill)) {
      setExistingSkills(existingSkills.filter((s) => s !== skill));
    } else {
      setExistingSkills([...existingSkills, skill]);
    }
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setSaving(true);

    const finalGoal = careerGoalSelect === 'Other' ? (customGoal || 'Full Stack Developer') : careerGoalSelect;

    try {
      await updateProfile({
        educationLevel,
        careerGoal: finalGoal,
        experienceLevel,
        existingSkills,
        interests,
        dailyStudyHours: Number(dailyStudyHours),
        weeklyStudyDays: Number(weeklyStudyDays),
        preferredLearningStyle
      });
      setSaving(false);
      navigate('/assessment');
    } catch (err) {
      console.error('Error saving profile:', err);
      setSaving(false);
    }
  };

  return (
    <div className="min-h-screen bg-[#0b0f19] p-4 lg:p-8 flex justify-center">
      <div className="max-w-3xl w-full bg-slate-900/90 border border-slate-800 rounded-3xl p-6 sm:p-10 shadow-xl space-y-8">
        <div className="border-b border-slate-800 pb-6">
          <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-blue-500/10 border border-blue-500/20 text-blue-400 text-xs font-semibold uppercase tracking-wider mb-3">
            <Sparkles className="w-3.5 h-3.5" />
            Step 1 of 2 — Student Profile Setup
          </div>
          <h1 className="text-2xl sm:text-3xl font-extrabold text-white tracking-tight">Create Your Learning Profile</h1>
          <p className="text-slate-400 text-sm mt-1">
            Tell us about your career goals, existing knowledge, and schedule so our AI can craft your personalized path.
          </p>
        </div>

        <form onSubmit={handleSubmit} className="space-y-8">
          {/* Section 1: Career & Education Goal */}
          <div className="space-y-4">
            <h3 className="text-base font-bold text-white flex items-center gap-2">
              <Target className="w-5 h-5 text-blue-400" /> Career Goal & Experience
            </h3>

            <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
              <div>
                <label className="block text-xs font-semibold text-slate-300 uppercase tracking-wider mb-2">Primary Career Goal</label>
                <select
                  value={careerGoalSelect}
                  onChange={(e) => setCareerGoalSelect(e.target.value)}
                  className="w-full bg-slate-950 border border-slate-800 rounded-xl px-4 py-3 text-sm text-slate-100 focus:outline-none focus:border-blue-500"
                >
                  {careerOptions.map((opt) => (
                    <option key={opt} value={opt}>{opt}</option>
                  ))}
                </select>
              </div>

              {careerGoalSelect === 'Other' && (
                <div>
                  <label className="block text-xs font-semibold text-slate-300 uppercase tracking-wider mb-2">Custom Career Goal</label>
                  <input
                    type="text"
                    value={customGoal}
                    onChange={(e) => setCustomGoal(e.target.value)}
                    placeholder="e.g. Blockchain Developer"
                    className="w-full bg-slate-950 border border-slate-800 rounded-xl px-4 py-3 text-sm text-slate-100 focus:outline-none focus:border-blue-500"
                    required
                  />
                </div>
              )}

              <div>
                <label className="block text-xs font-semibold text-slate-300 uppercase tracking-wider mb-2">Education Level</label>
                <select
                  value={educationLevel}
                  onChange={(e) => setEducationLevel(e.target.value)}
                  className="w-full bg-slate-950 border border-slate-800 rounded-xl px-4 py-3 text-sm text-slate-100 focus:outline-none focus:border-blue-500"
                >
                  <option value="High School">High School</option>
                  <option value="Undergraduate">Undergraduate</option>
                  <option value="Postgraduate">Postgraduate</option>
                  <option value="Self-Taught">Self-Taught</option>
                  <option value="Other">Other</option>
                </select>
              </div>

              <div>
                <label className="block text-xs font-semibold text-slate-300 uppercase tracking-wider mb-2">Current Experience Level</label>
                <select
                  value={experienceLevel}
                  onChange={(e) => setExperienceLevel(e.target.value)}
                  className="w-full bg-slate-950 border border-slate-800 rounded-xl px-4 py-3 text-sm text-slate-100 focus:outline-none focus:border-blue-500"
                >
                  <option value="Beginner">Beginner (No prior programming experience)</option>
                  <option value="Intermediate">Intermediate (Familiar with syntax & basics)</option>
                  <option value="Advanced">Advanced (Built projects/applications)</option>
                </select>
              </div>
            </div>
          </div>

          {/* Section 2: Existing Skills Selection */}
          <div className="space-y-4">
            <h3 className="text-base font-bold text-white flex items-center gap-2">
              <BookOpen className="w-5 h-5 text-sky-400" /> Existing Skills & Familiarity
            </h3>
            <p className="text-xs text-slate-400">Select skills you have already studied or used in projects:</p>

            <div className="flex flex-wrap gap-2.5">
              {skillOptions.map((skill) => {
                const isSelected = existingSkills.includes(skill);
                return (
                  <button
                    key={skill}
                    type="button"
                    onClick={() => toggleSkill(skill)}
                    className={`px-4 py-2 rounded-xl text-xs font-semibold flex items-center gap-2 transition ${
                      isSelected
                        ? 'bg-blue-600 text-white border border-blue-500 shadow-sm shadow-blue-600/20'
                        : 'bg-slate-950 text-slate-400 border border-slate-800 hover:border-slate-700'
                    }`}
                  >
                    {isSelected && <CheckCircle2 className="w-3.5 h-3.5" />}
                    {skill}
                  </button>
                );
              })}
            </div>
          </div>

          {/* Section 3: Study Hours & Learning Style */}
          <div className="space-y-4">
            <h3 className="text-base font-bold text-white flex items-center gap-2">
              <Clock className="w-5 h-5 text-blue-400" /> Time Availability & Learning Style
            </h3>

            <div className="grid grid-cols-1 sm:grid-cols-3 gap-4">
              <div>
                <label className="block text-xs font-semibold text-slate-300 uppercase tracking-wider mb-2">
                  Study Hours / Day ({dailyStudyHours} hrs)
                </label>
                <input
                  type="range"
                  min="0.5"
                  max="10"
                  step="0.5"
                  value={dailyStudyHours}
                  onChange={(e) => setDailyStudyHours(e.target.value)}
                  className="w-full accent-blue-500"
                />
              </div>

              <div>
                <label className="block text-xs font-semibold text-slate-300 uppercase tracking-wider mb-2">
                  Study Days / Week ({weeklyStudyDays} days)
                </label>
                <input
                  type="range"
                  min="1"
                  max="7"
                  step="1"
                  value={weeklyStudyDays}
                  onChange={(e) => setWeeklyStudyDays(e.target.value)}
                  className="w-full accent-sky-500"
                />
              </div>

              <div>
                <label className="block text-xs font-semibold text-slate-300 uppercase tracking-wider mb-2">Preferred Learning Style</label>
                <select
                  value={preferredLearningStyle}
                  onChange={(e) => setPreferredLearningStyle(e.target.value)}
                  className="w-full bg-slate-950 border border-slate-800 rounded-xl px-4 py-3 text-sm text-slate-100 focus:outline-none focus:border-blue-500"
                >
                  <option value="Project-based">Project-based</option>
                  <option value="Video-based">Video-based</option>
                  <option value="Reading">Reading Documentation</option>
                  <option value="Practice-based">Practice-based Exercises</option>
                  <option value="Mixed">Mixed Blend</option>
                </select>
              </div>
            </div>
          </div>

          <div className="pt-4 border-t border-slate-800 flex justify-end">
            <button
              type="submit"
              disabled={saving}
              className="px-8 py-3.5 rounded-xl bg-blue-600 hover:bg-blue-500 text-white font-semibold text-sm flex items-center gap-2 shadow-md shadow-blue-600/25 transition disabled:opacity-50"
            >
              {saving ? 'Saving Profile...' : 'Save & Proceed to Skill Assessment'}{' '}
              <ChevronRight className="w-4 h-4" />
            </button>
          </div>
        </form>
      </div>
    </div>
  );
}

