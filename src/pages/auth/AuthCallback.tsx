import { useEffect, useRef } from "react";
import { useNavigate } from "react-router-dom";
import { useAuth } from "../../contexts/AuthContext";

export const AuthCallback = () => {
    const { user, loading, checkAuth } = useAuth();
    const navigate = useNavigate();
    const hasChecked = useRef(false);

    useEffect(() => {
        if (!hasChecked.current) {
            checkAuth();
            hasChecked.current = true;
        }
    }, [checkAuth]);

    useEffect(() => {
        if (!loading) {
            if (user) {
                navigate("/dashboard");
            } else {
                navigate("/login");
            }
        }
    }, [user, loading, navigate]);

    return (
        <div className="min-h-screen flex items-center justify-center bg-background-light dark:bg-background-dark">
            <div className="text-center">
                <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-accent-light mx-auto mb-4"></div>
                <h2 className="text-xl font-semibold text-text-primary-light dark:text-text-primary-dark">
                    Vérification de l'authentification...
                </h2>
                <p className="text-text-secondary-light dark:text-text-secondary-dark mt-2">
                    Veuillez patienter pendant que nous récupérons votre session.
                </p>
            </div>
        </div>
    );
};
