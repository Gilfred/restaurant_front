import React, {
  createContext,
  useContext,
  useEffect,
  useState,
  useRef,
  useCallback,
} from "react";
import { getCurrentUser, logout } from "../services/auth.service";
import { isTokenExpired, getTokenTimeRemaining } from "../utils/jwt";

export interface Role {
  id: string;
  name: string;
}

export interface User {
  id: number;
  name: string;
  email: string;
  picture?: string;
  roles?: Role[];
}

interface AuthContextType {
  user: User | null;
  loading: boolean;
  isAuthenticated: boolean;
  refreshUser: () => Promise<void>;
  logoutUser: () => Promise<void>;
}

const AuthContext = createContext<AuthContextType | undefined>(undefined);

export const AuthProvider: React.FC<{ children: React.ReactNode }> = ({
  children,
}) => {
  const [user, setUser] = useState<User | null>(null);
  const [loading, setLoading] = useState(true);
  const expirationTimerRef = useRef<ReturnType<typeof setTimeout> | null>(null);

  const clearExpirationTimer = useCallback(() => {
    if (expirationTimerRef.current) {
      clearTimeout(expirationTimerRef.current);
      expirationTimerRef.current = null;
    }
  }, []);

  const handleSessionExpired = useCallback(() => {
    clearExpirationTimer();
    if (typeof localStorage !== "undefined") {
      localStorage.removeItem("access_token");
    }
    setUser(null);
    console.warn("Session expirée (timer). Redirection vers /login...");
    if (typeof window !== "undefined" && !window.location.pathname.startsWith("/login")) {
      window.location.href = "/login";
    }
  }, [clearExpirationTimer]);

  const scheduleExpirationTimer = useCallback(
    (token: string) => {
      clearExpirationTimer();
      const timeRemaining = getTokenTimeRemaining(token);
      if (timeRemaining <= 0) {
        handleSessionExpired();
        return;
      }

      // Maximise le délai à 2^31 - 1 (environ 24.8 jours) pour éviter l'overflow JS
      const safeTimeRemaining = Math.min(timeRemaining, 2147483647);
      expirationTimerRef.current = setTimeout(() => {
        handleSessionExpired();
      }, safeTimeRemaining);
    },
    [clearExpirationTimer, handleSessionExpired]
  );

  const logoutUser = useCallback(async () => {
    clearExpirationTimer();
    try {
      await logout();
    } catch (error) {
      console.error("Erreur lors de la déconnexion:", error);
    } finally {
      if (typeof localStorage !== "undefined") {
        localStorage.removeItem("access_token");
      }
      setUser(null);
    }
  }, [clearExpirationTimer]);

  const refreshUser = useCallback(async () => {
    if (typeof localStorage === "undefined") {
      setUser(null);
      setLoading(false);
      return;
    }

    const token = localStorage.getItem("access_token");
    if (!token) {
      clearExpirationTimer();
      setUser(null);
      setLoading(false);
      return;
    }

    if (isTokenExpired(token)) {
      handleSessionExpired();
      setLoading(false);
      return;
    }

    try {
      const response = await getCurrentUser();
      setUser(response.data);
      scheduleExpirationTimer(token);
      return response.data;
    } catch (error: any) {
      if (error?.response?.status === 401) {
        handleSessionExpired();
      } else {
        setUser(null);
      }
      throw error;
    } finally {
      setLoading(false);
    }
  }, [clearExpirationTimer, handleSessionExpired, scheduleExpirationTimer]);

  useEffect(() => {
    // Ne pas vérifier la session lors du callback OAuth avant que le token ne soit enregistré
    if (typeof window !== "undefined" && window.location.pathname.startsWith("/auth/callback")) {
      setLoading(false);
      return;
    }

    refreshUser().catch(() => {
      // Ignorer l'erreur au chargement initial
    });

    return () => {
      clearExpirationTimer();
    };
  }, [refreshUser, clearExpirationTimer]);

  return (
    <AuthContext.Provider
      value={{
        user,
        loading,
        isAuthenticated: !!user,
        refreshUser,
        logoutUser,
      }}
    >
      {children}
    </AuthContext.Provider>
  );
};

export const useAuth = () => {
  const context = useContext(AuthContext);

  if (!context) {
    throw new Error("useAuth must be used inside AuthProvider");
  }

  return context;
};
