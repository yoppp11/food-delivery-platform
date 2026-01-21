import { Switch } from '@/components/ui/switch';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { Loader2 } from 'lucide-react';

interface AvailabilityToggleProps {
  isAvailable: boolean;
  isLoading: boolean;
  onToggle: () => void;
}

export function AvailabilityToggle({ isAvailable, isLoading, onToggle }: AvailabilityToggleProps) {
  return (
    <Card>
      <CardHeader className="pb-3">
        <CardTitle className="text-base font-medium">Availability Status</CardTitle>
      </CardHeader>
      <CardContent>
        <div className="flex items-center justify-between">
          <div className="flex items-center gap-3">
            <Badge variant={isAvailable ? 'success' : 'secondary'} className="px-3 py-1">
              {isAvailable ? 'Online' : 'Offline'}
            </Badge>
            <span className="text-sm text-muted-foreground">
              {isAvailable ? 'Accepting deliveries' : 'Not accepting deliveries'}
            </span>
          </div>
          <div className="flex items-center gap-2">
            {isLoading && <Loader2 className="h-4 w-4 animate-spin" />}
            <Switch
              checked={isAvailable}
              onCheckedChange={onToggle}
              disabled={isLoading}
            />
          </div>
        </div>
      </CardContent>
    </Card>
  );
}
