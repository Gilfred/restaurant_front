import React, { useState } from 'react';
import { Sidebar } from '../../components/Sidebar';
import { Topbar } from '../../components/Topbar';
import { StatCard } from '../../components/StatCard';
import { SalesOverview } from '../../components/SalesOverview';
import { RevenueWeekly } from '../../components/RevenueWeekly';
import { OrderDistribution } from '../../components/OrderDistribution';
import { OrdersTable } from '../../components/OrdersTable';
import { RecentActivity } from '../../components/RecentActivity';
import { cn } from '../../utils/cn';
import { DollarSign, ShoppingBag, Users, Utensils } from 'lucide-react';
import { motion, AnimatePresence } from 'framer-motion';

// Premium Resto Sub-views
import { RestaurantView } from './Views/RestaurantView';
import { StaffView } from './Views/StaffView';
import { AdminView } from './Views/AdminView';
import { InactiveView } from './Views/InactiveView';
import { HistoryView } from './Views/HistoryView';

import type { Stat, BestSellingProduct } from './Dashboard.types';

const stats: Stat[] = [
  { title: "Chiffre d'affaires", value: "12,450.00 €", trend: 12.5, icon: DollarSign, color: 'blue', data: [{value: 400}, {value: 600}, {value: 500}, {value: 700}, {value: 800}, {value: 750}, {value: 900}] },
  { title: "Commandes", value: "145", trend: 8.2, icon: ShoppingBag, color: 'green', data: [{value: 30}, {value: 45}, {value: 35}, {value: 50}, {value: 40}, {value: 60}, {value: 55}] },
  { title: "Nouveaux clients", value: "48", trend: -2.4, icon: Users, color: 'orange', data: [{value: 10}, {value: 15}, {value: 8}, {value: 12}, {value: 10}, {value: 14}, {value: 11}] },
  { title: "Tables occupées", value: "18/25", trend: 5.1, icon: Utensils, color: 'red', data: [{value: 12}, {value: 18}, {value: 15}, {value: 20}, {value: 16}, {value: 22}, {value: 18}] },
];

const bestSellingProducts: BestSellingProduct[] = [
  { name: 'Burger Signature', sales: '450', price: '18.00 €', progress: 85, color: 'bg-accent-light' },
  { name: 'Pizza Truffe', sales: '380', price: '22.00 €', progress: 70, color: 'bg-success-light' },
  { name: 'Pasta Carbonara', sales: '310', price: '16.50 €', progress: 60, color: 'bg-warning-light' },
  { name: 'Salade César', sales: '240', price: '14.00 €', progress: 45, color: 'bg-danger-light' },
];

const container = {
  hidden: { opacity: 0 },
  show: {
    opacity: 1,
    transition: {
      staggerChildren: 0.1
    }
  }
};

const item = {
  hidden: { opacity: 0, y: 20 },
  show: { opacity: 1, y: 0 }
};

export const Dashboard: React.FC = () => {
  const [isSidebarOpen, setIsSidebarOpen] = React.useState(false);
  const [isSidebarCollapsed, setIsSidebarCollapsed] = React.useState(false);
  const [activeMenuId, setActiveMenuId] = useState<string>('dashboard');

  const renderContent = () => {
    switch (activeMenuId) {
      case 'dashboard':
        return (
          <motion.div
            variants={container}
            initial="hidden"
            animate="show"
            className="p-4 sm:p-8 space-y-8"
          >
            {/* Stats Grid */}
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
              {stats.map((stat, i) => (
                <motion.div key={i} variants={item}>
                  <StatCard {...stat} chartData={stat.data} />
                </motion.div>
              ))}
            </div>

            {/* Charts Row */}
            <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
              <motion.div variants={item} className="lg:col-span-2">
                <SalesOverview />
              </motion.div>
              <motion.div variants={item}>
                <OrderDistribution />
              </motion.div>
            </div>

            <div className="grid grid-cols-1 lg:grid-cols-2 gap-8">
              <motion.div variants={item}>
                <RevenueWeekly />
              </motion.div>
              <motion.div variants={item}>
                <div className="glass-card-premium p-6 h-full flex flex-col">
                  <h3 className="text-lg font-semibold text-text-primary-light dark:text-text-primary-dark mb-6">Produits les plus vendus</h3>
                  <div className="space-y-4 flex-1">
                    {bestSellingProducts.map((product, idx) => (
                      <div key={idx} className="space-y-1">
                        <div className="flex justify-between text-sm">
                          <span className="font-medium text-text-primary-light dark:text-text-primary-dark">{product.name}</span>
                          <span className="text-text-secondary-light dark:text-text-secondary-dark">{product.sales} ventes</span>
                        </div>
                        <div className="h-2 w-full bg-black/5 dark:bg-white/5 rounded-full overflow-hidden">
                          <div className={cn("h-full rounded-full", product.color)} style={{ width: `${product.progress}%` }}></div>
                        </div>
                      </div>
                    ))}
                  </div>
                </div>
              </motion.div>
            </div>

            {/* Table and Activity Row */}
            <div className="grid grid-cols-1 lg:grid-cols-3 gap-8 pb-8">
              <motion.div variants={item} className="lg:col-span-2">
                <OrdersTable />
              </motion.div>
              <motion.div variants={item}>
                <RecentActivity />
              </motion.div>
            </div>
          </motion.div>
        );

      case 'resto-restaurants':
        return (
          <motion.div
            initial={{ opacity: 0, y: 15 }}
            animate={{ opacity: 1, y: 0 }}
            className="p-4 sm:p-8"
          >
            <RestaurantView />
          </motion.div>
        );

      case 'resto-inactive':
        return (
          <motion.div
            initial={{ opacity: 0, y: 15 }}
            animate={{ opacity: 1, y: 0 }}
            className="p-4 sm:p-8"
          >
            <InactiveView />
          </motion.div>
        );

      case 'resto-history':
        return (
          <motion.div
            initial={{ opacity: 0, y: 15 }}
            animate={{ opacity: 1, y: 0 }}
            className="p-4 sm:p-8"
          >
            <HistoryView />
          </motion.div>
        );

      case 'resto-staff':
        return (
          <motion.div
            initial={{ opacity: 0, y: 15 }}
            animate={{ opacity: 1, y: 0 }}
            className="p-4 sm:p-8"
          >
            <StaffView />
          </motion.div>
        );

      case 'resto-admin':
        return (
          <motion.div
            initial={{ opacity: 0, y: 15 }}
            animate={{ opacity: 1, y: 0 }}
            className="p-4 sm:p-8"
          >
            <AdminView />
          </motion.div>
        );

      default:
        return (
          <div className="p-8 text-center text-text-secondary-light dark:text-text-secondary-dark font-medium">
            Section en cours de construction...
          </div>
        );
    }
  };

  return (
    <div className="min-h-screen flex items-center justify-center p-0 sm:p-4 lg:p-8 font-sans selection:bg-accent-neon/30">
      {/* Root Glass Container */}
      <div className="glass-main w-full max-w-[1800px] h-screen lg:h-[95vh] overflow-hidden flex flex-col lg:flex-row relative glass-reflection">
        <Sidebar
          isOpen={isSidebarOpen}
          setIsOpen={setIsSidebarOpen}
          isCollapsed={isSidebarCollapsed}
          setIsCollapsed={setIsSidebarCollapsed}
          activeId={activeMenuId}
          onMenuItemClick={(id) => {
            setActiveMenuId(id);
            setIsSidebarOpen(false); // Close drawer on mobile
          }}
        />

        <main className={cn(
          "flex-1 transition-all duration-300 overflow-y-auto relative h-full",
        )}>
          <Topbar onMenuClick={() => setIsSidebarOpen(true)} />

          <AnimatePresence mode="wait">
            {renderContent()}
          </AnimatePresence>
        </main>
      </div>

      {/* Decorative Background Glows */}
      <div className="fixed top-[10%] right-[10%] w-[400px] h-[400px] bg-accent-light/10 blur-[150px] rounded-full pointer-events-none -z-10"></div>
      <div className="fixed bottom-[10%] left-[10%] w-[300px] h-[300px] bg-purple-500/10 blur-[150px] rounded-full pointer-events-none -z-10"></div>
    </div>
  );
};
