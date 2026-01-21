import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import { MapPin, Store, Loader2 } from 'lucide-react';
import { formatCurrency } from '@/lib/utils';
import type { AvailableOrder } from '@/types';

interface OrderCardProps {
  order: AvailableOrder;
  onAccept: (orderId: string) => void;
  isAccepting?: boolean;
}

export function OrderCard({ order, onAccept, isAccepting }: OrderCardProps) {
  return (
    <Card>
      <CardHeader className="pb-3">
        <div className="flex items-start justify-between">
          <div className="flex items-center gap-2">
            <Store className="h-5 w-5 text-muted-foreground" />
            <CardTitle className="text-base font-medium">{order.merchant.name}</CardTitle>
          </div>
          <Badge variant="outline">{formatCurrency(order.totalPrice)}</Badge>
        </div>
      </CardHeader>
      <CardContent className="space-y-4">
        <div className="flex items-center gap-2 text-sm text-muted-foreground">
          <MapPin className="h-4 w-4" />
          <span>{order.distance.toFixed(1)} km away</span>
        </div>

        <div className="flex items-center justify-between pt-2 border-t">
          <div className="text-sm">
            <span className="text-muted-foreground">Est. earnings: </span>
            <span className="font-medium text-green-600">
              {formatCurrency(order.distance * 2000)}
            </span>
          </div>
          <Button
            size="sm"
            onClick={() => onAccept(order.id)}
            disabled={isAccepting}
          >
            {isAccepting ? (
              <>
                <Loader2 className="mr-2 h-4 w-4 animate-spin" />
                Accepting...
              </>
            ) : (
              'Accept'
            )}
          </Button>
        </div>
      </CardContent>
    </Card>
  );
}
