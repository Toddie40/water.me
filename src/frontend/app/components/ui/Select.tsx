'use client';

import { forwardRef, type SelectHTMLAttributes } from 'react';
import { cn } from '@/app/lib/cn';

export interface SelectProps extends SelectHTMLAttributes<HTMLSelectElement> {
  label?: string;
  helperText?: string;
  error?: string;
}

const Select = forwardRef<HTMLSelectElement, SelectProps>(
  ({ className, label, helperText, error, id, children, ...props }, ref) => {
    const selectId = id || label?.toLowerCase().replace(/\s+/g, '-');

    return (
      <div className="w-full">
        {label && (
          <label
            htmlFor={selectId}
            className="block text-sm font-medium text-botanical-bark mb-1.5"
          >
            {label}
          </label>
        )}
        <div className="relative">
          <select
            ref={ref}
            id={selectId}
            className={cn(
              'w-full px-3 py-2 rounded-lg border bg-white text-botanical-bark appearance-none cursor-pointer',
              'focus:outline-none focus:ring-2 focus:ring-botanical-fern focus:border-transparent',
              'disabled:bg-botanical-sand disabled:cursor-not-allowed',
              error
                ? 'border-botanical-danger focus:ring-botanical-danger'
                : 'border-botanical-stone',
              className
            )}
            {...props}
          >
            {children}
          </select>
          {/* Dropdown arrow */}
          <div className="absolute inset-y-0 right-0 pr-3 flex items-center pointer-events-none">
            <svg
              className="w-4 h-4 text-botanical-soil"
              fill="none"
              stroke="currentColor"
              viewBox="0 0 24 24"
            >
              <path
                strokeLinecap="round"
                strokeLinejoin="round"
                strokeWidth={2}
                d="M19 9l-7 7-7-7"
              />
            </svg>
          </div>
        </div>
        {(helperText || error) && (
          <p
            className={cn(
              'mt-1.5 text-sm',
              error ? 'text-botanical-danger' : 'text-botanical-soil'
            )}
          >
            {error || helperText}
          </p>
        )}
      </div>
    );
  }
);

Select.displayName = 'Select';

export { Select };
