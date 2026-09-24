import React, { useState, useEffect } from "react";
import { motion, AnimatePresence } from "framer-motion";
import {
  Search,
  Wine,
  Calendar,
  Plus,
  X,
  Loader2,
  CheckCircle2,
  Sparkles,
  Eye,
  Info,
  Edit2,
  Trash2,
  PackageCheck,
  Tag
} from "lucide-react";
import {
  listBoissons,
  createBoisson,
  getBoisson,
  updateBoisson,
  deleteBoisson
} from "../../../services/boisson.service";
import type { BoissonResponse } from "../../../types/boisson";
import { AccessDenied } from "../../../components/AccessDenied";
import { RestaurantSkeleton } from "../../../components/RestoSkeletons";

export const BoissonsView: React.FC = () => {
  const [boissons, setBoissons] = useState<BoissonResponse[]>([]);
  const [loading, setLoading] = useState(true);
  const [isDenied, setIsDenied] = useState(false);
  const [search, setSearch] = useState("");
  const [success, setSuccess] = useState<string | null>(null);
  const [error, setError] = useState<string | null>(null);

  // Action loading states
  const [deletingId, setDeletingId] = useState<string | null>(null);

  // Creation modal states
  const [isCreateOpen, setIsCreateOpen] = useState(false);
  const [nomBoisson, setNomBoisson] = useState("");
  const [contenance, setContenance] = useState("");
  const [prixVente, setPrixVente] = useState<number>(0);
  const [submitting, setSubmitting] = useState(false);

  // Editing modal states
  const [editBoisson, setEditBoisson] = useState<BoissonResponse | null>(null);
  const [editNom, setEditNom] = useState("");
  const [editContenance, setEditContenance] = useState("");
  const [editPrixVente, setEditPrixVente] = useState<number>(0);
  const [updating, setUpdating] = useState(false);

  // Detailed inspect states
  const [selectedBoisson, setSelectedBoisson] = useState<BoissonResponse | null>(null);
  const [inspecting, setInspecting] = useState(false);

  const fetchBoissons = async () => {
    try {
      setLoading(true);
      setIsDenied(false);
      const res = await listBoissons();
      setBoissons(res.data || []);
    } catch (err: any) {
      console.error(err);
      if (err.response?.status === 403 || err.response?.status === 401) {
        setIsDenied(true);
      }
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchBoissons();
  }, []);

  const handleCreate = async (e: React.FormEvent) => {
    e.preventDefault();
    setSuccess(null);
    setError(null);
    setSubmitting(true);

    try {
      await createBoisson({
        nomBoisson,
        contenance,
        prixVente: Number(prixVente)
      });
      setSuccess("Boisson créée avec succès !");
      setNomBoisson("");
      setContenance("");
      setPrixVente(0);
      setIsCreateOpen(false);
      fetchBoissons();
    } catch (err: any) {
      console.error(err);
      setError(
        err.response?.data?.detail?.[0]?.msg ||
        err.response?.data?.detail ||
        "Échec de la création de la boisson."
      );
    } finally {
      setSubmitting(false);
    }
  };

  const handleOpenEdit = (b: BoissonResponse) => {
    setEditBoisson(b);
    setEditNom(b.nomBoisson);
    setEditContenance(b.contenance || "");
    setEditPrixVente(b.prixVente || 0);
  };

  const handleUpdate = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!editBoisson) return;

    setSuccess(null);
    setError(null);
    setUpdating(true);

    try {
      await updateBoisson(editBoisson.id, {
        nomBoisson: editNom,
        contenance: editContenance,
        prixVente: Number(editPrixVente)
      });
      setSuccess("Boisson mise à jour avec succès !");
      setEditBoisson(null);
      fetchBoissons();
    } catch (err: any) {
      console.error(err);
      setError(
        err.response?.data?.detail?.[0]?.msg ||
        err.response?.data?.detail ||
        "Échec de la mise à jour de la boisson."
      );
    } finally {
      setUpdating(false);
    }
  };

  const handleDelete = async (id: string, name: string) => {
    if (!window.confirm(`Êtes-vous sûr de vouloir supprimer la boisson "${name}" ?`)) {
      return;
    }

    setSuccess(null);
    setError(null);
    setDeletingId(id);

    try {
      await deleteBoisson(id);
      setSuccess("Boisson supprimée avec succès !");
      fetchBoissons();
    } catch (err: any) {
      console.error(err);
      setError("Impossible de supprimer la boisson.");
    } finally {
      setDeletingId(null);
    }
  };

  const handleInspect = async (id: string) => {
    setInspecting(true);
    try {
      const res = await getBoisson(id);
      setSelectedBoisson(res.data);
    } catch (err: any) {
      console.error(err);
      setError("Impossible de charger les détails de la boisson.");
    } finally {
      setInspecting(false);
    }
  };

  const filtered = boissons.filter(
    (b) =>
      b.nomBoisson.toLowerCase().includes(search.toLowerCase()) ||
      (b.contenance && b.contenance.toLowerCase().includes(search.toLowerCase())) ||
      (b.restaurantId && b.restaurantId.toLowerCase().includes(search.toLowerCase()))
  );

  if (loading) {
    return (
      <div className="space-y-8">
        <div className="flex flex-col md:flex-row items-stretch md:items-center justify-between gap-4">
          <div className="space-y-2 w-1/3">
            <div className="h-8 bg-black/10 dark:bg-white/5 rounded-xl animate-pulse" />
            <div className="h-4 bg-black/10 dark:bg-white/5 rounded-lg animate-pulse w-2/3" />
          </div>
          <div className="h-12 w-60 bg-black/10 dark:bg-white/5 rounded-2xl animate-pulse" />
        </div>
        <RestaurantSkeleton />
      </div>
    );
  }

  if (isDenied) {
    return (
      <AccessDenied
        requiredRole="MEMBRE BAR / CAVE"
        description="L'accès à la gestion des boissons nécessite des permissions de gestion du bar ou de la cave."
      />
    );
  }

  return (
    <div className="space-y-8">
      {/* Upper info / Search */}
      <div className="flex flex-col md:flex-row items-stretch md:items-center justify-between gap-4">
        <div>
          <h2 className="text-3xl font-extrabold text-text-primary-light dark:text-text-primary-dark tracking-tight flex items-center gap-3">
            <Wine className="w-8 h-8 text-accent-light" />
            Gestion des Boissons
          </h2>
          <p className="text-text-secondary-light dark:text-text-secondary-dark mt-1">
            Consultez, créez, modifiez et gérez l'ensemble des boissons enregistrées dans votre établissement.
          </p>
        </div>

        <div className="flex flex-col sm:flex-row gap-3 items-stretch sm:items-center">
          <div className="relative group min-w-[240px]">
            <Search className="absolute left-4 top-1/2 -translate-y-1/2 w-4 h-4 text-text-secondary-light group-focus-within:text-accent-light transition-colors" />
            <input
              type="text"
              placeholder="Rechercher une boisson..."
              value={search}
              onChange={(e) => setSearch(e.target.value)}
              className="w-full pl-10 pr-4 py-3 bg-white/5 border border-white/10 rounded-2xl focus:outline-none focus:ring-2 focus:ring-accent-light/50 text-text-primary-light dark:text-text-primary-dark text-xs font-medium"
            />
          </div>

          <button
            onClick={() => setIsCreateOpen(true)}
            className="inline-flex items-center justify-center gap-2 px-5 py-3 bg-accent-light hover:bg-accent-dark text-white rounded-2xl font-bold text-xs transition-all shadow-lg hover:shadow-accent-light/20 active:scale-[0.98]"
          >
            <Plus size={18} />
            Nouvelle Boisson
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

      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
        {filtered.map((boisson) => (
          <motion.div
            key={boisson.id}
            whileHover={{ y: -5 }}
            className="glass-card-premium overflow-hidden flex flex-col group relative"
          >
            <div className="h-28 bg-gradient-to-tr from-slate-900 via-slate-950 to-amber-950/20 flex items-center justify-center relative">
              <Wine className="w-12 h-12 text-accent-light/20 group-hover:scale-110 transition-transform duration-300" />
            </div>

            <div className="p-6 flex-1 flex flex-col justify-between">
              <div>
                <div className="flex justify-between items-start mb-2">
                  <h3 className="text-lg font-bold text-text-primary-light dark:text-text-primary-dark line-clamp-1">
                    {boisson.nomBoisson}
                  </h3>
                  {boisson.contenance && (
                    <span className="px-2.5 py-1 glass-capsule text-[10px] font-extrabold text-accent-light rounded-full border border-accent-light/20">
                      {boisson.contenance}
                    </span>
                  )}
                </div>

                <div className="space-y-3 pt-4 border-t border-black/5 dark:border-white/5 text-xs text-text-secondary-light dark:text-text-secondary-dark font-medium">
                  <div className="flex justify-between items-center">
                    <span className="uppercase tracking-wider flex items-center gap-1.5">
                      <Tag size={14} className="text-accent-light" /> Prix Vente
                    </span>
                    <span className="font-extrabold text-success-light text-sm">
                      {boisson.prixVente?.toLocaleString()} F CFA
                    </span>
                  </div>

                  <div className="flex justify-between items-center">
                    <span className="uppercase tracking-wider flex items-center gap-1.5">
                      <PackageCheck size={14} className="text-accent-light" /> Stock
                    </span>
                    <span className="font-extrabold text-text-primary-light dark:text-text-primary-dark">
                      {boisson.stock ?? 0}
                    </span>
                  </div>

                  {boisson.createdAt && (
                    <div className="flex items-center gap-2 text-[10px] pt-1">
                      <Calendar className="w-3.5 h-3.5 text-accent-light" />
                      <span>Créé le: {new Date(boisson.createdAt).toLocaleDateString()}</span>
                    </div>
                  )}
                </div>
              </div>

              <div className="pt-4 border-t border-black/5 dark:border-white/5 mt-4 flex justify-between gap-2">
                <div className="flex gap-2">
                  <button
                    onClick={() => handleOpenEdit(boisson)}
                    className="p-2 rounded-lg glass-capsule text-text-secondary-light dark:text-text-secondary-dark hover:text-accent-light transition-all"
                    title="Modifier"
                  >
                    <Edit2 size={14} />
                  </button>
                  <button
                    onClick={() => handleDelete(boisson.id, boisson.nomBoisson)}
                    disabled={deletingId === boisson.id}
                    className="p-2 rounded-lg glass-capsule text-danger-light hover:bg-danger-light/10 transition-all"
                    title="Supprimer"
                  >
                    {deletingId === boisson.id ? (
                      <Loader2 size={14} className="animate-spin text-danger-light" />
                    ) : (
                      <Trash2 size={14} />
                    )}
                  </button>
                </div>

                <button
                  onClick={() => handleInspect(boisson.id)}
                  disabled={inspecting}
                  className="px-3.5 py-1.5 glass-capsule hover:text-accent-light text-text-secondary-light font-bold text-xs rounded-xl flex items-center gap-1 transition-all"
                >
                  <Eye size={14} />
                  Consulter
                </button>
              </div>
            </div>
          </motion.div>
        ))}

        {filtered.length === 0 && (
          <div className="glass-card-premium p-12 text-center col-span-full">
            <Wine className="w-12 h-12 text-text-secondary-light dark:text-text-secondary-dark mx-auto mb-4 opacity-50" />
            <p className="text-text-secondary-light dark:text-text-secondary-dark font-medium">
              Aucune boisson trouvée.
            </p>
          </div>
        )}
      </div>

      {/* Creation Modal */}
      <AnimatePresence>
        {isCreateOpen && (
          <div className="fixed inset-0 bg-black/40 backdrop-blur-md z-[100] flex items-center justify-center p-4">
            <motion.div
              initial={{ scale: 0.95, opacity: 0 }}
              animate={{ scale: 1, opacity: 1 }}
              exit={{ scale: 0.95, opacity: 0 }}
              className="glass-card-premium w-full max-w-md p-8 relative overflow-hidden border border-white/20 dark:border-white/5"
            >
              <div className="flex justify-between items-center mb-6">
                <div className="flex items-center gap-2">
                  <Sparkles className="w-5 h-5 text-accent-light animate-pulse" />
                  <h3 className="text-2xl font-bold text-text-primary-light dark:text-text-primary-dark">Nouvelle Boisson</h3>
                </div>
                <button
                  onClick={() => setIsCreateOpen(false)}
                  className="p-1.5 rounded-xl hover:bg-black/5 dark:hover:bg-white/5 text-text-secondary-light transition-colors"
                >
                  <X size={20} />
                </button>
              </div>

              <form onSubmit={handleCreate} className="space-y-4">
                <div className="space-y-1">
                  <label className="text-xs font-semibold text-text-primary-light dark:text-text-primary-dark uppercase tracking-wider ml-1">
                    Nom de la Boisson
                  </label>
                  <input
                    type="text"
                    value={nomBoisson}
                    onChange={(e) => setNomBoisson(e.target.value)}
                    required
                    placeholder="ex: Coca-Cola, Beaufort, Jus de Gingembre"
                    className="w-full px-4 py-3 bg-white/5 border border-white/10 rounded-2xl focus:outline-none focus:ring-2 focus:ring-accent-light/50 text-text-primary-light dark:text-text-primary-dark text-sm font-semibold"
                  />
                </div>

                <div className="space-y-1">
                  <label className="text-xs font-semibold text-text-primary-light dark:text-text-primary-dark uppercase tracking-wider ml-1">
                    Contenance
                  </label>
                  <input
                    type="text"
                    value={contenance}
                    onChange={(e) => setContenance(e.target.value)}
                    placeholder="0,55cl, 33cl, 1L"
                    className="w-full px-4 py-3 bg-white/5 border border-white/10 rounded-2xl focus:outline-none focus:ring-2 focus:ring-accent-light/50 text-text-primary-light dark:text-text-primary-dark text-sm font-semibold"
                  />
                </div>

                <div className="space-y-1">
                  <label className="text-xs font-semibold text-text-primary-light dark:text-text-primary-dark uppercase tracking-wider ml-1">
                    Prix de Vente (F CFA)
                  </label>
                  <input
                    type="number"
                    value={prixVente}
                    onChange={(e) => setPrixVente(Number(e.target.value))}
                    required
                    min={0}
                    className="w-full px-4 py-3 bg-white/5 border border-white/10 rounded-2xl focus:outline-none focus:ring-2 focus:ring-accent-light/50 text-text-primary-light dark:text-text-primary-dark text-sm font-semibold"
                  />
                </div>

                <div className="flex gap-4 pt-4">
                  <button
                    type="button"
                    onClick={() => setIsCreateOpen(false)}
                    className="flex-1 py-3.5 glass-capsule rounded-2xl font-bold text-sm text-text-primary-light dark:text-text-primary-dark transition-all"
                  >
                    Annuler
                  </button>
                  <button
                    type="submit"
                    disabled={submitting}
                    className="flex-1 py-3.5 bg-accent-light hover:bg-accent-dark text-white rounded-2xl font-bold text-sm flex items-center justify-center gap-2 shadow-lg transition-all disabled:opacity-50"
                  >
                    {submitting ? <Loader2 className="w-5 h-5 animate-spin" /> : "Créer"}
                  </button>
                </div>
              </form>
            </motion.div>
          </div>
        )}
      </AnimatePresence>

      {/* Editing Modal */}
      <AnimatePresence>
        {editBoisson && (
          <div className="fixed inset-0 bg-black/40 backdrop-blur-md z-[100] flex items-center justify-center p-4">
            <motion.div
              initial={{ scale: 0.95, opacity: 0 }}
              animate={{ scale: 1, opacity: 1 }}
              exit={{ scale: 0.95, opacity: 0 }}
              className="glass-card-premium w-full max-w-md p-8 relative overflow-hidden border border-white/20 dark:border-white/5"
            >
              <div className="flex justify-between items-center mb-6">
                <div className="flex items-center gap-2">
                  <Edit2 className="w-5 h-5 text-accent-light" />
                  <h3 className="text-2xl font-bold text-text-primary-light dark:text-text-primary-dark">Modifier la Boisson</h3>
                </div>
                <button
                  onClick={() => setEditBoisson(null)}
                  className="p-1.5 rounded-xl hover:bg-black/5 dark:hover:bg-white/5 text-text-secondary-light transition-colors"
                >
                  <X size={20} />
                </button>
              </div>

              <form onSubmit={handleUpdate} className="space-y-4">
                <div className="space-y-1">
                  <label className="text-xs font-semibold text-text-primary-light dark:text-text-primary-dark uppercase tracking-wider ml-1">
                    Nom de la Boisson
                  </label>
                  <input
                    type="text"
                    value={editNom}
                    onChange={(e) => setEditNom(e.target.value)}
                    required
                    className="w-full px-4 py-3 bg-white/5 border border-white/10 rounded-2xl focus:outline-none focus:ring-2 focus:ring-accent-light/50 text-text-primary-light dark:text-text-primary-dark text-sm font-semibold"
                  />
                </div>

                <div className="space-y-1">
                  <label className="text-xs font-semibold text-text-primary-light dark:text-text-primary-dark uppercase tracking-wider ml-1">
                    Contenance
                  </label>
                  <input
                    type="text"
                    value={editContenance}
                    onChange={(e) => setEditContenance(e.target.value)}
                    className="w-full px-4 py-3 bg-white/5 border border-white/10 rounded-2xl focus:outline-none focus:ring-2 focus:ring-accent-light/50 text-text-primary-light dark:text-text-primary-dark text-sm font-semibold"
                  />
                </div>

                <div className="space-y-1">
                  <label className="text-xs font-semibold text-text-primary-light dark:text-text-primary-dark uppercase tracking-wider ml-1">
                    Prix de Vente (F CFA)
                  </label>
                  <input
                    type="number"
                    value={editPrixVente}
                    onChange={(e) => setEditPrixVente(Number(e.target.value))}
                    required
                    min={0}
                    className="w-full px-4 py-3 bg-white/5 border border-white/10 rounded-2xl focus:outline-none focus:ring-2 focus:ring-accent-light/50 text-text-primary-light dark:text-text-primary-dark text-sm font-semibold"
                  />
                </div>

                <div className="flex gap-4 pt-4">
                  <button
                    type="button"
                    onClick={() => setEditBoisson(null)}
                    className="flex-1 py-3.5 glass-capsule rounded-2xl font-bold text-sm text-text-primary-light dark:text-text-primary-dark transition-all"
                  >
                    Annuler
                  </button>
                  <button
                    type="submit"
                    disabled={updating}
                    className="flex-1 py-3.5 bg-accent-light hover:bg-accent-dark text-white rounded-2xl font-bold text-sm flex items-center justify-center gap-2 shadow-lg transition-all disabled:opacity-50"
                  >
                    {updating ? <Loader2 className="w-5 h-5 animate-spin" /> : "Sauvegarder"}
                  </button>
                </div>
              </form>
            </motion.div>
          </div>
        )}
      </AnimatePresence>

      {/* Inspect Detail Modal */}
      <AnimatePresence>
        {selectedBoisson && (
          <div className="fixed inset-0 bg-black/40 backdrop-blur-md z-[100] flex items-center justify-center p-4">
            <motion.div
              initial={{ scale: 0.95, opacity: 0 }}
              animate={{ scale: 1, opacity: 1 }}
              exit={{ scale: 0.95, opacity: 0 }}
              className="glass-card-premium w-full max-w-md p-8 relative overflow-hidden border border-white/20 dark:border-white/5"
            >
              <div className="flex justify-between items-center mb-6">
                <div className="flex items-center gap-2.5">
                  <Info className="w-5 h-5 text-accent-light" />
                  <h3 className="text-xl font-bold text-text-primary-light dark:text-text-primary-dark">Fiche Boisson</h3>
                </div>
                <button
                  onClick={() => setSelectedBoisson(null)}
                  className="p-1.5 rounded-xl hover:bg-black/5 dark:hover:bg-white/5 text-text-secondary-light transition-colors"
                >
                  <X size={20} />
                </button>
              </div>

              <div className="space-y-4">
                <div className="p-4 rounded-2xl bg-black/5 dark:bg-white/5 border border-black/10 dark:border-white/5 space-y-1">
                  <span className="text-[10px] font-bold text-text-secondary-light uppercase tracking-widest block">Nom Boisson</span>
                  <span className="text-lg font-bold text-text-primary-light dark:text-text-primary-dark">{selectedBoisson.nomBoisson}</span>
                </div>

                <div className="p-4 rounded-2xl bg-black/5 dark:bg-white/5 border border-black/10 dark:border-white/5 space-y-1">
                  <span className="text-[10px] font-bold text-text-secondary-light uppercase tracking-widest block">ID Boisson</span>
                  <span className="text-xs font-mono font-bold text-accent-light block select-all">{selectedBoisson.id}</span>
                </div>

                {selectedBoisson.restaurantId && (
                  <div className="p-4 rounded-2xl bg-black/5 dark:bg-white/5 border border-black/10 dark:border-white/5 space-y-1">
                    <span className="text-[10px] font-bold text-text-secondary-light uppercase tracking-widest block">ID Restaurant</span>
                    <span className="text-xs font-mono font-bold text-text-primary-light dark:text-text-primary-dark block select-all">{selectedBoisson.restaurantId}</span>
                  </div>
                )}

                <div className="grid grid-cols-3 gap-3">
                  <div className="p-3 rounded-2xl bg-black/5 dark:bg-white/5 border border-black/10 dark:border-white/5 space-y-1">
                    <span className="text-[9px] font-bold text-text-secondary-light uppercase tracking-widest block">Contenance</span>
                    <span className="text-xs font-extrabold text-accent-light block">{selectedBoisson.contenance || "N/A"}</span>
                  </div>
                  <div className="p-3 rounded-2xl bg-black/5 dark:bg-white/5 border border-black/10 dark:border-white/5 space-y-1">
                    <span className="text-[9px] font-bold text-text-secondary-light uppercase tracking-widest block">Prix Vente</span>
                    <span className="text-xs font-extrabold text-success-light block">{selectedBoisson.prixVente?.toLocaleString()} F</span>
                  </div>
                  <div className="p-3 rounded-2xl bg-black/5 dark:bg-white/5 border border-black/10 dark:border-white/5 space-y-1">
                    <span className="text-[9px] font-bold text-text-secondary-light uppercase tracking-widest block">Stock</span>
                    <span className="text-xs font-extrabold text-text-primary-light dark:text-text-primary-dark block">{selectedBoisson.stock ?? 0}</span>
                  </div>
                </div>

                {selectedBoisson.createdAt && (
                  <div className="p-4 rounded-2xl bg-black/5 dark:bg-white/5 border border-black/10 dark:border-white/5 space-y-1">
                    <span className="text-[10px] font-bold text-text-secondary-light uppercase tracking-widest block">Date Enregistrement</span>
                    <span className="text-xs font-semibold text-text-primary-light dark:text-text-primary-dark block">{new Date(selectedBoisson.createdAt).toLocaleString()}</span>
                  </div>
                )}
              </div>

              <button
                onClick={() => setSelectedBoisson(null)}
                className="w-full py-3.5 mt-6 glass-capsule rounded-2xl font-bold text-sm text-text-primary-light dark:text-text-primary-dark transition-all"
              >
                Fermer
              </button>
            </motion.div>
          </div>
        )}
      </AnimatePresence>
    </div>
  );
};
