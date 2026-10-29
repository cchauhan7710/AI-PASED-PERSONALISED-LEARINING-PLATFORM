import React from 'react';
import { Routes, Route, Navigate } from 'react-router-dom';
import { useAuth } from './context/AuthContext';

import MainLayout from './layouts/MainLayout';
import LandingPage from './pages/LandingPage';
import Login from './pages/Login';
import Register from './pages/Register';
import ProfileSetup from './pages/ProfileSetup';
import Assessment from './pages/Assessment';
import RoadmapView from './pages/RoadmapView';
import TopicDetail from './pages/TopicDetail';
import QuizView from './pages/QuizView';
import AITutor from './pages/AITutor';
import Dashboard from './pages/Dashboard';

const ProtectedRoute = ({ children }) => {
  const { user, loading } = useAuth();
  if (loading) return null;
  if (!user) return <Navigate to="/login" replace />;
  return children;
};

export default function App() {
  return (
    <Routes>
      <Route element={<MainLayout />}>
        {/* Public Routes */}
        <Route path="/" element={<LandingPage />} />
        <Route path="/login" element={<Login />} />
        <Route path="/register" element={<Register />} />

        {/* Protected Routes */}
        <Route path="/profile-setup" element={<ProtectedRoute><ProfileSetup /></ProtectedRoute>} />
        <Route path="/assessment" element={<ProtectedRoute><Assessment /></ProtectedRoute>} />
        <Route path="/roadmap" element={<ProtectedRoute><RoadmapView /></ProtectedRoute>} />
        <Route path="/topic/:topicName" element={<ProtectedRoute><TopicDetail /></ProtectedRoute>} />
        <Route path="/quiz/:topicName" element={<ProtectedRoute><QuizView /></ProtectedRoute>} />
        <Route path="/ai-tutor" element={<ProtectedRoute><AITutor /></ProtectedRoute>} />
        <Route path="/dashboard" element={<ProtectedRoute><Dashboard /></ProtectedRoute>} />
        <Route path="/profile" element={<ProtectedRoute><ProfileSetup /></ProtectedRoute>} />

        {/* Catch all fallback */}
        <Route path="*" element={<Navigate to="/" replace />} />
      </Route>
    </Routes>
  );
}
