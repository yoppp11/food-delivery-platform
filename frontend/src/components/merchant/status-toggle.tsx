import { Switch } from '@/components/ui/switch';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { Loader2 } from 'lucide-react';

interface StatusToggleProps {
  isOpen: boolean;
  isLoading: boolean;
  onToggle: () => void;
}

export function StatusToggle({ isOpen, isLoading, onToggle }: StatusToggleProps) {
  return (
    <Card>
      <CardHeader className="pb-3">
        <CardTitle className="text-base font-medium">Store Status</CardTitle>
      </CardHeader>
      <CardContent>
        <div className="flex items-center justify-between">
          <div className="flex items-center gap-3">
            <Badge variant={isOpen ? 'success' : 'secondary'} className="px-3 py-1">
              {isOpen ? 'Open' : 'Closed'}
            </Badge>
            <span className="text-sm text-muted-foreground">
              {isOpen ? 'Accepting orders' : 'Not accepting orders'}
            </span>
          </div>
          <div className="flex items-center gap-2">
            {isLoading && <Loader2 className="h-4 w-4 animate-spin" />}
            <Switch
              checked={isOpen}
              onCheckedChange={onToggle}
              disabled={isLoading}
            />
          </div>
        </div>
      </CardContent>
    </Card>
  );
}
