import { useState } from 'react';
import { motion } from 'framer-motion';
import { useForm } from 'react-hook-form';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Textarea } from '@/components/ui/textarea';
import { Skeleton } from '@/components/ui/skeleton';
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogFooter,
  DialogHeader,
  DialogTitle,
} from '@/components/ui/dialog';
import {
  OperationalHoursForm,
  OperationalHoursList,
} from '@/components/merchant/operational-hours-form';
import { LocationPicker } from '@/components/map';
import { Clock, Loader2, Plus, Save } from 'lucide-react';
import {
  useUpdateMerchant,
  useMerchantOperationalHours,
  useCreateOperationalHour,
  useUpdateOperationalHour,
  useDeleteOperationalHour,
} from '@/hooks/use-merchant-profile';
import { useMerchantContext } from '@/providers/merchant-provider';
import type {
  UpdateMerchantRequest,
  MerchantOperationalHour,
  CreateOperationalHourRequest,
} from '@/types/merchant';

const containerVariants = {
  hidden: { opacity: 0 },
  visible: {
    opacity: 1,
    transition: { staggerChildren: 0.1 },
  },
};

const itemVariants = {
  hidden: { y: 20, opacity: 0 },
  visible: { y: 0, opacity: 1 },
};

export function MerchantSettingsPage() {
  const { currentMerchant: merchant, isLoading: merchantLoading } = useMerchantContext();
  const merchantId = merchant?.id || '';

  const { data: operationalHours, isLoading: hoursLoading } =
    useMerchantOperationalHours(merchantId);

  const updateMerchantMutation = useUpdateMerchant(merchantId);
  const createHourMutation = useCreateOperationalHour(merchantId);
  const updateHourMutation = useUpdateOperationalHour(merchantId);
  const deleteHourMutation = useDeleteOperationalHour(merchantId);

  const [isHourFormOpen, setIsHourFormOpen] = useState(false);
  const [editingHour, setEditingHour] = useState<MerchantOperationalHour | null>(null);
  const [deletingHour, setDeletingHour] = useState<MerchantOperationalHour | null>(null);

  const {
    register,
    handleSubmit,
    setValue,
    watch,
    formState: { errors },
  } = useForm<UpdateMerchantRequest>({
    values: {
      name: merchant?.name || '',
      description: merchant?.description || '',
      latitude: merchant?.latitude || 0,
      longitude: merchant?.longitude || 0,
    },
  });

  const latitude = watch('latitude') ?? 0;
  const longitude = watch('longitude') ?? 0;

  const handleLocationChange = (lat: number, lng: number) => {
    setValue('latitude', lat, { shouldDirty: true });
    setValue('longitude', lng, { shouldDirty: true });
  };

  const handleUpdateMerchant = (data: UpdateMerchantRequest) => {
    updateMerchantMutation.mutate(data);
  };

  const handleCreateHour = (data: CreateOperationalHourRequest) => {
    createHourMutation.mutate(data, {
      onSuccess: () => setIsHourFormOpen(false),
    });
  };

  const handleUpdateHour = (data: CreateOperationalHourRequest) => {
    if (editingHour) {
      updateHourMutation.mutate(
        { hourId: editingHour.id, data },
        { onSuccess: () => setEditingHour(null) }
      );
    }
  };

  const handleDeleteHour = () => {
    if (deletingHour) {
      deleteHourMutation.mutate(deletingHour.id, {
        onSuccess: () => setDeletingHour(null),
      });
    }
  };

  const existingDays = operationalHours?.map((h) => h.dayOfWeek) || [];

  if (merchantLoading) {
    return <SettingsSkeleton />;
  }

  return (
    <motion.div
      variants={containerVariants}
      initial="hidden"
      animate="visible"
      className="space-y-6"
    >
      <motion.div variants={itemVariants}>
        <h1 className="text-2xl font-bold">Settings</h1>
        <p className="text-muted-foreground">Manage your store profile and operational hours</p>
      </motion.div>

      <motion.div variants={itemVariants}>
        <Card>
          <CardHeader>
            <CardTitle>Store Information</CardTitle>
          </CardHeader>
          <CardContent>
            <form onSubmit={handleSubmit(handleUpdateMerchant)} className="space-y-4">
              <div className="space-y-2">
                <Label htmlFor="name">Store Name *</Label>
                <Input
                  id="name"
                  {...register('name', {
                    required: 'Name is required',
                    minLength: { value: 4, message: 'Name must be at least 4 characters' },
                  })}
                  placeholder="Enter store name"
                />
                {errors.name && (
                  <p className="text-sm text-destructive">{errors.name.message}</p>
                )}
              </div>

              <div className="space-y-2">
                <Label htmlFor="description">Description</Label>
                <Textarea
                  id="description"
                  {...register('description', {
                    minLength: { value: 10, message: 'Description must be at least 10 characters' },
                  })}
                  placeholder="Enter store description"
                  rows={4}
                />
                {errors.description && (
                  <p className="text-sm text-destructive">{errors.description.message}</p>
                )}
              </div>

              <div className="space-y-2">
                <Label>Store Location</Label>
                <LocationPicker
                  latitude={latitude}
                  longitude={longitude}
                  onChange={handleLocationChange}
                  showSearch={true}
                  showCurrentLocation={true}
                  showAddress={true}
                  height="400px"
                />
              </div>

              <Button type="submit" disabled={updateMerchantMutation.isPending}>
                {updateMerchantMutation.isPending && (
                  <Loader2 className="mr-2 h-4 w-4 animate-spin" />
                )}
                <Save className="mr-2 h-4 w-4" />
                Save Changes
              </Button>
            </form>
          </CardContent>
        </Card>
      </motion.div>

      <motion.div variants={itemVariants}>
        <Card>
          <CardHeader className="flex flex-row items-center justify-between">
            <CardTitle className="flex items-center gap-2">
              <Clock className="h-5 w-5" />
              Operational Hours
            </CardTitle>
            <Button
              size="sm"
              onClick={() => setIsHourFormOpen(true)}
              disabled={existingDays.length >= 7}
            >
              <Plus className="mr-2 h-4 w-4" />
              Add Hours
            </Button>
          </CardHeader>
          <CardContent>
            {hoursLoading ? (
              <div className="space-y-2">
                {[1, 2, 3].map((i) => (
                  <Skeleton key={i} className="h-14" />
                ))}
              </div>
            ) : !operationalHours || operationalHours.length === 0 ? (
              <div className="text-center py-8 text-muted-foreground">
                <Clock className="h-12 w-12 mx-auto mb-4 opacity-50" />
                <p>No operational hours set</p>
                <Button variant="link" onClick={() => setIsHourFormOpen(true)}>
                  Add your first schedule
                </Button>
              </div>
            ) : (
              <OperationalHoursList
                hours={operationalHours}
                onEdit={setEditingHour}
                onDelete={setDeletingHour}
              />
            )}
          </CardContent>
        </Card>
      </motion.div>

      <Dialog open={isHourFormOpen} onOpenChange={setIsHourFormOpen}>
        <DialogContent>
          <DialogHeader>
            <DialogTitle>Add Operational Hours</DialogTitle>
            <DialogDescription>
              Set the opening and closing times for a specific day.
            </DialogDescription>
          </DialogHeader>
          <OperationalHoursForm
            onSubmit={handleCreateHour}
            onCancel={() => setIsHourFormOpen(false)}
            isSubmitting={createHourMutation.isPending}
            existingDays={existingDays}
          />
        </DialogContent>
      </Dialog>

      <Dialog open={!!editingHour} onOpenChange={() => setEditingHour(null)}>
        <DialogContent>
          <DialogHeader>
            <DialogTitle>Edit Operational Hours</DialogTitle>
            <DialogDescription>
              Update the opening and closing times.
            </DialogDescription>
          </DialogHeader>
          {editingHour && (
            <OperationalHoursForm
              hour={editingHour}
              onSubmit={handleUpdateHour}
              onCancel={() => setEditingHour(null)}
              isSubmitting={updateHourMutation.isPending}
              existingDays={existingDays}
            />
          )}
        </DialogContent>
      </Dialog>

      <Dialog open={!!deletingHour} onOpenChange={() => setDeletingHour(null)}>
        <DialogContent>
          <DialogHeader>
            <DialogTitle>Delete Operational Hours</DialogTitle>
            <DialogDescription>
              Are you sure you want to delete this schedule? This action cannot be undone.
            </DialogDescription>
          </DialogHeader>
          <DialogFooter>
            <Button variant="outline" onClick={() => setDeletingHour(null)}>
              Cancel
            </Button>
            <Button
              variant="destructive"
              onClick={handleDeleteHour}
              disabled={deleteHourMutation.isPending}
            >
              {deleteHourMutation.isPending && (
                <Loader2 className="mr-2 h-4 w-4 animate-spin" />
              )}
              Delete
            </Button>
          </DialogFooter>
        </DialogContent>
      </Dialog>
    </motion.div>
  );
}

function SettingsSkeleton() {
  return (
    <div className="space-y-6">
      <div className="space-y-2">
        <Skeleton className="h-8 w-32" />
        <Skeleton className="h-4 w-64" />
      </div>
      <Skeleton className="h-96" />
      <Skeleton className="h-64" />
    </div>
  );
}
