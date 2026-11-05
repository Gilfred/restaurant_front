import React from 'react';
import { AreaChart, Area, XAxis, YAxis, CartesianGrid, Tooltip, ResponsiveContainer } from 'recharts';
import type { SalesOverviewProps } from './SalesOverview.types';

const formatDateLabel = (point: { date: string; day?: string }) => {
  if (point.day) {
    return point.day;
  }
  if (!point.date) return '';
  try {
    const parts = point.date.split('-');
    if (parts.length === 3) {
      const year = parseInt(parts[0], 10);
      const month = parseInt(parts[1], 10) - 1;
      const day = parseInt(parts[2], 10);
      const d = new Date(year, month, day);
      return d.toLocaleDateString('fr-FR', { day: 'numeric', month: 'short' });
    }
    const d = new Date(point.date);
    return d.toLocaleDateString('fr-FR', { day: 'numeric', month: 'short' });
  } catch {
    return point.date;
  }
};

export const SalesOverview: React.FC<SalesOverviewProps> = ({
  data = [],
  currency = 'XOF',
  loading = false,
}) => {
  const currencySymbol = currency === 'XOF' ? 'F CFA' : currency;

  const chartData = data.map((point) => ({
    ...point,
    label: formatDateLabel(point),
  }));

  return (
    <div className="glass-card-premium p-6 h-[400px] relative overflow-hidden flex flex-col justify-between">
      <div className="absolute top-0 right-0 w-32 h-32 bg-accent-light/5 dark:bg-accent-neon/5 blur-3xl rounded-full pointer-events-none"></div>

      <div className="flex items-center justify-between mb-4">
        <div>
          <h3 className="text-lg font-semibold text-text-primary-light dark:text-text-primary-dark tracking-wide">
            Évolution des Ventes
          </h3>
          <p className="text-xs text-text-secondary-light dark:text-text-secondary-dark mt-0.5">
            Graphique chronologique du chiffre d'affaires et du nombre de commandes
          </p>
        </div>
      </div>

      <div className="h-[300px] w-full flex-1">
        {loading ? (
          <div className="w-full h-full animate-pulse bg-black/5 dark:bg-white/5 rounded-2xl flex items-center justify-center text-xs text-text-secondary-light">
            Chargement du graphique...
          </div>
        ) : chartData.length === 0 ? (
          <div className="w-full h-full flex items-center justify-center text-sm text-text-secondary-light font-medium">
            Aucune donnée de vente pour cette période.
          </div>
        ) : (
          <ResponsiveContainer width="100%" height="100%">
            <AreaChart data={chartData} margin={{ top: 10, right: 10, left: 0, bottom: 0 }}>
              <defs>
                <linearGradient id="colorRevenue" x1="0" y1="0" x2="0" y2="1">
                  <stop offset="5%" stopColor="#3B82F6" stopOpacity={0.35} />
                  <stop offset="95%" stopColor="#3B82F6" stopOpacity={0} />
                </linearGradient>
              </defs>
              <CartesianGrid
                strokeDasharray="3 3"
                vertical={false}
                stroke="rgba(0, 0, 0, 0.05)"
                className="dark:stroke-white/5"
              />
              <XAxis
                dataKey="label"
                axisLine={false}
                tickLine={false}
                tick={{ fill: '#64748B', fontSize: 11 }}
                dy={10}
              />
              <YAxis
                axisLine={false}
                tickLine={false}
                tick={{ fill: '#64748B', fontSize: 11 }}
                tickFormatter={(val) =>
                  val >= 1000000
                    ? `${(val / 1000000).toFixed(1)}M`
                    : val >= 1000
                    ? `${(val / 1000).toFixed(0)}k`
                    : val
                }
              />
              <Tooltip
                contentStyle={{
                  backgroundColor: 'rgba(255, 255, 255, 0.95)',
                  backdropFilter: 'blur(10px)',
                  border: '1px solid rgba(0,0,0,0.1)',
                  borderRadius: '16px',
                  boxShadow: '0 10px 25px -5px rgba(0,0,0,0.1)',
                  color: '#1E293B',
                }}
                formatter={(value: any, name: any) => {
                  if (name === 'revenue') {
                    return [`${Number(value).toLocaleString('fr-FR')} ${currencySymbol}`, "Chiffre d'affaires"];
                  }
                  if (name === 'orders_count') {
                    return [`${value} commandes`, 'Commandes payées'];
                  }
                  if (name === 'total_orders_received') {
                    return [`${value} commandes`, 'Total reçues'];
                  }
                  return [value, name];
                }}
                labelFormatter={(label) => `Date : ${label}`}
              />
              <Area
                type="monotone"
                dataKey="revenue"
                stroke="#3B82F6"
                fillOpacity={1}
                fill="url(#colorRevenue)"
                strokeWidth={3}
              />
            </AreaChart>
          </ResponsiveContainer>
        )}
      </div>
    </div>
  );
};
