import { useEffect } from "react";
import { useNavigate } from "react-router-dom";
import { useAuth } from "../../contexts/AuthContext";

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

  return (
    <div className="min-h-screen flex items-center justify-center">
      <div className="text-center">
        <h2 className="text-xl font-semibold">Connexion en cours...</h2>
        <p className="text-gray-500 mt-2">
          Veuillez patienter...
        </p>
      </div>
    </div>
  );
};

export default AuthCallback;