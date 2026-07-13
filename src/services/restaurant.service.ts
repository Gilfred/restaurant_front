import { api } from "../api/axios";
import type {
  RestaurantCreate,
  RestaurantResponse,
  StaffResponse,
  RestaurantActivationHistoryResponse,
  UserRolesUpdate,
} from "../types/restaurant";

export const createRestaurant = (data: RestaurantCreate) => {
  return api.post<RestaurantResponse>("/restaurants", data);
};

export const listRestaurants = () => {
  return api.get<RestaurantResponse[]>("/restaurants");
};

export const listInactiveRestaurants = () => {
  return api.get<RestaurantResponse[]>("/restaurants/inactive");
};

export const activateRestaurant = (restaurantId: string) => {
  return api.post<RestaurantResponse>(`/restaurants/${restaurantId}/activate`);
};

export const getActivationHistory = () => {
  return api.get<RestaurantActivationHistoryResponse[]>("/restaurants/activation-history");
};

export const getRestaurantStaff = () => {
  return api.get<StaffResponse[]>("/restaurants/staff");
};

export const updateEmployeeRoles = (employeeId: string, data: UserRolesUpdate) => {
  return api.put<StaffResponse>(`/restaurants/staff/${employeeId}/roles`, data);
};
