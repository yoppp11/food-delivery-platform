import { useState } from 'react';
import { motion } from 'framer-motion';
import { ShoppingBag, DollarSign, Star, Clock } from 'lucide-react';
import { Skeleton } from '@/components/ui/skeleton';
import { StatsCard } from '@/components/merchant/stats-card';
import { StatusToggle } from '@/components/merchant/status-toggle';
import { PendingOrdersWidget } from '@/components/merchant/pending-orders-widget';
import { RecentReviewsWidget } from '@/components/merchant/recent-reviews-widget';
import {
  useToggleMerchantStatus,
  useMerchantReviews,
} from '@/hooks/use-merchant-profile';
import {
  usePendingOrders,
  useAcceptOrder,
  useRejectOrder,
  useUpdateMerchantOrderStatus,
} from '@/hooks/use-merchant-orders';
import { useMerchantContext } from '@/providers/merchant-provider';
import { formatCurrency } from '@/lib/utils';

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

export function MerchantDashboardPage() {
  const { currentMerchant: merchant, isLoading: merchantLoading } = useMerchantContext();
  const merchantId = merchant?.id || '';

  const { data: pendingOrders, isLoading: ordersLoading } = usePendingOrders();
  const { data: reviewsResponse, isLoading: reviewsLoading } = useMerchantReviews(merchantId, 1, 5);

  const toggleStatusMutation = useToggleMerchantStatus(merchantId);
  const acceptOrderMutation = useAcceptOrder();
  const rejectOrderMutation = useRejectOrder();
  const updateStatusMutation = useUpdateMerchantOrderStatus();

  const [acceptingId, setAcceptingId] = useState<string | null>(null);
  const [rejectingId, setRejectingId] = useState<string | null>(null);
  const [updatingId, setUpdatingId] = useState<string | null>(null);

  const handleToggleStatus = () => {
    toggleStatusMutation.mutate();
  };

  const handleAcceptOrder = (orderId: string) => {
    setAcceptingId(orderId);
    acceptOrderMutation.mutate(orderId, {
      onSettled: () => setAcceptingId(null),
    });
  };

  const handleRejectOrder = (orderId: string) => {
    setRejectingId(orderId);
    rejectOrderMutation.mutate(orderId, {
      onSettled: () => setRejectingId(null),
    });
  };

  const handleMarkReady = (orderId: string) => {
    setUpdatingId(orderId);
    updateStatusMutation.mutate(
      { id: orderId, status: 'READY' },
      { onSettled: () => setUpdatingId(null) }
    );
  };

  const pendingCount = pendingOrders?.filter((o) => o.status === 'PAID').length || 0;
  const preparingCount = pendingOrders?.filter((o) => o.status === 'PREPARING').length || 0;
  const todayRevenue = pendingOrders?.reduce((sum, order) => {
    if (order.status === 'COMPLETED') {
      return sum + order.totalPrice;
    }
    return sum;
  }, 0) || 0;

  if (merchantLoading) {
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
        <h1 className="text-2xl font-bold">Welcome back, {merchant?.name}</h1>
        <p className="text-muted-foreground">Here's what's happening with your store today.</p>
      </motion.div>

      <motion.div variants={itemVariants}>
        <StatusToggle
          isOpen={merchant?.isOpen || false}
          isLoading={toggleStatusMutation.isPending}
          onToggle={handleToggleStatus}
        />
      </motion.div>

      <motion.div variants={itemVariants} className="grid gap-4 md:grid-cols-2 lg:grid-cols-4">
        <StatsCard
          title="Pending Orders"
          value={pendingCount}
          icon={Clock}
          description="Awaiting acceptance"
        />
        <StatsCard
          title="Preparing"
          value={preparingCount}
          icon={ShoppingBag}
          description="Currently cooking"
        />
        <StatsCard
          title="Today's Revenue"
          value={formatCurrency(todayRevenue)}
          icon={DollarSign}
          description="From completed orders"
        />
        <StatsCard
          title="Average Rating"
          value={merchant?.rating?.toFixed(1) || 'N/A'}
          icon={Star}
          description={`${merchant?.reviewCount || 0} reviews`}
        />
      </motion.div>

      <div className="grid gap-6 lg:grid-cols-2">
        <motion.div variants={itemVariants}>
          <PendingOrdersWidget
            orders={pendingOrders}
            isLoading={ordersLoading}
            onAccept={handleAcceptOrder}
            onReject={handleRejectOrder}
            onMarkReady={handleMarkReady}
            acceptingId={acceptingId}
            rejectingId={rejectingId}
            updatingId={updatingId}
          />
        </motion.div>

        <motion.div variants={itemVariants}>
          <RecentReviewsWidget
            reviews={reviewsResponse?.data}
            isLoading={reviewsLoading}
          />
        </motion.div>
      </div>
    </motion.div>
  );
}

function DashboardSkeleton() {
  return (
    <div className="space-y-6">
      <div className="space-y-2">
        <Skeleton className="h-8 w-64" />
        <Skeleton className="h-4 w-96" />
      </div>
      <Skeleton className="h-24 w-full" />
      <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-4">
        {[1, 2, 3, 4].map((i) => (
          <Skeleton key={i} className="h-32" />
        ))}
      </div>
      <div className="grid gap-6 lg:grid-cols-2">
        <Skeleton className="h-96" />
        <Skeleton className="h-96" />
      </div>
    </div>
  );
}
