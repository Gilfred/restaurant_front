import type { DashboardSalesPoint } from '../../types/dashboard';

export interface SalesOverviewProps {
  data?: DashboardSalesPoint[];
  currency?: string;
  loading?: boolean;
}
