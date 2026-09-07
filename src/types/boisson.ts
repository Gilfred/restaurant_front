export interface ApproBoissonResponse {
  id: string;
  boissonId?: string;
  uniteId?: string;
  prix?: number;
  qte?: number;
  restaurantId?: string;
  createdAt?: string;
  updatedAt?: string;
  [key: string]: unknown;
}

export interface ApproBoissonCreate {
  boissonId?: string;
  uniteId?: string;
  prix?: number;
  qte?: number;
  [key: string]: unknown;
}

export interface ApproBoissonUpdate {
  boissonId?: string;
  uniteId?: string;
  prix?: number;
  qte?: number;
  [key: string]: unknown;
}
