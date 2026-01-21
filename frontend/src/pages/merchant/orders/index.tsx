import { useState, useEffect } from 'react';
import { motion } from 'framer-motion';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import { Badge } from '@/components/ui/badge';
import { Skeleton } from '@/components/ui/skeleton';
import { OrderCard } from '@/components/merchant/order-card';
import { Button } from '@/components/ui/button';
import { ChevronLeft, ChevronRight, Package } from 'lucide-react';
import {
  useMerchantOrders,
  usePendingOrders,
  useAcceptOrder,
  useRejectOrder,
  useUpdateMerchantOrderStatus,
} from '@/hooks/use-merchant-orders';
import type { MerchantOrder } from '@/types/merchant';

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

export function MerchantOrdersPage() {
  const [page, setPage] = useState(1);
  const [activeTab, setActiveTab] = useState('pending');
  const [acceptingId, setAcceptingId] = useState<string | null>(null);
  const [rejectingId, setRejectingId] = useState<string | null>(null);
  const [updatingId, setUpdatingId] = useState<string | null>(null);

  const { data: ordersResponse, isLoading: ordersLoading, refetch: refetchOrders } = useMerchantOrders(page, 10);
  const { data: pendingOrders, isLoading: pendingLoading, refetch: refetchPending } = usePendingOrders();

  const acceptOrderMutation = useAcceptOrder();
  const rejectOrderMutation = useRejectOrder();
  const updateStatusMutation = useUpdateMerchantOrderStatus();

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

  const allOrders = ordersResponse?.data || [];
  const activeOrders = allOrders.filter((order: MerchantOrder) =>
    ['PAID', 'PREPARING', 'READY', 'ON_DELIVERY'].includes(order.status)
  );
  const completedOrders = allOrders.filter((order: MerchantOrder) =>
    ['COMPLETED', 'CANCELLED'].includes(order.status)
  );

  const pendingCount = pendingOrders?.filter((o) => o.status === 'PAID').length || 0;

  useEffect(() => {
    refetchPending();
    refetchOrders();
  }, []);

  const handleTabChange = (value: string) => {
    setActiveTab(value);
  };

  if (ordersLoading || pendingLoading) {
    return <OrdersSkeleton />;
  }

  return (
    <motion.div
      variants={containerVariants}
      initial="hidden"
      animate="visible"
      className="space-y-6"
    >
      <motion.div variants={itemVariants}>
        <h1 className="text-2xl font-bold">Orders</h1>
        <p className="text-muted-foreground">Manage your incoming and active orders</p>
      </motion.div>

      <motion.div variants={itemVariants}>
        <Tabs value={activeTab} onValueChange={handleTabChange} className="space-y-6">
          <TabsList>
            <TabsTrigger value="pending" className="gap-2" onClick={() => refetchOrders()}>
              Pending
              {pendingCount > 0 && (
                <Badge variant="secondary">{pendingCount}</Badge>
              )}
            </TabsTrigger>
            <TabsTrigger value="active" className="gap-2" onClick={() => refetchOrders()}>
              Active
              {activeOrders.length > 0 && (
                <Badge variant="secondary">{activeOrders.length}</Badge>
              )}
            </TabsTrigger>
            <TabsTrigger value="completed" onClick={() => refetchOrders()}>Completed</TabsTrigger>
            <TabsTrigger value="all" onClick={() => refetchOrders()}>All Orders</TabsTrigger>
          </TabsList>

          <TabsContent value="pending">
            {pendingLoading ? (
              <OrdersSkeleton />
            ) : !pendingOrders || pendingOrders.length === 0 ? (
              <EmptyOrders message="No pending orders" />
            ) : (
              <motion.div variants={containerVariants} className="space-y-4">
                {pendingOrders.map((order) => (
                  <motion.div key={order.id} variants={itemVariants}>
                    <OrderCard
                      order={order}
                      onAccept={() => handleAcceptOrder(order.id)}
                      onReject={() => handleRejectOrder(order.id)}
                      onMarkReady={() => handleMarkReady(order.id)}
                      isAccepting={acceptingId === order.id}
                      isRejecting={rejectingId === order.id}
                      isUpdating={updatingId === order.id}
                    />
                  </motion.div>
                ))}
              </motion.div>
            )}
          </TabsContent>

          <TabsContent value="active">
            {ordersLoading ? (
              <OrdersSkeleton />
            ) : activeOrders.length === 0 ? (
              <EmptyOrders message="No active orders" />
            ) : (
              <motion.div variants={containerVariants} className="space-y-4">
                {activeOrders.map((order: MerchantOrder) => (
                  <motion.div key={order.id} variants={itemVariants}>
                    <OrderCard
                      order={order}
                      onAccept={() => handleAcceptOrder(order.id)}
                      onReject={() => handleRejectOrder(order.id)}
                      onMarkReady={() => handleMarkReady(order.id)}
                      isAccepting={acceptingId === order.id}
                      isRejecting={rejectingId === order.id}
                      isUpdating={updatingId === order.id}
                    />
                  </motion.div>
                ))}
              </motion.div>
            )}
          </TabsContent>

          <TabsContent value="completed">
            {ordersLoading ? (
              <OrdersSkeleton />
            ) : completedOrders.length === 0 ? (
              <EmptyOrders message="No completed orders" />
            ) : (
              <motion.div variants={containerVariants} className="space-y-4">
                {completedOrders.map((order: MerchantOrder) => (
                  <motion.div key={order.id} variants={itemVariants}>
                    <OrderCard order={order} />
                  </motion.div>
                ))}
              </motion.div>
            )}
          </TabsContent>

          <TabsContent value="all">
            {ordersLoading ? (
              <OrdersSkeleton />
            ) : allOrders.length === 0 ? (
              <EmptyOrders message="No orders found" />
            ) : (
              <>
                <motion.div variants={containerVariants} className="space-y-4">
                  {allOrders.map((order: MerchantOrder) => (
                    <motion.div key={order.id} variants={itemVariants}>
                      <OrderCard
                        order={order}
                        onAccept={() => handleAcceptOrder(order.id)}
                        onReject={() => handleRejectOrder(order.id)}
                        onMarkReady={() => handleMarkReady(order.id)}
                        isAccepting={acceptingId === order.id}
                        isRejecting={rejectingId === order.id}
                        isUpdating={updatingId === order.id}
                      />
                    </motion.div>
                  ))}
                </motion.div>

                {ordersResponse && ordersResponse.totalPages > 1 && (
                  <div className="flex items-center justify-center gap-2 mt-6">
                    <Button
                      variant="outline"
                      size="sm"
                      onClick={() => setPage((p) => Math.max(1, p - 1))}
                      disabled={page === 1}
                    >
                      <ChevronLeft className="h-4 w-4" />
                      Previous
                    </Button>
                    <span className="text-sm text-muted-foreground">
                      Page {page} of {ordersResponse.totalPages}
                    </span>
                    <Button
                      variant="outline"
                      size="sm"
                      onClick={() => setPage((p) => p + 1)}
                      disabled={page >= ordersResponse.totalPages}
                    >
                      Next
                      <ChevronRight className="h-4 w-4" />
                    </Button>
                  </div>
                )}
              </>
            )}
          </TabsContent>
        </Tabs>
      </motion.div>
    </motion.div>
  );
}

function OrdersSkeleton() {
  return (
    <div className="space-y-4">
      {[1, 2, 3].map((i) => (
        <Skeleton key={i} className="h-24" />
      ))}
    </div>
  );
}

function EmptyOrders({ message }: { message: string }) {
  return (
    <div className="flex flex-col items-center justify-center py-12 text-center">
      <Package className="h-12 w-12 text-muted-foreground mb-4" />
      <p className="text-muted-foreground">{message}</p>
    </div>
  );
}
