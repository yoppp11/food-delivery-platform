import { useState, useRef, useEffect } from 'react';
import { Input } from '@/components/ui/input';
import { Search, X, Loader2 } from 'lucide-react';
import { useForwardGeocode, type NominatimSearchResponse } from '@/hooks/use-geocoding';
import { useTranslation } from 'react-i18next';
import { cn } from '@/lib/utils';

interface LocationSearchProps {
  onSelect: (lat: number, lng: number) => void;
  disabled?: boolean;
}

export function LocationSearch({ onSelect, disabled }: LocationSearchProps) {
  const { t } = useTranslation();
  const [query, setQuery] = useState('');
  const [isOpen, setIsOpen] = useState(false);
  const containerRef = useRef<HTMLDivElement>(null);
  const { data: results, isLoading } = useForwardGeocode(query);

  useEffect(() => {
    function handleClickOutside(event: MouseEvent) {
      if (containerRef.current && !containerRef.current.contains(event.target as Node)) {
        setIsOpen(false);
      }
    }
    document.addEventListener('mousedown', handleClickOutside);
    return () => document.removeEventListener('mousedown', handleClickOutside);
  }, []);

  const handleSelect = (result: NominatimSearchResponse) => {
    onSelect(parseFloat(result.lat), parseFloat(result.lon));
    setQuery('');
    setIsOpen(false);
  };

  const handleClear = () => {
    setQuery('');
    setIsOpen(false);
  };

  return (
    <div ref={containerRef} className="relative">
      <div className="relative">
        <Search className="absolute left-3 top-1/2 -translate-y-1/2 h-4 w-4 text-muted-foreground" />
        <Input
          type="text"
          value={query}
          onChange={(e) => {
            setQuery(e.target.value);
            setIsOpen(true);
          }}
          onFocus={() => setIsOpen(true)}
          placeholder={t('merchantSettings.searchAddress')}
          className="pl-9 pr-9"
          disabled={disabled}
        />
        {query && (
          <button
            type="button"
            onClick={handleClear}
            className="absolute right-3 top-1/2 -translate-y-1/2 text-muted-foreground hover:text-foreground"
          >
            <X className="h-4 w-4" />
          </button>
        )}
      </div>

      {isOpen && query.length >= 3 && (
        <div className="absolute z-1000 mt-1 w-full rounded-lg border bg-background shadow-lg">
          {isLoading ? (
            <div className="flex items-center justify-center p-4">
              <Loader2 className="h-4 w-4 animate-spin" />
            </div>
          ) : results && results.length > 0 ? (
            <ul className="max-h-60 overflow-auto py-1">
              {results.map((result) => (
                <li key={result.place_id}>
                  <button
                    type="button"
                    onClick={() => handleSelect(result)}
                    className={cn(
                      'w-full px-3 py-2 text-left text-sm hover:bg-accent transition-colors',
                      'focus:outline-none focus:bg-accent'
                    )}
                  >
                    {result.display_name}
                  </button>
                </li>
              ))}
            </ul>
          ) : (
            <div className="p-4 text-sm text-muted-foreground text-center">
              {t('common.noResults')}
            </div>
          )}
        </div>
      )}
    </div>
  );
}
