import { Navigate, useLocation } from "react-router-dom";
import { useAuth } from "../contexts/AuthContext";
import { Loader } from "./Loader";

interface Props {
  children: React.ReactNode;
}

export const ProtectedRoute = ({ children }: Props) => {
  const { loading, isAuthenticated } = useAuth();
  const location = useLocation();

  if (loading) {
    return <Loader fullScreen message="Vérification de la session..." />;
  }

  if (!isAuthenticated) {
    const from = location.pathname + location.search;
    return <Navigate to="/login" state={{ from: { pathname: from } }} replace />;
  }

  return <>{children}</>;
};