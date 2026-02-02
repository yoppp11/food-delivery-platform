import { useState, useEffect, useCallback } from 'react';
import { useTranslation } from 'react-i18next';
import { Loader2 } from 'lucide-react';
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
  DialogFooter,
} from '@/components/ui/dialog';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Switch } from '@/components/ui/switch';
import { Textarea } from '@/components/ui/textarea';
import { LocationPicker } from '@/components/map/location-picker';
import { LabelSelector } from './label-selector';
import { useCreateAddress, useUpdateAddress } from '@/hooks/use-addresses';
import { useReverseGeocode } from '@/hooks/use-geocoding';
import type { UserAddress } from '@/types';

interface AddressFormDialogProps {
  open: boolean;
  onOpenChange: (open: boolean) => void;
  editingAddress?: UserAddress | null;
  onSuccess?: (address: UserAddress) => void;
}

const DEFAULT_LAT = -6.2088;
const DEFAULT_LNG = 106.8456;

export function AddressFormDialog({
  open,
  onOpenChange,
  editingAddress,
  onSuccess,
}: AddressFormDialogProps) {
  const { t } = useTranslation();
  
  const [label, setLabel] = useState('');
  const [address, setAddress] = useState('');
  const [latitude, setLatitude] = useState(DEFAULT_LAT);
  const [longitude, setLongitude] = useState(DEFAULT_LNG);
  const [isDefault, setIsDefault] = useState(false);
  const [notes, setNotes] = useState('');

  const createAddress = useCreateAddress();
  const updateAddress = useUpdateAddress();
  
  const { data: reverseGeocodedAddress, isLoading: isGeocoding } = useReverseGeocode(latitude, longitude);

  useEffect(() => {
    if (editingAddress) {
      setLabel(editingAddress.label);
      setAddress(editingAddress.address);
      setLatitude(editingAddress.latitude);
      setLongitude(editingAddress.longitude);
      setIsDefault(editingAddress.isDefault);
      setNotes('');
    } else {
      setLabel('');
      setAddress('');
      setLatitude(DEFAULT_LAT);
      setLongitude(DEFAULT_LNG);
      setIsDefault(false);
      setNotes('');
    }
  }, [editingAddress, open]);

  useEffect(() => {
    if (reverseGeocodedAddress && !editingAddress) {
      setAddress(reverseGeocodedAddress);
    }
  }, [reverseGeocodedAddress, editingAddress]);

  const handleLocationChange = useCallback((lat: number, lng: number) => {
    setLatitude(lat);
    setLongitude(lng);
  }, []);

  const handleSave = () => {
    const addressData = {
      label,
      address: notes ? `${address} (${notes})` : address,
      latitude,
      longitude,
      isDefault,
    };

    if (editingAddress) {
      updateAddress.mutate(
        { id: editingAddress.id, ...addressData },
        {
          onSuccess: (updatedAddress) => {
            onOpenChange(false);
            onSuccess?.(updatedAddress);
          },
        }
      );
    } else {
      createAddress.mutate(addressData, {
        onSuccess: (newAddress) => {
          onOpenChange(false);
          onSuccess?.(newAddress);
        },
      });
    }
  };

  const isValid = label.trim().length > 0 && address.trim().length > 0 && latitude !== 0 && longitude !== 0;
  const isPending = createAddress.isPending || updateAddress.isPending;

  return (
    <Dialog open={open} onOpenChange={onOpenChange}>
      <DialogContent className="max-w-2xl max-h-[90vh] overflow-y-auto">
        <DialogHeader>
          <DialogTitle>
            {editingAddress ? t('addressForm.editTitle') : t('addressForm.addTitle')}
          </DialogTitle>
        </DialogHeader>

        <div className="space-y-6 py-4">
          <div className="text-sm text-muted-foreground">
            {t('addressForm.selectLocationHint')}
          </div>

          <LocationPicker
            latitude={latitude}
            longitude={longitude}
            onChange={handleLocationChange}
            showSearch={true}
            showCurrentLocation={true}
            showAddress={false}
            height="250px"
          />

          {(latitude !== DEFAULT_LAT || longitude !== DEFAULT_LNG) && (
            <div className="flex items-center gap-2 text-sm text-muted-foreground">
              {isGeocoding ? (
                <Loader2 className="h-4 w-4 animate-spin" />
              ) : null}
              <span>{reverseGeocodedAddress || t('merchantSettings.addressNotFound')}</span>
            </div>
          )}

          <div className="space-y-2">
            <Label>{t('addressForm.labelField')}</Label>
            <LabelSelector value={label} onChange={setLabel} />
          </div>

          <div className="space-y-2">
            <Label htmlFor="address-details">{t('addressForm.addressField')}</Label>
            <Input
              id="address-details"
              value={address}
              onChange={(e) => setAddress(e.target.value)}
              placeholder={t('addressForm.addressPlaceholder')}
            />
          </div>

          <div className="space-y-2">
            <Label htmlFor="address-notes">{t('addressForm.notesField')}</Label>
            <Textarea
              id="address-notes"
              value={notes}
              onChange={(e) => setNotes(e.target.value)}
              placeholder={t('addressForm.notesPlaceholder')}
              rows={2}
            />
          </div>

          <div className="flex items-center gap-2">
            <Switch
              id="is-default"
              checked={isDefault}
              onCheckedChange={setIsDefault}
            />
            <Label htmlFor="is-default">{t('addressForm.setDefault')}</Label>
          </div>
        </div>

        <DialogFooter>
          <Button variant="outline" onClick={() => onOpenChange(false)}>
            {t('addressForm.cancel')}
          </Button>
          <Button onClick={handleSave} disabled={!isValid || isPending}>
            {isPending ? (
              <>
                <Loader2 className="mr-2 h-4 w-4 animate-spin" />
                {t('addressForm.saving')}
              </>
            ) : (
              t('addressForm.save')
            )}
          </Button>
        </DialogFooter>
      </DialogContent>
    </Dialog>
  );
}
