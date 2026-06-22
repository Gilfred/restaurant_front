import type { LucideIcon } from 'lucide-react';

export interface Activity {
  id: number;
  type: string;
  title: string;
  time: string;
  icon: LucideIcon;
  color: string;
  bg: string;
}
