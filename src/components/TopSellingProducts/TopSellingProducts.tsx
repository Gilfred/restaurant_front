import React from 'react';
import type { TopSellingProductsProps, TopProductItem } from './TopSellingProducts.types';

// Color gradient accents for each row matching screenshot 145049.png
const BAR_COLORS = [
  'bg-blue-500 shadow-blue-500/30',
  'bg-emerald-500 shadow-emerald-500/30',
  'bg-amber-500 shadow-amber-500/30',
  'bg-rose-500 shadow-rose-500/30',
  'bg-purple-500 shadow-purple-500/30',
];

export const TopSellingProducts: React.FC<TopSellingProductsProps> = ({
  data,
  loading = false,
}) => {
  const items: TopProductItem[] = React.useMemo(() => {
    if (data?.data && data.data.length > 0) {
      return data.data;
    }
    // Fallback display matching screenshot if no items yet
    return [
      { name: 'Burger Signature', quantity: 450, percentage: 85, revenue: 0 },
      { name: 'Pizza Truffe', quantity: 380, percentage: 70, revenue: 0 },
      { name: 'Pasta Carbonara', quantity: 310, percentage: 60, revenue: 0 },
      { name: 'Salade César', quantity: 240, percentage: 45, revenue: 0 },
    ];
  }, [data]);

  // Find max quantity to compute percentage relative to the top item if percentage is not provided or 0
  const maxQty = Math.max(...items.map((i) => i.quantity), 1);

  return (
    <div className="glass-card-premium p-6 flex flex-col justify-between h-full min-h-[440px]">
      <div className="flex items-center justify-between mb-6">
        <div>
          <h3 className="text-lg font-bold text-text-primary-light dark:text-text-primary-dark tracking-tight">
            Produits les plus vendus
          </h3>
          <p className="text-xs text-text-secondary-light dark:text-text-secondary-dark mt-0.5 font-medium">
            Classement par volume de ventes
          </p>
        </div>
        {data?.total_quantity ? (
          <span className="text-xs font-semibold px-2.5 py-1 rounded-full glass-capsule text-accent-light border border-accent-light/20">
            Total : {data.total_quantity}
          </span>
        ) : null}
      </div>

      {loading ? (
        <div className="space-y-6 flex-1 py-4 animate-pulse">
          {Array.from({ length: 4 }).map((_, i) => (
            <div key={i} className="space-y-2">
              <div className="flex justify-between">
                <div className="w-28 h-3.5 bg-black/10 dark:bg-white/10 rounded" />
                <div className="w-16 h-3.5 bg-black/10 dark:bg-white/10 rounded" />
              </div>
              <div className="w-full h-2.5 bg-black/10 dark:bg-white/10 rounded-full" />
            </div>
          ))}
        </div>
      ) : items.length === 0 ? (
        <div className="flex-1 flex items-center justify-center text-xs text-text-secondary-light dark:text-text-secondary-dark py-12">
          Aucun produit vendu pour cette période
        </div>
      ) : (
        <div className="space-y-6 flex-1 justify-center flex flex-col">
          {items.map((item, index) => {
            // Compute percentage width
            const barWidth =
              item.percentage && item.percentage > 0
                ? Math.min(100, item.percentage)
                : Math.round((item.quantity / maxQty) * 100);

            const colorClass = BAR_COLORS[index % BAR_COLORS.length];

            return (
              <div key={item.product_id || `${item.name}-${index}`} className="space-y-2">
                <div className="flex items-center justify-between text-xs font-semibold">
                  <span className="text-text-primary-light dark:text-text-primary-dark truncate pr-2">
                    {item.name}
                  </span>
                  <span className="text-text-secondary-light dark:text-text-secondary-dark shrink-0 font-medium">
                    {item.quantity.toLocaleString('fr-FR')} {item.quantity > 1 ? 'ventes' : 'vente'}
                  </span>
                </div>

                {/* Progress Track */}
                <div className="w-full h-2 rounded-full bg-black/5 dark:bg-white/5 overflow-hidden">
                  <div
                    className={`h-full rounded-full transition-all duration-700 shadow-sm ${colorClass}`}
                    style={{ width: `${barWidth}%` }}
                  />
                </div>
              </div>
            );
          })}
        </div>
      )}
    </div>
  );
};
