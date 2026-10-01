export interface JwtPayload {
  exp?: number;
  iat?: number;
  sub?: string;
  [key: string]: any;
}

/**
 * Decodes the payload of a JWT token safely without external dependencies.
 * Returns null if token is malformed or invalid JSON.
 */
export const decodeJwt = (token: string): JwtPayload | null => {
  try {
    const parts = token.split(".");
    if (parts.length !== 3) {
      return null;
    }
    const base64Url = parts[1];
    const base64 = base64Url.replace(/-/g, "+").replace(/_/g, "/");
    const jsonPayload = decodeURIComponent(
      atob(base64)
        .split("")
        .map((c) => "%" + ("00" + c.charCodeAt(0).toString(16)).slice(-2))
        .join("")
    );
    return JSON.parse(jsonPayload);
  } catch (error) {
    return null;
  }
};

/**
 * Calculates remaining time before token expiration in milliseconds.
 * Returns 0 if expired or invalid.
 */
export const getTokenTimeRemaining = (token: string): number => {
  const payload = decodeJwt(token);
  if (!payload || typeof payload.exp !== "number") {
    return 0;
  }
  const currentTimeInSeconds = Math.floor(Date.now() / 1000);
  const timeRemainingSeconds = payload.exp - currentTimeInSeconds;
  return timeRemainingSeconds > 0 ? timeRemainingSeconds * 1000 : 0;
};

/**
 * Checks if the JWT token is expired (or missing exp claim).
 * Note: Frontend expiration check is solely for UI/timer handling; real validation is done by the backend.
 */
export const isTokenExpired = (token: string): boolean => {
  const payload = decodeJwt(token);
  if (!payload || typeof payload.exp !== "number") {
    return true;
  }
  const currentTimeInSeconds = Math.floor(Date.now() / 1000);
  return payload.exp <= currentTimeInSeconds;
};
