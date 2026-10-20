export type OverviewPeriod =
  | 'today'
  | '7d'
  | '30d'
  | 'current_month'
  | 'previous_month';

export interface OverviewMetric {
  current: number;
  previous: number;
  variation_absolute: number;
  percentage_change: number;
}

export interface DashboardOverviewResponse {
  period: OverviewPeriod;
  currency: string;
  revenue: OverviewMetric;
  orders_count: OverviewMetric;
  total_orders_received: OverviewMetric;
  limitations_note?: string;
}

export interface DashboardSalesPoint {
  date: string;
  revenue: number;
  orders_count: number;
  total_orders_received: number;
}

export interface DashboardSalesResponse {
  period: OverviewPeriod;
  currency: string;
  data: DashboardSalesPoint[];
}
