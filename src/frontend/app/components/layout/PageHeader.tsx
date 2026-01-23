import { type ReactNode } from 'react';
import { cn } from '@/app/lib/cn';

export interface PageHeaderProps {
  title: string;
  subtitle?: string;
  action?: ReactNode;
  className?: string;
}

export function PageHeader({
  title,
  subtitle,
  action,
  className,
}: PageHeaderProps) {
  return (
    <div
      className={cn(
        'flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4 mb-8',
        className
      )}
    >
      <div>
        <h1 className="text-2xl sm:text-3xl font-bold text-botanical-forest">
          {title}
        </h1>
        {subtitle && (
          <p className="text-botanical-soil mt-1">{subtitle}</p>
        )}
      </div>
      {action && <div>{action}</div>}
    </div>
  );
}
