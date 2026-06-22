import React from 'react';
import { Search, Bell, Moon, Sun, Menu, Globe } from 'lucide-react';
import { useTheme } from '../../contexts/ThemeContext';
import type { TopbarProps } from './Topbar.types';

export const Topbar: React.FC<TopbarProps> = ({ onMenuClick }) => {
  const { theme, toggleTheme } = useTheme();

  return (
    <header className="h-24 px-4 sm:px-10 flex items-center justify-between sticky top-0 z-40">
      <div className="flex items-center gap-4">
        <button
          onClick={onMenuClick}
          className="p-2 lg:hidden rounded-xl glass-capsule text-text-primary-light dark:text-text-primary-dark"
        >
          <Menu size={24} />
        </button>
        <div>
          <h1 className="text-2xl font-bold text-text-primary-light dark:text-text-primary-dark flex items-center gap-2">
            Lumina Eat 👋
          </h1>
          <p className="text-sm text-text-secondary-light dark:text-text-secondary-dark">Bienvenue dans votre Workspace</p>
        </div>
      </div>

      <div className="flex items-center gap-6">
        <div className="relative group hidden md:block">
          <Search className="absolute left-3 top-1/2 -translate-y-1/2 text-text-secondary-light dark:text-text-secondary-dark" size={18} />
          <input
            type="text"
            placeholder="Rechercher..."
            className="glass-capsule rounded-full py-2 pl-10 pr-4 w-64 focus:outline-none focus:ring-1 focus:ring-accent-light dark:focus:ring-accent-dark text-text-primary-light dark:text-text-primary-dark placeholder:text-text-secondary-light dark:placeholder:text-text-secondary-dark"
          />
        </div>

        <div className="flex items-center gap-2">
          {/* Language Selector */}
          <button className="p-2 rounded-xl glass-capsule text-text-primary-light dark:text-text-primary-dark hover:scale-105 transition-transform flex items-center gap-2">
            <Globe size={20} />
            <span className="text-xs font-bold hidden lg:block uppercase tracking-widest">FR</span>
          </button>

          <button
            onClick={toggleTheme}
            className="p-2 rounded-xl glass-capsule text-text-primary-light dark:text-text-primary-dark hover:scale-105 transition-transform"
          >
            {theme === 'light' ? <Moon size={20} /> : <Sun size={20} />}
          </button>

          <button className="p-2 rounded-xl glass-capsule text-text-primary-light dark:text-text-primary-dark hover:scale-105 transition-transform relative">
            <Bell size={20} />
            <span className="absolute top-2 right-2 w-2 h-2 bg-danger-light dark:bg-danger-dark rounded-full shadow-[0_0_8px_rgba(239,68,68,0.5)]"></span>
          </button>

          <div className="flex items-center gap-3 ml-2 p-1 pr-4 rounded-full glass-capsule cursor-pointer">
            <div className="w-10 h-10 rounded-full border border-black/10 dark:border-white/20 overflow-hidden">
              <img src="https://ui-avatars.com/api/?name=Admin&background=3B82F6&color=fff" alt="Avatar" />
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
