import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import { Store, Package, Navigation, Loader2, MessageCircle } from 'lucide-react';
import { formatCurrency } from '@/lib/utils';
import { ChatButton } from '@/components/chat';
import type { Order, Merchant } from '@/types';

interface ActiveDeliveryCardProps {
  order: Order & { merchant: Merchant };
  onPickup: () => void;
  onDeliver: () => void;
  isPickingUp?: boolean;
  isDelivering?: boolean;
  pickedUp?: boolean;
}

export function ActiveDeliveryCard({
  order,
  onPickup,
  onDeliver,
  isPickingUp,
  isDelivering,
  pickedUp,
}: ActiveDeliveryCardProps) {
  const openNavigation = (lat: number, lng: number) => {
    window.open(`https://www.google.com/maps/dir/?api=1&destination=${lat},${lng}`, '_blank');
  };

  return (
    <Card className="border-primary">
      <CardHeader className="pb-3">
        <div className="flex items-start justify-between">
          <div>
            <CardTitle className="text-lg font-semibold">Active Delivery</CardTitle>
            <p className="text-sm text-muted-foreground mt-1">Order #{order.id.slice(0, 8)}</p>
          </div>
          <Badge variant={pickedUp ? 'default' : 'secondary'}>
            {pickedUp ? 'Picked Up' : 'Picking Up'}
          </Badge>
        </div>
      </CardHeader>
      <CardContent className="space-y-4">
        <div className="space-y-3">
          <div className="flex items-start gap-3 p-3 bg-muted/50 rounded-lg">
            <Store className="h-5 w-5 text-muted-foreground mt-0.5" />
            <div className="flex-1">
              <p className="font-medium">{order.merchant.name}</p>
              <p className="text-sm text-muted-foreground">Merchant</p>
            </div>
            <Button
              variant="outline"
              size="sm"
              onClick={() => openNavigation(order.merchant.latitude, order.merchant.longitude)}
            >
              <Navigation className="h-4 w-4 mr-1" />
              Navigate
            </Button>
          </div>

          <div className="flex items-center gap-3 p-3 bg-muted/50 rounded-lg">
            <Package className="h-5 w-5 text-muted-foreground" />
            <div className="flex-1">
              <p className="font-medium">{formatCurrency(order.totalPrice)}</p>
              <p className="text-sm text-muted-foreground">Order Total</p>
            </div>
          </div>
        </div>

        <div className="flex gap-2 pt-2">
          <ChatButton
            orderId={order.id}
            type="CUSTOMER_DRIVER"
            label=""
            size="icon"
            variant="outline"
          />
          {!pickedUp ? (
            <Button
              className="flex-1"
              onClick={onPickup}
              disabled={isPickingUp}
            >
              {isPickingUp ? (
                <>
                  <Loader2 className="mr-2 h-4 w-4 animate-spin" />
                  Marking...
                </>
              ) : (
                'Mark Picked Up'
              )}
            </Button>
          ) : (
            <Button
              className="flex-1"
              onClick={onDeliver}
              disabled={isDelivering}
            >
              {isDelivering ? (
                <>
                  <Loader2 className="mr-2 h-4 w-4 animate-spin" />
                  Completing...
                </>
              ) : (
                'Mark Delivered'
              )}
            </Button>
          )}
        </div>
      </CardContent>
    </Card>
  );
}
