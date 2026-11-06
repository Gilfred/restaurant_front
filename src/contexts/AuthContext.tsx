import React, {
  createContext,
  useContext,
  useEffect,
  useState,
  useCallback,
} from "react";
import { getCurrentUser, logout } from "../services/auth.service";
import { onAuthExpired } from "../api/axios";

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

  // Écouter les événements d'invalidation de session émis par l'intercepteur Axios
  useEffect(() => {
    const unsubscribe = onAuthExpired(() => {
      setUser(null);
    });
    return () => {
      unsubscribe();
    };
  }, []);

  const logoutUser = useCallback(async () => {
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
  }, []);

  const refreshUser = useCallback(async () => {
    if (typeof localStorage === "undefined") {
      setUser(null);
      setLoading(false);
      return;
    }

    const token = localStorage.getItem("access_token");
    if (!token) {
      setUser(null);
      setLoading(false);
      return;
    }

    try {
      // Si le token a plus de 10 min, l'appel à getCurrentUser (/auth/me)
      // renverra 401 et l'intercepteur Axios tentera automatiquement un refresh
      // et rejouera la requête /auth/me sans déconnecter l'utilisateur actif.
      const response = await getCurrentUser();
      setUser(response.data);
      return response.data;
    } catch (error: any) {
      // Si la requête échoue définitivement après tentative de refresh
      if (error?.response?.status === 401) {
        if (typeof localStorage !== "undefined") {
          localStorage.removeItem("access_token");
        }
        setUser(null);
      } else {
        setUser(null);
      }
      throw error;
    } finally {
      setLoading(false);
    }
  }, []);

  useEffect(() => {
    // Ne pas vérifier la session lors du callback OAuth avant que le token ne soit enregistré
    if (typeof window !== "undefined" && window.location.pathname.startsWith("/auth/callback")) {
      setLoading(false);
      return;
    }

    refreshUser().catch(() => {
      // Ignorer l'erreur au chargement initial
    });
  }, [refreshUser]);

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
