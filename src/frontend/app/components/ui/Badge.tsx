import { type HTMLAttributes } from 'react';
import { cn } from '@/app/lib/cn';

export interface BadgeProps extends HTMLAttributes<HTMLSpanElement> {
  variant?: 'default' | 'success' | 'warning' | 'danger' | 'info';
}

function Badge({ className, variant = 'default', ...props }: BadgeProps) {
  const variants = {
    default: 'bg-botanical-stone text-botanical-bark',
    success: 'bg-botanical-success/20 text-botanical-forest',
    warning: 'bg-botanical-warning/20 text-botanical-bark',
    danger: 'bg-botanical-danger/20 text-botanical-danger',
    info: 'bg-botanical-water/20 text-botanical-forest',
  };

  return (
    <span
      className={cn(
        'inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium',
        variants[variant],
        className
      )}
      {...props}
    />
  );
}

export { Badge };
