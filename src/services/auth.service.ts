import { api } from "../api/axios";
import type {
  LoginRequest,
  LoginResponse,
  RegisterRequest,
  ForgotPasswordRequest,
  ResetPasswordRequest,
} from "../types/auth";

export const login = (data: LoginRequest) => {
  return api.post<LoginResponse>("/auth/login", data);
};

export const register = (data: RegisterRequest) => {
  return api.post("/auth/signup", data);
};

export const forgotPassword = (data: ForgotPasswordRequest) => {
  return api.post("/auth/forgot-password", data);
};

export const resetPassword = (data: ResetPasswordRequest) => {
  return api.post("/auth/reset-password", data);
};

export const logout = () => {
  return api.post("/auth/logout");
};

export const getCurrentUser = () => {
  return api.get("/auth/me");
};
