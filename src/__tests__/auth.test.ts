import { api } from "../api/axios";
import { login, logout } from "../services/auth.service";

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
  console.log("Starting Auth & Bearer Token tests...");

  // Mock post and get
  const originalPost = api.post;
  const originalGet = api.get;

  api.post = (url: string, _data?: any) => {
    if (url === "/auth/login") {
      return Promise.resolve({
        data: { access_token: "test_jwt_token_123", token_type: "bearer" },
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
  assertEqual(localStorage.getItem("access_token"), "test_jwt_token_123", "Token saved after login");
  console.log("✓ login() stores access_token in localStorage");

  // 2. Test Interceptor attaches token to request config
  const mockConfig: any = { headers: {} };
  const interceptorHandler = (api.interceptors.request as any).handlers[0].fulfilled;
  const updatedConfig = interceptorHandler(mockConfig);
  assertEqual(
    updatedConfig.headers.Authorization,
    "Bearer test_jwt_token_123",
    "Authorization Bearer header set"
  );
  console.log("✓ Axios request interceptor attaches Authorization: Bearer <access_token>");

  // 3. Test Logout removes token
  await logout();
  assertEqual(localStorage.getItem("access_token"), null, "Token removed after logout");
  console.log("✓ logout() removes access_token from localStorage");

  // Restore
  api.post = originalPost;
  api.get = originalGet;

  console.log("All Auth tests passed successfully!");
}

runAuthTests().catch((err) => {
  console.error("Auth test execution failed:", err);
  throw err;
});
