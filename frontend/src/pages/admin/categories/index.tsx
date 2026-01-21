import { useState } from 'react';
import { motion } from 'framer-motion';
import { Plus, Edit, Trash2, MoreHorizontal, FolderOpen } from 'lucide-react';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Button } from '@/components/ui/button';
import { Textarea } from '@/components/ui/textarea';
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
} from '@/components/ui/dialog';
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuTrigger,
  DropdownMenuSeparator,
} from '@/components/ui/dropdown-menu';
import { Skeleton } from '@/components/ui/skeleton';
import { ConfirmDialog } from '@/components/admin';
import {
  useAdminCategories,
  useCreateCategory,
  useUpdateCategory,
  useDeleteCategory,
} from '@/hooks/use-admin';
import { useTranslation } from 'react-i18next';
import type { Category } from '@/types';

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

export function AdminCategoriesPage() {
  const { t } = useTranslation();
  const [formDialog, setFormDialog] = useState<{
    open: boolean;
    category: Category | null;
  }>({ open: false, category: null });
  const [deleteDialog, setDeleteDialog] = useState<{
    open: boolean;
    category: Category | null;
  }>({ open: false, category: null });
  const [formData, setFormData] = useState({ name: '', description: '' });

  const { data: categories, isLoading } = useAdminCategories();
  const createMutation = useCreateCategory();
  const updateMutation = useUpdateCategory();
  const deleteMutation = useDeleteCategory();

  const openCreateDialog = () => {
    setFormData({ name: '', description: '' });
    setFormDialog({ open: true, category: null });
  };

  const openEditDialog = (category: Category) => {
    setFormData({ name: category.name, description: category.description || '' });
    setFormDialog({ open: true, category });
  };

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (formDialog.category) {
      updateMutation.mutate(
        { id: formDialog.category.id, data: formData },
        { onSuccess: () => setFormDialog({ open: false, category: null }) }
      );
    } else {
      createMutation.mutate(formData, {
        onSuccess: () => setFormDialog({ open: false, category: null }),
      });
    }
  };

  const handleDelete = (category: Category) => {
    setDeleteDialog({ open: true, category });
  };

  const confirmDelete = () => {
    if (deleteDialog.category) {
      deleteMutation.mutate(deleteDialog.category.id, {
        onSuccess: () => setDeleteDialog({ open: false, category: null }),
      });
    }
  };

  const formatDate = (date: Date | string) => {
    return new Date(date).toLocaleDateString();
  };

  return (
    <motion.div
      variants={containerVariants}
      initial="hidden"
      animate="visible"
      className="space-y-6"
    >
      <motion.div variants={itemVariants} className="flex items-center justify-between">
        <div>
          <h1 className="text-2xl font-bold">{t('admin.categories.title')}</h1>
          <p className="text-muted-foreground">{t('admin.categories.subtitle')}</p>
        </div>
        <Button onClick={openCreateDialog}>
          <Plus className="mr-2 h-4 w-4" />
          {t('admin.categories.createNew')}
        </Button>
      </motion.div>

      <motion.div variants={itemVariants}>
        <Card>
          <CardHeader>
            <CardTitle>{t('admin.categories.allCategories')}</CardTitle>
          </CardHeader>
          <CardContent>
            {isLoading ? (
              <div className="space-y-4">
                {[...Array(10)].map((_, i) => (
                  <Skeleton key={i} className="h-16 w-full" />
                ))}
              </div>
            ) : (
              <div className="overflow-x-auto">
                <table className="w-full">
                  <thead>
                    <tr className="border-b text-left">
                      <th className="pb-3 font-medium">{t('admin.categories.name')}</th>
                      <th className="pb-3 font-medium">{t('admin.categories.description')}</th>
                      <th className="pb-3 font-medium">{t('admin.categories.createdAt')}</th>
                      <th className="pb-3 font-medium">{t('admin.users.actions')}</th>
                    </tr>
                  </thead>
                  <tbody>
                    {categories?.map((category) => (
                      <tr key={category.id} className="border-b hover:bg-muted/50">
                        <td className="py-4">
                          <div className="flex items-center gap-2">
                            <FolderOpen className="h-4 w-4 text-primary" />
                            <span className="font-medium">{category.name}</span>
                          </div>
                        </td>
                        <td className="py-4 text-muted-foreground">
                          {category.description || '-'}
                        </td>
                        <td className="py-4 text-muted-foreground">
                          {formatDate(category.createdAt)}
                        </td>
                        <td className="py-4">
                          <DropdownMenu>
                            <DropdownMenuTrigger asChild>
                              <Button variant="ghost" size="icon">
                                <MoreHorizontal className="h-4 w-4" />
                              </Button>
                            </DropdownMenuTrigger>
                            <DropdownMenuContent align="end">
                              <DropdownMenuItem onClick={() => openEditDialog(category)}>
                                <Edit className="mr-2 h-4 w-4" />
                                {t('common.edit')}
                              </DropdownMenuItem>
                              <DropdownMenuSeparator />
                              <DropdownMenuItem
                                onClick={() => handleDelete(category)}
                                className="text-red-600"
                              >
                                <Trash2 className="mr-2 h-4 w-4" />
                                {t('common.delete')}
                              </DropdownMenuItem>
                            </DropdownMenuContent>
                          </DropdownMenu>
                        </td>
                      </tr>
                    ))}
                  </tbody>
                </table>
              </div>
            )}
          </CardContent>
        </Card>
      </motion.div>

      <Dialog open={formDialog.open} onOpenChange={(open) => setFormDialog({ ...formDialog, open })}>
        <DialogContent>
          <DialogHeader>
            <DialogTitle>
              {formDialog.category
                ? t('admin.categories.editCategory')
                : t('admin.categories.createNew')}
            </DialogTitle>
          </DialogHeader>
          <form onSubmit={handleSubmit} className="space-y-4">
            <div className="space-y-2">
              <Label htmlFor="name">{t('admin.categories.name')}</Label>
              <Input
                id="name"
                value={formData.name}
                onChange={(e) => setFormData({ ...formData, name: e.target.value })}
                required
              />
            </div>
            <div className="space-y-2">
              <Label htmlFor="description">{t('admin.categories.description')}</Label>
              <Textarea
                id="description"
                value={formData.description}
                onChange={(e) => setFormData({ ...formData, description: e.target.value })}
                rows={3}
              />
            </div>
            <div className="flex gap-2 justify-end pt-4">
              <Button
                type="button"
                variant="outline"
                onClick={() => setFormDialog({ open: false, category: null })}
              >
                {t('common.cancel')}
              </Button>
              <Button
                type="submit"
                disabled={createMutation.isPending || updateMutation.isPending}
              >
                {createMutation.isPending || updateMutation.isPending
                  ? t('common.loading')
                  : t('common.save')}
              </Button>
            </div>
          </form>
        </DialogContent>
      </Dialog>

      <ConfirmDialog
        open={deleteDialog.open}
        onOpenChange={(open) => setDeleteDialog({ ...deleteDialog, open })}
        title={t('admin.categories.confirmDelete')}
        description={t('admin.categories.confirmDeleteDesc', {
          name: deleteDialog.category?.name,
        })}
        variant="destructive"
        onConfirm={confirmDelete}
        isLoading={deleteMutation.isPending}
      />
    </motion.div>
  );
}
