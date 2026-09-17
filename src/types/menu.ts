export interface MenuFamille {
  id: string;
  nom: string;
  ordre: number;
  restaurantId?: string;
  createdAt?: string;
  updatedAt?: string;
  images?: MenuFamilleImage[];
  [key: string]: unknown;
}

export interface MenuFamilleCreate {
  nom: string;
  ordre?: number;
}

export interface MenuFamilleUpdate {
  nom?: string;
  ordre?: number;
}

export interface MenuFamilleImage {
  id: string;
  familleId: string;
  imageUrl: string;
  ordre: number;
  public_id?: string;
}

export interface MenuFamilleImageUploadResponse {
  id: string;
  familleId: string;
  imageUrl: string;
  ordre: number;
  public_id?: string;
}

export interface MenuRepas {
  id: string;
  ordre: number;
  menuCategorieId: string;
  repasId: string;
  createdAt?: string;
  updatedAt?: string;
  [key: string]: unknown;
}

export interface MenuRepasCreate {
  ordre?: number;
  menuCategorieId: string;
  repasId: string;
}

export interface MenuRepasUpdate {
  ordre?: number;
  menuCategorieId?: string;
  repasId?: string;
}

export interface MenuBoisson {
  id: string;
  ordre: number;
  imageUrl?: string | null;
  boissonId: string;
  createdAt?: string;
  updatedAt?: string;
  [key: string]: unknown;
}

export interface MenuBoissonCreate {
  ordre?: number;
  imageUrl?: string | null;
  boissonId: string;
}

export interface MenuBoissonUpdate {
  ordre?: number;
  imageUrl?: string | null;
  boissonId?: string;
}

export interface MenuDisplayRestaurant {
  id: string;
  name?: string;
  address?: string;
  phone?: string;
  description?: string;
  cuisine?: string;
  image?: string;
  familles?: MenuFamille[];
  familleImages?: MenuFamilleImage[];
  categories?: string[];
  repas?: MenuRepas[];
  boissons?: MenuBoisson[];
  [key: string]: unknown;
}

export interface MenuDisplayResponse {
  restaurants: MenuDisplayRestaurant[];
}
