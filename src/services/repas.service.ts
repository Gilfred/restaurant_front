import { api } from "../api/axios";
import type {
  RepasResponse,
  RepasCreate,
  RepasUpdate
} from "../types/repas";

/**
 * List available meals (repas).
 * GET /repas/
 */
export const listRepas = () => {
  return api.get<RepasResponse[]>("/repas/");
};

/**
 * Create a new meal.
 * POST /repas/
 */
export const createRepas = (data: RepasCreate) => {
  return api.post<RepasResponse>("/repas/", data);
};

/**
 * Get details for a single meal.
 * GET /repas/{repas_id}
 */
export const getRepas = (repasId: string) => {
  return api.get<RepasResponse>(`/repas/${repasId}`);
};

/**
 * Update a meal.
 * PATCH /repas/{repas_id}
 */
export const updateRepas = (repasId: string, data: RepasUpdate) => {
  return api.patch<RepasResponse>(`/repas/${repasId}`, data);
};

/**
 * Delete a meal.
 * DELETE /repas/{repas_id}
 */
export const deleteRepas = (repasId: string) => {
  return api.delete(`/repas/${repasId}`);
};
