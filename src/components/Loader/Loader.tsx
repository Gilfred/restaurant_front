import React from 'react';
import { motion } from 'framer-motion';
import { UtensilsCrossed } from 'lucide-react';

interface LoaderProps {
  size?: 'sm' | 'md' | 'lg';
  fullScreen?: boolean;
  message?: string;
}

export const Loader: React.FC<LoaderProps> = ({
  size = 'md',
  fullScreen = false,
  message
}) => {
  const sizeClasses = {
    sm: 'w-8 h-8 border-2',
    md: 'w-16 h-16 border-4',
    lg: 'w-24 h-24 border-4',
  };

  const containerClasses = fullScreen
    ? "fixed inset-0 z-[100] flex flex-col items-center justify-center bg-background-light/40 dark:bg-[#0F172A]/40 backdrop-blur-md"
    : "flex flex-col items-center justify-center p-8 w-full h-full min-h-[300px]";

  return (
    <div className={containerClasses}>
      <div className="relative flex items-center justify-center">
        {/* Decorative background glow */}
        {fullScreen && (
          <div className="absolute w-48 h-48 bg-accent-light/20 blur-[50px] rounded-full animate-pulse" />
        )}

        {/* Premium Spinning Ring */}
        <motion.div
          className={`rounded-full border-black/5 dark:border-white/5 border-t-accent-light dark:border-t-accent-dark ${sizeClasses[size]}`}
          animate={{ rotate: 360 }}
          transition={{
            repeat: Infinity,
            duration: 1,
            ease: "linear"
          }}
        />

        {/* Floating brand icon inside loader for md/lg size */}
        {size !== 'sm' && (
          <div className="absolute flex items-center justify-center text-accent-light dark:text-accent-dark">
            <UtensilsCrossed className={`${size === 'lg' ? 'w-8 h-8' : 'w-5 h-5'} animate-pulse`} />
          </div>
        )}
      </div>

      {message && (
        <motion.p
          initial={{ opacity: 0, y: 10 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.2 }}
          className="mt-4 text-sm font-semibold tracking-wide text-text-secondary-light dark:text-text-secondary-dark uppercase text-center px-4"
        >
          {message}
        </motion.p>
      )}
    </div>
  );
};
