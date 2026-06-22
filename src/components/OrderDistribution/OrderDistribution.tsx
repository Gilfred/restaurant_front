import React from 'react';
import { PieChart, Pie, Cell, Tooltip, ResponsiveContainer } from 'recharts';
import type { DistributionData } from './OrderDistribution.types';

const pieData: DistributionData[] = [
  { name: 'Plats principaux', value: 45 },
  { name: 'Entrées', value: 25 },
  { name: 'Desserts', value: 20 },
  { name: 'Boissons', value: 10 },
];

const PIE_COLORS = ['#3B82F6', '#10B981', '#F59E0B', '#EF4444'];

export const OrderDistribution: React.FC = () => {
  return (
    <div className="glass-card-premium p-6 h-[400px]">
      <h3 className="text-lg font-semibold mb-2 text-text-primary-light dark:text-text-primary-dark tracking-wide">Répartition des Commandes</h3>
      <div className="h-[250px]">
        <ResponsiveContainer width="100%" height="100%">
          <PieChart>
            <Pie
              data={pieData}
              cx="50%"
              cy="50%"
              innerRadius={60}
              outerRadius={80}
              paddingAngle={5}
              dataKey="value"
            >
              {pieData.map((_entry, index) => (
                <Cell key={`cell-${index}`} fill={PIE_COLORS[index % PIE_COLORS.length]} stroke="none" />
              ))}
            </Pie>
            <Tooltip
              contentStyle={{
                backgroundColor: 'rgba(255, 255, 255, 0.8)',
                backdropFilter: 'blur(10px)',
                border: '1px solid rgba(0,0,0,0.1)',
                borderRadius: '16px',
                color: '#1E293B'
              }}
            />
          </PieChart>
        </ResponsiveContainer>
      </div>
      <div className="space-y-3 mt-4">
        {pieData.map((item, index) => (
          <div key={item.name} className="flex items-center gap-2">
            <div className="w-2 h-2 rounded-full" style={{ backgroundColor: PIE_COLORS[index] }}></div>
            <span className="text-xs text-text-secondary-light dark:text-text-secondary-dark truncate uppercase tracking-tighter">{item.name}</span>
            <span className="text-xs font-bold ml-auto text-text-primary-light dark:text-text-primary-dark">{item.value}%</span>
          </div>
        ))}
      </div>
    </div>
  );
};
