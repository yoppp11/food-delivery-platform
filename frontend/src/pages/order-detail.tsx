import { useState } from 'react';
import { useTranslation } from 'react-i18next';
import { useParams } from 'react-router-dom';
import { motion } from 'framer-motion';
import {
  Package,
  CheckCircle,
  Truck,
  ChefHat,
  CreditCard,
  Phone,
  MapPin,
  Store,
  XCircle,
  Loader2,
} from 'lucide-react';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { Separator } from '@/components/ui/separator';
import { Avatar, AvatarFallback, AvatarImage } from '@/components/ui/avatar';
import { Skeleton } from '@/components/ui/skeleton';
import {
  AlertDialog,
  AlertDialogAction,
  AlertDialogCancel,
  AlertDialogContent,
  AlertDialogDescription,
  AlertDialogFooter,
  AlertDialogHeader,
  AlertDialogTitle,
  AlertDialogTrigger,
} from '@/components/ui/alert-dialog';
import { ChatButton } from '@/components/chat';
import { useOrderTracking, useCancelOrder } from '@/hooks/use-orders';
import { formatCurrency } from '@/lib/utils';
import { toast } from 'sonner';

const orderSteps = [
  { status: 'CREATED', label: 'Order Created', icon: Package },
  { status: 'PAID', label: 'Payment Confirmed', icon: CreditCard },
  { status: 'PREPARING', label: 'Preparing', icon: ChefHat },
  { status: 'READY', label: 'Ready for Pickup', icon: CheckCircle },
  { status: 'ON_DELIVERY', label: 'On Delivery', icon: Truck },
  { status: 'COMPLETED', label: 'Delivered', icon: CheckCircle },
];

export function OrderDetailPage() {
  const { t } = useTranslation();
  const { id } = useParams<{ id: string }>();
  const [isCancelling, setIsCancelling] = useState(false);

  const { data: order, isLoading } = useOrderTracking(id!);
  const cancelOrder = useCancelOrder();

  const handleCancelOrder = async () => {
    if (!id) return;
    setIsCancelling(true);
    cancelOrder.mutate(id, {
      onSuccess: () => {
        toast.success('Order cancelled successfully');
        setIsCancelling(false);
      },
      onError: () => {
        toast.error('Failed to cancel order');
        setIsCancelling(false);
      },
    });
  };

  const canCancel = order?.status === 'CREATED' || order?.status === 'PAID';

  if (isLoading) {
    return <OrderDetailSkeleton />;
  }

  if (!order) {
    return (
      <div className="container mx-auto px-4 py-16 text-center">
        <h1 className="text-2xl font-bold mb-4">Order not found</h1>
        <Button asChild>
          <a href="/orders">Back to Orders</a>
        </Button>
      </div>
    );
  }

  const currentStepIndex = orderSteps.findIndex((step) => step.status === order.status);
  const isCancelled = order.status === 'CANCELLED';

  return (
    <div className="min-h-screen bg-muted/30">
      <div className="container mx-auto px-4 py-8">
        {/* Header */}
        <div className="flex flex-col md:flex-row md:items-center md:justify-between mb-8">
          <div>
            <h1 className="text-2xl md:text-3xl font-bold">
              {t('tracking.title')}
            </h1>
            <p className="text-muted-foreground mt-1">
              Order #{order.id.slice(-8).toUpperCase()}
            </p>
          </div>
          <Badge
            variant={
              order.status === 'COMPLETED'
                ? 'success'
                : order.status === 'CANCELLED'
                ? 'destructive'
                : 'default'
            }
            className="mt-2 md:mt-0"
          >
            {t(`orders.statuses.${order.status}`)}
          </Badge>
        </div>

        <div className="grid lg:grid-cols-3 gap-8">
          {/* Main Content */}
          <div className="lg:col-span-2 space-y-6">
            {/* Progress Tracker */}
            {!isCancelled && (
              <Card>
                <CardHeader>
                  <CardTitle className="text-lg">Order Progress</CardTitle>
                </CardHeader>
                <CardContent>
                  <div className="relative">
                    {/* Progress Line */}
                    <div className="absolute left-[22px] top-0 bottom-0 w-0.5 bg-muted" />
                    <div
                      className="absolute left-[22px] top-0 w-0.5 bg-primary transition-all duration-500"
                      style={{
                        height: `${Math.min(
                          ((currentStepIndex + 1) / orderSteps.length) * 100,
                          100
                        )}%`,
                      }}
                    />

                    {/* Steps */}
                    <div className="space-y-6">
                      {orderSteps.map((step, index) => {
                        const isCompleted = index <= currentStepIndex;
                        const isCurrent = index === currentStepIndex;
                        const StepIcon = step.icon;

                        return (
                          <motion.div
                            key={step.status}
                            initial={{ opacity: 0, x: -20 }}
                            animate={{ opacity: 1, x: 0 }}
                            transition={{ delay: index * 0.1 }}
                            className="flex items-center gap-4 relative"
                          >
                            <motion.div
                              animate={
                                isCurrent
                                  ? { scale: [1, 1.1, 1] }
                                  : {}
                              }
                              transition={{
                                duration: 1,
                                repeat: isCurrent ? Infinity : 0,
                              }}
                              className={`h-11 w-11 rounded-full flex items-center justify-center z-10 ${
                                isCompleted
                                  ? 'bg-primary text-primary-foreground'
                                  : 'bg-muted text-muted-foreground'
                              }`}
                            >
                              <StepIcon className="h-5 w-5" />
                            </motion.div>
                            <div className="flex-1">
                              <p
                                className={`font-medium ${
                                  isCompleted ? 'text-foreground' : 'text-muted-foreground'
                                }`}
                              >
                                {step.label}
                              </p>
                              {isCurrent && (
                                <p className="text-sm text-primary">In progress...</p>
                              )}
                              {isCompleted && !isCurrent && (
                                <p className="text-sm text-muted-foreground">
                                  Completed
                                </p>
                              )}
                            </div>
                          </motion.div>
                        );
                      })}
                    </div>
                  </div>
                </CardContent>
              </Card>
            )}

            {/* Live Map (Placeholder) */}
            {order.status === 'ON_DELIVERY' && (
              <Card>
                <CardHeader>
                  <CardTitle className="text-lg flex items-center gap-2">
                    <MapPin className="h-5 w-5 text-primary" />
                    {t('tracking.liveLocation')}
                  </CardTitle>
                </CardHeader>
                <CardContent>
                  <div className="h-64 bg-muted rounded-lg flex items-center justify-center">
                    <div className="text-center">
                      <motion.div
                        animate={{ y: [0, -10, 0] }}
                        transition={{ duration: 1.5, repeat: Infinity }}
                        className="text-5xl mb-3"
                      >
                        🛵
                      </motion.div>
                      <p className="text-muted-foreground">
                        Driver is on the way!
                      </p>
                      <p className="text-sm text-muted-foreground mt-1">
                        Estimated arrival: 10-15 minutes
                      </p>
                    </div>
                  </div>
                </CardContent>
              </Card>
            )}

            {/* Driver Info */}
            {['ON_DELIVERY', 'READY'].includes(order.status) && order.driver && (
              <Card>
                <CardHeader>
                  <CardTitle className="text-lg">{t('tracking.driver')}</CardTitle>
                </CardHeader>
                <CardContent>
                  <div className="flex items-center justify-between">
                    <div className="flex items-center gap-4">
                      <Avatar className="h-14 w-14">
                        <AvatarImage src={order.driver.user?.image || `https://i.pravatar.cc/150?u=${order.driver.id}`} />
                        <AvatarFallback>
                          {order.driver.user?.email?.substring(0, 2).toUpperCase() || 'DR'}
                        </AvatarFallback>
                      </Avatar>
                      <div>
                        <p className="font-medium">
                          {order.driver.user?.userProfiles?.[0]?.fullName || order.driver.user?.email || 'Driver'}
                        </p>
                        <p className="text-sm text-muted-foreground">
                          {order.driver.plateNumber}
                        </p>
                        {order.driver.rating && (
                          <div className="flex items-center gap-1 mt-1">
                            <span className="text-yellow-500">★</span>
                            <span className="text-sm">{order.driver.rating.toFixed(1)}</span>
                          </div>
                        )}
                      </div>
                    </div>
                    <div className="flex gap-2">
                      <Button variant="outline" size="icon">
                        <Phone className="h-4 w-4" />
                      </Button>
                      <ChatButton
                        orderId={order.id}
                        type="CUSTOMER_DRIVER"
                        label=""
                        size="icon"
                      />
                    </div>
                  </div>
                </CardContent>
              </Card>
            )}

            {/* Order Items */}
            <Card>
              <CardHeader>
                <CardTitle className="text-lg">{t('tracking.orderDetails')}</CardTitle>
              </CardHeader>
              <CardContent className="space-y-4">
                {/* Restaurant */}
                <div className="flex items-center gap-3 p-3 bg-muted/50 rounded-lg">
                  <div className="h-10 w-10 rounded-lg bg-primary/10 flex items-center justify-center">
                    <Store className="h-5 w-5 text-primary" />
                  </div>
                  <div>
                    <p className="text-sm text-muted-foreground">From</p>
                    <p className="font-medium">{order.merchant?.name}</p>
                  </div>
                </div>

                <Separator />

                {/* Items */}
                <div className="space-y-3">
                  {order.items?.map((item) => {
                    const menuName = item.menuVariant?.menu?.name || item.menu?.name || 'Menu Item';
                    const variantName = item.menuVariant?.name || item.variant?.name;
                    return (
                      <div key={item.id} className="flex justify-between">
                        <div className="flex items-center gap-3">
                          <span className="text-sm font-medium bg-muted px-2 py-1 rounded">
                            {item.quantity}x
                          </span>
                          <div>
                            <span>{menuName}</span>
                            {variantName && (
                              <p className="text-sm text-muted-foreground">{variantName}</p>
                            )}
                          </div>
                        </div>
                        <span>{formatCurrency(item.price * item.quantity)}</span>
                      </div>
                    );
                  })}
                </div>

                <Separator />

                {/* Totals */}
                <div className="space-y-2">
                  <div className="flex justify-between text-sm">
                    <span className="text-muted-foreground">Subtotal</span>
                    <span>{formatCurrency(order.totalPrice)}</span>
                  </div>
                  <div className="flex justify-between text-sm">
                    <span className="text-muted-foreground">Delivery Fee</span>
                    <span>{formatCurrency(order.deliveryFee)}</span>
                  </div>
                  <Separator />
                  <div className="flex justify-between font-semibold text-lg">
                    <span>Total</span>
                    <span className="text-primary">
                      {formatCurrency(order.totalPrice + order.deliveryFee)}
                    </span>
                  </div>
                </div>
              </CardContent>
            </Card>
          </div>

          {/* Sidebar */}
          <div className="lg:col-span-1 space-y-6">
            {/* Estimated Arrival */}
            {!isCancelled && order.status !== 'COMPLETED' && (
              <Card className="bg-primary text-primary-foreground">
                <CardContent className="p-6 text-center">
                  <p className="text-sm opacity-90 mb-2">
                    {t('tracking.estimatedArrival')}
                  </p>
                  <motion.p
                    animate={{ scale: [1, 1.05, 1] }}
                    transition={{ duration: 2, repeat: Infinity }}
                    className="text-4xl font-bold"
                  >
                    25-35 min
                  </motion.p>
                </CardContent>
              </Card>
            )}

            {/* Delivery Address */}
            <Card>
              <CardHeader className="pb-3">
                <CardTitle className="text-sm font-medium text-muted-foreground">
                  Delivery Address
                </CardTitle>
              </CardHeader>
              <CardContent>
                <div className="flex items-start gap-3">
                  <MapPin className="h-5 w-5 text-primary mt-0.5" />
                  <div>
                    <p className="font-medium">Home</p>
                    <p className="text-sm text-muted-foreground">
                      Jl. Sudirman No. 123, Jakarta Selatan
                    </p>
                  </div>
                </div>
              </CardContent>
            </Card>

            {/* Payment Info */}
            <Card>
              <CardHeader className="pb-3">
                <CardTitle className="text-sm font-medium text-muted-foreground">
                  Payment Method
                </CardTitle>
              </CardHeader>
              <CardContent>
                <div className="flex items-center gap-3">
                  <div className="h-10 w-10 rounded-lg bg-green-100 flex items-center justify-center">
                    <span className="font-bold text-green-600">G</span>
                  </div>
                  <div>
                    <p className="font-medium">GoPay</p>
                    <Badge
                      variant={
                        order.paymentStatus === 'SUCCESS' ? 'success' : 'secondary'
                      }
                    >
                      {order.paymentStatus}
                    </Badge>
                  </div>
                </div>
              </CardContent>
            </Card>

            {/* Help */}
            <Card>
              <CardContent className="p-4 space-y-3">
                <p className="text-sm text-muted-foreground">
                  Need help with your order?
                </p>
                <ChatButton
                  orderId={order.id}
                  type="CUSTOMER_MERCHANT"
                  label="Chat with Restaurant"
                  variant="outline"
                  className="w-full"
                />
                <ChatButton
                  orderId={order.id}
                  type="CUSTOMER_SUPPORT"
                  label="Contact Support"
                  variant="outline"
                  className="w-full"
                />
              </CardContent>
            </Card>

            {/* Cancel Order Button */}
            {canCancel && (
              <AlertDialog>
                <AlertDialogTrigger asChild>
                  <Button variant="destructive" className="w-full">
                    <XCircle className="mr-2 h-4 w-4" />
                    Cancel Order
                  </Button>
                </AlertDialogTrigger>
                <AlertDialogContent>
                  <AlertDialogHeader>
                    <AlertDialogTitle>Cancel Order?</AlertDialogTitle>
                    <AlertDialogDescription>
                      Are you sure you want to cancel this order? 
                      {order.paymentStatus === 'SUCCESS' && ' Your payment will be refunded.'}
                      This action cannot be undone.
                    </AlertDialogDescription>
                  </AlertDialogHeader>
                  <AlertDialogFooter>
                    <AlertDialogCancel>Keep Order</AlertDialogCancel>
                    <AlertDialogAction
                      onClick={handleCancelOrder}
                      className="bg-destructive text-destructive-foreground hover:bg-destructive/90"
                      disabled={isCancelling}
                    >
                      {isCancelling ? (
                        <>
                          <Loader2 className="mr-2 h-4 w-4 animate-spin" />
                          Cancelling...
                        </>
                      ) : (
                        'Yes, Cancel Order'
                      )}
                    </AlertDialogAction>
                  </AlertDialogFooter>
                </AlertDialogContent>
              </AlertDialog>
            )}
          </div>
        </div>
      </div>
    </div>
  );
}

// Skeleton
function OrderDetailSkeleton() {
  return (
    <div className="min-h-screen bg-muted/30">
      <div className="container mx-auto px-4 py-8">
        <div className="mb-8 space-y-2">
          <Skeleton className="h-8 w-48" />
          <Skeleton className="h-4 w-32" />
        </div>
        <div className="grid lg:grid-cols-3 gap-8">
          <div className="lg:col-span-2 space-y-6">
            <Card>
              <CardContent className="p-6">
                <Skeleton className="h-64 w-full" />
              </CardContent>
            </Card>
          </div>
          <div className="lg:col-span-1 space-y-6">
            <Skeleton className="h-32" />
            <Skeleton className="h-32" />
          </div>
        </div>
      </div>
    </div>
  );
}
