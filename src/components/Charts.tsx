import React from 'react';
import { AreaChart, Area, XAxis, YAxis, CartesianGrid, Tooltip, ResponsiveContainer, BarChart, Bar, PieChart, Pie, Cell } from 'recharts';

const data = [
  { name: 'Lun', sales: 4000, revenue: 2400 },
  { name: 'Mar', sales: 3000, revenue: 1398 },
  { name: 'Mer', sales: 2000, revenue: 9800 },
  { name: 'Jeu', sales: 2780, revenue: 3908 },
  { name: 'Ven', sales: 1890, revenue: 4800 },
  { name: 'Sam', sales: 2390, revenue: 3800 },
  { name: 'Dim', sales: 3490, revenue: 4300 },
];

const pieData = [
  { name: 'Plats principaux', value: 45 },
  { name: 'Entrées', value: 25 },
  { name: 'Desserts', value: 20 },
  { name: 'Boissons', value: 10 },
];

const PIE_COLORS = ['#3B82F6', '#10B981', '#F59E0B', '#EF4444'];

export const SalesOverview: React.FC = () => {
  return (
    <div className="glass-card glass-card-light dark:glass-card-dark p-6 rounded-[2rem] h-[400px]">
      <h3 className="text-lg font-semibold mb-6 text-text-primary-light dark:text-text-primary-dark">Évolution des ventes</h3>
      <div className="h-[300px]">
        <ResponsiveContainer width="100%" height="100%">
          <AreaChart data={data}>
            <defs>
              <linearGradient id="colorSales" x1="0" y1="0" x2="0" y2="1">
                <stop offset="5%" stopColor="#3B82F6" stopOpacity={0.3}/>
                <stop offset="95%" stopColor="#3B82F6" stopOpacity={0}/>
              </linearGradient>
            </defs>
            <CartesianGrid strokeDasharray="3 3" vertical={false} stroke="rgba(148, 163, 184, 0.1)" />
            <XAxis dataKey="name" axisLine={false} tickLine={false} tick={{ fill: '#94A3B8', fontSize: 12 }} dy={10} />
            <YAxis axisLine={false} tickLine={false} tick={{ fill: '#94A3B8', fontSize: 12 }} />
            <Tooltip
              contentStyle={{
                backgroundColor: 'rgba(15, 23, 42, 0.9)',
                border: 'none',
                borderRadius: '12px',
                color: '#fff'
              }}
            />
            <Area type="monotone" dataKey="sales" stroke="#3B82F6" fillOpacity={1} fill="url(#colorSales)" strokeWidth={3} />
          </AreaChart>
        </ResponsiveContainer>
      </div>
    </div>
  );
};

export const OrderDistribution: React.FC = () => {
  return (
    <div className="glass-card glass-card-light dark:glass-card-dark p-6 rounded-[2rem] h-[400px]">
      <h3 className="text-lg font-semibold mb-2 text-text-primary-light dark:text-text-primary-dark">Répartition des commandes</h3>
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
                backgroundColor: 'rgba(15, 23, 42, 0.9)',
                border: 'none',
                borderRadius: '12px',
                color: '#fff'
              }}
            />
          </PieChart>
        </ResponsiveContainer>
      </div>
      <div className="grid grid-cols-2 gap-4 mt-4">
        {pieData.map((item, index) => (
          <div key={item.name} className="flex items-center gap-2">
            <div className="w-3 h-3 rounded-full" style={{ backgroundColor: PIE_COLORS[index] }}></div>
            <span className="text-xs text-text-secondary-light dark:text-text-secondary-dark truncate">{item.name}</span>
            <span className="text-xs font-bold ml-auto">{item.value}%</span>
          </div>
        ))}
      </div>
    </div>
  );
};

export const RevenueWeekly: React.FC = () => {
  return (
    <div className="glass-card glass-card-light dark:glass-card-dark p-6 rounded-[2rem] h-[400px]">
      <h3 className="text-lg font-semibold mb-6 text-text-primary-light dark:text-text-primary-dark">Revenus hebdomadaires</h3>
      <div className="h-[300px]">
        <ResponsiveContainer width="100%" height="100%">
          <BarChart data={data}>
            <CartesianGrid strokeDasharray="3 3" vertical={false} stroke="rgba(148, 163, 184, 0.1)" />
            <XAxis dataKey="name" axisLine={false} tickLine={false} tick={{ fill: '#94A3B8', fontSize: 12 }} dy={10} />
            <YAxis axisLine={false} tickLine={false} tick={{ fill: '#94A3B8', fontSize: 12 }} />
            <Tooltip
              cursor={{ fill: 'rgba(255, 255, 255, 0.05)' }}
              contentStyle={{
                backgroundColor: 'rgba(15, 23, 42, 0.9)',
                border: 'none',
                borderRadius: '12px',
                color: '#fff'
              }}
            />
            <Bar dataKey="revenue" fill="#3B82F6" radius={[4, 4, 0, 0]} barSize={30} />
          </BarChart>
        </ResponsiveContainer>
      </div>
    </div>
  );
};
