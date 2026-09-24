import { api } from "../api/axios";
import type {
  MenuDisplayResponse,
  MenuFamille,
  MenuFamilleCreate,
  MenuFamilleUpdate,
  MenuFamilleImage,
  MenuFamilleImageUploadResponse,
  MenuCategorie,
  MenuCategorieCreate,
  MenuCategorieUpdate,
  MenuRepas,
  MenuRepasCreate,
  MenuRepasUpdate,
  MenuBoissonFamille,
  MenuBoissonFamilleCreate,
  MenuBoissonFamilleUpdate,
  MenuBoissonImage,
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
 * List Category Enum Names
 * GET /menus/categories/noms
 */
export const listCategoryNoms = () => {
  return api.get<string[]>("/menus/categories/noms");
};

/**
 * Create Menu Categorie
 * POST /menus/categories
 */
export const createMenuCategorie = (data: MenuCategorieCreate) => {
  return api.post<MenuCategorie>("/menus/categories", data);
};

/**
 * Update Menu Categorie
 * PATCH /menus/categories/{categorie_id}
 */
export const updateMenuCategorie = (categorieId: string, data: MenuCategorieUpdate) => {
  return api.patch<MenuCategorie>(`/menus/categories/${categorieId}`, data);
};

/**
 * Delete Menu Categorie
 * DELETE /menus/categories/{categorie_id}
 */
export const deleteMenuCategorie = (categorieId: string) => {
  return api.delete<void>(`/menus/categories/${categorieId}`);
};

/**
 * Create Menu Repas
 * POST /menus/repas
 */
export const createMenuRepas = (data: MenuRepasCreate) => {
  return api.post<MenuRepas>("/menus/repas", data);
};

/**
 * Update Menu Repas
 * PATCH /menus/repas/{menu_repas_id}
 */
export const updateMenuRepas = (menuRepasId: string, data: MenuRepasUpdate) => {
  return api.patch<MenuRepas>(`/menus/repas/${menuRepasId}`, data);
};

/**
 * Delete Menu Repas
 * DELETE /menus/repas/{menu_repas_id}
 */
export const deleteMenuRepas = (menuRepasId: string) => {
  return api.delete<void>(`/menus/repas/${menuRepasId}`);
};

/**
 * List Boisson Familles
 * GET /menus/boissons/familles
 */
export const listMenuBoissonFamilles = () => {
  return api.get<MenuBoissonFamille[]>("/menus/boissons/familles");
};

/**
 * Create Boisson Famille
 * POST /menus/boissons/familles
 */
export const createMenuBoissonFamille = (data: MenuBoissonFamilleCreate) => {
  return api.post<MenuBoissonFamille>("/menus/boissons/familles", data);
};

/**
 * Get Boisson Famille
 * GET /menus/boissons/familles/{famille_id}
 */
export const getMenuBoissonFamille = (familleId: string) => {
  return api.get<MenuBoissonFamille>(`/menus/boissons/familles/${familleId}`);
};

/**
 * Update Boisson Famille
 * PATCH /menus/boissons/familles/{famille_id}
 */
export const updateMenuBoissonFamille = (familleId: string, data: MenuBoissonFamilleUpdate) => {
  return api.patch<MenuBoissonFamille>(`/menus/boissons/familles/${familleId}`, data);
};

/**
 * Delete Boisson Famille
 * DELETE /menus/boissons/familles/{famille_id}
 */
export const deleteMenuBoissonFamille = (familleId: string) => {
  return api.delete<void>(`/menus/boissons/familles/${familleId}`);
};

/**
 * Upload Boisson Famille Image
 * POST /menus/boissons/familles/{famille_id}/images
 */
export const uploadMenuBoissonFamilleImage = (familleId: string, file: File) => {
  const formData = new FormData();
  formData.append("file", file);

  return api.post<MenuBoissonImage>(`/menus/boissons/familles/${familleId}/images`, formData, {
    headers: {
      "Content-Type": "multipart/form-data",
    },
  });
};

/**
 * List Boisson Famille Images
 * GET /menus/boissons/familles/{famille_id}/images
 */
export const listMenuBoissonFamilleImages = (familleId: string) => {
  return api.get<MenuBoissonImage[]>(`/menus/boissons/familles/${familleId}/images`);
};

/**
 * Delete Boisson Famille Image
 * DELETE /menus/boissons/images/{image_id}
 */
export const deleteMenuBoissonImage = (imageId: string) => {
  return api.delete<void>(`/menus/boissons/images/${imageId}`);
};

/**
 * Create Menu Boisson
 * POST /menus/boissons
 */
export const createMenuBoisson = (data: MenuBoissonCreate) => {
  return api.post<MenuBoisson>("/menus/boissons", data);
};

/**
 * Update Menu Boisson
 * PATCH /menus/boissons/{menu_boisson_id}
 */
export const updateMenuBoisson = (menuBoissonId: string, data: MenuBoissonUpdate) => {
  return api.patch<MenuBoisson>(`/menus/boissons/${menuBoissonId}`, data);
};

/**
 * Delete Menu Boisson
 * DELETE /menus/boissons/{menu_boisson_id}
 */
export const deleteMenuBoisson = (menuBoissonId: string) => {
  return api.delete<void>(`/menus/boissons/${menuBoissonId}`);
};
