import axios from "axios";
import type { AxiosRequestConfig } from "axios";

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

// Mécanisme de promesse partagée pour éviter les appels concurrents à /auth/refresh
// lorsque plusieurs requêtes reçoivent une 401 simultanément.
let isRefreshing = false;
let refreshPromise: Promise<string | null> | null = null;

// Callbacks d'abonnés pour notifier AuthContext en cas d'expiration définitive
type AuthExpiredListener = () => void;
const authExpiredListeners: Set<AuthExpiredListener> = new Set();

export function onAuthExpired(listener: AuthExpiredListener) {
  authExpiredListeners.add(listener);
  return () => {
    authExpiredListeners.delete(listener);
  };
}

export function notifyAuthExpired() {
  if (typeof localStorage !== "undefined") {
    localStorage.removeItem("access_token");
  }
  authExpiredListeners.forEach((listener) => {
    try {
      listener();
    } catch (e) {
      console.error("Erreur listener authExpired:", e);
    }
  });
  if (typeof window !== "undefined" && !window.location.pathname.startsWith("/login")) {
    window.location.href = "/login";
  }
}

/**
 * Exécute un rafraîchissement d'accès token unique via POST /auth/refresh.
 * Partagé entre toutes les requêtes 401 concurrentes.
 */
export async function executeRefreshToken(): Promise<string | null> {
  if (isRefreshing && refreshPromise) {
    return refreshPromise;
  }

  isRefreshing = true;
  refreshPromise = (async () => {
    try {
      // Appel direct sans passer par les intercepteurs susceptibles de provoquer des boucles
      const response = await axios.post<{ access_token: string; token_type?: string; refresh_token?: string }>(
        `${API_URL.replace(/\/$/, "")}/auth/refresh`,
        {},
        {
          withCredentials: true,
          headers: {
            "Content-Type": "application/json",
          },
        }
      );

      const newAccessToken = response.data?.access_token;
      if (newAccessToken) {
        if (typeof localStorage !== "undefined") {
          localStorage.setItem("access_token", newAccessToken);
        }
        return newAccessToken;
      }
      // Réponse sans access_token valide -> session expirée
      if (typeof localStorage !== "undefined") {
        localStorage.removeItem("access_token");
      }
      return null;
    } catch (error) {
      if (typeof localStorage !== "undefined") {
        localStorage.removeItem("access_token");
      }
      return null;
    } finally {
      isRefreshing = false;
      refreshPromise = null;
    }
  })();

  return refreshPromise;
}

// Intercepteur de requête pour ajouter le token Authorization Bearer
api.interceptors.request.use(
  (config) => {
    if (typeof localStorage !== "undefined") {
      const token = localStorage.getItem("access_token");
      // On attache l'access_token si présent et si l'endpoint n'est pas public
      if (token && !isPublicEndpoint(config.url || "", config.method)) {
        config.headers.Authorization = `Bearer ${token}`;
      }
    }
    return config;
  },
  (error) => Promise.reject(error)
);

interface CustomAxiosRequestConfig extends AxiosRequestConfig {
  _retry?: boolean;
}

// Intercepteur de réponse pour intercepter les erreurs 401 et renouveler automatiquement la session
api.interceptors.response.use(
  (response) => response,
  async (error) => {
    const originalRequest = error.config as CustomAxiosRequestConfig | undefined;

    // Si pas d'erreur HTTP de réponse ou pas de config
    if (!error.response || !originalRequest) {
      return Promise.reject(error);
    }

    const status = error.response.status;
    const configUrl = originalRequest.url || "";
    const method = originalRequest.method || "GET";

    // Les erreurs 403 ne doivent JAMAIS déclencher de refresh
    if (status === 403) {
      return Promise.reject(error);
    }

    // Gestion du 401 Unauthorized
    if (status === 401) {
      // 1. Ne jamais tenter de refresh sur des endpoints publics
      if (isPublicEndpoint(configUrl, method)) {
        return Promise.reject(error);
      }

      // 2. Ne jamais tenter de refresh si la requête elle-même était /auth/refresh
      if (configUrl.includes("/auth/refresh")) {
        notifyAuthExpired();
        return Promise.reject(error);
      }

      // 3. Ne jamais rejouer une requête qui a déjà été retentée (_retry === true)
      if (originalRequest._retry) {
        notifyAuthExpired();
        return Promise.reject(error);
      }

      originalRequest._retry = true;

      try {
        const newAccessToken = await executeRefreshToken();

        if (newAccessToken) {
          // Met à jour le header Authorization de la requête initiale et la rejoue
          originalRequest.headers = originalRequest.headers || {};
          originalRequest.headers.Authorization = `Bearer ${newAccessToken}`;
          return api(originalRequest);
        } else {
          // Le refresh a échoué (session inactive > 30m ou expirée > 7j)
          notifyAuthExpired();
          return Promise.reject(error);
        }
      } catch (refreshErr) {
        notifyAuthExpired();
        return Promise.reject(refreshErr);
      }
    }

    return Promise.reject(error);
  }
);
