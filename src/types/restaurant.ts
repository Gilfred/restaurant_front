export interface RestaurantCreate {
  name: string;
  address: string;
  phone: string;
}

export interface RestaurantResponse {
  id: string;
  name: string;
  address: string;
  phone: string;
  ownerId: string;
  isActive: boolean;
  createdAt: string;
  updatedAt: string;
}

export interface Permission {
  id: string;
  name: string;
  description: string;
  createdAt: string;
  updatedAt: string;
}

export interface Role {
  id: string;
  name: string;
  description: string;
  createdAt: string;
  updatedAt: string;
  permissions: Permission[];
}

export interface StaffResponse {
  id: string;
  name: string;
  email: string;
  image?: string;
  isActive: boolean;
  createdAt: string;
  status: string;
  role?: Role | null;
}

export interface RestaurantActivationHistoryResponse {
  id: string;
  restaurantId: string;
  status: string;
  requestedAt: string;
  processedAt?: string;
}

export interface UserRolesUpdate {
  roleIds: string[];
}
