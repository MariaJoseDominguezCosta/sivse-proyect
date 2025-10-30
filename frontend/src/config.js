// src/utils/axiosConfig.js
import axios from 'axios';

const api = axios.create({
  baseURL: 'http://localhost:5000/api', // Ajusta al puerto del backend
});

api.interceptors.request.use((config) => {
    const token = localStorage.getItem('token');
    if (token) {
        config.headers.Authorization = `Bearer ${token}`;
    }
    return config;
});

export const API_BASE_URL = 'http://localhost:5000/api';
export const API_ADMIN_URL = 'http://localhost:5000/api/admin';

export default api;