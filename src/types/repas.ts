export interface RepasResponse {
  id: string;
  nomRepas: string;
  prix?: number;
  restaurantId?: string;
  createdAt?: string;
  updatedAt?: string;
  [key: string]: unknown;
}

export interface RepasCreate {
  nomRepas: string;
  prix?: number;
}

export interface RepasUpdate {
  nomRepas?: string;
  prix?: number;
}
