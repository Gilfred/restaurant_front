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
          "glass-card glass-card-light dark:glass-card-dark h-[calc(100vh-2rem)] m-4 rounded-3xl transition-all duration-300 flex flex-col fixed left-0 top-0 z-[70]",
          isCollapsed ? "w-20" : "w-64",
          "lg:translate-x-0",
          isOpen ? "translate-x-0" : "-translate-x-[calc(100%+2rem)]"
        )}
      >
      <div className="p-6 flex items-center justify-between">
        {!isCollapsed && (
          <span className="text-xl font-bold bg-gradient-to-r from-accent-light to-blue-600 dark:from-accent-dark dark:to-blue-400 bg-clip-text text-transparent">
            Lumina Eat
          </span>
        )}
        <button
          onClick={() => setIsCollapsed(!isCollapsed)}
          className="p-2 rounded-xl hover:bg-white/10 transition-colors"
        >
          {isCollapsed ? <ChevronRight size={20} /> : <ChevronLeft size={20} />}
        </button>
      </div>

      <nav className="flex-1 px-4 space-y-2 mt-4 overflow-y-auto">
        {menuItems.map((item) => (
          <button
            key={item.id}
            className={cn(
              "w-full flex items-center gap-4 px-4 py-3 rounded-2xl transition-all duration-200 group",
              activeId === item.id
                ? "bg-accent-light/10 text-accent-light dark:bg-accent-dark/10 dark:text-accent-dark shadow-[0_0_15px_rgba(59,130,246,0.3)]"
                : "text-text-secondary-light dark:text-text-secondary-dark hover:bg-white/5"
            )}
          >
            <item.icon size={22} className={cn(
              "transition-transform duration-200 group-hover:scale-110",
              activeId === item.id && "drop-shadow-[0_0_8px_rgba(59,130,246,0.5)]"
            )} />
            {!isCollapsed && <span className="font-medium">{item.label}</span>}
          </button>
        ))}
      </nav>

      <div className="p-4 mt-auto">
        <button className="w-full flex items-center gap-4 px-4 py-3 rounded-2xl text-danger-light dark:text-danger-dark hover:bg-danger-light/10 transition-all duration-200">
          <LogOut size={22} />
          {!isCollapsed && <span className="font-medium">Déconnexion</span>}
        </button>
      </div>
    </aside>
    </>
  );
};
