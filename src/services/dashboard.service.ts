import { api } from "../api/axios";
import type { DashboardOverviewResponse, OverviewPeriod } from "../types/dashboard";

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
