import { Link } from 'react-router-dom';
import { Card, CardContent } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import { Switch } from '@/components/ui/switch';
import { Pencil, Trash2 } from 'lucide-react';
import { formatCurrency } from '@/lib/utils';
import type { Menu } from '@/types/merchant';

interface MenuCardProps {
  menu: Menu;
  onDelete?: () => void;
  onToggleAvailability?: (isAvailable: boolean) => void;
  isDeleting?: boolean;
}

export function MenuCard({
  menu,
  onDelete,
  onToggleAvailability,
  isDeleting,
}: MenuCardProps) {
  const imageUrl = menu.imageUrl || menu.image?.imageUrl || '/placeholder-food.jpg';

  return (
    <Card className="overflow-hidden">
      <CardContent className="p-0">
        <div className="flex flex-col md:flex-row">
          <div className="relative h-48 md:h-auto md:w-48 flex-shrink-0">
            <img
              src={imageUrl}
              alt={menu.name}
              className="h-full w-full object-cover"
            />
            {!menu.isAvailable && (
              <div className="absolute inset-0 bg-black/50 flex items-center justify-center">
                <Badge variant="secondary">Unavailable</Badge>
              </div>
            )}
          </div>
          <div className="flex-1 p-4">
            <div className="flex items-start justify-between gap-4">
              <div className="space-y-1">
                <h3 className="font-semibold">{menu.name}</h3>
                <p className="text-sm text-muted-foreground line-clamp-2">
                  {menu.description}
                </p>
                <p className="font-medium text-primary">{formatCurrency(menu.price)}</p>
                {menu.category && (
                  <Badge variant="outline">{menu.category.name}</Badge>
                )}
              </div>
              <div className="flex items-center gap-2">
                <div className="flex items-center gap-2">
                  <span className="text-sm text-muted-foreground">Available</span>
                  <Switch
                    checked={menu.isAvailable}
                    onCheckedChange={onToggleAvailability}
                  />
                </div>
              </div>
            </div>
            {menu.menuVariants && menu.menuVariants.length > 0 && (
              <div className="mt-4 pt-4 border-t">
                <p className="text-sm font-medium mb-2">Variants:</p>
                <div className="flex flex-wrap gap-2">
                  {menu.menuVariants.map((variant) => (
                    <Badge key={variant.id} variant="secondary">
                      {variant.name} - {formatCurrency(variant.price)}
                    </Badge>
                  ))}
                </div>
              </div>
            )}
            <div className="flex items-center gap-2 mt-4">
              <Link to={`/merchant/menus/${menu.id}/edit`}>
                <Button size="sm" variant="outline">
                  <Pencil className="mr-2 h-4 w-4" />
                  Edit
                </Button>
              </Link>
              <Button
                size="sm"
                variant="destructive"
                onClick={onDelete}
                disabled={isDeleting}
              >
                <Trash2 className="mr-2 h-4 w-4" />
                Delete
              </Button>
            </div>
          </div>
        </div>
      </CardContent>
    </Card>
  );
}
