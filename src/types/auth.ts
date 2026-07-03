// types/auth.ts
export interface User {
  id: string; // UUID
  email: string;
  name: string;
  image?: string | null;
  isActive: boolean;
  createdAt: string; // ISO datetime
  // Si tu as des champs optionnels supplémentaires selon le contexte (staff...)
}

export interface LoginRequest {
  email: string;
  password: string;
}

export interface SignupRequest {
  email: string;
  name: string;
  password: string;
}

export interface TokenResponse {
  access_token: string;
  token_type: string;
}

export interface ApiError {
  detail: string;
}