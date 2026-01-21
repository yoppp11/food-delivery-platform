import { Badge } from '@/components/ui/badge';
import { cn } from '@/lib/utils';
import type { UserStatus } from '@/types';
import { useTranslation } from 'react-i18next';

interface UserStatusBadgeProps {
  status: UserStatus;
  className?: string;
}

export function UserStatusBadge({ status, className }: UserStatusBadgeProps) {
  const { t } = useTranslation();

  const statusConfig: Record<UserStatus, { label: string; className: string }> = {
    ACTIVE: {
      label: t('admin.status.active'),
      className: 'bg-green-100 text-green-800 hover:bg-green-100',
    },
    SUSPENDED: {
      label: t('admin.status.suspended'),
      className: 'bg-yellow-100 text-yellow-800 hover:bg-yellow-100',
    },
    DELETED: {
      label: t('admin.status.deleted'),
      className: 'bg-red-100 text-red-800 hover:bg-red-100',
    },
  };

  const config = statusConfig[status];

  return (
    <Badge variant="secondary" className={cn(config.className, className)}>
      {config.label}
    </Badge>
  );
}
