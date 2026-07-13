import React, { useState, useEffect } from "react";
import {
  Clock,
  Building2,
  Calendar,
  CheckCircle2
} from "lucide-react";
import { getActivationHistory } from "../../../services/restaurant.service";
import type { RestaurantActivationHistoryResponse } from "../../../types/restaurant";
import { AccessDenied } from "../../../components/AccessDenied";
import { AdminSkeleton } from "../../../components/RestoSkeletons";

export const HistoryView: React.FC = () => {
  const [history, setHistory] = useState<RestaurantActivationHistoryResponse[]>([]);
  const [loading, setLoading] = useState(true);
  const [isDenied, setIsDenied] = useState(false);

  const fetchHistory = async () => {
    try {
      setLoading(true);
      setIsDenied(false);
      const res = await getActivationHistory();
      setHistory(res.data);
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
    fetchHistory();
  }, []);

  if (loading) {
    return (
      <div className="space-y-8">
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
        description="L'accès à l'historique complet d'activation est réservé aux comptes de niveau Super-Administrateur (SUPERADMIN)."
      />
    );
  }

  return (
    <div className="space-y-8">
      <div>
        <h2 className="text-3xl font-extrabold text-text-primary-light dark:text-text-primary-dark tracking-tight">
          Historique d'activation
        </h2>
        <p className="text-text-secondary-light dark:text-text-secondary-dark mt-1">
          Suivez le déploiement et l'activation des nouveaux restaurants de la plateforme.
        </p>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
        {history.map((log) => (
          <div
            key={log.id}
            className="glass-card-premium p-6 flex flex-col justify-between space-y-4 relative overflow-hidden"
          >
            <div className="absolute top-0 left-0 w-full h-1 bg-gradient-to-r from-accent-light/40 to-accent-neon/40" />

            <div className="space-y-2">
              <div className="flex justify-between items-start">
                <div className="flex items-center gap-2">
                  <Building2 className="w-5 h-5 text-accent-light" />
                  <span className="font-bold text-sm text-text-primary-light dark:text-text-primary-dark">
                    Restaurant ID
                  </span>
                </div>
                <span className={`text-[10px] font-bold uppercase tracking-wider px-2 py-0.5 rounded-md ${
                  log.status === "PENDING"
                    ? "bg-warning-light/10 text-warning-light"
                    : "bg-success-light/10 text-success-light"
                }`}>
                  {log.status}
                </span>
              </div>
              <p className="text-xs font-mono text-text-secondary-light dark:text-text-secondary-dark line-clamp-1">
                {log.restaurantId}
              </p>
            </div>

            <div className="pt-4 border-t border-black/5 dark:border-white/5 space-y-2 text-xs text-text-secondary-light dark:text-text-secondary-dark font-medium">
              <div className="flex items-center gap-2">
                <Calendar size={14} className="text-accent-light" />
                <span>Demandé le: {new Date(log.requestedAt).toLocaleString()}</span>
              </div>
              {log.processedAt && (
                <div className="flex items-center gap-2">
                  <CheckCircle2 size={14} className="text-success-light" />
                  <span>Traité le: {new Date(log.processedAt).toLocaleString()}</span>
                </div>
              )}
            </div>
          </div>
        ))}

        {history.length === 0 && (
          <div className="glass-card-premium p-12 text-center col-span-full">
            <Clock className="w-12 h-12 text-text-secondary-light dark:text-text-secondary-dark mx-auto mb-4 opacity-50" />
            <p className="text-text-secondary-light dark:text-text-secondary-dark font-medium">Aucun historique d'activation n'est enregistré.</p>
          </div>
        )}
      </div>
    </div>
  );
};
