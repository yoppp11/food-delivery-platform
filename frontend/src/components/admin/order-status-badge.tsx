import { Badge } from '@/components/ui/badge';
import { cn } from '@/lib/utils';
import type { OrderStatus } from '@/types';
import { useTranslation } from 'react-i18next';

interface OrderStatusBadgeProps {
  status: OrderStatus;
  className?: string;
}

export function OrderStatusBadge({ status, className }: OrderStatusBadgeProps) {
  const { t } = useTranslation();

  const statusConfig: Record<OrderStatus, { label: string; className: string }> = {
    CREATED: {
      label: t('orders.statuses.CREATED'),
      className: 'bg-gray-100 text-gray-800 hover:bg-gray-100',
    },
    PAID: {
      label: t('orders.statuses.PAID'),
      className: 'bg-blue-100 text-blue-800 hover:bg-blue-100',
    },
    PREPARING: {
      label: t('orders.statuses.PREPARING'),
      className: 'bg-yellow-100 text-yellow-800 hover:bg-yellow-100',
    },
    READY: {
      label: t('orders.statuses.READY'),
      className: 'bg-purple-100 text-purple-800 hover:bg-purple-100',
    },
    ON_DELIVERY: {
      label: t('orders.statuses.ON_DELIVERY'),
      className: 'bg-orange-100 text-orange-800 hover:bg-orange-100',
    },
    COMPLETED: {
      label: t('orders.statuses.COMPLETED'),
      className: 'bg-green-100 text-green-800 hover:bg-green-100',
    },
    CANCELLED: {
      label: t('orders.statuses.CANCELLED'),
      className: 'bg-red-100 text-red-800 hover:bg-red-100',
    },
  };

  const config = statusConfig[status];

  return (
    <Badge variant="secondary" className={cn(config.className, className)}>
      {config.label}
    </Badge>
  );
}
