import { Link } from 'react-router-dom';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Skeleton } from '@/components/ui/skeleton';
import { OrderStatusBadge } from './order-status-badge';
import { OrderActions } from './order-actions';
import { formatCurrency, formatRelativeTime } from '@/lib/utils';
import { ChevronRight } from 'lucide-react';
import type { MerchantOrder } from '@/types/merchant';

interface PendingOrdersWidgetProps {
  orders: MerchantOrder[] | undefined;
  isLoading: boolean;
  onAccept: (orderId: string) => void;
  onReject: (orderId: string) => void;
  onMarkReady: (orderId: string) => void;
  acceptingId?: string | null;
  rejectingId?: string | null;
  updatingId?: string | null;
}

export function PendingOrdersWidget({
  orders,
  isLoading,
  onAccept,
  onReject,
  onMarkReady,
  acceptingId,
  rejectingId,
  updatingId,
}: PendingOrdersWidgetProps) {
  if (isLoading) {
    return (
      <Card>
        <CardHeader>
          <CardTitle>Pending Orders</CardTitle>
        </CardHeader>
        <CardContent className="space-y-4">
          {[1, 2, 3].map((i) => (
            <div key={i} className="flex items-center justify-between p-4 border rounded-lg">
              <div className="space-y-2">
                <Skeleton className="h-4 w-32" />
                <Skeleton className="h-3 w-24" />
              </div>
              <Skeleton className="h-8 w-20" />
            </div>
          ))}
        </CardContent>
      </Card>
    );
  }

  return (
    <Card>
      <CardHeader className="flex flex-row items-center justify-between">
        <CardTitle>Pending Orders</CardTitle>
        <Link to="/merchant/orders">
          <Button variant="ghost" size="sm">
            View All
            <ChevronRight className="ml-1 h-4 w-4" />
          </Button>
        </Link>
      </CardHeader>
      <CardContent>
        {!orders || orders.length === 0 ? (
          <div className="text-center py-8 text-muted-foreground">
            <p>No pending orders</p>
          </div>
        ) : (
          <div className="space-y-4">
            {orders.slice(0, 5).map((order) => (
              <div
                key={order.id}
                className="flex items-center justify-between p-4 border rounded-lg"
              >
                <div className="space-y-1">
                  <div className="flex items-center gap-2">
                    <span className="font-medium">
                      #{order.id.slice(-8).toUpperCase()}
                    </span>
                    <OrderStatusBadge status={order.status} />
                  </div>
                  <p className="text-sm text-muted-foreground">
                    {formatCurrency(order.totalPrice)} •{' '}
                    {order.items?.length || 0} items
                  </p>
                  {order.createdAt && (
                    <p className="text-xs text-muted-foreground">
                      {formatRelativeTime(order.createdAt)}
                    </p>
                  )}
                </div>
                <OrderActions
                  status={order.status}
                  onAccept={() => onAccept(order.id)}
                  onReject={() => onReject(order.id)}
                  onMarkReady={() => onMarkReady(order.id)}
                  isAccepting={acceptingId === order.id}
                  isRejecting={rejectingId === order.id}
                  isUpdating={updatingId === order.id}
                />
              </div>
            ))}
          </div>
        )}
      </CardContent>
    </Card>
  );
}
