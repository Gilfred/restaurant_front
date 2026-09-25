import React, { useState, useEffect } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import {
  UtensilsCrossed,
  ArrowLeft,
  Star,
  MapPin,
  Search,
  ChevronRight,
  Info,
  Building2,
  Wine
} from 'lucide-react';
import { Link, useNavigate } from 'react-router-dom';
import type {
  RestaurantDisplay,
  FamilleDisplay,
  CategoryDisplay,
  RepasDisplay,
  BoissonDisplay,
  FamilleImageDisplay
} from './PublicMenu.types';
import { listRestaurants } from '../../services/restaurant.service';
import { getPublicMenuDisplay } from '../../services/menu.service';
import type { RestaurantResponse } from '../../types/restaurant';
import { Loader } from '../../components/Loader';
import { useAuth } from '../../contexts/AuthContext';

export const parseRestaurantDisplayData = (item: any): RestaurantDisplay => {
  const restoObj = item.restaurant || item;

  // STRICT RULE 1: Restaurant image comes ONLY from restoObj.image
  const restaurantImage: string | undefined = restoObj.image || undefined;

  // Process Familles
  const familleList: FamilleDisplay[] = [];

  if (item.familles && Array.isArray(item.familles)) {
    item.familles.forEach((fam: any) => {
      const famNom = fam.nom ? String(fam.nom).trim() : 'Général';
      const famId = String(fam.id || `fam-${Math.random()}`);

      // Extract Famille Images strictly for this famille
      const famImages: FamilleImageDisplay[] = [];
      if (fam.images && Array.isArray(fam.images)) {
        fam.images.forEach((img: any) => {
          if (img && img.imageUrl) {
            famImages.push({
              id: String(img.id || `img-${Math.random()}`),
              imageUrl: String(img.imageUrl),
              ordre: img.ordre ?? 0
            });
          }
        });
      }
      // Sort images by ordre if provided
      famImages.sort((a, b) => (a.ordre ?? 0) - (b.ordre ?? 0));

      // Extract Categories strictly for this famille
      const categoryList: CategoryDisplay[] = [];

      if (fam.categories && Array.isArray(fam.categories)) {
        fam.categories.forEach((cat: any) => {
          const catNom = cat.nom ? String(cat.nom).trim() : 'Plats';
          const catId = String(cat.id || `cat-${Math.random()}`);

          // Extract Repas strictly for this category
          const repasList: RepasDisplay[] = [];

          if (cat.repasList && Array.isArray(cat.repasList)) {
            cat.repasList.forEach((rItem: any) => {
              const repasData = rItem.repas || rItem;
              const nomRepas = repasData.nomRepas || repasData.nom || '';
              if (nomRepas) {
                const rawPrix = repasData.prix !== undefined && repasData.prix !== null ? Number(repasData.prix) : null;
                repasList.push({
                  id: String(rItem.id || repasData.id || `repas-${Math.random()}`),
                  nom: nomRepas,
                  description: repasData.description || undefined,
                  prix: rawPrix,
                  formattedPrice: rawPrix !== null ? `${rawPrix.toLocaleString()} F CFA` : ''
                });
              }
            });
          }

          // STRICT RULE 7: Only add category if it has at least one repas
          if (repasList.length > 0) {
            categoryList.push({
              id: catId,
              nom: catNom,
              ordre: cat.ordre ?? 0,
              repasList
            });
          }
        });

        categoryList.sort((a, b) => (a.ordre ?? 0) - (b.ordre ?? 0));
      }

      // Add famille if it has categories or famille images
      if (categoryList.length > 0 || famImages.length > 0) {
        familleList.push({
          id: famId,
          nom: famNom,
          ordre: fam.ordre ?? 0,
          images: famImages,
          categories: categoryList
        });
      }
    });

    familleList.sort((a, b) => (a.ordre ?? 0) - (b.ordre ?? 0));
  }

  // Extract Beverages (Boissons) - Supports flat list or family groupings with family images
  const boissonList: BoissonDisplay[] = [];
  const boissonFamilleList: any[] = [];

  if (item.boissons && Array.isArray(item.boissons)) {
    item.boissons.forEach((bItem: any) => {
      // Check if bItem is a beverage family grouping (contains nested boissons array)
      const subBoissons = bItem.boissons || bItem.boissonList || bItem.items;
      if (subBoissons && Array.isArray(subBoissons)) {
        const famNom = bItem.famille?.nom || bItem.nom || 'Nos Boissons';
        const famImages = (bItem.images || []).map((img: any) => ({
          id: String(img.id || `img-${Math.random()}`),
          imageUrl: String(img.url || img.imageUrl || ''),
          ordre: img.ordre ?? 0
        })).filter((img: any) => Boolean(img.imageUrl));

        const extractPrice = (...objs: any[]): number | null => {
          for (const obj of objs) {
            if (!obj) continue;
            const val = obj.prixVente ?? obj.prix_vente ?? obj.prix ?? obj.price;
            if (val !== undefined && val !== null && val !== '') {
              const num = Number(val);
              if (!isNaN(num)) return num;
            }
          }
          return null;
        };

        const subList: BoissonDisplay[] = [];
        subBoissons.forEach((subItem: any) => {
          const boissonData = subItem.boisson || subItem;
          const nomBoisson = boissonData.nomBoisson || boissonData.nom || subItem.nomBoisson || subItem.nom || '';
          if (nomBoisson) {
            const rawPrix = extractPrice(boissonData, subItem, bItem);

            const bDisplay: BoissonDisplay = {
              id: String(subItem.id || boissonData.id || `boisson-${Math.random()}`),
              nom: nomBoisson,
              description: boissonData.description || undefined,
              prix: rawPrix,
              formattedPrice: rawPrix !== null ? `${rawPrix.toLocaleString()} F CFA` : '',
              imageUrl: subItem.imageUrl || boissonData.imageUrl || null
            };
            subList.push(bDisplay);
            boissonList.push(bDisplay);
          }
        });

        if (subList.length > 0 || famImages.length > 0) {
          boissonFamilleList.push({
            id: String(bItem.famille?.id || bItem.id || `bfam-${Math.random()}`),
            nom: famNom,
            images: famImages,
            boissons: subList
          });
        }
      } else {
        const boissonData = bItem.boisson || bItem;
        const nomBoisson = boissonData.nomBoisson || boissonData.nom || bItem.nomBoisson || bItem.nom || '';
        if (nomBoisson) {
          const rawPrix = ((): number | null => {
            const val = boissonData.prixVente ?? boissonData.prix_vente ?? boissonData.prix ?? boissonData.price ?? bItem.prixVente ?? bItem.prix_vente ?? bItem.prix ?? bItem.price;
            if (val !== undefined && val !== null && val !== '') {
              const num = Number(val);
              if (!isNaN(num)) return num;
            }
            return null;
          })();

          boissonList.push({
            id: String(bItem.id || boissonData.id || `boisson-${Math.random()}`),
            nom: nomBoisson,
            description: boissonData.description || undefined,
            prix: rawPrix,
            formattedPrice: rawPrix !== null ? `${rawPrix.toLocaleString()} F CFA` : '',
            imageUrl: bItem.imageUrl || boissonData.imageUrl || null
          });
        }
      }
    });
  }

  return {
    id: String(restoObj.id || item.id),
    name: String(restoObj.name || restoObj.nom || ''),
    cuisine: restoObj.cuisine || undefined,
    rating: restoObj.rating !== undefined && restoObj.rating !== null ? Number(restoObj.rating) : undefined,
    image: restaurantImage,
    description: restoObj.description || undefined,
    address: restoObj.address || restoObj.adresse || undefined,
    familles: familleList,
    boissons: boissonList,
    boissonFamilles: boissonFamilleList
  };
};

export const PublicMenu: React.FC = () => {
  const navigate = useNavigate();
  const { isAuthenticated } = useAuth();
  const [restaurants, setRestaurants] = useState<RestaurantDisplay[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [selectedRestaurant, setSelectedRestaurant] = useState<RestaurantDisplay | null>(null);
  const [searchQuery, setSearchQuery] = useState('');

  useEffect(() => {
    const fetchRestaurants = async () => {
      try {
        setLoading(true);
        setError(null);
        let displayRestaurants: RestaurantDisplay[] = [];

        try {
          const displayRes = await getPublicMenuDisplay();
          if (displayRes.data?.restaurants && displayRes.data.restaurants.length > 0) {
            displayRestaurants = displayRes.data.restaurants.map((item: any) => parseRestaurantDisplayData(item));
          }
        } catch (displayErr) {
          console.warn("Public menu display endpoint failed or empty:", displayErr);
        }

        if (displayRestaurants.length > 0) {
          setRestaurants(displayRestaurants);
        } else {
          // Fallback to listRestaurants directly without mock values
          const response = await listRestaurants();
          const activeMapped = response.data
            .filter((r: RestaurantResponse) => r.isActive)
            .map((r: RestaurantResponse) => ({
              id: r.id,
              name: r.name,
              cuisine: undefined,
              rating: undefined,
              image: undefined,
              description: undefined,
              address: r.address || undefined,
              familles: [],
              boissons: []
            }));

          setRestaurants(activeMapped);
        }
      } catch (err) {
        console.error("Failed to fetch restaurants:", err);
        setError("Impossible de charger la liste des restaurants depuis le serveur.");
        setRestaurants([]);
      } finally {
        setLoading(false);
      }
    };

    fetchRestaurants();
  }, []);

  const filteredRestaurants = restaurants.filter(r =>
    (r.name && r.name.toLowerCase().includes(searchQuery.toLowerCase())) ||
    (r.cuisine && r.cuisine.toLowerCase().includes(searchQuery.toLowerCase()))
  );

  return (
    <div className="min-h-screen w-full p-4 sm:p-6 lg:p-8 font-sans selection:bg-accent-neon/30 relative overflow-x-hidden">
      {/* Decorative Background Glows */}
      <div className="fixed top-[10%] right-[10%] w-[300px] h-[300px] sm:w-[400px] sm:h-[400px] bg-accent-light/10 blur-[100px] sm:blur-[150px] rounded-full pointer-events-none -z-10"></div>
      <div className="fixed bottom-[10%] left-[10%] w-[250px] h-[250px] sm:w-[300px] sm:h-[300px] bg-purple-500/10 blur-[100px] sm:blur-[150px] rounded-full pointer-events-none -z-10"></div>

      <div className="max-w-7xl mx-auto">
        {/* Header */}
        <header className="flex flex-col md:flex-row md:items-center justify-between mb-8 gap-4">
          <div className="flex items-center gap-4">
            <button
              onClick={() => isAuthenticated ? navigate('/dashboard') : navigate('/login')}
              className="p-2 rounded-xl glass-capsule hover:scale-105 transition-all cursor-pointer"
              title="Retour"
            >
              <ArrowLeft className="w-6 h-6 text-text-primary-light dark:text-text-primary-dark" />
            </button>
            <div>
              <h1 className="text-3xl font-bold text-text-primary-light dark:text-text-primary-dark">Lumina Eat</h1>
              <p className="text-text-secondary-light dark:text-text-secondary-dark">Découvrez les meilleures tables</p>
            </div>
          </div>

          {!selectedRestaurant && !loading && !error && (
            <div className="relative w-full md:w-96 group">
              <Search className="absolute left-4 top-1/2 transform -translate-y-1/2 w-5 h-5 text-text-secondary-light dark:text-text-secondary-dark group-focus-within:text-accent-light transition-colors" />
              <input
                type="text"
                placeholder="Rechercher un restaurant..."
                value={searchQuery}
                onChange={(e) => setSearchQuery(e.target.value)}
                className="w-full pl-12 pr-4 py-3 bg-white/5 border border-white/10 rounded-2xl focus:outline-none focus:ring-2 focus:ring-accent-light/50 focus:border-accent-light transition-all text-text-primary-light dark:text-text-primary-dark"
              />
            </div>
          )}
        </header>

        {loading ? (
          <div className="flex items-center justify-center min-h-[50vh]">
            <Loader size="lg" message="Chargement des restaurants disponibles..." />
          </div>
        ) : error ? (
          <div className="glass-card-premium p-12 text-center max-w-lg mx-auto mt-12">
            <p className="text-red-500 font-semibold mb-4">{error}</p>
            <button
              onClick={() => window.location.reload()}
              className="px-6 py-2.5 bg-accent-light text-white rounded-xl font-bold hover:bg-accent-dark transition-all"
            >
              Réessayer
            </button>
          </div>
        ) : (
          <AnimatePresence mode="wait">
            {!selectedRestaurant ? (
              <motion.div
                key="list"
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                exit={{ opacity: 0, y: -20 }}
                className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6"
              >
                {filteredRestaurants.map((restaurant) => (
                  <motion.div
                    key={restaurant.id}
                    whileHover={{ y: -5 }}
                    className="glass-card-premium overflow-hidden flex flex-col group cursor-pointer"
                    onClick={() => setSelectedRestaurant(restaurant)}
                  >
                    {/* STRICT RULE 1 & 13: Restaurant image strictly uses restaurant.image */}
                    <div className="h-48 overflow-hidden relative bg-gradient-to-tr from-slate-800 to-slate-950 flex items-center justify-center">
                      {restaurant.image ? (
                        <img
                          src={restaurant.image}
                          alt={restaurant.name}
                          className="w-full h-full object-cover transition-transform duration-500 group-hover:scale-110"
                        />
                      ) : (
                        <Building2 className="w-16 h-16 text-white/20 group-hover:scale-110 transition-transform duration-300" />
                      )}
                      {restaurant.rating !== undefined && restaurant.rating !== null && (
                        <div className="absolute top-4 right-4 px-3 py-1 bg-black/50 backdrop-blur-md rounded-full flex items-center gap-1">
                          <Star className="w-3 h-3 text-yellow-400 fill-yellow-400" />
                          <span className="text-xs font-bold text-white">{restaurant.rating}</span>
                        </div>
                      )}
                    </div>
                    <div className="p-6 flex-1 flex flex-col">
                      <div className="flex justify-between items-start mb-2">
                        <h3 className="text-xl font-bold text-text-primary-light dark:text-text-primary-dark group-hover:text-accent-light transition-colors">
                          {restaurant.name}
                        </h3>
                      </div>
                      {restaurant.description && (
                        <p className="text-sm text-text-secondary-light dark:text-text-secondary-dark mb-4 line-clamp-2">
                          {restaurant.description}
                        </p>
                      )}
                      <div className="mt-auto space-y-3 pt-2">
                        {restaurant.cuisine && (
                          <div className="flex items-center gap-2 text-sm text-text-secondary-light dark:text-text-secondary-dark">
                            <UtensilsCrossed className="w-4 h-4" />
                            <span>{restaurant.cuisine}</span>
                          </div>
                        )}
                        {restaurant.address && (
                          <div className="flex items-center gap-2 text-sm text-text-secondary-light dark:text-text-secondary-dark">
                            <MapPin className="w-4 h-4" />
                            <span>{restaurant.address}</span>
                          </div>
                        )}
                        <button className="w-full py-3 mt-4 glass-capsule rounded-xl flex items-center justify-center gap-2 text-text-primary-light dark:text-text-primary-dark font-semibold group-hover:bg-accent-light group-hover:text-white transition-all">
                          Voir la carte
                          <ChevronRight className="w-4 h-4" />
                        </button>
                      </div>
                    </div>
                  </motion.div>
                ))}
                {filteredRestaurants.length === 0 && (
                  <div className="glass-card-premium p-12 text-center col-span-full">
                    <p className="text-text-secondary-light dark:text-text-secondary-dark">Aucun restaurant disponible pour le moment.</p>
                  </div>
                )}
              </motion.div>
            ) : (
              <motion.div
                key="detail"
                initial={{ opacity: 0, x: 20 }}
                animate={{ opacity: 1, x: 0 }}
                exit={{ opacity: 0, x: -20 }}
                className="space-y-8"
              >
                <button
                  onClick={() => setSelectedRestaurant(null)}
                  className="flex items-center gap-2 text-text-secondary-light dark:text-text-secondary-dark hover:text-accent-light transition-colors font-medium cursor-pointer"
                >
                  <ArrowLeft className="w-5 h-5" />
                  Retour aux restaurants
                </button>

                {/* Restaurant Detail Hero */}
                <div className="glass-card-premium p-8 flex flex-col md:flex-row gap-8 items-center">
                  <div className="w-full md:w-64 h-64 rounded-3xl overflow-hidden shadow-lg bg-gradient-to-tr from-slate-800 to-slate-950 flex items-center justify-center">
                    {selectedRestaurant.image ? (
                      <img src={selectedRestaurant.image} alt={selectedRestaurant.name} className="w-full h-full object-cover" />
                    ) : (
                      <Building2 className="w-20 h-20 text-white/20" />
                    )}
                  </div>
                  <div className="flex-1 space-y-4">
                    <div className="flex items-center gap-3">
                      <h2 className="text-4xl font-bold text-text-primary-light dark:text-text-primary-dark">{selectedRestaurant.name}</h2>
                      {selectedRestaurant.rating !== undefined && selectedRestaurant.rating !== null && (
                        <div className="px-3 py-1 bg-accent-light/10 text-accent-light rounded-full text-sm font-bold flex items-center gap-1">
                          <Star className="w-4 h-4 fill-current" />
                          {selectedRestaurant.rating}
                        </div>
                      )}
                    </div>
                    {selectedRestaurant.description && (
                      <p className="text-lg text-text-secondary-light dark:text-text-secondary-dark max-w-2xl">{selectedRestaurant.description}</p>
                    )}
                    <div className="flex flex-wrap gap-6">
                      {selectedRestaurant.cuisine && (
                        <div className="flex items-center gap-2 text-text-secondary-light dark:text-text-secondary-dark">
                          <UtensilsCrossed className="w-5 h-5 text-accent-light" />
                          <span>{selectedRestaurant.cuisine}</span>
                        </div>
                      )}
                      {selectedRestaurant.address && (
                        <div className="flex items-center gap-2 text-text-secondary-light dark:text-text-secondary-dark">
                          <MapPin className="w-5 h-5 text-accent-light" />
                          <span>{selectedRestaurant.address}</span>
                        </div>
                      )}
                    </div>
                  </div>
                </div>

                {/* STRICT HIERARCHICAL MENU RENDERING */}
                <div className="space-y-12">
                  {/* Render Familles */}
                  {selectedRestaurant.familles.map((famille) => (
                    <div key={famille.id} className="space-y-6 glass-card-premium p-6 sm:p-8 rounded-3xl">
                      {/* 1. Nom de la famille */}
                      <div className="flex items-center gap-4 border-b border-black/10 dark:border-white/10 pb-4">
                        <h3 className="text-3xl font-extrabold text-text-primary-light dark:text-text-primary-dark tracking-tight">
                          {famille.nom}
                        </h3>
                      </div>

                      {/* 2. Image(s) de cette famille uniquement */}
                      {famille.images && famille.images.length > 0 && (
                        <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 gap-4 my-4">
                          {famille.images.map((img) => (
                            <div key={img.id} className="h-48 sm:h-56 rounded-2xl overflow-hidden bg-slate-900 border border-white/10 shadow-md">
                              <img src={img.imageUrl} alt={famille.nom} className="w-full h-full object-cover hover:scale-105 transition-transform duration-300" />
                            </div>
                          ))}
                        </div>
                      )}

                      {/* 3. Catégories de cette famille uniquement */}
                      <div className="space-y-8 pt-2">
                        {famille.categories.map((cat) => (
                          <div key={cat.id} className="space-y-4">
                            <h4 className="text-xl font-bold text-accent-light border-l-4 border-accent-light pl-3 py-0.5">
                              {cat.nom}
                            </h4>
                            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
                              {cat.repasList.map((repas) => (
                                <motion.div
                                  key={repas.id}
                                  initial={{ opacity: 0, scale: 0.95 }}
                                  animate={{ opacity: 1, scale: 1 }}
                                  className="glass-card-premium p-6 hover:bg-white/50 dark:hover:bg-slate-800/60 transition-colors group flex flex-col justify-between"
                                >
                                  <div>
                                    <div className="flex justify-between items-start mb-2 gap-2">
                                      <h5 className="text-lg font-bold text-text-primary-light dark:text-text-primary-dark group-hover:text-accent-light transition-colors">
                                        {repas.nom}
                                      </h5>
                                      {repas.formattedPrice && (
                                        <span className="text-accent-light font-bold text-lg whitespace-nowrap">
                                          {repas.formattedPrice}
                                        </span>
                                      )}
                                    </div>
                                    {repas.description && (
                                      <p className="text-sm text-text-secondary-light dark:text-text-secondary-dark leading-relaxed">
                                        {repas.description}
                                      </p>
                                    )}
                                  </div>
                                </motion.div>
                              ))}
                            </div>
                          </div>
                        ))}
                      </div>
                    </div>
                  ))}

                  {/* Render Boissons Section (Structured Families vs Flat fallback) */}
                  {selectedRestaurant.boissonFamilles && selectedRestaurant.boissonFamilles.length > 0 ? (
                    selectedRestaurant.boissonFamilles.map((bfam) => (
                      <div key={bfam.id} className="space-y-6 glass-card-premium p-6 sm:p-8 rounded-3xl">
                        <div className="flex items-center gap-3 border-b border-black/10 dark:border-white/10 pb-4">
                          <Wine className="w-7 h-7 text-accent-light" />
                          <h3 className="text-3xl font-extrabold text-text-primary-light dark:text-text-primary-dark tracking-tight">
                            {bfam.nom}
                          </h3>
                        </div>

                        {/* Images de la famille de boissons */}
                        {bfam.images && bfam.images.length > 0 && (
                          <div className={`grid gap-4 my-4 ${
                            bfam.images.length === 1 ? 'grid-cols-1' :
                            bfam.images.length === 2 ? 'grid-cols-1 sm:grid-cols-2' :
                            'grid-cols-1 sm:grid-cols-3'
                          }`}>
                            {bfam.images.map((img) => (
                              <div key={img.id} className={`${
                                bfam.images.length === 1 ? 'h-56 sm:h-64' :
                                bfam.images.length === 2 ? 'h-48 sm:h-56' :
                                'h-40 sm:h-48'
                              } rounded-2xl overflow-hidden bg-slate-900 border border-white/10 shadow-md`}>
                                <img src={img.imageUrl} alt={bfam.nom} className="w-full h-full object-cover hover:scale-105 transition-transform duration-300" />
                              </div>
                            ))}
                          </div>
                        )}

                        {/* Liste des boissons */}
                        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
                          {bfam.boissons.map((boisson) => (
                            <motion.div
                              key={boisson.id}
                              initial={{ opacity: 0, scale: 0.95 }}
                              animate={{ opacity: 1, scale: 1 }}
                              className="glass-card-premium p-6 hover:bg-white/50 dark:hover:bg-slate-800/60 transition-colors group flex items-center gap-4"
                            >
                              {boisson.imageUrl ? (
                                <img src={boisson.imageUrl} alt={boisson.nom} className="w-20 h-20 object-cover rounded-2xl border border-white/10 flex-shrink-0" />
                              ) : (
                                <div className="w-20 h-20 rounded-2xl bg-white/5 flex items-center justify-center text-text-secondary-light dark:text-text-secondary-dark flex-shrink-0">
                                  <Wine size={28} className="opacity-30" />
                                </div>
                              )}
                              <div className="flex-1 space-y-1 min-w-0">
                                <h5 className="text-lg font-bold text-text-primary-light dark:text-text-primary-dark group-hover:text-accent-light transition-colors truncate">
                                  {boisson.nom}
                                </h5>
                                {boisson.formattedPrice && (
                                  <p className="text-accent-light font-bold text-base">
                                    {boisson.formattedPrice}
                                  </p>
                                )}
                                {boisson.description && (
                                  <p className="text-xs text-text-secondary-light dark:text-text-secondary-dark line-clamp-2">
                                    {boisson.description}
                                  </p>
                                )}
                              </div>
                            </motion.div>
                          ))}
                        </div>
                      </div>
                    ))
                  ) : selectedRestaurant.boissons.length > 0 ? (
                    <div className="space-y-6 glass-card-premium p-6 sm:p-8 rounded-3xl">
                      <div className="flex items-center gap-3 border-b border-black/10 dark:border-white/10 pb-4">
                        <Wine className="w-7 h-7 text-accent-light" />
                        <h3 className="text-3xl font-extrabold text-text-primary-light dark:text-text-primary-dark tracking-tight">
                          Boissons
                        </h3>
                      </div>
                      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
                        {selectedRestaurant.boissons.map((boisson) => (
                          <motion.div
                            key={boisson.id}
                            initial={{ opacity: 0, scale: 0.95 }}
                            animate={{ opacity: 1, scale: 1 }}
                            className="glass-card-premium p-6 hover:bg-white/50 dark:hover:bg-slate-800/60 transition-colors group flex items-center gap-4"
                          >
                            {boisson.imageUrl ? (
                              <img src={boisson.imageUrl} alt={boisson.nom} className="w-20 h-20 object-cover rounded-2xl border border-white/10 flex-shrink-0" />
                            ) : (
                              <div className="w-20 h-20 rounded-2xl bg-white/5 flex items-center justify-center text-text-secondary-light dark:text-text-secondary-dark flex-shrink-0">
                                <Wine size={28} className="opacity-30" />
                              </div>
                            )}
                            <div className="flex-1 space-y-1 min-w-0">
                              <h5 className="text-lg font-bold text-text-primary-light dark:text-text-primary-dark group-hover:text-accent-light transition-colors truncate">
                                {boisson.nom}
                              </h5>
                              {boisson.formattedPrice && (
                                <p className="text-accent-light font-bold text-base">
                                  {boisson.formattedPrice}
                                </p>
                              )}
                              {boisson.description && (
                                <p className="text-xs text-text-secondary-light dark:text-text-secondary-dark line-clamp-2">
                                  {boisson.description}
                                </p>
                              )}
                            </div>
                          </motion.div>
                        ))}
                      </div>
                    </div>
                  ) : null}

                  {selectedRestaurant.familles.length === 0 && selectedRestaurant.boissons.length === 0 && (
                    <div className="glass-card-premium p-12 text-center">
                      <p className="text-text-secondary-light dark:text-text-secondary-dark">Aucun plat ou boisson au menu pour ce restaurant.</p>
                    </div>
                  )}
                </div>

                <div className="glass-card-premium p-8 bg-accent-light/5 border-accent-light/20 text-center">
                  <Info className="w-8 h-8 text-accent-light mx-auto mb-4" />
                  <h4 className="text-xl font-bold text-text-primary-light dark:text-text-primary-dark mb-2">Vous aimez ce que vous voyez ?</h4>
                  <p className="text-text-secondary-light dark:text-text-secondary-dark mb-6">
                    {isAuthenticated ? "Accédez à votre espace pour gérer ou passer vos commandes !" : "Connectez-vous pour commander ou réserver une table !"}
                  </p>
                  <Link
                    to={isAuthenticated ? "/dashboard" : "/login"}
                    className="inline-flex items-center gap-2 px-8 py-3 bg-accent-light text-white rounded-xl font-bold hover:bg-accent-dark transition-all shadow-lg hover:shadow-accent-light/20"
                  >
                    {isAuthenticated ? "Retour au Dashboard" : "Se connecter"}
                  </Link>
                </div>
              </motion.div>
            )}
          </AnimatePresence>
        )}
      </div>
    </div>
  );
};
