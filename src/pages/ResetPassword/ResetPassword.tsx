import React from 'react';
import { motion } from 'framer-motion';
import { Lock, ArrowLeft, KeyRound, UtensilsCrossed, CheckCircle2, AlertTriangle } from 'lucide-react';
import { Link, useParams, useSearchParams, useNavigate } from 'react-router-dom';
import { resetPassword } from "../../services/auth.service";

export const ResetPassword: React.FC = () => {
  const { token } = useParams<{ token?: string }>();
  const [searchParams] = useSearchParams();
  const navigate = useNavigate();

  const queryToken = searchParams.get('token');
  const actualToken = token || queryToken || '';

  const [password, setPassword] = React.useState('');
  const [confirmPassword, setConfirmPassword] = React.useState('');
  const [isSubmitting, setIsSubmitting] = React.useState(false);
  const [isSuccess, setIsSuccess] = React.useState(false);
  const [error, setError] = React.useState<string | null>(null);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setError(null);

    if (!actualToken) {
      setError("Le jeton de réinitialisation est manquant ou invalide.");
      return;
    }

    if (password !== confirmPassword) {
      setError("Les mots de passe ne correspondent pas.");
      return;
    }

    if (password.length < 6) {
      setError("Le mot de passe doit contenir au moins 6 caractères.");
      return;
    }

    setIsSubmitting(true);

    try {
      await resetPassword({
        token: actualToken,
        password: password,
        new_password: password, // Sending both to ensure compatibility with backend schemas
      });

      setIsSuccess(true);
    } catch (err: any) {
      console.error(err);
      setError(
        err.response?.data?.detail ||
        err.response?.data?.message ||
        "Une erreur est survenue lors de la réinitialisation de votre mot de passe. Le lien est peut-être expiré."
      );
    } finally {
      setIsSubmitting(false);
    }
  };

  return (
    <div className="min-h-screen w-full flex items-center justify-center p-4 sm:p-6 lg:p-8 font-sans selection:bg-accent-neon/30 overflow-hidden relative">
      {/* Decorative Background Glows */}
      <div className="fixed top-[10%] right-[10%] w-[300px] h-[300px] sm:w-[400px] sm:h-[400px] bg-accent-light/10 blur-[100px] sm:blur-[150px] rounded-full pointer-events-none -z-10"></div>
      <div className="fixed bottom-[10%] left-[10%] w-[250px] h-[250px] sm:w-[300px] sm:h-[300px] bg-purple-500/10 blur-[100px] sm:blur-[150px] rounded-full pointer-events-none -z-10"></div>

      <motion.div
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.5 }}
        className="w-full max-w-[450px] glass-card-premium p-8 relative glass-reflection"
      >
        <div className="flex flex-col items-center mb-8">
          <div className="w-16 h-16 rounded-2xl bg-accent-light flex items-center justify-center mb-4 shadow-neon">
            <UtensilsCrossed className="w-8 h-8 text-white" />
          </div>
          <h1 className="text-3xl font-bold text-text-primary-light dark:text-text-primary-dark">Lumina Eat</h1>
          <p className="text-text-secondary-light dark:text-text-secondary-dark mt-2 text-center px-4">
            {isSuccess
              ? "Mot de passe réinitialisé"
              : "Nouveau mot de passe"}
          </p>
        </div>

        {error && (
          <motion.div
            initial={{ opacity: 0, height: 0 }}
            animate={{ opacity: 1, height: 'auto' }}
            className="mb-6 p-4 bg-red-500/10 border border-red-500/20 rounded-2xl text-red-500 text-sm font-medium flex items-start gap-3"
          >
            <AlertTriangle className="w-5 h-5 shrink-0 mt-0.5" />
            <span>{error}</span>
          </motion.div>
        )}

        {!actualToken && !isSuccess ? (
          <div className="text-center space-y-6">
            <div className="flex justify-center">
              <div className="w-20 h-20 rounded-full bg-red-500/10 flex items-center justify-center">
                <AlertTriangle className="w-10 h-10 text-red-500" />
              </div>
            </div>
            <p className="text-text-primary-light dark:text-text-primary-dark">
              Le jeton de réinitialisation de mot de passe est manquant. Veuillez utiliser le lien complet envoyé dans votre boîte de réception.
            </p>
            <div className="pt-4">
              <Link
                to="/forgot-password"
                className="text-accent-light font-semibold hover:underline"
              >
                Demander un nouveau lien
              </Link>
            </div>
          </div>
        ) : !isSuccess ? (
          <form onSubmit={handleSubmit} className="space-y-6">
            <div className="space-y-2">
              <label className="text-sm font-medium text-text-primary-light dark:text-text-primary-dark ml-1">
                Nouveau mot de passe
              </label>
              <div className="relative group">
                <div className="absolute inset-y-0 left-0 pl-4 flex items-center pointer-events-none">
                  <Lock className="h-5 w-5 text-text-secondary-light dark:text-text-secondary-dark group-focus-within:text-accent-light transition-colors" />
                </div>
                <input
                  type="password"
                  value={password}
                  onChange={(e) => setPassword(e.target.value)}
                  placeholder="••••••••"
                  className="w-full pl-12 pr-4 py-3 bg-white/5 border border-white/10 rounded-2xl focus:outline-none focus:ring-2 focus:ring-accent-light/50 focus:border-accent-light transition-all text-text-primary-light dark:text-text-primary-dark"
                  required
                />
              </div>
            </div>

            <div className="space-y-2">
              <label className="text-sm font-medium text-text-primary-light dark:text-text-primary-dark ml-1">
                Confirmer le mot de passe
              </label>
              <div className="relative group">
                <div className="absolute inset-y-0 left-0 pl-4 flex items-center pointer-events-none">
                  <Lock className="h-5 w-5 text-text-secondary-light dark:text-text-secondary-dark group-focus-within:text-accent-light transition-colors" />
                </div>
                <input
                  type="password"
                  value={confirmPassword}
                  onChange={(e) => setConfirmPassword(e.target.value)}
                  placeholder="••••••••"
                  className="w-full pl-12 pr-4 py-3 bg-white/5 border border-white/10 rounded-2xl focus:outline-none focus:ring-2 focus:ring-accent-light/50 focus:border-accent-light transition-all text-text-primary-light dark:text-text-primary-dark"
                  required
                />
              </div>
            </div>

            <button
              type="submit"
              disabled={isSubmitting}
              className="w-full py-4 bg-accent-light hover:bg-accent-dark disabled:opacity-50 disabled:cursor-not-allowed text-white rounded-2xl font-bold text-lg flex items-center justify-center gap-2 transition-all shadow-lg hover:shadow-accent-light/20 active:scale-[0.98]"
            >
              {isSubmitting ? (
                <div className="w-6 h-6 border-2 border-white/30 border-t-white rounded-full animate-spin" />
              ) : (
                <>
                  <KeyRound className="w-5 h-5" />
                  Réinitialiser le mot de passe
                </>
              )}
            </button>
          </form>
        ) : (
          <div className="text-center space-y-6">
            <div className="flex justify-center">
              <div className="w-20 h-20 rounded-full bg-success-light/20 flex items-center justify-center">
                <CheckCircle2 className="w-10 h-10 text-success-light" />
              </div>
            </div>
            <p className="text-text-primary-light dark:text-text-primary-dark">
              Votre mot de passe a été réinitialisé avec succès. Vous pouvez maintenant vous connecter avec votre nouveau mot de passe.
            </p>
            <button
              onClick={() => navigate("/login")}
              className="w-full py-4 bg-accent-light hover:bg-accent-dark text-white rounded-2xl font-bold text-lg flex items-center justify-center gap-2 transition-all shadow-lg hover:shadow-accent-light/20 active:scale-[0.98]"
            >
              Aller à la connexion
            </button>
          </div>
        )}

        <div className="mt-8 text-center border-t border-white/10 pt-6">
          <Link
            to="/login"
            className="inline-flex items-center gap-2 text-text-secondary-light dark:text-text-secondary-dark hover:text-accent-light transition-colors font-medium"
          >
            <ArrowLeft className="w-4 h-4" />
            Retour à la connexion
          </Link>
        </div>
      </motion.div>
    </div>
  );
};
