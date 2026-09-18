import React, { useState, useEffect } from "react";
import { motion, AnimatePresence } from "framer-motion";
import {
  Search,
  UtensilsCrossed,
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
  Tag
} from "lucide-react";
import {
  listRepas,
  createRepas,
  getRepas,
  updateRepas,
  deleteRepas
} from "../../../services/repas.service";
import type { RepasResponse } from "../../../types/repas";
import { AccessDenied } from "../../../components/AccessDenied";
import { RestaurantSkeleton } from "../../../components/RestoSkeletons";

export const RepasView: React.FC = () => {
  const [repasList, setRepasList] = useState<RepasResponse[]>([]);
  const [loading, setLoading] = useState(true);
  const [isDenied, setIsDenied] = useState(false);
  const [search, setSearch] = useState("");
  const [success, setSuccess] = useState<string | null>(null);
  const [error, setError] = useState<string | null>(null);

  // Action loading states
  const [deletingId, setDeletingId] = useState<string | null>(null);

  // Creation modal states
  const [isCreateOpen, setIsCreateOpen] = useState(false);
  const [nomRepas, setNomRepas] = useState("");
  const [prix, setPrix] = useState<number>(0);
  const [submitting, setSubmitting] = useState(false);

  // Editing modal states
  const [editRepas, setEditRepas] = useState<RepasResponse | null>(null);
  const [editNomRepas, setEditNomRepas] = useState("");
  const [editPrix, setEditPrix] = useState<number>(0);
  const [updating, setUpdating] = useState(false);

  // Detailed inspect states
  const [selectedRepas, setSelectedRepas] = useState<RepasResponse | null>(null);
  const [inspecting, setInspecting] = useState(false);

  const fetchRepas = async () => {
    try {
      setLoading(true);
      setIsDenied(false);
      const res = await listRepas();
      setRepasList(res.data || []);
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
    fetchRepas();
  }, []);

  const handleCreate = async (e: React.FormEvent) => {
    e.preventDefault();
    setSuccess(null);
    setError(null);
    setSubmitting(true);

    try {
      await createRepas({
        nomRepas,
        prix: Number(prix)
      });
      setSuccess("Repas créé avec succès !");
      setNomRepas("");
      setPrix(0);
      setIsCreateOpen(false);
      fetchRepas();
    } catch (err: any) {
      console.error(err);
      setError(
        err.response?.data?.detail?.[0]?.msg ||
        err.response?.data?.detail ||
        "Échec de la création du repas."
      );
    } finally {
      setSubmitting(false);
    }
  };

  const handleOpenEdit = (r: RepasResponse) => {
    setEditRepas(r);
    setEditNomRepas(r.nomRepas);
    setEditPrix(r.prix || 0);
  };

  const handleUpdate = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!editRepas) return;

    setSuccess(null);
    setError(null);
    setUpdating(true);

    try {
      await updateRepas(editRepas.id, {
        nomRepas: editNomRepas,
        prix: Number(editPrix)
      });
      setSuccess("Repas mis à jour avec succès !");
      setEditRepas(null);
      fetchRepas();
    } catch (err: any) {
      console.error(err);
      setError(
        err.response?.data?.detail?.[0]?.msg ||
        err.response?.data?.detail ||
        "Échec de la mise à jour du repas."
      );
    } finally {
      setUpdating(false);
    }
  };

  const handleDelete = async (id: string, name: string) => {
    if (!window.confirm(`Êtes-vous sûr de vouloir supprimer le repas "${name}" ?`)) {
      return;
    }

    setSuccess(null);
    setError(null);
    setDeletingId(id);

    try {
      await deleteRepas(id);
      setSuccess("Repas supprimé avec succès !");
      fetchRepas();
    } catch (err: any) {
      console.error(err);
      setError("Impossible de supprimer le repas.");
    } finally {
      setDeletingId(null);
    }
  };

  const handleInspect = async (id: string) => {
    setInspecting(true);
    try {
      const res = await getRepas(id);
      setSelectedRepas(res.data);
    } catch (err: any) {
      console.error(err);
      setError("Impossible de charger les détails du repas.");
    } finally {
      setInspecting(false);
    }
  };

  const filtered = repasList.filter(
    (r) =>
      r.nomRepas.toLowerCase().includes(search.toLowerCase()) ||
      (r.restaurantId && r.restaurantId.toLowerCase().includes(search.toLowerCase()))
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
        requiredRole="MEMBRE CUISINE"
        description="L'accès à la gestion des repas nécessite des permissions de gestion de la cuisine."
      />
    );
  }

  return (
    <div className="space-y-8">
      {/* Upper info / Search */}
      <div className="flex flex-col md:flex-row items-stretch md:items-center justify-between gap-4">
        <div>
          <h2 className="text-3xl font-extrabold text-text-primary-light dark:text-text-primary-dark tracking-tight flex items-center gap-3">
            <UtensilsCrossed className="w-8 h-8 text-accent-light" />
            Gestion des Repas
          </h2>
          <p className="text-text-secondary-light dark:text-text-secondary-dark mt-1">
            Consultez, créez, modifiez et gérez la carte des repas de votre établissement.
          </p>
        </div>

        <div className="flex flex-col sm:flex-row gap-3 items-stretch sm:items-center">
          <div className="relative group min-w-[240px]">
            <Search className="absolute left-4 top-1/2 -translate-y-1/2 w-4 h-4 text-text-secondary-light group-focus-within:text-accent-light transition-colors" />
            <input
              type="text"
              placeholder="Rechercher un repas..."
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
            Nouveau Repas
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
        {filtered.map((repas) => (
          <motion.div
            key={repas.id}
            whileHover={{ y: -5 }}
            className="glass-card-premium overflow-hidden flex flex-col group relative"
          >
            <div className="h-28 bg-gradient-to-tr from-slate-900 via-slate-950 to-orange-950/20 flex items-center justify-center relative">
              <UtensilsCrossed className="w-12 h-12 text-accent-light/20 group-hover:scale-110 transition-transform duration-300" />
            </div>

            <div className="p-6 flex-1 flex flex-col justify-between">
              <div>
                <h3 className="text-lg font-bold text-text-primary-light dark:text-text-primary-dark line-clamp-1 mb-2">
                  {repas.nomRepas}
                </h3>

                <div className="space-y-3 pt-4 border-t border-black/5 dark:border-white/5 text-xs text-text-secondary-light dark:text-text-secondary-dark font-medium">
                  <div className="flex justify-between items-center">
                    <span className="uppercase tracking-wider flex items-center gap-1.5">
                      <Tag size={14} className="text-accent-light" /> Prix
                    </span>
                    <span className="font-extrabold text-success-light text-sm">
                      {repas.prix?.toLocaleString()} F CFA
                    </span>
                  </div>

                  {repas.createdAt && (
                    <div className="flex items-center gap-2 text-[10px] pt-1">
                      <Calendar className="w-3.5 h-3.5 text-accent-light" />
                      <span>Créé le: {new Date(repas.createdAt).toLocaleDateString()}</span>
                    </div>
                  )}
                </div>
              </div>

              <div className="pt-4 border-t border-black/5 dark:border-white/5 mt-4 flex justify-between gap-2">
                <div className="flex gap-2">
                  <button
                    onClick={() => handleOpenEdit(repas)}
                    className="p-2 rounded-lg glass-capsule text-text-secondary-light dark:text-text-secondary-dark hover:text-accent-light transition-all"
                    title="Modifier"
                  >
                    <Edit2 size={14} />
                  </button>
                  <button
                    onClick={() => handleDelete(repas.id, repas.nomRepas)}
                    disabled={deletingId === repas.id}
                    className="p-2 rounded-lg glass-capsule text-danger-light hover:bg-danger-light/10 transition-all"
                    title="Supprimer"
                  >
                    {deletingId === repas.id ? (
                      <Loader2 size={14} className="animate-spin text-danger-light" />
                    ) : (
                      <Trash2 size={14} />
                    )}
                  </button>
                </div>

                <button
                  onClick={() => handleInspect(repas.id)}
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
            <UtensilsCrossed className="w-12 h-12 text-text-secondary-light dark:text-text-secondary-dark mx-auto mb-4 opacity-50" />
            <p className="text-text-secondary-light dark:text-text-secondary-dark font-medium">
              Aucun repas trouvé.
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
                  <h3 className="text-2xl font-bold text-text-primary-light dark:text-text-primary-dark">Nouveau Repas</h3>
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
                    Nom du Repas
                  </label>
                  <input
                    type="text"
                    value={nomRepas}
                    onChange={(e) => setNomRepas(e.target.value)}
                    required
                    placeholder="ex: Poulet Yassa, Steak Frites, Riz Gras"
                    className="w-full px-4 py-3 bg-white/5 border border-white/10 rounded-2xl focus:outline-none focus:ring-2 focus:ring-accent-light/50 text-text-primary-light dark:text-text-primary-dark text-sm font-semibold"
                  />
                </div>

                <div className="space-y-1">
                  <label className="text-xs font-semibold text-text-primary-light dark:text-text-primary-dark uppercase tracking-wider ml-1">
                    Prix (F CFA)
                  </label>
                  <input
                    type="number"
                    value={prix}
                    onChange={(e) => setPrix(Number(e.target.value))}
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
        {editRepas && (
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
                  <h3 className="text-2xl font-bold text-text-primary-light dark:text-text-primary-dark">Modifier le Repas</h3>
                </div>
                <button
                  onClick={() => setEditRepas(null)}
                  className="p-1.5 rounded-xl hover:bg-black/5 dark:hover:bg-white/5 text-text-secondary-light transition-colors"
                >
                  <X size={20} />
                </button>
              </div>

              <form onSubmit={handleUpdate} className="space-y-4">
                <div className="space-y-1">
                  <label className="text-xs font-semibold text-text-primary-light dark:text-text-primary-dark uppercase tracking-wider ml-1">
                    Nom du Repas
                  </label>
                  <input
                    type="text"
                    value={editNomRepas}
                    onChange={(e) => setEditNomRepas(e.target.value)}
                    required
                    className="w-full px-4 py-3 bg-white/5 border border-white/10 rounded-2xl focus:outline-none focus:ring-2 focus:ring-accent-light/50 text-text-primary-light dark:text-text-primary-dark text-sm font-semibold"
                  />
                </div>

                <div className="space-y-1">
                  <label className="text-xs font-semibold text-text-primary-light dark:text-text-primary-dark uppercase tracking-wider ml-1">
                    Prix (F CFA)
                  </label>
                  <input
                    type="number"
                    value={editPrix}
                    onChange={(e) => setEditPrix(Number(e.target.value))}
                    required
                    min={0}
                    className="w-full px-4 py-3 bg-white/5 border border-white/10 rounded-2xl focus:outline-none focus:ring-2 focus:ring-accent-light/50 text-text-primary-light dark:text-text-primary-dark text-sm font-semibold"
                  />
                </div>

                <div className="flex gap-4 pt-4">
                  <button
                    type="button"
                    onClick={() => setEditRepas(null)}
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
        {selectedRepas && (
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
                  <h3 className="text-xl font-bold text-text-primary-light dark:text-text-primary-dark">Fiche Repas</h3>
                </div>
                <button
                  onClick={() => setSelectedRepas(null)}
                  className="p-1.5 rounded-xl hover:bg-black/5 dark:hover:bg-white/5 text-text-secondary-light transition-colors"
                >
                  <X size={20} />
                </button>
              </div>

              <div className="space-y-4">
                <div className="p-4 rounded-2xl bg-black/5 dark:bg-white/5 border border-black/10 dark:border-white/5 space-y-1">
                  <span className="text-[10px] font-bold text-text-secondary-light uppercase tracking-widest block">Nom Repas</span>
                  <span className="text-lg font-bold text-text-primary-light dark:text-text-primary-dark">{selectedRepas.nomRepas}</span>
                </div>

                <div className="p-4 rounded-2xl bg-black/5 dark:bg-white/5 border border-black/10 dark:border-white/5 space-y-1">
                  <span className="text-[10px] font-bold text-text-secondary-light uppercase tracking-widest block">ID Repas</span>
                  <span className="text-xs font-mono font-bold text-accent-light block select-all">{selectedRepas.id}</span>
                </div>

                {selectedRepas.restaurantId && (
                  <div className="p-4 rounded-2xl bg-black/5 dark:bg-white/5 border border-black/10 dark:border-white/5 space-y-1">
                    <span className="text-[10px] font-bold text-text-secondary-light uppercase tracking-widest block">ID Restaurant</span>
                    <span className="text-xs font-mono font-bold text-text-primary-light dark:text-text-primary-dark block select-all">{selectedRepas.restaurantId}</span>
                  </div>
                )}

                <div className="p-4 rounded-2xl bg-black/5 dark:bg-white/5 border border-black/10 dark:border-white/5 space-y-1">
                  <span className="text-[10px] font-bold text-text-secondary-light uppercase tracking-widest block">Prix</span>
                  <span className="text-sm font-extrabold text-success-light block">{selectedRepas.prix?.toLocaleString()} F CFA</span>
                </div>

                {selectedRepas.createdAt && (
                  <div className="p-4 rounded-2xl bg-black/5 dark:bg-white/5 border border-black/10 dark:border-white/5 space-y-1">
                    <span className="text-[10px] font-bold text-text-secondary-light uppercase tracking-widest block">Date Enregistrement</span>
                    <span className="text-xs font-semibold text-text-primary-light dark:text-text-primary-dark block">{new Date(selectedRepas.createdAt).toLocaleString()}</span>
                  </div>
                )}
              </div>

              <button
                onClick={() => setSelectedRepas(null)}
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
