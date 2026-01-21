import { Button } from '@/components/ui/button';
import { Check, X, ChefHat, Loader2 } from 'lucide-react';
import type { OrderStatus } from '@/types/merchant';

interface OrderActionsProps {
  status: OrderStatus;
  onAccept?: () => void;
  onReject?: () => void;
  onMarkReady?: () => void;
  isAccepting?: boolean;
  isRejecting?: boolean;
  isUpdating?: boolean;
}

export function OrderActions({
  status,
  onAccept,
  onReject,
  onMarkReady,
  isAccepting,
  isRejecting,
  isUpdating,
}: OrderActionsProps) {
  if (status === 'PAID') {
    return (
      <div className="flex gap-2">
        <Button
          size="sm"
          onClick={onAccept}
          disabled={isAccepting || isRejecting}
        >
          {isAccepting ? (
            <Loader2 className="mr-2 h-4 w-4 animate-spin" />
          ) : (
            <Check className="mr-2 h-4 w-4" />
          )}
          Accept
        </Button>
        <Button
          size="sm"
          variant="destructive"
          onClick={onReject}
          disabled={isAccepting || isRejecting}
        >
          {isRejecting ? (
            <Loader2 className="mr-2 h-4 w-4 animate-spin" />
          ) : (
            <X className="mr-2 h-4 w-4" />
          )}
          Reject
        </Button>
      </div>
    );
  }

  if (status === 'PREPARING') {
    return (
      <Button
        size="sm"
        onClick={onMarkReady}
        disabled={isUpdating}
      >
        {isUpdating ? (
          <Loader2 className="mr-2 h-4 w-4 animate-spin" />
        ) : (
          <ChefHat className="mr-2 h-4 w-4" />
        )}
        Mark as Ready
      </Button>
    );
  }

  return null;
}
