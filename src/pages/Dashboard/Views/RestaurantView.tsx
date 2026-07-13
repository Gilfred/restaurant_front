import React, { useState, useEffect } from "react";
import { motion, AnimatePresence } from "framer-motion";
import {
  Plus,
  Search,
  MapPin,
  UtensilsCrossed,
  Sparkles,
  Building2,
  X,
  Loader2,
  CheckCircle2,
  Star
} from "lucide-react";
import { listRestaurants, createRestaurant } from "../../../services/restaurant.service";
import type { RestaurantResponse, RestaurantCreate } from "../../../types/restaurant";
import { RestaurantSkeleton } from "../../../components/RestoSkeletons";

export const RestaurantView: React.FC = () => {
  const [restaurants, setRestaurants] = useState<RestaurantResponse[]>([]);
  const [loading, setLoading] = useState(true);
  const [search, setSearch] = useState("");
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [success, setSuccess] = useState<string | null>(null);

  // Form states
  const [name, setName] = useState("");
  const [cuisine, setCuisine] = useState("");
  const [description, setDescription] = useState("");
  const [address, setAddress] = useState("");
  const [image, setImage] = useState("");
  const [submitting, setSubmitting] = useState(false);

  const fetchRestaurants = async () => {
    try {
      setLoading(true);
      const res = await listRestaurants();
      setRestaurants(res.data);
    } catch (err: any) {
      console.error(err);
      setError("Impossible de charger les restaurants.");
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchRestaurants();
  }, []);

  const handleCreate = async (e: React.FormEvent) => {
    e.preventDefault();
    setError(null);
    setSuccess(null);
    setSubmitting(true);

    try {
      const payload: RestaurantCreate = {
        name,
        cuisine,
        description,
        address,
        image: image || "https://images.unsplash.com/photo-1517248135467-4c7edcad34c4?auto=format&fit=crop&w=800&q=80",
        rating: 5.0
      };

      await createRestaurant(payload);
      setSuccess("Restaurant créé avec succès !");
      setName("");
      setCuisine("");
      setDescription("");
      setAddress("");
      setImage("");
      setIsModalOpen(false);
      fetchRestaurants();
    } catch (err: any) {
      console.error(err);
      setError(err.response?.data?.detail || "Échec de la création du restaurant.");
    } finally {
      setSubmitting(false);
    }
  };

  const filtered = restaurants.filter(r =>
    r.name.toLowerCase().includes(search.toLowerCase()) ||
    r.cuisine.toLowerCase().includes(search.toLowerCase()) ||
    r.address.toLowerCase().includes(search.toLowerCase())
  );

  return (
    <div className="space-y-8">
      {/* Upper bar with Actions & Search */}
      <div className="flex flex-col md:flex-row items-stretch md:items-center justify-between gap-4">
        <div>
          <h2 className="text-3xl font-extrabold text-text-primary-light dark:text-text-primary-dark tracking-tight">
            Restaurants
          </h2>
          <p className="text-text-secondary-light dark:text-text-secondary-dark mt-1">
            Gérez vos établissements et découvrez de nouvelles adresses de prestige.
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
            onClick={() => setIsModalOpen(true)}
            className="inline-flex items-center justify-center gap-2 px-5 py-3 bg-accent-light hover:bg-accent-dark text-white rounded-2xl font-bold transition-all shadow-lg hover:shadow-accent-light/20 active:scale-[0.98]"
          >
            <Plus size={20} />
            Ajouter un restaurant
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

      {/* Grid of restaurants */}
      {loading ? (
        <RestaurantSkeleton />
      ) : (
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
          {filtered.map((restaurant) => (
            <motion.div
              key={restaurant.id}
              whileHover={{ y: -5 }}
              className="glass-card-premium overflow-hidden flex flex-col group relative"
            >
              <div className="h-48 overflow-hidden relative">
                <img
                  src={restaurant.image || "https://images.unsplash.com/photo-1517248135467-4c7edcad34c4?auto=format&fit=crop&w=800&q=80"}
                  alt={restaurant.name}
                  className="w-full h-full object-cover transition-transform duration-500 group-hover:scale-115"
                />
                <div className="absolute top-4 right-4 px-3 py-1 bg-black/60 backdrop-blur-md rounded-full flex items-center gap-1 border border-white/10">
                  <Star className="w-3.5 h-3.5 text-yellow-400 fill-yellow-400" />
                  <span className="text-xs font-bold text-white">{restaurant.rating || 5.0}</span>
                </div>

                {!restaurant.isActive && (
                  <div className="absolute inset-0 bg-black/50 backdrop-blur-xs flex items-center justify-center">
                    <span className="px-4 py-2 bg-warning-light text-white font-bold text-xs uppercase tracking-widest rounded-full shadow-lg">
                      En attente d'activation
                    </span>
                  </div>
                )}
              </div>

              <div className="p-6 flex-1 flex flex-col">
                <div className="flex justify-between items-start mb-2">
                  <h3 className="text-xl font-bold text-text-primary-light dark:text-text-primary-dark group-hover:text-accent-light transition-colors">
                    {restaurant.name}
                  </h3>
                </div>

                <p className="text-sm text-text-secondary-light dark:text-text-secondary-dark mb-4 line-clamp-2">
                  {restaurant.description}
                </p>

                <div className="mt-auto space-y-3 pt-4 border-t border-black/5 dark:border-white/5">
                  <div className="flex items-center gap-2.5 text-sm text-text-secondary-light dark:text-text-secondary-dark font-medium">
                    <UtensilsCrossed className="w-4 h-4 text-accent-light" />
                    <span>{restaurant.cuisine}</span>
                  </div>
                  <div className="flex items-center gap-2.5 text-sm text-text-secondary-light dark:text-text-secondary-dark font-medium">
                    <MapPin className="w-4 h-4 text-accent-light" />
                    <span className="line-clamp-1">{restaurant.address}</span>
                  </div>
                </div>
              </div>
            </motion.div>
          ))}

          {filtered.length === 0 && (
            <div className="glass-card-premium p-12 text-center col-span-full">
              <Building2 className="w-12 h-12 text-text-secondary-light dark:text-text-secondary-dark mx-auto mb-4 opacity-50" />
              <p className="text-text-secondary-light dark:text-text-secondary-dark font-medium">Aucun restaurant de prestige ne correspond à vos critères.</p>
            </div>
          )}
        </div>
      )}

      {/* Modern Creation Modal */}
      <AnimatePresence>
        {isModalOpen && (
          <div className="fixed inset-0 bg-black/40 backdrop-blur-md z-[100] flex items-center justify-center p-4">
            <motion.div
              initial={{ scale: 0.95, opacity: 0 }}
              animate={{ scale: 1, opacity: 1 }}
              exit={{ scale: 0.95, opacity: 0 }}
              className="glass-card-premium w-full max-w-lg p-8 relative overflow-hidden glass-reflection border border-white/20 dark:border-white/5"
            >
              <div className="flex justify-between items-center mb-6">
                <div className="flex items-center gap-2">
                  <Sparkles className="w-5 h-5 text-accent-light animate-pulse" />
                  <h3 className="text-2xl font-bold text-text-primary-light dark:text-text-primary-dark">Nouveau Restaurant</h3>
                </div>
                <button
                  onClick={() => setIsModalOpen(false)}
                  className="p-1.5 rounded-xl hover:bg-black/5 dark:hover:bg-white/5 text-text-secondary-light dark:text-text-secondary-dark transition-colors"
                >
                  <X size={20} />
                </button>
              </div>

              <form onSubmit={handleCreate} className="space-y-4">
                <div className="space-y-1">
                  <label className="text-xs font-semibold text-text-primary-light dark:text-text-primary-dark uppercase tracking-wider ml-1">Nom de l'établissement</label>
                  <input
                    type="text"
                    value={name}
                    onChange={(e) => setName(e.target.value)}
                    required
                    placeholder="L'Orangerie, Paris"
                    className="w-full px-4 py-3 bg-white/5 border border-white/10 rounded-2xl focus:outline-none focus:ring-2 focus:ring-accent-light/50 focus:border-accent-light transition-all text-text-primary-light dark:text-text-primary-dark text-sm"
                  />
                </div>

                <div className="space-y-1">
                  <label className="text-xs font-semibold text-text-primary-light dark:text-text-primary-dark uppercase tracking-wider ml-1">Cuisine / Spécialité</label>
                  <input
                    type="text"
                    value={cuisine}
                    onChange={(e) => setCuisine(e.target.value)}
                    required
                    placeholder="Française Gastronomique"
                    className="w-full px-4 py-3 bg-white/5 border border-white/10 rounded-2xl focus:outline-none focus:ring-2 focus:ring-accent-light/50 focus:border-accent-light transition-all text-text-primary-light dark:text-text-primary-dark text-sm"
                  />
                </div>

                <div className="space-y-1">
                  <label className="text-xs font-semibold text-text-primary-light dark:text-text-primary-dark uppercase tracking-wider ml-1">Adresse</label>
                  <input
                    type="text"
                    value={address}
                    onChange={(e) => setAddress(e.target.value)}
                    required
                    placeholder="8 Avenue des Champs-Élysées, Paris"
                    className="w-full px-4 py-3 bg-white/5 border border-white/10 rounded-2xl focus:outline-none focus:ring-2 focus:ring-accent-light/50 focus:border-accent-light transition-all text-text-primary-light dark:text-text-primary-dark text-sm"
                  />
                </div>

                <div className="space-y-1">
                  <label className="text-xs font-semibold text-text-primary-light dark:text-text-primary-dark uppercase tracking-wider ml-1">Image URL (Optionnel)</label>
                  <input
                    type="url"
                    value={image}
                    onChange={(e) => setImage(e.target.value)}
                    placeholder="https://images.unsplash.com/..."
                    className="w-full px-4 py-3 bg-white/5 border border-white/10 rounded-2xl focus:outline-none focus:ring-2 focus:ring-accent-light/50 focus:border-accent-light transition-all text-text-primary-light dark:text-text-primary-dark text-sm"
                  />
                </div>

                <div className="space-y-1">
                  <label className="text-xs font-semibold text-text-primary-light dark:text-text-primary-dark uppercase tracking-wider ml-1">Description d'Exception</label>
                  <textarea
                    value={description}
                    onChange={(e) => setDescription(e.target.value)}
                    required
                    rows={3}
                    placeholder="Décrivez l'expérience unique qu'offre votre restaurant..."
                    className="w-full px-4 py-3 bg-white/5 border border-white/10 rounded-2xl focus:outline-none focus:ring-2 focus:ring-accent-light/50 focus:border-accent-light transition-all text-text-primary-light dark:text-text-primary-dark text-sm resize-none"
                  />
                </div>

                <div className="flex gap-4 pt-4">
                  <button
                    type="button"
                    onClick={() => setIsModalOpen(false)}
                    className="flex-1 py-3.5 glass-capsule rounded-2xl font-bold text-sm text-text-primary-light dark:text-text-primary-dark hover:scale-[1.02] transition-all"
                  >
                    Annuler
                  </button>
                  <button
                    type="submit"
                    disabled={submitting}
                    className="flex-1 py-3.5 bg-accent-light hover:bg-accent-dark text-white rounded-2xl font-bold text-sm flex items-center justify-center gap-2 shadow-lg hover:shadow-accent-light/20 transition-all hover:scale-[1.02] disabled:opacity-50"
                  >
                    {submitting ? <Loader2 className="w-5 h-5 animate-spin" /> : "Créer le Restaurant"}
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
