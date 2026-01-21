import { useState } from 'react';
import { motion } from 'framer-motion';
import { Button } from '@/components/ui/button';
import { Skeleton } from '@/components/ui/skeleton';
import { NotificationItem } from '@/components/merchant/notification-item';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import { Bell, Check, Trash2, Loader2, ChevronLeft, ChevronRight } from 'lucide-react';
import {
  useNotifications,
  useMarkNotificationAsRead,
  useMarkAllNotificationsAsRead,
  useClearAllNotifications,
  useUnreadNotificationCount,
} from '@/hooks/use-notifications';
import { Badge } from '@/components/ui/badge';

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

export function MerchantNotificationsPage() {
  const [page, setPage] = useState(1);
  const [filter, setFilter] = useState<'all' | 'unread'>('all');
  const [markingId, setMarkingId] = useState<string | null>(null);

  const { data: notificationsResponse, isLoading } = useNotifications({
    page,
    limit: 10,
    isRead: filter === 'unread' ? false : undefined,
  });
  const { data: unreadCount } = useUnreadNotificationCount();

  const markAsReadMutation = useMarkNotificationAsRead();
  const markAllAsReadMutation = useMarkAllNotificationsAsRead();
  const clearAllMutation = useClearAllNotifications();

  const handleMarkAsRead = (id: string) => {
    setMarkingId(id);
    markAsReadMutation.mutate(id, {
      onSettled: () => setMarkingId(null),
    });
  };

  const handleMarkAllAsRead = () => {
    markAllAsReadMutation.mutate();
  };

  const handleClearAll = () => {
    clearAllMutation.mutate();
  };

  const notifications = notificationsResponse?.data || [];
  const totalPages = notificationsResponse?.pagination?.totalPages || 1;

  return (
    <motion.div
      variants={containerVariants}
      initial="hidden"
      animate="visible"
      className="space-y-6"
    >
      <motion.div variants={itemVariants} className="flex items-center justify-between">
        <div>
          <h1 className="text-2xl font-bold">Notifications</h1>
          <p className="text-muted-foreground">Stay updated with your store activities</p>
        </div>
        <div className="flex items-center gap-2">
          <Button
            variant="outline"
            size="sm"
            onClick={handleMarkAllAsRead}
            disabled={markAllAsReadMutation.isPending || unreadCount?.count === 0}
          >
            {markAllAsReadMutation.isPending ? (
              <Loader2 className="mr-2 h-4 w-4 animate-spin" />
            ) : (
              <Check className="mr-2 h-4 w-4" />
            )}
            Mark all as read
          </Button>
          <Button
            variant="outline"
            size="sm"
            onClick={handleClearAll}
            disabled={clearAllMutation.isPending || notifications.length === 0}
          >
            {clearAllMutation.isPending ? (
              <Loader2 className="mr-2 h-4 w-4 animate-spin" />
            ) : (
              <Trash2 className="mr-2 h-4 w-4" />
            )}
            Clear all
          </Button>
        </div>
      </motion.div>

      <motion.div variants={itemVariants}>
        <Tabs value={filter} onValueChange={(v) => setFilter(v as 'all' | 'unread')}>
          <TabsList>
            <TabsTrigger value="all">All</TabsTrigger>
            <TabsTrigger value="unread" className="gap-2">
              Unread
              {unreadCount?.count ? (
                <Badge variant="secondary">{unreadCount.count}</Badge>
              ) : null}
            </TabsTrigger>
          </TabsList>

          <TabsContent value="all" className="mt-6">
            <NotificationsList
              notifications={notifications}
              isLoading={isLoading}
              onMarkAsRead={handleMarkAsRead}
              markingId={markingId}
              page={page}
              totalPages={totalPages}
              onPageChange={setPage}
            />
          </TabsContent>

          <TabsContent value="unread" className="mt-6">
            <NotificationsList
              notifications={notifications}
              isLoading={isLoading}
              onMarkAsRead={handleMarkAsRead}
              markingId={markingId}
              page={page}
              totalPages={totalPages}
              onPageChange={setPage}
            />
          </TabsContent>
        </Tabs>
      </motion.div>
    </motion.div>
  );
}

interface NotificationsListProps {
  notifications: Array<{
    id: string;
    userId: string;
    type: 'ORDER' | 'PAYMENT' | 'PROMO' | 'SYSTEM' | 'MESSAGE';
    message: string;
    isRead: boolean;
    createdAt: Date;
  }>;
  isLoading: boolean;
  onMarkAsRead: (id: string) => void;
  markingId: string | null;
  page: number;
  totalPages: number;
  onPageChange: (page: number) => void;
}

function NotificationsList({
  notifications,
  isLoading,
  onMarkAsRead,
  markingId,
  page,
  totalPages,
  onPageChange,
}: NotificationsListProps) {
  if (isLoading) {
    return (
      <div className="space-y-4">
        {[1, 2, 3].map((i) => (
          <Skeleton key={i} className="h-24" />
        ))}
      </div>
    );
  }

  if (notifications.length === 0) {
    return (
      <div className="flex flex-col items-center justify-center py-12">
        <Bell className="h-12 w-12 text-muted-foreground mb-4" />
        <p className="text-muted-foreground">No notifications</p>
      </div>
    );
  }

  return (
    <>
      <motion.div
        variants={containerVariants}
        initial="hidden"
        animate="visible"
        className="space-y-4"
      >
        {notifications.map((notification) => (
          <motion.div key={notification.id} variants={itemVariants}>
            <NotificationItem
              notification={notification}
              onMarkAsRead={onMarkAsRead}
              isMarking={markingId === notification.id}
            />
          </motion.div>
        ))}
      </motion.div>

      {totalPages > 1 && (
        <div className="flex items-center justify-center gap-2 mt-6">
          <Button
            variant="outline"
            size="sm"
            onClick={() => onPageChange(Math.max(1, page - 1))}
            disabled={page === 1}
          >
            <ChevronLeft className="h-4 w-4" />
            Previous
          </Button>
          <span className="text-sm text-muted-foreground">
            Page {page} of {totalPages}
          </span>
          <Button
            variant="outline"
            size="sm"
            onClick={() => onPageChange(page + 1)}
            disabled={page >= totalPages}
          >
            Next
            <ChevronRight className="h-4 w-4" />
          </Button>
        </div>
      )}
    </>
  );
}
