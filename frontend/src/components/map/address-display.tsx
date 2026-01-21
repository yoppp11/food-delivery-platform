import { MapPin, Loader2 } from 'lucide-react';
import { useReverseGeocode } from '@/hooks/use-geocoding';
import { useTranslation } from 'react-i18next';

interface AddressDisplayProps {
  latitude: number;
  longitude: number;
}

export function AddressDisplay({ latitude, longitude }: AddressDisplayProps) {
  const { t } = useTranslation();
  const { data: address, isLoading, error } = useReverseGeocode(latitude, longitude);

  if (!latitude || !longitude || (latitude === 0 && longitude === 0)) {
    return null;
  }

  return (
    <div className="flex items-start gap-2 text-sm text-muted-foreground">
      <MapPin className="h-4 w-4 mt-0.5 shrink-0" />
      {isLoading ? (
        <div className="flex items-center gap-2">
          <Loader2 className="h-3 w-3 animate-spin" />
          <span>{t('common.loading')}</span>
        </div>
      ) : error ? (
        <span>{t('merchantSettings.addressNotFound')}</span>
      ) : (
        <span className="wrap-break-word">{address}</span>
      )}
    </div>
  );
}
