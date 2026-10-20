import React, { useState, useEffect } from 'react';
import { motion } from 'framer-motion';
import {
  TrendingUp,
  TrendingDown,
  DollarSign,
  ShoppingBag,
  ClipboardList,
  Calendar,
  Info,
  RefreshCw,
  AlertCircle
} from 'lucide-react';
import { getDashboardOverview, listCommandes, listMyCommandes } from '../../../services';
import type { DashboardOverviewResponse, OverviewPeriod, OverviewMetric } from '../../../types/dashboard';
import type { CommandeResponse } from '../../../types/commande';
import { AccessDenied } from '../../../components/AccessDenied';
import { OrdersTable } from '../../../components/OrdersTable';
import { cn } from '../../../utils/cn';

interface OverviewViewProps {
  onSeeAllOrders?: () => void;
}

const PERIOD_OPTIONS: { id: OverviewPeriod; label: string }[] = [
  { id: 'today', label: "Aujourd'hui" },
  { id: '7d', label: '7 derniers jours' },
  { id: '30d', label: '30 derniers jours' },
  { id: 'current_month', label: 'Mois en cours' },
  { id: 'previous_month', label: 'Mois précédent' },
];

const containerVariants = {
  hidden: { opacity: 0 },
  show: {
    opacity: 1,
    transition: {
      staggerChildren: 0.1,
    },
  },
};

const itemVariants = {
  hidden: { opacity: 0, y: 20 },
  show: { opacity: 1, y: 0 },
};

const formatCurrency = (amount: number, currencyStr: string = 'XOF') => {
  const formatted = amount.toLocaleString('fr-FR');
  const currencySymbol = currencyStr === 'XOF' ? 'F CFA' : currencyStr;
  return `${formatted} ${currencySymbol}`;
};

interface OverviewCardProps {
  title: string;
  metric: OverviewMetric;
  icon: React.ElementType;
  isCurrency?: boolean;
  currencyStr?: string;
  color: 'blue' | 'emerald' | 'amber';
}

const colorStyles = {
  blue: {
    bg: 'bg-blue-500/10 dark:bg-blue-500/20',
    text: 'text-blue-500 dark:text-blue-400',
    glow: 'from-blue-500/10 to-transparent',
  },
  emerald: {
    bg: 'bg-emerald-500/10 dark:bg-emerald-500/20',
    text: 'text-emerald-500 dark:text-emerald-400',
    glow: 'from-emerald-500/10 to-transparent',
  },
  amber: {
    bg: 'bg-amber-500/10 dark:bg-amber-500/20',
    text: 'text-amber-500 dark:text-amber-400',
    glow: 'from-amber-500/10 to-transparent',
  },
};

const OverviewCard: React.FC<OverviewCardProps> = ({
  title,
  metric,
  icon: Icon,
  isCurrency = false,
  currencyStr = 'XOF',
  color,
}) => {
  const isPositive = metric.percentage_change >= 0;
  const style = colorStyles[color];

  const displayValue = isCurrency
    ? formatCurrency(metric.current, currencyStr)
    : metric.current.toLocaleString('fr-FR');

  const displayPrevious = isCurrency
    ? formatCurrency(metric.previous, currencyStr)
    : metric.previous.toLocaleString('fr-FR');

  return (
    <div className="glass-card-premium p-6 flex flex-col justify-between relative overflow-hidden group hover:scale-[1.01] transition-transform duration-300">
      <div className={cn('absolute -right-8 -top-8 w-32 h-32 bg-gradient-to-br rounded-full blur-2xl pointer-events-none opacity-50', style.glow)} />

      <div>
        <div className="flex items-center justify-between mb-4">
          <div className={cn('p-3 rounded-2xl glass-capsule', style.bg)}>
            <Icon className={style.text} size={22} />
          </div>
          <div
            className={cn(
              'flex items-center gap-1 text-xs font-bold px-2.5 py-1 rounded-full glass-capsule border border-white/10',
              isPositive
                ? 'text-emerald-500 dark:text-emerald-400 bg-emerald-500/10'
                : 'text-rose-500 dark:text-rose-400 bg-rose-500/10'
            )}
          >
            {isPositive ? <TrendingUp size={14} /> : <TrendingDown size={14} />}
            <span>{isPositive ? '+' : ''}{metric.percentage_change}%</span>
          </div>
        </div>

        <h3 className="text-text-secondary-light dark:text-text-secondary-dark text-xs font-bold tracking-wider uppercase">
          {title}
        </h3>
        <p className="text-3xl font-extrabold text-text-primary-light dark:text-text-primary-dark mt-2 tracking-tight">
          {displayValue}
        </p>
      </div>

      <div className="mt-6 pt-4 border-t border-black/5 dark:border-white/5 flex items-center justify-between text-xs text-text-secondary-light dark:text-text-secondary-dark font-medium">
        <span>Période précédente</span>
        <span className="font-semibold text-text-primary-light dark:text-text-primary-dark">
          {displayPrevious}
        </span>
      </div>
    </div>
  );
};

export const OverviewView: React.FC<OverviewViewProps> = ({ onSeeAllOrders }) => {
  const [period, setPeriod] = useState<OverviewPeriod>('7d');
  const [overviewData, setOverviewData] = useState<DashboardOverviewResponse | null>(null);
  const [loading, setLoading] = useState<boolean>(true);
  const [error, setError] = useState<string | null>(null);
  const [isDenied, setIsDenied] = useState<boolean>(false);

  const [recentOrders, setRecentOrders] = useState<CommandeResponse[]>([]);
  const [loadingOrders, setLoadingOrders] = useState<boolean>(true);

  const fetchOverview = async (selectedPeriod: OverviewPeriod) => {
    setLoading(true);
    setError(null);
    setIsDenied(false);

    try {
      const res = await getDashboardOverview(selectedPeriod);
      setOverviewData(res.data);
    } catch (err: any) {
      if (err.response?.status === 403) {
        setIsDenied(true);
      } else {
        setError(
          err.response?.data?.detail?.[0]?.msg ||
            err.response?.data?.detail ||
            "Impossible de charger les indicateurs du tableau de bord."
        );
      }
    } finally {
      setLoading(false);
    }
  };

  const fetchRecentOrders = async () => {
    setLoadingOrders(true);
    try {
      const res = await listCommandes();
      setRecentOrders((res.data || []).slice(0, 5));
    } catch (err: any) {
      if (err.response?.status === 403) {
        // Fallback for non-admin waiters if needed
        try {
          const myRes = await listMyCommandes();
          setRecentOrders((myRes.data || []).slice(0, 5));
        } catch {
          setRecentOrders([]);
        }
      } else {
        setRecentOrders([]);
      }
    } finally {
      setLoadingOrders(false);
    }
  };

  useEffect(() => {
    fetchOverview(period);
  }, [period]);

  useEffect(() => {
    fetchRecentOrders();
  }, []);

  if (isDenied) {
    return (
      <AccessDenied
        requiredRole="ADMINISTRATEUR"
        description="L'accès à la vue d'ensemble du tableau de bord est réservé aux administrateurs (ADMIN, SUPERADMIN, propriétaire de restaurant)."
      />
    );
  }

  return (
    <motion.div
      variants={containerVariants}
      initial="hidden"
      animate="show"
      className="p-4 sm:p-8 space-y-8"
    >
      {/* Header & Period Selector */}
      <div className="flex flex-col lg:flex-row lg:items-center justify-between gap-4">
        <div>
          <h2 className="text-2xl sm:text-3xl font-extrabold text-text-primary-light dark:text-text-primary-dark tracking-tight flex items-center gap-3">
            Tableau de Bord
          </h2>
          <p className="text-xs sm:text-sm text-text-secondary-light dark:text-text-secondary-dark mt-1 font-medium">
            Aperçu des performances et indicateurs clés de votre restaurant.
          </p>
        </div>

        {/* Period Selector Pills */}
        <div className="flex flex-wrap items-center gap-2 bg-black/5 dark:bg-white/5 p-1.5 rounded-2xl border border-black/5 dark:border-white/10">
          <div className="flex items-center gap-1.5 px-2 text-xs font-bold text-text-secondary-light dark:text-text-secondary-dark">
            <Calendar size={14} className="text-accent-light" />
            <span className="hidden sm:inline">Période:</span>
          </div>
          {PERIOD_OPTIONS.map((opt) => (
            <button
              key={opt.id}
              onClick={() => setPeriod(opt.id)}
              disabled={loading}
              className={cn(
                'px-3 py-1.5 rounded-xl text-xs font-bold transition-all duration-200 cursor-pointer disabled:opacity-50',
                period === opt.id
                  ? 'bg-accent-light text-white shadow-md'
                  : 'text-text-secondary-light dark:text-text-secondary-dark hover:text-text-primary-light dark:hover:text-text-primary-dark hover:bg-black/5 dark:hover:bg-white/5'
              )}
            >
              {opt.label}
            </button>
          ))}
        </div>
      </div>

      {error && (
        <div className="p-4 bg-red-500/10 border border-red-500/20 rounded-2xl text-red-500 text-sm font-medium flex items-center justify-between">
          <div className="flex items-center gap-2">
            <AlertCircle size={18} />
            <span>{error}</span>
          </div>
          <button
            onClick={() => fetchOverview(period)}
            className="px-3 py-1 bg-red-500/20 hover:bg-red-500/30 rounded-xl text-xs font-bold transition-colors flex items-center gap-1"
          >
            <RefreshCw size={12} /> Réessayer
          </button>
        </div>
      )}

      {/* Overview Cards Grid */}
      {loading && !overviewData ? (
        <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
          {Array.from({ length: 3 }).map((_, i) => (
            <div key={i} className="glass-card-premium p-6 h-44 animate-pulse flex flex-col justify-between">
              <div className="flex justify-between items-center">
                <div className="w-10 h-10 bg-black/10 dark:bg-white/10 rounded-2xl" />
                <div className="w-16 h-6 bg-black/10 dark:bg-white/10 rounded-full" />
              </div>
              <div className="space-y-2">
                <div className="w-24 h-3 bg-black/10 dark:bg-white/10 rounded" />
                <div className="w-40 h-8 bg-black/10 dark:bg-white/10 rounded-xl" />
              </div>
              <div className="w-full h-4 bg-black/10 dark:bg-white/10 rounded mt-4" />
            </div>
          ))}
        </div>
      ) : overviewData ? (
        <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
          <motion.div variants={itemVariants}>
            <OverviewCard
              title="Chiffre d'Affaires"
              metric={overviewData.revenue}
              icon={DollarSign}
              isCurrency={true}
              currencyStr={overviewData.currency}
              color="blue"
            />
          </motion.div>

          <motion.div variants={itemVariants}>
            <OverviewCard
              title="Commandes Payées"
              metric={overviewData.orders_count}
              icon={ShoppingBag}
              isCurrency={false}
              color="emerald"
            />
          </motion.div>

          <motion.div variants={itemVariants}>
            <OverviewCard
              title="Total Commandes Reçues"
              metric={overviewData.total_orders_received}
              icon={ClipboardList}
              isCurrency={false}
              color="amber"
            />
          </motion.div>
        </div>
      ) : null}

      {/* Limitations Note Banner */}
      {overviewData?.limitations_note && (
        <motion.div variants={itemVariants}>
          <div className="p-4 bg-accent-light/10 dark:bg-accent-light/5 border border-accent-light/20 rounded-2xl flex items-start gap-3">
            <Info size={18} className="text-accent-light shrink-0 mt-0.5" />
            <div className="text-xs text-text-secondary-light dark:text-text-secondary-dark leading-relaxed font-medium">
              <span className="font-bold text-text-primary-light dark:text-text-primary-dark">Note de calcul : </span>
              {overviewData.limitations_note}
            </div>
          </div>
        </motion.div>
      )}

      {/* Recent Orders Table */}
      <motion.div variants={itemVariants} className="pt-2">
        <OrdersTable
          commandes={recentOrders}
          loading={loadingOrders}
          onSeeAll={onSeeAllOrders}
        />
      </motion.div>
    </motion.div>
  );
};
