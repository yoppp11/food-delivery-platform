import { useState } from 'react';
import { motion } from 'framer-motion';
import { Search, Eye, MoreHorizontal, CheckCircle, XCircle, Star, MapPin } from 'lucide-react';
import { Link } from 'react-router-dom';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Input } from '@/components/ui/input';
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
import { UserStatusBadge, Pagination, ConfirmDialog } from '@/components/admin';
import { useAdminMerchants, useVerifyMerchant, useApproveMerchant, useRejectMerchant } from '@/hooks/use-admin';
import { useTranslation } from 'react-i18next';
import type { MerchantWithDetails } from '@/types/admin';

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

export function AdminMerchantsPage() {
  const { t } = useTranslation();
  const [page, setPage] = useState(1);
  const [search, setSearch] = useState('');
  const [confirmDialog, setConfirmDialog] = useState<{
    open: boolean;
    merchant: MerchantWithDetails | null;
    action: 'verify' | 'approve' | 'reject';
  }>({ open: false, merchant: null, action: 'verify' });

  const { data, isLoading, refetch } = useAdminMerchants({
    page,
    limit: 20,
    search: search || undefined,
  });

  const verifyMutation = useVerifyMerchant();
  const approveMutation = useApproveMerchant();
  const rejectMutation = useRejectMerchant();

  const handleVerify = (merchant: MerchantWithDetails) => {
    setConfirmDialog({ open: true, merchant, action: 'verify' });
  };

  const handleApprove = (merchant: MerchantWithDetails) => {
    setConfirmDialog({ open: true, merchant, action: 'approve' });
  };

  const handleReject = (merchant: MerchantWithDetails) => {
    setConfirmDialog({ open: true, merchant, action: 'reject' });
  };

  const confirmAction = () => {
    if (confirmDialog.merchant) {
      if (confirmDialog.action === 'verify') {
        verifyMutation.mutate(confirmDialog.merchant.id, {
          onSuccess: () => {
            setConfirmDialog({ open: false, merchant: null, action: 'verify' })
            refetch()
          },
        });
      } else if (confirmDialog.action === 'approve') {
        approveMutation.mutate(confirmDialog.merchant.id, {
          onSuccess: () => {
            setConfirmDialog({ open: false, merchant: null, action: 'verify' })
            refetch()
          },
        });
      } else {
        rejectMutation.mutate(confirmDialog.merchant.id, {
          onSuccess: () => {
            setConfirmDialog({ open: false, merchant: null, action: 'verify' })
            refetch()
          },
        });
      }
    }
  };

  const getApprovalBadge = (status?: string) => {
    switch (status) {
      case 'APPROVED':
        return <Badge className="bg-green-100 text-green-800">{t('admin.approval.approved')}</Badge>;
      case 'REJECTED':
        return <Badge className="bg-red-100 text-red-800">{t('admin.approval.rejected')}</Badge>;
      case 'PENDING':
      default:
        return <Badge className="bg-yellow-100 text-yellow-800">{t('admin.approval.pending')}</Badge>;
    }
  };

  return (
    <motion.div
      variants={containerVariants}
      initial="hidden"
      animate="visible"
      className="space-y-6"
    >
      <motion.div variants={itemVariants}>
        <h1 className="text-2xl font-bold">{t('admin.merchants.title')}</h1>
        <p className="text-muted-foreground">{t('admin.merchants.subtitle')}</p>
      </motion.div>

      <motion.div variants={itemVariants}>
        <Card>
          <CardHeader>
            <div className="flex flex-col gap-4 sm:flex-row sm:items-center sm:justify-between">
              <CardTitle>{t('admin.merchants.allMerchants')}</CardTitle>
              <div className="relative">
                <Search className="absolute left-3 top-1/2 h-4 w-4 -translate-y-1/2 text-muted-foreground" />
                <Input
                  placeholder={t('admin.merchants.searchPlaceholder')}
                  value={search}
                  onChange={(e) => setSearch(e.target.value)}
                  className="pl-9 w-full sm:w-64"
                />
              </div>
            </div>
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
                        <th className="pb-3 font-medium">{t('admin.merchants.name')}</th>
                        <th className="pb-3 font-medium">{t('admin.merchants.owner')}</th>
                        <th className="pb-3 font-medium">{t('admin.merchants.rating')}</th>
                        <th className="pb-3 font-medium">{t('admin.approval.status')}</th>
                        <th className="pb-3 font-medium">{t('admin.merchants.status')}</th>
                        <th className="pb-3 font-medium">{t('admin.merchants.ownerStatus')}</th>
                        <th className="pb-3 font-medium">{t('admin.users.actions')}</th>
                      </tr>
                    </thead>
                    <tbody>
                      {data?.data.map((merchant) => (
                        <tr key={merchant.id} className="border-b hover:bg-muted/50">
                          <td className="py-4">
                            <div className="flex items-center gap-3">
                              <div className="h-10 w-10 rounded-lg bg-primary/10 flex items-center justify-center">
                                {merchant.imageUrl ? (
                                  <img
                                    src={merchant.imageUrl}
                                    alt={merchant.name}
                                    className="h-10 w-10 rounded-lg object-cover"
                                  />
                                ) : (
                                  <span className="text-lg">🍕</span>
                                )}
                              </div>
                              <div>
                                <p className="font-medium">{merchant.name}</p>
                                {merchant.description && (
                                  <p className="text-sm text-muted-foreground truncate max-w-xs">
                                    {merchant.description}
                                  </p>
                                )}
                              </div>
                            </div>
                          </td>
                          <td className="py-4 text-muted-foreground">
                            {merchant.user?.email}
                          </td>
                          <td className="py-4">
                            <div className="flex items-center gap-1">
                              <Star className="h-4 w-4 text-yellow-500 fill-yellow-500" />
                              <span>{merchant.rating?.toFixed(1) || 'N/A'}</span>
                              <span className="text-muted-foreground">
                                ({merchant.reviewCount})
                              </span>
                            </div>
                          </td>
                          <td className="py-4">
                            {getApprovalBadge((merchant as any).approvalStatus)}
                          </td>
                          <td className="py-4">
                            <Badge
                              variant="secondary"
                              className={
                                merchant.isOpen
                                  ? 'bg-green-100 text-green-800'
                                  : 'bg-gray-100 text-gray-800'
                              }
                            >
                              {merchant.isOpen ? t('merchant.open') : t('merchant.closed')}
                            </Badge>
                          </td>
                          <td className="py-4">
                            <UserStatusBadge status={merchant.user?.status || 'ACTIVE'} />
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
                                  <Link to={`/admin/merchants/${merchant.id}`}>
                                    <Eye className="mr-2 h-4 w-4" />
                                    {t('admin.merchants.viewDetails')}
                                  </Link>
                                </DropdownMenuItem>
                                <DropdownMenuItem asChild>
                                  <a
                                    href={`https://www.google.com/maps?q=${merchant.latitude},${merchant.longitude}`}
                                    target="_blank"
                                    rel="noopener noreferrer"
                                  >
                                    <MapPin className="mr-2 h-4 w-4" />
                                    {t('admin.merchants.viewLocation')}
                                  </a>
                                </DropdownMenuItem>
                                <DropdownMenuSeparator />
                                {(merchant as any).approvalStatus === 'PENDING' && (
                                  <>
                                    <DropdownMenuItem
                                      onClick={() => handleApprove(merchant)}
                                      className="text-green-600"
                                    >
                                      <CheckCircle className="mr-2 h-4 w-4" />
                                      {t('admin.approval.approve')}
                                    </DropdownMenuItem>
                                    <DropdownMenuItem
                                      onClick={() => handleReject(merchant)}
                                      className="text-red-600"
                                    >
                                      <XCircle className="mr-2 h-4 w-4" />
                                      {t('admin.approval.reject')}
                                    </DropdownMenuItem>
                                  </>
                                )}
                                {!merchant.isOpen && (merchant as any).approvalStatus === 'APPROVED' && (
                                  <DropdownMenuItem
                                    onClick={() => handleVerify(merchant)}
                                    className="text-green-600"
                                  >
                                    <CheckCircle className="mr-2 h-4 w-4" />
                                    {t('admin.merchants.verify')}
                                  </DropdownMenuItem>
                                )}
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
        open={confirmDialog.open}
        onOpenChange={(open) => setConfirmDialog({ ...confirmDialog, open })}
        title={
          confirmDialog.action === 'approve'
            ? t('admin.approval.confirmApprove')
            : confirmDialog.action === 'reject'
            ? t('admin.approval.confirmReject')
            : t('admin.merchants.confirmVerify')
        }
        description={
          confirmDialog.action === 'approve'
            ? t('admin.approval.confirmApproveMerchantDesc', { name: confirmDialog.merchant?.name })
            : confirmDialog.action === 'reject'
            ? t('admin.approval.confirmRejectMerchantDesc', { name: confirmDialog.merchant?.name })
            : t('admin.merchants.confirmVerifyDesc', { name: confirmDialog.merchant?.name })
        }
        onConfirm={confirmAction}
        confirmLabel={
          confirmDialog.action === 'approve'
            ? t('admin.approval.approve')
            : confirmDialog.action === 'reject'
            ? t('admin.approval.reject')
            : t('common.confirm')
        }
        isLoading={verifyMutation.isPending || approveMutation.isPending || rejectMutation.isPending}
        variant={confirmDialog.action === 'reject' ? 'destructive' : 'default'}
      />
    </motion.div>
  );
}
