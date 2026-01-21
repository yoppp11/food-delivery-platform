import { Badge } from '@/components/ui/badge';
import { cn } from '@/lib/utils';
import type { PaymentStatus } from '@/types';
import { useTranslation } from 'react-i18next';

interface PaymentStatusBadgeProps {
  status: PaymentStatus;
  className?: string;
}

export function PaymentStatusBadge({ status, className }: PaymentStatusBadgeProps) {
  const { t } = useTranslation();

  const statusConfig: Record<PaymentStatus, { label: string; className: string }> = {
    PENDING: {
      label: t('admin.paymentStatus.pending'),
      className: 'bg-blue-100 text-blue-800 hover:bg-blue-100',
    },
    SUCCESS: {
      label: t('admin.paymentStatus.success'),
      className: 'bg-green-100 text-green-800 hover:bg-green-100',
    },
    FAILED: {
      label: t('admin.paymentStatus.failed'),
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
