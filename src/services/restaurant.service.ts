import { api } from "../api/axios";
import type {
  RestaurantCreate,
  RestaurantResponse,
  StaffResponse,
  RestaurantActivationHistoryResponse,
  UserRolesUpdate,
  RestaurantUserJoinResponse,
  ApproveRequestPayload,
  MeRestaurantResponse,
  Role,
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

export const joinRestaurant = (restaurantId: string) => {
  return api.post<RestaurantUserJoinResponse>(`/restaurant-users/${restaurantId}/join`);
};

export const approveJoinRequest = (userId: string, data: ApproveRequestPayload) => {
  return api.post<RestaurantUserJoinResponse>(`/restaurant-users/join-requests/${userId}/approve`, data);
};

export const rejectJoinRequest = (userId: string) => {
  return api.post<RestaurantUserJoinResponse>(`/restaurant-users/join-requests/${userId}/reject`);
};

export const getMeRestaurant = () => {
  return api.get<MeRestaurantResponse>("/restaurant-users/me/restaurant");
};

export const leaveRestaurant = () => {
  return api.post<string>("/restaurant-users/me/restaurant/leave");
};

export const getEmployees = () => {
  return api.get<StaffResponse[]>("/restaurant-users/employees");
};

export const updateEmployeeRole = (userId: string, data: { roleId: string }) => {
  return api.patch<RestaurantUserJoinResponse>(`/restaurant-users/employees/${userId}/role`, data);
};

export const listRoles = () => {
  return api.get<Role[]>("/roles/");
};
