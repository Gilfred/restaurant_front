export interface RestaurantCreate {
  name: string;
  cuisine: string;
  description: string;
  address: string;
  rating?: number;
  image?: string;
}

export interface RestaurantResponse {
  id: string;
  name: string;
  cuisine: string;
  description: string;
  address: string;
  rating: number;
  image?: string;
  ownerId: string;
  isActive: boolean;
  createdAt: string;
}

export interface Role {
  id: string;
  name: string;
}

export interface StaffResponse {
  id: string;
  name: string;
  email: string;
  picture?: string;
  role?: Role | null;
  status: string;
}

export interface RestaurantActivationHistoryResponse {
  id: string;
  restaurantId: string;
  restaurantName: string;
  activatedAt: string;
  activatedBy: string;
}

export interface UserRolesUpdate {
  roleIds: string[];
}
