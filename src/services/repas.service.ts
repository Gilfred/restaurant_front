import { api } from "../api/axios";
import type { RepasResponse } from "../types/repas";

/**
 * List available meals (repas).
 * GET /repas/
 */
export const listRepas = () => {
  return api.get<RepasResponse[]>("/repas/");
};
