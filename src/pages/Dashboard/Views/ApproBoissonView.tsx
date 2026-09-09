import React, { useState, useEffect } from "react";
import { motion, AnimatePresence } from "framer-motion";
import {
  Search,
  Wine,
  Calendar,
  Sparkles,
  X,
  Loader2,
  CheckCircle2,
  Eye,
  Info,
  Plus,
  Edit2,
  Trash2
} from "lucide-react";
import {
  listApproBoissons,
  createApproBoisson,
  getApproBoisson,
  updateApproBoisson,
  deleteApproBoisson,
  listBoissons
} from "../../../services";
import type { ApproBoissonResponse, BoissonResponse } from "../../../types/boisson";
import { AccessDenied } from "../../../components/AccessDenied";
import { RestaurantSkeleton } from "../../../components/RestoSkeletons";

export const ApproBoissonView: React.FC = () => {
  const [appros, setAppros] = useState<ApproBoissonResponse[]>([]);
  const [boissons, setBoissons] = useState<BoissonResponse[]>([]);
  const [loading, setLoading] = useState(true);
  const [isDenied, setIsDenied] = useState(false);
  const [search, setSearch] = useState("");
  const [success, setSuccess] = useState<string | null>(null);
  const [error, setError] = useState<string | null>(null);

  // Creation modal states
  const [isCreateOpen, setIsCreateOpen] = useState(false);
  const [boissonId, setBoissonId] = useState("");
  const [casierId, setCasierId] = useState("");
  const [prixAchat, setPrixAchat] = useState<number>(0);
  const [nbreCasier, setNbreCasier] = useState<number>(1);
  const [submitting, setSubmitting] = useState(false);

  // Detailed inspect states
  const [selectedAppro, setSelectedAppro] = useState<ApproBoissonResponse | null>(null);
  const [isInspectOpen, setIsInspectOpen] = useState(false);

  // Edit states
  const [isEditOpen, setIsEditOpen] = useState(false);
  const [editPrixAchat, setEditPrixAchat] = useState<number>(0);
  const [editNbreCasier, setEditNbreCasier] = useState<number>(1);
  const [editCasierId, setEditCasierId] = useState("");

  const fetchData = async () => {
    try {
      setLoading(true);
      setIsDenied(false);
      const [approsRes, boissonsRes] = await Promise.all([
        listApproBoissons(),
        listBoissons().catch(() => ({ data: [] }))
      ]);
      setAppros(approsRes.data || []);
      setBoissons(boissonsRes.data || []);
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
    fetchData();
  }, []);

  const getBoissonName = (appro: ApproBoissonResponse) => {
    if (appro.boisson?.nomBoisson) {
      return appro.boisson.nomBoisson;
    }
    const found = boissons.find((b) => b.id === appro.boissonId);
    if (found?.nomBoisson) {
      return found.nomBoisson;
    }
    return `Boisson (${appro.boissonId})`;
  };

  const handleCreate = async (e: React.FormEvent) => {
    e.preventDefault();
    setSuccess(null);
    setError(null);
    setSubmitting(true);

    try {
      await createApproBoisson({
        boissonId,
        casierId,
        prixAchat: Number(prixAchat),
        nbreCasier: Number(nbreCasier)
      });
      setSuccess("Approvisionnement boisson créé avec succès !");
      setBoissonId("");
      setCasierId("");
      setPrixAchat(0);
      setNbreCasier(1);
      setIsCreateOpen(false);
      fetchData();
    } catch (err: any) {
      console.error(err);
      setError(
        err.response?.data?.detail?.[0]?.msg ||
        err.response?.data?.detail ||
        "Échec de la création de l'approvisionnement boisson."
      );
    } finally {
      setSubmitting(false);
    }
  };

  const handleInspect = async (id: string) => {
    setError(null);
    try {
      const res = await getApproBoisson(id);
      setSelectedAppro(res.data);
      setIsInspectOpen(true);
    } catch (err: any) {
      console.error(err);
      setError("Impossible de charger les détails.");
    }
  };

  const openEditModal = (appro: ApproBoissonResponse) => {
    setSelectedAppro(appro);
    setEditPrixAchat(appro.prixAchat);
    setEditNbreCasier(appro.nbreCasier);
    setEditCasierId(appro.casierId);
    setIsEditOpen(true);
  };

  const handleUpdate = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!selectedAppro) return;
    setSubmitting(true);
    setError(null);

    try {
      await updateApproBoisson(selectedAppro.id, {
        prixAchat: Number(editPrixAchat),
        nbreCasier: Number(editNbreCasier),
        casierId: editCasierId
      });
      setSuccess("Approvisionnement mis à jour avec succès !");
      setIsEditOpen(false);
      fetchData();
    } catch (err: any) {
      console.error(err);
      setError("Échec de la mise à jour de l'approvisionnement.");
    } finally {
      setSubmitting(false);
    }
  };

  const handleDelete = async (id: string) => {
    if (!window.confirm("Voulez-vous vraiment supprimer cet approvisionnement de boisson ?")) return;
    setError(null);
    try {
      await deleteApproBoisson(id);
      setSuccess("Approvisionnement supprimé avec succès.");
      fetchData();
    } catch (err: any) {
      console.error(err);
      setError("Impossible de supprimer cet approvisionnement.");
    }
  };

  const filtered = appros.filter((a) => {
    const term = search.toLowerCase();
    const bName = getBoissonName(a).toLowerCase();
    const bId = a.boissonId?.toLowerCase() || "";
    const cId = a.casierId?.toLowerCase() || "";
    return bName.includes(term) || bId.includes(term) || cId.includes(term);
  });

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
        description="L'accès à l'approvisionnement des boissons nécessite des permissions de gestion du bar ou de la cave."
      />
    );
  }

  return (
    <div className="space-y-8">
      {/* Header & Controls */}
      <div className="flex flex-col md:flex-row items-stretch md:items-center justify-between gap-4">
        <div>
          <h2 className="text-3xl font-extrabold text-text-primary-light dark:text-text-primary-dark tracking-tight flex items-center gap-3">
            <Wine className="w-8 h-8 text-accent-light" />
            Approvisionnement Boissons
          </h2>
          <p className="text-text-secondary-light dark:text-text-secondary-dark mt-1">
            Gérez et suivez les approvisionnements en boissons et casiers de votre établissement.
          </p>
        </div>

        <div className="flex flex-col sm:flex-row gap-3 items-stretch sm:items-center">
          <div className="relative group min-w-[240px]">
            <Search className="absolute left-4 top-1/2 -translate-y-1/2 w-4 h-4 text-text-secondary-light group-focus-within:text-accent-light transition-colors" />
            <input
              type="text"
              placeholder="Rechercher (boisson / casier)..."
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
            Nouvel Appro Boisson
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
        {filtered.map((appro) => (
          <motion.div
            key={appro.id}
            whileHover={{ y: -5 }}
            className="glass-card-premium overflow-hidden flex flex-col group relative"
          >
            <div className="h-28 bg-gradient-to-tr from-slate-900 via-slate-950 to-amber-950/20 flex items-center justify-center relative">
              <Wine className="w-12 h-12 text-accent-light/20 group-hover:scale-110 transition-transform duration-300" />
            </div>

            <div className="p-6 flex-1 flex flex-col justify-between">
              <div>
                <h3 className="text-base font-extrabold text-text-primary-light dark:text-text-primary-dark mb-1 line-clamp-1">
                  {getBoissonName(appro)}
                </h3>

                <div className="space-y-3 pt-4 border-t border-black/5 dark:border-white/5 text-xs text-text-secondary-light dark:text-text-secondary-dark font-medium">
                  <div className="flex justify-between items-center">
                    <span className="uppercase tracking-wider">Nombre de casiers</span>
                    <span className="font-extrabold text-text-primary-light dark:text-text-primary-dark">{appro.nbreCasier}</span>
                  </div>
                  <div className="flex justify-between items-center">
                    <span className="uppercase tracking-wider">Prix d'Achat</span>
                    <span className="font-extrabold text-success-light">{appro.prixAchat?.toLocaleString()} F CFA</span>
                  </div>
                  <div className="flex items-center gap-2 text-[10px] pt-1">
                    <Calendar className="w-3.5 h-3.5 text-accent-light" />
                    <span>Créé le: {appro.createdAt ? new Date(appro.createdAt).toLocaleDateString() : "N/A"}</span>
                  </div>
                </div>
              </div>

              <div className="pt-4 border-t border-black/5 dark:border-white/5 mt-4 flex justify-end gap-2">
                <button
                  onClick={() => handleInspect(appro.id)}
                  className="px-3 py-1.5 glass-capsule hover:text-accent-light text-text-secondary-light font-bold text-xs rounded-xl flex items-center gap-1 transition-all"
                  title="Inspecter"
                >
                  <Eye size={14} />
                </button>
                <button
                  onClick={() => openEditModal(appro)}
                  className="px-3 py-1.5 glass-capsule hover:text-blue-400 text-text-secondary-light font-bold text-xs rounded-xl flex items-center gap-1 transition-all"
                  title="Modifier"
                >
                  <Edit2 size={14} />
                </button>
                <button
                  onClick={() => handleDelete(appro.id)}
                  className="px-3 py-1.5 glass-capsule hover:text-red-400 text-text-secondary-light font-bold text-xs rounded-xl flex items-center gap-1 transition-all"
                  title="Supprimer"
                >
                  <Trash2 size={14} />
                </button>
              </div>
            </div>
          </motion.div>
        ))}

        {filtered.length === 0 && (
          <div className="glass-card-premium p-12 text-center col-span-full">
            <Wine className="w-12 h-12 text-text-secondary-light dark:text-text-secondary-dark mx-auto mb-4 opacity-50" />
            <p className="text-text-secondary-light dark:text-text-secondary-dark font-medium">Aucun approvisionnement de boisson trouvé.</p>
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
                  <h3 className="text-2xl font-bold text-text-primary-light dark:text-text-primary-dark">Nouvel Appro Boisson</h3>
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
                  <label className="text-xs font-semibold text-text-primary-light dark:text-text-primary-dark uppercase tracking-wider ml-1">Boisson</label>
                  {boissons.length > 0 ? (
                    <select
                      value={boissonId}
                      onChange={(e) => setBoissonId(e.target.value)}
                      required
                      className="w-full px-4 py-3 bg-white/5 dark:bg-slate-900 border border-white/10 rounded-2xl focus:outline-none focus:ring-2 focus:ring-accent-light/50 text-text-primary-light dark:text-text-primary-dark text-sm font-semibold"
                    >
                      <option value="" disabled className="dark:bg-slate-900 text-text-secondary-light">Sélectionner une boisson...</option>
                      {boissons.map((b) => (
                        <option key={b.id} value={b.id} className="dark:bg-slate-900 font-semibold text-text-primary-light">
                          {b.nomBoisson}{b.contenance ? ` (${b.contenance})` : ""}
                        </option>
                      ))}
                    </select>
                  ) : (
                    <input
                      type="text"
                      value={boissonId}
                      onChange={(e) => setBoissonId(e.target.value)}
                      required
                      placeholder="ID Boisson (ex: UUID)"
                      className="w-full px-4 py-3 bg-white/5 border border-white/10 rounded-2xl focus:outline-none focus:ring-2 focus:ring-accent-light/50 text-text-primary-light dark:text-text-primary-dark text-xs font-mono font-semibold"
                    />
                  )}
                </div>

                <div className="space-y-1">
                  <label className="text-xs font-semibold text-text-primary-light dark:text-text-primary-dark uppercase tracking-wider ml-1">ID Casier (UUID)</label>
                  <input
                    type="text"
                    value={casierId}
                    onChange={(e) => setCasierId(e.target.value)}
                    required
                    placeholder="3fa85f64-5717-4562-b3fc-2c963f66afa6"
                    className="w-full px-4 py-3 bg-white/5 border border-white/10 rounded-2xl focus:outline-none focus:ring-2 focus:ring-accent-light/50 text-text-primary-light dark:text-text-primary-dark text-xs font-mono font-semibold"
                  />
                </div>

                <div className="grid grid-cols-2 gap-4">
                  <div className="space-y-1">
                    <label className="text-xs font-semibold text-text-primary-light dark:text-text-primary-dark uppercase tracking-wider ml-1">Prix d'Achat (F CFA)</label>
                    <input
                      type="number"
                      value={prixAchat}
                      onChange={(e) => setPrixAchat(Number(e.target.value))}
                      required
                      min={0}
                      className="w-full px-4 py-3 bg-white/5 border border-white/10 rounded-2xl focus:outline-none focus:ring-2 focus:ring-accent-light/50 text-text-primary-light dark:text-text-primary-dark text-sm font-semibold"
                    />
                  </div>

                  <div className="space-y-1">
                    <label className="text-xs font-semibold text-text-primary-light dark:text-text-primary-dark uppercase tracking-wider ml-1">Nbre Casiers</label>
                    <input
                      type="number"
                      value={nbreCasier}
                      onChange={(e) => setNbreCasier(Number(e.target.value))}
                      required
                      min={1}
                      className="w-full px-4 py-3 bg-white/5 border border-white/10 rounded-2xl focus:outline-none focus:ring-2 focus:ring-accent-light/50 text-text-primary-light dark:text-text-primary-dark text-sm font-semibold"
                    />
                  </div>
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

      {/* Inspect Modal */}
      <AnimatePresence>
        {isInspectOpen && selectedAppro && (
          <div className="fixed inset-0 bg-black/40 backdrop-blur-md z-[100] flex items-center justify-center p-4">
            <motion.div
              initial={{ scale: 0.95, opacity: 0 }}
              animate={{ scale: 1, opacity: 1 }}
              exit={{ scale: 0.95, opacity: 0 }}
              className="glass-card-premium w-full max-w-md p-8 relative overflow-hidden border border-white/20 dark:border-white/5"
            >
              <div className="flex justify-between items-center mb-6">
                <div className="flex items-center gap-2">
                  <Info className="w-5 h-5 text-accent-light" />
                  <h3 className="text-xl font-bold text-text-primary-light dark:text-text-primary-dark">Fiche Appro Boisson</h3>
                </div>
                <button
                  onClick={() => setIsInspectOpen(false)}
                  className="p-1.5 rounded-xl hover:bg-black/5 dark:hover:bg-white/5 text-text-secondary-light transition-colors"
                >
                  <X size={20} />
                </button>
              </div>

              <div className="space-y-4">
                <div className="p-4 rounded-2xl bg-black/5 dark:bg-white/5 border border-black/10 dark:border-white/5 space-y-1">
                  <span className="text-[10px] font-bold text-text-secondary-light uppercase tracking-widest block">Boisson</span>
                  <span className="text-sm font-bold text-text-primary-light dark:text-text-primary-dark block">{getBoissonName(selectedAppro)}</span>
                </div>

                <div className="p-4 rounded-2xl bg-black/5 dark:bg-white/5 border border-black/10 dark:border-white/5 space-y-1">
                  <span className="text-[10px] font-bold text-text-secondary-light uppercase tracking-widest block">ID Approvisionnement</span>
                  <span className="text-xs font-mono font-bold text-accent-light block select-all">{selectedAppro.id}</span>
                </div>

                <div className="p-4 rounded-2xl bg-black/5 dark:bg-white/5 border border-black/10 dark:border-white/5 space-y-1">
                  <span className="text-[10px] font-bold text-text-secondary-light uppercase tracking-widest block">ID Casier</span>
                  <span className="text-xs font-mono font-bold text-text-primary-light dark:text-text-primary-dark block select-all">{selectedAppro.casierId}</span>
                </div>

                <div className="grid grid-cols-2 gap-4">
                  <div className="p-4 rounded-2xl bg-black/5 dark:bg-white/5 border border-black/10 dark:border-white/5 space-y-1">
                    <span className="text-[10px] font-bold text-text-secondary-light uppercase tracking-widest block">Nbre Casiers</span>
                    <span className="text-sm font-extrabold text-text-primary-light dark:text-text-primary-dark block">{selectedAppro.nbreCasier}</span>
                  </div>
                  <div className="p-4 rounded-2xl bg-black/5 dark:bg-white/5 border border-black/10 dark:border-white/5 space-y-1">
                    <span className="text-[10px] font-bold text-text-secondary-light uppercase tracking-widest block">Prix d'Achat</span>
                    <span className="text-sm font-extrabold text-success-light block">{selectedAppro.prixAchat} F CFA</span>
                  </div>
                </div>
              </div>

              <button
                onClick={() => setIsInspectOpen(false)}
                className="w-full py-3.5 mt-6 glass-capsule rounded-2xl font-bold text-sm text-text-primary-light dark:text-text-primary-dark transition-all"
              >
                Fermer
              </button>
            </motion.div>
          </div>
        )}
      </AnimatePresence>

      {/* Edit Modal */}
      <AnimatePresence>
        {isEditOpen && selectedAppro && (
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
                  <h3 className="text-xl font-bold text-text-primary-light dark:text-text-primary-dark">Modifier Appro Boisson</h3>
                </div>
                <button
                  onClick={() => setIsEditOpen(false)}
                  className="p-1.5 rounded-xl hover:bg-black/5 dark:hover:bg-white/5 text-text-secondary-light transition-colors"
                >
                  <X size={20} />
                </button>
              </div>

              <form onSubmit={handleUpdate} className="space-y-4">
                <div className="space-y-1">
                  <label className="text-xs font-semibold text-text-primary-light dark:text-text-primary-dark uppercase tracking-wider ml-1">ID Casier</label>
                  <input
                    type="text"
                    value={editCasierId}
                    onChange={(e) => setEditCasierId(e.target.value)}
                    required
                    className="w-full px-4 py-3 bg-white/5 border border-white/10 rounded-2xl focus:outline-none focus:ring-2 focus:ring-accent-light/50 text-text-primary-light dark:text-text-primary-dark text-xs font-mono font-semibold"
                  />
                </div>

                <div className="grid grid-cols-2 gap-4">
                  <div className="space-y-1">
                    <label className="text-xs font-semibold text-text-primary-light dark:text-text-primary-dark uppercase tracking-wider ml-1">Prix d'Achat (F CFA)</label>
                    <input
                      type="number"
                      value={editPrixAchat}
                      onChange={(e) => setEditPrixAchat(Number(e.target.value))}
                      required
                      min={0}
                      className="w-full px-4 py-3 bg-white/5 border border-white/10 rounded-2xl focus:outline-none focus:ring-2 focus:ring-accent-light/50 text-text-primary-light dark:text-text-primary-dark text-sm font-semibold"
                    />
                  </div>

                  <div className="space-y-1">
                    <label className="text-xs font-semibold text-text-primary-light dark:text-text-primary-dark uppercase tracking-wider ml-1">Nbre Casiers</label>
                    <input
                      type="number"
                      value={editNbreCasier}
                      onChange={(e) => setEditNbreCasier(Number(e.target.value))}
                      required
                      min={1}
                      className="w-full px-4 py-3 bg-white/5 border border-white/10 rounded-2xl focus:outline-none focus:ring-2 focus:ring-accent-light/50 text-text-primary-light dark:text-text-primary-dark text-sm font-semibold"
                    />
                  </div>
                </div>

                <div className="flex gap-4 pt-4">
                  <button
                    type="button"
                    onClick={() => setIsEditOpen(false)}
                    className="flex-1 py-3.5 glass-capsule rounded-2xl font-bold text-sm text-text-primary-light dark:text-text-primary-dark transition-all"
                  >
                    Annuler
                  </button>
                  <button
                    type="submit"
                    disabled={submitting}
                    className="flex-1 py-3.5 bg-accent-light hover:bg-accent-dark text-white rounded-2xl font-bold text-sm flex items-center justify-center gap-2 shadow-lg transition-all disabled:opacity-50"
                  >
                    {submitting ? <Loader2 className="w-5 h-5 animate-spin" /> : "Sauvegarder"}
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
