import { useForm } from 'react-hook-form';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Loader2, Pencil, Trash2 } from 'lucide-react';
import { DAYS_OF_WEEK } from '@/types/merchant';
import type { MerchantOperationalHour, CreateOperationalHourRequest } from '@/types/merchant';

interface OperationalHoursFormProps {
  hour?: MerchantOperationalHour;
  onSubmit: (data: CreateOperationalHourRequest) => void;
  onCancel: () => void;
  isSubmitting: boolean;
  existingDays?: number[];
}

export function OperationalHoursForm({
  hour,
  onSubmit,
  onCancel,
  isSubmitting,
  existingDays = [],
}: OperationalHoursFormProps) {
  const {
    register,
    handleSubmit,
    formState: { errors },
  } = useForm<CreateOperationalHourRequest>({
    defaultValues: {
      dayOfWeek: hour?.dayOfWeek ?? 1,
      openTime: hour?.openTime || '09:00',
      closeTime: hour?.closeTime || '21:00',
    },
  });

  const availableDays = Object.entries(DAYS_OF_WEEK).filter(
    ([day]) => hour?.dayOfWeek === Number(day) || !existingDays.includes(Number(day))
  );

  return (
    <form onSubmit={handleSubmit(onSubmit)} className="space-y-4">
      <div className="space-y-2">
        <Label htmlFor="dayOfWeek">Day of Week *</Label>
        <select
          id="dayOfWeek"
          {...register('dayOfWeek', {
            required: 'Day is required',
            valueAsNumber: true,
          })}
          className="flex h-10 w-full rounded-md border border-input bg-background px-3 py-2 text-sm ring-offset-background focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring"
        >
          {availableDays.map(([day, name]) => (
            <option key={day} value={day}>
              {name}
            </option>
          ))}
        </select>
        {errors.dayOfWeek && (
          <p className="text-sm text-destructive">{errors.dayOfWeek.message}</p>
        )}
      </div>

      <div className="grid grid-cols-2 gap-4">
        <div className="space-y-2">
          <Label htmlFor="openTime">Open Time *</Label>
          <Input
            id="openTime"
            type="time"
            {...register('openTime', { required: 'Open time is required' })}
          />
          {errors.openTime && (
            <p className="text-sm text-destructive">{errors.openTime.message}</p>
          )}
        </div>

        <div className="space-y-2">
          <Label htmlFor="closeTime">Close Time *</Label>
          <Input
            id="closeTime"
            type="time"
            {...register('closeTime', { required: 'Close time is required' })}
          />
          {errors.closeTime && (
            <p className="text-sm text-destructive">{errors.closeTime.message}</p>
          )}
        </div>
      </div>

      <div className="flex justify-end gap-2">
        <Button type="button" variant="outline" onClick={onCancel}>
          Cancel
        </Button>
        <Button type="submit" disabled={isSubmitting}>
          {isSubmitting && <Loader2 className="mr-2 h-4 w-4 animate-spin" />}
          {hour ? 'Update' : 'Add'}
        </Button>
      </div>
    </form>
  );
}

interface OperationalHoursListProps {
  hours: MerchantOperationalHour[];
  onEdit: (hour: MerchantOperationalHour) => void;
  onDelete: (hour: MerchantOperationalHour) => void;
}

export function OperationalHoursList({
  hours,
  onEdit,
  onDelete,
}: OperationalHoursListProps) {
  const sortedHours = [...hours].sort((a, b) => a.dayOfWeek - b.dayOfWeek);

  return (
    <div className="space-y-2">
      {sortedHours.map((hour) => (
        <div
          key={hour.id}
          className="flex items-center justify-between p-3 border rounded-lg"
        >
          <div className="flex items-center gap-4">
            <span className="font-medium w-24">{DAYS_OF_WEEK[hour.dayOfWeek]}</span>
            <span className="text-muted-foreground">
              {hour.openTime} - {hour.closeTime}
            </span>
          </div>
          <div className="flex items-center gap-2">
            <Button variant="ghost" size="icon" onClick={() => onEdit(hour)}>
              <Pencil className="h-4 w-4" />
            </Button>
            <Button variant="ghost" size="icon" onClick={() => onDelete(hour)}>
              <Trash2 className="h-4 w-4 text-destructive" />
            </Button>
          </div>
        </div>
      ))}
    </div>
  );
}
