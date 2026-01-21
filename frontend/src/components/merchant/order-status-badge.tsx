import { Badge } from '@/components/ui/badge';
import { cn } from '@/lib/utils';
import type { OrderStatus } from '@/types/merchant';

const statusConfig: Record<OrderStatus | 'REFUNDED', { label: string; variant: 'default' | 'secondary' | 'destructive' | 'success' | 'warning' | 'outline' }> = {
  CREATED: { label: 'Created', variant: 'secondary' },
  PAID: { label: 'Paid', variant: 'warning' },
  PREPARING: { label: 'Preparing', variant: 'default' },
  READY: { label: 'Ready', variant: 'success' },
  ON_DELIVERY: { label: 'On Delivery', variant: 'default' },
  COMPLETED: { label: 'Completed', variant: 'success' },
  CANCELLED: { label: 'Cancelled', variant: 'destructive' },
  REFUNDED: { label: 'Refunded', variant: 'warning' },
};

interface OrderStatusBadgeProps {
  status: OrderStatus | 'REFUNDED';
  className?: string;
}

export function OrderStatusBadge({ status, className }: OrderStatusBadgeProps) {
  const config = statusConfig[status] || statusConfig.CREATED;
  
  return (
    <Badge variant={config.variant} className={cn('', className)}>
      {config.label}
    </Badge>
  );
}
