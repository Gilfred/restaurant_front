import React, { useState, useEffect } from "react";
import { motion } from "framer-motion";
import {
  Building2,
  MapPin,
  Phone,
  Calendar,
  Briefcase,
  ShieldCheck,
  HelpCircle,
  Clock
} from "lucide-react";
import { getMeRestaurant } from "../../../services/restaurant.service";
import type { MeRestaurantResponse } from "../../../types/restaurant";
import { RestaurantSkeleton } from "../../../components/RestoSkeletons";

export const MyRestaurantView: React.FC = () => {
  const [data, setData] = useState<MeRestaurantResponse | null>(null);
  const [loading, setLoading] = useState(true);

  const fetchMeRestaurant = async () => {
    try {
      setLoading(true);
      const res = await getMeRestaurant();
      setData(res.data);
    } catch (err: any) {
      console.error(err);
      setData(null);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchMeRestaurant();
  }, []);

  if (loading) {
    return (
      <div className="space-y-8">
        <div className="space-y-2 w-1/3">
          <div className="h-8 bg-black/10 dark:bg-white/5 rounded-xl animate-pulse" />
          <div className="h-4 bg-black/10 dark:bg-white/5 rounded-lg animate-pulse w-2/3" />
        </div>
        <RestaurantSkeleton />
      </div>
    );
  }

  if (!data || !data.restaurant) {
    return (
      <div className="flex flex-col items-center justify-center min-h-[50vh] p-8 text-center">
        <motion.div
          initial={{ scale: 0.95, opacity: 0 }}
          animate={{ scale: 1, opacity: 1 }}
          className="glass-card-premium max-w-lg p-10 relative overflow-hidden"
        >
          <div className="w-20 h-20 mx-auto rounded-3xl bg-accent-light/10 flex items-center justify-center mb-6">
            <Building2 className="w-10 h-10 text-accent-light" />
          </div>

          <h2 className="text-2xl font-bold text-text-primary-light dark:text-text-primary-dark mb-4">
            Aucun Restaurant Associé
          </h2>

          <p className="text-text-secondary-light dark:text-text-secondary-dark leading-relaxed mb-8">
            Vous n'êtes actuellement associé à aucun établissement actif. Vous pouvez formuler une demande d'affiliation depuis l'onglet "Rejoindre".
          </p>

          <div className="flex gap-4 justify-center">
            <a
              href="mailto:support@luminaeats.com"
              className="inline-flex items-center gap-2 px-6 py-3 glass-capsule rounded-xl text-sm font-bold text-text-primary-light dark:text-text-primary-dark"
            >
              <HelpCircle className="w-4 h-4" />
              Support
            </a>
          </div>
        </motion.div>
      </div>
    );
  }

  const { restaurant, role, status } = data;

  return (
    <div className="space-y-8">
      <div>
        <h2 className="text-3xl font-extrabold text-text-primary-light dark:text-text-primary-dark tracking-tight">
          Mon Établissement
        </h2>
        <p className="text-text-secondary-light dark:text-text-secondary-dark mt-1">
          Consultez les détails et votre statut de collaboration au sein de votre établissement d'affiliation.
        </p>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
        {/* Left Side: General Info Card */}
        <div className="lg:col-span-2 glass-card-premium p-8 relative overflow-hidden">
          <div className="absolute top-0 left-0 w-full h-1 bg-gradient-to-r from-accent-light/40 to-accent-neon/40" />

          <div className="flex items-center gap-5 mb-8">
            <div className="w-16 h-16 rounded-2xl bg-accent-light/10 flex items-center justify-center text-accent-light flex-shrink-0">
              <Building2 size={32} />
            </div>
            <div>
              <h3 className="text-2xl font-bold text-text-primary-light dark:text-text-primary-dark">{restaurant.name}</h3>
              <span className={`inline-flex items-center gap-1.5 px-3 py-1 rounded-full mt-2 text-xs font-bold uppercase tracking-wider ${
                status === "PENDING"
                  ? "bg-warning-light/10 text-warning-light"
                  : "bg-success-light/10 text-success-light"
              }`}>
                <Clock size={12} />
                Affiliation: {status}
              </span>
            </div>
          </div>

          <div className="grid grid-cols-1 sm:grid-cols-2 gap-6 pt-6 border-t border-black/5 dark:border-white/5">
            <div className="space-y-1">
              <span className="text-[10px] font-bold text-text-secondary-light dark:text-text-secondary-dark uppercase tracking-widest block">
                Adresse Géographique
              </span>
              <div className="flex items-center gap-2 text-text-primary-light dark:text-text-primary-dark font-medium">
                <MapPin size={16} className="text-accent-light" />
                <span>{restaurant.address}</span>
              </div>
            </div>

            <div className="space-y-1">
              <span className="text-[10px] font-bold text-text-secondary-light dark:text-text-secondary-dark uppercase tracking-widest block">
                Contact Téléphonique
              </span>
              <div className="flex items-center gap-2 text-text-primary-light dark:text-text-primary-dark font-medium">
                <Phone size={16} className="text-accent-light" />
                <span>{restaurant.phone}</span>
              </div>
            </div>

            <div className="space-y-1">
              <span className="text-[10px] font-bold text-text-secondary-light dark:text-text-secondary-dark uppercase tracking-widest block">
                Date de Création
              </span>
              <div className="flex items-center gap-2 text-text-primary-light dark:text-text-primary-dark font-medium">
                <Calendar size={16} className="text-accent-light" />
                <span>{new Date(restaurant.createdAt).toLocaleDateString()}</span>
              </div>
            </div>
          </div>
        </div>

        {/* Right Side: Role & Permissions Card */}
        <div className="glass-card-premium p-8 flex flex-col justify-between relative overflow-hidden">
          <div className="absolute top-0 left-0 w-full h-1 bg-gradient-to-r from-purple-500/40 to-accent-light/40" />

          <div>
            <div className="flex items-center gap-3 mb-6">
              <div className="w-10 h-10 rounded-xl bg-purple-500/10 flex items-center justify-center text-purple-500">
                <Briefcase size={20} />
              </div>
              <div>
                <h4 className="font-bold text-lg text-text-primary-light dark:text-text-primary-dark">Votre Rôle d'Accès</h4>
                <p className="text-xs text-text-secondary-light dark:text-text-secondary-dark">Permissions d'équipe attribuées.</p>
              </div>
            </div>

            {role ? (
              <div className="space-y-4">
                <div className="p-4 rounded-2xl bg-black/5 dark:bg-white/5 border border-black/10 dark:border-white/5">
                  <span className="font-extrabold text-accent-light text-sm uppercase tracking-wider block mb-1">
                    {role.name}
                  </span>
                  <p className="text-xs text-text-secondary-light dark:text-text-secondary-dark leading-relaxed font-medium">
                    {role.description || "Aucune description de rôle fournie."}
                  </p>
                </div>

                <div className="space-y-2">
                  <span className="text-[10px] font-bold text-text-secondary-light dark:text-text-secondary-dark uppercase tracking-widest block">
                    Permissions d'Accès
                  </span>
                  <div className="flex flex-wrap gap-1.5">
                    {role.permissions?.map((perm) => (
                      <span
                        key={perm.id}
                        className="inline-flex items-center gap-1 px-2.5 py-1 bg-accent-light/10 text-accent-light font-bold text-[10px] uppercase rounded-md tracking-wide"
                        title={perm.description}
                      >
                        <ShieldCheck size={10} />
                        {perm.name}
                      </span>
                    ))}
                    {(!role.permissions || role.permissions.length === 0) && (
                      <span className="text-xs text-text-secondary-light dark:text-text-secondary-dark italic font-medium">
                        Aucune permission spécifique accordée.
                      </span>
                    )}
                  </div>
                </div>
              </div>
            ) : (
              <div className="p-6 text-center">
                <Clock className="w-10 h-10 text-warning-light mx-auto mb-3 animate-spin" />
                <p className="text-sm font-bold text-text-primary-light dark:text-text-primary-dark">Attribution en cours</p>
                <p className="text-xs text-text-secondary-light dark:text-text-secondary-dark mt-1">
                  En attente de validation du propriétaire de l'établissement.
                </p>
              </div>
            )}
          </div>
        </div>
      </div>
    </div>
  );
};
