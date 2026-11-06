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

export type DistributionType = 'status' | 'category';

export interface StatusDistributionItem {
  statut: string;
  label: string;
  count: number;
  percentage: number;
  total_amount: number;
}

export interface CategoryDistributionItem {
  id?: string;
  name: string;
  type?: string;
  quantity: number;
  revenue: number;
  percentage: number;
}

export interface OrdersDistributionResponse {
  period: string;
  currency: string;
  type: DistributionType | string;
  total_orders: number;
  total_revenue: number;
  status_distribution?: StatusDistributionItem[];
  category_distribution?: CategoryDistributionItem[];
}

export interface TopProductItem {
  product_id?: string;
  name: string;
  type?: string;
  quantity: number;
  revenue: number;
  percentage: number;
}

export interface TopProductsResponse {
  period: string;
  currency: string;
  total_quantity: number;
  data: TopProductItem[];
}
