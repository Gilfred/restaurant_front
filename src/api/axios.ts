import axios from "axios";

export const API_URL = import.meta.env?.VITE_API_URL || "http://127.0.0.1:8000";

export const api = axios.create({
  baseURL: API_URL,
  withCredentials: true,
  headers: {
    "Content-Type": "application/json",
  },
});

// Intercepteur de requête pour ajouter le token Authorization Bearer
api.interceptors.request.use(
  (config) => {
    if (typeof localStorage !== "undefined") {
      const token = localStorage.getItem("access_token");
      if (token) {
        config.headers.Authorization = `Bearer ${token}`;
      }
    }
    return config;
  },
  (error) => Promise.reject(error)
);

// Intercepteur de réponse
api.interceptors.response.use(
  (response) => response,
  (error) => {
    // Si la session a expiré (401 Unauthorized), nettoyer le token et re-diriger automatiquement vers la page de connexion
    if (error.response?.status === 401) {
      if (typeof localStorage !== "undefined") {
        localStorage.removeItem("access_token");
      }
      console.warn("Session expirée. Redirection vers la page de connexion...");
      if (
        typeof window !== "undefined" &&
        !window.location.pathname.startsWith("/login") &&
        !window.location.pathname.startsWith("/register") &&
        !window.location.pathname.startsWith("/reset-password")
      ) {
        window.location.href = "/login";
      }
    }

    return Promise.reject(error);
  }
);
