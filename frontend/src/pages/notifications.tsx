import { useState } from 'react';
import { useTranslation } from 'react-i18next';
import { motion, AnimatePresence } from 'framer-motion';
import {
  Bell,
  Check,
  CheckCheck,
  Trash2,
  Package,
  Tag,
  Info,
  MessageCircle,
  Settings,
  ChevronRight,
  Filter,
  Clock,
  CreditCard,
} from 'lucide-react';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import { Skeleton } from '@/components/ui/skeleton';
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuTrigger,
} from '@/components/ui/dropdown-menu';
import {
  useNotifications,
  useMarkNotificationAsRead,
  useMarkAllNotificationsAsRead,
  useDeleteNotification,
} from '@/hooks/use-notifications';
import { cn, formatRelativeTime } from '@/lib/utils';
import type { NotificationType } from '@/types';

const containerVariants = {
  hidden: { opacity: 0 },
  visible: {
    opacity: 1,
    transition: {
      staggerChildren: 0.05,
    },
  },
};

const itemVariants = {
  hidden: { opacity: 0, x: -20 },
  visible: { opacity: 1, x: 0 },
  exit: { opacity: 0, x: 20 },
};

const notificationIcons: Record<NotificationType, typeof Bell> = {
  ORDER: Package,
  PROMO: Tag,
  SYSTEM: Info,
  MESSAGE: MessageCircle,
  PAYMENT: CreditCard,
};

const notificationColors: Record<NotificationType, string> = {
  ORDER: 'bg-blue-500/10 text-blue-500',
  PROMO: 'bg-green-500/10 text-green-500',
  SYSTEM: 'bg-yellow-500/10 text-yellow-500',
  MESSAGE: 'bg-purple-500/10 text-purple-500',
  PAYMENT: 'bg-emerald-500/10 text-emerald-500',
};

export function NotificationsPage() {
  const { t } = useTranslation();
  const [activeTab, setActiveTab] = useState('all');
  const [filter, setFilter] = useState<NotificationType | 'all'>('all');

  const { data: notificationsResponse, isLoading } = useNotifications();
  const notifications = notificationsResponse?.data;

  const markAsReadMutation = useMarkNotificationAsRead();
  const markAllAsReadMutation = useMarkAllNotificationsAsRead();
  const deleteMutation = useDeleteNotification();

  const filteredNotifications = notifications?.filter((n) => {
    if (activeTab === 'unread') return !n.isRead;
    if (filter !== 'all') return n.type === filter;
    return true;
  }) || [];

  const unreadCount = notifications?.filter((n) => !n.isRead).length || 0;

  if (isLoading) {
    return <NotificationsSkeleton />;
  }

  return (
    <div className="min-h-screen bg-muted/30">
      <div className="container mx-auto px-4 py-8">
        <div className="max-w-3xl mx-auto">
          {/* Header */}
          <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4 mb-6">
            <div>
              <h1 className="text-2xl md:text-3xl font-bold flex items-center gap-3">
                <Bell className="h-7 w-7 text-primary" />
                {t('nav.notifications')}
                {unreadCount > 0 && (
                  <Badge className="ml-1">{unreadCount} new</Badge>
                )}
              </h1>
              <p className="text-muted-foreground mt-1">
                Stay updated with your orders and promotions
              </p>
            </div>
            <div className="flex gap-2">
              {unreadCount > 0 && (
                <Button
                  variant="outline"
                  onClick={() => markAllAsReadMutation.mutate()}
                  disabled={markAllAsReadMutation.isPending}
                >
                  <CheckCheck className="h-4 w-4 mr-2" />
                  Mark all read
                </Button>
              )}
              <DropdownMenu>
                <DropdownMenuTrigger asChild>
                  <Button variant="outline" size="icon">
                    <Filter className="h-4 w-4" />
                  </Button>
                </DropdownMenuTrigger>
                <DropdownMenuContent align="end">
                  <DropdownMenuItem onClick={() => setFilter('all')}>
                    All Types
                  </DropdownMenuItem>
                  <DropdownMenuItem onClick={() => setFilter('ORDER')}>
                    <Package className="h-4 w-4 mr-2" /> Orders
                  </DropdownMenuItem>
                  <DropdownMenuItem onClick={() => setFilter('PROMO')}>
                    <Tag className="h-4 w-4 mr-2" /> Promotions
                  </DropdownMenuItem>
                  <DropdownMenuItem onClick={() => setFilter('SYSTEM')}>
                    <Info className="h-4 w-4 mr-2" /> System
                  </DropdownMenuItem>
                  <DropdownMenuItem onClick={() => setFilter('MESSAGE')}>
                    <MessageCircle className="h-4 w-4 mr-2" /> Messages
                  </DropdownMenuItem>
                </DropdownMenuContent>
              </DropdownMenu>
            </div>
          </div>

          {/* Tabs */}
          <Tabs value={activeTab} onValueChange={setActiveTab} className="mb-6">
            <TabsList className="w-full sm:w-auto">
              <TabsTrigger value="all" className="flex-1 sm:flex-none">
                All
              </TabsTrigger>
              <TabsTrigger value="unread" className="flex-1 sm:flex-none">
                Unread ({unreadCount})
              </TabsTrigger>
            </TabsList>
          </Tabs>

          {/* Notification List */}
          {filteredNotifications.length === 0 ? (
            <Card>
              <CardContent className="p-12 text-center">
                <motion.div
                  initial={{ scale: 0.8, opacity: 0 }}
                  animate={{ scale: 1, opacity: 1 }}
                  className="flex flex-col items-center"
                >
                  <div className="h-20 w-20 rounded-full bg-muted flex items-center justify-center mb-4">
                    <Bell className="h-10 w-10 text-muted-foreground" />
                  </div>
                  <h3 className="text-lg font-semibold">No notifications</h3>
                  <p className="text-muted-foreground mt-2">
                    {activeTab === 'unread'
                      ? "You've read all your notifications!"
                      : 'You have no notifications yet.'}
                  </p>
                </motion.div>
              </CardContent>
            </Card>
          ) : (
            <motion.div
              variants={containerVariants}
              initial="hidden"
              animate="visible"
              className="space-y-3"
            >
              <AnimatePresence mode="popLayout">
                {filteredNotifications.map((notification) => {
                  const Icon = notificationIcons[notification.type];
                  const colorClass = notificationColors[notification.type];

                  return (
                    <motion.div
                      key={notification.id}
                      variants={itemVariants}
                      layout
                      exit="exit"
                    >
                      <Card
                        className={cn(
                          'transition-all hover:shadow-md cursor-pointer',
                          !notification.isRead && 'border-l-4 border-l-primary'
                        )}
                        onClick={() => {
                          if (!notification.isRead) {
                            markAsReadMutation.mutate(notification.id);
                          }
                        }}
                      >
                        <CardContent className="p-4">
                          <div className="flex gap-4">
                            {/* Icon */}
                            <div
                              className={cn(
                                'h-12 w-12 rounded-full flex items-center justify-center shrink-0',
                                colorClass
                              )}
                            >
                              <Icon className="h-6 w-6" />
                            </div>

                            {/* Content */}
                            <div className="flex-1 min-w-0">
                              <div className="flex items-start justify-between gap-2">
                                <p
                                  className={cn(
                                    'font-medium line-clamp-1',
                                    !notification.isRead && 'text-foreground',
                                    notification.isRead && 'text-muted-foreground'
                                  )}
                                >
                                  {notification.title}
                                </p>
                                <div className="flex items-center gap-2 shrink-0">
                                  {!notification.isRead && (
                                    <span className="h-2 w-2 rounded-full bg-primary" />
                                  )}
                                  <span className="text-xs text-muted-foreground whitespace-nowrap">
                                    {formatRelativeTime(notification.createdAt)}
                                  </span>
                                </div>
                              </div>
                              <p
                                className={cn(
                                  'text-sm mt-1 line-clamp-2',
                                  notification.isRead
                                    ? 'text-muted-foreground'
                                    : 'text-foreground/80'
                                )}
                              >
                                {notification.body}
                              </p>

                              {/* Actions */}
                              <div className="flex items-center justify-between mt-3">
                                <Badge variant="secondary" className="text-xs">
                                  {notification.type}
                                </Badge>
                                <div className="flex gap-1">
                                  {!notification.isRead && (
                                    <Button
                                      variant="ghost"
                                      size="sm"
                                      onClick={(e) => {
                                        e.stopPropagation();
                                        markAsReadMutation.mutate(notification.id);
                                      }}
                                    >
                                      <Check className="h-4 w-4" />
                                    </Button>
                                  )}
                                  <Button
                                    variant="ghost"
                                    size="sm"
                                    className="text-destructive hover:text-destructive"
                                    onClick={(e) => {
                                      e.stopPropagation();
                                      deleteMutation.mutate(notification.id);
                                    }}
                                  >
                                    <Trash2 className="h-4 w-4" />
                                  </Button>
                                </div>
                              </div>
                            </div>
                          </div>
                        </CardContent>
                      </Card>
                    </motion.div>
                  );
                })}
              </AnimatePresence>
            </motion.div>
          )}

          {/* Settings Card */}
          <Card className="mt-8">
            <CardContent className="p-4">
              <Button variant="ghost" className="w-full justify-between" asChild>
                <a href="/profile?tab=settings">
                  <span className="flex items-center gap-2">
                    <Settings className="h-4 w-4" />
                    Notification Settings
                  </span>
                  <ChevronRight className="h-4 w-4" />
                </a>
              </Button>
            </CardContent>
          </Card>
        </div>
      </div>
    </div>
  );
}

// Skeleton
function NotificationsSkeleton() {
  return (
    <div className="min-h-screen bg-muted/30">
      <div className="container mx-auto px-4 py-8">
        <div className="max-w-3xl mx-auto">
          <div className="flex justify-between items-center mb-6">
            <div>
              <Skeleton className="h-8 w-48" />
              <Skeleton className="h-4 w-64 mt-2" />
            </div>
            <Skeleton className="h-10 w-32" />
          </div>
          <Skeleton className="h-10 w-64 mb-6" />
          <div className="space-y-3">
            {Array.from({ length: 5 }).map((_, i) => (
              <Card key={i}>
                <CardContent className="p-4">
                  <div className="flex gap-4">
                    <Skeleton className="h-12 w-12 rounded-full" />
                    <div className="flex-1">
                      <Skeleton className="h-5 w-3/4" />
                      <Skeleton className="h-4 w-full mt-2" />
                      <Skeleton className="h-6 w-20 mt-3" />
                    </div>
                  </div>
                </CardContent>
              </Card>
            ))}
          </div>
        </div>
      </div>
    </div>
  );
}
