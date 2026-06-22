import React from 'react';
import { TrendingUp, TrendingDown } from 'lucide-react';
import { cn } from '../../utils/cn';
import { AreaChart, Area, ResponsiveContainer } from 'recharts';
import type { StatCardProps } from './StatCard.types';

const colors = {
  blue: {
    bg: 'bg-blue-500/10',
    text: 'text-blue-500',
    chart: '#3B82F6',
  },
  green: {
    bg: 'bg-emerald-500/10',
    text: 'text-emerald-500',
    chart: '#10B981',
  },
  orange: {
    bg: 'bg-amber-500/10',
    text: 'text-amber-500',
    chart: '#F59E0B',
  },
  red: {
    bg: 'bg-rose-500/10',
    text: 'text-rose-500',
    chart: '#EF4444',
  },
};

export const StatCard: React.FC<StatCardProps> = ({ title, value, trend, icon: Icon, chartData, color }) => {
  const isPositive = trend >= 0;

  return (
    <div className="glass-card-premium p-6 flex flex-col gap-4 group hover:scale-[1.02] transition-transform duration-500 relative overflow-hidden">
      <div className="absolute top-0 right-0 w-24 h-24 bg-white/5 blur-2xl rounded-full pointer-events-none"></div>

      <div className="flex justify-between items-start z-10">
        <div className={cn("p-3 rounded-2xl glass-capsule", colors[color].bg)}>
          <Icon className={colors[color].text} size={20} />
        </div>
        <div className={cn(
          "flex items-center gap-1 text-xs font-semibold px-2 py-1 rounded-full glass-capsule",
          isPositive ? "text-emerald-500 dark:text-emerald-400" : "text-rose-500 dark:text-rose-400"
        )}>
          {isPositive ? <TrendingUp size={12} /> : <TrendingDown size={12} />}
          {Math.abs(trend)}%
        </div>
      </div>

      <div className="z-10">
        <h3 className="text-text-secondary-light dark:text-text-secondary-dark text-xs font-bold tracking-wider uppercase">{title}</h3>
        <p className="text-2xl font-bold text-text-primary-light dark:text-text-primary-dark mt-1">{value}</p>
      </div>

      <div className="h-16 w-full mt-2">
        <ResponsiveContainer width="100%" height="100%">
          <AreaChart data={chartData}>
            <defs>
              <linearGradient id={`gradient-${color}`} x1="0" y1="0" x2="0" y2="1">
                <stop offset="5%" stopColor={colors[color].chart} stopOpacity={0.3}/>
                <stop offset="95%" stopColor={colors[color].chart} stopOpacity={0}/>
              </linearGradient>
            </defs>
            <Area
              type="monotone"
              dataKey="value"
              stroke={colors[color].chart}
              fillOpacity={1}
              fill={`url(#gradient-${color})`}
              strokeWidth={2}
            />
          </AreaChart>
        </ResponsiveContainer>
      </div>
    </div>
  );
};
