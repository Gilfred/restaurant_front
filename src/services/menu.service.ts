import { api } from "../api/axios";
import type {
  MenuDisplayResponse,
  MenuFamille,
  MenuFamilleCreate,
  MenuFamilleUpdate,
  MenuFamilleImage,
  MenuFamilleImageUploadResponse,
  MenuRepas,
  MenuRepasCreate,
  MenuRepasUpdate,
  MenuBoisson,
  MenuBoissonCreate,
  MenuBoissonUpdate,
} from "../types/menu";

/**
 * Get Public Menu Display
 * GET /menus/display
 */
export const getPublicMenuDisplay = () => {
  return api.get<MenuDisplayResponse>("/menus/display");
};

/**
 * Upload Menu Image
 * POST /menus/upload
 */
export const uploadMenuImage = (file: File, familleId: string, ordre?: number) => {
  const formData = new FormData();
  formData.append("file", file);
  formData.append("famille_id", familleId);
  if (ordre !== undefined && ordre !== null) {
    formData.append("ordre", ordre.toString());
  }

  return api.post<MenuFamilleImageUploadResponse>("/menus/upload", formData, {
    headers: {
      "Content-Type": "multipart/form-data",
    },
  });
};

/**
 * List Familles
 * GET /menus/familles
 */
export const listFamilles = () => {
  return api.get<MenuFamille[]>("/menus/familles");
};

/**
 * Create Famille
 * POST /menus/familles
 */
export const createFamille = (data: MenuFamilleCreate) => {
  return api.post<MenuFamille>("/menus/familles", data);
};

/**
 * Get Famille
 * GET /menus/familles/{famille_id}
 */
export const getFamille = (familleId: string) => {
  return api.get<MenuFamille>(`/menus/familles/${familleId}`);
};

/**
 * Update Famille
 * PATCH /menus/familles/{famille_id}
 */
export const updateFamille = (familleId: string, data: MenuFamilleUpdate) => {
  return api.patch<MenuFamille>(`/menus/familles/${familleId}`, data);
};

/**
 * Delete Famille
 * DELETE /menus/familles/{famille_id}
 */
export const deleteFamille = (familleId: string) => {
  return api.delete<void>(`/menus/familles/${familleId}`);
};

/**
 * Update Famille Image
 * PATCH /menus/famille-images/{image_id}
 */
export const updateFamilleImage = (imageId: string, file?: File | null, ordre?: number | null) => {
  const formData = new FormData();
  if (file) {
    formData.append("file", file);
  }
  if (ordre !== undefined && ordre !== null) {
    formData.append("ordre", ordre.toString());
  }

  return api.patch<MenuFamilleImage>(`/menus/famille-images/${imageId}`, formData, {
    headers: {
      "Content-Type": "multipart/form-data",
    },
  });
};

/**
 * Delete Famille Image
 * DELETE /menus/famille-images/{image_id}
 */
export const deleteFamilleImage = (imageId: string) => {
  return api.delete<void>(`/menus/famille-images/${imageId}`);
};

/**
 * List Available Categories
 * GET /menus/categories
 */
export const listAvailableCategories = () => {
  return api.get<string[]>("/menus/categories");
};

/**
 * Create Menu Repas
 * POST /menus/repas
 */
export const createMenuRepas = (data: MenuRepasCreate) => {
  const payload: Record<string, any> = {
    ordre: data.ordre ?? 0,
    menuCategorieId: data.menuCategorieId,
    menu_categorie_id: data.menuCategorieId,
    repasId: data.repasId,
    repas_id: data.repasId,
  };
  return api.post<MenuRepas>("/menus/repas", payload);
};

/**
 * Update Menu Repas
 * PATCH /menus/repas/{menu_repas_id}
 */
export const updateMenuRepas = (menuRepasId: string, data: MenuRepasUpdate) => {
  const payload: Record<string, any> = {};
  if (data.ordre !== undefined) payload.ordre = data.ordre;
  if (data.menuCategorieId !== undefined) {
    payload.menuCategorieId = data.menuCategorieId;
    payload.menu_categorie_id = data.menuCategorieId;
  }
  if (data.repasId !== undefined) {
    payload.repasId = data.repasId;
    payload.repas_id = data.repasId;
  }
  return api.patch<MenuRepas>(`/menus/repas/${menuRepasId}`, payload);
};

/**
 * Delete Menu Repas
 * DELETE /menus/repas/{menu_repas_id}
 */
export const deleteMenuRepas = (menuRepasId: string) => {
  return api.delete<void>(`/menus/repas/${menuRepasId}`);
};

/**
 * Create Menu Boisson
 * POST /menus/boissons
 */
export const createMenuBoisson = (data: MenuBoissonCreate) => {
  const payload: Record<string, any> = {
    ordre: data.ordre ?? 0,
    boissonId: data.boissonId,
    boisson_id: data.boissonId,
    imageUrl: data.imageUrl ?? null,
    image_url: data.imageUrl ?? null,
  };
  return api.post<MenuBoisson>("/menus/boissons", payload);
};

/**
 * Update Menu Boisson
 * PATCH /menus/boissons/{menu_boisson_id}
 */
export const updateMenuBoisson = (menuBoissonId: string, data: MenuBoissonUpdate) => {
  const payload: Record<string, any> = {};
  if (data.ordre !== undefined) payload.ordre = data.ordre;
  if (data.boissonId !== undefined) {
    payload.boissonId = data.boissonId;
    payload.boisson_id = data.boissonId;
  }
  if (data.imageUrl !== undefined) {
    payload.imageUrl = data.imageUrl;
    payload.image_url = data.imageUrl;
  }
  return api.patch<MenuBoisson>(`/menus/boissons/${menuBoissonId}`, payload);
};

/**
 * Delete Menu Boisson
 * DELETE /menus/boissons/{menu_boisson_id}
 */
export const deleteMenuBoisson = (menuBoissonId: string) => {
  return api.delete<void>(`/menus/boissons/${menuBoissonId}`);
};
