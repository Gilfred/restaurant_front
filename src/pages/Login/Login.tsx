import React from 'react';
import { motion } from 'framer-motion';
import { Mail, Lock, LogIn, UtensilsCrossed, Compass } from 'lucide-react';
import { Link } from 'react-router-dom';
import { login } from "../../services/auth.service";

export const Login: React.FC = () => {
  const [email, setEmail] = React.useState('');
  const [password, setPassword] = React.useState('');

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();

    try {

      const response = await login({
        email,
        password,
      });

      console.log(response.data);

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
          <p className="text-text-secondary-light dark:text-text-secondary-dark mt-2">Bienvenue sur votre espace de gestion</p>
        </div>

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
          </div>

          <div className="space-y-2">
            <div className="flex justify-between items-center ml-1">
              <label className="text-sm font-medium text-text-primary-light dark:text-text-primary-dark">Mot de passe</label>
              <Link
                to="/forgot-password"
                className="text-xs text-accent-light hover:text-accent-dark transition-colors"
              >
                Mot de passe oublié ?
              </Link>
            </div>
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

          <button
            type="submit"
            className="w-full py-4 bg-accent-light hover:bg-accent-dark text-white rounded-2xl font-bold text-lg flex items-center justify-center gap-2 transition-all shadow-lg hover:shadow-accent-light/20 active:scale-[0.98]"
          >
            <LogIn className="w-5 h-5" />
            Se connecter
          </button>
        </form>

        <div className="mt-6 flex flex-col gap-4">
          <Link
            to="/explore"
            className="w-full py-3 bg-white/5 border border-white/10 hover:bg-white/10 text-text-primary-light dark:text-text-primary-dark rounded-2xl font-semibold flex items-center justify-center gap-2 transition-all"
          >
            <Compass className="w-5 h-5 text-accent-light" />
            Voir les restaurants disponibles
          </Link>
        </div>

        <div className="mt-8 text-center border-t border-white/10 pt-6">
          <p className="text-text-secondary-light dark:text-text-secondary-dark">
            Vous n'avez pas de compte ?{' '}
            <Link to="/register" className="text-accent-light font-semibold hover:underline">
              S'inscrire
            </Link>
          </p>
        </div>
      </motion.div>
    </div>
  );
};
