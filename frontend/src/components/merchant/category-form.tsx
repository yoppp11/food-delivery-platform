import { useForm } from 'react-hook-form';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Loader2, Pencil, Trash2 } from 'lucide-react';
import type { MerchantMenuCategory, CreateCategoryRequest } from '@/types/merchant';

interface CategoryFormProps {
  category?: MerchantMenuCategory;
  onSubmit: (data: CreateCategoryRequest) => void;
  onCancel: () => void;
  isSubmitting: boolean;
}

export function CategoryForm({
  category,
  onSubmit,
  onCancel,
  isSubmitting,
}: CategoryFormProps) {
  const {
    register,
    handleSubmit,
    formState: { errors },
  } = useForm<CreateCategoryRequest>({
    defaultValues: {
      name: category?.name || '',
    },
  });

  return (
    <form onSubmit={handleSubmit(onSubmit)} className="space-y-4">
      <div className="space-y-2">
        <Label htmlFor="name">Category Name *</Label>
        <Input
          id="name"
          {...register('name', {
            required: 'Name is required',
            minLength: { value: 4, message: 'Name must be at least 4 characters' },
          })}
          placeholder="Enter category name"
        />
        {errors.name && (
          <p className="text-sm text-destructive">{errors.name.message}</p>
        )}
      </div>
      <div className="flex justify-end gap-2">
        <Button type="button" variant="outline" onClick={onCancel}>
          Cancel
        </Button>
        <Button type="submit" disabled={isSubmitting}>
          {isSubmitting && <Loader2 className="mr-2 h-4 w-4 animate-spin" />}
          {category ? 'Update' : 'Create'}
        </Button>
      </div>
    </form>
  );
}

interface CategoryListItemProps {
  category: MerchantMenuCategory;
  onEdit: () => void;
  onDelete: () => void;
}

export function CategoryListItem({
  category,
  onEdit,
  onDelete,
}: CategoryListItemProps) {
  return (
    <div className="flex items-center justify-between p-4 border rounded-lg">
      <div>
        <p className="font-medium">{category.name}</p>
        {category.menus && (
          <p className="text-sm text-muted-foreground">
            {category.menus.length} menu items
          </p>
        )}
      </div>
      <div className="flex items-center gap-2">
        <Button variant="ghost" size="icon" onClick={onEdit}>
          <Pencil className="h-4 w-4" />
        </Button>
        <Button variant="ghost" size="icon" onClick={onDelete}>
          <Trash2 className="h-4 w-4 text-destructive" />
        </Button>
      </div>
    </div>
  );
}
