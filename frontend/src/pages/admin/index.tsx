import { motion } from 'framer-motion';
import { Users, Store, Truck, ShoppingBag, DollarSign, Clock, TrendingUp } from 'lucide-react';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Skeleton } from '@/components/ui/skeleton';
import { StatsCard } from '@/components/admin/stats-card';
import { useAdminDashboard, useAdminOrders } from '@/hooks/use-admin';
import { formatCurrency } from '@/lib/utils';
import { useTranslation } from 'react-i18next';
import { Link } from 'react-router-dom';
import { OrderStatusBadge } from '@/components/admin/order-status-badge';

const containerVariants = {
  hidden: { opacity: 0 },
  visible: {
    opacity: 1,
    transition: { staggerChildren: 0.1 },
  },
};

const itemVariants = {
  hidden: { y: 20, opacity: 0 },
  visible: { y: 0, opacity: 1 },
};

export function AdminDashboardPage() {
  const { t } = useTranslation();
  const { data: stats, isLoading: statsLoading } = useAdminDashboard();
  const { data: recentOrders, isLoading: ordersLoading } = useAdminOrders({ limit: 10 });

  if (statsLoading) {
    return <DashboardSkeleton />;
  }

  return (
    <motion.div
      variants={containerVariants}
      initial="hidden"
      animate="visible"
      className="space-y-6"
    >
      <motion.div variants={itemVariants}>
        <h1 className="text-2xl font-bold">{t('admin.dashboard.title')}</h1>
        <p className="text-muted-foreground">{t('admin.dashboard.subtitle')}</p>
      </motion.div>

      <motion.div variants={itemVariants} className="grid gap-4 md:grid-cols-2 lg:grid-cols-4">
        <StatsCard
          title={t('admin.dashboard.totalUsers')}
          value={stats?.totalUsers || 0}
          icon={Users}
          description={t('admin.dashboard.registeredUsers')}
        />
        <StatsCard
          title={t('admin.dashboard.totalMerchants')}
          value={stats?.totalMerchants || 0}
          icon={Store}
          description={t('admin.dashboard.activeMerchants')}
        />
        <StatsCard
          title={t('admin.dashboard.totalDrivers')}
          value={stats?.totalDrivers || 0}
          icon={Truck}
          description={t('admin.dashboard.activeDrivers')}
        />
        <StatsCard
          title={t('admin.dashboard.totalOrders')}
          value={stats?.totalOrders || 0}
          icon={ShoppingBag}
          description={t('admin.dashboard.allTimeOrders')}
        />
      </motion.div>

      <motion.div variants={itemVariants} className="grid gap-4 md:grid-cols-2 lg:grid-cols-4">
        <StatsCard
          title={t('admin.dashboard.totalRevenue')}
          value={formatCurrency(stats?.totalRevenue || 0)}
          icon={DollarSign}
          description={t('admin.dashboard.allTimeRevenue')}
        />
        <StatsCard
          title={t('admin.dashboard.todayOrders')}
          value={stats?.todayOrders || 0}
          icon={TrendingUp}
          description={t('admin.dashboard.ordersToday')}
        />
        <StatsCard
          title={t('admin.dashboard.todayRevenue')}
          value={formatCurrency(stats?.todayRevenue || 0)}
          icon={DollarSign}
          description={t('admin.dashboard.revenueToday')}
        />
        <StatsCard
          title={t('admin.dashboard.activeOrders')}
          value={stats?.activeOrders || 0}
          icon={Clock}
          description={t('admin.dashboard.inProgress')}
        />
      </motion.div>

      <motion.div variants={itemVariants}>
        <Card>
          <CardHeader className="flex flex-row items-center justify-between">
            <CardTitle>{t('admin.dashboard.recentOrders')}</CardTitle>
            <Link
              to="/admin/orders"
              className="text-sm text-primary hover:underline"
            >
              {t('common.viewAll')}
            </Link>
          </CardHeader>
          <CardContent>
            {ordersLoading ? (
              <div className="space-y-4">
                {[...Array(5)].map((_, i) => (
                  <Skeleton key={i} className="h-12 w-full" />
                ))}
              </div>
            ) : (
              <div className="space-y-4">
                {recentOrders?.data.slice(0, 10).map((order) => (
                  <Link
                    key={order.id}
                    to={`/admin/orders/${order.id}`}
                    className="flex items-center justify-between rounded-lg border p-4 hover:bg-muted/50 transition-colors"
                  >
                    <div className="space-y-1">
                      <p className="font-medium">{order.id.slice(0, 8)}...</p>
                      <p className="text-sm text-muted-foreground">
                        {order.user?.email} • {order.merchant?.name}
                      </p>
                    </div>
                    <div className="flex items-center gap-4">
                      <span className="font-medium">{formatCurrency(order.totalPrice)}</span>
                      <OrderStatusBadge status={order.status} />
                    </div>
                  </Link>
                ))}
                {(!recentOrders?.data || recentOrders.data.length === 0) && (
                  <p className="text-center text-muted-foreground py-8">
                    {t('admin.dashboard.noRecentOrders')}
                  </p>
                )}
              </div>
            )}
          </CardContent>
        </Card>
      </motion.div>
    </motion.div>
  );
}

function DashboardSkeleton() {
  return (
    <div className="space-y-6">
      <div>
        <Skeleton className="h-8 w-48" />
        <Skeleton className="h-4 w-64 mt-2" />
      </div>
      <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-4">
        {[...Array(4)].map((_, i) => (
          <Skeleton key={i} className="h-32" />
        ))}
      </div>
      <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-4">
        {[...Array(4)].map((_, i) => (
          <Skeleton key={i} className="h-32" />
        ))}
      </div>
      <Skeleton className="h-96" />
    </div>
  );
}
