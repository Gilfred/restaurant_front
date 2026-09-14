import React, { useEffect, useState } from "react";
import { useNavigate, useLocation } from "react-router-dom";
import { useAuth } from "../../contexts/AuthContext";
import { Loader } from "../../components/Loader";

const AuthCallback: React.FC = () => {
  const navigate = useNavigate();
  const location = useLocation();
  const { refreshUser } = useAuth();
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    const handleAuth = async () => {
      try {
        let token: string | null = null;

        // Extract token from search query string
        const searchParams = new URLSearchParams(location.search);
        token = searchParams.get("access_token") || searchParams.get("token");

        // If not in search parameters, check location hash fragment
        if (!token && location.hash) {
          const hashParams = new URLSearchParams(location.hash.replace(/^#/, ""));
          token = hashParams.get("access_token") || hashParams.get("token");
        }

        if (token) {
          localStorage.setItem("access_token", token);
          window.history.replaceState({}, document.title, window.location.pathname);
          await refreshUser();
          navigate("/dashboard", { replace: true });
        } else {
          const errParam =
            searchParams.get("error") || "Token d'authentification manquant.";
          setError(errParam);
          setTimeout(() => {
            navigate("/login", { replace: true, state: { error: errParam } });
          }, 1500);
        }
      } catch (err: unknown) {
        console.error("Erreur lors de la vérification du callback auth:", err);
        setError("Échec de la connexion. Redirection vers la page de connexion...");
        setTimeout(() => {
          navigate("/login", { replace: true });
        }, 1500);
      }
    };

    handleAuth();
  }, [location, navigate, refreshUser]);

  return (
    <Loader
      fullScreen
      message={error || "Authentification en cours, veuillez patienter..."}
    />
  );
};

export default AuthCallback;
