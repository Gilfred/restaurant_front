import React, {
  createContext,
  useContext,
  useEffect,
  useState,
} from "react";
import { getCurrentUser, logout } from "../services/auth.service";

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

  const refreshUser = async () => {
    try {
      const response = await getCurrentUser();
      setUser(response.data);
      return response.data;
    } catch (error) {
      setUser(null);
      throw error;
    } finally {
      setLoading(false);
    }
  };

  const logoutUser = async () => {
    try {
      await logout();
    } catch (error) {
      console.error(error);
    } finally {
      setUser(null);
    }
  };

  useEffect(() => {
    refreshUser().catch(() => {
      // Ignorer l'erreur au chargement initial
    });
  }, []);

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
