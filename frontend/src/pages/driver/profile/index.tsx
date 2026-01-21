import { useState } from 'react';
import { motion } from 'framer-motion';
import { User, Car, MapPin, Loader2, Check } from 'lucide-react';
import { Skeleton } from '@/components/ui/skeleton';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Badge } from '@/components/ui/badge';
import { useDriverProfile, useUpdateDriverProfile, useUpdateLocation } from '@/hooks/use-driver';
import { useSession } from '@/hooks/use-auth';

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

export function DriverProfilePage() {
  const { data: session } = useSession();
  const { data: driver, isLoading } = useDriverProfile();
  const updateProfileMutation = useUpdateDriverProfile();
  const updateLocationMutation = useUpdateLocation();

  const [plateNumber, setPlateNumber] = useState('');
  const [isEditing, setIsEditing] = useState(false);

  const handleUpdatePlateNumber = () => {
    if (!plateNumber.trim()) return;

    updateProfileMutation.mutate(
      { plateNumber: plateNumber.trim() },
      {
        onSuccess: () => {
          setIsEditing(false);
          setPlateNumber('');
        },
      }
    );
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

  if (isLoading) {
    return (
      <div className="space-y-6">
        <div>
          <Skeleton className="h-8 w-48" />
          <Skeleton className="h-4 w-64 mt-2" />
        </div>
        <Skeleton className="h-64" />
        <Skeleton className="h-48" />
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
        <h1 className="text-2xl font-bold">Profile</h1>
        <p className="text-muted-foreground">
          Manage your driver profile and settings
        </p>
      </motion.div>

      <motion.div variants={itemVariants}>
        <Card>
          <CardHeader>
            <CardTitle className="flex items-center gap-2">
              <User className="h-5 w-5" />
              Account Information
            </CardTitle>
          </CardHeader>
          <CardContent className="space-y-4">
            <div className="flex items-center justify-between">
              <span className="text-muted-foreground">Email</span>
              <span className="font-medium">{session?.user?.email}</span>
            </div>
            <div className="flex items-center justify-between">
              <span className="text-muted-foreground">Role</span>
              <Badge variant="outline">{session?.user?.role}</Badge>
            </div>
            <div className="flex items-center justify-between">
              <span className="text-muted-foreground">Status</span>
              <Badge variant={driver?.isAvailable ? 'success' : 'secondary'}>
                {driver?.isAvailable ? 'Online' : 'Offline'}
              </Badge>
            </div>
            <div className="flex items-center justify-between">
              <span className="text-muted-foreground">Driver ID</span>
              <span className="font-mono text-sm">{driver?.id}</span>
            </div>
          </CardContent>
        </Card>
      </motion.div>

      <motion.div variants={itemVariants}>
        <Card>
          <CardHeader>
            <CardTitle className="flex items-center gap-2">
              <Car className="h-5 w-5" />
              Vehicle Information
            </CardTitle>
          </CardHeader>
          <CardContent className="space-y-4">
            <div className="flex items-center justify-between">
              <span className="text-muted-foreground">Current Plate Number</span>
              <span className="font-medium">{driver?.plateNumber}</span>
            </div>

            {isEditing ? (
              <div className="space-y-3 pt-2 border-t">
                <Label htmlFor="newPlateNumber">New Plate Number</Label>
                <div className="flex gap-2">
                  <Input
                    id="newPlateNumber"
                    placeholder="e.g., B 5678 XYZ"
                    value={plateNumber}
                    onChange={(e) => setPlateNumber(e.target.value)}
                  />
                  <Button
                    onClick={handleUpdatePlateNumber}
                    disabled={!plateNumber.trim() || updateProfileMutation.isPending}
                  >
                    {updateProfileMutation.isPending ? (
                      <Loader2 className="h-4 w-4 animate-spin" />
                    ) : (
                      <Check className="h-4 w-4" />
                    )}
                  </Button>
                  <Button
                    variant="outline"
                    onClick={() => {
                      setIsEditing(false);
                      setPlateNumber('');
                    }}
                  >
                    Cancel
                  </Button>
                </div>
              </div>
            ) : (
              <Button variant="outline" onClick={() => setIsEditing(true)}>
                Update Plate Number
              </Button>
            )}
          </CardContent>
        </Card>
      </motion.div>

      <motion.div variants={itemVariants}>
        <Card>
          <CardHeader>
            <CardTitle className="flex items-center gap-2">
              <MapPin className="h-5 w-5" />
              Location
            </CardTitle>
          </CardHeader>
          <CardContent className="space-y-4">
            <p className="text-sm text-muted-foreground">
              Update your current location so that you can receive nearby delivery requests.
            </p>
            <Button
              variant="outline"
              onClick={handleUpdateLocation}
              disabled={updateLocationMutation.isPending}
              className="w-full"
            >
              {updateLocationMutation.isPending ? (
                <>
                  <Loader2 className="mr-2 h-4 w-4 animate-spin" />
                  Updating Location...
                </>
              ) : updateLocationMutation.isSuccess ? (
                <>
                  <Check className="mr-2 h-4 w-4 text-green-600" />
                  Location Updated
                </>
              ) : (
                <>
                  <MapPin className="mr-2 h-4 w-4" />
                  Update Current Location
                </>
              )}
            </Button>
          </CardContent>
        </Card>
      </motion.div>
    </motion.div>
  );
}
