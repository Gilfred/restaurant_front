import { api } from "../api/axios";
import type {
  BoissonResponse,
  BoissonCreate,
  BoissonUpdate
} from "../types/boisson";

/**
 * List available drinks (boissons).
 * GET /boissons/
 */
export const listBoissons = () => {
  return api.get<BoissonResponse[]>("/boissons/");
};

/**
 * Create a new drink.
 * POST /boissons/
 */
export const createBoisson = (data: BoissonCreate) => {
  return api.post<BoissonResponse>("/boissons/", data);
};

/**
 * Get a single drink details.
 * GET /boissons/{boisson_id}
 */
export const getBoisson = (boissonId: string) => {
  return api.get<BoissonResponse>(`/boissons/${boissonId}`);
};

/**
 * Update a drink.
 * PATCH /boissons/{boisson_id}
 */
export const updateBoisson = (boissonId: string, data: BoissonUpdate) => {
  return api.patch<BoissonResponse>(`/boissons/${boissonId}`, data);
};

/**
 * Delete a drink.
 * DELETE /boissons/{boisson_id}
 */
export const deleteBoisson = (boissonId: string) => {
  return api.delete(`/boissons/${boissonId}`);
};
