import React, { useState, useEffect } from "react";
import {
  Clock,
  CheckCircle2,
  Building2,
  Calendar,
  User,
  Power,
  Loader2
} from "lucide-react";
import {
  listInactiveRestaurants,
  activateRestaurant,
  getActivationHistory
} from "../../../services/restaurant.service";
import type {
  RestaurantResponse,
  RestaurantActivationHistoryResponse
} from "../../../types/restaurant";
import { AccessDenied } from "../../../components/AccessDenied";
import { AdminSkeleton } from "../../../components/RestoSkeletons";

export const AdminView: React.FC = () => {
  const [inactiveRestaurants, setInactiveRestaurants] = useState<RestaurantResponse[]>([]);
  const [activationHistory, setActivationHistory] = useState<RestaurantActivationHistoryResponse[]>([]);
  const [loading, setLoading] = useState(true);
  const [activatingId, setActivatingId] = useState<string | null>(null);
  const [isDenied, setIsDenied] = useState(false);
  const [success, setSuccess] = useState<string | null>(null);

  const fetchData = async () => {
    try {
      setLoading(true);
      setIsDenied(false);
      const [inactiveRes, historyRes] = await Promise.all([
        listInactiveRestaurants(),
        getActivationHistory()
      ]);
      setInactiveRestaurants(inactiveRes.data);
      setActivationHistory(historyRes.data);
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

  const handleActivate = async (id: string) => {
    setSuccess(null);
    setActivatingId(id);

    try {
      await activateRestaurant(id);
      setSuccess("Établissement activé avec succès !");
      fetchData();
    } catch (err: any) {
      console.error(err);
    } finally {
      setActivatingId(null);
    }
  };

  if (loading) {
    return (
      <div className="space-y-10">
        <div className="space-y-2 w-1/3">
          <div className="h-8 bg-black/10 dark:bg-white/5 rounded-xl animate-pulse" />
          <div className="h-4 bg-black/10 dark:bg-white/5 rounded-lg animate-pulse w-2/3" />
        </div>
        <AdminSkeleton />
      </div>
    );
  }

  if (isDenied) {
    return (
      <AccessDenied
        requiredRole="SUPERADMIN"
        description="L'accès à l'administration globale est strictement réservé aux comptes de niveau Super-Administrateur."
      />
    );
  }

  return (
    <div className="space-y-10">
      <div>
        <h2 className="text-3xl font-extrabold text-text-primary-light dark:text-text-primary-dark tracking-tight">
          Super-Administration
        </h2>
        <p className="text-text-secondary-light dark:text-text-secondary-dark mt-1">
          Activez de nouveaux établissements et suivez l'historique de déploiement de la plateforme.
        </p>
      </div>

      {success && (
        <div className="p-4 bg-green-500/10 border border-green-500/20 rounded-2xl text-green-500 text-sm font-medium flex items-center gap-2">
          <CheckCircle2 size={18} />
          {success}
        </div>
      )}

      <div className="grid grid-cols-1 lg:grid-cols-2 gap-8">
        {/* Left Side: Inactive Restaurants */}
        <div className="glass-card-premium p-6 flex flex-col h-full">
          <div className="flex items-center gap-3 mb-6">
            <div className="w-10 h-10 rounded-xl bg-warning-light/15 flex items-center justify-center">
              <Power className="w-5 h-5 text-warning-light" />
            </div>
            <div>
              <h3 className="text-lg font-bold text-text-primary-light dark:text-text-primary-dark">Demandes d'Activation</h3>
              <p className="text-xs text-text-secondary-light dark:text-text-secondary-dark">Restaurants en attente d'approbation d'un Superadmin.</p>
            </div>
          </div>

          <div className="space-y-4 flex-1 overflow-y-auto max-h-[500px] pr-2">
            {inactiveRestaurants.map((resto) => (
              <div
                key={resto.id}
                className="p-4 rounded-2xl bg-black/5 dark:bg-white/5 border border-black/10 dark:border-white/5 flex flex-col sm:flex-row sm:items-center justify-between gap-4"
              >
                <div className="flex gap-4 items-center">
                  <div className="w-12 h-12 rounded-xl bg-accent-light/10 flex items-center justify-center text-accent-light flex-shrink-0">
                    <Building2 size={20} />
                  </div>
                  <div>
                    <h4 className="font-bold text-sm text-text-primary-light dark:text-text-primary-dark">{resto.name}</h4>
                    <p className="text-xs text-text-secondary-light dark:text-text-secondary-dark font-medium">{resto.cuisine} • {resto.address}</p>
                  </div>
                </div>

                <button
                  onClick={() => handleActivate(resto.id)}
                  disabled={activatingId === resto.id}
                  className="px-4 py-2 bg-accent-light hover:bg-accent-dark disabled:opacity-50 text-white font-bold text-xs rounded-xl flex items-center justify-center gap-2 transition-all self-end sm:self-auto hover:scale-105"
                >
                  {activatingId === resto.id ? (
                    <Loader2 className="w-4 h-4 animate-spin" />
                  ) : (
                    <>
                      <Power size={14} />
                      Activer
                    </>
                  )}
                </button>
              </div>
            ))}

            {inactiveRestaurants.length === 0 && (
              <div className="text-center py-12">
                <CheckCircle2 className="w-10 h-10 text-success-light mx-auto mb-3 opacity-80" />
                <p className="text-sm font-semibold text-text-primary-light dark:text-text-primary-dark">Tous les restaurants sont actifs !</p>
                <p className="text-xs text-text-secondary-light dark:text-text-secondary-dark mt-1">Aucune demande d'approbation en attente.</p>
              </div>
            )}
          </div>
        </div>

        {/* Right Side: Activation History Log */}
        <div className="glass-card-premium p-6 flex flex-col h-full">
          <div className="flex items-center gap-3 mb-6">
            <div className="w-10 h-10 rounded-xl bg-accent-light/15 flex items-center justify-center">
              <Clock className="w-5 h-5 text-accent-light" />
            </div>
            <div>
              <h3 className="text-lg font-bold text-text-primary-light dark:text-text-primary-dark">Historique de Déploiement</h3>
              <p className="text-xs text-text-secondary-light dark:text-text-secondary-dark font-medium">Historique complet des activations d'établissements.</p>
            </div>
          </div>

          <div className="space-y-4 flex-1 overflow-y-auto max-h-[500px] pr-2">
            {activationHistory.map((log) => (
              <div
                key={log.id}
                className="p-4 rounded-2xl bg-black/5 dark:bg-white/5 border border-black/10 dark:border-white/5 flex flex-col gap-2"
              >
                <div className="flex justify-between items-start">
                  <h4 className="font-bold text-sm text-text-primary-light dark:text-text-primary-dark flex items-center gap-2">
                    <Building2 size={14} className="text-accent-light" />
                    {log.restaurantName}
                  </h4>
                  <span className="text-[10px] font-bold text-success-light uppercase tracking-wider bg-success-light/10 px-2 py-0.5 rounded-md">
                    Activé
                  </span>
                </div>

                <div className="grid grid-cols-2 gap-2 pt-2 border-t border-black/5 dark:border-white/5 text-xs text-text-secondary-light dark:text-text-secondary-dark font-medium">
                  <div className="flex items-center gap-1.5">
                    <Calendar size={12} className="text-accent-light" />
                    <span>{new Date(log.activatedAt).toLocaleDateString()}</span>
                  </div>
                  <div className="flex items-center gap-1.5">
                    <User size={12} className="text-accent-light" />
                    <span className="line-clamp-1">Par: {log.activatedBy}</span>
                  </div>
                </div>
              </div>
            ))}

            {activationHistory.length === 0 && (
              <div className="text-center py-12">
                <Clock className="w-10 h-10 text-text-secondary-light dark:text-text-secondary-dark mx-auto mb-3 opacity-50" />
                <p className="text-sm font-semibold text-text-primary-light dark:text-text-primary-dark">Aucune activation enregistrée</p>
                <p className="text-xs text-text-secondary-light dark:text-text-secondary-dark mt-1">L'historique est actuellement vide.</p>
              </div>
            )}
          </div>
        </div>
      </div>
    </div>
  );
};
