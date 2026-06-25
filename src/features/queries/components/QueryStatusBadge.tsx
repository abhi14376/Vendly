import { Badge } from '@/components/ui/Badge';
import { QueryStatus } from '../types';

interface QueryStatusBadgeProps {
  status: QueryStatus;
}

export function QueryStatusBadge({ status }: QueryStatusBadgeProps) {
  const config = {
    open: { label: 'Open', variant: 'info' as const },
    in_review: { label: 'In Review', variant: 'warning' as const },
    answered: { label: 'Answered', variant: 'success' as const },
    closed: { label: 'Closed', variant: 'default' as const },
  };

  const { label, variant } = config[status] || config.open;

  return <Badge variant={variant}>{label}</Badge>;
}
