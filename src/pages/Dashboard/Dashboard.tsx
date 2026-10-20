import React, { useState, useEffect } from 'react';
import { useSearchParams } from 'react-router-dom';
import { Sidebar } from '../../components/Sidebar';
import { Loader } from '../../components/Loader';
import { Topbar } from '../../components/Topbar';
import { cn } from '../../utils/cn';
import { motion, AnimatePresence } from 'framer-motion';

// Premium Resto Sub-views
import { OverviewView } from './Views/OverviewView';
import { RestaurantView } from './Views/RestaurantView';
import { StaffView } from './Views/StaffView';
import { AdminView } from './Views/AdminView';
import { InactiveView } from './Views/InactiveView';
import { HistoryView } from './Views/HistoryView';
import { JoinView } from './Views/JoinView';
import { RequestsView } from './Views/RequestsView';
import { MyRestaurantView } from './Views/MyRestaurantView';
import { EmployeesView } from './Views/EmployeesView';
import { CondimentsView } from './Views/CondimentsView';
import { ApproView } from './Views/ApproView';
import { UnitesView } from './Views/UnitesView';
import { OrdersView } from './Views/OrdersView';
import { ApproBoissonView } from './Views/ApproBoissonView';
import { BoissonsView } from './Views/BoissonsView';
import { RepasView } from './Views/RepasView';
import { MenuView } from './Views/MenuView';

export const Dashboard: React.FC = () => {
  const [isSidebarOpen, setIsSidebarOpen] = React.useState(false);
  const [isSidebarCollapsed, setIsSidebarCollapsed] = React.useState(false);

  const [searchParams, setSearchParams] = useSearchParams();
  const activeMenuId = searchParams.get('page') || 'dashboard';
  const [isChangingPage, setIsChangingPage] = useState(false);

  const setActiveMenuId = (id: string) => {
    if (id !== activeMenuId) {
      setSearchParams({ page: id });
    }
  };

  useEffect(() => {
    setIsChangingPage(true);
    const timer = setTimeout(() => {
      setIsChangingPage(false);
    }, 450);

    return () => clearTimeout(timer);
  }, [activeMenuId]);

  const renderContent = () => {
    switch (activeMenuId) {
      case 'dashboard':
        return <OverviewView onSeeAllOrders={() => setActiveMenuId('orders')} />;

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

      case 'menu':
      case 'resto-menu':
        return (
          <motion.div
            initial={{ opacity: 0, y: 15 }}
            animate={{ opacity: 1, y: 0 }}
            className="p-4 sm:p-8"
          >
            <MenuView />
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

      case 'affiliation-join':
        return (
          <motion.div
            initial={{ opacity: 0, y: 15 }}
            animate={{ opacity: 1, y: 0 }}
            className="p-4 sm:p-8"
          >
            <JoinView />
          </motion.div>
        );

      case 'affiliation-requests':
        return (
          <motion.div
            initial={{ opacity: 0, y: 15 }}
            animate={{ opacity: 1, y: 0 }}
            className="p-4 sm:p-8"
          >
            <RequestsView />
          </motion.div>
        );

      case 'affiliation-my-restaurant':
        return (
          <motion.div
            initial={{ opacity: 0, y: 15 }}
            animate={{ opacity: 1, y: 0 }}
            className="p-4 sm:p-8"
          >
            <MyRestaurantView />
          </motion.div>
        );

      case 'affiliation-employees':
        return (
          <motion.div
            initial={{ opacity: 0, y: 15 }}
            animate={{ opacity: 1, y: 0 }}
            className="p-4 sm:p-8"
          >
            <EmployeesView />
          </motion.div>
        );

      case 'condiments-list':
        return (
          <motion.div
            initial={{ opacity: 0, y: 15 }}
            animate={{ opacity: 1, y: 0 }}
            className="p-4 sm:p-8"
          >
            <CondimentsView />
          </motion.div>
        );

      case 'condiments-unites':
        return (
          <motion.div
            initial={{ opacity: 0, y: 15 }}
            animate={{ opacity: 1, y: 0 }}
            className="p-4 sm:p-8"
          >
            <UnitesView />
          </motion.div>
        );

      case 'orders':
        return (
          <motion.div
            initial={{ opacity: 0, y: 15 }}
            animate={{ opacity: 1, y: 0 }}
            className="p-4 sm:p-8"
          >
            <OrdersView />
          </motion.div>
        );

      case 'cuisine-appro':
        return (
          <motion.div
            initial={{ opacity: 0, y: 15 }}
            animate={{ opacity: 1, y: 0 }}
            className="p-4 sm:p-8"
          >
            <ApproView />
          </motion.div>
        );

      case 'cuisine-appro-boisson':
        return (
          <motion.div
            initial={{ opacity: 0, y: 15 }}
            animate={{ opacity: 1, y: 0 }}
            className="p-4 sm:p-8"
          >
            <ApproBoissonView />
          </motion.div>
        );

      case 'cuisine-boissons':
        return (
          <motion.div
            initial={{ opacity: 0, y: 15 }}
            animate={{ opacity: 1, y: 0 }}
            className="p-4 sm:p-8"
          >
            <BoissonsView />
          </motion.div>
        );

      case 'cuisine-repas':
        return (
          <motion.div
            initial={{ opacity: 0, y: 15 }}
            animate={{ opacity: 1, y: 0 }}
            className="p-4 sm:p-8"
          >
            <RepasView />
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
            {isChangingPage ? (
              <motion.div
                key="loader"
                initial={{ opacity: 0 }}
                animate={{ opacity: 1 }}
                exit={{ opacity: 0 }}
                className="flex items-center justify-center min-h-[50vh] h-[calc(100vh-150px)] lg:h-[calc(95vh-120px)] w-full"
              >
                <Loader size="lg" message="Chargement..." />
              </motion.div>
            ) : (
              <div key={activeMenuId}>
                {renderContent()}
              </div>
            )}
          </AnimatePresence>
        </main>
      </div>

      {/* Decorative Background Glows */}
      <div className="fixed top-[10%] right-[10%] w-[400px] h-[400px] bg-accent-light/10 blur-[150px] rounded-full pointer-events-none -z-10"></div>
      <div className="fixed bottom-[10%] left-[10%] w-[300px] h-[300px] bg-purple-500/10 blur-[150px] rounded-full pointer-events-none -z-10"></div>
    </div>
  );
};
