import React from 'react';
import { ShoppingBag, CreditCard, Calendar, Package } from 'lucide-react';
import { cn } from '../../utils/cn';
import type { Activity } from './RecentActivity.types';

const activities: Activity[] = [
  { id: 1, type: 'order', title: 'Nouvelle commande #8926', time: 'Il y a 2 min', icon: ShoppingBag, color: 'text-blue-500', bg: 'bg-blue-500/10' },
  { id: 2, type: 'payment', title: 'Paiement reçu - 128.50 €', time: 'Il y a 15 min', icon: CreditCard, color: 'text-emerald-500', bg: 'bg-emerald-500/10' },
  { id: 3, type: 'reservation', title: 'Réservation pour 4 personnes', time: 'Il y a 45 min', icon: Calendar, color: 'text-amber-500', bg: 'bg-amber-500/10' },
  { id: 4, type: 'stock', title: 'Stock de vin rouge mis à jour', time: 'Il y a 1h', icon: Package, color: 'text-rose-500', bg: 'bg-rose-500/10' },
];

export const RecentActivity: React.FC = () => {
  return (
    <div className="glass-card-premium p-6 h-full">
      <h3 className="text-lg font-semibold mb-6 text-text-primary-light dark:text-text-primary-dark tracking-wide">Activité Récente</h3>
      <div className="space-y-6">
        {activities.map((activity, index) => (
          <div key={activity.id} className="flex gap-4 relative group">
            {index !== activities.length - 1 && (
              <div className="absolute left-[19px] top-10 bottom-[-24px] w-[1px] bg-black/5 dark:bg-white/10"></div>
            )}
            <div className={cn("w-10 h-10 rounded-full flex items-center justify-center shrink-0 z-10 glass-capsule shadow-sm", activity.bg)}>
              <activity.icon className={activity.color} size={18} />
            </div>
            <div>
              <p className="text-sm font-semibold text-text-primary-light dark:text-text-primary-dark">{activity.title}</p>
              <p className="text-xs text-text-secondary-light dark:text-text-secondary-dark mt-0.5 uppercase tracking-widest">{activity.time}</p>
            </div>
          </div>
        ))}
      </div>
    </div>
  );
};
