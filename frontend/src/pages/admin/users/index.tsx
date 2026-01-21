import { useState } from 'react';
import { motion } from 'framer-motion';
import { Search, Eye, MoreHorizontal } from 'lucide-react';
import { Link } from 'react-router-dom';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Input } from '@/components/ui/input';
import { Button } from '@/components/ui/button';
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuTrigger,
  DropdownMenuSeparator,
} from '@/components/ui/dropdown-menu';
import { Skeleton } from '@/components/ui/skeleton';
import { UserStatusBadge, RoleBadge, Pagination, ConfirmDialog } from '@/components/admin';
import { useAdminUsers, useUpdateUserStatus } from '@/hooks/use-admin';
import { useTranslation } from 'react-i18next';
import type { User, UserStatus, Role } from '@/types';

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

export function AdminUsersPage() {
  const { t } = useTranslation();
  const [page, setPage] = useState(1);
  const [search, setSearch] = useState('');
  const [roleFilter, setRoleFilter] = useState<Role | ''>('');
  const [statusFilter, setStatusFilter] = useState<UserStatus | ''>('');
  const [confirmDialog, setConfirmDialog] = useState<{
    open: boolean;
    user: User | null;
    newStatus: UserStatus | null;
  }>({ open: false, user: null, newStatus: null });

  const { data, isLoading } = useAdminUsers({
    page,
    limit: 20,
    search: search || undefined,
    role: roleFilter || undefined,
    status: statusFilter || undefined,
  });

  const updateStatusMutation = useUpdateUserStatus();

  const handleStatusChange = (user: User, newStatus: UserStatus) => {
    setConfirmDialog({ open: true, user, newStatus });
  };

  const confirmStatusChange = () => {
    if (confirmDialog.user && confirmDialog.newStatus) {
      updateStatusMutation.mutate(
        { id: confirmDialog.user.id, data: { status: confirmDialog.newStatus } },
        { onSuccess: () => setConfirmDialog({ open: false, user: null, newStatus: null }) }
      );
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
      <motion.div variants={itemVariants}>
        <h1 className="text-2xl font-bold">{t('admin.users.title')}</h1>
        <p className="text-muted-foreground">{t('admin.users.subtitle')}</p>
      </motion.div>

      <motion.div variants={itemVariants}>
        <Card>
          <CardHeader>
            <div className="flex flex-col gap-4 sm:flex-row sm:items-center sm:justify-between">
              <CardTitle>{t('admin.users.allUsers')}</CardTitle>
              <div className="flex flex-col gap-2 sm:flex-row">
                <div className="relative">
                  <Search className="absolute left-3 top-1/2 h-4 w-4 -translate-y-1/2 text-muted-foreground" />
                  <Input
                    placeholder={t('admin.users.searchPlaceholder')}
                    value={search}
                    onChange={(e) => setSearch(e.target.value)}
                    className="pl-9 w-full sm:w-64"
                  />
                </div>
                <select
                  value={roleFilter}
                  onChange={(e) => setRoleFilter(e.target.value as Role | '')}
                  className="border rounded-md px-3 py-2 text-sm"
                >
                  <option value="">{t('admin.users.allRoles')}</option>
                  <option value="CUSTOMER">{t('admin.role.customer')}</option>
                  <option value="MERCHANT">{t('admin.role.merchant')}</option>
                  <option value="DRIVER">{t('admin.role.driver')}</option>
                  <option value="ADMIN">{t('admin.role.admin')}</option>
                </select>
                <select
                  value={statusFilter}
                  onChange={(e) => setStatusFilter(e.target.value as UserStatus | '')}
                  className="border rounded-md px-3 py-2 text-sm"
                >
                  <option value="">{t('admin.users.allStatuses')}</option>
                  <option value="ACTIVE">{t('admin.status.active')}</option>
                  <option value="SUSPENDED">{t('admin.status.suspended')}</option>
                  <option value="DELETED">{t('admin.status.deleted')}</option>
                </select>
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
                        <th className="pb-3 font-medium">{t('admin.users.email')}</th>
                        <th className="pb-3 font-medium">{t('admin.users.role')}</th>
                        <th className="pb-3 font-medium">{t('admin.users.status')}</th>
                        <th className="pb-3 font-medium">{t('admin.users.verified')}</th>
                        <th className="pb-3 font-medium">{t('admin.users.createdAt')}</th>
                        <th className="pb-3 font-medium">{t('admin.users.actions')}</th>
                      </tr>
                    </thead>
                    <tbody>
                      {data?.data.map((user) => (
                        <tr key={user.id} className="border-b hover:bg-muted/50">
                          <td className="py-4">
                            <div className="flex items-center gap-3">
                              <div className="h-8 w-8 rounded-full bg-primary/10 flex items-center justify-center">
                                <span className="text-sm font-medium">
                                  {user.email.charAt(0).toUpperCase()}
                                </span>
                              </div>
                              <span className="font-medium">{user.email}</span>
                            </div>
                          </td>
                          <td className="py-4">
                            <RoleBadge role={user.role} />
                          </td>
                          <td className="py-4">
                            <UserStatusBadge status={user.status} />
                          </td>
                          <td className="py-4">
                            <span className={user.emailVerified ? 'text-green-600' : 'text-muted-foreground'}>
                              {user.emailVerified ? '✓' : '✗'}
                            </span>
                          </td>
                          <td className="py-4 text-muted-foreground">
                            {formatDate(user.createdAt)}
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
                                  <Link to={`/admin/users/${user.id}`}>
                                    <Eye className="mr-2 h-4 w-4" />
                                    {t('admin.users.viewDetails')}
                                  </Link>
                                </DropdownMenuItem>
                                <DropdownMenuSeparator />
                                {user.status !== 'ACTIVE' && (
                                  <DropdownMenuItem
                                    onClick={() => handleStatusChange(user, 'ACTIVE')}
                                  >
                                    {t('admin.users.activate')}
                                  </DropdownMenuItem>
                                )}
                                {user.status !== 'SUSPENDED' && (
                                  <DropdownMenuItem
                                    onClick={() => handleStatusChange(user, 'SUSPENDED')}
                                    className="text-yellow-600"
                                  >
                                    {t('admin.users.suspend')}
                                  </DropdownMenuItem>
                                )}
                                {user.status !== 'DELETED' && (
                                  <DropdownMenuItem
                                    onClick={() => handleStatusChange(user, 'DELETED')}
                                    className="text-red-600"
                                  >
                                    {t('admin.users.delete')}
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
        title={t('admin.users.confirmStatusChange')}
        description={t('admin.users.confirmStatusChangeDesc', {
          email: confirmDialog.user?.email,
          status: confirmDialog.newStatus,
        })}
        variant={confirmDialog.newStatus === 'DELETED' ? 'destructive' : 'default'}
        onConfirm={confirmStatusChange}
        isLoading={updateStatusMutation.isPending}
      />
    </motion.div>
  );
}
