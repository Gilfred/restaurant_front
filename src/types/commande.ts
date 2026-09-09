export interface CommandeUser {
  id: string;
  name: string;
  email: string;
}

export interface CommandeBoissonDetail {
  id: string;
  nomBoisson?: string;
  contenance?: string;
  prixVente?: number;
  stock?: number;
  restaurantId?: string;
  createdAt?: string;
  updatedAt?: string;
}

export interface CommandeRepasDetail {
  id: string;
  nomRepas?: string;
  prix?: number;
  restaurantId?: string;
  createdAt?: string;
  updatedAt?: string;
}

export interface CommandeArticle {
  id: string;
  boissonId?: string | null;
  repasId?: string | null;
  qte: number;
  prixUnitaire: number;
  sousTotal: number;
  isActive: boolean;
  boisson?: CommandeBoissonDetail | null;
  repas?: CommandeRepasDetail | null;
}

export interface CommandeArticleCreate {
  boissonId?: string | null;
  repasId?: string | null;
  qte: number;
}

export interface CommandeCreate {
  userId: string;
  articles: CommandeArticleCreate[];
}

export interface CommandeUpdate {
  statut?: string;
  total?: number;
}

export interface CommandeResponse {
  id: string;
  restaurantId: string;
  numeroCommande: string;
  userId: string;
  total: number;
  statut: string;
  createdAt: string;
  updatedAt: string;
  user?: CommandeUser;
  articles?: CommandeArticle[];
}

export interface WaiterResponse {
  id: string;
  name: string;
  email: string;
}
