import { useState, useEffect } from 'react';
import { motion } from 'framer-motion';
import { ShoppingBag, DollarSign, Package, MapPin, AlertCircle } from 'lucide-react';
import { Skeleton } from '@/components/ui/skeleton';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { useNavigate } from 'react-router-dom';
import { StatsCard } from '@/components/driver/stats-card';
import { AvailabilityToggle } from '@/components/driver/availability-toggle';
import { ActiveDeliveryCard } from '@/components/driver/active-delivery-card';
import {
  useDriverProfile,
  useDriverEarnings,
  useToggleAvailability,
  useAvailableOrders,
  useUpdateLocation,
  useMarkPickedUp,
  useMarkDelivered,
  useDriverActiveOrder,
} from '@/hooks/use-driver';
import { formatCurrency } from '@/lib/utils';

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

export function DriverDashboardPage() {
  const navigate = useNavigate();
  const { data: driver, isLoading: driverLoading, error: driverError } = useDriverProfile();
  const { data: earnings, isLoading: earningsLoading } = useDriverEarnings();
  const { data: availableOrders } = useAvailableOrders();
  const { data: activeOrder, isLoading: activeOrderLoading } = useDriverActiveOrder();

  const toggleAvailabilityMutation = useToggleAvailability();
  const updateLocationMutation = useUpdateLocation();
  const markPickedUpMutation = useMarkPickedUp();
  const markDeliveredMutation = useMarkDelivered();

  const [pickedUp, setPickedUp] = useState(false);

  useEffect(() => {
    if (activeOrder) {
      setPickedUp(false);
    }
  }, [activeOrder?.id]);

  const handleToggleAvailability = () => {
    if (driver) {
      toggleAvailabilityMutation.mutate(!driver.isAvailable);
    }
  };

  const handleUpdateLocation = () => {
    if (navigator.geolocation) {
      navigator.geolocation.getCurrentPosition(
        (position) => {
          updateLocationMutation.mutate({
            latitude: position.coords.latitude,
            longitude: position.coords.longitude,
          });
        },
        (error) => {
          console.error('Geolocation error:', error);
        }
      );
    }
  };

  const handlePickup = () => {
    if (activeOrder) {
      markPickedUpMutation.mutate(activeOrder.id, {
        onSuccess: () => setPickedUp(true),
      });
    }
  };

  const handleDeliver = () => {
    if (activeOrder) {
      markDeliveredMutation.mutate(activeOrder.id, {
        onSuccess: () => setPickedUp(false),
      });
    }
  };

  if (driverLoading) {
    return <DashboardSkeleton />;
  }

  if (driverError) {
    return (
      <div className="flex flex-col items-center justify-center py-12 space-y-4">
        <AlertCircle className="h-12 w-12 text-muted-foreground" />
        <h2 className="text-xl font-semibold">Driver Profile Not Found</h2>
        <p className="text-muted-foreground text-center max-w-md">
          You need to register as a driver to access this dashboard.
        </p>
        <Button onClick={() => navigate('/driver/register')}>
          Register as Driver
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
        <h1 className="text-2xl font-bold">Driver Dashboard</h1>
        <p className="text-muted-foreground">
          Welcome back! Here's your delivery overview.
        </p>
      </motion.div>

      <motion.div variants={itemVariants}>
        <AvailabilityToggle
          isAvailable={driver?.isAvailable || false}
          isLoading={toggleAvailabilityMutation.isPending}
          onToggle={handleToggleAvailability}
        />
      </motion.div>

      {activeOrderLoading ? (
        <motion.div variants={itemVariants}>
          <Skeleton className="h-48 w-full" />
        </motion.div>
      ) : activeOrder && activeOrder.merchant ? (
        <motion.div variants={itemVariants}>
          <ActiveDeliveryCard
            order={activeOrder as any}
            onPickup={handlePickup}
            onDeliver={handleDeliver}
            isPickingUp={markPickedUpMutation.isPending}
            isDelivering={markDeliveredMutation.isPending}
            pickedUp={pickedUp}
          />
        </motion.div>
      ) : null}

      <motion.div variants={itemVariants} className="grid gap-4 md:grid-cols-2 lg:grid-cols-4">
        {earningsLoading ? (
          <>
            <Skeleton className="h-28" />
            <Skeleton className="h-28" />
            <Skeleton className="h-28" />
            <Skeleton className="h-28" />
          </>
        ) : (
          <>
            <StatsCard
              title="Today's Earnings"
              value={formatCurrency(earnings?.today || 0)}
              icon={DollarSign}
              description="Keep it up!"
            />
            <StatsCard
              title="Available Orders"
              value={availableOrders?.length || 0}
              icon={ShoppingBag}
              description="Nearby orders"
            />
            <StatsCard
              title="This Week"
              value={formatCurrency(earnings?.thisWeek || 0)}
              icon={DollarSign}
              description="Weekly earnings"
            />
            <StatsCard
              title="Total Deliveries"
              value={earnings?.totalDeliveries || 0}
              icon={Package}
              description="All time"
            />
          </>
        )}
      </motion.div>

      <div className="grid gap-6 lg:grid-cols-2">
        <motion.div variants={itemVariants}>
          <Card>
            <CardHeader>
              <CardTitle className="text-base font-medium">Quick Actions</CardTitle>
            </CardHeader>
            <CardContent className="space-y-2">
              <Button
                variant="outline"
                className="w-full justify-start"
                onClick={() => navigate('/driver/orders')}
              >
                <ShoppingBag className="mr-2 h-4 w-4" />
                View Available Orders
              </Button>
              <Button
                variant="outline"
                className="w-full justify-start"
                onClick={() => navigate('/driver/earnings')}
              >
                <DollarSign className="mr-2 h-4 w-4" />
                View Earnings
              </Button>
              <Button
                variant="outline"
                className="w-full justify-start"
                onClick={handleUpdateLocation}
                disabled={updateLocationMutation.isPending}
              >
                <MapPin className="mr-2 h-4 w-4" />
                {updateLocationMutation.isPending ? 'Updating...' : 'Update Location'}
              </Button>
            </CardContent>
          </Card>
        </motion.div>

        <motion.div variants={itemVariants}>
          <Card>
            <CardHeader>
              <CardTitle className="text-base font-medium">Driver Status</CardTitle>
            </CardHeader>
            <CardContent className="space-y-3">
              <div className="flex items-center justify-between">
                <span className="text-muted-foreground">Plate Number</span>
                <span className="font-medium">{driver?.plateNumber}</span>
              </div>
              <div className="flex items-center justify-between">
                <span className="text-muted-foreground">Status</span>
                <span className={`font-medium ${driver?.isAvailable ? 'text-green-600' : 'text-gray-500'}`}>
                  {driver?.isAvailable ? 'Online' : 'Offline'}
                </span>
              </div>
              <div className="flex items-center justify-between">
                <span className="text-muted-foreground">Driver ID</span>
                <span className="font-mono text-sm">{driver?.id.slice(0, 8)}</span>
              </div>
            </CardContent>
          </Card>
        </motion.div>
      </div>
    </motion.div>
  );
}

function DashboardSkeleton() {
  return (
    <div className="space-y-6">
      <div>
        <Skeleton className="h-8 w-48" />
        <Skeleton className="h-4 w-64 mt-2" />
      </div>
      <Skeleton className="h-24" />
      <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-4">
        <Skeleton className="h-28" />
        <Skeleton className="h-28" />
        <Skeleton className="h-28" />
        <Skeleton className="h-28" />
      </div>
      <div className="grid gap-6 lg:grid-cols-2">
        <Skeleton className="h-48" />
        <Skeleton className="h-48" />
      </div>
    </div>
  );
}
