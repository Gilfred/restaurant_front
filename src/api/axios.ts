import axios from "axios";

export const api = axios.create({
  baseURL: import.meta.env.VITE_API_URL,
  withCredentials: true,
  headers: {
    "Content-Type": "application/json",
  },
});

// Intercepteur de réponse
api.interceptors.response.use(
  (response) => response,
  (error) => {
    // Si la session a expiré
    if (error.response?.status === 401) {
      console.warn("Session expirée.");
    }

    return Promise.reject(error);
  }
);