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

export interface MenuCategorie {
  id: string;
  nom: string;
  ordre: number;
  menuFamilleId: string;
  createdAt?: string;
  updatedAt?: string;
  [key: string]: unknown;
}

export interface MenuCategorieCreate {
  nom: string;
  ordre?: number;
  menuFamilleId: string;
}

export interface MenuCategorieUpdate {
  nom?: string;
  ordre?: number;
  menuFamilleId?: string;
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

export interface MenuBoissonFamille {
  id: string;
  nom: string;
  restaurantId?: string;
  createdAt?: string;
  updatedAt?: string;
  images?: MenuBoissonImage[];
  boissons?: MenuBoisson[];
  [key: string]: unknown;
}

export interface MenuBoissonFamilleCreate {
  nom: string;
}

export interface MenuBoissonFamilleUpdate {
  nom: string;
}

export interface MenuBoissonImage {
  id: string;
  menuBoissonFamilleId: string;
  url: string;
  public_id?: string;
  createdAt?: string;
  updatedAt?: string;
  [key: string]: unknown;
}

export interface MenuBoisson {
  id: string;
  menuBoissonFamilleId: string;
  boissonId: string;
  createdAt?: string;
  updatedAt?: string;
  ordre?: number;
  imageUrl?: string | null;
  boisson?: unknown;
  nomBoisson?: string;
  prix?: number;
  [key: string]: unknown;
}

export interface MenuBoissonCreate {
  menuBoissonFamilleId: string;
  boissonId: string;
  ordre?: number;
  imageUrl?: string | null;
}

export interface MenuBoissonUpdate {
  menuBoissonFamilleId?: string;
  boissonId?: string;
  ordre?: number;
  imageUrl?: string | null;
}

export interface MenuDisplayRepasItem {
  id?: string;
  ordre?: number;
  repas?: {
    id?: string;
    nomRepas?: string;
    prix?: number;
    restaurantId?: string;
    createdAt?: string;
    updatedAt?: string;
    [key: string]: unknown;
  };
  [key: string]: unknown;
}

export interface MenuDisplayCategoryItem {
  id?: string;
  nom?: string;
  ordre?: number;
  repasList?: MenuDisplayRepasItem[];
  [key: string]: unknown;
}

export interface MenuDisplayFamilleItem {
  id?: string;
  nom?: string;
  ordre?: number;
  images?: MenuFamilleImage[];
  categories?: MenuDisplayCategoryItem[];
  [key: string]: unknown;
}

export interface MenuDisplayBoissonItem {
  id?: string;
  ordre?: number;
  imageUrl?: string | null;
  boissonId?: string;
  nomBoisson?: string;
  prix?: number;
  boisson?: {
    id?: string;
    nomBoisson?: string;
    prix?: number;
    [key: string]: unknown;
  };
  // Structured display support for drink families in display endpoint
  famille?: {
    id?: string;
    nom?: string;
    restaurantId?: string;
    [key: string]: unknown;
  };
  images?: MenuBoissonImage[];
  boissons?: MenuDisplayBoissonItem[];
  [key: string]: unknown;
}

export interface MenuDisplayRestaurantItem {
  restaurant?: {
    id: string;
    name?: string;
    address?: string;
    phone?: string;
    description?: string;
    cuisine?: string;
    image?: string;
    rating?: number;
    [key: string]: unknown;
  };
  familles?: MenuDisplayFamilleItem[];
  boissons?: MenuDisplayBoissonItem[];
  // Flat fallback properties for backwards compatibility
  id?: string;
  name?: string;
  address?: string;
  phone?: string;
  description?: string;
  cuisine?: string;
  image?: string;
  rating?: number;
  familleImages?: MenuFamilleImage[];
  categories?: string[];
  repas?: MenuRepas[];
  [key: string]: unknown;
}

export interface MenuDisplayResponse {
  restaurants: MenuDisplayRestaurantItem[];
}
