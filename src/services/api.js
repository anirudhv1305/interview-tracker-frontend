import axios from 'axios';
import { toast } from 'react-toastify';

const API_URL = process.env.REACT_APP_API_URL || 'http://localhost:8080';

const api = axios.create({
  baseURL: `${API_URL}/api`,
  headers: { 'Content-Type': 'application/json' }
});

api.interceptors.request.use(config => {
  const token = localStorage.getItem('token');
  if (token) config.headers.Authorization = `Bearer ${token}`;
  return config;
});

api.interceptors.response.use(
  response => response,
  error => {
    if (error.response?.status === 401 || error.response?.status === 403) {
      localStorage.removeItem('token');
      window.dispatchEvent(new Event('auth-expired'));
    }
    const message = error.response?.data?.message || 'An error occurred';
    toast.error(message);
    return Promise.reject(error);
  }
);

export const authService = {
  register: (data) => api.post('/auth/register', data),
  login: (data) => api.post('/auth/login', data)
};

export const jobService = {
  getAll: () => api.get('/jobs'),
  create: (data) => api.post('/jobs', data),
  update: (id, data) => api.put(`/jobs/${id}`, data),
  delete: (id) => api.delete(`/jobs/${id}`)
};

export const analyticsService = {
  get: () => api.get('/analytics')
};

export const interviewService = {
  getAll: () => api.get('/interviews'), create: (data) => api.post('/interviews', data),
  update: (id, data) => api.put(`/interviews/${id}`, data), delete: (id) => api.delete(`/interviews/${id}`),
  moveToStatus: (id) => api.post(`/interviews/${id}/move-to-status`)
};
export const profileService = {
  getResume: () => api.get('/profile/resume'),
  updateResume: (resumeUrl) => api.put('/profile/resume', { resumeUrl }),
  uploadResume: (file) => { const data = new FormData(); data.append('file', file); return api.post('/profile/resume/upload', data, { headers: { 'Content-Type': 'multipart/form-data' } }); },
  getUploadedResume: () => api.get('/profile/resume/file', { responseType: 'blob' })
};
