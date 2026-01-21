import { useParams, Link } from 'react-router-dom';
import { motion } from 'framer-motion';
import { ArrowLeft, User, Store, Truck } from 'lucide-react';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Skeleton } from '@/components/ui/skeleton';
import { OrderStatusBadge, PaymentStatusBadge } from '@/components/admin';
import { useAdminOrder } from '@/hooks/use-admin';
import { useTranslation } from 'react-i18next';
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

export function AdminOrderDetailPage() {
  const { t } = useTranslation();
  const { id } = useParams<{ id: string }>();
  const { data: order, isLoading } = useAdminOrder(id || '');

  if (isLoading) {
    return <OrderDetailSkeleton />;
  }

  if (!order) {
    return (
      <div className="flex flex-col items-center justify-center py-12">
        <p className="text-muted-foreground">{t('admin.orders.notFound')}</p>
        <Link to="/admin/orders">
          <Button variant="link">{t('admin.orders.backToList')}</Button>
        </Link>
      </div>
    );
  }

  return (
    <motion.div
      variants={containerVariants}
      initial="hidden"
      animate="visible"
      className="space-y-6"
    >
      <motion.div variants={itemVariants}>
        <Link
          to="/admin/orders"
          className="inline-flex items-center text-sm text-muted-foreground hover:text-foreground mb-4"
        >
          <ArrowLeft className="mr-2 h-4 w-4" />
          {t('admin.orders.backToList')}
        </Link>
        <div className="flex items-center justify-between">
          <div>
            <h1 className="text-2xl font-bold">{t('admin.orders.orderDetails')}</h1>
            <p className="text-muted-foreground font-mono">{order.id}</p>
          </div>
          <div className="flex items-center gap-2">
            <OrderStatusBadge status={order.status} />
            <PaymentStatusBadge status={order.paymentStatus} />
          </div>
        </div>
      </motion.div>

      <div className="grid gap-6 lg:grid-cols-3">
        <motion.div variants={itemVariants}>
          <Card>
            <CardHeader>
              <CardTitle className="flex items-center gap-2">
                <User className="h-5 w-5" />
                {t('admin.orders.customer')}
              </CardTitle>
            </CardHeader>
            <CardContent>
              <p className="font-medium">{order.user?.email}</p>
              <Link
                to={`/admin/users/${order.userId}`}
                className="text-sm text-primary hover:underline"
              >
                {t('admin.orders.viewCustomer')}
              </Link>
            </CardContent>
          </Card>
        </motion.div>

        <motion.div variants={itemVariants}>
          <Card>
            <CardHeader>
              <CardTitle className="flex items-center gap-2">
                <Store className="h-5 w-5" />
                {t('admin.orders.merchant')}
              </CardTitle>
            </CardHeader>
            <CardContent>
              <p className="font-medium">{order.merchant?.name}</p>
              <Link
                to={`/admin/merchants/${order.merchantId}`}
                className="text-sm text-primary hover:underline"
              >
                {t('admin.orders.viewMerchant')}
              </Link>
            </CardContent>
          </Card>
        </motion.div>

        <motion.div variants={itemVariants}>
          <Card>
            <CardHeader>
              <CardTitle className="flex items-center gap-2">
                <Truck className="h-5 w-5" />
                {t('admin.orders.driver')}
              </CardTitle>
            </CardHeader>
            <CardContent>
              {order.driver ? (
                <>
                  <p className="font-medium">{order.driver.plateNumber}</p>
                  <Link
                    to={`/admin/drivers/${order.driverId}`}
                    className="text-sm text-primary hover:underline"
                  >
                    {t('admin.orders.viewDriver')}
                  </Link>
                </>
              ) : (
                <p className="text-muted-foreground">{t('admin.orders.noDriver')}</p>
              )}
            </CardContent>
          </Card>
        </motion.div>
      </div>

      <motion.div variants={itemVariants}>
        <Card>
          <CardHeader>
            <CardTitle>{t('admin.orders.orderSummary')}</CardTitle>
          </CardHeader>
          <CardContent>
            <div className="space-y-4">
              {order.items?.map((item) => (
                <div
                  key={item.id}
                  className="flex items-center justify-between border-b pb-4"
                >
                  <div>
                    <p className="font-medium">{item.menu?.name}</p>
                    {item.variant && (
                      <p className="text-sm text-muted-foreground">
                        {item.variant.name}
                      </p>
                    )}
                    <p className="text-sm text-muted-foreground">
                      {t('admin.orders.quantity')}: {item.quantity}
                    </p>
                  </div>
                  <p className="font-medium">{formatCurrency(item.price * item.quantity)}</p>
                </div>
              ))}

              <div className="space-y-2 pt-4">
                <div className="flex justify-between text-muted-foreground">
                  <span>{t('cart.subtotal')}</span>
                  <span>{formatCurrency(order.totalPrice - (order.deliveryFee || 0))}</span>
                </div>
                <div className="flex justify-between text-muted-foreground">
                  <span>{t('cart.deliveryFee')}</span>
                  <span>{formatCurrency(order.deliveryFee || 0)}</span>
                </div>
                <div className="flex justify-between text-lg font-bold border-t pt-2">
                  <span>{t('cart.total')}</span>
                  <span>{formatCurrency(order.totalPrice)}</span>
                </div>
              </div>
            </div>
          </CardContent>
        </Card>
      </motion.div>
    </motion.div>
  );
}

function OrderDetailSkeleton() {
  return (
    <div className="space-y-6">
      <div>
        <Skeleton className="h-4 w-32 mb-4" />
        <Skeleton className="h-8 w-48" />
        <Skeleton className="h-4 w-64 mt-2" />
      </div>
      <div className="grid gap-6 lg:grid-cols-3">
        <Skeleton className="h-32" />
        <Skeleton className="h-32" />
        <Skeleton className="h-32" />
      </div>
      <Skeleton className="h-64" />
    </div>
  );
}
