export interface BoissonResponse {
  id: string;
  nomBoisson: string;
  prixVente?: number;
  contenance?: string;
  stock?: number;
  restaurantId?: string;
  createdAt?: string;
  updatedAt?: string;
  [key: string]: unknown;
}

export interface ApproBoissonResponse {
  id: string;
  boissonId: string;
  casierId: string;
  prixAchat: number;
  nbreCasier: number;
  createdAt?: string;
  updatedAt?: string;
  boisson?: BoissonResponse;
  [key: string]: unknown;
}

export interface ApproBoissonCreate {
  boissonId: string;
  casierId: string;
  prixAchat: number;
  nbreCasier: number;
}

export interface ApproBoissonUpdate {
  prixAchat?: number;
  nbreCasier?: number;
  casierId?: string;
  boissonId?: string;
}
