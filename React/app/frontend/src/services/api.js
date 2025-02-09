import axios from 'axios';
import config from '../config/config';

const api = axios.create({
  baseURL: config.apiUrl,
  withCredentials: true,
});

export const authService = {
  login: (credentials) => api.post('/login', credentials),
  register: (userData) => api.post('/register', userData),
  logout: () => api.post('/logout'),
};

export const uploadService = {
  uploadFile: (formData) => api.post('/upload', formData),
  getUploads: (userId) => api.get(`/uploads?user_id=${userId}`),
  analyzeFile: (uploadId) => api.post(`/analyze/${uploadId}`),
};

export default api;