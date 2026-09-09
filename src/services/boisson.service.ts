import { api } from "../api/axios";
import type { BoissonResponse } from "../types/boisson";

/**
 * List available drinks (boissons).
 * GET /boissons/
 */
export const listBoissons = () => {
  return api.get<BoissonResponse[]>("/boissons/");
};
