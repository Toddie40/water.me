import { Badge } from '@/app/components/ui/Badge';
import { TableRow, TableCell } from '@/app/components/ui/Table';
import type { LogEntry } from '@/app/types';

export interface LogRowProps {
  log: LogEntry;
}

function getMethodBadgeVariant(method: string): 'success' | 'info' | 'warning' | 'danger' | 'default' {
  switch (method.toUpperCase()) {
    case 'GET':
      return 'success';
    case 'POST':
      return 'info';
    case 'PUT':
      return 'warning';
    case 'DELETE':
      return 'danger';
    default:
      return 'default';
  }
}

function getStatusBadgeVariant(status: number): 'success' | 'warning' | 'danger' | 'default' {
  if (status >= 200 && status < 300) {
    return 'success';
  } else if (status >= 400 && status < 500) {
    return 'warning';
  } else if (status >= 500) {
    return 'danger';
  }
  return 'default';
}

function formatTimestamp(timestamp: string): string {
  const date = new Date(timestamp);
  return date.toLocaleString('en-US', {
    month: 'short',
    day: 'numeric',
    hour: '2-digit',
    minute: '2-digit',
    second: '2-digit',
  });
}

export function LogRow({ log }: LogRowProps) {
  return (
    <TableRow>
      <TableCell className="whitespace-nowrap">
        <span className="text-sm text-botanical-soil">
          {formatTimestamp(log.timestamp)}
        </span>
      </TableCell>
      <TableCell>
        <Badge variant={getMethodBadgeVariant(log.method)}>
          {log.method}
        </Badge>
      </TableCell>
      <TableCell className="font-mono text-sm">
        {log.endpoint}
      </TableCell>
      <TableCell>
        <Badge variant={getStatusBadgeVariant(log.response_status)}>
          {log.response_status}
        </Badge>
      </TableCell>
      <TableCell className="text-sm text-botanical-soil">
        {log.client_ip}
      </TableCell>
    </TableRow>
  );
}
