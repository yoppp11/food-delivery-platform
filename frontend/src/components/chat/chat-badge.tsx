import { useUnreadMessageCount } from '@/hooks/use-chat';
import { Badge } from '@/components/ui/badge';
import { cn } from '@/lib/utils';

interface ChatBadgeProps {
  className?: string;
}

export function ChatBadge({ className }: ChatBadgeProps) {
  const { data } = useUnreadMessageCount();
  const count = data?.count ?? 0;

  if (count === 0) return null;

  return (
    <Badge
      variant="destructive"
      className={cn(
        'h-5 min-w-5 px-1 text-xs font-medium rounded-full',
        className
      )}
    >
      {count > 99 ? '99+' : count}
    </Badge>
  );
}
