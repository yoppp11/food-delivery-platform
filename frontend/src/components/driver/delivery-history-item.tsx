import { formatCurrency } from '@/lib/utils';
import type { DeliveryHistoryItem } from '@/types';
import { format } from 'date-fns';

interface DeliveryHistoryItemProps {
  delivery: DeliveryHistoryItem;
}

export function DeliveryHistoryListItem({ delivery }: DeliveryHistoryItemProps) {
  return (
    <div className="flex items-center justify-between p-4 border-b last:border-b-0">
      <div className="space-y-1">
        <p className="font-medium">{delivery.merchantName}</p>
        <p className="text-sm text-muted-foreground">
          {format(new Date(delivery.deliveredAt), 'MMM dd, yyyy • HH:mm')}
        </p>
        <p className="text-xs text-muted-foreground">
          {delivery.distanceKm.toFixed(1)} km
        </p>
      </div>
      <div className="text-right">
        <p className="font-medium text-green-600">
          {formatCurrency(delivery.earnings)}
        </p>
        <p className="text-xs text-muted-foreground">
          Order #{delivery.orderId.slice(0, 8)}
        </p>
      </div>
    </div>
  );
}
