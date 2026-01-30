import { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { useForm, useFieldArray, Controller, type FieldArrayWithId } from 'react-hook-form';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Textarea } from '@/components/ui/textarea';
import { Switch } from '@/components/ui/switch';
import { Loader2, Plus, Trash2, Upload } from 'lucide-react';
import { useMerchantCategories } from '@/hooks/use-merchant-categories';
import type { Menu } from '@/types/merchant';

interface MenuFormData {
  name: string;
  description: string;
  categoryId: string;
  price: number;
  isAvailable: boolean;
  menuVariants: Array<{
    id?: string;
    name: string;
    price: number;
  }>;
}

interface MenuFormProps {
  menu?: Menu;
  onSubmit: (data: FormData) => void;
  isSubmitting: boolean;
}

export function MenuForm({ menu, onSubmit, isSubmitting }: MenuFormProps) {
  const navigate = useNavigate();
  const [imagePreview, setImagePreview] = useState<string | null>(
    menu?.imageUrl || menu?.image?.imageUrl || null
  );
  const [selectedFile, setSelectedFile] = useState<File | null>(null);

  const { data: categories } = useMerchantCategories();

  const {
    register,
    handleSubmit,
    control,
    formState: { errors },
  } = useForm<MenuFormData>({
    defaultValues: {
      name: menu?.name || '',
      description: menu?.description || '',
      categoryId: menu?.categoryId || '',
      price: menu?.price || 0,
      isAvailable: menu?.isAvailable ?? true,
      menuVariants: menu?.menuVariants?.map((v) => ({
        id: v.id,
        name: v.name,
        price: v.price,
      })) || [],
    },
  });

  const { fields, append, remove } = useFieldArray({
    control,
    name: 'menuVariants',
  });

  const handleImageChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (file) {
      setSelectedFile(file);
      const reader = new FileReader();
      reader.onloadend = () => {
        setImagePreview(reader.result as string);
      };
      reader.readAsDataURL(file);
    }
  };

  const handleFormSubmit = (data: MenuFormData) => {
    const formData = new FormData();
    formData.append('name', data.name);
    formData.append('description', data.description);
    formData.append('categoryId', data.categoryId);
    formData.append('price', data.price.toString());
    formData.append('isAvailable', data.isAvailable.toString());

    const variantsWithId = data.menuVariants.map((v, index) => ({
      id: menu?.menuVariants?.[index]?.id || v.id,
      name: v.name,
      price: v.price,
    }));

    if (variantsWithId.length > 0) {
      formData.append('menuVariants', JSON.stringify(variantsWithId));
    }

    if (selectedFile) {
      formData.append('image', selectedFile);
    }

    onSubmit(formData);
  };

  return (
    <form onSubmit={handleSubmit(handleFormSubmit)} className="space-y-6">
      <Card>
        <CardHeader>
          <CardTitle>Menu Details</CardTitle>
        </CardHeader>
        <CardContent className="space-y-4">
          <div className="space-y-2">
            <Label htmlFor="name">Name *</Label>
            <Input
              id="name"
              {...register('name', {
                required: 'Name is required',
                minLength: { value: 4, message: 'Name must be at least 4 characters' },
              })}
              placeholder="Enter menu name"
            />
            {errors.name && (
              <p className="text-sm text-destructive">{errors.name.message}</p>
            )}
          </div>

          <div className="space-y-2">
            <Label htmlFor="description">Description *</Label>
            <Textarea
              id="description"
              {...register('description', {
                required: 'Description is required',
                minLength: { value: 10, message: 'Description must be at least 10 characters' },
              })}
              placeholder="Enter menu description"
              rows={4}
            />
            {errors.description && (
              <p className="text-sm text-destructive">{errors.description.message}</p>
            )}
          </div>

          <div className="grid gap-4 md:grid-cols-2">
            <div className="space-y-2">
              <Label htmlFor="categoryId">Category *</Label>
              <select
                id="categoryId"
                {...register('categoryId', { required: 'Category is required' })}
                className="flex h-10 w-full rounded-md border border-input bg-background px-3 py-2 text-sm ring-offset-background focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring"
              >
                <option value="">Select a category</option>
                {categories?.map((category) => (
                  <option key={category.id} value={category.id}>
                    {category.name}
                  </option>
                ))}
              </select>
              {errors.categoryId && (
                <p className="text-sm text-destructive">{errors.categoryId.message}</p>
              )}
            </div>

            <div className="space-y-2">
              <Label htmlFor="price">Price *</Label>
              <Input
                id="price"
                type="number"
                {...register('price', {
                  required: 'Price is required',
                  min: { value: 0, message: 'Price must be positive' },
                  valueAsNumber: true,
                })}
                placeholder="Enter price"
              />
              {errors.price && (
                <p className="text-sm text-destructive">{errors.price.message}</p>
              )}
            </div>
          </div>

          <div className="flex items-center gap-4">
            <Label htmlFor="isAvailable">Available</Label>
            <Controller
              name="isAvailable"
              control={control}
              render={({ field }) => (
                <Switch
                  id="isAvailable"
                  checked={field.value}
                  onCheckedChange={field.onChange}
                />
              )}
            />
          </div>
        </CardContent>
      </Card>

      <Card>
        <CardHeader>
          <CardTitle>Image</CardTitle>
        </CardHeader>
        <CardContent>
          <div className="flex items-center gap-4">
            {imagePreview ? (
              <img
                src={imagePreview}
                alt="Preview"
                className="h-32 w-32 rounded-lg object-cover"
              />
            ) : (
              <div className="h-32 w-32 rounded-lg bg-muted flex items-center justify-center">
                <Upload className="h-8 w-8 text-muted-foreground" />
              </div>
            )}
            <div>
              <Input
                type="file"
                accept="image/*"
                onChange={handleImageChange}
                className="max-w-xs"
              />
              <p className="text-sm text-muted-foreground mt-2">
                Recommended size: 800x600 pixels
              </p>
            </div>
          </div>
        </CardContent>
      </Card>

      <Card>
        <CardHeader className="flex flex-row items-center justify-between">
          <CardTitle>Variants (Optional)</CardTitle>
          <Button
            type="button"
            variant="outline"
            size="sm"
            onClick={() => append({ name: '', price: 0 })}
          >
            <Plus className="mr-2 h-4 w-4" />
            Add Variant
          </Button>
        </CardHeader>
        <CardContent>
          {fields.length === 0 ? (
            <p className="text-sm text-muted-foreground text-center py-4">
              No variants added. Click "Add Variant" to create menu variants.
            </p>
          ) : (
            <div className="space-y-4">
              {fields.map((field: FieldArrayWithId<MenuFormData, 'menuVariants', 'id'>, index: number) => (
                <div key={field.id} className="flex items-end gap-4">
                  <div className="flex-1 space-y-2">
                    <Label>Variant Name</Label>
                    <Input
                      {...register(`menuVariants.${index}.name`, {
                        required: 'Variant name is required',
                        minLength: { value: 4, message: 'Min 4 characters' },
                      })}
                      placeholder="e.g., Large, Extra Spicy"
                    />
                  </div>
                  <div className="w-32 space-y-2">
                    <Label>Price</Label>
                    <Input
                      type="number"
                      {...register(`menuVariants.${index}.price`, {
                        required: 'Price is required',
                        min: { value: 0, message: 'Must be positive' },
                        valueAsNumber: true,
                      })}
                      placeholder="0"
                    />
                  </div>
                  <Button
                    type="button"
                    variant="ghost"
                    size="icon"
                    onClick={() => remove(index)}
                  >
                    <Trash2 className="h-4 w-4 text-destructive" />
                  </Button>
                </div>
              ))}
            </div>
          )}
        </CardContent>
      </Card>

      <div className="flex items-center gap-4">
        <Button type="submit" disabled={isSubmitting}>
          {isSubmitting && <Loader2 className="mr-2 h-4 w-4 animate-spin" />}
          {menu ? 'Update Menu' : 'Create Menu'}
        </Button>
        <Button type="button" variant="outline" onClick={() => navigate(-1)}>
          Cancel
        </Button>
      </div>
    </form>
  );
}
