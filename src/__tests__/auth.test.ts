import axios from "axios";
import { api, isPublicEndpoint, executeRefreshToken } from "../api/axios";
import { login, logout, getCurrentUser } from "../services/auth.service";

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
  console.log("Starting Complete Auth, Session Renewal & Lifecycle tests...\n");

  const originalPost = api.post;
  const originalGet = api.get;
  const originalAxiosPost = axios.post;

  // SCENARIO 1: Connexion email -> access token enregistré dans localStorage (refresh token non stocké dans localStorage)
  {
    localStorage.clear();
    const nowSeconds = Math.floor(Date.now() / 1000);
    const validJwt = createFakeJwt({ sub: "user1", exp: nowSeconds + 600 }); // 10 min JWT

    api.post = (url: string, _data?: any) => {
      if (url === "/auth/login") {
        return Promise.resolve({
          data: {
            access_token: validJwt,
            token_type: "bearer",
            refresh_token: "secret_refresh_token_cookie",
          },
        }) as any;
      }
      return Promise.resolve({ data: {} }) as any;
    };

    await login({ email: "yaovi@gmail.com", password: "password123" });
    const storedToken = localStorage.getItem("access_token");
    assertEqual(storedToken, validJwt, "Scenario 1: access_token stored in localStorage");
    assertEqual(localStorage.getItem("refresh_token"), null, "Scenario 1: refresh_token NEVER stored in localStorage");
    console.log("✓ Scenario 1: Connexion email : access token enregistré dans localStorage et refresh token préservé hors localStorage");
  }

  // SCENARIO 2: Connexion Google -> session restaurée correctement
  {
    // Simule la réception du token depuis Google callback et récupération de /auth/me
    const nowSeconds = Math.floor(Date.now() / 1000);
    const googleJwt = createFakeJwt({ sub: "google_user", exp: nowSeconds + 600 });
    localStorage.setItem("access_token", googleJwt);

    api.get = (url: string) => {
      if (url === "/auth/me") {
        return Promise.resolve({
          data: { id: 2, name: "Google User", email: "google@example.com" },
        }) as any;
      }
      return Promise.resolve({ data: {} }) as any;
    };

    const meRes = await getCurrentUser();
    assertEqual(meRes.data.email, "google@example.com", "Scenario 2: user details retrieved");
    console.log("✓ Scenario 2: Connexion Google : session restaurée correctement");
  }

  // SCENARIO 3 & 4: JWT expiré -> refresh automatique réussi et requête initiale rejouée
  {
    const expiredJwt = createFakeJwt({ sub: "user1", exp: Math.floor(Date.now() / 1000) - 10 });
    const refreshedJwt = createFakeJwt({ sub: "user1", exp: Math.floor(Date.now() / 1000) + 600 });
    localStorage.setItem("access_token", expiredJwt);

    let refreshCalledCount = 0;
    (axios as any).post = (url: string) => {
      if (url.includes("/auth/refresh")) {
        refreshCalledCount++;
        return Promise.resolve({
          data: {
            access_token: refreshedJwt,
            token_type: "bearer",
          },
        });
      }
      return Promise.resolve({ data: {} });
    };

    // Obtenir le handler de réponse d'erreur 401
    const responseInterceptor = (api.interceptors.response as any).handlers[0].rejected;

    let replayedRequestConfig: any = null;
    // Dans axios, api(originalRequest) appelle api.request ou passe par l'adaptateur
    // On peut mocker l'adapter sur la config ou l'instance
    const originalAdapter = api.defaults.adapter;
    api.defaults.adapter = (config: any) => {
      replayedRequestConfig = config;
      return Promise.resolve({ data: { success: true }, status: 200, statusText: "OK", headers: {}, config });
    };

    const originalRequest = {
      url: "/commandes/",
      method: "GET",
      headers: { Authorization: `Bearer ${expiredJwt}` },
    };

    const error401 = {
      response: { status: 401 },
      config: originalRequest,
    };

    const result = await responseInterceptor(error401);
    assertEqual(refreshCalledCount, 1, "Scenario 3: executeRefreshToken called once");
    assertEqual(localStorage.getItem("access_token"), refreshedJwt, "Scenario 3: new access_token updated in localStorage");
    assertEqual(replayedRequestConfig.headers.Authorization, `Bearer ${refreshedJwt}`, "Scenario 4: original request replayed with new token");
    assertEqual(result.data.success, true, "Scenario 4: replayed request returned successful result");
    console.log("✓ Scenario 3: JWT expiré : refresh automatique réussi");
    console.log("✓ Scenario 4: Requête initiale : rejouée après refresh réussi");

    api.defaults.adapter = originalAdapter;
  }

  // SCENARIO 5: Plusieurs réponses 401 simultanées -> un seul refresh exécuté (promesse partagée)
  {
    const expiredJwt = createFakeJwt({ sub: "user1", exp: Math.floor(Date.now() / 1000) - 10 });
    const refreshedJwt2 = createFakeJwt({ sub: "user1", exp: Math.floor(Date.now() / 1000) + 600 });
    localStorage.setItem("access_token", expiredJwt);

    let refreshCallCount = 0;
    (axios as any).post = async (url: string) => {
      if (url.includes("/auth/refresh")) {
        refreshCallCount++;
        // Délai pour simuler la latence réseau
        await new Promise((r) => setTimeout(r, 20));
        return {
          data: {
            access_token: refreshedJwt2,
            token_type: "bearer",
          },
        };
      }
      return { data: {} };
    };

    const responseInterceptor = (api.interceptors.response as any).handlers[0].rejected;

    const originalAdapter = api.defaults.adapter;
    const replayedCalls: any[] = [];
    api.defaults.adapter = (config: any) => {
      replayedCalls.push(config);
      return Promise.resolve({ data: { url: config.url }, status: 200, statusText: "OK", headers: {}, config });
    };

    const req1 = responseInterceptor({
      response: { status: 401 },
      config: { url: "/commandes/", method: "GET", headers: {} },
    });
    const req2 = responseInterceptor({
      response: { status: 401 },
      config: { url: "/repas/", method: "GET", headers: {} },
    });
    const req3 = responseInterceptor({
      response: { status: 401 },
      config: { url: "/boissons/", method: "GET", headers: {} },
    });

    await Promise.all([req1, req2, req3]);

    assertEqual(refreshCallCount, 1, "Scenario 5: exactly one refresh call was executed for concurrent 401s");
    assertEqual(replayedCalls.length, 3, "Scenario 5: all 3 requests were replayed");
    for (const call of replayedCalls) {
      assertEqual(call.headers.Authorization, `Bearer ${refreshedJwt2}`, "Scenario 5: replayed with refreshed token");
    }
    console.log("✓ Scenario 5: Plusieurs réponses 401 simultanées : un seul refresh");

    api.defaults.adapter = originalAdapter;
  }

  // SCENARIO 6: Refresh refusé -> déconnexion propre (token supprimé de localStorage)
  {
    const expiredJwt = createFakeJwt({ sub: "user1", exp: Math.floor(Date.now() / 1000) - 10 });
    localStorage.setItem("access_token", expiredJwt);

    (axios as any).post = (url: string) => {
      if (url.includes("/auth/refresh")) {
        return Promise.reject({ response: { status: 401, data: { detail: "Session expired" } } });
      }
      return Promise.resolve({ data: {} });
    };

    const responseInterceptor = (api.interceptors.response as any).handlers[0].rejected;

    let rejected = false;
    try {
      await responseInterceptor({
        response: { status: 401 },
        config: { url: "/commandes/", method: "GET", headers: {} },
      });
    } catch (e) {
      rejected = true;
    }

    assertEqual(rejected, true, "Scenario 6: request rejected when refresh fails");
    assertEqual(localStorage.getItem("access_token"), null, "Scenario 6: access_token removed from localStorage");
    console.log("✓ Scenario 6: Refresh refusé : déconnexion propre et token nettoyé");
  }

  // SCENARIO 7: Session inactive de 30 minutes -> backend refuse le refresh, aucune reconnexion
  {
    localStorage.setItem("access_token", "inactive_jwt");

    (axios as any).post = (url: string) => {
      if (url.includes("/auth/refresh")) {
        return Promise.reject({ response: { status: 401, data: { detail: "Inactive session timeout (30m)" } } });
      }
      return Promise.resolve({ data: {} });
    };

    const token = await executeRefreshToken();
    assertEqual(token, null, "Scenario 7: executeRefreshToken returns null on 30m inactivity");
    assertEqual(localStorage.getItem("access_token"), null, "Scenario 7: token not restored");
    console.log("✓ Scenario 7: Session inactive de 30 minutes : aucune reconnexion automatique");
  }

  // SCENARIO 8: Session arrivée à 7 jours -> backend refuse le refresh, aucune prolongation
  {
    localStorage.setItem("access_token", "7days_jwt");

    (axios as any).post = (url: string) => {
      if (url.includes("/auth/refresh")) {
        return Promise.reject({ response: { status: 401, data: { detail: "Max session duration reached (7 days)" } } });
      }
      return Promise.resolve({ data: {} });
    };

    const token = await executeRefreshToken();
    assertEqual(token, null, "Scenario 8: executeRefreshToken returns null after 7 days");
    assertEqual(localStorage.getItem("access_token"), null, "Scenario 8: token cleared");
    console.log("✓ Scenario 8: Session arrivée à 7 jours : aucune prolongation");
  }

  // SCENARIO 9: Réponse 403 -> aucun refresh déclenché
  {
    let refreshAttempted = false;
    (axios as any).post = (url: string) => {
      if (url.includes("/auth/refresh")) {
        refreshAttempted = true;
      }
      return Promise.resolve({ data: {} });
    };

    const responseInterceptor = (api.interceptors.response as any).handlers[0].rejected;

    let rejected = false;
    try {
      await responseInterceptor({
        response: { status: 403 },
        config: { url: "/restaurants/staff", method: "GET", headers: {} },
      });
    } catch {
      rejected = true;
    }

    assertEqual(rejected, true, "Scenario 9: 403 rejected immediately");
    assertEqual(refreshAttempted, false, "Scenario 9: no refresh attempted on 403");
    assertEqual(isPublicEndpoint("/restaurants/staff", "GET"), false, "Protected endpoint confirmed");
    assertEqual(isPublicEndpoint("/menus/display", "GET"), true, "Public endpoint confirmed");
    console.log("✓ Scenario 9: Réponse 403 : aucun refresh");
  }

  // SCENARIO 10: Requête /auth/refresh elle-même en 401 -> aucune boucle de renouvellement
  {
    let refreshAttemptedCount = 0;
    (axios as any).post = (url: string) => {
      if (url.includes("/auth/refresh")) {
        refreshAttemptedCount++;
        return Promise.reject({ response: { status: 401 } });
      }
      return Promise.resolve({ data: {} });
    };

    const responseInterceptor = (api.interceptors.response as any).handlers[0].rejected;

    let rejected = false;
    try {
      await responseInterceptor({
        response: { status: 401 },
        config: { url: "/auth/refresh", method: "POST", headers: {} },
      });
    } catch {
      rejected = true;
    }

    assertEqual(rejected, true, "Scenario 10: 401 on /auth/refresh rejected without retry");
    assertEqual(refreshAttemptedCount, 0, "Scenario 10: interceptor does not attempt recursive refresh on /auth/refresh");
    console.log("✓ Scenario 10: Requête /auth/refresh : aucune boucle de renouvellement");
  }

  // SCENARIO 11: Rechargement de la page -> session restaurée si encore valide
  {
    const nowSeconds = Math.floor(Date.now() / 1000);
    const validToken = createFakeJwt({ sub: "page_reload_user", exp: nowSeconds + 400 });
    localStorage.setItem("access_token", validToken);

    api.get = (url: string) => {
      if (url === "/auth/me") {
        return Promise.resolve({
          data: { id: 10, name: "Reload User", email: "reload@example.com" },
        }) as any;
      }
      return Promise.resolve({ data: {} }) as any;
    };

    const userRes = await getCurrentUser();
    assertEqual(userRes.data.name, "Reload User", "Scenario 11: user fetched after page reload");
    assertEqual(localStorage.getItem("access_token"), validToken, "Scenario 11: token still present in localStorage");
    console.log("✓ Scenario 11: Rechargement de la page : session restaurée si elle est encore valide");
  }

  // SCENARIO 12: Déconnexion -> suppression de l'access token et appel backend
  {
    localStorage.setItem("access_token", "token_to_clear");
    let backendLogoutCalled = false;
    api.post = (url: string) => {
      if (url === "/auth/logout") {
        backendLogoutCalled = true;
        return Promise.resolve({ data: { message: "logged out" } }) as any;
      }
      return Promise.resolve({ data: {} }) as any;
    };

    await logout();
    assertEqual(backendLogoutCalled, true, "Scenario 12: backend logout called");
    assertEqual(localStorage.getItem("access_token"), null, "Scenario 12: access token removed from localStorage");
    console.log("✓ Scenario 12: Déconnexion : suppression de l'access token et cookies révoqués côté backend");
  }

  // Restore originals
  api.post = originalPost;
  api.get = originalGet;
  axios.post = originalAxiosPost;

  console.log("\nAll 12 authentication & session lifecycle scenarios passed successfully!");
}

runAuthTests().catch((err) => {
  console.error("Auth test execution failed:", err);
  throw err;
});
