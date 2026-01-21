import { useState } from 'react';
import { motion } from 'framer-motion';
import { Plus, Edit, Trash2, MoreHorizontal, Tag } from 'lucide-react';
import { Link } from 'react-router-dom';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuTrigger,
  DropdownMenuSeparator,
} from '@/components/ui/dropdown-menu';
import { Skeleton } from '@/components/ui/skeleton';
import { Pagination, ConfirmDialog } from '@/components/admin';
import { useAdminPromotions, useDeletePromotion } from '@/hooks/use-admin';
import { useTranslation } from 'react-i18next';
import { formatCurrency } from '@/lib/utils';
import type { Promotion } from '@/types';

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

export function AdminPromotionsPage() {
  const { t } = useTranslation();
  const [page, setPage] = useState(1);
  const [deleteDialog, setDeleteDialog] = useState<{
    open: boolean;
    promotion: Promotion | null;
  }>({ open: false, promotion: null });

  const { data, isLoading } = useAdminPromotions({ page, limit: 20 });
  const deleteMutation = useDeletePromotion();

  const handleDelete = (promotion: Promotion) => {
    setDeleteDialog({ open: true, promotion });
  };

  const confirmDelete = () => {
    if (deleteDialog.promotion) {
      deleteMutation.mutate(deleteDialog.promotion.id, {
        onSuccess: () => setDeleteDialog({ open: false, promotion: null }),
      });
    }
  };

  const isExpired = (date: Date | string) => {
    return new Date(date) < new Date();
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
          <h1 className="text-2xl font-bold">{t('admin.promotions.title')}</h1>
          <p className="text-muted-foreground">{t('admin.promotions.subtitle')}</p>
        </div>
        <Link to="/admin/promotions/new">
          <Button>
            <Plus className="mr-2 h-4 w-4" />
            {t('admin.promotions.createNew')}
          </Button>
        </Link>
      </motion.div>

      <motion.div variants={itemVariants}>
        <Card>
          <CardHeader>
            <CardTitle>{t('admin.promotions.allPromotions')}</CardTitle>
          </CardHeader>
          <CardContent>
            {isLoading ? (
              <div className="space-y-4">
                {[...Array(10)].map((_, i) => (
                  <Skeleton key={i} className="h-16 w-full" />
                ))}
              </div>
            ) : (
              <>
                <div className="overflow-x-auto">
                  <table className="w-full">
                    <thead>
                      <tr className="border-b text-left">
                        <th className="pb-3 font-medium">{t('admin.promotions.code')}</th>
                        <th className="pb-3 font-medium">{t('admin.promotions.type')}</th>
                        <th className="pb-3 font-medium">{t('admin.promotions.value')}</th>
                        <th className="pb-3 font-medium">{t('admin.promotions.maxDiscount')}</th>
                        <th className="pb-3 font-medium">{t('admin.promotions.expiry')}</th>
                        <th className="pb-3 font-medium">{t('admin.promotions.status')}</th>
                        <th className="pb-3 font-medium">{t('admin.users.actions')}</th>
                      </tr>
                    </thead>
                    <tbody>
                      {data?.data?.map((promotion) => (
                        <tr key={promotion.id} className="border-b hover:bg-muted/50">
                          <td className="py-4">
                            <div className="flex items-center gap-2">
                              <Tag className="h-4 w-4 text-primary" />
                              <span className="font-mono font-bold">{promotion.code}</span>
                            </div>
                          </td>
                          <td className="py-4">
                            <Badge variant="outline">
                              {promotion.discountType === 'PERCENT' ? '%' : 'Flat'}
                            </Badge>
                          </td>
                          <td className="py-4">
                            {promotion.discountType === 'PERCENT'
                              ? `${promotion.discountValue}%`
                              : formatCurrency(promotion.discountValue)}
                          </td>
                          <td className="py-4">{formatCurrency(promotion.maxDiscount)}</td>
                          <td className="py-4 text-muted-foreground">
                            {formatDate(promotion.expiredAt)}
                          </td>
                          <td className="py-4">
                            <Badge
                              variant="secondary"
                              className={
                                isExpired(promotion.expiredAt)
                                  ? 'bg-red-100 text-red-800'
                                  : 'bg-green-100 text-green-800'
                              }
                            >
                              {isExpired(promotion.expiredAt)
                                ? t('admin.promotions.expired')
                                : t('admin.promotions.active')}
                            </Badge>
                          </td>
                          <td className="py-4">
                            <DropdownMenu>
                              <DropdownMenuTrigger asChild>
                                <Button variant="ghost" size="icon">
                                  <MoreHorizontal className="h-4 w-4" />
                                </Button>
                              </DropdownMenuTrigger>
                              <DropdownMenuContent align="end">
                                <DropdownMenuItem asChild>
                                  <Link to={`/admin/promotions/${promotion.id}/edit`}>
                                    <Edit className="mr-2 h-4 w-4" />
                                    {t('common.edit')}
                                  </Link>
                                </DropdownMenuItem>
                                <DropdownMenuSeparator />
                                <DropdownMenuItem
                                  onClick={() => handleDelete(promotion)}
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
                {data && (
                  <Pagination
                    page={page}
                    totalPages={data.totalPages}
                    onPageChange={setPage}
                  />
                )}
              </>
            )}
          </CardContent>
        </Card>
      </motion.div>

      <ConfirmDialog
        open={deleteDialog.open}
        onOpenChange={(open) => setDeleteDialog({ ...deleteDialog, open })}
        title={t('admin.promotions.confirmDelete')}
        description={t('admin.promotions.confirmDeleteDesc', {
          code: deleteDialog.promotion?.code,
        })}
        variant="destructive"
        onConfirm={confirmDelete}
        isLoading={deleteMutation.isPending}
      />
    </motion.div>
  );
}
