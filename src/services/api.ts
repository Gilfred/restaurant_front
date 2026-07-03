// services/api.ts
import axios, { AxiosInstance, AxiosError } from 'axios';

const API_BASE_URL = import.meta.env.VITE_API_BASE_URL || 'http://localhost:8000';

const api: AxiosInstance = axios.create({
  baseURL: API_BASE_URL,
  withCredentials: true, // pour envoyer les cookies HttpOnly
  headers: {
    'Content-Type': 'application/json',
  },
});

// Intercepteur pour gérer les erreurs 401 (non authentifié)
api.interceptors.response.use(
  (response) => response,
  (error: AxiosError) => {
    if (error.response?.status === 401) {
      // Tu peux dispatcher un event ou appeler une fonction de déconnexion
      // Exemple : window.location.href = '/login';
      console.warn('Non authentifié, redirection vers login');
    }
    return Promise.reject(error);
  }
);

export default api;