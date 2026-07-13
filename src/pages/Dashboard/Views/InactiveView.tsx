import React, { useState, useEffect } from "react";
import { motion } from "framer-motion";
import {
  Search,
  Building2,
  MapPin,
  Phone,
  Calendar,
  EyeOff,
  Power,
  Loader2,
  CheckCircle2
} from "lucide-react";
import { listInactiveRestaurants, activateRestaurant } from "../../../services/restaurant.service";
import type { RestaurantResponse } from "../../../types/restaurant";
import { AccessDenied } from "../../../components/AccessDenied";
import { RestaurantSkeleton } from "../../../components/RestoSkeletons";

export const InactiveView: React.FC = () => {
  const [restaurants, setRestaurants] = useState<RestaurantResponse[]>([]);
  const [loading, setLoading] = useState(true);
  const [isDenied, setIsDenied] = useState(false);
  const [search, setSearch] = useState("");
  const [activatingId, setActivatingId] = useState<string | null>(null);
  const [success, setSuccess] = useState<string | null>(null);

  const fetchInactive = async () => {
    try {
      setLoading(true);
      setIsDenied(false);
      const res = await listInactiveRestaurants();
      setRestaurants(res.data);
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
    fetchInactive();
  }, []);

  const handleActivate = async (id: string) => {
    setSuccess(null);
    setActivatingId(id);
    try {
      await activateRestaurant(id);
      setSuccess("Établissement activé avec succès !");
      // Refresh the list immediately
      const res = await listInactiveRestaurants();
      setRestaurants(res.data);
    } catch (err: any) {
      console.error(err);
    } finally {
      setActivatingId(null);
    }
  };

  const filtered = restaurants.filter(r =>
    r.name.toLowerCase().includes(search.toLowerCase()) ||
    r.address.toLowerCase().includes(search.toLowerCase())
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
        requiredRole="SUPERADMIN"
        description="L'accès à la liste des restaurants inactifs est strictement réservé aux comptes de niveau Super-Administrateur (SUPERADMIN)."
      />
    );
  }

  return (
    <div className="space-y-8">
      {/* Upper info / Search */}
      <div className="flex flex-col md:flex-row items-stretch md:items-center justify-between gap-4">
        <div>
          <h2 className="text-3xl font-extrabold text-text-primary-light dark:text-text-primary-dark tracking-tight flex items-center gap-3">
            Restaurants Inactifs
          </h2>
          <p className="text-text-secondary-light dark:text-text-secondary-dark mt-1">
            Consultez et activez les établissements en attente de validation.
          </p>
        </div>

        <div className="relative group min-w-[240px]">
          <Search className="absolute left-4 top-1/2 -translate-y-1/2 w-5 h-5 text-text-secondary-light dark:text-text-secondary-dark group-focus-within:text-accent-light transition-colors" />
          <input
            type="text"
            placeholder="Rechercher par nom..."
            value={search}
            onChange={(e) => setSearch(e.target.value)}
            className="w-full pl-12 pr-4 py-3 bg-white/5 border border-white/10 rounded-2xl focus:outline-none focus:ring-2 focus:ring-accent-light/50 focus:border-accent-light transition-all text-text-primary-light dark:text-text-primary-dark text-sm"
          />
        </div>
      </div>

      {success && (
        <div className="p-4 bg-green-500/10 border border-green-500/20 rounded-2xl text-green-500 text-sm font-medium flex items-center gap-2">
          <CheckCircle2 size={18} />
          {success}
        </div>
      )}

      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
        {filtered.map((restaurant) => (
          <motion.div
            key={restaurant.id}
            whileHover={{ y: -5 }}
            className="glass-card-premium overflow-hidden flex flex-col group relative"
          >
            <div className="h-40 bg-gradient-to-tr from-slate-900 via-slate-950 to-red-950/20 flex items-center justify-center relative">
              <EyeOff className="w-16 h-16 text-danger-light/10 group-hover:scale-110 transition-transform duration-300" />
              <div className="absolute top-4 right-4 px-3 py-1 bg-red-500/10 border border-red-500/20 rounded-full">
                <span className="text-[10px] font-bold text-red-500 uppercase tracking-wider">
                  Inactif
                </span>
              </div>
            </div>

            <div className="p-6 flex-1 flex flex-col">
              <h3 className="text-xl font-bold text-text-primary-light dark:text-text-primary-dark group-hover:text-accent-light transition-colors mb-4">
                {restaurant.name}
              </h3>

              <div className="space-y-3 pt-4 border-t border-black/5 dark:border-white/5 mt-auto">
                <div className="flex items-center gap-2.5 text-sm text-text-secondary-light dark:text-text-secondary-dark font-medium">
                  <MapPin className="w-4 h-4 text-accent-light" />
                  <span className="line-clamp-1">{restaurant.address}</span>
                </div>
                <div className="flex items-center gap-2.5 text-sm text-text-secondary-light dark:text-text-secondary-dark font-medium">
                  <Phone className="w-4 h-4 text-accent-light" />
                  <span>{restaurant.phone}</span>
                </div>
                <div className="flex items-center gap-2.5 text-xs text-text-secondary-light dark:text-text-secondary-dark font-semibold">
                  <Calendar className="w-3.5 h-3.5 text-accent-light" />
                  <span>Créé le: {new Date(restaurant.createdAt).toLocaleDateString()}</span>
                </div>

                <div className="pt-4 border-t border-black/5 dark:border-white/5 flex justify-end">
                  <button
                    onClick={() => handleActivate(restaurant.id)}
                    disabled={activatingId === restaurant.id}
                    className="px-4 py-2 bg-accent-light hover:bg-accent-dark disabled:opacity-50 text-white font-bold text-xs rounded-xl flex items-center justify-center gap-2 transition-all hover:scale-105"
                  >
                    {activatingId === restaurant.id ? (
                      <Loader2 className="w-4 h-4 animate-spin" />
                    ) : (
                      <>
                        <Power size={14} />
                        Activer l'établissement
                      </>
                    )}
                  </button>
                </div>
              </div>
            </div>
          </motion.div>
        ))}

        {filtered.length === 0 && (
          <div className="glass-card-premium p-12 text-center col-span-full">
            <Building2 className="w-12 h-12 text-text-secondary-light dark:text-text-secondary-dark mx-auto mb-4 opacity-50" />
            <p className="text-text-secondary-light dark:text-text-secondary-dark font-medium">Aucun établissement inactif ne correspond à vos critères.</p>
          </div>
        )}
      </div>
    </div>
  );
};
