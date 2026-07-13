import React, { useState, useEffect } from "react";
import { motion } from "framer-motion";
import {
  Search,
  Building2,
  MapPin,
  Phone,
  UserPlus,
  Loader2,
  CheckCircle2,
  Sparkles
} from "lucide-react";
import { listRestaurants, joinRestaurant } from "../../../services/restaurant.service";
import type { RestaurantResponse } from "../../../types/restaurant";
import { useAuth } from "../../../contexts/AuthContext";
import { RestaurantSkeleton } from "../../../components/RestoSkeletons";

export const JoinView: React.FC = () => {
  const { user } = useAuth();
  const [restaurants, setRestaurants] = useState<RestaurantResponse[]>([]);
  const [loading, setLoading] = useState(true);
  const [joiningId, setJoiningId] = useState<string | null>(null);
  const [search, setSearch] = useState("");
  const [success, setSuccess] = useState<string | null>(null);
  const [error, setError] = useState<string | null>(null);

  // Check user role from global AuthContext seed
  const userRoles = (user?.roles || []).map(r => r.name.toUpperCase());
  const isManagement = userRoles.includes("SUPERADMIN") || userRoles.includes("ADMIN");

  const fetchActiveRestaurants = async () => {
    try {
      setLoading(true);
      setError(null);
      const res = await listRestaurants();
      // Show only active restaurants available for staff to join
      setRestaurants(res.data.filter(r => r.isActive));
    } catch (err: any) {
      console.error(err);
      setError("Impossible de charger les établissements d'affiliation.");
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchActiveRestaurants();
  }, []);

  const handleJoin = async (id: string, name: string) => {
    setSuccess(null);
    setError(null);
    setJoiningId(id);

    try {
      await joinRestaurant(id);
      setSuccess(`Votre demande d'affiliation pour le restaurant "${name}" a été enregistrée avec succès (PENDING) !`);
    } catch (err: any) {
      console.error(err);
      setError(err.response?.data?.detail || "Échec de l'enregistrement de l'affiliation.");
    } finally {
      setJoiningId(null);
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

  return (
    <div className="space-y-8">
      {/* Header bar */}
      <div className="flex flex-col md:flex-row items-stretch md:items-center justify-between gap-4">
        <div>
          <h2 className="text-3xl font-extrabold text-text-primary-light dark:text-text-primary-dark tracking-tight">
            Affiliation de Prestige
          </h2>
          <p className="text-text-secondary-light dark:text-text-secondary-dark mt-1">
            Rejoignez un établissement d'exception et débutez votre activité professionnelle.
          </p>
        </div>

        <div className="relative group min-w-[240px]">
          <Search className="absolute left-4 top-1/2 -translate-y-1/2 w-5 h-5 text-text-secondary-light dark:text-text-secondary-dark group-focus-within:text-accent-light transition-colors" />
          <input
            type="text"
            placeholder="Rechercher par nom, adresse..."
            value={search}
            onChange={(e) => setSearch(e.target.value)}
            className="w-full pl-12 pr-4 py-3 bg-white/5 border border-white/10 rounded-2xl focus:outline-none focus:ring-2 focus:ring-accent-light/50 focus:border-accent-light transition-all text-text-primary-light dark:text-text-primary-dark text-sm"
          />
        </div>
      </div>

      {isManagement && (
        <div className="p-6 bg-accent-light/10 border border-accent-light/20 rounded-3xl flex flex-col md:flex-row gap-5 items-center relative overflow-hidden">
          <div className="absolute top-0 right-0 w-32 h-32 bg-accent-light/5 blur-xl rounded-full" />
          <div className="w-12 h-12 rounded-2xl bg-accent-light/20 flex items-center justify-center flex-shrink-0">
            <Sparkles className="w-6 h-6 text-accent-light animate-pulse" />
          </div>
          <div>
            <h4 className="font-bold text-text-primary-light dark:text-text-primary-dark text-lg">Administrateur / Super-administrateur</h4>
            <p className="text-sm text-text-secondary-light dark:text-text-secondary-dark mt-1">
              Vous possédez déjà des privilèges d'accès globaux ou d'administration d'établissements d'après vos permissions de rôle.
            </p>
          </div>
        </div>
      )}

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
        {filtered.map((restaurant) => (
          <motion.div
            key={restaurant.id}
            whileHover={{ y: -5 }}
            className="glass-card-premium overflow-hidden flex flex-col group relative"
          >
            <div className="h-32 bg-gradient-to-tr from-slate-900 via-slate-950 to-blue-950/20 flex items-center justify-center relative">
              <Building2 className="w-12 h-12 text-accent-light/10 group-hover:scale-110 transition-transform duration-300" />
            </div>

            <div className="p-6 flex-1 flex flex-col justify-between">
              <div>
                <h3 className="text-xl font-bold text-text-primary-light dark:text-text-primary-dark group-hover:text-accent-light transition-colors mb-4">
                  {restaurant.name}
                </h3>

                <div className="space-y-3 pt-4 border-t border-black/5 dark:border-white/5 text-sm text-text-secondary-light dark:text-text-secondary-dark font-medium">
                  <div className="flex items-center gap-2.5">
                    <MapPin className="w-4 h-4 text-accent-light" />
                    <span className="line-clamp-1">{restaurant.address}</span>
                  </div>
                  <div className="flex items-center gap-2.5">
                    <Phone className="w-4 h-4 text-accent-light" />
                    <span>{restaurant.phone}</span>
                  </div>
                </div>
              </div>

              <div className="pt-6 border-t border-black/5 dark:border-white/5 mt-6 flex justify-end">
                <button
                  onClick={() => handleJoin(restaurant.id, restaurant.name)}
                  disabled={joiningId === restaurant.id || isManagement}
                  className="w-full py-3 bg-accent-light hover:bg-accent-dark disabled:opacity-40 disabled:cursor-not-allowed text-white font-bold text-xs rounded-xl flex items-center justify-center gap-2 transition-all hover:scale-105"
                >
                  {joiningId === restaurant.id ? (
                    <Loader2 className="w-4 h-4 animate-spin" />
                  ) : (
                    <>
                      <UserPlus size={14} />
                      Rejoindre l'établissement
                    </>
                  )}
                </button>
              </div>
            </div>
          </motion.div>
        ))}

        {filtered.length === 0 && (
          <div className="glass-card-premium p-12 text-center col-span-full">
            <Building2 className="w-12 h-12 text-text-secondary-light dark:text-text-secondary-dark mx-auto mb-4 opacity-50" />
            <p className="text-text-secondary-light dark:text-text-secondary-dark font-medium">Aucun établissement de prestige n'est disponible.</p>
          </div>
        )}
      </div>
    </div>
  );
};
