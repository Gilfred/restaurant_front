import React from 'react';
import { AreaChart, Area, XAxis, YAxis, CartesianGrid, Tooltip, ResponsiveContainer } from 'recharts';
import type { SalesData } from './SalesOverview.types';

const data: SalesData[] = [
  { name: 'Lun', sales: 4000, revenue: 2400 },
  { name: 'Mar', sales: 3000, revenue: 1398 },
  { name: 'Mer', sales: 2000, revenue: 9800 },
  { name: 'Jeu', sales: 2780, revenue: 3908 },
  { name: 'Ven', sales: 1890, revenue: 4800 },
  { name: 'Sam', sales: 2390, revenue: 3800 },
  { name: 'Dim', sales: 3490, revenue: 4300 },
];

export const SalesOverview: React.FC = () => {
  return (
    <div className="glass-card-premium p-6 h-[400px] relative overflow-hidden">
       <div className="absolute top-0 right-0 w-32 h-32 bg-accent-light/5 dark:bg-accent-neon/5 blur-3xl rounded-full pointer-events-none"></div>
      <h3 className="text-lg font-semibold mb-6 text-text-primary-light dark:text-text-primary-dark tracking-wide">Evolution des Ventes</h3>
      <div className="h-[300px]">
        <ResponsiveContainer width="100%" height="100%">
          <AreaChart data={data}>
            <defs>
              <linearGradient id="colorSales" x1="0" y1="0" x2="0" y2="1">
                <stop offset="5%" stopColor="#3B82F6" stopOpacity={0.3}/>
                <stop offset="95%" stopColor="#3B82F6" stopOpacity={0}/>
              </linearGradient>
            </defs>
            <CartesianGrid strokeDasharray="3 3" vertical={false} stroke="rgba(0, 0, 0, 0.05)" className="dark:stroke-white/5" />
            <XAxis dataKey="name" axisLine={false} tickLine={false} tick={{ fill: '#64748B', fontSize: 12 }} dy={10} />
            <YAxis axisLine={false} tickLine={false} tick={{ fill: '#64748B', fontSize: 12 }} />
            <Tooltip
              contentStyle={{
                backgroundColor: 'rgba(255, 255, 255, 0.8)',
                backdropFilter: 'blur(10px)',
                border: '1px solid rgba(0,0,0,0.1)',
                borderRadius: '16px',
                color: '#1E293B'
              }}
              itemStyle={{ color: '#1E293B' }}
            />
            <Area type="monotone" dataKey="sales" stroke="#3B82F6" fillOpacity={1} fill="url(#colorSales)" strokeWidth={3} />
          </AreaChart>
        </ResponsiveContainer>
      </div>
    </div>
  );
};
