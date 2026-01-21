import { Card, CardContent } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import { ShoppingBag, CreditCard, Tag, Bell, Check } from 'lucide-react';
import { formatRelativeTime } from '@/lib/utils';
import { cn } from '@/lib/utils';
import type { Notification, NotificationType } from '@/types';

const typeConfig: Record<NotificationType, { icon: React.ElementType; color: string }> = {
  ORDER: { icon: ShoppingBag, color: 'text-blue-500' },
  PAYMENT: { icon: CreditCard, color: 'text-green-500' },
  PROMO: { icon: Tag, color: 'text-purple-500' },
  SYSTEM: { icon: Bell, color: 'text-gray-500' },
  MESSAGE: { icon: Bell, color: 'text-orange-500' },
};

interface NotificationItemProps {
  notification: Notification;
  onMarkAsRead: (id: string) => void;
  isMarking?: boolean;
}

export function NotificationItem({
  notification,
  onMarkAsRead,
  isMarking,
}: NotificationItemProps) {
  const config = typeConfig[notification.type] || typeConfig.SYSTEM;
  const Icon = config.icon;

  return (
    <Card className={cn(!notification.isRead && 'border-primary/50 bg-primary/5')}>
      <CardContent className="p-4">
        <div className="flex items-start gap-4">
          <div
            className={cn(
              'h-10 w-10 rounded-full flex items-center justify-center',
              notification.isRead ? 'bg-muted' : 'bg-primary/10'
            )}
          >
            <Icon className={cn('h-5 w-5', config.color)} />
          </div>
          <div className="flex-1 space-y-1">
            <div className="flex items-start justify-between gap-2">
              <div className="flex items-center gap-2">
                <Badge variant="outline" className="text-xs">
                  {notification.type}
                </Badge>
                {!notification.isRead && (
                  <div className="h-2 w-2 rounded-full bg-primary" />
                )}
              </div>
              <span className="text-xs text-muted-foreground">
                {formatRelativeTime(notification.createdAt)}
              </span>
            </div>
            <p className="text-sm">{notification.message}</p>
            {!notification.isRead && (
              <Button
                variant="ghost"
                size="sm"
                onClick={() => onMarkAsRead(notification.id)}
                disabled={isMarking}
                className="mt-2"
              >
                <Check className="mr-2 h-4 w-4" />
                Mark as read
              </Button>
            )}
          </div>
        </div>
      </CardContent>
    </Card>
  );
}
