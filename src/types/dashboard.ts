export type OverviewPeriod =
  | 'today'
  | 'weekly'
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

export interface WeeklySalesPoint {
  date: string;
  day: string;
  revenue: number;
  orders_count: number;
  total_orders_received: number;
}

export interface WeeklySalesResponse {
  period: 'weekly' | string;
  currency: string;
  start_date: string;
  end_date: string;
  data: WeeklySalesPoint[];
}
