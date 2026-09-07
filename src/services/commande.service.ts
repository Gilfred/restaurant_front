import { api } from "../api/axios";
import type {
  CommandeCreate,
  CommandeUpdate,
  CommandeResponse,
  WaiterResponse,
} from "../types/commande";

/**
 * List current restaurant commandes.
 * GET /commandes/
 */
export const listCommandes = () => {
  return api.get<CommandeResponse[]>("/commandes/");
};

/**
 * Create a new commande.
 * POST /commandes/
 */
export const createCommande = (data: CommandeCreate) => {
  return api.post<CommandeResponse>("/commandes/", data);
};

/**
 * List restaurant waiters (serveuses).
 * GET /commandes/serveuses
 */
export const listWaiters = () => {
  return api.get<WaiterResponse[]>("/commandes/serveuses");
};

/**
 * List my commandes.
 * GET /commandes/me
 */
export const listMyCommandes = () => {
  return api.get<CommandeResponse[]>("/commandes/me");
};

/**
 * Get a specific commande by ID.
 * GET /commandes/{commande_id}
 */
export const getCommande = (commandeId: string) => {
  return api.get<CommandeResponse>(`/commandes/${commandeId}`);
};

/**
 * Update a specific commande by ID.
 * PATCH /commandes/{commande_id}
 */
export const updateCommande = (commandeId: string, data: CommandeUpdate) => {
  return api.patch<CommandeResponse>(`/commandes/${commandeId}`, data);
};

/**
 * Delete a specific commande by ID.
 * DELETE /commandes/{commande_id}
 */
export const deleteCommande = (commandeId: string) => {
  return api.delete<string | void>(`/commandes/${commandeId}`);
};
