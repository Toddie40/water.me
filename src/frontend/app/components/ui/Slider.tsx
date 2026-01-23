'use client';

import { forwardRef, type InputHTMLAttributes } from 'react';
import { cn } from '@/app/lib/cn';

export interface SliderProps
  extends Omit<InputHTMLAttributes<HTMLInputElement>, 'type'> {
  label?: string;
  showValue?: boolean;
  min?: number;
  max?: number;
  step?: number;
}

const Slider = forwardRef<HTMLInputElement, SliderProps>(
  (
    {
      className,
      label,
      showValue = true,
      min = 0,
      max = 100,
      step = 1,
      value,
      id,
      ...props
    },
    ref
  ) => {
    const inputId = id || label?.toLowerCase().replace(/\s+/g, '-');
    const percentage = ((Number(value) - min) / (max - min)) * 100;

    return (
      <div className="w-full">
        {(label || showValue) && (
          <div className="flex items-center justify-between mb-2">
            {label && (
              <label
                htmlFor={inputId}
                className="text-sm font-medium text-botanical-bark"
              >
                {label}
              </label>
            )}
            {showValue && (
              <span className="text-sm font-medium text-botanical-soil">
                {value}%
              </span>
            )}
          </div>
        )}
        <div className="relative">
          <input
            ref={ref}
            id={inputId}
            type="range"
            min={min}
            max={max}
            step={step}
            value={value}
            className={cn(
              'w-full h-2 rounded-full appearance-none cursor-pointer',
              'bg-botanical-stone',
              '[&::-webkit-slider-thumb]:appearance-none',
              '[&::-webkit-slider-thumb]:w-5',
              '[&::-webkit-slider-thumb]:h-5',
              '[&::-webkit-slider-thumb]:rounded-full',
              '[&::-webkit-slider-thumb]:bg-botanical-fern',
              '[&::-webkit-slider-thumb]:cursor-pointer',
              '[&::-webkit-slider-thumb]:transition-transform',
              '[&::-webkit-slider-thumb]:hover:scale-110',
              '[&::-moz-range-thumb]:w-5',
              '[&::-moz-range-thumb]:h-5',
              '[&::-moz-range-thumb]:rounded-full',
              '[&::-moz-range-thumb]:bg-botanical-fern',
              '[&::-moz-range-thumb]:border-0',
              '[&::-moz-range-thumb]:cursor-pointer',
              className
            )}
            style={{
              background: `linear-gradient(to right, var(--color-botanical-fern) 0%, var(--color-botanical-fern) ${percentage}%, var(--color-botanical-stone) ${percentage}%, var(--color-botanical-stone) 100%)`,
            }}
            {...props}
          />
        </div>
        <div className="flex justify-between mt-1">
          <span className="text-xs text-botanical-soil">Dry</span>
          <span className="text-xs text-botanical-soil">Wet</span>
        </div>
      </div>
    );
  }
);

Slider.displayName = 'Slider';

export { Slider };
