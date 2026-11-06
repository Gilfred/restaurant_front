import { api } from "../api/axios";
import type {
  DashboardOverviewResponse,
  DashboardSalesResponse,
  DistributionType,
  OrdersDistributionResponse,
  OverviewPeriod,
  TopProductsResponse,
  WeeklySalesResponse,
} from "../types/dashboard";

/**
 * Get Dashboard Overview metrics (CA, paid orders count, total orders received).
 * GET /dashboard/overview?period={period}
 * Restricted to ADMIN, SUPERADMIN, RESTAURANT_OWNER.
 */
export const getDashboardOverview = (period: OverviewPeriod = "7d") => {
  return api.get<DashboardOverviewResponse>("/dashboard/overview", {
    params: { period },
  });
};

/**
 * Get Orders Distribution (by status or category/type).
 * GET /dashboard/orders/distribution?period={period}&type={type}
 * Restricted to ADMIN, SUPERADMIN, RESTAURANT_OWNER.
 */
export const getOrdersDistribution = (
  period: OverviewPeriod | string = "7d",
  type: DistributionType = "category"
) => {
  const queryPeriod = period === "weekly" ? "7d" : period;
  return api.get<OrdersDistributionResponse>("/dashboard/orders/distribution", {
    params: { period: queryPeriod, type },
  });
};

/**
 * Get Top Selling Products.
 * GET /dashboard/products/top-selling?period={period}&limit={limit}
 * Restricted to ADMIN, SUPERADMIN, RESTAURANT_OWNER.
 */
export const getTopSellingProducts = (
  period: OverviewPeriod | string = "7d",
  limit: number = 10
) => {
  const queryPeriod = period === "weekly" ? "7d" : period;
  return api.get<TopProductsResponse>("/dashboard/products/top-selling", {
    params: { period: queryPeriod, limit },
  });
};

/**
 * Get Weekly Sales Evolution data for current week (Monday to Sunday).
 * GET /dashboard/sales/weekly
 * Restricted to ADMIN, SUPERADMIN, RESTAURANT_OWNER.
 */
export const getWeeklySales = () => {
  return api.get<WeeklySalesResponse>("/dashboard/sales/weekly");
};

/**
 * Get Sales Evolution time series data for the selected period.
 * GET /dashboard/sales?period={period}
 * Restricted to ADMIN, SUPERADMIN, RESTAURANT_OWNER.
 */
export const getDashboardSales = (period: OverviewPeriod | 'weekly' = "7d") => {
  if (period === 'weekly') {
    return api.get<WeeklySalesResponse>("/dashboard/sales/weekly");
  }
  return api.get<DashboardSalesResponse>("/dashboard/sales", {
    params: { period },
  });
};
