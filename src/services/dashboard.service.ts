import { api } from "../api/axios";
import type {
  DashboardOverviewResponse,
  DashboardSalesResponse,
  OverviewPeriod,
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
