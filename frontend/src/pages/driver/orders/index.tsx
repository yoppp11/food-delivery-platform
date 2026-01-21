import { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { motion } from 'framer-motion';
import { ShoppingBag, AlertCircle } from 'lucide-react';
import { Skeleton } from '@/components/ui/skeleton';
import { OrderCard } from '@/components/driver/order-card';
import { useAvailableOrders, useAcceptOrder, useDriverProfile } from '@/hooks/use-driver';
import { Alert, AlertDescription } from '@/components/ui/alert';
import { Button } from '@/components/ui/button';

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

export function DriverOrdersPage() {
  const navigate = useNavigate();
  const { data: driver, isLoading: driverLoading } = useDriverProfile();
  const { data: orders, isLoading, error, refetch } = useAvailableOrders();
  const acceptOrderMutation = useAcceptOrder();

  const [acceptingId, setAcceptingId] = useState<string | null>(null);

  const handleAccept = (orderId: string) => {
    setAcceptingId(orderId);
    acceptOrderMutation.mutate(orderId, {
      onSuccess: () => {
        navigate('/driver');
      },
      onSettled: () => {
        setAcceptingId(null);
      },
    });
  };

  if (driverLoading || isLoading) {
    return (
      <div className="space-y-6">
        <div>
          <Skeleton className="h-8 w-48" />
          <Skeleton className="h-4 w-64 mt-2" />
        </div>
        <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-3">
          <Skeleton className="h-48" />
          <Skeleton className="h-48" />
          <Skeleton className="h-48" />
        </div>
      </div>
    );
  }

  if (!driver?.isAvailable) {
    return (
      <div className="space-y-6">
        <div>
          <h1 className="text-2xl font-bold">Available Orders</h1>
          <p className="text-muted-foreground">Orders ready for pickup near you</p>
        </div>
        <Alert>
          <AlertCircle className="h-4 w-4" />
          <AlertDescription>
            You are currently offline. Go online to see available orders.
          </AlertDescription>
        </Alert>
        <Button onClick={() => navigate('/driver')}>
          Go to Dashboard
        </Button>
      </div>
    );
  }

  if (error) {
    return (
      <div className="space-y-6">
        <div>
          <h1 className="text-2xl font-bold">Available Orders</h1>
          <p className="text-muted-foreground">Orders ready for pickup near you</p>
        </div>
        <Alert variant="destructive">
          <AlertCircle className="h-4 w-4" />
          <AlertDescription>
            Failed to load available orders. Please try again.
          </AlertDescription>
        </Alert>
        <Button onClick={() => refetch()}>
          Retry
        </Button>
      </div>
    );
  }

  return (
    <motion.div
      variants={containerVariants}
      initial="hidden"
      animate="visible"
      className="space-y-6"
    >
      <motion.div variants={itemVariants}>
        <h1 className="text-2xl font-bold">Available Orders</h1>
        <p className="text-muted-foreground">
          Orders ready for pickup near you ({orders?.length || 0} available)
        </p>
      </motion.div>

      {orders && orders.length > 0 ? (
        <motion.div
          variants={containerVariants}
          className="grid gap-4 md:grid-cols-2 lg:grid-cols-3"
        >
          {orders.map((order) => (
            <motion.div key={order.id} variants={itemVariants}>
              <OrderCard
                order={order}
                onAccept={handleAccept}
                isAccepting={acceptingId === order.id}
              />
            </motion.div>
          ))}
        </motion.div>
      ) : (
        <motion.div
          variants={itemVariants}
          className="flex flex-col items-center justify-center py-12 text-center"
        >
          <ShoppingBag className="h-12 w-12 text-muted-foreground mb-4" />
          <h3 className="text-lg font-medium">No orders available</h3>
          <p className="text-muted-foreground mt-1">
            Stay online and check back soon for new orders!
          </p>
        </motion.div>
      )}
    </motion.div>
  );
}
