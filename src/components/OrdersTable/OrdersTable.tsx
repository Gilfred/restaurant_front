import React from 'react';
import { cn } from '../../utils/cn';
import type { OrdersTableProps } from './OrdersTable.types';
import type { CommandeResponse } from '../../types/commande';

const getStatusBadge = (statut: string) => {
  const normalized = statut?.toLowerCase() || '';
  switch (normalized) {
    case 'pending':
    case 'en attente':
      return { label: 'En attente', className: 'bg-amber-500/10 text-amber-500 dark:bg-amber-400/20 dark:text-amber-400' };
    case 'in_progress':
    case 'en préparation':
      return { label: 'En préparation', className: 'bg-blue-500/10 text-blue-500 dark:bg-blue-400/20 dark:text-blue-400' };
    case 'served':
    case 'servie':
      return { label: 'Servie', className: 'bg-emerald-500/10 text-emerald-500 dark:bg-emerald-400/20 dark:text-emerald-400' };
    case 'paid':
    case 'completed':
    case 'terminée':
      return { label: 'Payée', className: 'bg-emerald-500/10 text-emerald-500 dark:bg-emerald-400/20 dark:text-emerald-400' };
    case 'cancelled':
    case 'annulée':
      return { label: 'Annulée', className: 'bg-rose-500/10 text-rose-500 dark:bg-rose-400/20 dark:text-rose-400' };
    default:
      return { label: statut || 'Inconnu', className: 'bg-slate-500/10 text-slate-500 dark:bg-slate-400/20 dark:text-slate-400' };
  }
};

const formatDate = (dateStr?: string) => {
  if (!dateStr) return '-';
  try {
    const d = new Date(dateStr);
    return d.toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' });
  } catch {
    return dateStr;
  }
};

export const OrdersTable: React.FC<OrdersTableProps> = ({ commandes = [], loading = false, onSeeAll }) => {
  return (
    <div className="glass-card-premium overflow-hidden">
      <div className="p-6 flex items-center justify-between border-b border-black/5 dark:border-white/5">
        <div>
          <h3 className="text-lg font-semibold text-text-primary-light dark:text-text-primary-dark tracking-wide">Dernières Commandes</h3>
          <p className="text-xs text-text-secondary-light dark:text-text-secondary-dark mt-0.5">Commandes enregistrées récemment dans l'établissement</p>
        </div>
        {onSeeAll && (
          <button
            onClick={onSeeAll}
            className="text-xs font-bold text-accent-light dark:text-accent-dark hover:underline transition-colors cursor-pointer bg-accent-light/10 hover:bg-accent-light/20 px-3 py-1.5 rounded-xl"
          >
            Voir tout
          </button>
        )}
      </div>

      <div className="overflow-x-auto">
        <table className="w-full text-left">
          <thead>
            <tr className="border-b border-black/5 dark:border-white/5 bg-black/5 dark:bg-white/5">
              <th className="px-6 py-3.5 text-xs font-bold text-text-secondary-light dark:text-text-secondary-dark uppercase tracking-widest">N° Commande</th>
              <th className="px-6 py-3.5 text-xs font-bold text-text-secondary-light dark:text-text-secondary-dark uppercase tracking-widest">Serveur / Client</th>
              <th className="px-6 py-3.5 text-xs font-bold text-text-secondary-light dark:text-text-secondary-dark uppercase tracking-widest">Montant</th>
              <th className="px-6 py-3.5 text-xs font-bold text-text-secondary-light dark:text-text-secondary-dark uppercase tracking-widest">Statut</th>
              <th className="px-6 py-3.5 text-xs font-bold text-text-secondary-light dark:text-text-secondary-dark uppercase tracking-widest">Heure</th>
            </tr>
          </thead>
          <tbody className="divide-y divide-black/5 dark:divide-white/5">
            {loading ? (
              Array.from({ length: 4 }).map((_, i) => (
                <tr key={i} className="animate-pulse">
                  <td className="px-6 py-4"><div className="h-4 bg-black/10 dark:bg-white/10 rounded w-16" /></td>
                  <td className="px-6 py-4"><div className="h-4 bg-black/10 dark:bg-white/10 rounded w-28" /></td>
                  <td className="px-6 py-4"><div className="h-4 bg-black/10 dark:bg-white/10 rounded w-20" /></td>
                  <td className="px-6 py-4"><div className="h-4 bg-black/10 dark:bg-white/10 rounded w-16" /></td>
                  <td className="px-6 py-4"><div className="h-4 bg-black/10 dark:bg-white/10 rounded w-12" /></td>
                </tr>
              ))
            ) : commandes.length > 0 ? (
              commandes.map((order: CommandeResponse) => {
                const statusInfo = getStatusBadge(order.statut);
                return (
                  <tr key={order.id} className="hover:bg-black/5 dark:hover:bg-white/5 transition-colors group">
                    <td className="px-6 py-4 text-sm font-extrabold text-accent-light dark:text-accent-dark">{order.numeroCommande}</td>
                    <td className="px-6 py-4 text-sm font-medium text-text-primary-light dark:text-text-primary-dark">{order.user?.name || 'Client'}</td>
                    <td className="px-6 py-4 text-sm font-semibold text-text-primary-light dark:text-text-primary-dark">
                      {order.total !== undefined ? `${order.total.toLocaleString()} F CFA` : '0 F CFA'}
                    </td>
                    <td className="px-6 py-4">
                      <span className={cn("px-3 py-1 rounded-full text-[10px] font-bold uppercase tracking-tighter", statusInfo.className)}>
                        {statusInfo.label}
                      </span>
                    </td>
                    <td className="px-6 py-4 text-xs text-text-secondary-light dark:text-text-secondary-dark">{formatDate(order.createdAt)}</td>
                  </tr>
                );
              })
            ) : (
              <tr>
                <td colSpan={5} className="px-6 py-8 text-center text-sm text-text-secondary-light dark:text-text-secondary-dark font-medium">
                  Aucune commande récente pour le moment.
                </td>
              </tr>
            )}
          </tbody>
        </table>
      </div>
    </div>
  );
};
