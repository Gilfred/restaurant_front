export interface CommandeItem {
  id?: string;
  platId?: string;
  boissonId?: string;
  nom?: string;
  quantite: number;
  prix?: number;
}

export interface CommandeCreate {
  tableId?: string;
  serveuseId?: string;
  items?: CommandeItem[];
  total?: number;
  statut?: string;
  notes?: string;
  [key: string]: unknown;
}

export interface CommandeUpdate {
  tableId?: string;
  serveuseId?: string;
  items?: CommandeItem[];
  total?: number;
  statut?: string;
  notes?: string;
  [key: string]: unknown;
}

export interface CommandeResponse {
  id: string;
  restaurantId?: string;
  tableId?: string;
  serveuseId?: string;
  items?: CommandeItem[];
  total?: number;
  statut?: string;
  notes?: string;
  createdAt?: string;
  updatedAt?: string;
  [key: string]: unknown;
}

export interface WaiterResponse {
  id: string;
  name?: string;
  email?: string;
  role?: string;
  [key: string]: unknown;
}
