import { useCallback, useEffect, useState } from 'react';
import { MapContainer, TileLayer, useMap, useMapEvents } from 'react-leaflet';
import { LocationMarker } from './location-marker';
import { LocationSearch } from './location-search';
import { CurrentLocationButton } from './current-location-button';
import { AddressDisplay } from './address-display';
import { useGeolocation } from '@/hooks/use-geolocation';
import { useTranslation } from 'react-i18next';
import { Skeleton } from '@/components/ui/skeleton';
import { AlertCircle } from 'lucide-react';
import { cn } from '@/lib/utils';
import 'leaflet/dist/leaflet.css';

interface LocationPickerProps {
  latitude: number;
  longitude: number;
  onChange: (lat: number, lng: number) => void;
  showSearch?: boolean;
  showCurrentLocation?: boolean;
  showAddress?: boolean;
  height?: string;
  disabled?: boolean;
}

const DEFAULT_CENTER: [number, number] = [-6.2, 106.8456];
const DEFAULT_ZOOM = 13;

function MapClickHandler({ onLocationSelect }: { onLocationSelect: (lat: number, lng: number) => void }) {
  useMapEvents({
    click(e) {
      onLocationSelect(e.latlng.lat, e.latlng.lng);
    },
  });
  return null;
}

function MapController({ center, zoom }: { center: [number, number]; zoom?: number }) {
  const map = useMap();

  useEffect(() => {
    if (center[0] !== 0 || center[1] !== 0) {
      map.flyTo(center, zoom ?? map.getZoom(), { duration: 1 });
    }
  }, [map, center, zoom]);

  return null;
}

export function LocationPicker({
  latitude,
  longitude,
  onChange,
  showSearch = true,
  showCurrentLocation = true,
  showAddress = true,
  height = '400px',
  disabled = false,
}: LocationPickerProps) {
  const { t } = useTranslation();
  const [isMapReady, setIsMapReady] = useState(false);
  const [flyToPosition, setFlyToPosition] = useState<[number, number] | null>(null);
  
  const geolocation = useGeolocation();

  const hasValidPosition = latitude !== 0 || longitude !== 0;
  const position: [number, number] = hasValidPosition ? [latitude, longitude] : DEFAULT_CENTER;

  const handleLocationSelect = useCallback(
    (lat: number, lng: number) => {
      if (!disabled) {
        onChange(lat, lng);
      }
    },
    [onChange, disabled]
  );

  const handleSearchSelect = useCallback(
    (lat: number, lng: number) => {
      handleLocationSelect(lat, lng);
      setFlyToPosition([lat, lng]);
    },
    [handleLocationSelect]
  );

  const handleCurrentLocation = useCallback(() => {
    geolocation.getCurrentPosition();
  }, [geolocation]);

  useEffect(() => {
    if (geolocation.latitude && geolocation.longitude) {
      handleLocationSelect(geolocation.latitude, geolocation.longitude);
      setFlyToPosition([geolocation.latitude, geolocation.longitude]);
    }
  }, [geolocation.latitude, geolocation.longitude, handleLocationSelect]);

  return (
    <div className={cn('space-y-3', disabled && 'opacity-60 pointer-events-none')}>
      {(showSearch || showCurrentLocation) && (
        <div className="flex flex-col sm:flex-row gap-2">
          {showSearch && (
            <div className="flex-1">
              <LocationSearch onSelect={handleSearchSelect} disabled={disabled} />
            </div>
          )}
          {showCurrentLocation && (
            <CurrentLocationButton
              onClick={handleCurrentLocation}
              isLoading={geolocation.isLoading}
              disabled={disabled}
            />
          )}
        </div>
      )}

      {geolocation.error && (
        <div className="flex items-center gap-2 text-sm text-destructive">
          <AlertCircle className="h-4 w-4" />
          <span>{t(`merchantSettings.${geolocation.error}`)}</span>
        </div>
      )}

      <div className="relative rounded-lg overflow-hidden border" style={{ height }}>
        {!isMapReady && (
          <Skeleton className="absolute inset-0 z-10" />
        )}
        <MapContainer
          center={position}
          zoom={DEFAULT_ZOOM}
          style={{ height: '100%', width: '100%' }}
          whenReady={() => setIsMapReady(true)}
        >
          <TileLayer
            attribution='&copy; <a href="https://www.openstreetmap.org/copyright">OpenStreetMap</a> contributors'
            url="https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png"
          />
          <MapClickHandler onLocationSelect={handleLocationSelect} />
          {flyToPosition && <MapController center={flyToPosition} zoom={16} />}
          {hasValidPosition && (
            <LocationMarker
              position={[latitude, longitude]}
              onPositionChange={handleLocationSelect}
            />
          )}
        </MapContainer>
      </div>

      {showAddress && hasValidPosition && (
        <AddressDisplay latitude={latitude} longitude={longitude} />
      )}

      <div className="grid gap-2 sm:grid-cols-2 text-sm text-muted-foreground">
        <div>
          <span className="font-medium">{t('merchantSettings.latitude')}:</span>{' '}
          {latitude.toFixed(6)}
        </div>
        <div>
          <span className="font-medium">{t('merchantSettings.longitude')}:</span>{' '}
          {longitude.toFixed(6)}
        </div>
      </div>

      {!hasValidPosition && (
        <p className="text-sm text-muted-foreground">
          {t('merchantSettings.selectLocationHint')}
        </p>
      )}
    </div>
  );
}
