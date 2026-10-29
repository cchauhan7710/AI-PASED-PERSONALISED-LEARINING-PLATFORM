import React, { createContext, useState, useEffect, useContext } from 'react';
import { getMe, login as loginApi, register as registerApi } from '../services/api';

const AuthContext = createContext();

export const AuthProvider = ({ children }) => {
  const [user, setUser] = useState(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  useEffect(() => {
    const checkLoggedIn = async () => {
      const token = localStorage.getItem('learning_token');
      if (token) {
        try {
          const res = await getMe();
          setUser(res.data.data);
        } catch (err) {
          console.error('Token verification failed:', err);
          localStorage.removeItem('learning_token');
          setUser(null);
        }
      }
      setLoading(false);
    };
    checkLoggedIn();
  }, []);

  const loginUser = async (email, password) => {
    setError(null);
    try {
      const res = await loginApi({ email, password });
      const { token, ...userData } = res.data.data;
      localStorage.setItem('learning_token', token);
      setUser(userData);
      return { success: true };
    } catch (err) {
      const msg = err.response?.data?.message || 'Login failed';
      setError(msg);
      return { success: false, message: msg };
    }
  };

  const registerUser = async (name, email, password, confirmPassword) => {
    setError(null);
    try {
      const res = await registerApi({ name, email, password, confirmPassword });
      const { token, ...userData } = res.data.data;
      localStorage.setItem('learning_token', token);
      setUser(userData);
      return { success: true };
    } catch (err) {
      const msg = err.response?.data?.message || 'Registration failed';
      setError(msg);
      return { success: false, message: msg };
    }
  };

  const logoutUser = () => {
    localStorage.removeItem('learning_token');
    setUser(null);
  };

  return (
    <AuthContext.Provider
      value={{
        user,
        loading,
        error,
        loginUser,
        registerUser,
        logoutUser
      }}
    >
      {children}
    </AuthContext.Provider>
  );
};

export const useAuth = () => useContext(AuthContext);
