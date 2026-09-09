import axios from "axios";

export const api = axios.create({
  baseURL: import.meta.env?.VITE_API_URL || "http://127.0.0.1:8000",
  withCredentials: true,
  headers: {
    "Content-Type": "application/json",
  },
});

// Intercepteur de réponse
api.interceptors.response.use(
  (response) => response,
  (error) => {
    // Si la session a expiré (401 Unauthorized), re-diriger automatiquement vers la page de connexion
    if (error.response?.status === 401) {
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
