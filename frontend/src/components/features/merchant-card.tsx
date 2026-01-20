import { motion } from 'framer-motion';
import { Link } from 'react-router-dom';
import { useTranslation } from 'react-i18next';
import { Star, Clock, MapPin } from 'lucide-react';
import { Card, CardContent } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { getMerchantImage } from '@/constants/images';
import type { Merchant } from '@/types';

interface MerchantCardProps {
  merchant: Merchant;
  variant?: 'default' | 'compact';
}

const itemVariants = {
  hidden: { y: 20, opacity: 0 },
  visible: {
    y: 0,
    opacity: 1,
    transition: { type: 'spring' as const, stiffness: 100 },
  },
};

export function MerchantCard({ merchant, variant = 'default' }: MerchantCardProps) {
  const { t } = useTranslation();
  const imageUrl = getMerchantImage(merchant.id);

  return (
    <motion.div variants={itemVariants}>
      <Link to={`/restaurants/${merchant.id}`}>
        <Card className="overflow-hidden group cursor-pointer h-full hover:shadow-lg transition-all duration-300">
          <div className="relative h-48 overflow-hidden">
            <motion.img
              whileHover={{ scale: 1.05 }}
              transition={{ duration: 0.3 }}
              src={imageUrl}
              alt={merchant.name}
              className="w-full h-full object-cover"
            />
            <div className="absolute inset-0 bg-gradient-to-t from-black/60 to-transparent" />
            <div className="absolute top-3 left-3">
              <Badge variant={merchant.isOpen ? 'success' : 'secondary'}>
                {merchant.isOpen ? t('merchant.open') : t('merchant.closed')}
              </Badge>
            </div>
            {merchant.rating && (
              <div className="absolute top-3 right-3 bg-background/90 backdrop-blur-sm rounded-full px-2 py-1 flex items-center gap-1">
                <Star className="h-4 w-4 fill-yellow-400 text-yellow-400" />
                <span className="text-sm font-medium">{merchant.rating.toString()}</span>
              </div>
            )}
            <div className="absolute bottom-3 left-3 right-3">
              <h3 className="font-semibold text-lg text-white group-hover:text-primary transition-colors">
                {merchant.name}
              </h3>
            </div>
          </div>
          <CardContent className="p-4">
            <p className="text-sm text-muted-foreground line-clamp-2">
              {merchant.description}
            </p>
            <div className="flex items-center gap-4 mt-3 text-sm text-muted-foreground">
              <div className="flex items-center gap-1">
                <Clock className="h-4 w-4" />
                <span>25-35 min</span>
              </div>
              <div className="flex items-center gap-1">
                <MapPin className="h-4 w-4" />
                <span>{merchant.distance ? `${merchant.distance} km` : '1.2 km'}</span>
              </div>
            </div>
          </CardContent>
        </Card>
      </Link>
    </motion.div>
  );
}
