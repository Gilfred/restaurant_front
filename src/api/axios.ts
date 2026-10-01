import axios from "axios";
import { isTokenExpired } from "../utils/jwt";

export const API_URL = import.meta.env?.VITE_API_URL || "http://127.0.0.1:8000";

export const api = axios.create({
  baseURL: API_URL,
  withCredentials: true,
  headers: {
    "Content-Type": "application/json",
  },
});

/**
 * Checks if an endpoint URL is genuinely public.
 * Enforces exact matching to avoid treating protected endpoints like
 * `/restaurants/staff` or `/restaurants/inactive` as public.
 */
export function isPublicEndpoint(url: string, method: string = "GET"): boolean {
  if (!url) return false;
  let path = url;
  if (path.startsWith("http://") || path.startsWith("https://")) {
    try {
      path = new URL(path).pathname;
    } catch {
      // ignore invalid URL
    }
  }
  path = path.split("?")[0];

  const exactPublicPaths = [
    "/auth/login",
    "/auth/signup",
    "/auth/forgot-password",
    "/auth/reset-password",
    "/menus/display",
  ];

  if (exactPublicPaths.includes(path)) {
    return true;
  }

  // Exact /restaurants or /restaurants/ on GET is public for the explore page
  if ((path === "/restaurants" || path === "/restaurants/") && method.toUpperCase() === "GET") {
    return true;
  }

  return false;
}

// Intercepteur de requête pour ajouter le token Authorization Bearer
api.interceptors.request.use(
  (config) => {
    if (typeof localStorage !== "undefined") {
      const token = localStorage.getItem("access_token");
      if (token) {
        if (isTokenExpired(token) && !isPublicEndpoint(config.url || "", config.method)) {
          localStorage.removeItem("access_token");
        } else {
          config.headers.Authorization = `Bearer ${token}`;
        }
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
    // Si 401 Unauthorized sur une requête/endpoint protégé
    if (error.response?.status === 401) {
      const configUrl = error.config?.url || "";
      const method = error.config?.method || "GET";

      if (!isPublicEndpoint(configUrl, method)) {
        if (typeof localStorage !== "undefined") {
          localStorage.removeItem("access_token");
        }
        console.warn("Session expirée sur route protégée (401). Redirection vers /login...");
        if (typeof window !== "undefined" && !window.location.pathname.startsWith("/login")) {
          window.location.href = "/login";
        }
      }
    }

    return Promise.reject(error);
  }
);
