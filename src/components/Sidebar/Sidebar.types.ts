import type { LucideIcon } from 'lucide-react';

export interface MenuItem {
  icon: LucideIcon;
  label: string;
  id: string;
  children?: { id: string; label: string }[];
}

export interface SidebarProps {
  activeId?: string;
  isOpen: boolean;
  setIsOpen: (isOpen: boolean) => void;
  isCollapsed: boolean;
  setIsCollapsed: (isCollapsed: boolean) => void;
  onMenuItemClick?: (id: string) => void;
}
