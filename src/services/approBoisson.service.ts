import { api } from "../api/axios";
import type {
  ApproBoissonResponse,
  ApproBoissonCreate,
  ApproBoissonUpdate,
} from "../types/boisson";

/**
 * List beverage supplies (approvisionnements boisson).
 * GET /appro-boisson/
 */
export const listApproBoissons = () => {
  return api.get<ApproBoissonResponse[]>("/appro-boisson/");
};

/**
 * Create a new beverage supply (approvisionnement boisson).
 * POST /appro-boisson/
 */
export const createApproBoisson = (data: ApproBoissonCreate) => {
  return api.post<ApproBoissonResponse>("/appro-boisson/", data);
};

/**
 * Get a specific beverage supply by ID.
 * GET /appro-boisson/{appro_id}
 */
export const getApproBoisson = (approId: string) => {
  return api.get<ApproBoissonResponse>(`/appro-boisson/${approId}`);
};

/**
 * Update a specific beverage supply by ID.
 * PATCH /appro-boisson/{appro_id}
 */
export const updateApproBoisson = (approId: string, data: ApproBoissonUpdate) => {
  return api.patch<ApproBoissonResponse>(`/appro-boisson/${approId}`, data);
};

/**
 * Delete a specific beverage supply by ID.
 * DELETE /appro-boisson/{appro_id}
 */
export const deleteApproBoisson = (approId: string) => {
  return api.delete<string | void>(`/appro-boisson/${approId}`);
};
