import React from 'react';
import { BarChart, Bar, XAxis, YAxis, CartesianGrid, Tooltip, ResponsiveContainer } from 'recharts';
import type { RevenueData } from './RevenueWeekly.types';

const data: RevenueData[] = [
  { name: 'Lun', sales: 4000, revenue: 2400 },
  { name: 'Mar', sales: 3000, revenue: 1398 },
  { name: 'Mer', sales: 2000, revenue: 9800 },
  { name: 'Jeu', sales: 2780, revenue: 3908 },
  { name: 'Ven', sales: 1890, revenue: 4800 },
  { name: 'Sam', sales: 2390, revenue: 3800 },
  { name: 'Dim', sales: 3490, revenue: 4300 },
];

export const RevenueWeekly: React.FC = () => {
  return (
    <div className="glass-card-premium p-6 h-[400px]">
      <h3 className="text-lg font-semibold mb-6 text-text-primary-light dark:text-text-primary-dark tracking-wide">Revenus Hebdomadaires</h3>
      <div className="h-[300px]">
        <ResponsiveContainer width="100%" height="100%">
          <BarChart data={data}>
            <CartesianGrid strokeDasharray="3 3" vertical={false} stroke="rgba(0, 0, 0, 0.05)" className="dark:stroke-white/5" />
            <XAxis dataKey="name" axisLine={false} tickLine={false} tick={{ fill: '#64748B', fontSize: 12 }} dy={10} />
            <YAxis axisLine={false} tickLine={false} tick={{ fill: '#64748B', fontSize: 12 }} />
            <Tooltip
              cursor={{ fill: 'rgba(0, 0, 0, 0.05)' }}
              contentStyle={{
                backgroundColor: 'rgba(255, 255, 255, 0.8)',
                backdropFilter: 'blur(10px)',
                border: '1px solid rgba(0,0,0,0.1)',
                borderRadius: '16px',
                color: '#1E293B'
              }}
            />
            <Bar dataKey="revenue" fill="#3B82F6" radius={[4, 4, 0, 0]} barSize={30} />
          </BarChart>
        </ResponsiveContainer>
      </div>
    </div>
  );
};
