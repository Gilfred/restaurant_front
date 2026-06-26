import React, { useState } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import {
  UtensilsCrossed,
  ArrowLeft,
  Star,
  MapPin,
  Search,
  ChevronRight,
  Info
} from 'lucide-react';
import { Link } from 'react-router-dom';
import type { Restaurant } from './PublicMenu.types';

const MOCK_RESTAURANTS: Restaurant[] = [
  {
    id: '1',
    name: "La Table d'Or",
    cuisine: "Gastronomique Française",
    rating: 4.9,
    image: "https://images.unsplash.com/photo-1514362545857-3bc16c4c7d1b?auto=format&fit=crop&w=800&q=80",
    description: "Une expérience culinaire raffinée au cœur de la ville.",
    address: "12 Rue de la Paix, Paris",
    menu: [
      { id: 'm1', name: "Foie Gras Poêlé", description: "Foie gras de canard, chutney de figues, pain brioché.", price: "24€", category: "Entrées" },
      { id: 'm2', name: "Filet de Bœuf Rossini", description: "Bœuf charolais, truffe noire, sauce madère.", price: "42€", category: "Plats" },
      { id: 'm3', name: "Soufflé au Grand Marnier", description: "Soufflé aérien, sorbet orange sanguine.", price: "16€", category: "Desserts" },
    ]
  },
  {
    id: '2',
    name: "Lumina Sushi",
    cuisine: "Japonaise Moderne",
    rating: 4.7,
    image: "https://images.unsplash.com/photo-1579871494447-9811cf80d66c?auto=format&fit=crop&w=800&q=80",
    description: "Fusion entre tradition japonaise et créativité contemporaine.",
    address: "45 Avenue des Arts, Lyon",
    menu: [
      { id: 's1', name: "Moriawase de Sashimi", description: "Sélection de poissons frais du jour.", price: "28€", category: "Entrées" },
      { id: 's2', name: "Black Cod au Miso", description: "Cabillaud charbonnier mariné 48h.", price: "35€", category: "Plats" },
      { id: 's3', name: "Mochi Glacé Artisanal", description: "Assortiment de 3 parfums au choix.", price: "12€", category: "Desserts" },
    ]
  },
  {
    id: '3',
    name: "Trattoria Bella",
    cuisine: "Italienne Traditionnelle",
    rating: 4.6,
    image: "https://images.unsplash.com/photo-1555396273-367ea4eb4db5?auto=format&fit=crop&w=800&q=80",
    description: "Le goût authentique de l'Italie dans votre assiette.",
    address: "8 Place du Marché, Nice",
    menu: [
      { id: 'i1', name: "Burrata Crémeuse", description: "Tomates anciennes, basilic frais, huile d'olive extra vierge.", price: "16€", category: "Entrées" },
      { id: 'i2', name: "Pappardelle au Sanglier", description: "Pâtes fraîches maison, ragoût de sanglier braisé.", price: "22€", category: "Plats" },
      { id: 'i3', name: "Tiramisu Classico", description: "Mascarpone, café espresso, biscuits imbibés.", price: "10€", category: "Desserts" },
    ]
  }
];

export const PublicMenu: React.FC = () => {
  const [selectedRestaurant, setSelectedRestaurant] = useState<Restaurant | null>(null);
  const [searchQuery, setSearchQuery] = useState('');

  const filteredRestaurants = MOCK_RESTAURANTS.filter(r =>
    r.name.toLowerCase().includes(searchQuery.toLowerCase()) ||
    r.cuisine.toLowerCase().includes(searchQuery.toLowerCase())
  );

  const categories = selectedRestaurant
    ? Array.from(new Set(selectedRestaurant.menu.map(item => item.category)))
    : [];

  return (
    <div className="min-h-screen w-full p-4 sm:p-6 lg:p-8 font-sans selection:bg-accent-neon/30 relative overflow-x-hidden">
      {/* Decorative Background Glows */}
      <div className="fixed top-[10%] right-[10%] w-[300px] h-[300px] sm:w-[400px] sm:h-[400px] bg-accent-light/10 blur-[100px] sm:blur-[150px] rounded-full pointer-events-none -z-10"></div>
      <div className="fixed bottom-[10%] left-[10%] w-[250px] h-[250px] sm:w-[300px] sm:h-[300px] bg-purple-500/10 blur-[100px] sm:blur-[150px] rounded-full pointer-events-none -z-10"></div>

      <div className="max-w-7xl mx-auto">
        {/* Header */}
        <header className="flex flex-col md:flex-row md:items-center justify-between mb-8 gap-4">
          <div className="flex items-center gap-4">
            <Link
              to="/login"
              className="p-2 rounded-xl glass-capsule hover:scale-105 transition-all"
            >
              <ArrowLeft className="w-6 h-6 text-text-primary-light dark:text-text-primary-dark" />
            </Link>
            <div>
              <h1 className="text-3xl font-bold text-text-primary-light dark:text-text-primary-dark">Lumina Eat</h1>
              <p className="text-text-secondary-light dark:text-text-secondary-dark">Découvrez les meilleures tables</p>
            </div>
          </div>

          {!selectedRestaurant && (
            <div className="relative w-full md:w-96 group">
              <Search className="absolute left-4 top-1/2 transform -translate-y-1/2 w-5 h-5 text-text-secondary-light dark:text-text-secondary-dark group-focus-within:text-accent-light transition-colors" />
              <input
                type="text"
                placeholder="Rechercher un restaurant ou une cuisine..."
                value={searchQuery}
                onChange={(e) => setSearchQuery(e.target.value)}
                className="w-full pl-12 pr-4 py-3 bg-white/5 border border-white/10 rounded-2xl focus:outline-none focus:ring-2 focus:ring-accent-light/50 focus:border-accent-light transition-all text-text-primary-light dark:text-text-primary-dark"
              />
            </div>
          )}
        </header>

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
                  <div className="h-48 overflow-hidden relative">
                    <img
                      src={restaurant.image}
                      alt={restaurant.name}
                      className="w-full h-full object-cover transition-transform duration-500 group-hover:scale-110"
                    />
                    <div className="absolute top-4 right-4 px-3 py-1 bg-black/50 backdrop-blur-md rounded-full flex items-center gap-1">
                      <Star className="w-3 h-3 text-yellow-400 fill-yellow-400" />
                      <span className="text-xs font-bold text-white">{restaurant.rating}</span>
                    </div>
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
                    <div className="mt-auto space-y-3">
                      <div className="flex items-center gap-2 text-sm text-text-secondary-light dark:text-text-secondary-dark">
                        <UtensilsCrossed className="w-4 h-4" />
                        <span>{restaurant.cuisine}</span>
                      </div>
                      <div className="flex items-center gap-2 text-sm text-text-secondary-light dark:text-text-secondary-dark">
                        <MapPin className="w-4 h-4" />
                        <span>{restaurant.address}</span>
                      </div>
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
                  <p className="text-text-secondary-light dark:text-text-secondary-dark">Aucun restaurant ne correspond à votre recherche.</p>
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
                className="flex items-center gap-2 text-text-secondary-light dark:text-text-secondary-dark hover:text-accent-light transition-colors font-medium"
              >
                <ArrowLeft className="w-5 h-5" />
                Retour aux restaurants
              </button>

              <div className="glass-card-premium p-8 flex flex-col md:flex-row gap-8 items-center">
                <div className="w-full md:w-64 h-64 rounded-3xl overflow-hidden shadow-lg">
                  <img src={selectedRestaurant.image} alt={selectedRestaurant.name} className="w-full h-full object-cover" />
                </div>
                <div className="flex-1 space-y-4">
                  <div className="flex items-center gap-3">
                    <h2 className="text-4xl font-bold text-text-primary-light dark:text-text-primary-dark">{selectedRestaurant.name}</h2>
                    <div className="px-3 py-1 bg-accent-light/10 text-accent-light rounded-full text-sm font-bold flex items-center gap-1">
                      <Star className="w-4 h-4 fill-current" />
                      {selectedRestaurant.rating}
                    </div>
                  </div>
                  <p className="text-lg text-text-secondary-light dark:text-text-secondary-dark max-w-2xl">{selectedRestaurant.description}</p>
                  <div className="flex flex-wrap gap-6">
                    <div className="flex items-center gap-2 text-text-secondary-light dark:text-text-secondary-dark">
                      <UtensilsCrossed className="w-5 h-5 text-accent-light" />
                      <span>{selectedRestaurant.cuisine}</span>
                    </div>
                    <div className="flex items-center gap-2 text-text-secondary-light dark:text-text-secondary-dark">
                      <MapPin className="w-5 h-5 text-accent-light" />
                      <span>{selectedRestaurant.address}</span>
                    </div>
                  </div>
                </div>
              </div>

              <div className="space-y-12">
                {categories.map(category => (
                  <div key={category} className="space-y-6">
                    <div className="flex items-center gap-4">
                      <h3 className="text-2xl font-bold text-text-primary-light dark:text-text-primary-dark">{category}</h3>
                      <div className="h-px flex-1 bg-white/10"></div>
                    </div>
                    <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
                      {selectedRestaurant.menu
                        .filter(item => item.category === category)
                        .map(item => (
                          <motion.div
                            key={item.id}
                            initial={{ opacity: 0, scale: 0.95 }}
                            animate={{ opacity: 1, scale: 1 }}
                            className="glass-card-premium p-6 hover:bg-white/50 dark:hover:bg-slate-800/60 transition-colors group"
                          >
                            <div className="flex justify-between items-start mb-2">
                              <h4 className="text-lg font-bold text-text-primary-light dark:text-text-primary-dark group-hover:text-accent-light transition-colors">
                                {item.name}
                              </h4>
                              <span className="text-accent-light font-bold text-lg">{item.price}</span>
                            </div>
                            <p className="text-sm text-text-secondary-light dark:text-text-secondary-dark leading-relaxed">
                              {item.description}
                            </p>
                          </motion.div>
                        ))}
                    </div>
                  </div>
                ))}
              </div>

              <div className="glass-card-premium p-8 bg-accent-light/5 border-accent-light/20 text-center">
                <Info className="w-8 h-8 text-accent-light mx-auto mb-4" />
                <h4 className="text-xl font-bold text-text-primary-light dark:text-text-primary-dark mb-2">Vous aimez ce que vous voyez ?</h4>
                <p className="text-text-secondary-light dark:text-text-secondary-dark mb-6">Connectez-vous pour commander ou réserver une table !</p>
                <Link
                  to="/login"
                  className="inline-flex items-center gap-2 px-8 py-3 bg-accent-light text-white rounded-xl font-bold hover:bg-accent-dark transition-all shadow-lg hover:shadow-accent-light/20"
                >
                  Se connecter
                </Link>
              </div>
            </motion.div>
          )}
        </AnimatePresence>
      </div>
    </div>
  );
};
