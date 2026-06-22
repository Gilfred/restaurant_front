import type { LucideIcon } from 'lucide-react';

export interface StatCardProps {
  title: string;
  value: string;
  trend: number;
  icon: LucideIcon;
  chartData: { value: number }[];
  color: 'blue' | 'green' | 'orange' | 'red';
}
