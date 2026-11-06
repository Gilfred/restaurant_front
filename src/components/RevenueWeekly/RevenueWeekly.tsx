import React, { useState, useEffect } from 'react';
import { BarChart, Bar, XAxis, YAxis, CartesianGrid, Tooltip, ResponsiveContainer } from 'recharts';
import type { RevenueWeeklyProps } from './RevenueWeekly.types';
import { getWeeklySales } from '../../services/dashboard.service';
import type { WeeklySalesPoint } from '../../types/dashboard';

const formatDayLabel = (dayName?: string, dateStr?: string): string => {
  if (dayName) {
    const cleanDay = dayName.trim().toLowerCase();
    if (cleanDay.startsWith('lun')) return 'Lun';
    if (cleanDay.startsWith('mar')) return 'Mar';
    if (cleanDay.startsWith('mer')) return 'Mer';
    if (cleanDay.startsWith('jeu')) return 'Jeu';
    if (cleanDay.startsWith('ven')) return 'Ven';
    if (cleanDay.startsWith('sam')) return 'Sam';
    if (cleanDay.startsWith('dim')) return 'Dim';
    return dayName.slice(0, 3);
  }
  if (!dateStr) return '';
  try {
    const parts = dateStr.split('-');
    if (parts.length === 3) {
      const year = parseInt(parts[0], 10);
      const month = parseInt(parts[1], 10) - 1;
      const day = parseInt(parts[2], 10);
      const d = new Date(year, month, day);
      const formatted = d.toLocaleDateString('fr-FR', { weekday: 'short' });
      return formatted.charAt(0).toUpperCase() + formatted.slice(1, 3);
    }
  } catch {
    return dateStr;
  }
  return dateStr;
};

export const RevenueWeekly: React.FC<RevenueWeeklyProps> = ({
  data: propData,
  currency: propCurrency,
  loading: propLoading,
}) => {
  const [internalData, setInternalData] = useState<WeeklySalesPoint[]>([]);
  const [internalCurrency, setInternalCurrency] = useState<string>('XOF');
  const [internalLoading, setInternalLoading] = useState<boolean>(false);

  useEffect(() => {
    if (propData === undefined) {
      setInternalLoading(true);
      getWeeklySales()
        .then((res) => {
          if (res.data) {
            setInternalData(res.data.data || []);
            setInternalCurrency(res.data.currency || 'XOF');
          }
        })
        .catch(() => {
          setInternalData([]);
        })
        .finally(() => {
          setInternalLoading(false);
        });
    }
  }, [propData]);

  const rawData = propData !== undefined ? propData : internalData;
  const currency = propCurrency || internalCurrency;
  const loading = propLoading !== undefined ? propLoading : internalLoading;
  const currencySymbol = currency === 'XOF' ? 'F CFA' : currency;

  const chartData = rawData.map((item) => ({
    ...item,
    name: formatDayLabel(item.day, item.date),
  }));

  return (
    <div className="glass-card-premium p-6 h-[400px] flex flex-col justify-between">
      <div className="flex items-center justify-between mb-2">
        <h3 className="text-lg font-semibold text-text-primary-light dark:text-text-primary-dark tracking-wide">
          Revenus Hebdomadaires
        </h3>
      </div>

      <div className="h-[300px] w-full flex-1">
        {loading ? (
          <div className="w-full h-full animate-pulse bg-black/5 dark:bg-white/5 rounded-2xl flex items-center justify-center text-xs text-text-secondary-light">
            Chargement des revenus hebdomadaires...
          </div>
        ) : chartData.length === 0 ? (
          <div className="w-full h-full flex items-center justify-center text-sm text-text-secondary-light font-medium">
            Aucune donnée de vente pour cette semaine.
          </div>
        ) : (
          <ResponsiveContainer width="100%" height="100%">
            <BarChart data={chartData} margin={{ top: 10, right: 10, left: -10, bottom: 0 }}>
              <CartesianGrid
                strokeDasharray="3 3"
                vertical={false}
                stroke="rgba(0, 0, 0, 0.05)"
                className="dark:stroke-white/5"
              />
              <XAxis
                dataKey="name"
                axisLine={false}
                tickLine={false}
                tick={{ fill: '#64748B', fontSize: 12 }}
                dy={10}
              />
              <YAxis
                axisLine={false}
                tickLine={false}
                tick={{ fill: '#64748B', fontSize: 12 }}
                tickFormatter={(val) =>
                  val >= 1000000
                    ? `${(val / 1000000).toFixed(1)}M`
                    : val >= 1000
                    ? `${(val / 1000).toFixed(0)}k`
                    : val
                }
              />
              <Tooltip
                cursor={{ fill: 'rgba(255, 255, 255, 0.04)' }}
                content={({ active, payload }) => {
                  if (active && payload && payload.length) {
                    const dataPoint = payload[0].payload;
                    return (
                      <div className="bg-white/95 dark:bg-slate-800/95 backdrop-blur-md border border-black/10 dark:border-white/10 p-3 rounded-2xl shadow-xl">
                        <p className="text-sm font-bold text-text-primary-light dark:text-text-primary-dark mb-1">
                          {dataPoint.day || dataPoint.name}
                        </p>
                        <p className="text-xs font-semibold text-blue-500 dark:text-blue-400">
                          revenue : {Number(dataPoint.revenue).toLocaleString('fr-FR')} {currencySymbol}
                        </p>
                        {dataPoint.orders_count !== undefined && (
                          <p className="text-xs text-text-secondary-light dark:text-text-secondary-dark mt-0.5">
                            commandes : {dataPoint.orders_count}
                          </p>
                        )}
                      </div>
                    );
                  }
                  return null;
                }}
              />
              <Bar
                dataKey="revenue"
                fill="#3B82F6"
                radius={[6, 6, 0, 0]}
                barSize={32}
              />
            </BarChart>
          </ResponsiveContainer>
        )}
      </div>
    </div>
  );
};
