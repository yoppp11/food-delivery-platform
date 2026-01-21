import { Badge } from '@/components/ui/badge';
import { cn } from '@/lib/utils';
import type { Role } from '@/types';
import { useTranslation } from 'react-i18next';

interface RoleBadgeProps {
  role: Role;
  className?: string;
}

export function RoleBadge({ role, className }: RoleBadgeProps) {
  const { t } = useTranslation();

  const roleConfig: Record<Role, { label: string; className: string }> = {
    ADMIN: {
      label: t('admin.role.admin'),
      className: 'bg-red-100 text-red-800 hover:bg-red-100',
    },
    MERCHANT: {
      label: t('admin.role.merchant'),
      className: 'bg-purple-100 text-purple-800 hover:bg-purple-100',
    },
    DRIVER: {
      label: t('admin.role.driver'),
      className: 'bg-blue-100 text-blue-800 hover:bg-blue-100',
    },
    CUSTOMER: {
      label: t('admin.role.customer'),
      className: 'bg-green-100 text-green-800 hover:bg-green-100',
    },
  };

  const config = roleConfig[role];

  return (
    <Badge variant="secondary" className={cn(config.className, className)}>
      {config.label}
    </Badge>
  );
}
