import React from 'react';
import { Search, Bell, User, Globe, Moon, Sun, Menu } from 'lucide-react';
import { useTheme } from '../contexts/ThemeContext';

interface TopbarProps {
  onMenuClick: () => void;
}

export const Topbar: React.FC<TopbarProps> = ({ onMenuClick }) => {
  const { theme, toggleTheme } = useTheme();

  return (
    <header className="h-20 px-4 sm:px-8 flex items-center justify-between sticky top-0 z-40">
      <div className="flex items-center gap-4">
        <button
          onClick={onMenuClick}
          className="p-2 lg:hidden rounded-xl glass-card glass-card-light dark:glass-card-dark text-text-primary-light dark:text-text-primary-dark"
        >
          <Menu size={24} />
        </button>
        <h1 className="text-xl sm:text-2xl font-semibold text-text-primary-light dark:text-text-primary-dark truncate">
          La Table d'Or
        </h1>
      </div>

      <div className="flex items-center gap-6">
        <div className="relative group hidden md:block">
          <Search className="absolute left-3 top-1/2 -translate-y-1/2 text-text-secondary-light dark:text-text-secondary-dark" size={18} />
          <input
            type="text"
            placeholder="Rechercher..."
            className="glass-card glass-card-light dark:glass-card-dark rounded-2xl py-2 pl-10 pr-4 w-64 focus:outline-none focus:ring-2 focus:ring-accent-light dark:focus:ring-accent-dark transition-all"
          />
        </div>

        <div className="flex items-center gap-2">
          <button
            onClick={toggleTheme}
            className="p-3 rounded-2xl glass-card glass-card-light dark:glass-card-dark text-text-primary-light dark:text-text-primary-dark hover:scale-105 transition-transform"
          >
            {theme === 'light' ? <Moon size={20} /> : <Sun size={20} />}
          </button>

          <button className="p-3 rounded-2xl glass-card glass-card-light dark:glass-card-dark text-text-primary-light dark:text-text-primary-dark hover:scale-105 transition-transform relative">
            <Bell size={20} />
            <span className="absolute top-2 right-2 w-2 h-2 bg-danger-light dark:bg-danger-dark rounded-full"></span>
          </button>

          <button className="p-3 rounded-2xl glass-card glass-card-light dark:glass-card-dark text-text-primary-light dark:text-text-primary-dark hover:scale-105 transition-transform">
            <Globe size={20} />
          </button>

          <div className="flex items-center gap-3 ml-2 p-1 pr-4 rounded-2xl glass-card glass-card-light dark:glass-card-dark cursor-pointer hover:bg-white/5 transition-colors">
            <div className="w-10 h-10 rounded-xl bg-accent-light/20 flex items-center justify-center overflow-hidden">
              <User className="text-accent-light dark:text-accent-dark" size={24} />
            </div>
            <div className="hidden sm:block">
              <p className="text-sm font-semibold text-text-primary-light dark:text-text-primary-dark">Admin</p>
              <p className="text-xs text-text-secondary-light dark:text-text-secondary-dark leading-none">Propriétaire</p>
            </div>
          </div>
        </div>
      </div>
    </header>
  );
};
