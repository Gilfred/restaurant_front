export interface CasierResponse {
  id: string;
  typeCasier: string;
  restaurantId?: string;
  isActive?: boolean;
  createdAt?: string;
  updatedAt?: string;
  [key: string]: unknown;
}
