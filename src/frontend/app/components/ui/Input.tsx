'use client';

import { forwardRef, type InputHTMLAttributes } from 'react';
import { cn } from '@/app/lib/cn';

export interface InputProps extends InputHTMLAttributes<HTMLInputElement> {
  label?: string;
  helperText?: string;
  error?: string;
}

const Input = forwardRef<HTMLInputElement, InputProps>(
  ({ className, label, helperText, error, id, ...props }, ref) => {
    const inputId = id || label?.toLowerCase().replace(/\s+/g, '-');

    return (
      <div className="w-full">
        {label && (
          <label
            htmlFor={inputId}
            className="block text-sm font-medium text-botanical-bark mb-1.5"
          >
            {label}
          </label>
        )}
        <input
          ref={ref}
          id={inputId}
          className={cn(
            'w-full px-3 py-2 rounded-lg border bg-white text-botanical-bark placeholder:text-botanical-soil/60',
            'focus:outline-none focus:ring-2 focus:ring-botanical-fern focus:border-transparent',
            'disabled:bg-botanical-sand disabled:cursor-not-allowed',
            error
              ? 'border-botanical-danger focus:ring-botanical-danger'
              : 'border-botanical-stone',
            className
          )}
          {...props}
        />
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

Input.displayName = 'Input';

export { Input };
