import { api, isPublicEndpoint } from "../api/axios";
import { login, logout } from "../services/auth.service";
import { isTokenExpired, getTokenTimeRemaining } from "../utils/jwt";

// Helper to create a fake JWT with given payload
function createFakeJwt(payload: Record<string, any>): string {
  const header = { alg: "HS256", typ: "JWT" };
  const encode = (obj: Record<string, any>) =>
    btoa(JSON.stringify(obj))
      .replace(/=/g, "")
      .replace(/\+/g, "-")
      .replace(/\//g, "_");
  return `${encode(header)}.${encode(payload)}.signature`;
}

// Simple mock for localStorage if running in Node environment without DOM
if (typeof globalThis.localStorage === "undefined") {
  const store = new Map<string, string>();
  (globalThis as any).localStorage = {
    getItem: (key: string) => store.get(key) ?? null,
    setItem: (key: string, value: string) => store.set(key, value),
    removeItem: (key: string) => store.delete(key),
    clear: () => store.clear(),
  };
}

function assertEqual(actual: unknown, expected: unknown, message: string) {
  const actualStr = JSON.stringify(actual);
  const expectedStr = JSON.stringify(expected);
  if (actualStr !== expectedStr) {
    throw new Error(`Assertion Failed: ${message}. Expected ${expectedStr}, got ${actualStr}`);
  }
}

async function runAuthTests() {
  console.log("Starting Auth, Bearer Token & Expiration tests...");

  // Mock post and get
  const originalPost = api.post;
  const originalGet = api.get;

  api.post = (url: string, _data?: any) => {
    if (url === "/auth/login") {
      const nowSeconds = Math.floor(Date.now() / 1000);
      const validJwt = createFakeJwt({ sub: "user1", exp: nowSeconds + 3600 });
      return Promise.resolve({
        data: { access_token: validJwt, token_type: "bearer" },
      }) as any;
    }
    if (url === "/auth/logout") {
      return Promise.resolve({ data: { message: "logged out" } }) as any;
    }
    return Promise.resolve({ data: {} }) as any;
  };

  api.get = (url: string) => {
    if (url === "/auth/me") {
      return Promise.resolve({
        data: { id: 1, name: "Test User", email: "test@example.com" },
      }) as any;
    }
    return Promise.resolve({ data: {} }) as any;
  };

  // 1. Test Login saves token
  localStorage.clear();
  assertEqual(localStorage.getItem("access_token"), null, "Token initially null");

  await login({ email: "test@example.com", password: "password123" });
  const savedToken = localStorage.getItem("access_token")!;
  assertEqual(isTokenExpired(savedToken), false, "Saved token is not expired");
  console.log("✓ login() stores valid access_token in localStorage");

  // 2. Test Interceptor attaches token to request config
  const mockConfig: any = { headers: {} };
  const interceptorHandler = (api.interceptors.request as any).handlers[0].fulfilled;
  const updatedConfig = interceptorHandler(mockConfig);
  assertEqual(
    updatedConfig.headers.Authorization,
    `Bearer ${savedToken}`,
    "Authorization Bearer header set"
  );
  console.log("✓ Axios request interceptor attaches Authorization: Bearer <access_token>");

  // 3. Test JWT Expiration utility functions
  const now = Math.floor(Date.now() / 1000);
  const expiredJwt = createFakeJwt({ sub: "expiredUser", exp: now - 300 });
  const futureJwt = createFakeJwt({ sub: "validUser", exp: now + 600 });

  assertEqual(isTokenExpired(expiredJwt), true, "Expired token detected");
  assertEqual(isTokenExpired(futureJwt), false, "Future token not expired");
  assertEqual(getTokenTimeRemaining(expiredJwt), 0, "Expired token remaining time is 0");
  if (getTokenTimeRemaining(futureJwt) <= 0) {
    throw new Error("Future token should have positive remaining time");
  }
  console.log("✓ JWT expiration utilities decode and calculate exp accurately");

  // 4. Test expired token behavior in request interceptor
  localStorage.setItem("access_token", expiredJwt);
  const expiredConfig: any = { headers: {}, url: "/restaurants/staff", method: "GET" };
  interceptorHandler(expiredConfig);
  assertEqual(localStorage.getItem("access_token"), null, "Expired token removed by interceptor");
  assertEqual(expiredConfig.headers.Authorization, undefined, "Expired token not attached to request");
  console.log("✓ Interceptor rejects expired tokens prior to HTTP call");

  // 5. Test public endpoint matching distinction (401 / 403 route protection)
  assertEqual(isPublicEndpoint("/menus/display"), true, "/menus/display is public");
  assertEqual(isPublicEndpoint("/restaurants", "GET"), true, "GET /restaurants is public");
  assertEqual(isPublicEndpoint("/restaurants/staff", "GET"), false, "/restaurants/staff is protected");
  assertEqual(isPublicEndpoint("/restaurants/inactive", "GET"), false, "/restaurants/inactive is protected");
  console.log("✓ Public endpoint matching precisely isolates protected endpoints like /restaurants/staff");

  // 6. Test Logout removes token
  localStorage.setItem("access_token", savedToken);
  await logout();
  assertEqual(localStorage.getItem("access_token"), null, "Token removed after logout");
  console.log("✓ logout() removes access_token from localStorage");

  // Restore
  api.post = originalPost;
  api.get = originalGet;

  console.log("All Auth & Expiration tests passed successfully!");
}

runAuthTests().catch((err) => {
  console.error("Auth test execution failed:", err);
  throw err;
});
