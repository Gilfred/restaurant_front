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
    <div className="min-h-screen bg-background-light dark:bg-background-dark text-text-primary-light dark:text-text-primary-dark font-sans selection:bg-accent-light/30 transition-colors duration-500 overflow-x-hidden">
      <Sidebar
        isOpen={isSidebarOpen}
        setIsOpen={setIsSidebarOpen}
        isCollapsed={isSidebarCollapsed}
        setIsCollapsed={setIsSidebarCollapsed}
      />

      <main className={cn(
        "transition-all duration-300 min-h-screen",
        isSidebarCollapsed ? "lg:pl-20" : "lg:pl-64"
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

          <div className="grid grid-cols-1 lg:grid-cols-1 gap-8">
            <motion.div variants={item}>
              <RevenueWeekly />
            </motion.div>
          </div>

          {/* Table and Activity Row */}
          <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
            <motion.div variants={item} className="lg:col-span-2">
              <OrdersTable />
            </motion.div>
            <motion.div variants={item}>
              <RecentActivity />
            </motion.div>
          </div>
        </motion.div>
      </main>

      {/* Decorative Background Elements */}
      <div className="fixed top-[-10%] right-[-10%] w-[500px] h-[500px] bg-accent-light/10 dark:bg-accent-dark/5 blur-[120px] rounded-full pointer-events-none -z-10"></div>
      <div className="fixed bottom-[-10%] left-[20%] w-[400px] h-[400px] bg-success-light/10 dark:bg-success-dark/5 blur-[100px] rounded-full pointer-events-none -z-10"></div>
    </div>
  );
}

export default App;
