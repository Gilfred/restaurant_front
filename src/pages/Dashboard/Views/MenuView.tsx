import React, { useState, useEffect } from "react";
import { motion, AnimatePresence } from "framer-motion";
import { useNavigate } from "react-router-dom";
import {
  Plus,
  Trash2,
  Edit2,
  Upload,
  BookOpen,
  CheckCircle2,
  X,
  Loader2,
  FolderPlus,
  Utensils,
  Wine,
  Layers,
  Sparkles,
  Image as ImageIcon
} from "lucide-react";
import {
  listFamilles,
  createFamille,
  updateFamille,
  deleteFamille,
  uploadMenuImage,
  deleteFamilleImage,
  listAvailableCategories,
  createMenuRepas,
  createMenuBoisson
} from "../../../services/menu.service";
import { listRepas } from "../../../services/repas.service";
import { listBoissons } from "../../../services/boisson.service";
import type {
  MenuFamille,
  MenuFamilleCreate,
  MenuFamilleUpdate
} from "../../../types/menu";
import type { RepasResponse } from "../../../types/repas";
import type { BoissonResponse } from "../../../types/boisson";

export const MenuView: React.FC = () => {
  const navigate = useNavigate();

  // Active sub-tab in Menu Management View
  const [activeTab, setActiveTab] = useState<"familles" | "repas" | "boissons">("familles");

  // Data state
  const [familles, setFamilles] = useState<MenuFamille[]>([]);
  const [categories, setCategories] = useState<string[]>([]);
  const [availableRepas, setAvailableRepas] = useState<RepasResponse[]>([]);
  const [availableBoissons, setAvailableBoissons] = useState<BoissonResponse[]>([]);

  // Feedback states
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [success, setSuccess] = useState<string | null>(null);

  // Modal states
  const [isFamilleModalOpen, setIsFamilleModalOpen] = useState(false);
  const [editingFamille, setEditingFamille] = useState<MenuFamille | null>(null);
  const [familleNom, setFamilleNom] = useState("");
  const [familleOrdre, setFamilleOrdre] = useState<number>(0);

  const [isUploadModalOpen, setIsUploadModalOpen] = useState(false);
  const [selectedFamilleForUpload, setSelectedFamilleForUpload] = useState<string>("");
  const [uploadFile, setUploadFile] = useState<File | null>(null);
  const [uploadOrdre, setUploadOrdre] = useState<number>(0);

  const [isRepasModalOpen, setIsRepasModalOpen] = useState(false);
  const [selectedRepasId, setSelectedRepasId] = useState<string>("");
  const [selectedCategorieId, setSelectedCategorieId] = useState<string>("");
  const [repasOrdre, setRepasOrdre] = useState<number>(0);

  const [isBoissonModalOpen, setIsBoissonModalOpen] = useState(false);
  const [selectedBoissonId, setSelectedBoissonId] = useState<string>("");
  const [boissonImageUrl, setBoissonImageUrl] = useState<string>("");
  const [boissonOrdre, setBoissonOrdre] = useState<number>(0);

  const [submitting, setSubmitting] = useState(false);

  // Fetch initial data
  const fetchData = async () => {
    try {
      setLoading(true);
      setError(null);

      const [famillesRes, categoriesRes, repasRes, boissonsRes] = await Promise.allSettled([
        listFamilles(),
        listAvailableCategories(),
        listRepas(),
        listBoissons()
      ]);

      if (famillesRes.status === "fulfilled") setFamilles(famillesRes.value.data);
      if (categoriesRes.status === "fulfilled") setCategories(categoriesRes.value.data);
      if (repasRes.status === "fulfilled") setAvailableRepas(repasRes.value.data);
      if (boissonsRes.status === "fulfilled") setAvailableBoissons(boissonsRes.value.data);

    } catch (err: any) {
      console.error(err);
      setError("Impossible de charger les données du menu.");
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchData();
  }, []);

  // Famille handlers
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
      fetchData();
    } catch (err: any) {
      console.error(err);
      setError(err.response?.data?.detail?.[0]?.msg || err.response?.data?.detail || "Échec de l'enregistrement de la famille.");
    } finally {
      setSubmitting(false);
    }
  };

  const handleDeleteFamille = async (id: string) => {
    if (!window.confirm("Êtes-vous sûr de vouloir supprimer cette famille de menu ?")) return;
    try {
      await deleteFamille(id);
      setSuccess("Famille supprimée avec succès.");
      fetchData();
    } catch (err: any) {
      console.error(err);
      setError(err.response?.data?.detail || "Erreur lors de la suppression de la famille.");
    }
  };

  // Image Upload handler
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
      fetchData();
    } catch (err: any) {
      console.error(err);
      setError(err.response?.data?.detail || "Échec du téléversement de l'image.");
    } finally {
      setSubmitting(false);
    }
  };

  const handleDeleteImage = async (imageId: string) => {
    if (!window.confirm("Supprimer cette image du menu ?")) return;
    try {
      await deleteFamilleImage(imageId);
      setSuccess("Image supprimée avec succès.");
      fetchData();
    } catch (err: any) {
      console.error(err);
      setError("Erreur lors de la suppression de l'image.");
    }
  };

  // Repas handlers
  const handleCreateMenuRepas = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!selectedRepasId || !selectedCategorieId) {
      setError("Sélectionnez un repas et une catégorie.");
      return;
    }
    setSubmitting(true);
    setError(null);
    setSuccess(null);

    try {
      await createMenuRepas({
        repasId: selectedRepasId,
        menuCategorieId: selectedCategorieId,
        ordre: repasOrdre
      });
      setSuccess("Repas ajouté au menu avec succès !");
      setIsRepasModalOpen(false);
      setSelectedRepasId("");
      setSelectedCategorieId("");
      setRepasOrdre(0);
      fetchData();
    } catch (err: any) {
      console.error(err);
      setError(err.response?.data?.detail || "Échec de l'ajout du repas au menu.");
    } finally {
      setSubmitting(false);
    }
  };

  // Boisson handlers
  const handleCreateMenuBoisson = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!selectedBoissonId) {
      setError("Sélectionnez une boisson.");
      return;
    }
    setSubmitting(true);
    setError(null);
    setSuccess(null);

    try {
      await createMenuBoisson({
        boissonId: selectedBoissonId,
        imageUrl: boissonImageUrl || null,
        ordre: boissonOrdre
      });
      setSuccess("Boisson ajoutée au menu avec succès !");
      setIsBoissonModalOpen(false);
      setSelectedBoissonId("");
      setBoissonImageUrl("");
      setBoissonOrdre(0);
      fetchData();
    } catch (err: any) {
      console.error(err);
      setError(err.response?.data?.detail || "Échec de l'ajout de la boisson au menu.");
    } finally {
      setSubmitting(false);
    }
  };

  return (
    <div className="space-y-8">
      {/* Header & Main Actions */}
      <div className="flex flex-col md:flex-row items-stretch md:items-center justify-between gap-4">
        <div>
          <h2 className="text-3xl font-extrabold text-text-primary-light dark:text-text-primary-dark tracking-tight">
            Gestion du Menu
          </h2>
          <p className="text-text-secondary-light dark:text-text-secondary-dark mt-1">
            Organisez les familles, catégories, repas, boissons et images de votre carte.
          </p>
        </div>

        <div className="flex flex-wrap gap-3 items-center">
          <button
            onClick={() => navigate('/explore')}
            className="inline-flex items-center gap-2 px-5 py-3 glass-capsule border border-white/10 hover:border-accent-light/50 text-text-primary-light dark:text-text-primary-dark rounded-2xl font-bold transition-all active:scale-[0.98]"
          >
            <BookOpen size={18} className="text-accent-light" />
            Aperçu Public
          </button>

          <button
            onClick={() => {
              setEditingFamille(null);
              setFamilleNom("");
              setFamilleOrdre(0);
              setIsFamilleModalOpen(true);
            }}
            className="inline-flex items-center gap-2 px-5 py-3 bg-accent-light hover:bg-accent-dark text-white rounded-2xl font-bold transition-all shadow-lg hover:shadow-accent-light/20 active:scale-[0.98]"
          >
            <FolderPlus size={18} />
            Nouvelle Famille
          </button>

          <button
            onClick={() => {
              setIsUploadModalOpen(true);
            }}
            className="inline-flex items-center gap-2 px-5 py-3 glass-capsule border border-accent-light/30 hover:bg-accent-light/10 text-accent-light rounded-2xl font-bold transition-all active:scale-[0.98]"
          >
            <Upload size={18} />
            Téléverser Image
          </button>
        </div>
      </div>

      {error && (
        <div className="p-4 bg-red-500/10 border border-red-500/20 rounded-2xl text-red-500 text-sm font-medium">
          {error}
        </div>
      )}

      {success && (
        <div className="p-4 bg-green-500/10 border border-green-500/20 rounded-2xl text-green-500 text-sm font-medium flex items-center gap-2">
          <CheckCircle2 size={18} />
          {success}
        </div>
      )}

      {/* Tabs */}
      <div className="flex border-b border-black/10 dark:border-white/10 gap-6">
        <button
          onClick={() => setActiveTab("familles")}
          className={`pb-4 text-sm font-bold flex items-center gap-2 transition-colors relative ${
            activeTab === "familles"
              ? "text-accent-light border-b-2 border-accent-light"
              : "text-text-secondary-light dark:text-text-secondary-dark hover:text-text-primary-light dark:hover:text-text-primary-dark"
          }`}
        >
          <Layers size={18} />
          Familles & Images ({familles.length})
        </button>

        <button
          onClick={() => setActiveTab("repas")}
          className={`pb-4 text-sm font-bold flex items-center gap-2 transition-colors relative ${
            activeTab === "repas"
              ? "text-accent-light border-b-2 border-accent-light"
              : "text-text-secondary-light dark:text-text-secondary-dark hover:text-text-primary-light dark:hover:text-text-primary-dark"
          }`}
        >
          <Utensils size={18} />
          Repas au Menu
        </button>

        <button
          onClick={() => setActiveTab("boissons")}
          className={`pb-4 text-sm font-bold flex items-center gap-2 transition-colors relative ${
            activeTab === "boissons"
              ? "text-accent-light border-b-2 border-accent-light"
              : "text-text-secondary-light dark:text-text-secondary-dark hover:text-text-primary-light dark:hover:text-text-primary-dark"
          }`}
        >
          <Wine size={18} />
          Boissons au Menu
        </button>
      </div>

      {/* Content based on Active Tab */}
      {loading ? (
        <div className="flex items-center justify-center p-12">
          <Loader2 className="w-8 h-8 text-accent-light animate-spin" />
        </div>
      ) : activeTab === "familles" ? (
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

                {famille.images && famille.images.length > 0 ? (
                  <div className="grid grid-cols-2 gap-2 my-4">
                    {famille.images.map((img) => (
                      <div key={img.id} className="relative group/img rounded-xl overflow-hidden h-24 bg-black/20">
                        <img src={img.imageUrl} alt={famille.nom} className="w-full h-full object-cover" />
                        <button
                          onClick={() => handleDeleteImage(img.id)}
                          className="absolute top-1 right-1 p-1 bg-red-500/80 hover:bg-red-600 text-white rounded-lg opacity-0 group-hover/img:opacity-100 transition-opacity"
                          title="Supprimer cette image"
                        >
                          <Trash2 size={12} />
                        </button>
                      </div>
                    ))}
                  </div>
                ) : (
                  <div className="p-4 my-4 rounded-xl border border-dashed border-white/10 text-center text-xs text-text-secondary-light dark:text-text-secondary-dark flex items-center justify-center gap-2">
                    <ImageIcon size={16} />
                    Aucune image pour cette famille
                  </div>
                )}
              </div>

              <div className="flex items-center justify-end gap-2 pt-4 border-t border-black/5 dark:border-white/5">
                <button
                  onClick={() => {
                    setSelectedFamilleForUpload(famille.id);
                    setIsUploadModalOpen(true);
                  }}
                  className="p-2 rounded-xl glass-capsule text-accent-light hover:bg-accent-light/10 transition-colors"
                  title="Téléverser une image"
                >
                  <Upload size={16} />
                </button>
                <button
                  onClick={() => {
                    setEditingFamille(famille);
                    setFamilleNom(famille.nom);
                    setFamilleOrdre(famille.ordre);
                    setIsFamilleModalOpen(true);
                  }}
                  className="p-2 rounded-xl glass-capsule text-text-primary-light dark:text-text-primary-dark hover:bg-white/10 transition-colors"
                  title="Modifier"
                >
                  <Edit2 size={16} />
                </button>
                <button
                  onClick={() => handleDeleteFamille(famille.id)}
                  className="p-2 rounded-xl glass-capsule text-red-500 hover:bg-red-500/10 transition-colors"
                  title="Supprimer"
                >
                  <Trash2 size={16} />
                </button>
              </div>
            </motion.div>
          ))}

          {familles.length === 0 && (
            <div className="glass-card-premium p-12 text-center col-span-full">
              <Layers className="w-12 h-12 text-text-secondary-light dark:text-text-secondary-dark mx-auto mb-4 opacity-50" />
              <p className="text-text-secondary-light dark:text-text-secondary-dark font-medium">
                Aucune famille de menu configurée pour le moment.
              </p>
            </div>
          )}
        </div>
      ) : activeTab === "repas" ? (
        <div className="space-y-6">
          <div className="flex justify-between items-center">
            <h3 className="text-lg font-bold text-text-primary-light dark:text-text-primary-dark">
              Catégories & Plats au Menu
            </h3>
            <button
              onClick={() => setIsRepasModalOpen(true)}
              className="inline-flex items-center gap-2 px-4 py-2.5 bg-accent-light hover:bg-accent-dark text-white rounded-xl font-bold text-sm transition-all"
            >
              <Plus size={16} />
              Ajouter un plat au menu
            </button>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
            {availableRepas.map((repas) => (
              <div key={repas.id} className="glass-card-premium p-6 flex flex-col justify-between">
                <div>
                  <h4 className="text-lg font-bold text-text-primary-light dark:text-text-primary-dark mb-1">
                    {repas.nomRepas}
                  </h4>
                  <p className="text-sm font-semibold text-accent-light">
                    {repas.prix ? `${repas.prix.toLocaleString()} F CFA` : 'Prix non renseigné'}
                  </p>
                </div>
              </div>
            ))}
          </div>
        </div>
      ) : (
        <div className="space-y-6">
          <div className="flex justify-between items-center">
            <h3 className="text-lg font-bold text-text-primary-light dark:text-text-primary-dark">
              Boissons au Menu
            </h3>
            <button
              onClick={() => setIsBoissonModalOpen(true)}
              className="inline-flex items-center gap-2 px-4 py-2.5 bg-accent-light hover:bg-accent-dark text-white rounded-xl font-bold text-sm transition-all"
            >
              <Plus size={16} />
              Ajouter une boisson au menu
            </button>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
            {availableBoissons.map((boisson) => (
              <div key={boisson.id} className="glass-card-premium p-6 flex flex-col justify-between">
                <div>
                  <h4 className="text-lg font-bold text-text-primary-light dark:text-text-primary-dark mb-1">
                    {boisson.nomBoisson}
                  </h4>
                  <p className="text-sm font-semibold text-accent-light">
                    {boisson.prix ? `${boisson.prix.toLocaleString()} F CFA` : 'Prix non renseigné'}
                  </p>
                </div>
              </div>
            ))}
          </div>
        </div>
      )}

      {/* Modal Famille (Create/Edit) */}
      <AnimatePresence>
        {isFamilleModalOpen && (
          <div className="fixed inset-0 bg-black/40 backdrop-blur-md z-[100] flex items-center justify-center p-4">
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

      {/* Modal Upload Image */}
      <AnimatePresence>
        {isUploadModalOpen && (
          <div className="fixed inset-0 bg-black/40 backdrop-blur-md z-[100] flex items-center justify-center p-4">
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
                    Téléverser une Image
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
                    Fichier Image
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

      {/* Modal Add Repas to Menu */}
      <AnimatePresence>
        {isRepasModalOpen && (
          <div className="fixed inset-0 bg-black/40 backdrop-blur-md z-[100] flex items-center justify-center p-4">
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
                    Ajouter un Plat au Menu
                  </h3>
                </div>
                <button
                  onClick={() => setIsRepasModalOpen(false)}
                  className="p-1.5 rounded-xl hover:bg-black/5 dark:hover:bg-white/5 text-text-secondary-light dark:text-text-secondary-dark transition-colors"
                >
                  <X size={20} />
                </button>
              </div>

              <form onSubmit={handleCreateMenuRepas} className="space-y-4">
                <div className="space-y-1">
                  <label className="text-xs font-semibold text-text-primary-light dark:text-text-primary-dark uppercase tracking-wider ml-1">
                    Repas
                  </label>
                  <select
                    value={selectedRepasId}
                    onChange={(e) => setSelectedRepasId(e.target.value)}
                    required
                    className="w-full px-4 py-3 bg-white/5 border border-white/10 rounded-2xl focus:outline-none focus:ring-2 focus:ring-accent-light/50 focus:border-accent-light transition-all text-text-primary-light dark:text-text-primary-dark text-sm"
                  >
                    <option value="" className="bg-slate-900 text-white">-- Choisir un repas --</option>
                    {availableRepas.map((r) => (
                      <option key={r.id} value={r.id} className="bg-slate-900 text-white">
                        {r.nomRepas} ({r.prix ? `${r.prix} F CFA` : 'S/P'})
                      </option>
                    ))}
                  </select>
                </div>

                <div className="space-y-1">
                  <label className="text-xs font-semibold text-text-primary-light dark:text-text-primary-dark uppercase tracking-wider ml-1">
                    Catégorie
                  </label>
                  <select
                    value={selectedCategorieId}
                    onChange={(e) => setSelectedCategorieId(e.target.value)}
                    required
                    className="w-full px-4 py-3 bg-white/5 border border-white/10 rounded-2xl focus:outline-none focus:ring-2 focus:ring-accent-light/50 focus:border-accent-light transition-all text-text-primary-light dark:text-text-primary-dark text-sm"
                  >
                    <option value="" className="bg-slate-900 text-white">-- Choisir une catégorie --</option>
                    {categories.map((cat, idx) => (
                      <option key={idx} value={cat} className="bg-slate-900 text-white">
                        {cat}
                      </option>
                    ))}
                  </select>
                </div>

                <div className="space-y-1">
                  <label className="text-xs font-semibold text-text-primary-light dark:text-text-primary-dark uppercase tracking-wider ml-1">
                    Ordre
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
                    {submitting ? <Loader2 className="w-5 h-5 animate-spin" /> : "Ajouter"}
                  </button>
                </div>
              </form>
            </motion.div>
          </div>
        )}
      </AnimatePresence>

      {/* Modal Add Boisson to Menu */}
      <AnimatePresence>
        {isBoissonModalOpen && (
          <div className="fixed inset-0 bg-black/40 backdrop-blur-md z-[100] flex items-center justify-center p-4">
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
                    Ajouter une Boisson au Menu
                  </h3>
                </div>
                <button
                  onClick={() => setIsBoissonModalOpen(false)}
                  className="p-1.5 rounded-xl hover:bg-black/5 dark:hover:bg-white/5 text-text-secondary-light dark:text-text-secondary-dark transition-colors"
                >
                  <X size={20} />
                </button>
              </div>

              <form onSubmit={handleCreateMenuBoisson} className="space-y-4">
                <div className="space-y-1">
                  <label className="text-xs font-semibold text-text-primary-light dark:text-text-primary-dark uppercase tracking-wider ml-1">
                    Boisson
                  </label>
                  <select
                    value={selectedBoissonId}
                    onChange={(e) => setSelectedBoissonId(e.target.value)}
                    required
                    className="w-full px-4 py-3 bg-white/5 border border-white/10 rounded-2xl focus:outline-none focus:ring-2 focus:ring-accent-light/50 focus:border-accent-light transition-all text-text-primary-light dark:text-text-primary-dark text-sm"
                  >
                    <option value="" className="bg-slate-900 text-white">-- Choisir une boisson --</option>
                    {availableBoissons.map((b) => (
                      <option key={b.id} value={b.id} className="bg-slate-900 text-white">
                        {b.nomBoisson} ({b.prix ? `${b.prix} F CFA` : 'S/P'})
                      </option>
                    ))}
                  </select>
                </div>

                <div className="space-y-1">
                  <label className="text-xs font-semibold text-text-primary-light dark:text-text-primary-dark uppercase tracking-wider ml-1">
                    URL de l'image (Optionnel)
                  </label>
                  <input
                    type="url"
                    value={boissonImageUrl}
                    onChange={(e) => setBoissonImageUrl(e.target.value)}
                    placeholder="https://..."
                    className="w-full px-4 py-3 bg-white/5 border border-white/10 rounded-2xl focus:outline-none focus:ring-2 focus:ring-accent-light/50 focus:border-accent-light transition-all text-text-primary-light dark:text-text-primary-dark text-sm"
                  />
                </div>

                <div className="space-y-1">
                  <label className="text-xs font-semibold text-text-primary-light dark:text-text-primary-dark uppercase tracking-wider ml-1">
                    Ordre
                  </label>
                  <input
                    type="number"
                    value={boissonOrdre}
                    onChange={(e) => setBoissonOrdre(parseInt(e.target.value) || 0)}
                    placeholder="0"
                    className="w-full px-4 py-3 bg-white/5 border border-white/10 rounded-2xl focus:outline-none focus:ring-2 focus:ring-accent-light/50 focus:border-accent-light transition-all text-text-primary-light dark:text-text-primary-dark text-sm"
                  />
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
                    {submitting ? <Loader2 className="w-5 h-5 animate-spin" /> : "Ajouter"}
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
