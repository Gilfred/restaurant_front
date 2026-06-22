import React from 'react';
import { cn } from '../../utils/cn';
import type { Order, Status } from './OrdersTable.types';

const orders: Order[] = [
  { id: '#8923', client: 'Jean Dupont', amount: '45.00 €', status: 'Terminée', date: '14:20' },
  { id: '#8924', client: 'Marie Curie', amount: '128.50 €', status: 'En préparation', date: '14:25' },
  { id: '#8925', client: 'Marc Lefebvre', amount: '32.00 €', status: 'Servie', date: '14:30' },
  { id: '#8926', client: 'Sophie Martin', amount: '89.20 €', status: 'En attente', date: '14:35' },
  { id: '#8927', client: 'Lucie Bernard', amount: '56.00 €', status: 'Annulée', date: '14:40' },
];

const statusStyles: Record<Status, string> = {
  'En attente': 'bg-warning-light/10 text-warning-light dark:bg-warning-dark/10 dark:text-warning-dark',
  'En préparation': 'bg-accent-light/10 text-accent-light dark:bg-accent-dark/10 dark:text-accent-dark',
  'Servie': 'bg-success-light/10 text-success-light dark:bg-success-dark/10 dark:text-success-dark',
  'Terminée': 'bg-slate-500/10 text-slate-500 dark:bg-slate-400/20 dark:text-slate-400',
  'Annulée': 'bg-danger-light/10 text-danger-light dark:bg-danger-dark/10 dark:text-danger-dark',
};

export const OrdersTable: React.FC = () => {
  return (
    <div className="glass-card-premium overflow-hidden">
      <div className="p-6 flex items-center justify-between">
        <h3 className="text-lg font-semibold text-text-primary-light dark:text-text-primary-dark tracking-wide">Dernières Commandes</h3>
        <button className="text-sm font-medium text-accent-light dark:text-accent-dark hover:underline transition-colors">Voir tout</button>
      </div>
      <div className="overflow-x-auto">
        <table className="w-full text-left">
          <thead>
            <tr className="border-b border-black/5 dark:border-white/5">
              <th className="px-6 py-4 text-xs font-bold text-text-secondary-light dark:text-text-secondary-dark uppercase tracking-widest">ID</th>
              <th className="px-6 py-4 text-xs font-bold text-text-secondary-light dark:text-text-secondary-dark uppercase tracking-widest">Client</th>
              <th className="px-6 py-4 text-xs font-bold text-text-secondary-light dark:text-text-secondary-dark uppercase tracking-widest">Montant</th>
              <th className="px-6 py-4 text-xs font-bold text-text-secondary-light dark:text-text-secondary-dark uppercase tracking-widest">Statut</th>
              <th className="px-6 py-4 text-xs font-bold text-text-secondary-light dark:text-text-secondary-dark uppercase tracking-widest">Heure</th>
            </tr>
          </thead>
          <tbody className="divide-y divide-black/5 dark:divide-white/5">
            {orders.map((order) => (
              <tr key={order.id} className="hover:bg-black/5 dark:hover:bg-white/5 transition-colors group">
                <td className="px-6 py-4 text-sm font-medium text-text-primary-light dark:text-text-primary-dark">{order.id}</td>
                <td className="px-6 py-4 text-sm text-text-secondary-light dark:text-text-secondary-dark">{order.client}</td>
                <td className="px-6 py-4 text-sm font-semibold text-text-primary-light dark:text-text-primary-dark">{order.amount}</td>
                <td className="px-6 py-4">
                  <span className={cn("px-3 py-1 rounded-full text-[10px] font-bold uppercase tracking-tighter", statusStyles[order.status])}>
                    {order.status}
                  </span>
                </td>
                <td className="px-6 py-4 text-sm text-text-secondary-light dark:text-text-secondary-dark">{order.date}</td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>
    </div>
  );
};
