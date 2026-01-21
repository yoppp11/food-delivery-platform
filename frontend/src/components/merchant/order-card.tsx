import { Link } from 'react-router-dom';
import { Card, CardContent } from '@/components/ui/card';
import { OrderStatusBadge } from './order-status-badge';
import { OrderActions } from './order-actions';
import { formatCurrency, formatRelativeTime } from '@/lib/utils';
import { Eye } from 'lucide-react';
import { Button } from '@/components/ui/button';
import type { MerchantOrder } from '@/types/merchant';

interface OrderCardProps {
  order: MerchantOrder;
  onAccept?: () => void;
  onReject?: () => void;
  onMarkReady?: () => void;
  isAccepting?: boolean;
  isRejecting?: boolean;
  isUpdating?: boolean;
}

export function OrderCard({
  order,
  onAccept,
  onReject,
  onMarkReady,
  isAccepting,
  isRejecting,
  isUpdating,
}: OrderCardProps) {
  return (
    <Card>
      <CardContent className="p-4">
        <div className="flex flex-col md:flex-row md:items-center justify-between gap-4">
          <div className="space-y-1">
            <div className="flex items-center gap-2">
              <span className="font-semibold">
                Order #{order.id.slice(-8).toUpperCase()}
              </span>
              <OrderStatusBadge status={order.status} />
            </div>
            <div className="flex items-center gap-4 text-sm text-muted-foreground">
              <span>{order.items?.length || 0} items</span>
              <span>{formatCurrency(order.totalPrice)}</span>
              {order.createdAt && (
                <span>{formatRelativeTime(order.createdAt)}</span>
              )}
            </div>
            {order.items && order.items.length > 0 && (
              <div className="text-sm text-muted-foreground">
                {order.items.slice(0, 2).map((item, index) => (
                  <span key={item.id}>
                    {item.quantity}x {item.menuVariant?.name || 'Item'}
                    {index < Math.min(order.items!.length - 1, 1) && ', '}
                  </span>
                ))}
                {order.items.length > 2 && ` +${order.items.length - 2} more`}
              </div>
            )}
          </div>
          <div className="flex items-center gap-2">
            <OrderActions
              status={order.status}
              onAccept={onAccept}
              onReject={onReject}
              onMarkReady={onMarkReady}
              isAccepting={isAccepting}
              isRejecting={isRejecting}
              isUpdating={isUpdating}
            />
            <Link to={`/merchant/orders/${order.id}`}>
              <Button variant="outline" size="sm">
                <Eye className="mr-2 h-4 w-4" />
                View
              </Button>
            </Link>
          </div>
        </div>
      </CardContent>
    </Card>
  );
}
