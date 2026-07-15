import React, { useState, useEffect } from "react";
import { motion } from "framer-motion";
import {
  Search,
  Salad,
  Calendar,
  Building2
} from "lucide-react";
import { listCondiments } from "../../../services/restaurant.service";
import type { CondimentResponse } from "../../../types/restaurant";
import { AccessDenied } from "../../../components/AccessDenied";
import { RestaurantSkeleton } from "../../../components/RestoSkeletons";

export const CondimentsView: React.FC = () => {
  const [condiments, setCondiments] = useState<CondimentResponse[]>([]);
  const [loading, setLoading] = useState(true);
  const [isDenied, setIsDenied] = useState(false);
  const [search, setSearch] = useState("");

  const fetchCondiments = async () => {
    try {
      setLoading(true);
      setIsDenied(false);
      const res = await listCondiments();
      setCondiments(res.data);
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
    fetchCondiments();
  }, []);

  const filtered = condiments.filter(c =>
    c.nomcondiment.toLowerCase().includes(search.toLowerCase()) ||
    c.restaurantId.toLowerCase().includes(search.toLowerCase())
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
        description="L'accès à la liste des condiments nécessite des permissions d'établissement actives."
      />
    );
  }

  return (
    <div className="space-y-8">
      {/* Upper info / Search */}
      <div className="flex flex-col md:flex-row items-stretch md:items-center justify-between gap-4">
        <div>
          <h2 className="text-3xl font-extrabold text-text-primary-light dark:text-text-primary-dark tracking-tight flex items-center gap-3">
            Condiments de Cuisine
          </h2>
          <p className="text-text-secondary-light dark:text-text-secondary-dark mt-1">
            Visualisez et filtrez les condiments et accompagnements enregistrés pour vos plats.
          </p>
        </div>

        <div className="relative group min-w-[240px]">
          <Search className="absolute left-4 top-1/2 -translate-y-1/2 w-5 h-5 text-text-secondary-light dark:text-text-secondary-dark group-focus-within:text-accent-light transition-colors" />
          <input
            type="text"
            placeholder="Rechercher un condiment..."
            value={search}
            onChange={(e) => setSearch(e.target.value)}
            className="w-full pl-12 pr-4 py-3 bg-white/5 border border-white/10 rounded-2xl focus:outline-none focus:ring-2 focus:ring-accent-light/50 focus:border-accent-light transition-all text-text-primary-light dark:text-text-primary-dark text-sm"
          />
        </div>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
        {filtered.map((condiment) => (
          <motion.div
            key={condiment.id}
            whileHover={{ y: -5 }}
            className="glass-card-premium overflow-hidden flex flex-col group relative"
          >
            <div className="h-32 bg-gradient-to-tr from-slate-900 via-slate-950 to-green-950/20 flex items-center justify-center relative">
              <Salad className="w-12 h-12 text-success-light/10 group-hover:scale-110 transition-transform duration-300" />
            </div>

            <div className="p-6 flex-1 flex flex-col justify-between">
              <div>
                <h3 className="text-xl font-bold text-text-primary-light dark:text-text-primary-dark group-hover:text-accent-light transition-colors mb-4">
                  {condiment.nomcondiment}
                </h3>

                <div className="space-y-3 pt-4 border-t border-black/5 dark:border-white/5 text-sm text-text-secondary-light dark:text-text-secondary-dark font-medium">
                  <div className="flex items-center gap-2.5">
                    <Building2 className="w-4 h-4 text-accent-light" />
                    <span className="line-clamp-1 font-mono text-xs">ID Resto: {condiment.restaurantId}</span>
                  </div>
                  <div className="flex items-center gap-2.5 text-xs text-text-secondary-light dark:text-text-secondary-dark font-semibold">
                    <Calendar className="w-3.5 h-3.5 text-accent-light" />
                    <span>Créé le: {new Date(condiment.createdAt).toLocaleDateString()}</span>
                  </div>
                </div>
              </div>
            </div>
          </motion.div>
        ))}

        {filtered.length === 0 && (
          <div className="glass-card-premium p-12 text-center col-span-full">
            <Salad className="w-12 h-12 text-text-secondary-light dark:text-text-secondary-dark mx-auto mb-4 opacity-50" />
            <p className="text-text-secondary-light dark:text-text-secondary-dark font-medium">Aucun condiment ne correspond à votre recherche.</p>
          </div>
        )}
      </div>
    </div>
  );
};
