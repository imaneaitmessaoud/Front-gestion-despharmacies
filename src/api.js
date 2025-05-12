// src/api.js
import axios from 'axios';

// Crée une instance Axios avec une base URL
const api = axios.create({
  baseURL: 'http://localhost:8081/api',
  headers: {
    'Content-Type': 'application/json',
  },
});

// Ajoute automatiquement le token JWT (si présent) à chaque requête
api.interceptors.request.use(
  (config) => {
    const token = localStorage.getItem('accessToken');
    if (token) {
      config.headers.Authorization = `Bearer ${token}`;
    }
    return config;
  },
  (error) => Promise.reject(error)
);

export default api;
