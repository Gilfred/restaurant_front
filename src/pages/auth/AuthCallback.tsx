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
        if (typeof window !== "undefined") {
          const searchParams = new URLSearchParams(window.location.search);
          let token = searchParams.get("access_token") || searchParams.get("token");

          // Fallback: verifier les paramètres dans le fragment d'URL (#) au cas où
          if (!token && window.location.hash) {
            const hashParams = new URLSearchParams(window.location.hash.substring(1));
            token = hashParams.get("access_token") || hashParams.get("token");
          }

          if (token) {
            localStorage.setItem("access_token", token);
            // Nettoyer l'URL du navigateur pour masquer le token immédiatement
            const cleanUrl = window.location.pathname;
            window.history.replaceState({}, document.title, cleanUrl);
          }
        }

        await refreshUser();
        navigate("/dashboard", { replace: true });
      } catch (error) {
        console.error("Erreur lors de la vérification du callback OAuth:", error);
        if (typeof localStorage !== "undefined") {
          localStorage.removeItem("access_token");
        }
        navigate("/login", { replace: true });
      }
    };

    authenticate();
  }, [navigate, refreshUser]);

  return <Loader fullScreen message="Connexion en cours..." />;
};

export default AuthCallback;
