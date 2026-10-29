import axios from 'axios';

const rawApiBase = import.meta.env.VITE_API_URL || '/api';
const apiBase = rawApiBase.replace(/\/$/, '');
const normalizedApiBase = apiBase.endsWith('/api') ? apiBase : `${apiBase}/api`;

export const API = axios.create({
  baseURL: normalizedApiBase,
  headers: {
    'Content-Type': 'application/json'
  }
});

API.interceptors.request.use(
  (config) => {
    const token = localStorage.getItem('learning_token');
    if (token) {
      config.headers.Authorization = `Bearer ${token}`;
    }
    return config;
  },
  (error) => Promise.reject(error)
);

export const register = (data) => API.post('/auth/register', data);
export const login = (data) => API.post('/auth/login', data);
export const getMe = () => API.get('/auth/me');

export const getProfile = () => API.get('/profile');
export const updateProfile = (data) => API.put('/profile', data);

export const getAssessmentQuestions = (goal) => API.get(`/assessment/questions?goal=${encodeURIComponent(goal || '')}`);
export const submitAssessment = (data) => API.post('/assessment/submit', data);
export const getAssessmentResults = () => API.get('/assessment/results');

export const generateRoadmap = () => API.post('/learning-path/generate');
export const getRoadmap = () => API.get('/learning-path');
export const updateTopicStatus = (data) => API.put('/learning-path/update-topic-status', data);

export const getTopicDetails = (identifier) => API.get(`/topics/${encodeURIComponent(identifier)}`);
export const getQuiz = (topicName) => API.get(`/quiz/${encodeURIComponent(topicName)}`);
export const submitQuiz = (topicName, data) => API.post(`/quiz/${encodeURIComponent(topicName)}/submit`, data);

export const getProgress = () => API.get('/progress');
export const askAITutor = (data) => API.post('/ai/tutor', data);
export const getAISkillAnalysis = () => API.post('/ai/analyze-skills');