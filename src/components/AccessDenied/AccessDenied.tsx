import React from "react";
import { motion } from "framer-motion";
import { ShieldAlert, ArrowLeft, KeyRound, HelpCircle } from "lucide-react";

interface AccessDeniedProps {
  title?: string;
  description?: string;
  requiredRole?: string;
  onBack?: () => void;
}

export const AccessDenied: React.FC<AccessDeniedProps> = ({
  title = "Accès Restreint",
  description = "Vous n'avez pas les autorisations nécessaires pour accéder à cette section premium.",
  requiredRole,
  onBack,
}) => {
  return (
    <div className="flex flex-col items-center justify-center min-h-[60vh] p-8 text-center">
      <motion.div
        initial={{ scale: 0.9, opacity: 0 }}
        animate={{ scale: 1, opacity: 1 }}
        transition={{ type: "spring", duration: 0.6 }}
        className="glass-card-premium max-w-lg p-10 relative overflow-hidden glass-reflection border border-danger-light/20 dark:border-danger-dark/20"
      >
        {/* Glow effect */}
        <div className="absolute top-0 left-1/2 -translate-x-1/2 w-48 h-48 bg-danger-light/10 dark:bg-danger-dark/10 blur-[50px] rounded-full -z-10" />

        <div className="w-20 h-20 mx-auto rounded-3xl bg-danger-light/15 dark:bg-danger-dark/15 flex items-center justify-center mb-6 border border-danger-light/30">
          <ShieldAlert className="w-10 h-10 text-danger-light dark:text-danger-dark animate-pulse" />
        </div>

        <h2 className="text-2xl sm:text-3xl font-extrabold text-text-primary-light dark:text-text-primary-dark tracking-tight mb-4">
          {title}
        </h2>

        <p className="text-text-secondary-light dark:text-text-secondary-dark text-base leading-relaxed mb-6">
          {description}
        </p>

        {requiredRole && (
          <div className="inline-flex items-center gap-2 px-4 py-2 rounded-2xl bg-black/5 dark:bg-white/5 border border-black/10 dark:border-white/10 mb-8">
            <KeyRound className="w-4 h-4 text-accent-light dark:text-accent-dark" />
            <span className="text-xs font-bold text-text-primary-light dark:text-text-primary-dark uppercase tracking-wider">
              Rôle Requis: {requiredRole}
            </span>
          </div>
        )}

        <div className="flex flex-col sm:flex-row gap-4 justify-center items-center">
          {onBack && (
            <button
              onClick={onBack}
              className="w-full sm:w-auto inline-flex items-center justify-center gap-2 px-6 py-3 glass-capsule rounded-xl text-sm font-bold text-text-primary-light dark:text-text-primary-dark hover:scale-105 transition-all"
            >
              <ArrowLeft className="w-4 h-4" />
              Retourner au Dashboard
            </button>
          )}

          <a
            href="mailto:support@luminaeats.com"
            className="w-full sm:w-auto inline-flex items-center justify-center gap-2 px-6 py-3 bg-accent-light text-white rounded-xl text-sm font-bold hover:bg-accent-dark hover:shadow-lg hover:shadow-accent-light/20 transition-all hover:scale-105"
          >
            <HelpCircle className="w-4 h-4" />
            Contacter le Support
          </a>
        </div>
      </motion.div>
    </div>
  );
};
