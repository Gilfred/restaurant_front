import { api } from "../api/axios";
import {
  listCommandes,
  createCommande,
  listWaiters,
  listMyCommandes,
  getCommande,
  updateCommande,
  deleteCommande,
  listApproBoissons,
  createApproBoisson,
  getApproBoisson,
  updateApproBoisson,
  deleteApproBoisson,
  listBoissons,
  createBoisson,
  getBoisson,
  updateBoisson,
  deleteBoisson,
  listRepas,
  createRepas,
  getRepas,
  updateRepas,
  deleteRepas,
  uploadMenuImage,
  listAvailableCategories,
  listCategoryNoms,
  createMenuCategorie,
  updateMenuCategorie,
  deleteMenuCategorie,
  createMenuRepas,
  updateMenuRepas,
  deleteMenuRepas,
  createMenuBoisson,
  updateMenuBoisson,
  deleteMenuBoisson
} from "../services";

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

  // Test Boissons & Repas Endpoints
  await listBoissons();
  assertEqual(lastCall.method, "GET", "listBoissons method");
  assertEqual(lastCall.url, "/boissons/", "listBoissons url");
  console.log("✓ GET /boissons/");

  await createBoisson({
    nomBoisson: "Soda Test",
    contenance: "0,55cl",
    prixVente: 500,
    stock: 20
  });
  assertEqual(lastCall.method, "POST", "createBoisson method");
  assertEqual(lastCall.url, "/boissons/", "createBoisson url");
  assertEqual(
    lastCall.data,
    {
      nomBoisson: "Soda Test",
      contenance: "0,55cl",
      prixVente: 500,
      stock: 20
    },
    "createBoisson data"
  );
  console.log("✓ POST /boissons/");

  await getBoisson("boisson-123");
  assertEqual(lastCall.method, "GET", "getBoisson method");
  assertEqual(lastCall.url, "/boissons/boisson-123", "getBoisson url");
  console.log("✓ GET /boissons/{boisson_id}");

  await updateBoisson("boisson-123", { nomBoisson: "Soda Updated", stock: 30 });
  assertEqual(lastCall.method, "PATCH", "updateBoisson method");
  assertEqual(lastCall.url, "/boissons/boisson-123", "updateBoisson url");
  assertEqual(
    lastCall.data,
    { nomBoisson: "Soda Updated", stock: 30 },
    "updateBoisson data"
  );
  console.log("✓ PATCH /boissons/{boisson_id}");

  await deleteBoisson("boisson-123");
  assertEqual(lastCall.method, "DELETE", "deleteBoisson method");
  assertEqual(lastCall.url, "/boissons/boisson-123", "deleteBoisson url");
  console.log("✓ DELETE /boissons/{boisson_id}");

  await listRepas();
  assertEqual(lastCall.method, "GET", "listRepas method");
  assertEqual(lastCall.url, "/repas/", "listRepas url");
  console.log("✓ GET /repas/");

  await createRepas({
    nomRepas: "Plat Test",
    prix: 2500
  });
  assertEqual(lastCall.method, "POST", "createRepas method");
  assertEqual(lastCall.url, "/repas/", "createRepas url");
  assertEqual(
    lastCall.data,
    {
      nomRepas: "Plat Test",
      prix: 2500
    },
    "createRepas data"
  );
  console.log("✓ POST /repas/");

  await getRepas("repas-123");
  assertEqual(lastCall.method, "GET", "getRepas method");
  assertEqual(lastCall.url, "/repas/repas-123", "getRepas url");
  console.log("✓ GET /repas/{repas_id}");

  await updateRepas("repas-123", { nomRepas: "Plat Modifié", prix: 3000 });
  assertEqual(lastCall.method, "PATCH", "updateRepas method");
  assertEqual(lastCall.url, "/repas/repas-123", "updateRepas url");
  assertEqual(
    lastCall.data,
    { nomRepas: "Plat Modifié", prix: 3000 },
    "updateRepas data"
  );
  console.log("✓ PATCH /repas/{repas_id}");

  await deleteRepas("repas-123");
  assertEqual(lastCall.method, "DELETE", "deleteRepas method");
  assertEqual(lastCall.url, "/repas/repas-123", "deleteRepas url");
  console.log("✓ DELETE /repas/{repas_id}");

  // Test Menu Upload and Categories Endpoints
  await listAvailableCategories();
  assertEqual(lastCall.method, "GET", "listAvailableCategories method");
  assertEqual(lastCall.url, "/menus/categories", "listAvailableCategories url");
  console.log("✓ GET /menus/categories");

  await listCategoryNoms();
  assertEqual(lastCall.method, "GET", "listCategoryNoms method");
  assertEqual(lastCall.url, "/menus/categories/noms", "listCategoryNoms url");
  console.log("✓ GET /menus/categories/noms");

  await createMenuCategorie({
    nom: "classique",
    ordre: 0,
    menuFamilleId: "3fa85f64-5717-4562-b3fc-2c963f66afa6"
  });
  assertEqual(lastCall.method, "POST", "createMenuCategorie method");
  assertEqual(lastCall.url, "/menus/categories", "createMenuCategorie url");
  assertEqual(
    lastCall.data,
    {
      nom: "classique",
      ordre: 0,
      menuFamilleId: "3fa85f64-5717-4562-b3fc-2c963f66afa6"
    },
    "createMenuCategorie data"
  );
  console.log("✓ POST /menus/categories");

  await updateMenuCategorie("cat-123", {
    nom: "classique",
    ordre: 0,
    menuFamilleId: "3fa85f64-5717-4562-b3fc-2c963f66afa6"
  });
  assertEqual(lastCall.method, "PATCH", "updateMenuCategorie method");
  assertEqual(lastCall.url, "/menus/categories/cat-123", "updateMenuCategorie url");
  assertEqual(
    lastCall.data,
    {
      nom: "classique",
      ordre: 0,
      menuFamilleId: "3fa85f64-5717-4562-b3fc-2c963f66afa6"
    },
    "updateMenuCategorie data"
  );
  console.log("✓ PATCH /menus/categories/{categorie_id}");

  await deleteMenuCategorie("cat-123");
  assertEqual(lastCall.method, "DELETE", "deleteMenuCategorie method");
  assertEqual(lastCall.url, "/menus/categories/cat-123", "deleteMenuCategorie url");
  console.log("✓ DELETE /menus/categories/{categorie_id}");

  const dummyFile = new File(["dummy content"], "poisson.png", { type: "image/png" });
  await uploadMenuImage(dummyFile, "famille-uuid-123", 3);
  assertEqual(lastCall.method, "POST", "uploadMenuImage method");
  assertEqual(lastCall.url, "/menus/upload", "uploadMenuImage url");
  console.log("✓ POST /menus/upload");

  // Test Menu Repas Endpoints
  await createMenuRepas({
    ordre: 0,
    menuCategorieId: "3fa85f64-5717-4562-b3fc-2c963f66afa6",
    repasId: "3fa85f64-5717-4562-b3fc-2c963f66afa6"
  });
  assertEqual(lastCall.method, "POST", "createMenuRepas method");
  assertEqual(lastCall.url, "/menus/repas", "createMenuRepas url");
  assertEqual(
    lastCall.data,
    {
      ordre: 0,
      menuCategorieId: "3fa85f64-5717-4562-b3fc-2c963f66afa6",
      repasId: "3fa85f64-5717-4562-b3fc-2c963f66afa6"
    },
    "createMenuRepas data"
  );
  console.log("✓ POST /menus/repas");

  await updateMenuRepas("mr-123", {
    ordre: 1,
    menuCategorieId: "3fa85f64-5717-4562-b3fc-2c963f66afa6",
    repasId: "3fa85f64-5717-4562-b3fc-2c963f66afa6"
  });
  assertEqual(lastCall.method, "PATCH", "updateMenuRepas method");
  assertEqual(lastCall.url, "/menus/repas/mr-123", "updateMenuRepas url");
  console.log("✓ PATCH /menus/repas/{menu_repas_id}");

  await deleteMenuRepas("mr-123");
  assertEqual(lastCall.method, "DELETE", "deleteMenuRepas method");
  assertEqual(lastCall.url, "/menus/repas/mr-123", "deleteMenuRepas url");
  console.log("✓ DELETE /menus/repas/{menu_repas_id}");

  // Test Menu Boissons Endpoints
  await createMenuBoisson({
    ordre: 0,
    imageUrl: "https://example.com/image.png",
    boissonId: "3fa85f64-5717-4562-b3fc-2c963f66afa6"
  });
  assertEqual(lastCall.method, "POST", "createMenuBoisson method");
  assertEqual(lastCall.url, "/menus/boissons", "createMenuBoisson url");
  assertEqual(
    lastCall.data,
    {
      ordre: 0,
      imageUrl: "https://example.com/image.png",
      boissonId: "3fa85f64-5717-4562-b3fc-2c963f66afa6"
    },
    "createMenuBoisson data"
  );
  console.log("✓ POST /menus/boissons");

  await updateMenuBoisson("mb-123", {
    ordre: 2,
    imageUrl: "https://example.com/updated.png"
  });
  assertEqual(lastCall.method, "PATCH", "updateMenuBoisson method");
  assertEqual(lastCall.url, "/menus/boissons/mb-123", "updateMenuBoisson url");
  console.log("✓ PATCH /menus/boissons/{menu_boisson_id}");

  await deleteMenuBoisson("mb-123");
  assertEqual(lastCall.method, "DELETE", "deleteMenuBoisson method");
  assertEqual(lastCall.url, "/menus/boissons/mb-123", "deleteMenuBoisson url");
  console.log("✓ DELETE /menus/boissons/{menu_boisson_id}");

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
        repasId: null,
        qte: 3,
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
          repasId: null,
          qte: 3,
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

  console.log("All 14 endpoint consumption tests passed successfully!");
}

runTests().catch((err) => {
  console.error("Test execution failed:", err);
  throw err;
});
