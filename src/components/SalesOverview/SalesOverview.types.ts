import type { DashboardSalesPoint, WeeklySalesPoint } from '../../types/dashboard';

export interface SalesOverviewProps {
  data?: (DashboardSalesPoint | WeeklySalesPoint)[];
  currency?: string;
  loading?: boolean;
}
