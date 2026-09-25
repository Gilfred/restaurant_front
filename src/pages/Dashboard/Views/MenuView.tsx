import React, { useState, useEffect } from "react";
import { motion, AnimatePresence } from "framer-motion";
import {
  Plus,
  Trash2,
  Edit2,
  Upload,
  CheckCircle2,
  X,
  Loader2,
  FolderPlus,
  Utensils,
  Wine,
  Layers,
  Sparkles,
  Image as ImageIcon,
  Settings,
  Eye,
  Building2,
  MapPin,
  UtensilsCrossed,
  RefreshCw,
  Star
} from "lucide-react";
import {
  getPublicMenuDisplay,
  listFamilles,
  createFamille,
  updateFamille,
  deleteFamille,
  uploadMenuImage,
  updateFamilleImage,
  deleteFamilleImage,
  listAvailableCategories,
  listCategoryNoms,
  createMenuCategorie,
  updateMenuCategorie,
  deleteMenuCategorie,
  createMenuRepas,
  updateMenuRepas,
  deleteMenuRepas,
  listMenuBoissonFamilles,
  createMenuBoissonFamille,
  updateMenuBoissonFamille,
  deleteMenuBoissonFamille,
  uploadMenuBoissonFamilleImage,
  listMenuBoissonFamilleImages,
  deleteMenuBoissonImage,
  createMenuBoisson,
  updateMenuBoisson,
  deleteMenuBoisson
} from "../../../services/menu.service";
import { getMeRestaurant } from "../../../services/restaurant.service";
import { listRepas } from "../../../services/repas.service";
import { listBoissons } from "../../../services/boisson.service";
import type {
  MenuFamille,
  MenuFamilleCreate,
  MenuFamilleUpdate,
  MenuFamilleImage,
  MenuCategorie,
  MenuRepas,
  MenuBoissonFamille,
  MenuBoisson
} from "../../../types/menu";
import type { RepasResponse } from "../../../types/repas";
import type { BoissonResponse } from "../../../types/boisson";
import { parseRestaurantDisplayData } from "../../PublicMenu/PublicMenu";
import type { RestaurantDisplay } from "../../PublicMenu/PublicMenu.types";

export const MenuView: React.FC = () => {
  // Top-level mode: "gestion" | "apercu"
  const [topMode, setTopMode] = useState<"gestion" | "apercu">("gestion");

  // Sub-tab under "gestion": "familles" | "categories" | "repas" | "boissons"
  const [gestionTab, setGestionTab] = useState<"familles" | "categories" | "repas" | "boissons">("familles");

  // Filter category state
  const [selectedCategoryFilter, setSelectedCategoryFilter] = useState<string>("");

  // Data states
  const [familles, setFamilles] = useState<MenuFamille[]>([]);
  const [categories, setCategories] = useState<any[]>([]);
  const [categoryNoms, setCategoryNoms] = useState<string[]>([]);
  const [loadingCategoryNoms, setLoadingCategoryNoms] = useState<boolean>(false);
  const [allRestaurantRepas, setAllRestaurantRepas] = useState<RepasResponse[]>([]);
  const [allRestaurantBoissons, setAllRestaurantBoissons] = useState<BoissonResponse[]>([]);
  const [displayRestaurant, setDisplayRestaurant] = useState<RestaurantDisplay | null>(null);

  // Beverage Familles state
  const [boissonFamilles, setBoissonFamilles] = useState<MenuBoissonFamille[]>([]);

  // Menu items parsed from display
  const [menuRepasItems, setMenuRepasItems] = useState<MenuRepas[]>([]);
  const [menuBoissonItems, setMenuBoissonItems] = useState<MenuBoisson[]>([]);

  // Feedback states
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [success, setSuccess] = useState<string | null>(null);
  const [submitting, setSubmitting] = useState(false);

  const getErrorMessage = (err: any, fallback: string) => {
    const detail = err?.response?.data?.detail;
    if (typeof detail === "string") return detail;
    if (Array.isArray(detail) && detail.length > 0) {
      return detail.map((d: any) => d.msg || JSON.stringify(d)).join(" ; ");
    }
    if (err?.response?.data?.message) return err.response.data.message;
    return fallback;
  };

  // --- Modal States ---
  // 1. Famille Modal (Create / Edit)
  const [isFamilleModalOpen, setIsFamilleModalOpen] = useState(false);
  const [editingFamille, setEditingFamille] = useState<MenuFamille | null>(null);
  const [familleNom, setFamilleNom] = useState("");
  const [familleOrdre, setFamilleOrdre] = useState<number>(0);

  // 2. Upload Image Modal
  const [isUploadModalOpen, setIsUploadModalOpen] = useState(false);
  const [selectedFamilleForUpload, setSelectedFamilleForUpload] = useState<string>("");
  const [uploadFile, setUploadFile] = useState<File | null>(null);
  const [uploadOrdre, setUploadOrdre] = useState<number>(0);

  // 3. Edit Image Modal
  const [isEditImageModalOpen, setIsEditImageModalOpen] = useState(false);
  const [editingImage, setEditingImage] = useState<MenuFamilleImage | null>(null);
  const [editImageFile, setEditImageFile] = useState<File | null>(null);
  const [editImageOrdre, setEditImageOrdre] = useState<number>(0);

  // 3.5 Categorie Modal (Create / Edit)
  const [isCategorieModalOpen, setIsCategorieModalOpen] = useState(false);
  const [editingCategorie, setEditingCategorie] = useState<MenuCategorie | null>(null);
  const [categorieNom, setCategorieNom] = useState("");
  const [categorieOrdre, setCategorieOrdre] = useState<number>(0);
  const [categorieFamilleId, setCategorieFamilleId] = useState<string>("");

  // 4. Repas Modal (Create / Edit)
  const [isRepasModalOpen, setIsRepasModalOpen] = useState(false);
  const [editingMenuRepas, setEditingMenuRepas] = useState<MenuRepas | null>(null);
  const [selectedRepasId, setSelectedRepasId] = useState<string>("");
  const [selectedCategorieId, setSelectedCategorieId] = useState<string>("");
  const [repasOrdre, setRepasOrdre] = useState<number>(0);

  // 5. Boisson Famille Modal (Create / Edit)
  const [isBoissonFamilleModalOpen, setIsBoissonFamilleModalOpen] = useState(false);
  const [editingBoissonFamille, setEditingBoissonFamille] = useState<MenuBoissonFamille | null>(null);
  const [boissonFamilleNom, setBoissonFamilleNom] = useState("");

  // 6. Boisson Famille Image Upload Modal
  const [isBoissonImageUploadModalOpen, setIsBoissonImageUploadModalOpen] = useState(false);
  const [selectedBoissonFamilleForUpload, setSelectedBoissonFamilleForUpload] = useState<string>("");
  const [boissonImageFile, setBoissonImageFile] = useState<File | null>(null);

  // 7. Boisson Association Modal (Add / Move drink in family)
  const [isBoissonModalOpen, setIsBoissonModalOpen] = useState(false);
  const [editingMenuBoisson, setEditingMenuBoisson] = useState<MenuBoisson | null>(null);
  const [selectedBoissonFamilleId, setSelectedBoissonFamilleId] = useState<string>("");
  const [selectedBoissonId, setSelectedBoissonId] = useState<string>("");
  const [boissonImageUrl, setBoissonImageUrl] = useState<string>("");
  const [boissonOrdre, setBoissonOrdre] = useState<number>(0);

  // Fetch all menu and entity data
  const fetchData = async () => {
    try {
      setLoading(true);
      setError(null);

      const [meRes, famillesRes, categoriesRes, categoryNomsRes, repasRes, boissonsRes, displayRes, boissonFamillesRes] = await Promise.allSettled([
        getMeRestaurant(),
        listFamilles(),
        listAvailableCategories(),
        listCategoryNoms(),
        listRepas(),
        listBoissons(),
        getPublicMenuDisplay(),
        listMenuBoissonFamilles()
      ]);

      let userRestoId: string | null = null;
      let userRestoName: string | null = null;

      if (meRes.status === "fulfilled" && meRes.value.data?.restaurant) {
        userRestoId = meRes.value.data.restaurant.id;
        userRestoName = meRes.value.data.restaurant.name;
      }

      let fetchedFamilles: MenuFamille[] = [];
      if (famillesRes.status === "fulfilled") {
        fetchedFamilles = famillesRes.value.data || [];
      }

      let fetchedBoissonFamilles: MenuBoissonFamille[] = [];
      if (boissonFamillesRes.status === "fulfilled") {
        const rawBoissonFamilles = boissonFamillesRes.value.data || [];
        fetchedBoissonFamilles = await Promise.all(
          rawBoissonFamilles.map(async (fam) => {
            let famImages = fam.images || (fam as any).familleImages || (fam as any).images_urls || (fam as any).boissonImages || [];
            try {
              const imgRes = await listMenuBoissonFamilleImages(fam.id);
              if (imgRes.data && Array.isArray(imgRes.data) && imgRes.data.length > 0) {
                famImages = imgRes.data;
              }
            } catch (imgErr) {
              console.warn("Could not fetch images for boisson famille:", fam.id, imgErr);
            }
            return { ...fam, images: famImages };
          })
        );
      }
      if (categoriesRes.status === "fulfilled") {
        const raw = categoriesRes.value.data;
        if (Array.isArray(raw)) {
          setCategories(raw);
        } else if (raw && typeof raw === "object" && Array.isArray((raw as any).categories)) {
          setCategories((raw as any).categories);
        } else if (raw && typeof raw === "object" && Array.isArray((raw as any).data)) {
          setCategories((raw as any).data);
        } else {
          setCategories([]);
        }
      }
      if (categoryNomsRes.status === "fulfilled") {
        const rawNoms = categoryNomsRes.value.data;
        if (Array.isArray(rawNoms)) {
          setCategoryNoms(rawNoms);
        } else if (rawNoms && typeof rawNoms === "object" && Array.isArray((rawNoms as any).data)) {
          setCategoryNoms((rawNoms as any).data);
        } else {
          setCategoryNoms([]);
        }
      }

      if (repasRes.status === "fulfilled") {
        const rawRepas = repasRes.value.data || [];
        if (userRestoId) {
          setAllRestaurantRepas(rawRepas.filter((r) => !r.restaurantId || String(r.restaurantId) === String(userRestoId)));
        } else {
          setAllRestaurantRepas(rawRepas);
        }
      }

      if (boissonsRes.status === "fulfilled") {
        const rawBoissons = boissonsRes.value.data || [];
        if (userRestoId) {
          setAllRestaurantBoissons(rawBoissons.filter((b) => !b.restaurantId || String(b.restaurantId) === String(userRestoId)));
        } else {
          setAllRestaurantBoissons(rawBoissons);
        }
      }

      if (displayRes.status === "fulfilled" && displayRes.value.data?.restaurants?.length) {
        const allDisplayRestos = displayRes.value.data.restaurants;
        let restoItem: any = null;

        if (userRestoId) {
          restoItem = allDisplayRestos.find((item: any) => {
            const rId = item.restaurant?.id || item.id;
            return String(rId) === String(userRestoId);
          });

          if (!restoItem && userRestoName) {
            restoItem = allDisplayRestos.find((item: any) => {
              const rName = item.restaurant?.name || item.name || item.restaurant?.nom || item.nom;
              return rName && String(rName).toLowerCase() === String(userRestoName).toLowerCase();
            });
          }
        }

        // Fallback to first restaurant only if user is not affiliated with a specific restaurant
        if (!restoItem && !userRestoId) {
          restoItem = allDisplayRestos[0];
        }

        if (restoItem) {
          const parsedRestaurant = parseRestaurantDisplayData(restoItem);
          setDisplayRestaurant(parsedRestaurant);

          // Enrich fetchedFamilles with images from display data if missing
          if (fetchedFamilles.length > 0 && restoItem.familles && Array.isArray(restoItem.familles)) {
            fetchedFamilles = fetchedFamilles.map((fam: any) => {
              const existingImgs = fam.images || fam.familleImages || fam.famille_images || [];
              if (!existingImgs || existingImgs.length === 0) {
                const matchInDisplay = restoItem.familles.find((df: any) =>
                  String(df.id) === String(fam.id) ||
                  (df.nom && fam.nom && String(df.nom).toLowerCase().trim() === String(fam.nom).toLowerCase().trim())
                );
                if (matchInDisplay && matchInDisplay.images && matchInDisplay.images.length > 0) {
                  return { ...fam, images: matchInDisplay.images };
                }
              }
              return fam;
            });
          }

          // Parse extracted meals for flat management table
          const parsedRepas: MenuRepas[] = [];
          if (restoItem.familles && Array.isArray(restoItem.familles)) {
            restoItem.familles.forEach((fam: any) => {
              if (fam.categories && Array.isArray(fam.categories)) {
                fam.categories.forEach((cat: any) => {
                  if (cat.repasList && Array.isArray(cat.repasList)) {
                    cat.repasList.forEach((rItem: any) => {
                      const repasData = rItem.repas || rItem;
                      parsedRepas.push({
                        id: rItem.id || repasData.id || `repas-${Math.random()}`,
                        ordre: rItem.ordre ?? 0,
                        menuCategorieId: cat.nom || cat.id || "Général",
                        repasId: repasData.id || "",
                        nomRepas: repasData.nomRepas || repasData.nom || "",
                        prix: repasData.prix,
                        categorie: cat.nom || cat.id,
                        restaurantId: repasData.restaurantId || rItem.restaurantId || restoItem.id || restoItem.restaurant?.id
                      } as any);
                    });
                  }
                });
              }
            });
          }

          if (parsedRepas.length === 0 && restoItem.repas && Array.isArray(restoItem.repas)) {
            restoItem.repas.forEach((r: any) => {
              parsedRepas.push(r);
            });
          }

          const finalMenuRepas = userRestoId
            ? parsedRepas.filter((r: any) => !r.restaurantId || String(r.restaurantId) === String(userRestoId))
            : parsedRepas;

          setMenuRepasItems(finalMenuRepas);

          // Parse boissons for flat management table
          const parsedBoissons: MenuBoisson[] = [];
          if (restoItem.boissons && Array.isArray(restoItem.boissons)) {
            restoItem.boissons.forEach((bItem: any) => {
              const boissonData = bItem.boisson || bItem;
              parsedBoissons.push({
                id: bItem.id || boissonData.id || `boisson-${Math.random()}`,
                ordre: bItem.ordre ?? 0,
                imageUrl: bItem.imageUrl || boissonData.imageUrl || null,
                boissonId: boissonData.id || bItem.boissonId || "",
                nomBoisson: boissonData.nomBoisson || boissonData.nom || bItem.nomBoisson || bItem.nom || "",
                prix: boissonData.prix ?? bItem.prix,
                restaurantId: boissonData.restaurantId || bItem.restaurantId || restoItem.id || restoItem.restaurant?.id
              } as any);
            });
          }

          const finalMenuBoissons = userRestoId
            ? parsedBoissons.filter((b: any) => !b.restaurantId || String(b.restaurantId) === String(userRestoId))
            : parsedBoissons;

          setMenuBoissonItems(finalMenuBoissons);
        } else {
          setDisplayRestaurant(null);
          setMenuRepasItems([]);
          setMenuBoissonItems([]);
        }
      } else {
        setDisplayRestaurant(null);
        setMenuRepasItems([]);
        setMenuBoissonItems([]);
      }

      setFamilles(fetchedFamilles);
      setBoissonFamilles(fetchedBoissonFamilles);
    } catch (err: any) {
      console.error("Error fetching menu data:", err);
      setError("Impossible de charger l'ensemble des données du menu.");
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchData();
  }, []);

  // Clear toast feedback automatically
  useEffect(() => {
    if (success || error) {
      const timer = setTimeout(() => {
        setSuccess(null);
        setError(null);
      }, 5000);
      return () => clearTimeout(timer);
    }
  }, [success, error]);

  // --- Handlers: Familles ---
  const handleSaveFamille = async (e: React.FormEvent) => {
    e.preventDefault();
    setSubmitting(true);
    setError(null);
    setSuccess(null);

    try {
      if (editingFamille) {
        const payload: MenuFamilleUpdate = { nom: familleNom, ordre: familleOrdre };
        await updateFamille(editingFamille.id, payload);
        setSuccess("Famille mise à jour avec succès !");
      } else {
        const payload: MenuFamilleCreate = { nom: familleNom, ordre: familleOrdre };
        await createFamille(payload);
        setSuccess("Famille créée avec succès !");
      }
      setIsFamilleModalOpen(false);
      setFamilleNom("");
      setFamilleOrdre(0);
      setEditingFamille(null);
      await fetchData();
    } catch (err: any) {
      console.error(err);
      setError(getErrorMessage(err, "Échec de l'enregistrement de la famille."));
    } finally {
      setSubmitting(false);
    }
  };

  const handleDeleteFamille = async (id: string) => {
    if (!window.confirm("Êtes-vous sûr de vouloir supprimer cette famille de menu ?")) return;
    try {
      await deleteFamille(id);
      setSuccess("Famille supprimée avec succès.");
      await fetchData();
    } catch (err: any) {
      console.error(err);
      setError(getErrorMessage(err, "Erreur lors de la suppression de la famille."));
    }
  };

  // --- Handlers: Famille Images ---
  const handleUploadImage = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!uploadFile || !selectedFamilleForUpload) {
      setError("Veuillez choisir un fichier image et une famille.");
      return;
    }
    setSubmitting(true);
    setError(null);
    setSuccess(null);

    try {
      await uploadMenuImage(uploadFile, selectedFamilleForUpload, uploadOrdre);
      setSuccess("Image téléversée et associée avec succès !");
      setIsUploadModalOpen(false);
      setUploadFile(null);
      setSelectedFamilleForUpload("");
      setUploadOrdre(0);
      await fetchData();
    } catch (err: any) {
      console.error(err);
      setError(getErrorMessage(err, "Échec du téléversement de l'image."));
    } finally {
      setSubmitting(false);
    }
  };

  const handleEditImage = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!editingImage) return;

    setSubmitting(true);
    setError(null);
    setSuccess(null);

    try {
      await updateFamilleImage(editingImage.id, editImageFile, editImageOrdre);
      setSuccess("Image mise à jour avec succès !");
      setIsEditImageModalOpen(false);
      setEditingImage(null);
      setEditImageFile(null);
      setEditImageOrdre(0);
      await fetchData();
    } catch (err: any) {
      console.error(err);
      setError(getErrorMessage(err, "Échec de la modification de l'image."));
    } finally {
      setSubmitting(false);
    }
  };

  const handleDeleteImage = async (imageId: string) => {
    if (!window.confirm("Supprimer cette image du menu ?")) return;
    try {
      await deleteFamilleImage(imageId);
      setSuccess("Image supprimée avec succès.");
      await fetchData();
    } catch (err: any) {
      console.error(err);
      setError(getErrorMessage(err, "Erreur lors de la suppression de l'image."));
    }
  };

  // --- Handlers: Repas au Menu ---
  const handleSaveMenuRepas = async (e: React.FormEvent) => {
    e.preventDefault();
    setSubmitting(true);
    setError(null);
    setSuccess(null);

    try {
      if (editingMenuRepas) {
        await updateMenuRepas(editingMenuRepas.id, {
          menuCategorieId: selectedCategorieId || editingMenuRepas.menuCategorieId,
          repasId: selectedRepasId || editingMenuRepas.repasId,
          ordre: repasOrdre
        });
        setSuccess("Plat du menu mis à jour avec succès !");
      } else {
        if (!selectedRepasId || !selectedCategorieId) {
          setError("Veuillez sélectionner un repas et une catégorie.");
          setSubmitting(false);
          return;
        }
        await createMenuRepas({
          repasId: selectedRepasId,
          menuCategorieId: selectedCategorieId,
          ordre: repasOrdre
        });
        setSuccess("Plat ajouté au menu avec succès !");
      }
      setIsRepasModalOpen(false);
      setEditingMenuRepas(null);
      setSelectedRepasId("");
      setSelectedCategorieId("");
      setRepasOrdre(0);
      await fetchData();
    } catch (err: any) {
      console.error(err);
      setError(getErrorMessage(err, "Échec de l'enregistrement du plat au menu."));
    } finally {
      setSubmitting(false);
    }
  };

  const handleDeleteMenuRepas = async (id: string) => {
    if (!window.confirm("Retirer ce plat du menu ?")) return;
    try {
      await deleteMenuRepas(id);
      setSuccess("Plat retiré du menu avec succès.");
      await fetchData();
    } catch (err: any) {
      console.error(err);
      setError(getErrorMessage(err, "Erreur lors de la suppression du plat du menu."));
    }
  };

  // --- Handlers: Familles de Boissons ---
  const handleSaveBoissonFamille = async (e: React.FormEvent) => {
    e.preventDefault();
    setSubmitting(true);
    setError(null);
    setSuccess(null);

    try {
      if (editingBoissonFamille) {
        await updateMenuBoissonFamille(editingBoissonFamille.id, { nom: boissonFamilleNom });
        setSuccess("Famille de boissons mise à jour avec succès !");
      } else {
        await createMenuBoissonFamille({ nom: boissonFamilleNom });
        setSuccess("Famille de boissons créée avec succès !");
      }
      setIsBoissonFamilleModalOpen(false);
      setBoissonFamilleNom("");
      setEditingBoissonFamille(null);
      await fetchData();
    } catch (err: any) {
      console.error(err);
      setError(getErrorMessage(err, "Échec de l'enregistrement de la famille de boissons."));
    } finally {
      setSubmitting(false);
    }
  };

  const handleDeleteBoissonFamille = async (familleId: string) => {
    if (!window.confirm("Êtes-vous sûr de vouloir supprimer cette famille de boissons ?")) return;
    try {
      await deleteMenuBoissonFamille(familleId);
      setSuccess("Famille de boissons supprimée avec succès.");
      await fetchData();
    } catch (err: any) {
      console.error(err);
      setError(getErrorMessage(err, "Erreur lors de la suppression de la famille de boissons."));
    }
  };

  // --- Handlers: Images des Familles de Boissons ---
  const handleUploadBoissonFamilleImage = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!boissonImageFile || !selectedBoissonFamilleForUpload) {
      setError("Veuillez sélectionner un fichier image et une famille de boissons.");
      return;
    }

    const targetFam = boissonFamilles.find((f) => f.id === selectedBoissonFamilleForUpload);
    const existingCount = targetFam?.images?.length ?? 0;
    if (existingCount >= 3) {
      setError("Une famille de boissons ne peut pas contenir plus de 3 images.");
      return;
    }

    setSubmitting(true);
    setError(null);
    setSuccess(null);

    try {
      await uploadMenuBoissonFamilleImage(selectedBoissonFamilleForUpload, boissonImageFile);
      setSuccess("Image ajoutée à la famille de boissons avec succès !");
      setIsBoissonImageUploadModalOpen(false);
      setBoissonImageFile(null);
      setSelectedBoissonFamilleForUpload("");
      await fetchData();
    } catch (err: any) {
      console.error(err);
      setError(getErrorMessage(err, "Échec du téléversement de l'image."));
    } finally {
      setSubmitting(false);
    }
  };

  const handleDeleteBoissonFamilleImage = async (imageId: string) => {
    if (!window.confirm("Supprimer cette image de la famille de boissons ?")) return;
    try {
      await deleteMenuBoissonImage(imageId);
      setSuccess("Image supprimée avec succès.");
      await fetchData();
    } catch (err: any) {
      console.error(err);
      setError(getErrorMessage(err, "Erreur lors de la suppression de l'image."));
    }
  };

  // --- Handlers: Boissons au Menu ---
  const handleSaveMenuBoisson = async (e: React.FormEvent) => {
    e.preventDefault();
    setSubmitting(true);
    setError(null);
    setSuccess(null);

    try {
      if (editingMenuBoisson) {
        await updateMenuBoisson(editingMenuBoisson.id, {
          menuBoissonFamilleId: selectedBoissonFamilleId || editingMenuBoisson.menuBoissonFamilleId,
          boissonId: selectedBoissonId || editingMenuBoisson.boissonId,
          imageUrl: boissonImageUrl || null,
          ordre: boissonOrdre
        });
        setSuccess("Boisson du menu mise à jour avec succès !");
      } else {
        if (!selectedBoissonId || !selectedBoissonFamilleId) {
          setError("Veuillez sélectionner une boisson et une famille de boissons.");
          setSubmitting(false);
          return;
        }
        await createMenuBoisson({
          menuBoissonFamilleId: selectedBoissonFamilleId,
          boissonId: selectedBoissonId,
          imageUrl: boissonImageUrl || null,
          ordre: boissonOrdre
        });
        setSuccess("Boisson ajoutée à la famille avec succès !");
      }
      setIsBoissonModalOpen(false);
      setEditingMenuBoisson(null);
      setSelectedBoissonFamilleId("");
      setSelectedBoissonId("");
      setBoissonImageUrl("");
      setBoissonOrdre(0);
      await fetchData();
    } catch (err: any) {
      console.error(err);
      setError(getErrorMessage(err, "Échec de l'enregistrement de la boisson au menu."));
    } finally {
      setSubmitting(false);
    }
  };

  const handleDeleteMenuBoisson = async (id: string) => {
    if (!window.confirm("Retirer cette boisson du menu ?")) return;
    try {
      await deleteMenuBoisson(id);
      setSuccess("Boisson retirée du menu avec succès.");
      await fetchData();
    } catch (err: any) {
      console.error(err);
      setError(getErrorMessage(err, "Erreur lors de la suppression de la boisson du menu."));
    }
  };

  // Fetch enum category names from GET /menus/categories/noms specifically when modal opens
  const fetchCategoryNoms = async () => {
    try {
      setLoadingCategoryNoms(true);
      const res = await listCategoryNoms();
      const raw = res.data;
      if (Array.isArray(raw)) {
        setCategoryNoms(raw);
      } else if (raw && typeof raw === "object" && Array.isArray((raw as any).data)) {
        setCategoryNoms((raw as any).data);
      }
    } catch (err) {
      console.error("Error fetching category enum names:", err);
    } finally {
      setLoadingCategoryNoms(false);
    }
  };

  // --- Handlers: Categories ---
  const handleSaveCategorie = async (e: React.FormEvent) => {
    e.preventDefault();
    setSubmitting(true);
    setError(null);
    setSuccess(null);

    try {
      if (editingCategorie) {
        await updateMenuCategorie(editingCategorie.id, {
          nom: categorieNom,
          ordre: categorieOrdre,
          menuFamilleId: categorieFamilleId || editingCategorie.menuFamilleId
        });
        setSuccess("Catégorie mise à jour avec succès !");
      } else {
        if (!categorieNom || !categorieFamilleId) {
          setError("Veuillez renseigner un nom et une famille pour la catégorie.");
          setSubmitting(false);
          return;
        }
        await createMenuCategorie({
          nom: categorieNom,
          ordre: categorieOrdre,
          menuFamilleId: categorieFamilleId
        });
        setSuccess("Catégorie créée avec succès !");
      }
      setIsCategorieModalOpen(false);
      setEditingCategorie(null);
      setCategorieNom("");
      setCategorieOrdre(0);
      setCategorieFamilleId("");
      await fetchData();
    } catch (err: any) {
      console.error(err);
      setError(getErrorMessage(err, "Échec de l'enregistrement de la catégorie."));
    } finally {
      setSubmitting(false);
    }
  };

  const handleDeleteCategorie = async (categorieId: string) => {
    if (!window.confirm("Êtes-vous sûr de vouloir supprimer cette catégorie ?")) return;
    try {
      await deleteMenuCategorie(categorieId);
      setSuccess("Catégorie supprimée avec succès.");
      await fetchData();
    } catch (err: any) {
      console.error(err);
      setError(getErrorMessage(err, "Erreur lors de la suppression de la catégorie."));
    }
  };

  return (
    <div className="space-y-8">
      {/* Header & Main Mode Toggle */}
      <div className="flex flex-col md:flex-row items-start md:items-center justify-between gap-4">
        <div>
          <h2 className="text-3xl font-extrabold text-text-primary-light dark:text-text-primary-dark tracking-tight">
            Menu
          </h2>
          <p className="text-text-secondary-light dark:text-text-secondary-dark mt-1">
            Gérez la carte de votre restaurant et visualisez l'aperçu du menu.
          </p>
        </div>

        {/* Mode Switch: Gestion vs Aperçu */}
        <div className="flex items-center gap-2 p-1.5 bg-black/5 dark:bg-white/5 backdrop-blur-md rounded-2xl border border-white/10">
          <button
            onClick={() => setTopMode("gestion")}
            className={`inline-flex items-center gap-2 px-5 py-2.5 rounded-xl font-bold text-sm transition-all ${
              topMode === "gestion"
                ? "bg-accent-light text-white shadow-lg shadow-accent-light/20"
                : "text-text-secondary-light dark:text-text-secondary-dark hover:text-text-primary-light dark:hover:text-text-primary-dark"
            }`}
          >
            <Settings size={18} />
            Gestion du menu
          </button>
          <button
            onClick={() => setTopMode("apercu")}
            className={`inline-flex items-center gap-2 px-5 py-2.5 rounded-xl font-bold text-sm transition-all ${
              topMode === "apercu"
                ? "bg-accent-light text-white shadow-lg shadow-accent-light/20"
                : "text-text-secondary-light dark:text-text-secondary-dark hover:text-text-primary-light dark:hover:text-text-primary-dark"
            }`}
          >
            <Eye size={18} />
            Aperçu du menu
          </button>
        </div>
      </div>

      {/* Global Alerts */}
      {error && (
        <div className="p-4 bg-red-500/10 border border-red-500/20 rounded-2xl text-red-500 text-sm font-medium flex items-center justify-between">
          <span>{error}</span>
          <button onClick={() => setError(null)}><X size={16} /></button>
        </div>
      )}

      {success && (
        <div className="p-4 bg-green-500/10 border border-green-500/20 rounded-2xl text-green-500 text-sm font-medium flex items-center gap-2">
          <CheckCircle2 size={18} />
          <span>{success}</span>
        </div>
      )}

      {loading ? (
        <div className="flex items-center justify-center p-16">
          <Loader2 className="w-8 h-8 text-accent-light animate-spin" />
        </div>
      ) : topMode === "gestion" ? (
        /* ==================== GESTION DU MENU ==================== */
        <div className="space-y-6">
          {/* Sub-Tabs */}
          <div className="flex flex-wrap items-center justify-between gap-4 border-b border-black/10 dark:border-white/10 pb-2">
            <div className="flex gap-6">
              <button
                onClick={() => setGestionTab("familles")}
                className={`pb-3 text-sm font-bold flex items-center gap-2 transition-colors relative ${
                  gestionTab === "familles"
                    ? "text-accent-light border-b-2 border-accent-light"
                    : "text-text-secondary-light dark:text-text-secondary-dark hover:text-text-primary-light dark:hover:text-text-primary-dark"
                }`}
              >
                <Layers size={18} />
                Familles & Images ({familles.length})
              </button>

              <button
                onClick={() => setGestionTab("categories")}
                className={`pb-3 text-sm font-bold flex items-center gap-2 transition-colors relative ${
                  gestionTab === "categories"
                    ? "text-accent-light border-b-2 border-accent-light"
                    : "text-text-secondary-light dark:text-text-secondary-dark hover:text-text-primary-light dark:hover:text-text-primary-dark"
                }`}
              >
                <Sparkles size={18} />
                Catégories ({categories.length})
              </button>

              <button
                onClick={() => setGestionTab("repas")}
                className={`pb-3 text-sm font-bold flex items-center gap-2 transition-colors relative ${
                  gestionTab === "repas"
                    ? "text-accent-light border-b-2 border-accent-light"
                    : "text-text-secondary-light dark:text-text-secondary-dark hover:text-text-primary-light dark:hover:text-text-primary-dark"
                }`}
              >
                <Utensils size={18} />
                Repas du Menu ({menuRepasItems.length})
              </button>

              <button
                onClick={() => setGestionTab("boissons")}
                className={`pb-3 text-sm font-bold flex items-center gap-2 transition-colors relative ${
                  gestionTab === "boissons"
                    ? "text-accent-light border-b-2 border-accent-light"
                    : "text-text-secondary-light dark:text-text-secondary-dark hover:text-text-primary-light dark:hover:text-text-primary-dark"
                }`}
              >
                <Wine size={18} />
                Boissons ({menuBoissonItems.length})
              </button>
            </div>

            {/* Contextual Action Button based on active sub-tab */}
            <div>
              {gestionTab === "familles" && (
                <div className="flex items-center gap-3">
                  <button
                    onClick={() => {
                      setEditingFamille(null);
                      setFamilleNom("");
                      setFamilleOrdre(0);
                      setIsFamilleModalOpen(true);
                    }}
                    className="inline-flex items-center gap-2 px-4 py-2.5 bg-accent-light hover:bg-accent-dark text-white rounded-xl font-bold text-sm transition-all shadow-md active:scale-[0.98]"
                  >
                    <FolderPlus size={16} />
                    Ajouter une famille
                  </button>
                  <button
                    onClick={() => {
                      setSelectedFamilleForUpload(familles[0]?.id || "");
                      setUploadFile(null);
                      setUploadOrdre(0);
                      setIsUploadModalOpen(true);
                    }}
                    className="inline-flex items-center gap-2 px-4 py-2.5 glass-capsule border border-accent-light/30 text-accent-light hover:bg-accent-light/10 rounded-xl font-bold text-sm transition-all active:scale-[0.98]"
                  >
                    <Upload size={16} />
                    Ajouter une image
                  </button>
                </div>
              )}

              {gestionTab === "categories" && (
                <button
                  onClick={() => {
                    setEditingCategorie(null);
                    setCategorieNom("");
                    setCategorieOrdre(0);
                    setCategorieFamilleId(familles[0]?.id || "");
                    fetchCategoryNoms();
                    setIsCategorieModalOpen(true);
                  }}
                  className="inline-flex items-center gap-2 px-4 py-2.5 bg-accent-light hover:bg-accent-dark text-white rounded-xl font-bold text-sm transition-all shadow-md active:scale-[0.98]"
                >
                  <Plus size={16} />
                  Ajouter une catégorie
                </button>
              )}

              {gestionTab === "repas" && (
                <button
                  onClick={() => {
                    setEditingMenuRepas(null);
                    setSelectedRepasId("");
                    const firstCat = categories[0];
                    const defaultCatId = typeof firstCat === "string" ? firstCat : (firstCat?.id || firstCat?.nom || firstCat?.name || "");
                    setSelectedCategorieId(defaultCatId);
                    setRepasOrdre(0);
                    setIsRepasModalOpen(true);
                  }}
                  className="inline-flex items-center gap-2 px-4 py-2.5 bg-accent-light hover:bg-accent-dark text-white rounded-xl font-bold text-sm transition-all shadow-md active:scale-[0.98]"
                >
                  <Plus size={16} />
                  Ajouter un plat au menu
                </button>
              )}

              {gestionTab === "boissons" && (
                <div className="flex items-center gap-3">
                  <button
                    onClick={() => {
                      setEditingBoissonFamille(null);
                      setBoissonFamilleNom("");
                      setIsBoissonFamilleModalOpen(true);
                    }}
                    className="inline-flex items-center gap-2 px-4 py-2.5 bg-accent-light hover:bg-accent-dark text-white rounded-xl font-bold text-sm transition-all shadow-md active:scale-[0.98]"
                  >
                    <FolderPlus size={16} />
                    Créer une famille de boissons
                  </button>
                  {boissonFamilles.length > 0 && (
                    <button
                      onClick={() => {
                        setEditingMenuBoisson(null);
                        setSelectedBoissonFamilleId(boissonFamilles[0]?.id || "");
                        setSelectedBoissonId("");
                        setBoissonImageUrl("");
                        setBoissonOrdre(0);
                        setIsBoissonModalOpen(true);
                      }}
                      className="inline-flex items-center gap-2 px-4 py-2.5 glass-capsule border border-accent-light/30 text-accent-light hover:bg-accent-light/10 rounded-xl font-bold text-sm transition-all active:scale-[0.98]"
                    >
                      <Plus size={16} />
                      Ajouter une boisson
                    </button>
                  )}
                </div>
              )}
            </div>
          </div>

          {/* Sub-Tab 1: Familles & Images */}
          {gestionTab === "familles" && (
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
              {familles.map((famille) => (
                <motion.div
                  key={famille.id}
                  whileHover={{ y: -4 }}
                  className="glass-card-premium p-6 flex flex-col justify-between space-y-4"
                >
                  <div>
                    <div className="flex justify-between items-start mb-2">
                      <h3 className="text-xl font-bold text-text-primary-light dark:text-text-primary-dark">
                        {famille.nom}
                      </h3>
                      <span className="text-xs px-2.5 py-1 bg-white/10 rounded-full font-semibold text-text-secondary-light dark:text-text-secondary-dark">
                        Ordre: {famille.ordre}
                      </span>
                    </div>

                    {/* Images gallery in the same frame */}
                    {(() => {
                      const rawImages =
                        famille.images ||
                        (famille as any).familleImages ||
                        (famille as any).famille_images ||
                        (famille as any).images_urls ||
                        (famille as any).imageUrls ||
                        [];

                      const images: MenuFamilleImage[] = (Array.isArray(rawImages) ? rawImages : [])
                        .map((img: any, idx: number) => {
                          if (typeof img === "string") {
                            return { id: `img-${famille.id}-${idx}`, familleId: famille.id, imageUrl: img, ordre: idx };
                          }
                          return {
                            id: String(img?.id || img?.public_id || `img-${famille.id}-${idx}`),
                            familleId: String(img?.familleId || img?.famille_id || famille.id),
                            imageUrl: String(img?.imageUrl || img?.image_url || img?.url || img?.src || ""),
                            ordre: img?.ordre ?? idx,
                            public_id: img?.public_id
                          };
                        })
                        .filter((img) => Boolean(img.imageUrl));

                      if (images.length === 0) {
                        return (
                          <div className="h-36 my-4 rounded-xl border border-dashed border-white/10 text-center text-xs text-text-secondary-light dark:text-text-secondary-dark flex flex-col items-center justify-center gap-2 overflow-hidden">
                            <ImageIcon size={20} className="opacity-40" />
                            <span>Aucune image associée</span>
                          </div>
                        );
                      }

                      if (images.length === 1) {
                        const img = images[0];
                        return (
                          <div className="h-36 my-4 rounded-xl border border-white/10 overflow-hidden relative group/img bg-black/20">
                            <img src={img.imageUrl} alt={famille.nom} className="w-full h-full object-cover" />
                            <div className="absolute inset-0 bg-black/40 opacity-0 group-hover/img:opacity-100 transition-opacity flex items-center justify-center gap-2">
                              <button
                                onClick={() => {
                                  setEditingImage(img);
                                  setEditImageFile(null);
                                  setEditImageOrdre(img.ordre || 0);
                                  setIsEditImageModalOpen(true);
                                }}
                                className="p-1.5 bg-accent-light text-white rounded-lg hover:scale-110 transition-transform"
                                title="Remplacer / Modifier"
                              >
                                <Edit2 size={14} />
                              </button>
                              <button
                                onClick={() => handleDeleteImage(img.id)}
                                className="p-1.5 bg-red-500 text-white rounded-lg hover:scale-110 transition-transform"
                                title="Supprimer"
                              >
                                <Trash2 size={14} />
                              </button>
                            </div>
                            <span className="absolute bottom-1 right-1 text-[10px] bg-black/60 px-1.5 py-0.5 rounded text-white pointer-events-none">
                              ord: {img.ordre}
                            </span>
                          </div>
                        );
                      }

                      const imagesToDisplay = images.slice(0, 2);
                      return (
                        <div className="h-36 my-4 rounded-xl border border-white/10 overflow-hidden flex flex-col divide-y divide-white/10 bg-black/20">
                          {imagesToDisplay.map((img) => (
                            <div key={img.id} className="relative flex-1 h-1/2 group/img overflow-hidden">
                              <img src={img.imageUrl} alt={famille.nom} className="w-full h-full object-cover" />
                              <div className="absolute inset-0 bg-black/40 opacity-0 group-hover/img:opacity-100 transition-opacity flex items-center justify-center gap-2">
                                <button
                                  onClick={() => {
                                    setEditingImage(img);
                                    setEditImageFile(null);
                                    setEditImageOrdre(img.ordre || 0);
                                    setIsEditImageModalOpen(true);
                                  }}
                                  className="p-1 bg-accent-light text-white rounded hover:scale-110 transition-transform"
                                  title="Remplacer / Modifier"
                                >
                                  <Edit2 size={12} />
                                </button>
                                <button
                                  onClick={() => handleDeleteImage(img.id)}
                                  className="p-1 bg-red-500 text-white rounded hover:scale-110 transition-transform"
                                  title="Supprimer"
                                >
                                  <Trash2 size={12} />
                                </button>
                              </div>
                              <span className="absolute bottom-1 right-1 text-[9px] bg-black/60 px-1 py-0.2 rounded text-white pointer-events-none">
                                ord: {img.ordre}
                              </span>
                            </div>
                          ))}
                        </div>
                      );
                    })()}
                  </div>

                  <div className="flex items-center justify-between pt-4 border-t border-black/5 dark:border-white/5">
                    <button
                      onClick={() => {
                        setSelectedFamilleForUpload(famille.id);
                        setUploadFile(null);
                        setUploadOrdre(0);
                        setIsUploadModalOpen(true);
                      }}
                      className="inline-flex items-center gap-1.5 px-3 py-1.5 rounded-xl glass-capsule text-xs font-bold text-accent-light hover:bg-accent-light/10 transition-colors"
                    >
                      <Upload size={14} />
                      Image
                    </button>

                    <div className="flex items-center gap-2">
                      <button
                        onClick={() => {
                          setEditingFamille(famille);
                          setFamilleNom(famille.nom);
                          setFamilleOrdre(famille.ordre);
                          setIsFamilleModalOpen(true);
                        }}
                        className="p-2 rounded-xl glass-capsule text-text-primary-light dark:text-text-primary-dark hover:bg-white/10 transition-colors"
                        title="Modifier la famille"
                      >
                        <Edit2 size={16} />
                      </button>
                      <button
                        onClick={() => handleDeleteFamille(famille.id)}
                        className="p-2 rounded-xl glass-capsule text-red-500 hover:bg-red-500/10 transition-colors"
                        title="Supprimer la famille"
                      >
                        <Trash2 size={16} />
                      </button>
                    </div>
                  </div>
                </motion.div>
              ))}

              {familles.length === 0 && (
                <div className="glass-card-premium p-12 text-center col-span-full">
                  <Layers className="w-12 h-12 text-text-secondary-light dark:text-text-secondary-dark mx-auto mb-4 opacity-50" />
                  <p className="text-text-secondary-light dark:text-text-secondary-dark font-medium">
                    Aucune famille de menu configurée.
                  </p>
                </div>
              )}
            </div>
          )}

          {/* Sub-Tab 2: Catégories Disponibles */}
          {gestionTab === "categories" && (
            <div className="space-y-6">
              <div className="glass-card-premium p-8 space-y-6">
                <div className="flex justify-between items-center border-b border-black/5 dark:border-white/5 pb-4">
                  <div>
                    <h3 className="text-xl font-bold text-text-primary-light dark:text-text-primary-dark flex items-center gap-2">
                      <Sparkles className="w-5 h-5 text-accent-light" />
                      Catégories de Menu Disponibles
                    </h3>
                    <p className="text-xs text-text-secondary-light dark:text-text-secondary-dark mt-1">
                      Catégories officielles renvoyées dynamiquement par le serveur API (`enum MenuCategorieNom`).
                    </p>
                  </div>
                  <span className="px-3 py-1 bg-accent-light/10 text-accent-light border border-accent-light/20 rounded-full text-xs font-extrabold">
                    {categories.length} Catégorie(s)
                  </span>
                </div>

                <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-4">
                  {categories.map((cat, idx) => {
                    const catLabel = typeof cat === "string" ? cat : (cat?.nom || cat?.name || cat?.id || `Catégorie ${idx + 1}`);
                    const catObj = typeof cat === "object" && cat !== null ? cat : null;
                    const catId = catObj?.id;

                    return (
                      <motion.div
                        key={idx}
                        whileHover={{ scale: 1.02 }}
                        className="p-5 glass-card-premium border border-white/10 flex items-center justify-between group"
                      >
                        <div
                          className="flex items-center gap-3 flex-1 cursor-pointer"
                          onClick={() => {
                            setSelectedCategoryFilter(catLabel);
                            setGestionTab("repas");
                          }}
                        >
                          <div className="p-2.5 rounded-xl bg-accent-light/10 text-accent-light group-hover:bg-accent-light group-hover:text-white transition-colors">
                            <Utensils size={18} />
                          </div>
                          <div>
                            <span className="font-bold text-sm text-text-primary-light dark:text-text-primary-dark block">
                              {catLabel}
                            </span>
                            {catObj?.menuFamilleId && (
                              <span className="text-[10px] text-text-secondary-light dark:text-text-secondary-dark">
                                Famille: {familles.find((f) => f.id === catObj.menuFamilleId)?.nom || catObj.menuFamilleId}
                              </span>
                            )}
                          </div>
                        </div>

                        {catId ? (
                          <div className="flex items-center gap-1 ml-2">
                            <button
                              onClick={(e) => {
                                e.stopPropagation();
                                setEditingCategorie(catObj as MenuCategorie);
                                setCategorieNom(catObj.nom || catLabel);
                                setCategorieOrdre(catObj.ordre || 0);
                                setCategorieFamilleId(catObj.menuFamilleId || familles[0]?.id || "");
                                fetchCategoryNoms();
                                setIsCategorieModalOpen(true);
                              }}
                              className="p-1.5 rounded-lg glass-capsule text-text-primary-light dark:text-text-primary-dark hover:bg-white/10 transition-colors"
                              title="Modifier la catégorie"
                            >
                              <Edit2 size={14} />
                            </button>
                            <button
                              onClick={(e) => {
                                e.stopPropagation();
                                handleDeleteCategorie(catId);
                              }}
                              className="p-1.5 rounded-lg glass-capsule text-red-500 hover:bg-red-500/10 transition-colors"
                              title="Supprimer la catégorie"
                            >
                              <Trash2 size={14} />
                            </button>
                          </div>
                        ) : (
                          <span
                            className="text-[10px] font-bold text-accent-light group-hover:underline cursor-pointer"
                            onClick={() => {
                              setSelectedCategoryFilter(catLabel);
                              setGestionTab("repas");
                            }}
                          >
                            Voir les plats →
                          </span>
                        )}
                      </motion.div>
                    );
                  })}

                  {categories.length === 0 && (
                    <div className="col-span-full p-8 text-center text-text-secondary-light dark:text-text-secondary-dark italic">
                      Aucune catégorie disponible sur le serveur. Vous pouvez utiliser le bouton "+ Ajouter un plat au menu" pour associer un plat à une catégorie en entrant son identifiant.
                    </div>
                  )}
                </div>
              </div>
            </div>
          )}

          {/* Sub-Tab 3: Repas du Menu */}
          {gestionTab === "repas" && (
            <div className="space-y-6">
              {/* Category Filter Pills */}
              <div className="glass-card-premium p-4 flex flex-wrap items-center justify-between gap-4">
                <div className="flex items-center gap-2 flex-wrap">
                  <span className="text-xs font-bold text-text-secondary-light dark:text-text-secondary-dark uppercase tracking-wider mr-2">
                    Filtrer par catégorie:
                  </span>
                  <button
                    onClick={() => setSelectedCategoryFilter("")}
                    className={`px-3 py-1.5 rounded-full text-xs font-bold transition-all ${
                      selectedCategoryFilter === ""
                        ? "bg-accent-light text-white shadow-md shadow-accent-light/20"
                        : "glass-capsule text-text-secondary-light dark:text-text-secondary-dark hover:text-text-primary-light"
                    }`}
                  >
                    Toutes ({menuRepasItems.length})
                  </button>
                  {categories.map((cat, idx) => {
                    const catVal = typeof cat === "string" ? cat : (cat?.id || cat?.nom || cat?.name || `cat-${idx}`);
                    const catLabel = typeof cat === "string" ? cat : (cat?.nom || cat?.name || cat?.id || `Catégorie ${idx + 1}`);
                    const count = menuRepasItems.filter(
                      (item) => String((item as any).menuCategorieId || (item as any).categorie || "") === catVal || String((item as any).menuCategorieId || (item as any).categorie || "") === catLabel
                    ).length;
                    return (
                      <button
                        key={idx}
                        onClick={() => setSelectedCategoryFilter(catLabel)}
                        className={`px-3 py-1.5 rounded-full text-xs font-bold transition-all ${
                          selectedCategoryFilter === catLabel
                            ? "bg-accent-light text-white shadow-md shadow-accent-light/20"
                            : "glass-capsule text-text-secondary-light dark:text-text-secondary-dark hover:text-text-primary-light"
                        }`}
                      >
                        {catLabel} ({count})
                      </button>
                    );
                  })}
                </div>
              </div>

              {/* Table / List of Menu Repas */}
              <div className="glass-card-premium overflow-hidden">
                <div className="p-6 border-b border-black/5 dark:border-white/5 flex justify-between items-center">
                  <h3 className="text-lg font-bold text-text-primary-light dark:text-text-primary-dark">
                    Plats actuellement au Menu
                  </h3>
                  <span className="text-xs font-semibold px-3 py-1 bg-white/10 rounded-full text-text-secondary-light dark:text-text-secondary-dark">
                    {menuRepasItems.length} plat(s)
                  </span>
                </div>

                <div className="overflow-x-auto">
                  <table className="w-full text-left border-collapse">
                    <thead>
                      <tr className="border-b border-black/5 dark:border-white/5 bg-black/5 dark:bg-white/5 text-xs text-text-secondary-light dark:text-text-secondary-dark uppercase tracking-wider">
                        <th className="p-4">Plat</th>
                        <th className="p-4">Catégorie ID / Nom</th>
                        <th className="p-4">Ordre</th>
                        <th className="p-4 text-right">Actions</th>
                      </tr>
                    </thead>
                    <tbody className="divide-y divide-black/5 dark:divide-white/5 text-sm">
                      {menuRepasItems
                        .filter((item) => {
                          if (!selectedCategoryFilter) return true;
                          const catLabel = String((item as any).menuCategorieId || (item as any).categorie || "");
                          return catLabel === selectedCategoryFilter;
                        })
                        .map((item) => {
                          const matchedRepas = allRestaurantRepas.find((r) => r.id === item.repasId);
                          const displayName = String((item as any).nomRepas || (item as any).nom || matchedRepas?.nomRepas || item.repasId);
                          const displayPrice = (item as any).prix || matchedRepas?.prix;
                          const catLabel = String((item as any).menuCategorieId || (item as any).categorie || "N/A");

                          return (
                          <tr key={item.id} className="hover:bg-black/5 dark:hover:bg-white/5 transition-colors">
                            <td className="p-4 font-semibold text-text-primary-light dark:text-text-primary-dark">
                              <div>{displayName}</div>
                              {displayPrice && (
                                <div className="text-xs font-bold text-accent-light">
                                  {Number(displayPrice).toLocaleString()} F CFA
                                </div>
                              )}
                            </td>
                            <td className="p-4 text-text-secondary-light dark:text-text-secondary-dark font-medium">
                              {catLabel}
                            </td>
                            <td className="p-4">
                              <span className="px-2.5 py-1 bg-white/10 rounded-full text-xs font-bold">
                                {item.ordre}
                              </span>
                            </td>
                            <td className="p-4 text-right space-x-2">
                              <button
                                onClick={() => {
                                  setEditingMenuRepas(item);
                                  setSelectedRepasId(item.repasId);
                                  setSelectedCategorieId(item.menuCategorieId || categories[0] || "");
                                  setRepasOrdre(item.ordre || 0);
                                  setIsRepasModalOpen(true);
                                }}
                                className="p-2 rounded-xl glass-capsule text-text-primary-light dark:text-text-primary-dark hover:bg-white/10 transition-colors"
                                title="Modifier l'association / l'ordre"
                              >
                                <Edit2 size={16} />
                              </button>
                              <button
                                onClick={() => handleDeleteMenuRepas(item.id)}
                                className="p-2 rounded-xl glass-capsule text-red-500 hover:bg-red-500/10 transition-colors"
                                title="Retirer du menu"
                              >
                                <Trash2 size={16} />
                              </button>
                            </td>
                          </tr>
                        );
                      })}

                      {menuRepasItems.length === 0 && (
                        <tr>
                          <td colSpan={4} className="p-8 text-center text-text-secondary-light dark:text-text-secondary-dark">
                            Aucun plat figurant dans le menu actuellement. Cliquez sur "+ Ajouter un plat au menu" pour associer un repas existant.
                          </td>
                        </tr>
                      )}
                    </tbody>
                  </table>
                </div>
              </div>
            </div>
          )}

          {/* Sub-Tab 4: Boissons par Familles */}
          {gestionTab === "boissons" && (
            <div className="space-y-8">
              {boissonFamilles.map((famille) => {
                const rawImages = famille.images || (famille as any).familleImages || (famille as any).images_urls || (famille as any).boissonImages || [];
                const images = (Array.isArray(rawImages) ? rawImages : [])
                  .map((img: any, idx: number) => ({
                    id: String(img?.id || img?.public_id || `bimg-${famille.id}-${idx}`),
                    url: String(img?.url || img?.imageUrl || img?.image_url || img?.src || ""),
                    public_id: img?.public_id
                  }))
                  .filter((img) => Boolean(img.url));

                const maxImagesReached = images.length >= 3;

                // Find drinks associated with this beverage family
                const itemsFromState = menuBoissonItems.filter((item) => {
                  const famId = String((item as any).menuBoissonFamilleId || (item as any).familleId || (item as any).menu_boisson_famille_id || (item as any).menuBoissonFamille?.id || "");
                  return famId === String(famille.id);
                });
                const itemsFromFamille = famille.boissons || (famille as any).boissonList || [];
                const associatedBoissons = itemsFromState.length > 0 ? itemsFromState : itemsFromFamille;

                return (
                  <div key={famille.id} className="glass-card-premium p-6 sm:p-8 space-y-6">
                    {/* Header of Beverage Family */}
                    <div className="flex flex-col sm:flex-row items-start sm:items-center justify-between gap-4 border-b border-black/10 dark:border-white/10 pb-4">
                      <div>
                        <h3 className="text-2xl font-extrabold text-text-primary-light dark:text-text-primary-dark">
                          {famille.nom}
                        </h3>
                        <p className="text-xs text-text-secondary-light dark:text-text-secondary-dark mt-1">
                          {associatedBoissons.length} boisson(s) dans cette famille • {images.length}/3 image(s)
                        </p>
                      </div>

                      <div className="flex items-center gap-2">
                        {!maxImagesReached ? (
                          <button
                            onClick={() => {
                              setSelectedBoissonFamilleForUpload(famille.id);
                              setBoissonImageFile(null);
                              setIsBoissonImageUploadModalOpen(true);
                            }}
                            className="inline-flex items-center gap-1.5 px-3 py-1.5 rounded-xl glass-capsule text-xs font-bold text-accent-light hover:bg-accent-light/10 transition-colors"
                          >
                            <Upload size={14} />
                            Ajouter une image
                          </button>
                        ) : (
                          <span className="text-xs px-3 py-1.5 bg-white/5 rounded-xl text-text-secondary-light dark:text-text-secondary-dark italic">
                            Max 3 images
                          </span>
                        )}

                        <button
                          onClick={() => {
                            setEditingMenuBoisson(null);
                            setSelectedBoissonFamilleId(famille.id);
                            setSelectedBoissonId("");
                            setBoissonImageUrl("");
                            setBoissonOrdre(0);
                            setIsBoissonModalOpen(true);
                          }}
                          className="inline-flex items-center gap-1.5 px-3 py-1.5 rounded-xl bg-accent-light hover:bg-accent-dark text-white text-xs font-bold transition-all shadow-sm"
                        >
                          <Plus size={14} />
                          Ajouter une boisson
                        </button>

                        <button
                          onClick={() => {
                            setEditingBoissonFamille(famille);
                            setBoissonFamilleNom(famille.nom);
                            setIsBoissonFamilleModalOpen(true);
                          }}
                          className="p-2 rounded-xl glass-capsule text-text-primary-light dark:text-text-primary-dark hover:bg-white/10 transition-colors"
                          title="Modifier le nom de la famille"
                        >
                          <Edit2 size={16} />
                        </button>

                        <button
                          onClick={() => handleDeleteBoissonFamille(famille.id)}
                          className="p-2 rounded-xl glass-capsule text-red-500 hover:bg-red-500/10 transition-colors"
                          title="Supprimer la famille de boissons"
                        >
                          <Trash2 size={16} />
                        </button>
                      </div>
                    </div>

                    {/* Images of Beverage Family (Max 3, dynamic space allocation) */}
                    <div className="space-y-2">
                      <h4 className="text-xs font-bold uppercase tracking-wider text-text-secondary-light dark:text-text-secondary-dark">
                        Images de la famille ({images.length}/3)
                      </h4>
                      {images.length > 0 ? (
                        <div
                          className={`grid gap-4 w-full ${
                            images.length === 1
                              ? "grid-cols-1"
                              : images.length === 2
                              ? "grid-cols-1 sm:grid-cols-2"
                              : "grid-cols-1 sm:grid-cols-3"
                          }`}
                        >
                          {images.map((img) => (
                            <div
                              key={img.id}
                              className={`${
                                images.length === 1
                                  ? "h-56 sm:h-64"
                                  : images.length === 2
                                  ? "h-48 sm:h-56"
                                  : "h-40 sm:h-48"
                              } rounded-2xl overflow-hidden relative group border border-white/10 bg-black/20 w-full`}
                            >
                              <img src={img.url} alt={famille.nom} className="w-full h-full object-cover" />
                              <div className="absolute inset-0 bg-black/50 opacity-0 group-hover:opacity-100 transition-opacity flex items-center justify-center">
                                <button
                                  onClick={() => handleDeleteBoissonFamilleImage(img.id)}
                                  className="p-2 bg-red-500 text-white rounded-xl hover:scale-110 transition-transform flex items-center gap-1 text-xs font-bold"
                                  title="Supprimer l'image"
                                >
                                  <Trash2 size={14} />
                                  Supprimer
                                </button>
                              </div>
                            </div>
                          ))}
                        </div>
                      ) : (
                        <div className="p-4 rounded-2xl border border-dashed border-white/10 text-center text-xs text-text-secondary-light dark:text-text-secondary-dark flex items-center justify-center gap-2">
                          <ImageIcon size={16} className="opacity-40" />
                          <span>Aucune image pour cette famille de boissons.</span>
                        </div>
                      )}
                    </div>

                    {/* Drinks List in Beverage Family */}
                    <div className="space-y-2 pt-2">
                      <h4 className="text-xs font-bold uppercase tracking-wider text-text-secondary-light dark:text-text-secondary-dark">
                        Boissons incluses
                      </h4>

                      {associatedBoissons.length > 0 ? (
                        <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-3">
                          {associatedBoissons.map((item) => {
                            const matchedBoisson = allRestaurantBoissons.find((b) => b.id === item.boissonId);
                            const displayName = String((item as any).nomBoisson || (item as any).nom || matchedBoisson?.nomBoisson || item.boissonId);
                            const displayPrice = (item as any).prix || matchedBoisson?.prix;

                            return (
                              <div
                                key={item.id}
                                className="p-3.5 glass-card-premium border border-white/10 rounded-2xl flex items-center justify-between group"
                              >
                                <div className="space-y-0.5 min-w-0 pr-2">
                                  <p className="font-bold text-sm text-text-primary-light dark:text-text-primary-dark truncate">
                                    {displayName}
                                  </p>
                                  {displayPrice && (
                                    <p className="text-xs font-extrabold text-accent-light">
                                      {Number(displayPrice).toLocaleString()} F CFA
                                    </p>
                                  )}
                                </div>

                                <div className="flex items-center gap-1">
                                  <button
                                    onClick={() => {
                                      setEditingMenuBoisson(item);
                                      setSelectedBoissonFamilleId(famille.id);
                                      setSelectedBoissonId(item.boissonId);
                                      setBoissonImageUrl(item.imageUrl || "");
                                      setBoissonOrdre(item.ordre || 0);
                                      setIsBoissonModalOpen(true);
                                    }}
                                    className="p-1.5 rounded-lg glass-capsule text-text-primary-light dark:text-text-primary-dark hover:bg-white/10 transition-colors"
                                    title="Changer de famille / modifier"
                                  >
                                    <Edit2 size={14} />
                                  </button>
                                  <button
                                    onClick={() => handleDeleteMenuBoisson(item.id)}
                                    className="p-1.5 rounded-lg glass-capsule text-red-500 hover:bg-red-500/10 transition-colors"
                                    title="Retirer la boisson"
                                  >
                                    <Trash2 size={14} />
                                  </button>
                                </div>
                              </div>
                            );
                          })}
                        </div>
                      ) : (
                        <div className="p-4 rounded-2xl bg-white/5 text-center text-xs text-text-secondary-light dark:text-text-secondary-dark italic">
                          Aucune boisson dans cette famille. Cliquez sur "Ajouter une boisson" pour lui en associer une.
                        </div>
                      )}
                    </div>
                  </div>
                );
              })}

              {boissonFamilles.length === 0 && (
                <div className="glass-card-premium p-12 text-center col-span-full space-y-4">
                  <Wine className="w-12 h-12 text-text-secondary-light dark:text-text-secondary-dark mx-auto opacity-50" />
                  <div>
                    <p className="text-text-primary-light dark:text-text-primary-dark font-bold text-lg">
                      Aucune famille de boissons
                    </p>
                    <p className="text-text-secondary-light dark:text-text-secondary-dark text-sm mt-1">
                      Commencez par créer une famille de boissons (ex: "Nos boissons en bouteille", "Nos boissons importées", "Nos liqueurs").
                    </p>
                  </div>
                  <button
                    onClick={() => {
                      setEditingBoissonFamille(null);
                      setBoissonFamilleNom("");
                      setIsBoissonFamilleModalOpen(true);
                    }}
                    className="inline-flex items-center gap-2 px-5 py-2.5 bg-accent-light text-white rounded-xl font-bold text-sm shadow-md hover:bg-accent-dark transition-all"
                  >
                    <FolderPlus size={16} />
                    Créer une famille de boissons
                  </button>
                </div>
              )}
            </div>
          )}
        </div>
      ) : (
        /* ==================== APERÇU DU MENU (GET /menus/display) ==================== */
        <div className="space-y-8">
          <div className="flex justify-between items-center">
            <h3 className="text-2xl font-bold text-text-primary-light dark:text-text-primary-dark flex items-center gap-2">
              <Eye className="text-accent-light" />
              Aperçu du Menu Public
            </h3>
            <button
              onClick={fetchData}
              className="inline-flex items-center gap-2 px-4 py-2 glass-capsule text-xs font-bold text-text-primary-light dark:text-text-primary-dark hover:bg-white/10 rounded-xl transition-all"
            >
              <RefreshCw size={14} />
              Actualiser l'aperçu
            </button>
          </div>

          {displayRestaurant ? (
            <div className="space-y-8">
              {/* Restaurant Header Card - Strict Rule 1: Only displayRestaurant.image */}
              <div className="glass-card-premium p-8 flex flex-col md:flex-row gap-8 items-center border border-accent-light/20">
                <div className="w-full md:w-56 h-56 rounded-3xl overflow-hidden bg-gradient-to-tr from-slate-800 to-slate-950 flex items-center justify-center shadow-inner">
                  {displayRestaurant.image ? (
                    <img src={displayRestaurant.image} alt={displayRestaurant.name} className="w-full h-full object-cover" />
                  ) : (
                    <Building2 className="w-16 h-16 text-white/20" />
                  )}
                </div>
                <div className="flex-1 space-y-3">
                  <div className="flex items-center gap-3">
                    <h2 className="text-3xl font-extrabold text-text-primary-light dark:text-text-primary-dark">
                      {displayRestaurant.name}
                    </h2>
                    {displayRestaurant.rating !== undefined && displayRestaurant.rating !== null && (
                      <div className="px-3 py-1 bg-accent-light/10 text-accent-light rounded-full text-sm font-bold flex items-center gap-1">
                        <Star className="w-4 h-4 fill-current" />
                        {displayRestaurant.rating}
                      </div>
                    )}
                  </div>
                  {displayRestaurant.description && (
                    <p className="text-text-secondary-light dark:text-text-secondary-dark text-sm max-w-2xl">
                      {displayRestaurant.description}
                    </p>
                  )}
                  <div className="flex flex-wrap gap-4 pt-2">
                    {displayRestaurant.cuisine && (
                      <div className="flex items-center gap-2 text-xs font-semibold text-accent-light bg-accent-light/10 px-3 py-1.5 rounded-full">
                        <UtensilsCrossed size={14} />
                        <span>{displayRestaurant.cuisine}</span>
                      </div>
                    )}
                    {displayRestaurant.address && (
                      <div className="flex items-center gap-2 text-xs font-semibold text-text-secondary-light dark:text-text-secondary-dark bg-white/5 px-3 py-1.5 rounded-full">
                        <MapPin size={14} />
                        <span>{displayRestaurant.address}</span>
                      </div>
                    )}
                  </div>
                </div>
              </div>

              {/* Strict Hierarchical Menu Rendering */}
              <div className="space-y-12">
                {/* Familles */}
                {displayRestaurant.familles.map((famille) => (
                  <div key={famille.id} className="space-y-6 glass-card-premium p-6 sm:p-8 rounded-3xl">
                    {/* 1. Nom de la famille */}
                    <div className="flex items-center gap-4 border-b border-black/10 dark:border-white/10 pb-4">
                      <h3 className="text-3xl font-extrabold text-text-primary-light dark:text-text-primary-dark tracking-tight">
                        {famille.nom}
                      </h3>
                    </div>

                    {/* 2. Image(s) de cette famille uniquement */}
                    {famille.images && famille.images.length > 0 && (
                      <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 gap-4 my-4">
                        {famille.images.map((img) => (
                          <div key={img.id} className="h-48 sm:h-56 rounded-2xl overflow-hidden bg-slate-900 border border-white/10 shadow-md">
                            <img src={img.imageUrl} alt={famille.nom} className="w-full h-full object-cover hover:scale-105 transition-transform duration-300" />
                          </div>
                        ))}
                      </div>
                    )}

                    {/* 3. Catégories de cette famille uniquement */}
                    <div className="space-y-8 pt-2">
                      {famille.categories.map((cat) => (
                        <div key={cat.id} className="space-y-4">
                          <h4 className="text-xl font-bold text-accent-light border-l-4 border-accent-light pl-3 py-0.5">
                            {cat.nom}
                          </h4>
                          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
                            {cat.repasList.map((repas) => (
                              <motion.div
                                key={repas.id}
                                initial={{ opacity: 0, scale: 0.95 }}
                                animate={{ opacity: 1, scale: 1 }}
                                className="glass-card-premium p-6 hover:bg-white/50 dark:hover:bg-slate-800/60 transition-colors group flex flex-col justify-between"
                              >
                                <div>
                                  <div className="flex justify-between items-start mb-2 gap-2">
                                    <h5 className="text-lg font-bold text-text-primary-light dark:text-text-primary-dark group-hover:text-accent-light transition-colors">
                                      {repas.nom}
                                    </h5>
                                    {repas.formattedPrice && (
                                      <span className="text-accent-light font-bold text-lg whitespace-nowrap">
                                        {repas.formattedPrice}
                                      </span>
                                    )}
                                  </div>
                                  {repas.description && (
                                    <p className="text-sm text-text-secondary-light dark:text-text-secondary-dark leading-relaxed">
                                      {repas.description}
                                    </p>
                                  )}
                                </div>
                              </motion.div>
                            ))}
                          </div>
                        </div>
                      ))}
                    </div>
                  </div>
                ))}

                {/* Boissons Section */}
                {displayRestaurant.boissons.length > 0 && (
                  <div className="space-y-6 glass-card-premium p-6 sm:p-8 rounded-3xl">
                    <div className="flex items-center gap-3 border-b border-black/10 dark:border-white/10 pb-4">
                      <Wine className="w-7 h-7 text-accent-light" />
                      <h3 className="text-3xl font-extrabold text-text-primary-light dark:text-text-primary-dark tracking-tight">
                        Boissons
                      </h3>
                    </div>
                    <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
                      {displayRestaurant.boissons.map((boisson) => (
                        <motion.div
                          key={boisson.id}
                          initial={{ opacity: 0, scale: 0.95 }}
                          animate={{ opacity: 1, scale: 1 }}
                          className="glass-card-premium p-6 hover:bg-white/50 dark:hover:bg-slate-800/60 transition-colors group flex items-center gap-4"
                        >
                          {boisson.imageUrl ? (
                            <img src={boisson.imageUrl} alt={boisson.nom} className="w-20 h-20 object-cover rounded-2xl border border-white/10 flex-shrink-0" />
                          ) : (
                            <div className="w-20 h-20 rounded-2xl bg-white/5 flex items-center justify-center text-text-secondary-light dark:text-text-secondary-dark flex-shrink-0">
                              <Wine size={28} className="opacity-30" />
                            </div>
                          )}
                          <div className="flex-1 space-y-1 min-w-0">
                            <h5 className="text-lg font-bold text-text-primary-light dark:text-text-primary-dark group-hover:text-accent-light transition-colors truncate">
                              {boisson.nom}
                            </h5>
                            {boisson.formattedPrice && (
                              <p className="text-accent-light font-bold text-base">
                                {boisson.formattedPrice}
                              </p>
                            )}
                            {boisson.description && (
                              <p className="text-xs text-text-secondary-light dark:text-text-secondary-dark line-clamp-2">
                                {boisson.description}
                              </p>
                            )}
                          </div>
                        </motion.div>
                      ))}
                    </div>
                  </div>
                )}

                {displayRestaurant.familles.length === 0 && displayRestaurant.boissons.length === 0 && (
                  <div className="glass-card-premium p-12 text-center text-text-secondary-light dark:text-text-secondary-dark">
                    Aucun plat ou boisson au menu pour ce restaurant.
                  </div>
                )}
              </div>
            </div>
          ) : (
            <div className="glass-card-premium p-12 text-center text-text-secondary-light dark:text-text-secondary-dark">
              Aucun restaurant n'a pu être chargé pour l'aperçu public.
            </div>
          )}
        </div>
      )}

      {/* ==================== MODALS ==================== */}

      {/* Modal 1: Famille (Create / Edit) */}
      <AnimatePresence>
        {isFamilleModalOpen && (
          <div className="fixed inset-0 bg-black/50 backdrop-blur-md z-[100] flex items-center justify-center p-4">
            <motion.div
              initial={{ scale: 0.95, opacity: 0 }}
              animate={{ scale: 1, opacity: 1 }}
              exit={{ scale: 0.95, opacity: 0 }}
              className="glass-card-premium w-full max-w-lg p-8 relative overflow-hidden border border-white/20 dark:border-white/5"
            >
              <div className="flex justify-between items-center mb-6">
                <div className="flex items-center gap-2">
                  <Sparkles className="w-5 h-5 text-accent-light animate-pulse" />
                  <h3 className="text-2xl font-bold text-text-primary-light dark:text-text-primary-dark">
                    {editingFamille ? "Modifier la Famille" : "Nouvelle Famille"}
                  </h3>
                </div>
                <button
                  onClick={() => setIsFamilleModalOpen(false)}
                  className="p-1.5 rounded-xl hover:bg-black/5 dark:hover:bg-white/5 text-text-secondary-light dark:text-text-secondary-dark transition-colors"
                >
                  <X size={20} />
                </button>
              </div>

              <form onSubmit={handleSaveFamille} className="space-y-4">
                <div className="space-y-1">
                  <label className="text-xs font-semibold text-text-primary-light dark:text-text-primary-dark uppercase tracking-wider ml-1">
                    Nom de la famille
                  </label>
                  <input
                    type="text"
                    value={familleNom}
                    onChange={(e) => setFamilleNom(e.target.value)}
                    required
                    placeholder="Entrées, Plats, Desserts, Cocktails..."
                    className="w-full px-4 py-3 bg-white/5 border border-white/10 rounded-2xl focus:outline-none focus:ring-2 focus:ring-accent-light/50 focus:border-accent-light transition-all text-text-primary-light dark:text-text-primary-dark text-sm"
                  />
                </div>

                <div className="space-y-1">
                  <label className="text-xs font-semibold text-text-primary-light dark:text-text-primary-dark uppercase tracking-wider ml-1">
                    Ordre d'affichage
                  </label>
                  <input
                    type="number"
                    value={familleOrdre}
                    onChange={(e) => setFamilleOrdre(parseInt(e.target.value) || 0)}
                    placeholder="0"
                    className="w-full px-4 py-3 bg-white/5 border border-white/10 rounded-2xl focus:outline-none focus:ring-2 focus:ring-accent-light/50 focus:border-accent-light transition-all text-text-primary-light dark:text-text-primary-dark text-sm"
                  />
                </div>

                <div className="flex gap-4 pt-4">
                  <button
                    type="button"
                    onClick={() => setIsFamilleModalOpen(false)}
                    className="flex-1 py-3.5 glass-capsule rounded-2xl font-bold text-sm text-text-primary-light dark:text-text-primary-dark hover:scale-[1.02] transition-all"
                  >
                    Annuler
                  </button>
                  <button
                    type="submit"
                    disabled={submitting}
                    className="flex-1 py-3.5 bg-accent-light hover:bg-accent-dark text-white rounded-2xl font-bold text-sm flex items-center justify-center gap-2 shadow-lg hover:shadow-accent-light/20 transition-all hover:scale-[1.02] disabled:opacity-50"
                  >
                    {submitting ? <Loader2 className="w-5 h-5 animate-spin" /> : "Enregistrer"}
                  </button>
                </div>
              </form>
            </motion.div>
          </div>
        )}
      </AnimatePresence>

      {/* Modal 2: Upload Image */}
      <AnimatePresence>
        {isUploadModalOpen && (
          <div className="fixed inset-0 bg-black/50 backdrop-blur-md z-[100] flex items-center justify-center p-4">
            <motion.div
              initial={{ scale: 0.95, opacity: 0 }}
              animate={{ scale: 1, opacity: 1 }}
              exit={{ scale: 0.95, opacity: 0 }}
              className="glass-card-premium w-full max-w-lg p-8 relative overflow-hidden border border-white/20 dark:border-white/5"
            >
              <div className="flex justify-between items-center mb-6">
                <div className="flex items-center gap-2">
                  <Upload className="w-5 h-5 text-accent-light" />
                  <h3 className="text-2xl font-bold text-text-primary-light dark:text-text-primary-dark">
                    Ajouter une Image
                  </h3>
                </div>
                <button
                  onClick={() => setIsUploadModalOpen(false)}
                  className="p-1.5 rounded-xl hover:bg-black/5 dark:hover:bg-white/5 text-text-secondary-light dark:text-text-secondary-dark transition-colors"
                >
                  <X size={20} />
                </button>
              </div>

              <form onSubmit={handleUploadImage} className="space-y-4">
                <div className="space-y-1">
                  <label className="text-xs font-semibold text-text-primary-light dark:text-text-primary-dark uppercase tracking-wider ml-1">
                    Sélectionner la Famille
                  </label>
                  <select
                    value={selectedFamilleForUpload}
                    onChange={(e) => setSelectedFamilleForUpload(e.target.value)}
                    required
                    className="w-full px-4 py-3 bg-white/5 border border-white/10 rounded-2xl focus:outline-none focus:ring-2 focus:ring-accent-light/50 focus:border-accent-light transition-all text-text-primary-light dark:text-text-primary-dark text-sm"
                  >
                    <option value="" className="bg-slate-900 text-white">-- Choisir une famille --</option>
                    {familles.map((f) => (
                      <option key={f.id} value={f.id} className="bg-slate-900 text-white">
                        {f.nom}
                      </option>
                    ))}
                  </select>
                </div>

                <div className="space-y-1">
                  <label className="text-xs font-semibold text-text-primary-light dark:text-text-primary-dark uppercase tracking-wider ml-1">
                    Fichier Image (Fichier local)
                  </label>
                  <input
                    type="file"
                    accept="image/*"
                    onChange={(e) => setUploadFile(e.target.files?.[0] || null)}
                    required
                    className="w-full px-4 py-3 bg-white/5 border border-white/10 rounded-2xl focus:outline-none focus:ring-2 focus:ring-accent-light/50 focus:border-accent-light transition-all text-text-primary-light dark:text-text-primary-dark text-sm"
                  />
                </div>

                <div className="space-y-1">
                  <label className="text-xs font-semibold text-text-primary-light dark:text-text-primary-dark uppercase tracking-wider ml-1">
                    Ordre
                  </label>
                  <input
                    type="number"
                    value={uploadOrdre}
                    onChange={(e) => setUploadOrdre(parseInt(e.target.value) || 0)}
                    placeholder="0"
                    className="w-full px-4 py-3 bg-white/5 border border-white/10 rounded-2xl focus:outline-none focus:ring-2 focus:ring-accent-light/50 focus:border-accent-light transition-all text-text-primary-light dark:text-text-primary-dark text-sm"
                  />
                </div>

                <div className="flex gap-4 pt-4">
                  <button
                    type="button"
                    onClick={() => setIsUploadModalOpen(false)}
                    className="flex-1 py-3.5 glass-capsule rounded-2xl font-bold text-sm text-text-primary-light dark:text-text-primary-dark hover:scale-[1.02] transition-all"
                  >
                    Annuler
                  </button>
                  <button
                    type="submit"
                    disabled={submitting}
                    className="flex-1 py-3.5 bg-accent-light hover:bg-accent-dark text-white rounded-2xl font-bold text-sm flex items-center justify-center gap-2 shadow-lg hover:shadow-accent-light/20 transition-all hover:scale-[1.02] disabled:opacity-50"
                  >
                    {submitting ? <Loader2 className="w-5 h-5 animate-spin" /> : "Téléverser"}
                  </button>
                </div>
              </form>
            </motion.div>
          </div>
        )}
      </AnimatePresence>

      {/* Modal 3: Edit Image */}
      <AnimatePresence>
        {isEditImageModalOpen && editingImage && (
          <div className="fixed inset-0 bg-black/50 backdrop-blur-md z-[100] flex items-center justify-center p-4">
            <motion.div
              initial={{ scale: 0.95, opacity: 0 }}
              animate={{ scale: 1, opacity: 1 }}
              exit={{ scale: 0.95, opacity: 0 }}
              className="glass-card-premium w-full max-w-lg p-8 relative overflow-hidden border border-white/20 dark:border-white/5"
            >
              <div className="flex justify-between items-center mb-6">
                <div className="flex items-center gap-2">
                  <Edit2 className="w-5 h-5 text-accent-light" />
                  <h3 className="text-2xl font-bold text-text-primary-light dark:text-text-primary-dark">
                    Modifier / Remplacer L'Image
                  </h3>
                </div>
                <button
                  onClick={() => setIsEditImageModalOpen(false)}
                  className="p-1.5 rounded-xl hover:bg-black/5 dark:hover:bg-white/5 text-text-secondary-light dark:text-text-secondary-dark transition-colors"
                >
                  <X size={20} />
                </button>
              </div>

              <form onSubmit={handleEditImage} className="space-y-4">
                <div className="space-y-1">
                  <label className="text-xs font-semibold text-text-primary-light dark:text-text-primary-dark uppercase tracking-wider ml-1">
                    Nouveau Fichier Image (Optionnel - Laisser vide pour conserver l'image)
                  </label>
                  <input
                    type="file"
                    accept="image/*"
                    onChange={(e) => setEditImageFile(e.target.files?.[0] || null)}
                    className="w-full px-4 py-3 bg-white/5 border border-white/10 rounded-2xl focus:outline-none focus:ring-2 focus:ring-accent-light/50 focus:border-accent-light transition-all text-text-primary-light dark:text-text-primary-dark text-sm"
                  />
                </div>

                <div className="space-y-1">
                  <label className="text-xs font-semibold text-text-primary-light dark:text-text-primary-dark uppercase tracking-wider ml-1">
                    Ordre
                  </label>
                  <input
                    type="number"
                    value={editImageOrdre}
                    onChange={(e) => setEditImageOrdre(parseInt(e.target.value) || 0)}
                    placeholder="0"
                    className="w-full px-4 py-3 bg-white/5 border border-white/10 rounded-2xl focus:outline-none focus:ring-2 focus:ring-accent-light/50 focus:border-accent-light transition-all text-text-primary-light dark:text-text-primary-dark text-sm"
                  />
                </div>

                <div className="flex gap-4 pt-4">
                  <button
                    type="button"
                    onClick={() => setIsEditImageModalOpen(false)}
                    className="flex-1 py-3.5 glass-capsule rounded-2xl font-bold text-sm text-text-primary-light dark:text-text-primary-dark hover:scale-[1.02] transition-all"
                  >
                    Annuler
                  </button>
                  <button
                    type="submit"
                    disabled={submitting}
                    className="flex-1 py-3.5 bg-accent-light hover:bg-accent-dark text-white rounded-2xl font-bold text-sm flex items-center justify-center gap-2 shadow-lg hover:shadow-accent-light/20 transition-all hover:scale-[1.02] disabled:opacity-50"
                  >
                    {submitting ? <Loader2 className="w-5 h-5 animate-spin" /> : "Mettre à jour"}
                  </button>
                </div>
              </form>
            </motion.div>
          </div>
        )}
      </AnimatePresence>

      {/* Modal 3.5: Categorie (Create / Edit) */}
      <AnimatePresence>
        {isCategorieModalOpen && (
          <div className="fixed inset-0 bg-black/50 backdrop-blur-md z-[100] flex items-center justify-center p-4">
            <motion.div
              initial={{ scale: 0.95, opacity: 0 }}
              animate={{ scale: 1, opacity: 1 }}
              exit={{ scale: 0.95, opacity: 0 }}
              className="glass-card-premium w-full max-w-lg p-8 relative overflow-hidden border border-white/20 dark:border-white/5"
            >
              <div className="flex justify-between items-center mb-6">
                <div className="flex items-center gap-2">
                  <Sparkles className="w-5 h-5 text-accent-light" />
                  <h3 className="text-2xl font-bold text-text-primary-light dark:text-text-primary-dark">
                    {editingCategorie ? "Modifier la Catégorie" : "Nouvelle Catégorie"}
                  </h3>
                </div>
                <button
                  onClick={() => setIsCategorieModalOpen(false)}
                  className="p-1.5 rounded-xl hover:bg-black/5 dark:hover:bg-white/5 text-text-secondary-light dark:text-text-secondary-dark transition-colors"
                >
                  <X size={20} />
                </button>
              </div>

              <form onSubmit={handleSaveCategorie} className="space-y-4">
                <div className="space-y-1">
                  <label className="text-xs font-semibold text-text-primary-light dark:text-text-primary-dark uppercase tracking-wider ml-1">
                    Nom de la catégorie
                  </label>
                  <select
                    value={categorieNom}
                    onChange={(e) => setCategorieNom(e.target.value)}
                    required
                    disabled={loadingCategoryNoms}
                    className="w-full px-4 py-3 bg-white/5 border border-white/10 rounded-2xl focus:outline-none focus:ring-2 focus:ring-accent-light/50 focus:border-accent-light transition-all text-text-primary-light dark:text-text-primary-dark text-sm disabled:opacity-50"
                  >
                    <option value="" className="bg-slate-900 text-white">
                      {loadingCategoryNoms ? "Chargement des catégories..." : "-- Sélectionner une catégorie --"}
                    </option>
                    {/* Unique Enum values loaded dynamically from GET /menus/categories/noms */}
                    {Array.from(
                      new Set(
                        categoryNoms
                          .filter(Boolean)
                      )
                    ).map((nomCat) => (
                      <option key={nomCat} value={nomCat} className="bg-slate-900 text-white">
                        {nomCat}
                      </option>
                    ))}
                  </select>
                </div>

                <div className="space-y-1">
                  <label className="text-xs font-semibold text-text-primary-light dark:text-text-primary-dark uppercase tracking-wider ml-1">
                    Famille de menu
                  </label>
                  <select
                    value={categorieFamilleId}
                    onChange={(e) => setCategorieFamilleId(e.target.value)}
                    required
                    className="w-full px-4 py-3 bg-white/5 border border-white/10 rounded-2xl focus:outline-none focus:ring-2 focus:ring-accent-light/50 focus:border-accent-light transition-all text-text-primary-light dark:text-text-primary-dark text-sm"
                  >
                    <option value="" className="bg-slate-900 text-white">-- Choisir parmi les familles existantes --</option>
                    {familles.map((f) => (
                      <option key={f.id} value={f.id} className="bg-slate-900 text-white">
                        {f.nom}
                      </option>
                    ))}
                  </select>
                </div>

                <div className="space-y-1">
                  <label className="text-xs font-semibold text-text-primary-light dark:text-text-primary-dark uppercase tracking-wider ml-1">
                    Ordre d'affichage
                  </label>
                  <input
                    type="number"
                    value={categorieOrdre}
                    onChange={(e) => setCategorieOrdre(parseInt(e.target.value) || 0)}
                    placeholder="0"
                    className="w-full px-4 py-3 bg-white/5 border border-white/10 rounded-2xl focus:outline-none focus:ring-2 focus:ring-accent-light/50 focus:border-accent-light transition-all text-text-primary-light dark:text-text-primary-dark text-sm"
                  />
                </div>

                <div className="flex gap-4 pt-4">
                  <button
                    type="button"
                    onClick={() => setIsCategorieModalOpen(false)}
                    className="flex-1 py-3.5 glass-capsule rounded-2xl font-bold text-sm text-text-primary-light dark:text-text-primary-dark hover:scale-[1.02] transition-all"
                  >
                    Annuler
                  </button>
                  <button
                    type="submit"
                    disabled={submitting}
                    className="flex-1 py-3.5 bg-accent-light hover:bg-accent-dark text-white rounded-2xl font-bold text-sm flex items-center justify-center gap-2 shadow-lg hover:shadow-accent-light/20 transition-all hover:scale-[1.02] disabled:opacity-50"
                  >
                    {submitting ? <Loader2 className="w-5 h-5 animate-spin" /> : "Enregistrer"}
                  </button>
                </div>
              </form>
            </motion.div>
          </div>
        )}
      </AnimatePresence>

      {/* Modal 4: Repas au Menu (Create / Edit) */}
      <AnimatePresence>
        {isRepasModalOpen && (
          <div className="fixed inset-0 bg-black/50 backdrop-blur-md z-[100] flex items-center justify-center p-4">
            <motion.div
              initial={{ scale: 0.95, opacity: 0 }}
              animate={{ scale: 1, opacity: 1 }}
              exit={{ scale: 0.95, opacity: 0 }}
              className="glass-card-premium w-full max-w-lg p-8 relative overflow-hidden border border-white/20 dark:border-white/5"
            >
              <div className="flex justify-between items-center mb-6">
                <div className="flex items-center gap-2">
                  <Utensils className="w-5 h-5 text-accent-light" />
                  <h3 className="text-2xl font-bold text-text-primary-light dark:text-text-primary-dark">
                    {editingMenuRepas ? "Modifier Plat du Menu" : "Ajouter un Plat au Menu"}
                  </h3>
                </div>
                <button
                  onClick={() => setIsRepasModalOpen(false)}
                  className="p-1.5 rounded-xl hover:bg-black/5 dark:hover:bg-white/5 text-text-secondary-light dark:text-text-secondary-dark transition-colors"
                >
                  <X size={20} />
                </button>
              </div>

              <form onSubmit={handleSaveMenuRepas} className="space-y-4">
                <div className="space-y-1">
                  <label className="text-xs font-semibold text-text-primary-light dark:text-text-primary-dark uppercase tracking-wider ml-1">
                    Sélectionner un Repas existant
                  </label>
                  <select
                    value={selectedRepasId}
                    onChange={(e) => setSelectedRepasId(e.target.value)}
                    required
                    disabled={!!editingMenuRepas}
                    className="w-full px-4 py-3 bg-white/5 border border-white/10 rounded-2xl focus:outline-none focus:ring-2 focus:ring-accent-light/50 focus:border-accent-light transition-all text-text-primary-light dark:text-text-primary-dark text-sm disabled:opacity-60"
                  >
                    <option value="" className="bg-slate-900 text-white">-- Choisir parmi les repas du restaurant --</option>
                    {allRestaurantRepas.map((r) => (
                      <option key={r.id} value={r.id} className="bg-slate-900 text-white">
                        {r.nomRepas} ({r.prix ? `${r.prix.toLocaleString()} F CFA` : 'S/P'})
                      </option>
                    ))}
                  </select>
                </div>

                <div className="space-y-1">
                  <label className="text-xs font-semibold text-text-primary-light dark:text-text-primary-dark uppercase tracking-wider ml-1">
                    Catégorie du Menu
                  </label>
                  <select
                    value={selectedCategorieId}
                    onChange={(e) => setSelectedCategorieId(e.target.value)}
                    required
                    className="w-full px-4 py-3 bg-white/5 border border-white/10 rounded-2xl focus:outline-none focus:ring-2 focus:ring-accent-light/50 focus:border-accent-light transition-all text-text-primary-light dark:text-text-primary-dark text-sm"
                  >
                    <option value="" className="bg-slate-900 text-white">-- Choisir dans les catégories de la liste --</option>
                    {categories.map((cat, idx) => {
                      const catId = typeof cat === "string" ? cat : (cat?.id || cat?.nom || cat?.name || "");
                      const catNom = typeof cat === "string" ? cat : (cat?.nom || cat?.name || cat?.id || `Catégorie ${idx + 1}`);

                      let familleNom = "";
                      if (typeof cat === "object" && cat !== null) {
                        familleNom =
                          cat.familleNom ||
                          cat.famille_nom ||
                          (typeof cat.famille === "object" ? cat.famille?.nom : typeof cat.famille === "string" ? cat.famille : "") ||
                          "";

                        if (!familleNom) {
                          const targetFamId = cat.familleId || cat.famille_id || cat.menuFamilleId || cat.menu_famille_id;
                          const matchedFam = familles.find((f) => f.id === targetFamId);
                          if (matchedFam) familleNom = matchedFam.nom;
                        }
                      }

                      if (!familleNom) {
                        const matchedFam = familles.find((f) => f.id === catId);
                        if (matchedFam) familleNom = matchedFam.nom;
                      }

                      const displayText = familleNom ? `${catNom} — ${familleNom}` : catNom;

                      return (
                        <option key={catId || idx} value={catId} className="bg-slate-900 text-white">
                          {displayText}
                        </option>
                      );
                    })}
                  </select>
                </div>

                <div className="space-y-1">
                  <label className="text-xs font-semibold text-text-primary-light dark:text-text-primary-dark uppercase tracking-wider ml-1">
                    Ordre d'affichage
                  </label>
                  <input
                    type="number"
                    value={repasOrdre}
                    onChange={(e) => setRepasOrdre(parseInt(e.target.value) || 0)}
                    placeholder="0"
                    className="w-full px-4 py-3 bg-white/5 border border-white/10 rounded-2xl focus:outline-none focus:ring-2 focus:ring-accent-light/50 focus:border-accent-light transition-all text-text-primary-light dark:text-text-primary-dark text-sm"
                  />
                </div>

                <div className="flex gap-4 pt-4">
                  <button
                    type="button"
                    onClick={() => setIsRepasModalOpen(false)}
                    className="flex-1 py-3.5 glass-capsule rounded-2xl font-bold text-sm text-text-primary-light dark:text-text-primary-dark hover:scale-[1.02] transition-all"
                  >
                    Annuler
                  </button>
                  <button
                    type="submit"
                    disabled={submitting}
                    className="flex-1 py-3.5 bg-accent-light hover:bg-accent-dark text-white rounded-2xl font-bold text-sm flex items-center justify-center gap-2 shadow-lg hover:shadow-accent-light/20 transition-all hover:scale-[1.02] disabled:opacity-50"
                  >
                    {submitting ? <Loader2 className="w-5 h-5 animate-spin" /> : "Enregistrer"}
                  </button>
                </div>
              </form>
            </motion.div>
          </div>
        )}
      </AnimatePresence>

      {/* Modal 5: Famille de Boissons (Create / Edit) */}
      <AnimatePresence>
        {isBoissonFamilleModalOpen && (
          <div className="fixed inset-0 bg-black/50 backdrop-blur-md z-[100] flex items-center justify-center p-4">
            <motion.div
              initial={{ scale: 0.95, opacity: 0 }}
              animate={{ scale: 1, opacity: 1 }}
              exit={{ scale: 0.95, opacity: 0 }}
              className="glass-card-premium w-full max-w-lg p-8 relative overflow-hidden border border-white/20 dark:border-white/5"
            >
              <div className="flex justify-between items-center mb-6">
                <div className="flex items-center gap-2">
                  <FolderPlus className="w-5 h-5 text-accent-light" />
                  <h3 className="text-2xl font-bold text-text-primary-light dark:text-text-primary-dark">
                    {editingBoissonFamille ? "Modifier Famille de Boissons" : "Nouvelle Famille de Boissons"}
                  </h3>
                </div>
                <button
                  onClick={() => setIsBoissonFamilleModalOpen(false)}
                  className="p-1.5 rounded-xl hover:bg-black/5 dark:hover:bg-white/5 text-text-secondary-light dark:text-text-secondary-dark transition-colors"
                >
                  <X size={20} />
                </button>
              </div>

              <form onSubmit={handleSaveBoissonFamille} className="space-y-4">
                <div className="space-y-1">
                  <label className="text-xs font-semibold text-text-primary-light dark:text-text-primary-dark uppercase tracking-wider ml-1">
                    Nom de la famille de boissons
                  </label>
                  <input
                    type="text"
                    value={boissonFamilleNom}
                    onChange={(e) => setBoissonFamilleNom(e.target.value)}
                    required
                    placeholder="Ex: Nos boissons en bouteille, Nos boissons importées..."
                    className="w-full px-4 py-3 bg-white/5 border border-white/10 rounded-2xl focus:outline-none focus:ring-2 focus:ring-accent-light/50 focus:border-accent-light transition-all text-text-primary-light dark:text-text-primary-dark text-sm"
                  />
                </div>

                <div className="flex gap-4 pt-4">
                  <button
                    type="button"
                    onClick={() => setIsBoissonFamilleModalOpen(false)}
                    className="flex-1 py-3.5 glass-capsule rounded-2xl font-bold text-sm text-text-primary-light dark:text-text-primary-dark hover:scale-[1.02] transition-all"
                  >
                    Annuler
                  </button>
                  <button
                    type="submit"
                    disabled={submitting}
                    className="flex-1 py-3.5 bg-accent-light hover:bg-accent-dark text-white rounded-2xl font-bold text-sm flex items-center justify-center gap-2 shadow-lg hover:shadow-accent-light/20 transition-all hover:scale-[1.02] disabled:opacity-50"
                  >
                    {submitting ? <Loader2 className="w-5 h-5 animate-spin" /> : "Enregistrer"}
                  </button>
                </div>
              </form>
            </motion.div>
          </div>
        )}
      </AnimatePresence>

      {/* Modal 6: Upload Image de Famille de Boissons */}
      <AnimatePresence>
        {isBoissonImageUploadModalOpen && (
          <div className="fixed inset-0 bg-black/50 backdrop-blur-md z-[100] flex items-center justify-center p-4">
            <motion.div
              initial={{ scale: 0.95, opacity: 0 }}
              animate={{ scale: 1, opacity: 1 }}
              exit={{ scale: 0.95, opacity: 0 }}
              className="glass-card-premium w-full max-w-lg p-8 relative overflow-hidden border border-white/20 dark:border-white/5"
            >
              <div className="flex justify-between items-center mb-6">
                <div className="flex items-center gap-2">
                  <Upload className="w-5 h-5 text-accent-light" />
                  <h3 className="text-2xl font-bold text-text-primary-light dark:text-text-primary-dark">
                    Ajouter une Image (Famille Boissons)
                  </h3>
                </div>
                <button
                  onClick={() => setIsBoissonImageUploadModalOpen(false)}
                  className="p-1.5 rounded-xl hover:bg-black/5 dark:hover:bg-white/5 text-text-secondary-light dark:text-text-secondary-dark transition-colors"
                >
                  <X size={20} />
                </button>
              </div>

              <form onSubmit={handleUploadBoissonFamilleImage} className="space-y-4">
                <div className="space-y-1">
                  <label className="text-xs font-semibold text-text-primary-light dark:text-text-primary-dark uppercase tracking-wider ml-1">
                    Famille de Boissons
                  </label>
                  <select
                    value={selectedBoissonFamilleForUpload}
                    onChange={(e) => setSelectedBoissonFamilleForUpload(e.target.value)}
                    required
                    className="w-full px-4 py-3 bg-white/5 border border-white/10 rounded-2xl focus:outline-none focus:ring-2 focus:ring-accent-light/50 focus:border-accent-light transition-all text-text-primary-light dark:text-text-primary-dark text-sm"
                  >
                    <option value="" className="bg-slate-900 text-white">-- Choisir une famille --</option>
                    {boissonFamilles.map((f) => (
                      <option key={f.id} value={f.id} className="bg-slate-900 text-white">
                        {f.nom} ({(f.images?.length ?? 0)}/3 images)
                      </option>
                    ))}
                  </select>
                </div>

                <div className="space-y-1">
                  <label className="text-xs font-semibold text-text-primary-light dark:text-text-primary-dark uppercase tracking-wider ml-1">
                    Fichier Image
                  </label>
                  <input
                    type="file"
                    accept="image/*"
                    onChange={(e) => setBoissonImageFile(e.target.files?.[0] || null)}
                    required
                    className="w-full px-4 py-3 bg-white/5 border border-white/10 rounded-2xl focus:outline-none focus:ring-2 focus:ring-accent-light/50 focus:border-accent-light transition-all text-text-primary-light dark:text-text-primary-dark text-sm"
                  />
                </div>

                <div className="flex gap-4 pt-4">
                  <button
                    type="button"
                    onClick={() => setIsBoissonImageUploadModalOpen(false)}
                    className="flex-1 py-3.5 glass-capsule rounded-2xl font-bold text-sm text-text-primary-light dark:text-text-primary-dark hover:scale-[1.02] transition-all"
                  >
                    Annuler
                  </button>
                  <button
                    type="submit"
                    disabled={submitting}
                    className="flex-1 py-3.5 bg-accent-light hover:bg-accent-dark text-white rounded-2xl font-bold text-sm flex items-center justify-center gap-2 shadow-lg hover:shadow-accent-light/20 transition-all hover:scale-[1.02] disabled:opacity-50"
                  >
                    {submitting ? <Loader2 className="w-5 h-5 animate-spin" /> : "Téléverser"}
                  </button>
                </div>
              </form>
            </motion.div>
          </div>
        )}
      </AnimatePresence>

      {/* Modal 7: Boisson au Menu (Create / Edit Association) */}
      <AnimatePresence>
        {isBoissonModalOpen && (
          <div className="fixed inset-0 bg-black/50 backdrop-blur-md z-[100] flex items-center justify-center p-4">
            <motion.div
              initial={{ scale: 0.95, opacity: 0 }}
              animate={{ scale: 1, opacity: 1 }}
              exit={{ scale: 0.95, opacity: 0 }}
              className="glass-card-premium w-full max-w-lg p-8 relative overflow-hidden border border-white/20 dark:border-white/5"
            >
              <div className="flex justify-between items-center mb-6">
                <div className="flex items-center gap-2">
                  <Wine className="w-5 h-5 text-accent-light" />
                  <h3 className="text-2xl font-bold text-text-primary-light dark:text-text-primary-dark">
                    {editingMenuBoisson ? "Modifier l'association de Boisson" : "Ajouter une Boisson à la famille"}
                  </h3>
                </div>
                <button
                  onClick={() => setIsBoissonModalOpen(false)}
                  className="p-1.5 rounded-xl hover:bg-black/5 dark:hover:bg-white/5 text-text-secondary-light dark:text-text-secondary-dark transition-colors"
                >
                  <X size={20} />
                </button>
              </div>

              <form onSubmit={handleSaveMenuBoisson} className="space-y-4">
                <div className="space-y-1">
                  <label className="text-xs font-semibold text-text-primary-light dark:text-text-primary-dark uppercase tracking-wider ml-1">
                    Famille de Boissons
                  </label>
                  <select
                    value={selectedBoissonFamilleId}
                    onChange={(e) => setSelectedBoissonFamilleId(e.target.value)}
                    required
                    className="w-full px-4 py-3 bg-white/5 border border-white/10 rounded-2xl focus:outline-none focus:ring-2 focus:ring-accent-light/50 focus:border-accent-light transition-all text-text-primary-light dark:text-text-primary-dark text-sm"
                  >
                    <option value="" className="bg-slate-900 text-white">-- Choisir la famille destination --</option>
                    {boissonFamilles.map((f) => (
                      <option key={f.id} value={f.id} className="bg-slate-900 text-white">
                        {f.nom}
                      </option>
                    ))}
                  </select>
                </div>

                <div className="space-y-1">
                  <label className="text-xs font-semibold text-text-primary-light dark:text-text-primary-dark uppercase tracking-wider ml-1">
                    Sélectionner une Boisson existante
                  </label>
                  <select
                    value={selectedBoissonId}
                    onChange={(e) => setSelectedBoissonId(e.target.value)}
                    required
                    disabled={!!editingMenuBoisson}
                    className="w-full px-4 py-3 bg-white/5 border border-white/10 rounded-2xl focus:outline-none focus:ring-2 focus:ring-accent-light/50 focus:border-accent-light transition-all text-text-primary-light dark:text-text-primary-dark text-sm disabled:opacity-60"
                  >
                    <option value="" className="bg-slate-900 text-white">-- Choisir parmi les boissons du restaurant --</option>
                    {allRestaurantBoissons.map((b) => (
                      <option key={b.id} value={b.id} className="bg-slate-900 text-white">
                        {b.nomBoisson} ({b.prix ? `${b.prix.toLocaleString()} F CFA` : 'S/P'})
                      </option>
                    ))}
                  </select>
                </div>

                <div className="flex gap-4 pt-4">
                  <button
                    type="button"
                    onClick={() => setIsBoissonModalOpen(false)}
                    className="flex-1 py-3.5 glass-capsule rounded-2xl font-bold text-sm text-text-primary-light dark:text-text-primary-dark hover:scale-[1.02] transition-all"
                  >
                    Annuler
                  </button>
                  <button
                    type="submit"
                    disabled={submitting}
                    className="flex-1 py-3.5 bg-accent-light hover:bg-accent-dark text-white rounded-2xl font-bold text-sm flex items-center justify-center gap-2 shadow-lg hover:shadow-accent-light/20 transition-all hover:scale-[1.02] disabled:opacity-50"
                  >
                    {submitting ? <Loader2 className="w-5 h-5 animate-spin" /> : "Enregistrer"}
                  </button>
                </div>
              </form>
            </motion.div>
          </div>
        )}
      </AnimatePresence>
    </div>
  );
};
