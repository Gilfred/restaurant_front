import type { LucideIcon } from 'lucide-react';

export interface Stat {
  title: string;
  value: string;
  trend: number;
  icon: LucideIcon;
  color: 'blue' | 'green' | 'orange' | 'red';
  data: { value: number }[];
}

export interface BestSellingProduct {
  name: string;
  sales: string;
  price: string;
  progress: number;
  color: string;
}
