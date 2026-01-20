import { motion } from 'framer-motion';
import { useTranslation } from 'react-i18next';
import { Plus } from 'lucide-react';
import { Card, CardContent } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { Button } from '@/components/ui/button';
import { getMenuImage } from '@/constants/images';
import { formatCurrency } from '@/lib/utils';
import type { Menu } from '@/types';

interface MenuCardProps {
  menu: Menu;
  onAdd: () => void;
}

export function MenuCard({ menu, onAdd }: MenuCardProps) {
  const { t } = useTranslation();
  const menuImage = menu.imageUrl || menu.image?.imageUrl || getMenuImage(menu.id);

  return (
    <motion.div
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      whileHover={{ scale: 1.02 }}
      transition={{ duration: 0.2 }}
    >
      <Card className="overflow-hidden cursor-pointer" onClick={onAdd}>
        <CardContent className="p-0">
          <div className="flex">
            <div className="flex-1 p-4">
              <h3 className="font-semibold">{menu.name}</h3>
              <p className="text-sm text-muted-foreground line-clamp-2 mt-1">
                {menu.description}
              </p>
              <div className="flex items-center justify-between mt-3">
                <span className="font-semibold text-primary">
                  {formatCurrency(menu.price)}
                </span>
                {!menu.isAvailable && (
                  <Badge variant="secondary">{t('menu.unavailable')}</Badge>
                )}
              </div>
            </div>
            <div className="relative w-32 h-32">
              <img
                src={menuImage}
                alt={menu.name}
                className="w-full h-full object-cover"
              />
              <Button
                size="icon"
                className="absolute bottom-2 right-2 h-8 w-8 rounded-full shadow-lg"
                disabled={!menu.isAvailable}
              >
                <Plus className="h-4 w-4" />
              </Button>
            </div>
          </div>
        </CardContent>
      </Card>
    </motion.div>
  );
}
