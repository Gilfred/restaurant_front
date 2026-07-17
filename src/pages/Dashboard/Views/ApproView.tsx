import React, { useState, useEffect } from "react";
import { motion, AnimatePresence } from "framer-motion";
import {
  Search,
  CookingPot,
  Calendar,
  Sparkles,
  X,
  Loader2,
  CheckCircle2,
  Eye,
  Info,
  Plus
} from "lucide-react";
import {
  listAppros,
  createAppro,
  getAppro,
  listCondiments,
  listUnites
} from "../../../services/restaurant.service";
import type { ApproResponse, CondimentResponse, UniteResponse } from "../../../types/restaurant";
import { AccessDenied } from "../../../components/AccessDenied";
import { RestaurantSkeleton } from "../../../components/RestoSkeletons";

export const ApproView: React.FC = () => {
  const [appros, setAppros] = useState<ApproResponse[]>([]);
  const [condiments, setCondiments] = useState<CondimentResponse[]>([]);
  const [unites, setUnites] = useState<UniteResponse[]>([]);

  const [loading, setLoading] = useState(true);
  const [isDenied, setIsDenied] = useState(false);
  const [search, setSearch] = useState("");
  const [success, setSuccess] = useState<string | null>(null);
  const [error, setError] = useState<string | null>(null);

  // Creation modal states
  const [isCreateOpen, setIsCreateOpen] = useState(false);
  const [condimentId, setCondimentId] = useState("");
  const [uniteId, setUniteId] = useState("");
  const [prix, setPrix] = useState<number>(0);
  const [qte, setQte] = useState<number>(0);
  const [submitting, setSubmitting] = useState(false);

  // Detailed inspect states
  const [selectedAppro, setSelectedAppro] = useState<ApproResponse | null>(null);
  const [inspecting, setInspecting] = useState(false);

  const fetchData = async () => {
    try {
      setLoading(true);
      setIsDenied(false);
      const [approsRes, condRes, unitesRes] = await Promise.all([
        listAppros(),
        listCondiments(),
        listUnites()
      ]);
      setAppros(approsRes.data);
      setCondiments(condRes.data);
      setUnites(unitesRes.data);
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

  const handleCreate = async (e: React.FormEvent) => {
    e.preventDefault();
    setSuccess(null);
    setError(null);
    setSubmitting(true);

    try {
      await createAppro({ condimentId, uniteId, prix, qte });
      setSuccess("Approvisionnement de cuisine créé avec succès !");
      setCondimentId("");
      setUniteId("");
      setPrix(0);
      setQte(0);
      setIsCreateOpen(false);
      fetchData();
    } catch (err: any) {
      console.error(err);
      setError(err.response?.data?.detail?.[0]?.msg || err.response?.data?.detail || "Échec de la création de l'approvisionnement.");
    } finally {
      setSubmitting(false);
    }
  };

  const handleInspect = async (id: string) => {
    setInspecting(true);
    try {
      const res = await getAppro(id);
      setSelectedAppro(res.data);
    } catch (err: any) {
      console.error(err);
    } finally {
      setInspecting(false);
    }
  };

  // Helpers to resolve Names instead of UUIDs in rendering
  const getCondimentName = (id: string) => {
    const condiment = condiments.find(c => c.id === id);
    return condiment ? condiment.nomcondiment : `ID: ${id.substring(0, 8)}`;
  };

  const getUniteName = (id: string) => {
    const unite = unites.find(u => u.id === id);
    return unite ? unite.unite : `ID: ${id.substring(0, 8)}`;
  };

  const filtered = appros.filter(a => {
    const name = getCondimentName(a.condimentId).toLowerCase();
    return name.includes(search.toLowerCase()) || a.condimentId.toLowerCase().includes(search.toLowerCase());
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
        requiredRole="MEMBRE CUISINE"
        description="L'accès à l'approvisionnement de la cuisine nécessite des permissions d'établissement actives de niveau Cuisine."
      />
    );
  }

  return (
    <div className="space-y-8">
      {/* Upper info / Search */}
      <div className="flex flex-col md:flex-row items-stretch md:items-center justify-between gap-4">
        <div>
          <h2 className="text-3xl font-extrabold text-text-primary-light dark:text-text-primary-dark tracking-tight flex items-center gap-3">
            Approvisionnements Cuisine
          </h2>
          <p className="text-text-secondary-light dark:text-text-secondary-dark mt-1">
            Gérez et suivez les approvisionnements en condiments et unités de cuisine.
          </p>
        </div>

        <div className="flex flex-col sm:flex-row gap-3 items-stretch sm:items-center">
          <div className="relative group min-w-[240px]">
            <Search className="absolute left-4 top-1/2 -translate-y-1/2 w-5 h-5 text-text-secondary-light dark:text-text-secondary-dark group-focus-within:text-accent-light transition-colors" />
            <input
              type="text"
              placeholder="Rechercher par condiment..."
              value={search}
              onChange={(e) => setSearch(e.target.value)}
              className="w-full pl-12 pr-4 py-3 bg-white/5 border border-white/10 rounded-2xl focus:outline-none focus:ring-2 focus:ring-accent-light/50 focus:border-accent-light transition-all text-text-primary-light dark:text-text-primary-dark text-sm"
            />
          </div>

          <button
            onClick={() => setIsCreateOpen(true)}
            className="inline-flex items-center justify-center gap-2 px-5 py-3 bg-accent-light hover:bg-accent-dark text-white rounded-2xl font-bold transition-all shadow-lg hover:shadow-accent-light/20 active:scale-[0.98]"
          >
            <Plus size={20} />
            Nouveau Appro
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
            <div className="h-32 bg-gradient-to-tr from-slate-900 via-slate-950 to-blue-950/20 flex items-center justify-center relative">
              <CookingPot className="w-12 h-12 text-accent-light/10 group-hover:scale-110 transition-transform duration-300" />
            </div>

            <div className="p-6 flex-1 flex flex-col justify-between">
              <div>
                <h3 className="text-xl font-bold text-text-primary-light dark:text-text-primary-dark group-hover:text-accent-light transition-colors mb-4 line-clamp-1">
                  {getCondimentName(appro.condimentId)}
                </h3>

                <div className="space-y-3 pt-4 border-t border-black/5 dark:border-white/5 text-sm text-text-secondary-light dark:text-text-secondary-dark font-medium">
                  <div className="flex justify-between items-center text-xs">
                    <span className="text-text-secondary-light font-semibold uppercase tracking-wider">Quantité</span>
                    <span className="font-extrabold text-text-primary-light dark:text-text-primary-dark">{appro.qte} {getUniteName(appro.uniteId)}</span>
                  </div>
                  <div className="flex justify-between items-center text-xs">
                    <span className="text-text-secondary-light font-semibold uppercase tracking-wider">Prix</span>
                    <span className="font-extrabold text-success-light">{appro.prix} €</span>
                  </div>
                  <div className="flex items-center gap-2 text-xs text-text-secondary-light dark:text-text-secondary-dark font-semibold pt-1">
                    <Calendar className="w-3.5 h-3.5 text-accent-light" />
                    <span>Créé le: {new Date(appro.createdAt).toLocaleDateString()}</span>
                  </div>
                </div>
              </div>

              <div className="pt-4 border-t border-black/5 dark:border-white/5 mt-4 flex justify-end">
                <button
                  onClick={() => handleInspect(appro.id)}
                  disabled={inspecting}
                  className="px-3.5 py-1.5 glass-capsule hover:text-accent-light dark:hover:text-accent-dark text-text-secondary-light dark:text-text-secondary-dark font-bold text-xs rounded-xl flex items-center gap-1 transition-all hover:scale-105"
                >
                  <Eye size={12} />
                  Inspecter
                </button>
              </div>
            </div>
          </motion.div>
        ))}

        {filtered.length === 0 && (
          <div className="glass-card-premium p-12 text-center col-span-full">
            <CookingPot className="w-12 h-12 text-text-secondary-light dark:text-text-secondary-dark mx-auto mb-4 opacity-50" />
            <p className="text-text-secondary-light dark:text-text-secondary-dark font-medium">Aucun approvisionnement ne correspond à votre recherche.</p>
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
              className="glass-card-premium w-full max-w-md p-8 relative overflow-hidden glass-reflection border border-white/20 dark:border-white/5"
            >
              <div className="flex justify-between items-center mb-6">
                <div className="flex items-center gap-2">
                  <Sparkles className="w-5 h-5 text-accent-light animate-pulse" />
                  <h3 className="text-2xl font-bold text-text-primary-light dark:text-text-primary-dark">Nouveau Appro</h3>
                </div>
                <button
                  onClick={() => setIsCreateOpen(false)}
                  className="p-1.5 rounded-xl hover:bg-black/5 dark:hover:bg-white/5 text-text-secondary-light dark:text-text-secondary-dark transition-colors"
                >
                  <X size={20} />
                </button>
              </div>

              <form onSubmit={handleCreate} className="space-y-4">
                <div className="space-y-1">
                  <label className="text-xs font-semibold text-text-primary-light dark:text-text-primary-dark uppercase tracking-wider ml-1">Condiment</label>
                  <select
                    value={condimentId}
                    onChange={(e) => setCondimentId(e.target.value)}
                    required
                    className="w-full px-4 py-3 bg-white/5 dark:bg-slate-900 border border-white/10 rounded-2xl focus:outline-none focus:ring-2 focus:ring-accent-light/50 focus:border-accent-light transition-all text-text-primary-light dark:text-text-primary-dark text-sm font-semibold"
                  >
                    <option value="" disabled className="dark:bg-slate-900 text-text-secondary-light">Sélectionner un condiment...</option>
                    {condiments.map(c => (
                      <option key={c.id} value={c.id} className="dark:bg-slate-900 text-text-primary-light font-semibold">
                        {c.nomcondiment}
                      </option>
                    ))}
                  </select>
                </div>

                <div className="space-y-1">
                  <label className="text-xs font-semibold text-text-primary-light dark:text-text-primary-dark uppercase tracking-wider ml-1">Unité de mesure</label>
                  <select
                    value={uniteId}
                    onChange={(e) => setUniteId(e.target.value)}
                    required
                    className="w-full px-4 py-3 bg-white/5 dark:bg-slate-900 border border-white/10 rounded-2xl focus:outline-none focus:ring-2 focus:ring-accent-light/50 focus:border-accent-light transition-all text-text-primary-light dark:text-text-primary-dark text-sm font-semibold"
                  >
                    <option value="" disabled className="dark:bg-slate-900 text-text-secondary-light">Sélectionner une unité...</option>
                    {unites.map(u => (
                      <option key={u.id} value={u.id} className="dark:bg-slate-900 text-text-primary-light font-semibold">
                        {u.unite} {u.isActive ? "" : "(Inactif)"}
                      </option>
                    ))}
                  </select>
                </div>

                <div className="grid grid-cols-2 gap-4">
                  <div className="space-y-1">
                    <label className="text-xs font-semibold text-text-primary-light dark:text-text-primary-dark uppercase tracking-wider ml-1">Quantité</label>
                    <input
                      type="number"
                      value={qte}
                      onChange={(e) => setQte(Number(e.target.value))}
                      required
                      min={1}
                      placeholder="10"
                      className="w-full px-4 py-3 bg-white/5 border border-white/10 rounded-2xl focus:outline-none focus:ring-2 focus:ring-accent-light/50 focus:border-accent-light transition-all text-text-primary-light dark:text-text-primary-dark text-sm font-semibold"
                    />
                  </div>

                  <div className="space-y-1">
                    <label className="text-xs font-semibold text-text-primary-light dark:text-text-primary-dark uppercase tracking-wider ml-1">Prix (€)</label>
                    <input
                      type="number"
                      value={prix}
                      onChange={(e) => setPrix(Number(e.target.value))}
                      required
                      min={0.01}
                      step="0.01"
                      placeholder="15.50"
                      className="w-full px-4 py-3 bg-white/5 border border-white/10 rounded-2xl focus:outline-none focus:ring-2 focus:ring-accent-light/50 focus:border-accent-light transition-all text-text-primary-light dark:text-text-primary-dark text-sm font-semibold"
                    />
                  </div>
                </div>

                <div className="flex gap-4 pt-4">
                  <button
                    type="button"
                    onClick={() => setIsCreateOpen(false)}
                    className="flex-1 py-3.5 glass-capsule rounded-2xl font-bold text-sm text-text-primary-light dark:text-text-primary-dark hover:scale-[1.02] transition-all"
                  >
                    Annuler
                  </button>
                  <button
                    type="submit"
                    disabled={submitting}
                    className="flex-1 py-3.5 bg-accent-light hover:bg-accent-dark text-white rounded-2xl font-bold text-sm flex items-center justify-center gap-2 shadow-lg hover:shadow-accent-light/20 transition-all hover:scale-[1.02] disabled:opacity-50"
                  >
                    {submitting ? <Loader2 className="w-5 h-5 animate-spin" /> : "Créer l'Appro"}
                  </button>
                </div>
              </form>
            </motion.div>
          </div>
        )}
      </AnimatePresence>

      {/* Inspect Detail Modal */}
      <AnimatePresence>
        {selectedAppro && (
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
                  <h3 className="text-xl font-bold text-text-primary-light dark:text-text-primary-dark">Fiche Approvisionnement</h3>
                </div>
                <button
                  onClick={() => setSelectedAppro(null)}
                  className="p-1.5 rounded-xl hover:bg-black/5 dark:hover:bg-white/5 text-text-secondary-light dark:text-text-secondary-dark transition-colors"
                >
                  <X size={20} />
                </button>
              </div>

              <div className="space-y-4">
                <div className="p-4 rounded-2xl bg-black/5 dark:bg-white/5 border border-black/10 dark:border-white/5 space-y-1">
                  <span className="text-[10px] font-bold text-text-secondary-light dark:text-text-secondary-dark uppercase tracking-widest block">ID Approvisionnement</span>
                  <span className="text-xs font-mono font-bold text-accent-light block select-all">{selectedAppro.id}</span>
                </div>

                <div className="p-4 rounded-2xl bg-black/5 dark:bg-white/5 border border-black/10 dark:border-white/5 space-y-1">
                  <span className="text-[10px] font-bold text-text-secondary-light dark:text-text-secondary-dark uppercase tracking-widest block">Nom Condiment</span>
                  <span className="text-sm font-bold text-text-primary-light dark:text-text-primary-dark block">{getCondimentName(selectedAppro.condimentId)}</span>
                </div>

                <div className="p-4 rounded-2xl bg-black/5 dark:bg-white/5 border border-black/10 dark:border-white/5 space-y-1">
                  <span className="text-[10px] font-bold text-text-secondary-light dark:text-text-secondary-dark uppercase tracking-widest block">Unité de mesure</span>
                  <span className="text-sm font-bold text-text-primary-light dark:text-text-primary-dark block">{getUniteName(selectedAppro.uniteId)}</span>
                </div>

                <div className="grid grid-cols-2 gap-4">
                  <div className="p-4 rounded-2xl bg-black/5 dark:bg-white/5 border border-black/10 dark:border-white/5 space-y-1">
                    <span className="text-[10px] font-bold text-text-secondary-light dark:text-text-secondary-dark uppercase tracking-widest block">Quantité</span>
                    <span className="text-sm font-extrabold text-text-primary-light dark:text-text-primary-dark block">{selectedAppro.qte}</span>
                  </div>
                  <div className="p-4 rounded-2xl bg-black/5 dark:bg-white/5 border border-black/10 dark:border-white/5 space-y-1">
                    <span className="text-[10px] font-bold text-text-secondary-light dark:text-text-secondary-dark uppercase tracking-widest block">Prix</span>
                    <span className="text-sm font-extrabold text-success-light block">{selectedAppro.prix} €</span>
                  </div>
                </div>

                <div className="p-4 rounded-2xl bg-black/5 dark:bg-white/5 border border-black/10 dark:border-white/5 space-y-1">
                  <span className="text-[10px] font-bold text-text-secondary-light dark:text-text-secondary-dark uppercase tracking-widest block">Création & Enregistrement</span>
                  <span className="text-xs font-semibold text-text-primary-light dark:text-text-primary-dark block">{new Date(selectedAppro.createdAt).toLocaleString()}</span>
                </div>
              </div>

              <button
                onClick={() => setSelectedAppro(null)}
                className="w-full py-3.5 mt-6 glass-capsule rounded-2xl font-bold text-sm text-text-primary-light dark:text-text-primary-dark hover:scale-[1.01] transition-all"
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
