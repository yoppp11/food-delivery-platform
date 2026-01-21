import { useState } from 'react';
import { motion } from 'framer-motion';
import { Search, Eye, MoreHorizontal } from 'lucide-react';
import { Link } from 'react-router-dom';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Input } from '@/components/ui/input';
import { Button } from '@/components/ui/button';
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuTrigger,
} from '@/components/ui/dropdown-menu';
import { Skeleton } from '@/components/ui/skeleton';
import { OrderStatusBadge, PaymentStatusBadge, Pagination } from '@/components/admin';
import { useAdminOrders } from '@/hooks/use-admin';
import { useTranslation } from 'react-i18next';
import { formatCurrency } from '@/lib/utils';
import type { OrderStatus, PaymentStatus } from '@/types';

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

export function AdminOrdersPage() {
  const { t } = useTranslation();
  const [page, setPage] = useState(1);
  const [search, setSearch] = useState('');
  const [statusFilter, setStatusFilter] = useState<OrderStatus | ''>('');
  const [paymentStatusFilter, setPaymentStatusFilter] = useState<PaymentStatus | ''>('');

  const { data, isLoading } = useAdminOrders({
    page,
    limit: 20,
    search: search || undefined,
    orderStatus: statusFilter || undefined,
    paymentStatus: paymentStatusFilter || undefined,
  });

  return (
    <motion.div
      variants={containerVariants}
      initial="hidden"
      animate="visible"
      className="space-y-6"
    >
      <motion.div variants={itemVariants}>
        <h1 className="text-2xl font-bold">{t('admin.orders.title')}</h1>
        <p className="text-muted-foreground">{t('admin.orders.subtitle')}</p>
      </motion.div>

      <motion.div variants={itemVariants}>
        <Card>
          <CardHeader>
            <div className="flex flex-col gap-4 sm:flex-row sm:items-center sm:justify-between">
              <CardTitle>{t('admin.orders.allOrders')}</CardTitle>
              <div className="flex flex-col gap-2 sm:flex-row">
                <div className="relative">
                  <Search className="absolute left-3 top-1/2 h-4 w-4 -translate-y-1/2 text-muted-foreground" />
                  <Input
                    placeholder={t('admin.orders.searchPlaceholder')}
                    value={search}
                    onChange={(e) => setSearch(e.target.value)}
                    className="pl-9 w-full sm:w-48"
                  />
                </div>
                <select
                  value={statusFilter}
                  onChange={(e) => setStatusFilter(e.target.value as OrderStatus | '')}
                  className="border rounded-md px-3 py-2 text-sm"
                >
                  <option value="">{t('admin.orders.allStatuses')}</option>
                  <option value="CREATED">{t('orders.statuses.CREATED')}</option>
                  <option value="PAID">{t('orders.statuses.PAID')}</option>
                  <option value="PREPARING">{t('orders.statuses.PREPARING')}</option>
                  <option value="READY">{t('orders.statuses.READY')}</option>
                  <option value="ON_DELIVERY">{t('orders.statuses.ON_DELIVERY')}</option>
                  <option value="COMPLETED">{t('orders.statuses.COMPLETED')}</option>
                  <option value="CANCELLED">{t('orders.statuses.CANCELLED')}</option>
                </select>
                <select
                  value={paymentStatusFilter}
                  onChange={(e) => setPaymentStatusFilter(e.target.value as PaymentStatus | '')}
                  className="border rounded-md px-3 py-2 text-sm"
                >
                  <option value="">{t('admin.orders.allPaymentStatuses')}</option>
                  <option value="PENDING">{t('admin.paymentStatus.pending')}</option>
                  <option value="SUCCESS">{t('admin.paymentStatus.success')}</option>
                  <option value="FAILED">{t('admin.paymentStatus.failed')}</option>
                </select>
              </div>
            </div>
          </CardHeader>
          <CardContent>
            {isLoading ? (
              <div className="space-y-4">
                {[...Array(10)].map((_, i) => (
                  <Skeleton key={i} className="h-16 w-full" />
                ))}
              </div>
            ) : (
              <>
                <div className="overflow-x-auto">
                  <table className="w-full">
                    <thead>
                      <tr className="border-b text-left">
                        <th className="pb-3 font-medium">{t('admin.orders.orderId')}</th>
                        <th className="pb-3 font-medium">{t('admin.orders.customer')}</th>
                        <th className="pb-3 font-medium">{t('admin.orders.merchant')}</th>
                        <th className="pb-3 font-medium">{t('admin.orders.total')}</th>
                        <th className="pb-3 font-medium">{t('admin.orders.status')}</th>
                        <th className="pb-3 font-medium">{t('admin.orders.payment')}</th>
                        <th className="pb-3 font-medium">{t('admin.users.actions')}</th>
                      </tr>
                    </thead>
                    <tbody>
                      {data?.data.map((order) => (
                        <tr key={order.id} className="border-b hover:bg-muted/50">
                          <td className="py-4">
                            <span className="font-mono text-sm">
                              {order.id.slice(0, 8)}...
                            </span>
                          </td>
                          <td className="py-4 text-muted-foreground">
                            {order.user?.email}
                          </td>
                          <td className="py-4">{order.merchant?.name}</td>
                          <td className="py-4 font-medium">
                            {formatCurrency(order.totalPrice)}
                          </td>
                          <td className="py-4">
                            <OrderStatusBadge status={order.status} />
                          </td>
                          <td className="py-4">
                            <PaymentStatusBadge status={order.paymentStatus} />
                          </td>
                          <td className="py-4">
                            <DropdownMenu>
                              <DropdownMenuTrigger asChild>
                                <Button variant="ghost" size="icon">
                                  <MoreHorizontal className="h-4 w-4" />
                                </Button>
                              </DropdownMenuTrigger>
                              <DropdownMenuContent align="end">
                                <DropdownMenuItem asChild>
                                  <Link to={`/admin/orders/${order.id}`}>
                                    <Eye className="mr-2 h-4 w-4" />
                                    {t('admin.orders.viewDetails')}
                                  </Link>
                                </DropdownMenuItem>
                              </DropdownMenuContent>
                            </DropdownMenu>
                          </td>
                        </tr>
                      ))}
                    </tbody>
                  </table>
                </div>
                {data && (
                  <Pagination
                    page={page}
                    totalPages={data.totalPages}
                    onPageChange={setPage}
                  />
                )}
              </>
            )}
          </CardContent>
        </Card>
      </motion.div>
    </motion.div>
  );
}
