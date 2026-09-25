import { api } from "../api/axios";
import type { CasierResponse } from "../types/casier";

/**
 * List casiers.
 * GET /casiers/
 */
export const listCasiers = () => {
  return api.get<CasierResponse[]>("/casiers/");
};
