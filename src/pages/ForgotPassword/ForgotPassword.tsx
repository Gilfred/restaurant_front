import React from 'react';
import { motion } from 'framer-motion';
import { Mail, ArrowLeft, Send, UtensilsCrossed, CheckCircle2 } from 'lucide-react';
import { Link } from 'react-router-dom';
import { forgotPassword } from "../../services/auth.service";

export const ForgotPassword: React.FC = () => {
  const [email, setEmail] = React.useState('');
  const [isSubmitted, setIsSubmitted] = React.useState(false);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();

    try {

      await forgotPassword({
        email,
      });

      setIsSubmitted(true);

    } catch (error) {
      console.error(error);
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
            {isSubmitted
              ? "Vérifiez votre boîte de réception"
              : "Réinitialiser votre mot de passe"}
          </p>
        </div>

        {!isSubmitted ? (
          <form onSubmit={handleSubmit} className="space-y-6">
            <div className="space-y-2">
              <label className="text-sm font-medium text-text-primary-light dark:text-text-primary-dark ml-1">Email</label>
              <div className="relative group">
                <div className="absolute inset-y-0 left-0 pl-4 flex items-center pointer-events-none">
                  <Mail className="h-5 w-5 text-text-secondary-light dark:text-text-secondary-dark group-focus-within:text-accent-light transition-colors" />
                </div>
                <input
                  type="email"
                  value={email}
                  onChange={(e) => setEmail(e.target.value)}
                  placeholder="votre@email.com"
                  className="w-full pl-12 pr-4 py-3 bg-white/5 border border-white/10 rounded-2xl focus:outline-none focus:ring-2 focus:ring-accent-light/50 focus:border-accent-light transition-all text-text-primary-light dark:text-text-primary-dark"
                  required
                />
              </div>
              <p className="text-xs text-text-secondary-light dark:text-text-secondary-dark px-1">
                Entrez l'adresse e-mail associée à votre compte et nous vous enverrons un lien pour réinitialiser votre mot de passe.
              </p>
            </div>

            <button
              type="submit"
              className="w-full py-4 bg-accent-light hover:bg-accent-dark text-white rounded-2xl font-bold text-lg flex items-center justify-center gap-2 transition-all shadow-lg hover:shadow-accent-light/20 active:scale-[0.98]"
            >
              <Send className="w-5 h-5" />
              Envoyer le lien
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
              Si un compte existe pour <strong>{email}</strong>, vous recevrez bientôt un e-mail avec des instructions pour réinitialiser votre mot de passe.
            </p>
            <button
              onClick={() => setIsSubmitted(false)}
              className="text-accent-light font-semibold hover:underline"
            >
              Renvoyer l'e-mail
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
