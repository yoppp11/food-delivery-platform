import { useTranslation } from 'react-i18next';
import { Link } from 'react-router-dom';
import { motion } from 'framer-motion';
import {
  Package,
  Clock,
  CheckCircle,
  XCircle,
  Truck,
  ChefHat,
  CreditCard,
  Eye,
  RotateCcw,
  Star,
} from 'lucide-react';
import { Button } from '@/components/ui/button';
import { Card, CardContent } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { Skeleton } from '@/components/ui/skeleton';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import { useOrders } from '@/hooks/use-orders';
import { formatCurrency, formatDateTime } from '@/lib/utils';
import type { Order, OrderStatus } from '@/types';

const statusConfig: Record<
  OrderStatus,
  { icon: React.ElementType; color: string; bgColor: string }
> = {
  CREATED: { icon: Clock, color: 'text-blue-600', bgColor: 'bg-blue-100' },
  PAID: { icon: CreditCard, color: 'text-green-600', bgColor: 'bg-green-100' },
  PREPARING: { icon: ChefHat, color: 'text-orange-600', bgColor: 'bg-orange-100' },
  READY: { icon: Package, color: 'text-purple-600', bgColor: 'bg-purple-100' },
  ON_DELIVERY: { icon: Truck, color: 'text-primary', bgColor: 'bg-primary/10' },
  COMPLETED: { icon: CheckCircle, color: 'text-green-600', bgColor: 'bg-green-100' },
  CANCELLED: { icon: XCircle, color: 'text-red-600', bgColor: 'bg-red-100' },
};

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

export function OrdersPage() {
  const { t } = useTranslation();

  const { data: orders, isLoading } = useOrders();

  const activeOrders = orders?.filter((order: Order) =>
    ['CREATED', 'PAID', 'PREPARING', 'READY', 'ON_DELIVERY'].includes(order.status)
  );

  const completedOrders = orders?.filter((order: Order) =>
    ['COMPLETED', 'CANCELLED'].includes(order.status)
  );

  return (
    <div className="min-h-screen bg-muted/30">
      <div className="container mx-auto px-4 py-8">
        <h1 className="text-2xl md:text-3xl font-bold mb-8">{t('orders.title')}</h1>

        <Tabs defaultValue="active" className="space-y-6">
          <TabsList className="grid w-full max-w-md grid-cols-2">
            <TabsTrigger value="active" className="gap-2">
              {t('orders.active')}
              {activeOrders && activeOrders.length > 0 && (
                <Badge variant="secondary" className="ml-1">
                  {activeOrders.length}
                </Badge>
              )}
            </TabsTrigger>
            <TabsTrigger value="history">{t('orders.history')}</TabsTrigger>
          </TabsList>

          <TabsContent value="active">
            {isLoading ? (
              <OrdersSkeleton />
            ) : activeOrders?.length === 0 ? (
              <EmptyState
                icon={Package}
                title={t('orders.noActive')}
                description="Start ordering to see your active orders here"
                actionLabel="Browse Restaurants"
                actionHref="/restaurants"
              />
            ) : (
              <motion.div
                variants={containerVariants}
                initial="hidden"
                animate="visible"
                className="space-y-4"
              >
                {activeOrders?.map((order: Order) => (
                  <OrderCard key={order.id} order={order} showTrack />
                ))}
              </motion.div>
            )}
          </TabsContent>

          <TabsContent value="history">
            {isLoading ? (
              <OrdersSkeleton />
            ) : completedOrders?.length === 0 ? (
              <EmptyState
                icon={Clock}
                title={t('orders.noHistory')}
                description="Your completed orders will appear here"
                actionLabel="Browse Restaurants"
                actionHref="/restaurants"
              />
            ) : (
              <motion.div
                variants={containerVariants}
                initial="hidden"
                animate="visible"
                className="space-y-4"
              >
                {completedOrders?.map((order: Order) => (
                  <OrderCard key={order.id} order={order} />
                ))}
              </motion.div>
            )}
          </TabsContent>
        </Tabs>
      </div>
    </div>
  );
}

// Order Card Component
function OrderCard({ order, showTrack }: { order: Order; showTrack?: boolean }) {
  const { t } = useTranslation();
  const statusInfo = statusConfig[order.status];
  const StatusIcon = statusInfo.icon;

  return (
    <motion.div variants={itemVariants}>
      <Card className="overflow-hidden">
        <CardContent className="p-0">
          {/* Header */}
          <div className="p-4 border-b bg-muted/30">
            <div className="flex items-center justify-between">
              <div className="flex items-center gap-3">
                <div
                  className={`h-10 w-10 rounded-full flex items-center justify-center ${statusInfo.bgColor}`}
                >
                  <StatusIcon className={`h-5 w-5 ${statusInfo.color}`} />
                </div>
                <div>
                  <p className="font-medium">
                    {t('orders.orderNumber')} #{order.id.slice(-8).toUpperCase()}
                  </p>
                  <p className="text-sm text-muted-foreground">
                    {order.merchant?.name}
                  </p>
                </div>
              </div>
              <Badge
                variant={
                  order.status === 'COMPLETED'
                    ? 'success'
                    : order.status === 'CANCELLED'
                    ? 'destructive'
                    : 'secondary'
                }
              >
                {t(`orders.statuses.${order.status}`)}
              </Badge>
            </div>
          </div>

          {/* Items */}
          <div className="p-4">
            <div className="space-y-2 mb-4">
              {order.items?.slice(0, 2).map((item) => {
                const menuName = item.menuVariant?.menu?.name || item.menu?.name || 'Menu Item';
                return (
                  <div key={item.id} className="flex items-center justify-between text-sm">
                    <span>
                      {item.quantity}x {menuName}
                    </span>
                    <span className="text-muted-foreground">
                      {formatCurrency(item.price * item.quantity)}
                    </span>
                  </div>
                );
              })}
              {order.items && order.items.length > 2 && (
                <p className="text-sm text-muted-foreground">
                  +{order.items.length - 2} more items
                </p>
              )}
            </div>

            <div className="flex items-center justify-between pt-4 border-t">
              <div>
                <p className="text-sm text-muted-foreground">{t('orders.total')}</p>
                <p className="font-semibold text-lg">
                  {formatCurrency(order.totalPrice + order.deliveryFee)}
                </p>
              </div>
              <div className="flex gap-2">
                {showTrack && (
                  <Button asChild>
                    <Link to={`/orders/${order.id}`}>
                      <Truck className="h-4 w-4 mr-2" />
                      {t('orders.trackOrder')}
                    </Link>
                  </Button>
                )}
                {order.status === 'COMPLETED' && (
                  <>
                    <Button variant="outline">
                      <RotateCcw className="h-4 w-4 mr-2" />
                      {t('orders.reorder')}
                    </Button>
                    <Button variant="outline">
                      <Star className="h-4 w-4 mr-2" />
                      {t('orders.rateOrder')}
                    </Button>
                  </>
                )}
                <Button variant="ghost" asChild>
                  <Link to={`/orders/${order.id}`}>
                    <Eye className="h-4 w-4 mr-2" />
                    {t('orders.viewDetails')}
                  </Link>
                </Button>
              </div>
            </div>
          </div>
        </CardContent>
      </Card>
    </motion.div>
  );
}

// Empty State Component
function EmptyState({
  icon: Icon,
  title,
  description,
  actionLabel,
  actionHref,
}: {
  icon: React.ElementType;
  title: string;
  description: string;
  actionLabel: string;
  actionHref: string;
}) {
  return (
    <div className="text-center py-16">
      <motion.div
        initial={{ scale: 0 }}
        animate={{ scale: 1 }}
        transition={{ type: 'spring', damping: 15 }}
      >
        <div className="h-20 w-20 mx-auto mb-6 rounded-full bg-muted flex items-center justify-center">
          <Icon className="h-10 w-10 text-muted-foreground" />
        </div>
      </motion.div>
      <h3 className="text-xl font-semibold mb-2">{title}</h3>
      <p className="text-muted-foreground mb-6">{description}</p>
      <Button asChild>
        <Link to={actionHref}>{actionLabel}</Link>
      </Button>
    </div>
  );
}

// Skeleton
function OrdersSkeleton() {
  return (
    <div className="space-y-4">
      {Array.from({ length: 3 }).map((_, i) => (
        <Card key={i}>
          <CardContent className="p-4 space-y-4">
            <div className="flex items-center gap-3">
              <Skeleton className="h-10 w-10 rounded-full" />
              <div className="space-y-2">
                <Skeleton className="h-4 w-32" />
                <Skeleton className="h-3 w-24" />
              </div>
            </div>
            <Skeleton className="h-20 w-full" />
          </CardContent>
        </Card>
      ))}
    </div>
  );
}
