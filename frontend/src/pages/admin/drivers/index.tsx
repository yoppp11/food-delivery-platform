import { useState } from 'react';
import { motion } from 'framer-motion';
import { Search, Eye, MoreHorizontal, Star, Truck, CheckCircle, XCircle } from 'lucide-react';
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
import { useAdminDrivers, useApproveDriver, useRejectDriver } from '@/hooks/use-admin';
import { useTranslation } from 'react-i18next';
import type { Driver } from '@/types';

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

export function AdminDriversPage() {
  const { t } = useTranslation();
  const [page, setPage] = useState(1);
  const [search, setSearch] = useState('');
  const [confirmDialog, setConfirmDialog] = useState<{
    open: boolean;
    driver: Driver | null;
    action: 'approve' | 'reject';
  }>({ open: false, driver: null, action: 'approve' });

  const { data, isLoading, refetch } = useAdminDrivers({
    page,
    limit: 20,
    search: search || undefined,
  });

  const approveMutation = useApproveDriver();
  const rejectMutation = useRejectDriver();

  const handleApprove = (driver: Driver) => {
    setConfirmDialog({ open: true, driver, action: 'approve' });
  };

  const handleReject = (driver: Driver) => {
    setConfirmDialog({ open: true, driver, action: 'reject' });
  };

  const confirmAction = () => {
    if (confirmDialog.driver) {
      if (confirmDialog.action === 'approve') {
        approveMutation.mutate(confirmDialog.driver.id, {
          onSuccess: () => {
            setConfirmDialog({ open: false, driver: null, action: 'approve' })
            refetch()
          },
        });
      } else {
        rejectMutation.mutate(confirmDialog.driver.id, {
          onSuccess: () => {
            setConfirmDialog({ open: false, driver: null, action: 'approve' })
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
        <h1 className="text-2xl font-bold">{t('admin.drivers.title')}</h1>
        <p className="text-muted-foreground">{t('admin.drivers.subtitle')}</p>
      </motion.div>

      <motion.div variants={itemVariants}>
        <Card>
          <CardHeader>
            <div className="flex flex-col gap-4 sm:flex-row sm:items-center sm:justify-between">
              <CardTitle>{t('admin.drivers.allDrivers')}</CardTitle>
              <div className="relative">
                <Search className="absolute left-3 top-1/2 h-4 w-4 -translate-y-1/2 text-muted-foreground" />
                <Input
                  placeholder={t('admin.drivers.searchPlaceholder')}
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
                        <th className="pb-3 font-medium">{t('admin.drivers.driver')}</th>
                        <th className="pb-3 font-medium">{t('admin.drivers.plateNumber')}</th>
                        <th className="pb-3 font-medium">{t('admin.drivers.rating')}</th>
                        <th className="pb-3 font-medium">{t('admin.approval.status')}</th>
                        <th className="pb-3 font-medium">{t('admin.drivers.availability')}</th>
                        <th className="pb-3 font-medium">{t('admin.drivers.userStatus')}</th>
                        <th className="pb-3 font-medium">{t('admin.users.actions')}</th>
                      </tr>
                    </thead>
                    <tbody>
                      {data?.data.map((driver) => (
                        <tr key={driver.id} className="border-b hover:bg-muted/50">
                          <td className="py-4">
                            <div className="flex items-center gap-3">
                              <div className="h-10 w-10 rounded-full bg-primary/10 flex items-center justify-center">
                                <Truck className="h-5 w-5 text-primary" />
                              </div>
                              <div>
                                <p className="font-medium">{driver.user?.email}</p>
                                <p className="text-sm text-muted-foreground">
                                  ID: {driver.id.slice(0, 8)}...
                                </p>
                              </div>
                            </div>
                          </td>
                          <td className="py-4">
                            <Badge variant="outline">{driver.plateNumber}</Badge>
                          </td>
                          <td className="py-4">
                            <div className="flex items-center gap-1">
                              <Star className="h-4 w-4 text-yellow-500 fill-yellow-500" />
                              <span>{driver.rating?.toFixed(1) || 'N/A'}</span>
                            </div>
                          </td>
                          <td className="py-4">
                            {getApprovalBadge(driver.approvalStatus)}
                          </td>
                          <td className="py-4">
                            <Badge
                              variant="secondary"
                              className={
                                driver.isAvailable
                                  ? 'bg-green-100 text-green-800'
                                  : 'bg-gray-100 text-gray-800'
                              }
                            >
                              {driver.isAvailable
                                ? t('admin.drivers.available')
                                : t('admin.drivers.unavailable')}
                            </Badge>
                          </td>
                          <td className="py-4">
                            <UserStatusBadge status={driver.user?.status || 'ACTIVE'} />
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
                                  <Link to={`/admin/drivers/${driver.id}`}>
                                    <Eye className="mr-2 h-4 w-4" />
                                    {t('admin.drivers.viewDetails')}
                                  </Link>
                                </DropdownMenuItem>
                                {driver.approvalStatus === 'PENDING' && (
                                  <>
                                    <DropdownMenuSeparator />
                                    <DropdownMenuItem onClick={() => handleApprove(driver)}>
                                      <CheckCircle className="mr-2 h-4 w-4 text-green-600" />
                                      {t('admin.approval.approve')}
                                    </DropdownMenuItem>
                                    <DropdownMenuItem onClick={() => handleReject(driver)}>
                                      <XCircle className="mr-2 h-4 w-4 text-red-600" />
                                      {t('admin.approval.reject')}
                                    </DropdownMenuItem>
                                  </>
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
        title={confirmDialog.action === 'approve' ? t('admin.approval.confirmApprove') : t('admin.approval.confirmReject')}
        description={
          confirmDialog.action === 'approve'
            ? t('admin.approval.confirmApproveDriverDesc', { email: confirmDialog.driver?.user?.email })
            : t('admin.approval.confirmRejectDriverDesc', { email: confirmDialog.driver?.user?.email })
        }
        onConfirm={confirmAction}
        confirmLabel={confirmDialog.action === 'approve' ? t('admin.approval.approve') : t('admin.approval.reject')}
        isLoading={approveMutation.isPending || rejectMutation.isPending}
        variant={confirmDialog.action === 'reject' ? 'destructive' : 'default'}
      />
    </motion.div>
  );
}
