import { useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";
import { useAuth } from "../../contexts/AuthContext";

export default function AuthCallback() {
    const { checkAuth, user, loading } = useAuth();
    const navigate = useNavigate();
    const [error, setError] = useState<string | null>(null);

    useEffect(() => {
        const verifySession = async () => {
            console.log("Retour de Google, vérification de la session...");
            await checkAuth();
        };

        verifySession();
    }, [checkAuth]);

    useEffect(() => {
        if (!loading) {
            if (user) {
                console.log("Authentification réussie, redirection vers le dashboard");
                navigate("/dashboard", { replace: true });
            } else {
                console.error("Échec de la vérification de la session après retour Google");
                setError("La connexion a échoué. Veuillez vérifier que vous êtes bien connecté sur le même domaine (localhost vs 127.0.0.1).");
                setTimeout(() => navigate("/login"), 4000);
            }
        }
    }, [user, loading, navigate]);

    if (error) {
        return (
            <div className="flex flex-col items-center justify-center min-h-screen text-center px-4">
                <div className="w-16 h-16 bg-red-100 rounded-full flex items-center justify-center mb-4">
                    <svg className="w-8 h-8 text-red-600" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M6 18L18 6M6 6l12 12" />
                    </svg>
                </div>
                <h2 className="text-xl font-bold text-gray-900 mb-2">Erreur d'authentification</h2>
                <p className="text-gray-600 mb-4">{error}</p>
                <p className="text-sm text-gray-400 italic">Redirection vers la page de connexion...</p>
            </div>
        );
    }

    return (
        <div className="flex flex-col items-center justify-center min-h-screen">
            <div className="animate-spin rounded-full h-12 w-12 border-t-2 border-b-2 border-accent-light mb-4"></div>
            <h2 className="text-xl font-semibold">Connexion en cours...</h2>
            <p className="text-gray-500">Veuillez patienter pendant que nous vérifions vos informations.</p>
        </div>
    );
}
