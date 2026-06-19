import React from 'react';
import {
  LayoutDashboard,
  ShoppingCart,
  UtensilsCrossed,
  CalendarDays,
  ChefHat,
  Users,
  Package,
  BarChart3,
  Settings,
  LogOut,
  ChevronLeft,
  ChevronRight
} from 'lucide-react';
import { cn } from '../utils/cn';

const menuItems = [
  { icon: LayoutDashboard, label: 'Dashboard', id: 'dashboard' },
  { icon: ShoppingCart, label: 'Commandes', id: 'orders' },
  { icon: UtensilsCrossed, label: 'Tables', id: 'tables' },
  { icon: CalendarDays, label: 'Réservations', id: 'reservations' },
  { icon: ChefHat, label: 'Cuisine', id: 'kitchen' },
  { icon: Users, label: 'Personnel', id: 'staff' },
  { icon: Package, label: 'Stocks', id: 'inventory' },
  { icon: BarChart3, label: 'Rapports', id: 'reports' },
  { icon: Settings, label: 'Paramètres', id: 'settings' },
];

interface SidebarProps {
  activeId?: string;
  isOpen: boolean;
  setIsOpen: (isOpen: boolean) => void;
  isCollapsed: boolean;
  setIsCollapsed: (isCollapsed: boolean) => void;
}

export const Sidebar: React.FC<SidebarProps> = ({
  activeId = 'dashboard',
  isOpen,
  setIsOpen,
  isCollapsed,
  setIsCollapsed
}) => {
  return (
    <>
      {/* Mobile Overlay */}
      {isOpen && (
        <div
          className="fixed inset-0 bg-black/20 backdrop-blur-sm z-[60] lg:hidden"
          onClick={() => setIsOpen(false)}
        />
      )}

      <aside
        className={cn(
          "glass-card-premium h-[calc(100%-2rem)] m-4 transition-all duration-300 flex flex-col absolute lg:relative left-0 top-0 z-[70]",
          isCollapsed ? "w-20" : "w-64",
          "lg:translate-x-0",
          isOpen ? "translate-x-0" : "-translate-x-[calc(100%+2rem)] lg:translate-x-0"
        )}
      >
      <div className="p-6 flex items-center justify-between">
        {!isCollapsed && (
          <span className="text-xl font-bold text-text-primary-light dark:text-text-primary-dark tracking-widest uppercase">
            La Table d'Or
          </span>
        )}
        <button
          onClick={() => setIsCollapsed(!isCollapsed)}
          className="p-2 rounded-xl hover:bg-black/5 dark:hover:bg-white/10 transition-colors text-text-primary-light dark:text-text-primary-dark"
        >
          {isCollapsed ? <ChevronRight size={20} /> : <ChevronLeft size={20} />}
        </button>
      </div>

      <nav className="flex-1 px-4 space-y-2 mt-4 overflow-y-auto">
        {menuItems.map((item) => (
          <button
            key={item.id}
            className={cn(
              "w-full flex items-center gap-4 px-4 py-3 rounded-2xl transition-all duration-300 group relative overflow-hidden glass-capsule",
              activeId === item.id
                ? "bg-accent-light dark:bg-accent-dark text-white shadow-lg"
                : "text-text-secondary-light dark:text-text-secondary-dark hover:text-text-primary-light dark:hover:text-text-primary-dark"
            )}
          >
            <item.icon size={20} className={cn(
              "transition-transform duration-300 group-hover:scale-110",
              activeId === item.id ? "text-white" : "group-hover:text-accent-light dark:group-hover:text-accent-dark"
            )} />
            {!isCollapsed && <span className="font-medium text-sm">{item.label}</span>}
          </button>
        ))}
      </nav>

      <div className="p-4 mt-auto border-t border-black/5 dark:border-white/5">
        <button className="w-full flex items-center gap-4 px-4 py-3 rounded-2xl text-danger-light dark:text-danger-dark hover:bg-danger-light/10 transition-all duration-200">
          <LogOut size={22} />
          {!isCollapsed && <span className="font-medium">Déconnexion</span>}
        </button>
      </div>
    </aside>
    </>
  );
};
