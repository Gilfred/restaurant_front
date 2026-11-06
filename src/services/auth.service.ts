import { api } from "../api/axios";
import type {
  LoginRequest,
  LoginResponse,
  RefreshTokenResponse,
  RegisterRequest,
  ForgotPasswordRequest,
  ResetPasswordRequest,
} from "../types/auth";

export const login = async (data: LoginRequest) => {
  const response = await api.post<LoginResponse>("/auth/login", data);
  if (response.data?.access_token) {
    localStorage.setItem("access_token", response.data.access_token);
  }
  return response;
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

/**
 * Renouvelle l'access_token en utilisant le cookie HttpOnly 'refresh_token'.
 * Le refresh_token n'est jamais stocké dans le localStorage.
 */
export const refreshToken = async () => {
  const response = await api.post<RefreshTokenResponse>("/auth/refresh");
  if (response.data?.access_token) {
    localStorage.setItem("access_token", response.data.access_token);
  }
  return response;
};

export const logout = async () => {
  try {
    return await api.post("/auth/logout");
  } finally {
    localStorage.removeItem("access_token");
  }
};

export const getCurrentUser = () => {
  return api.get("/auth/me");
};
