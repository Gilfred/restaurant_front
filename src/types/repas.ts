export interface RepasResponse {
  id: string;
  nomRepas: string;
  prix?: number;
  restaurantId?: string;
  createdAt?: string;
  updatedAt?: string;
  [key: string]: unknown;
}
