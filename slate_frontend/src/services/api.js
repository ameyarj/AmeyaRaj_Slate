import axios from 'axios';

const API_URL = 'http://localhost:8000/api';

const api = axios.create({
  baseURL: API_URL,
});

api.interceptors.request.use((config) => {
  const token = localStorage.getItem('token');
  if (token) {
    config.headers.Authorization = `Bearer ${token}`;
  }
  return config;
});

export const login = (email, password, role) =>
  axios.post(`${API_URL.replace('/api', '')}/auth/login/`, { email, password, role });

export const getAchievements = () =>
  api.get('/student/achievements/');

export const createAchievement = (data) =>
  api.post('/student/achievements/', data);

export const signup = (userData) =>
  axios.post(`${API_URL.replace('/api', '')}/auth/signup/`, userData);

export const getStudents = () => 
  axios.get(`${API_URL.replace('/api', '')}/auth/students/`);

export const forgotPassword = (email) =>
  axios.post(`${API_URL.replace('/api', '')}/auth/forgot-password/`, { email });

export const resetPassword = (token, password) =>
  axios.post(`${API_URL.replace('/api', '')}/auth/reset-password/${token}/`, { password });

export default api;
