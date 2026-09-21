export interface RepasDisplay {
  id: string;
  nom: string;
  description?: string;
  prix?: number | null;
  formattedPrice?: string;
}

export interface CategoryDisplay {
  id: string;
  nom: string;
  ordre?: number;
  repasList: RepasDisplay[];
}

export interface FamilleImageDisplay {
  id: string;
  imageUrl: string;
  ordre?: number;
}

export interface FamilleDisplay {
  id: string;
  nom: string;
  ordre?: number;
  images: FamilleImageDisplay[];
  categories: CategoryDisplay[];
}

export interface BoissonDisplay {
  id: string;
  nom: string;
  description?: string;
  prix?: number | null;
  formattedPrice?: string;
  imageUrl?: string | null;
}

export interface RestaurantDisplay {
  id: string;
  name: string;
  cuisine?: string;
  rating?: number;
  image?: string;
  description?: string;
  address?: string;
  phone?: string;
  familles: FamilleDisplay[];
  boissons: BoissonDisplay[];
}

// Legacy interfaces for backwards compatibility if needed
export interface Dish {
  id: string;
  name: string;
  description?: string;
  price: string;
  category: string;
  image?: string;
}

export interface Restaurant {
  id: string;
  name: string;
  cuisine?: string;
  rating?: number;
  image?: string;
  description?: string;
  address?: string;
  menu: Dish[];
}
