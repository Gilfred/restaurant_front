import React, { useState } from 'react';
import {
  LayoutDashboard,
  ShoppingCart,
  UtensilsCrossed,
  CalendarDays,
  ChefHat,
  Package,
  BarChart3,
  Settings,
  LogOut,
  ChevronLeft,
  ChevronRight,
  ChevronDown,
  Building2,
  Users2,
  ShieldCheck,
  PlusCircle,
  EyeOff,
  History,
  UserPlus,
  Inbox,
  Briefcase,
  Contact,
  Salad,
  List,
  CookingPot,
  Scale
} from 'lucide-react';
import { cn } from '../../utils/cn';
import { useNavigate } from 'react-router-dom';
import { useAuth } from '../../contexts/AuthContext';
import type { SidebarProps, MenuItem } from './Sidebar.types';

const menuItems: MenuItem[] = [
  { icon: LayoutDashboard, label: 'Dashboard', id: 'dashboard' },
  { icon: ShoppingCart, label: 'Commandes', id: 'orders' },
  { icon: UtensilsCrossed, label: 'Tables', id: 'tables' },
  { icon: CalendarDays, label: 'Réservations', id: 'reservations' },
  {
    icon: ChefHat,
    label: 'Cuisine',
    id: 'kitchen',
    children: [
      { id: 'cuisine-appro', label: 'Approvisionnements' }
    ]
  },
  {
    icon: Building2,
    label: 'Resto',
    id: 'resto',
    children: [
      { id: 'resto-restaurants', label: 'Restaurants' },
      { id: 'resto-inactive', label: 'Inactifs' },
      { id: 'resto-history', label: 'Historique d\'activation' },
      { id: 'resto-staff', label: 'Personnel' },
      { id: 'resto-admin', label: 'Administration' },
    ]
  },
  {
    icon: UserPlus,
    label: 'Affiliation',
    id: 'affiliation',
    children: [
      { id: 'affiliation-join', label: 'Rejoindre' },
      { id: 'affiliation-requests', label: 'Demandes' },
      { id: 'affiliation-my-restaurant', label: 'Mon Restaurant' },
      { id: 'affiliation-employees', label: 'Employés' }
    ]
  },
  {
    icon: Salad,
    label: 'Condiments',
    id: 'condiments',
    children: [
      { id: 'condiments-list', label: 'Liste' },
      { id: 'condiments-unites', label: 'Unités' }
    ]
  },
  { icon: Package, label: 'Stocks', id: 'inventory' },
  { icon: BarChart3, label: 'Rapports', id: 'reports' },
  { icon: Settings, label: 'Paramètres', id: 'settings' },
];

export const Sidebar: React.FC<SidebarProps> = ({
  activeId = 'dashboard',
  isOpen,
  setIsOpen,
  isCollapsed,
  setIsCollapsed,
  onMenuItemClick
}) => {
  const navigate = useNavigate();
  const { logoutUser } = useAuth();
  const [isRestoExpanded, setIsRestoExpanded] = useState(true);
  const [isAffiliationExpanded, setIsAffiliationExpanded] = useState(true);
  const [isCondimentsExpanded, setIsCondimentsExpanded] = useState(true);
  const [isKitchenExpanded, setIsKitchenExpanded] = useState(true);

  const handleLogout = async () => {
    try {
      await logoutUser();
      navigate('/login', { replace: true });
    } catch (error) {
      console.error('Logout failed', error);
      navigate('/login', { replace: true });
    }
  };

  const handleItemClick = (item: MenuItem) => {
    if (item.id === 'resto') {
      if (isCollapsed) {
        setIsCollapsed(false);
        setIsRestoExpanded(true);
      } else {
        setIsRestoExpanded(!isRestoExpanded);
      }
    } else if (item.id === 'affiliation') {
      if (isCollapsed) {
        setIsCollapsed(false);
        setIsAffiliationExpanded(true);
      } else {
        setIsAffiliationExpanded(!isAffiliationExpanded);
      }
    } else if (item.id === 'condiments') {
      if (isCollapsed) {
        setIsCollapsed(false);
        setIsCondimentsExpanded(true);
      } else {
        setIsCondimentsExpanded(!isCondimentsExpanded);
      }
    } else if (item.id === 'kitchen') {
      if (isCollapsed) {
        setIsCollapsed(false);
        setIsKitchenExpanded(true);
      } else {
        setIsKitchenExpanded(!isKitchenExpanded);
      }
    } else {
      onMenuItemClick?.(item.id);
    }
  };

  const handleChildClick = (childId: string) => {
    onMenuItemClick?.(childId);
  };

  // Icon mapping for sub-menus
  const getSubmenuIcon = (id: string) => {
    switch (id) {
      case 'resto-restaurants':
        return <PlusCircle size={16} />;
      case 'resto-inactive':
        return <EyeOff size={16} />;
      case 'resto-history':
        return <History size={16} />;
      case 'resto-staff':
        return <Users2 size={16} />;
      case 'resto-admin':
        return <ShieldCheck size={16} />;
      case 'affiliation-join':
        return <UserPlus size={16} />;
      case 'affiliation-requests':
        return <Inbox size={16} />;
      case 'affiliation-my-restaurant':
        return <Briefcase size={16} />;
      case 'affiliation-employees':
        return <Contact size={16} />;
      case 'condiments-list':
        return <List size={16} />;
      case 'condiments-unites':
        return <Scale size={16} />;
      case 'cuisine-appro':
        return <CookingPot size={16} />;
      default:
        return null;
    }
  };

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
          {menuItems.map((item) => {
            const hasChildren = item.children && item.children.length > 0;
            const isSelected = activeId === item.id || (hasChildren && item.children?.some(c => c.id === activeId));

            let isExpanded = false;
            if (item.id === 'resto') isExpanded = isRestoExpanded;
            else if (item.id === 'affiliation') isExpanded = isAffiliationExpanded;
            else if (item.id === 'condiments') isExpanded = isCondimentsExpanded;
            else if (item.id === 'kitchen') isExpanded = isKitchenExpanded;

            const visibleChildren = item.children;

            return (
              <div key={item.id} className="space-y-1">
                <button
                  onClick={() => handleItemClick(item)}
                  className={cn(
                    "w-full flex items-center justify-between px-4 py-3 rounded-2xl transition-all duration-300 group relative overflow-hidden glass-capsule",
                    isSelected
                      ? "bg-accent-light/15 dark:bg-accent-dark/15 text-accent-light dark:text-accent-dark border-accent-light/30 border"
                      : "text-text-secondary-light dark:text-text-secondary-dark hover:text-text-primary-light dark:hover:text-text-primary-dark"
                  )}
                >
                  <div className="flex items-center gap-4">
                    <item.icon size={20} className={cn(
                      "transition-transform duration-300 group-hover:scale-110",
                      isSelected ? "text-accent-light dark:text-accent-dark" : "group-hover:text-accent-light dark:group-hover:text-accent-dark"
                    )} />
                    {!isCollapsed && <span className="font-medium text-sm">{item.label}</span>}
                  </div>
                  {hasChildren && !isCollapsed && (
                    <ChevronDown
                      size={16}
                      className={cn(
                        "transition-transform duration-300 text-text-secondary-light dark:text-text-secondary-dark",
                        isExpanded ? "transform rotate-180" : ""
                      )}
                    />
                  )}
                </button>

                {/* Sub-menu rendering */}
                {hasChildren && isExpanded && !isCollapsed && (
                  <div className="pl-6 space-y-1 mt-1 transition-all duration-300">
                    {visibleChildren?.map((child) => {
                      const isChildActive = activeId === child.id;
                      return (
                        <button
                          key={child.id}
                          onClick={() => handleChildClick(child.id)}
                          className={cn(
                            "w-full flex items-center gap-3 px-4 py-2.5 rounded-xl text-xs font-semibold transition-all duration-200",
                            isChildActive
                              ? "bg-accent-light/15 dark:bg-accent-dark/15 text-white shadow-md shadow-accent-light/10"
                              : "text-text-secondary-light dark:text-text-secondary-dark hover:text-text-primary-light dark:hover:text-text-primary-dark hover:bg-black/5 dark:hover:bg-white/5"
                          )}
                        >
                          {getSubmenuIcon(child.id)}
                          <span>{child.label}</span>
                        </button>
                      );
                    })}
                  </div>
                )}
              </div>
            );
          })}
        </nav>

        <div className="p-4 mt-auto border-t border-black/5 dark:border-white/5">
          <button
            onClick={handleLogout}
            className="w-full flex items-center gap-4 px-4 py-3 rounded-2xl text-danger-light dark:text-danger-dark hover:bg-danger-light/10 transition-all duration-200"
          >
            <LogOut size={22} />
            {!isCollapsed && <span className="font-medium">Déconnexion</span>}
          </button>
        </div>
      </aside>
    </>
  );
};
