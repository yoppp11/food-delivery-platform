import { useParams, Link } from 'react-router-dom';
import { motion } from 'framer-motion';
import { ArrowLeft, Mail, Phone, Calendar, Shield } from 'lucide-react';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Skeleton } from '@/components/ui/skeleton';
import { UserStatusBadge, RoleBadge, ConfirmDialog } from '@/components/admin';
import { useAdminUser, useUpdateUserStatus, useUpdateUserRole } from '@/hooks/use-admin';
import { useTranslation } from 'react-i18next';
import { useState } from 'react';
import type { UserStatus, Role } from '@/types';

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

export function AdminUserDetailPage() {
  const { t } = useTranslation();
  const { id } = useParams<{ id: string }>();
  const { data: user, isLoading } = useAdminUser(id || '');
  const updateStatusMutation = useUpdateUserStatus();
  const updateRoleMutation = useUpdateUserRole();

  const [statusDialog, setStatusDialog] = useState<{
    open: boolean;
    newStatus: UserStatus | null;
  }>({ open: false, newStatus: null });

  const [roleDialog, setRoleDialog] = useState<{
    open: boolean;
    newRole: Role | null;
  }>({ open: false, newRole: null });

  const handleStatusChange = (newStatus: UserStatus) => {
    setStatusDialog({ open: true, newStatus });
  };

  const confirmStatusChange = () => {
    if (id && statusDialog.newStatus) {
      updateStatusMutation.mutate(
        { id, data: { status: statusDialog.newStatus } },
        { onSuccess: () => setStatusDialog({ open: false, newStatus: null }) }
      );
    }
  };

  const handleRoleChange = (newRole: Role) => {
    setRoleDialog({ open: true, newRole });
  };

  const confirmRoleChange = () => {
    if (id && roleDialog.newRole) {
      updateRoleMutation.mutate(
        { id, data: { role: roleDialog.newRole } },
        { onSuccess: () => setRoleDialog({ open: false, newRole: null }) }
      );
    }
  };

  const formatDate = (date: Date | string) => {
    return new Date(date).toLocaleDateString();
  };

  if (isLoading) {
    return <UserDetailSkeleton />;
  }

  if (!user) {
    return (
      <div className="flex flex-col items-center justify-center py-12">
        <p className="text-muted-foreground">{t('admin.users.notFound')}</p>
        <Link to="/admin/users">
          <Button variant="link">{t('admin.users.backToList')}</Button>
        </Link>
      </div>
    );
  }

  return (
    <motion.div
      variants={containerVariants}
      initial="hidden"
      animate="visible"
      className="space-y-6"
    >
      <motion.div variants={itemVariants}>
        <Link
          to="/admin/users"
          className="inline-flex items-center text-sm text-muted-foreground hover:text-foreground mb-4"
        >
          <ArrowLeft className="mr-2 h-4 w-4" />
          {t('admin.users.backToList')}
        </Link>
        <h1 className="text-2xl font-bold">{t('admin.users.userDetails')}</h1>
      </motion.div>

      <div className="grid gap-6 lg:grid-cols-2">
        <motion.div variants={itemVariants}>
          <Card>
            <CardHeader>
              <CardTitle>{t('admin.users.profile')}</CardTitle>
            </CardHeader>
            <CardContent className="space-y-4">
              <div className="flex items-center gap-4">
                <div className="h-16 w-16 rounded-full bg-primary/10 flex items-center justify-center">
                  {user.image ? (
                    <img
                      src={user.image}
                      alt={user.email}
                      className="h-16 w-16 rounded-full object-cover"
                    />
                  ) : (
                    <span className="text-2xl font-bold">
                      {user.email.charAt(0).toUpperCase()}
                    </span>
                  )}
                </div>
                <div>
                  <p className="font-medium">{user.email}</p>
                  <div className="flex items-center gap-2 mt-1">
                    <RoleBadge role={user.role} />
                    <UserStatusBadge status={user.status} />
                  </div>
                </div>
              </div>

              <div className="space-y-3 pt-4 border-t">
                <div className="flex items-center gap-3">
                  <Mail className="h-4 w-4 text-muted-foreground" />
                  <span>{user.email}</span>
                  {user.emailVerified && (
                    <span className="text-xs text-green-600">({t('admin.users.verified')})</span>
                  )}
                </div>
                {user.phoneNumber && (
                  <div className="flex items-center gap-3">
                    <Phone className="h-4 w-4 text-muted-foreground" />
                    <span>{user.phoneNumber}</span>
                  </div>
                )}
                <div className="flex items-center gap-3">
                  <Calendar className="h-4 w-4 text-muted-foreground" />
                  <span>{t('admin.users.joined')}: {formatDate(user.createdAt)}</span>
                </div>
              </div>
            </CardContent>
          </Card>
        </motion.div>

        <motion.div variants={itemVariants}>
          <Card>
            <CardHeader>
              <CardTitle>{t('admin.users.manageUser')}</CardTitle>
            </CardHeader>
            <CardContent className="space-y-6">
              <div>
                <h3 className="text-sm font-medium mb-3">{t('admin.users.changeStatus')}</h3>
                <div className="flex flex-wrap gap-2">
                  <Button
                    variant={user.status === 'ACTIVE' ? 'default' : 'outline'}
                    size="sm"
                    onClick={() => handleStatusChange('ACTIVE')}
                    disabled={user.status === 'ACTIVE'}
                  >
                    {t('admin.status.active')}
                  </Button>
                  <Button
                    variant={user.status === 'SUSPENDED' ? 'default' : 'outline'}
                    size="sm"
                    onClick={() => handleStatusChange('SUSPENDED')}
                    disabled={user.status === 'SUSPENDED'}
                    className={user.status !== 'SUSPENDED' ? 'text-yellow-600 border-yellow-600' : ''}
                  >
                    {t('admin.status.suspended')}
                  </Button>
                  <Button
                    variant={user.status === 'DELETED' ? 'default' : 'outline'}
                    size="sm"
                    onClick={() => handleStatusChange('DELETED')}
                    disabled={user.status === 'DELETED'}
                    className={user.status !== 'DELETED' ? 'text-red-600 border-red-600' : ''}
                  >
                    {t('admin.status.deleted')}
                  </Button>
                </div>
              </div>

              <div>
                <h3 className="text-sm font-medium mb-3">{t('admin.users.changeRole')}</h3>
                <div className="flex flex-wrap gap-2">
                  {(['CUSTOMER', 'MERCHANT', 'DRIVER', 'ADMIN'] as Role[]).map((role) => (
                    <Button
                      key={role}
                      variant={user.role === role ? 'default' : 'outline'}
                      size="sm"
                      onClick={() => handleRoleChange(role)}
                      disabled={user.role === role}
                    >
                      <Shield className="mr-2 h-4 w-4" />
                      {t(`admin.role.${role.toLowerCase()}`)}
                    </Button>
                  ))}
                </div>
              </div>
            </CardContent>
          </Card>
        </motion.div>
      </div>

      <ConfirmDialog
        open={statusDialog.open}
        onOpenChange={(open) => setStatusDialog({ ...statusDialog, open })}
        title={t('admin.users.confirmStatusChange')}
        description={t('admin.users.confirmStatusChangeDesc', {
          email: user.email,
          status: statusDialog.newStatus,
        })}
        variant={statusDialog.newStatus === 'DELETED' ? 'destructive' : 'default'}
        onConfirm={confirmStatusChange}
        isLoading={updateStatusMutation.isPending}
      />

      <ConfirmDialog
        open={roleDialog.open}
        onOpenChange={(open) => setRoleDialog({ ...roleDialog, open })}
        title={t('admin.users.confirmRoleChange')}
        description={t('admin.users.confirmRoleChangeDesc', {
          email: user.email,
          role: roleDialog.newRole,
        })}
        onConfirm={confirmRoleChange}
        isLoading={updateRoleMutation.isPending}
      />
    </motion.div>
  );
}

function UserDetailSkeleton() {
  return (
    <div className="space-y-6">
      <div>
        <Skeleton className="h-4 w-32 mb-4" />
        <Skeleton className="h-8 w-48" />
      </div>
      <div className="grid gap-6 lg:grid-cols-2">
        <Skeleton className="h-64" />
        <Skeleton className="h-64" />
      </div>
    </div>
  );
}
