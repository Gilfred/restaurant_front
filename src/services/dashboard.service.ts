import { api } from "../api/axios";
import type { DashboardOverviewResponse, DashboardSalesResponse, OverviewPeriod } from "../types/dashboard";

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
 * Get Sales Evolution time series data for the selected period.
 * GET /dashboard/sales?period={period}
 * Restricted to ADMIN, SUPERADMIN, RESTAURANT_OWNER.
 */
export const getDashboardSales = (period: OverviewPeriod = "7d") => {
  return api.get<DashboardSalesResponse>("/dashboard/sales", {
    params: { period },
  });
};
