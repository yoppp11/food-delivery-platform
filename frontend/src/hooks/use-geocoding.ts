import { useQuery } from '@tanstack/react-query';
import { useDebounce } from './use-debounce';

const NOMINATIM_URL = 'https://nominatim.openstreetmap.org';

interface NominatimReverseResponse {
  display_name: string;
  address: {
    road?: string;
    suburb?: string;
    city?: string;
    city_district?: string;
    state?: string;
    country?: string;
    postcode?: string;
  };
}

interface NominatimSearchResponse {
  place_id: number;
  display_name: string;
  lat: string;
  lon: string;
}

export function useReverseGeocode(lat: number, lng: number, language = 'id') {
  const debouncedLat = useDebounce(lat, 500);
  const debouncedLng = useDebounce(lng, 500);

  return useQuery({
    queryKey: ['geocode', 'reverse', debouncedLat, debouncedLng, language],
    queryFn: async (): Promise<string> => {
      const response = await fetch(
        `${NOMINATIM_URL}/reverse?format=json&lat=${debouncedLat}&lon=${debouncedLng}&accept-language=${language}`,
        {
          headers: {
            'User-Agent': 'FoodDeliveryPlatform/1.0',
          },
        }
      );
      if (!response.ok) {
        throw new Error('Failed to fetch address');
      }
      const data: NominatimReverseResponse = await response.json();
      return data.display_name;
    },
    enabled: !!debouncedLat && !!debouncedLng && debouncedLat !== 0 && debouncedLng !== 0,
    staleTime: 1000 * 60 * 60,
    retry: 1,
  });
}

export function useForwardGeocode(query: string, language = 'id') {
  const debouncedQuery = useDebounce(query, 500);

  return useQuery({
    queryKey: ['geocode', 'forward', debouncedQuery, language],
    queryFn: async (): Promise<NominatimSearchResponse[]> => {
      const response = await fetch(
        `${NOMINATIM_URL}/search?format=json&q=${encodeURIComponent(debouncedQuery)}&accept-language=${language}&countrycodes=id&limit=5`,
        {
          headers: {
            'User-Agent': 'FoodDeliveryPlatform/1.0',
          },
        }
      );
      if (!response.ok) {
        throw new Error('Failed to search address');
      }
      return response.json();
    },
    enabled: debouncedQuery.length >= 3,
    staleTime: 1000 * 60 * 60,
    retry: 1,
  });
}

export type { NominatimSearchResponse };
