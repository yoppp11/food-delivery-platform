import { Button } from '@/components/ui/button';
import { MapPin, Loader2 } from 'lucide-react';
import { useTranslation } from 'react-i18next';

interface CurrentLocationButtonProps {
  onClick: () => void;
  isLoading?: boolean;
  disabled?: boolean;
}

export function CurrentLocationButton({
  onClick,
  isLoading,
  disabled,
}: CurrentLocationButtonProps) {
  const { t } = useTranslation();

  return (
    <Button
      type="button"
      variant="outline"
      size="sm"
      onClick={onClick}
      disabled={disabled || isLoading}
      aria-label={t('merchantSettings.useMyLocation')}
    >
      {isLoading ? (
        <Loader2 className="mr-2 h-4 w-4 animate-spin" />
      ) : (
        <MapPin className="mr-2 h-4 w-4" />
      )}
      {isLoading ? t('merchantSettings.locating') : t('merchantSettings.useMyLocation')}
    </Button>
  );
}
