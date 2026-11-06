import React from 'react';
import { PieChart, Pie, Cell, Tooltip, ResponsiveContainer } from 'recharts';
import type { OrderDistributionProps, DistributionData } from './OrderDistribution.types';

const PALETTE = [
  '#3B82F6', // Blue (Plats principaux)
  '#10B981', // Emerald (Entrées)
  '#F59E0B', // Amber (Desserts)
  '#EF4444', // Red (Boissons)
  '#8B5CF6', // Violet
  '#EC4899', // Pink
  '#14B8A6', // Teal
];

export const OrderDistribution: React.FC<OrderDistributionProps> = ({
  data,
  distributionType = 'category',
  onTypeChange,
  loading = false,
}) => {
  // Transform backend response into chart data
  const chartData: DistributionData[] = React.useMemo(() => {
    if (!data) {
      return [];
    }

    if (data.type === 'category' && data.category_distribution?.length) {
      return data.category_distribution.map((cat, idx) => ({
        name: cat.name,
        value: Number(cat.percentage ?? ((cat.quantity / (data.total_orders || 1)) * 100).toFixed(1)),
        count: cat.quantity,
        revenue: cat.revenue,
        color: PALETTE[idx % PALETTE.length],
      }));
    }

    if (data.type === 'status' && data.status_distribution?.length) {
      return data.status_distribution.map((st, idx) => ({
        name: st.label || st.statut,
        value: Number(st.percentage ?? ((st.count / (data.total_orders || 1)) * 100).toFixed(1)),
        count: st.count,
        revenue: st.total_amount,
        color: PALETTE[idx % PALETTE.length],
      }));
    }

    if (data.category_distribution?.length) {
      return data.category_distribution.map((cat, idx) => ({
        name: cat.name,
        value: Number(cat.percentage ?? 0),
        count: cat.quantity,
        revenue: cat.revenue,
        color: PALETTE[idx % PALETTE.length],
      }));
    }

    return [];
  }, [data]);

  return (
    <div className="glass-card-premium p-6 flex flex-col justify-between h-full min-h-[440px] relative">
      <div className="flex items-center justify-between mb-4">
        <div>
          <h3 className="text-lg font-bold text-text-primary-light dark:text-text-primary-dark tracking-tight">
            Répartition des Commandes
          </h3>
          <p className="text-xs text-text-secondary-light dark:text-text-secondary-dark mt-0.5 font-medium">
            {distributionType === 'category' ? 'Par catégorie / type' : 'Par statut de commande'}
          </p>
        </div>

        {onTypeChange && (
          <div className="flex items-center bg-black/5 dark:bg-white/5 p-1 rounded-xl border border-black/5 dark:border-white/10 text-xs">
            <button
              onClick={() => onTypeChange('category')}
              className={`px-2.5 py-1 rounded-lg font-semibold transition-all ${
                distributionType === 'category'
                  ? 'bg-accent-light text-white shadow-sm'
                  : 'text-text-secondary-light dark:text-text-secondary-dark hover:text-text-primary-light dark:hover:text-text-primary-dark'
              }`}
            >
              Catégorie
            </button>
            <button
              onClick={() => onTypeChange('status')}
              className={`px-2.5 py-1 rounded-lg font-semibold transition-all ${
                distributionType === 'status'
                  ? 'bg-accent-light text-white shadow-sm'
                  : 'text-text-secondary-light dark:text-text-secondary-dark hover:text-text-primary-light dark:hover:text-text-primary-dark'
              }`}
            >
              Statut
            </button>
          </div>
        )}
      </div>

      {loading ? (
        <div className="flex-1 flex flex-col items-center justify-center space-y-4 py-8 animate-pulse">
          <div className="w-40 h-40 rounded-full border-8 border-black/10 dark:border-white/10" />
          <div className="w-48 h-4 bg-black/10 dark:bg-white/10 rounded" />
        </div>
      ) : chartData.length === 0 ? (
        <div className="flex-1 flex items-center justify-center text-xs text-text-secondary-light dark:text-text-secondary-dark py-12">
          Aucune donnée de répartition disponible
        </div>
      ) : (
        <>
          <div className="h-[220px] w-full my-auto">
            <ResponsiveContainer width="100%" height="100%">
              <PieChart>
                <Pie
                  data={chartData}
                  cx="50%"
                  cy="50%"
                  innerRadius={65}
                  outerRadius={88}
                  paddingAngle={4}
                  dataKey="value"
                  animationDuration={800}
                >
                  {chartData.map((_entry, index) => (
                    <Cell
                      key={`cell-${index}`}
                      fill={PALETTE[index % PALETTE.length]}
                      stroke="none"
                    />
                  ))}
                </Pie>
                <Tooltip
                  content={({ active, payload }) => {
                    if (active && payload && payload.length) {
                      const item = payload[0].payload as DistributionData;
                      return (
                        <div className="glass-card-premium !bg-slate-900/90 !backdrop-blur-md !border-white/10 p-3 rounded-xl shadow-xl text-xs text-white">
                          <p className="font-bold uppercase tracking-wider">{item.name}</p>
                          <p className="text-accent-light font-extrabold text-sm mt-1">
                            {item.value}%
                          </p>
                          {item.count !== undefined && (
                            <p className="text-slate-400 text-[11px] mt-0.5">
                              {item.count} commandes / articles
                            </p>
                          )}
                          {item.revenue !== undefined && item.revenue > 0 && (
                            <p className="text-slate-400 text-[11px]">
                              CA : {item.revenue.toLocaleString('fr-FR')} F CFA
                            </p>
                          )}
                        </div>
                      );
                    }
                    return null;
                  }}
                />
              </PieChart>
            </ResponsiveContainer>
          </div>

          <div className="space-y-2.5 mt-4 pt-3 border-t border-black/5 dark:border-white/5">
            {chartData.map((item, index) => (
              <div key={item.name} className="flex items-center justify-between text-xs">
                <div className="flex items-center gap-2 min-w-0">
                  <div
                    className="w-2.5 h-2.5 rounded-full shrink-0"
                    style={{ backgroundColor: PALETTE[index % PALETTE.length] }}
                  />
                  <span className="text-text-secondary-light dark:text-text-secondary-dark truncate uppercase tracking-tight font-medium text-[11px]">
                    {item.name}
                  </span>
                </div>
                <div className="flex items-center gap-2 shrink-0">
                  {item.count !== undefined && (
                    <span className="text-[11px] text-text-secondary-light dark:text-text-secondary-dark">
                      ({item.count})
                    </span>
                  )}
                  <span className="font-extrabold text-text-primary-light dark:text-text-primary-dark text-xs">
                    {item.value}%
                  </span>
                </div>
              </div>
            ))}
          </div>
        </>
      )}
    </div>
  );
};
