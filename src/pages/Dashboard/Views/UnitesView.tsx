import React, { useState, useEffect } from "react";
import { motion, AnimatePresence } from "framer-motion";
import {
  Search,
  Scale,
  Calendar,
  Building2,
  Plus,
  X,
  Loader2,
  CheckCircle2,
  Sparkles
} from "lucide-react";
import { listUnites, createUnite } from "../../../services/restaurant.service";
import type { UniteResponse } from "../../../types/restaurant";
import { AccessDenied } from "../../../components/AccessDenied";
import { RestaurantSkeleton } from "../../../components/RestoSkeletons";

// Back-end custom enum for exact alignment
const UNITE_TYPES = ["kg", "litres"];

export const UnitesView: React.FC = () => {
  const [unites, setUnites] = useState<UniteResponse[]>([]);
  const [loading, setLoading] = useState(true);
  const [isDenied, setIsDenied] = useState(false);
  const [search, setSearch] = useState("");
  const [success, setSuccess] = useState<string | null>(null);
  const [error, setError] = useState<string | null>(null);

  // Creation modal states
  const [isCreateOpen, setIsCreateOpen] = useState(false);
  const [unite, setUnite] = useState("");
  const [submitting, setSubmitting] = useState(false);

  const fetchUnites = async () => {
    try {
      setLoading(true);
      setIsDenied(false);
      const res = await listUnites();
      setUnites(res.data);
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
    fetchUnites();
  }, []);

  const handleCreate = async (e: React.FormEvent) => {
    e.preventDefault();
    setSuccess(null);
    setError(null);
    setSubmitting(true);

    try {
      await createUnite({ unite });
      setSuccess("Unité de mesure créée avec succès !");
      setUnite("");
      setIsCreateOpen(false);
      fetchUnites();
    } catch (err: any) {
      console.error(err);
      setError(err.response?.data?.detail?.[0]?.msg || err.response?.data?.detail || "Échec de la création de l'unité.");
    } finally {
      setSubmitting(false);
    }
  };

  const filtered = unites.filter(u =>
    u.unite.toLowerCase().includes(search.toLowerCase()) ||
    u.restaurantId.toLowerCase().includes(search.toLowerCase())
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
        requiredRole="MEMBRE"
        description="L'accès à la liste des unités nécessite des permissions d'établissement actives."
      />
    );
  }

  return (
    <div className="space-y-8">
      {/* Upper info / Search */}
      <div className="flex flex-col md:flex-row items-stretch md:items-center justify-between gap-4">
        <div>
          <h2 className="text-3xl font-extrabold text-text-primary-light dark:text-text-primary-dark tracking-tight flex items-center gap-3">
            Unités de Mesure
          </h2>
          <p className="text-text-secondary-light dark:text-text-secondary-dark mt-1">
            Gérez et visualisez les unités de mesure associées à vos ingrédients et condiments.
          </p>
        </div>

        <div className="flex flex-col sm:flex-row gap-3 items-stretch sm:items-center">
          <div className="relative group min-w-[240px]">
            <Search className="absolute left-4 top-1/2 -translate-y-1/2 w-5 h-5 text-text-secondary-light dark:text-text-secondary-dark group-focus-within:text-accent-light transition-colors" />
            <input
              type="text"
              placeholder="Rechercher..."
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
            Créer une unité
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
        {filtered.map((u) => (
          <motion.div
            key={u.id}
            whileHover={{ y: -5 }}
            className="glass-card-premium overflow-hidden flex flex-col group relative"
          >
            <div className="h-32 bg-gradient-to-tr from-slate-900 via-slate-950 to-blue-950/20 flex items-center justify-center relative">
              <Scale className="w-12 h-12 text-accent-light/10 group-hover:scale-110 transition-transform duration-300" />
              <div className="absolute top-4 right-4 px-3 py-1 bg-black/60 backdrop-blur-md rounded-full flex items-center gap-1 border border-white/10">
                <span className="text-[10px] font-bold text-white uppercase tracking-wider">
                  {u.isActive ? "Actif" : "Inactif"}
                </span>
              </div>
            </div>

            <div className="p-6 flex-1 flex flex-col justify-between">
              <div>
                <h3 className="text-xl font-bold text-text-primary-light dark:text-text-primary-dark group-hover:text-accent-light transition-colors mb-4 uppercase tracking-wide">
                  {u.unite}
                </h3>

                <div className="space-y-3 pt-4 border-t border-black/5 dark:border-white/5 text-sm text-text-secondary-light dark:text-text-secondary-dark font-medium">
                  <div className="flex items-center gap-2.5">
                    <Building2 className="w-4 h-4 text-accent-light" />
                    <span className="line-clamp-1 font-mono text-xs">ID Resto: {u.restaurantId}</span>
                  </div>
                  <div className="flex items-center gap-2.5 text-xs text-text-secondary-light dark:text-text-secondary-dark font-semibold">
                    <Calendar className="w-3.5 h-3.5 text-accent-light" />
                    <span>Créé le: {new Date(u.createdAt).toLocaleDateString()}</span>
                  </div>
                </div>
              </div>
            </div>
          </motion.div>
        ))}

        {filtered.length === 0 && (
          <div className="glass-card-premium p-12 text-center col-span-full">
            <Scale className="w-12 h-12 text-text-secondary-light dark:text-text-secondary-dark mx-auto mb-4 opacity-50" />
            <p className="text-text-secondary-light dark:text-text-secondary-dark font-medium">Aucune unité de mesure ne correspond à votre recherche.</p>
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
                  <h3 className="text-2xl font-bold text-text-primary-light dark:text-text-primary-dark">Nouvelle Unité</h3>
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
                  <label className="text-xs font-semibold text-text-primary-light dark:text-text-primary-dark uppercase tracking-wider ml-1">Type d'unité</label>
                  <select
                    value={unite}
                    onChange={(e) => setUnite(e.target.value)}
                    required
                    className="w-full px-4 py-3 bg-white/5 dark:bg-slate-900 border border-white/10 rounded-2xl focus:outline-none focus:ring-2 focus:ring-accent-light/50 focus:border-accent-light transition-all text-text-primary-light dark:text-text-primary-dark text-sm font-semibold"
                  >
                    <option value="" disabled className="dark:bg-slate-900 text-text-secondary-light">Choisir l'unité...</option>
                    {UNITE_TYPES.map(t => (
                      <option key={t} value={t} className="dark:bg-slate-900 text-text-primary-light font-semibold">
                        {t}
                      </option>
                    ))}
                  </select>
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
                    {submitting ? <Loader2 className="w-5 h-5 animate-spin" /> : "Créer l'unité"}
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
