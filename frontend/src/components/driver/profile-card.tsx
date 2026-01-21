import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import { User, Car, MapPin, Loader2 } from 'lucide-react';
import type { Driver } from '@/types';

interface ProfileCardProps {
  driver: Driver;
  onUpdateLocation?: () => void;
  isUpdatingLocation?: boolean;
}

export function ProfileCard({ driver, onUpdateLocation, isUpdatingLocation }: ProfileCardProps) {
  return (
    <Card>
      <CardHeader>
        <CardTitle className="flex items-center gap-2">
          <User className="h-5 w-5" />
          Driver Profile
        </CardTitle>
      </CardHeader>
      <CardContent className="space-y-4">
        <div className="flex items-center justify-between">
          <span className="text-muted-foreground">Status</span>
          <Badge variant={driver.isAvailable ? 'success' : 'secondary'}>
            {driver.isAvailable ? 'Online' : 'Offline'}
          </Badge>
        </div>

        <div className="flex items-center justify-between">
          <span className="text-muted-foreground">Driver ID</span>
          <span className="font-mono text-sm">{driver.id.slice(0, 8)}</span>
        </div>

        <div className="flex items-center justify-between">
          <div className="flex items-center gap-2 text-muted-foreground">
            <Car className="h-4 w-4" />
            <span>Plate Number</span>
          </div>
          <span className="font-medium">{driver.plateNumber}</span>
        </div>

        {onUpdateLocation && (
          <Button
            variant="outline"
            className="w-full"
            onClick={onUpdateLocation}
            disabled={isUpdatingLocation}
          >
            {isUpdatingLocation ? (
              <>
                <Loader2 className="mr-2 h-4 w-4 animate-spin" />
                Updating...
              </>
            ) : (
              <>
                <MapPin className="mr-2 h-4 w-4" />
                Update Location
              </>
            )}
          </Button>
        )}
      </CardContent>
    </Card>
  );
}
