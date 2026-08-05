import { useEffect } from "react";
import { useNavigate } from "react-router-dom";
import { useAuth } from "../../contexts/AuthContext";
import { Loader } from "../../components/Loader";

const AuthCallback = () => {
  const navigate = useNavigate();
  const { refreshUser } = useAuth();

  useEffect(() => {
    const authenticate = async () => {
      try {
        await refreshUser();
        navigate("/dashboard", { replace: true });
      } catch (error) {
        console.error(error);
        navigate("/login", { replace: true });
      }
    };

    authenticate();
  }, [navigate, refreshUser]);

  return <Loader fullScreen message="Connexion en cours..." />;
};

export default AuthCallback;