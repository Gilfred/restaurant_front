import type { WeeklySalesPoint } from '../../types/dashboard';

export interface RevenueData {
  name: string;
  sales: number;
  revenue: number;
  orders_count?: number;
  total_orders_received?: number;
  date?: string;
}

export interface RevenueWeeklyProps {
  data?: WeeklySalesPoint[];
  currency?: string;
  loading?: boolean;
}
