export interface LoginRequest {
  email: string;
  password: string;
}

export interface LoginResponse {
  access_token: string;
  token_type: string;
  refresh_token?: string;
}

export interface RefreshTokenResponse {
  access_token: string;
  token_type: string;
  refresh_token?: string;
}

export interface RegisterRequest {
  name: string;
  email: string;
  password: string;
}

export interface ForgotPasswordRequest {
  email: string;
}

export interface ResetPasswordRequest {
  token: string;
  password?: string;
  new_password?: string;
}
