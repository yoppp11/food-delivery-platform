import { useTranslation } from 'react-i18next';
import { Home, Building, MapPin } from 'lucide-react';
import { cn } from '@/lib/utils';
import { Input } from '@/components/ui/input';

interface LabelSelectorProps {
  value: string;
  onChange: (value: string) => void;
  disabled?: boolean;
}

const PRESET_LABELS = [
  { key: 'home', icon: Home },
  { key: 'office', icon: Building },
  { key: 'other', icon: MapPin },
];

export function LabelSelector({ value, onChange, disabled }: LabelSelectorProps) {
  const { t } = useTranslation();

  const isPreset = PRESET_LABELS.some(
    (label) => t(`addressForm.label${label.key.charAt(0).toUpperCase() + label.key.slice(1)}`).toLowerCase() === value.toLowerCase()
  );

  const handlePresetClick = (labelKey: string) => {
    const translatedLabel = t(`addressForm.label${labelKey.charAt(0).toUpperCase() + labelKey.slice(1)}`);
    onChange(translatedLabel);
  };

  return (
    <div className="space-y-3">
      <div className="flex flex-wrap gap-2">
        {PRESET_LABELS.map((preset) => {
          const translatedLabel = t(`addressForm.label${preset.key.charAt(0).toUpperCase() + preset.key.slice(1)}`);
          const isSelected = value.toLowerCase() === translatedLabel.toLowerCase();
          const Icon = preset.icon;
          
          return (
            <button
              key={preset.key}
              type="button"
              onClick={() => handlePresetClick(preset.key)}
              disabled={disabled}
              className={cn(
                'flex items-center gap-2 px-4 py-2 rounded-full border text-sm font-medium transition-colors',
                isSelected
                  ? 'bg-primary text-primary-foreground border-primary'
                  : 'bg-background hover:bg-muted border-input',
                disabled && 'opacity-50 cursor-not-allowed'
              )}
            >
              <Icon className="h-4 w-4" />
              {translatedLabel}
            </button>
          );
        })}
      </div>
      
      {!isPreset && (
        <Input
          value={value}
          onChange={(e) => onChange(e.target.value)}
          placeholder={t('addressForm.labelPlaceholder')}
          disabled={disabled}
        />
      )}
    </div>
  );
}
