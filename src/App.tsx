import React from 'react';
import { Sidebar } from './components/Sidebar';
import { Topbar } from './components/Topbar';
import { StatCard } from './components/StatCard';
import { SalesOverview, RevenueWeekly, OrderDistribution } from './components/Charts';
import { OrdersTable } from './components/OrdersTable';
import { cn } from './utils/cn';
import { RecentActivity } from './components/RecentActivity';
import { DollarSign, ShoppingBag, Users, Utensils } from 'lucide-react';
import { motion } from 'framer-motion';

const stats = [
  { title: "Chiffre d'affaires", value: "12,450.00 €", trend: 12.5, icon: DollarSign, color: 'blue' as const, data: [{value: 400}, {value: 600}, {value: 500}, {value: 700}, {value: 800}, {value: 750}, {value: 900}] },
  { title: "Commandes", value: "145", trend: 8.2, icon: ShoppingBag, color: 'green' as const, data: [{value: 30}, {value: 45}, {value: 35}, {value: 50}, {value: 40}, {value: 60}, {value: 55}] },
  { title: "Nouveaux clients", value: "48", trend: -2.4, icon: Users, color: 'orange' as const, data: [{value: 10}, {value: 15}, {value: 8}, {value: 12}, {value: 10}, {value: 14}, {value: 11}] },
  { title: "Tables occupées", value: "18/25", trend: 5.1, icon: Utensils, color: 'red' as const, data: [{value: 12}, {value: 18}, {value: 15}, {value: 20}, {value: 16}, {value: 22}, {value: 18}] },
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

function App() {
  const [isSidebarOpen, setIsSidebarOpen] = React.useState(false);
  const [isSidebarCollapsed, setIsSidebarCollapsed] = React.useState(false);

  return (
    <div className="min-h-screen flex items-center justify-center p-0 sm:p-4 lg:p-8 font-sans selection:bg-accent-neon/30">
      {/* Root Glass Container */}
      <div className="glass-main w-full max-w-[1800px] h-screen lg:h-[95vh] overflow-hidden flex flex-col lg:flex-row relative glass-reflection">
        <Sidebar
          isOpen={isSidebarOpen}
          setIsOpen={setIsSidebarOpen}
          isCollapsed={isSidebarCollapsed}
          setIsCollapsed={setIsSidebarCollapsed}
        />

        <main className={cn(
          "flex-1 transition-all duration-300 overflow-y-auto relative h-full",
          // isSidebarCollapsed ? "lg:ml-20" : "lg:ml-64" // Removed because Sidebar is now relative in desktop
        )}>
          <Topbar onMenuClick={() => setIsSidebarOpen(true)} />

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
              {/* Product Ranking placeholder if not using another chart component */}
              <div className="glass-card-premium p-6 h-full flex flex-col">
                <h3 className="text-lg font-semibold text-text-primary-light dark:text-text-primary-dark mb-6">Produits les plus vendus</h3>
                <div className="space-y-4 flex-1">
                  {[
                    { name: 'Burger Signature', sales: '450', price: '18.00 €', progress: 85, color: 'bg-accent-light' },
                    { name: 'Pizza Truffe', sales: '380', price: '22.00 €', progress: 70, color: 'bg-success-light' },
                    { name: 'Pasta Carbonara', sales: '310', price: '16.50 €', progress: 60, color: 'bg-warning-light' },
                    { name: 'Salade César', sales: '240', price: '14.00 €', progress: 45, color: 'bg-danger-light' },
                  ].map((item, idx) => (
                    <div key={idx} className="space-y-1">
                      <div className="flex justify-between text-sm">
                        <span className="font-medium text-text-primary-light dark:text-text-primary-dark">{item.name}</span>
                        <span className="text-text-secondary-light dark:text-text-secondary-dark">{item.sales} ventes</span>
                      </div>
                      <div className="h-2 w-full bg-black/5 dark:bg-white/5 rounded-full overflow-hidden">
                        <div className={cn("h-full rounded-full", item.color)} style={{ width: `${item.progress}%` }}></div>
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
      </main>

      </div>

      {/* Decorative Background Glows */}
      <div className="fixed top-[10%] right-[10%] w-[400px] h-[400px] bg-accent-light/10 blur-[150px] rounded-full pointer-events-none -z-10"></div>
      <div className="fixed bottom-[10%] left-[10%] w-[300px] h-[300px] bg-purple-500/10 blur-[150px] rounded-full pointer-events-none -z-10"></div>
    </div>
  );
}

export default App;
