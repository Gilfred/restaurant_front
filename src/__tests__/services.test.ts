import { api } from "../api/axios";
import {
  listCommandes,
  createCommande,
  listWaiters,
  listMyCommandes,
  getCommande,
  updateCommande,
  deleteCommande,
} from "../services/commande.service";
import {
  listApproBoissons,
  createApproBoisson,
  getApproBoisson,
  updateApproBoisson,
  deleteApproBoisson,
} from "../services/approBoisson.service";

function assertEqual(actual: unknown, expected: unknown, message: string) {
  const actualStr = JSON.stringify(actual);
  const expectedStr = JSON.stringify(expected);
  if (actualStr !== expectedStr) {
    throw new Error(`Assertion Failed: ${message}. Expected ${expectedStr}, got ${actualStr}`);
  }
}

async function runTests() {
  console.log("Starting endpoint consumption tests...");
  let lastCall = { method: "", url: "", data: null as unknown };

  // Mock api methods
  api.get = (url: string) => {
    lastCall = { method: "GET", url, data: null };
    return Promise.resolve({ data: [] }) as any;
  };
  api.post = (url: string, data?: any) => {
    lastCall = { method: "POST", url, data };
    return Promise.resolve({ data: {} }) as any;
  };
  api.patch = (url: string, data?: any) => {
    lastCall = { method: "PATCH", url, data };
    return Promise.resolve({ data: {} }) as any;
  };
  api.delete = (url: string) => {
    lastCall = { method: "DELETE", url, data: null };
    return Promise.resolve({ data: {} }) as any;
  };

  // Test Commandes Endpoints
  await listCommandes();
  assertEqual(lastCall.method, "GET", "listCommandes method");
  assertEqual(lastCall.url, "/commandes/", "listCommandes url");
  console.log("✓ GET /commandes/");

  await createCommande({
    userId: "3fa85f64-5717-4562-b3fc-2c963f66afa6",
    articles: [
      {
        boissonId: "3fa85f64-5717-4562-b3fc-2c963f66afa6",
        repasId: "3fa85f64-5717-4562-b3fc-2c963f66afa6",
        qte: 1,
      },
    ],
  });
  assertEqual(lastCall.method, "POST", "createCommande method");
  assertEqual(lastCall.url, "/commandes/", "createCommande url");
  assertEqual(
    lastCall.data,
    {
      userId: "3fa85f64-5717-4562-b3fc-2c963f66afa6",
      articles: [
        {
          boissonId: "3fa85f64-5717-4562-b3fc-2c963f66afa6",
          repasId: "3fa85f64-5717-4562-b3fc-2c963f66afa6",
          qte: 1,
        },
      ],
    },
    "createCommande data"
  );
  console.log("✓ POST /commandes/");

  await listWaiters();
  assertEqual(lastCall.method, "GET", "listWaiters method");
  assertEqual(lastCall.url, "/commandes/serveuses", "listWaiters url");
  console.log("✓ GET /commandes/serveuses");

  await listMyCommandes();
  assertEqual(lastCall.method, "GET", "listMyCommandes method");
  assertEqual(lastCall.url, "/commandes/me", "listMyCommandes url");
  console.log("✓ GET /commandes/me");

  await getCommande("cmd-100");
  assertEqual(lastCall.method, "GET", "getCommande method");
  assertEqual(lastCall.url, "/commandes/cmd-100", "getCommande url");
  console.log("✓ GET /commandes/{commande_id}");

  await updateCommande("cmd-100", { statut: "pending", total: 1000 });
  assertEqual(lastCall.method, "PATCH", "updateCommande method");
  assertEqual(lastCall.url, "/commandes/cmd-100", "updateCommande url");
  assertEqual(lastCall.data, { statut: "pending", total: 1000 }, "updateCommande data");
  console.log("✓ PATCH /commandes/{commande_id}");

  await deleteCommande("cmd-100");
  assertEqual(lastCall.method, "DELETE", "deleteCommande method");
  assertEqual(lastCall.url, "/commandes/cmd-100", "deleteCommande url");
  console.log("✓ DELETE /commandes/{commande_id}");

  // Test Appro Boisson Endpoints
  await listApproBoissons();
  assertEqual(lastCall.method, "GET", "listApproBoissons method");
  assertEqual(lastCall.url, "/appro-boisson/", "listApproBoissons url");
  console.log("✓ GET /appro-boisson/");

  await createApproBoisson({
    boissonId: "3fa85f64-5717-4562-b3fc-2c963f66afa6",
    casierId: "3fa85f64-5717-4562-b3fc-2c963f66afa6",
    prixAchat: 1,
    nbreCasier: 1,
  });
  assertEqual(lastCall.method, "POST", "createApproBoisson method");
  assertEqual(lastCall.url, "/appro-boisson/", "createApproBoisson url");
  assertEqual(
    lastCall.data,
    {
      boissonId: "3fa85f64-5717-4562-b3fc-2c963f66afa6",
      casierId: "3fa85f64-5717-4562-b3fc-2c963f66afa6",
      prixAchat: 1,
      nbreCasier: 1,
    },
    "createApproBoisson data"
  );
  console.log("✓ POST /appro-boisson/");

  await getApproBoisson("appro-200");
  assertEqual(lastCall.method, "GET", "getApproBoisson method");
  assertEqual(lastCall.url, "/appro-boisson/appro-200", "getApproBoisson url");
  console.log("✓ GET /appro-boisson/{appro_id}");

  await updateApproBoisson("appro-200", { prixAchat: 10, nbreCasier: 2 });
  assertEqual(lastCall.method, "PATCH", "updateApproBoisson method");
  assertEqual(lastCall.url, "/appro-boisson/appro-200", "updateApproBoisson url");
  assertEqual(lastCall.data, { prixAchat: 10, nbreCasier: 2 }, "updateApproBoisson data");
  console.log("✓ PATCH /appro-boisson/{appro_id}");

  await deleteApproBoisson("appro-200");
  assertEqual(lastCall.method, "DELETE", "deleteApproBoisson method");
  assertEqual(lastCall.url, "/appro-boisson/appro-200", "deleteApproBoisson url");
  console.log("✓ DELETE /appro-boisson/{appro_id}");

  console.log("All 12 endpoint consumption tests passed successfully!");
}

runTests().catch((err) => {
  console.error("Test execution failed:", err);
});
