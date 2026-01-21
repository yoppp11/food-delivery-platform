import { useParams, Link } from 'react-router-dom';
import { motion } from 'framer-motion';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Skeleton } from '@/components/ui/skeleton';
import { Separator } from '@/components/ui/separator';
import { OrderStatusBadge } from '@/components/merchant/order-status-badge';
import { OrderActions } from '@/components/merchant/order-actions';
import { ArrowLeft, Clock } from 'lucide-react';
import { formatCurrency, formatDateTime } from '@/lib/utils';
import {
  useMerchantOrderDetail,
  useMerchantOrderStatusHistory,
  useAcceptOrder,
  useRejectOrder,
  useUpdateMerchantOrderStatus,
} from '@/hooks/use-merchant-orders';
import { useState } from 'react';

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

export function MerchantOrderDetailPage() {
  const { id } = useParams<{ id: string }>();
  const orderId = id || '';

  const { data: order, isLoading } = useMerchantOrderDetail(orderId);
  const { data: statusHistory, isLoading: historyLoading } =
    useMerchantOrderStatusHistory(orderId);

  const acceptOrderMutation = useAcceptOrder();
  const rejectOrderMutation = useRejectOrder();
  const updateStatusMutation = useUpdateMerchantOrderStatus();

  const [isAccepting, setIsAccepting] = useState(false);
  const [isRejecting, setIsRejecting] = useState(false);
  const [isUpdating, setIsUpdating] = useState(false);

  const handleAccept = () => {
    setIsAccepting(true);
    acceptOrderMutation.mutate(orderId, {
      onSettled: () => setIsAccepting(false),
    });
  };

  const handleReject = () => {
    setIsRejecting(true);
    rejectOrderMutation.mutate(orderId, {
      onSettled: () => setIsRejecting(false),
    });
  };

  const handleMarkReady = () => {
    setIsUpdating(true);
    updateStatusMutation.mutate(
      { id: orderId, status: 'READY' },
      { onSettled: () => setIsUpdating(false) }
    );
  };

  if (isLoading) {
    return <OrderDetailSkeleton />;
  }

  if (!order) {
    return (
      <div className="flex flex-col items-center justify-center py-12">
        <p className="text-muted-foreground">Order not found</p>
        <Link to="/merchant/orders">
          <Button variant="link">Back to Orders</Button>
        </Link>
      </div>
    );
  }

  const subtotal = order.items?.reduce(
    (sum, item) => sum + item.price * item.quantity,
    0
  ) || 0;

  return (
    <motion.div
      variants={containerVariants}
      initial="hidden"
      animate="visible"
      className="space-y-6"
    >
      <motion.div variants={itemVariants} className="flex items-center gap-4">
        <Link to="/merchant/orders">
          <Button variant="ghost" size="icon">
            <ArrowLeft className="h-5 w-5" />
          </Button>
        </Link>
        <div>
          <h1 className="text-2xl font-bold">
            Order #{order.id.slice(-8).toUpperCase()}
          </h1>
          <p className="text-muted-foreground">View order details and manage status</p>
        </div>
      </motion.div>

      <div className="grid gap-6 lg:grid-cols-3">
        <motion.div variants={itemVariants} className="lg:col-span-2 space-y-6">
          <Card>
            <CardHeader className="flex flex-row items-center justify-between">
              <CardTitle>Order Status</CardTitle>
              <OrderStatusBadge status={order.status} />
            </CardHeader>
            <CardContent>
              <OrderActions
                status={order.status}
                onAccept={handleAccept}
                onReject={handleReject}
                onMarkReady={handleMarkReady}
                isAccepting={isAccepting}
                isRejecting={isRejecting}
                isUpdating={isUpdating}
              />
            </CardContent>
          </Card>

          <Card>
            <CardHeader>
              <CardTitle>Order Items</CardTitle>
            </CardHeader>
            <CardContent>
              <div className="space-y-4">
                {order.items?.map((item) => (
                  <div key={item.id} className="flex items-center justify-between">
                    <div className="flex items-center gap-4">
                      <div className="h-12 w-12 rounded-lg bg-muted flex items-center justify-center">
                        <span className="text-lg font-medium">{item.quantity}</span>
                      </div>
                      <div>
                        <p className="font-medium">
                          {item.menuVariant?.name || 'Menu Item'}
                        </p>
                        {item.menuVariant?.menu && (
                          <p className="text-sm text-muted-foreground">
                            {item.menuVariant.menu.name}
                          </p>
                        )}
                      </div>
                    </div>
                    <p className="font-medium">
                      {formatCurrency(item.price * item.quantity)}
                    </p>
                  </div>
                ))}

                <Separator />

                <div className="space-y-2">
                  <div className="flex justify-between text-sm">
                    <span className="text-muted-foreground">Subtotal</span>
                    <span>{formatCurrency(subtotal)}</span>
                  </div>
                  {order.deliveryFee && (
                    <div className="flex justify-between text-sm">
                      <span className="text-muted-foreground">Delivery Fee</span>
                      <span>{formatCurrency(order.deliveryFee)}</span>
                    </div>
                  )}
                  <Separator />
                  <div className="flex justify-between font-semibold">
                    <span>Total</span>
                    <span>{formatCurrency(order.totalPrice)}</span>
                  </div>
                </div>
              </div>
            </CardContent>
          </Card>
        </motion.div>

        <motion.div variants={itemVariants} className="space-y-6">
          <Card>
            <CardHeader>
              <CardTitle>Status History</CardTitle>
            </CardHeader>
            <CardContent>
              {historyLoading ? (
                <div className="space-y-4">
                  {[1, 2, 3].map((i) => (
                    <div key={i} className="flex items-start gap-3">
                      <Skeleton className="h-8 w-8 rounded-full" />
                      <div className="space-y-1">
                        <Skeleton className="h-4 w-24" />
                        <Skeleton className="h-3 w-32" />
                      </div>
                    </div>
                  ))}
                </div>
              ) : !statusHistory || statusHistory.length === 0 ? (
                <p className="text-sm text-muted-foreground">No status history</p>
              ) : (
                <div className="space-y-4">
                  {statusHistory.map((history) => (
                    <div key={history.id} className="flex items-start gap-3">
                      <div className="h-8 w-8 rounded-full bg-primary/10 flex items-center justify-center">
                        <Clock className="h-4 w-4 text-primary" />
                      </div>
                      <div>
                        <p className="font-medium text-sm">{history.status}</p>
                        <p className="text-xs text-muted-foreground">
                          {formatDateTime(history.changedAt)}
                        </p>
                      </div>
                    </div>
                  ))}
                </div>
              )}
            </CardContent>
          </Card>

          <Card>
            <CardHeader>
              <CardTitle>Payment Info</CardTitle>
            </CardHeader>
            <CardContent>
              <div className="space-y-2 text-sm">
                <div className="flex justify-between">
                  <span className="text-muted-foreground">Status</span>
                  <span className="font-medium">{order.paymentStatus}</span>
                </div>
                <div className="flex justify-between">
                  <span className="text-muted-foreground">Amount</span>
                  <span className="font-medium">{formatCurrency(order.totalPrice)}</span>
                </div>
              </div>
            </CardContent>
          </Card>
        </motion.div>
      </div>
    </motion.div>
  );
}

function OrderDetailSkeleton() {
  return (
    <div className="space-y-6">
      <div className="flex items-center gap-4">
        <Skeleton className="h-10 w-10" />
        <div className="space-y-2">
          <Skeleton className="h-8 w-48" />
          <Skeleton className="h-4 w-64" />
        </div>
      </div>
      <div className="grid gap-6 lg:grid-cols-3">
        <div className="lg:col-span-2 space-y-6">
          <Skeleton className="h-32" />
          <Skeleton className="h-64" />
        </div>
        <div className="space-y-6">
          <Skeleton className="h-48" />
          <Skeleton className="h-32" />
        </div>
      </div>
    </div>
  );
}
