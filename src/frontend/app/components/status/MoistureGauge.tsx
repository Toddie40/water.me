'use client';

import { cn } from '@/app/lib/cn';

export interface MoistureGaugeProps {
  moisture: number | null;
  threshold: number | null;
  size?: 'sm' | 'md' | 'lg';
  showLabels?: boolean;
}

function getMoistureColor(moisture: number, threshold: number): string {
  const diff = moisture - threshold;

  if (moisture < threshold * 0.5) {
    return 'bg-botanical-danger'; // Critical - very dry
  } else if (moisture < threshold) {
    return 'bg-botanical-warning'; // Needs water
  } else if (moisture <= threshold * 1.3) {
    return 'bg-botanical-success'; // Good
  } else {
    return 'bg-botanical-water'; // Very wet
  }
}

function getMoistureStatus(moisture: number, threshold: number): string {
  if (moisture < threshold * 0.5) {
    return 'Critical';
  } else if (moisture < threshold) {
    return 'Needs water';
  } else if (moisture <= threshold * 1.3) {
    return 'Healthy';
  } else {
    return 'Very wet';
  }
}

export function MoistureGauge({
  moisture,
  threshold,
  size = 'md',
  showLabels = true,
}: MoistureGaugeProps) {
  const hasData = moisture !== null && threshold !== null;
  const moistureValue = moisture ?? 0;
  const thresholdValue = threshold ?? 50;

  const sizes = {
    sm: { height: 'h-2', text: 'text-xs' },
    md: { height: 'h-3', text: 'text-sm' },
    lg: { height: 'h-4', text: 'text-base' },
  };

  const moistureColor = hasData
    ? getMoistureColor(moistureValue, thresholdValue)
    : 'bg-botanical-stone';

  const status = hasData
    ? getMoistureStatus(moistureValue, thresholdValue)
    : 'No data';

  return (
    <div className="w-full">
      {showLabels && (
        <div className="flex items-center justify-between mb-1.5">
          <span className={cn('font-medium text-botanical-bark', sizes[size].text)}>
            Moisture
          </span>
          <span className={cn('text-botanical-soil', sizes[size].text)}>
            {hasData ? `${moistureValue.toFixed(0)}%` : '--'}
          </span>
        </div>
      )}

      {/* Progress bar container */}
      <div className={cn('w-full bg-botanical-stone rounded-full relative', sizes[size].height)}>
        {/* Moisture level fill */}
        <div
          className={cn(
            'rounded-full transition-all duration-500 ease-out',
            sizes[size].height,
            moistureColor
          )}
          style={{ width: hasData ? `${Math.min(moistureValue, 100)}%` : '0%' }}
        />

        {/* Threshold marker */}
        {hasData && (
          <div
            className="absolute top-0 bottom-0 w-0.5 bg-botanical-bark"
            style={{ left: `${Math.min(thresholdValue, 100)}%` }}
            title={`Threshold: ${thresholdValue}%`}
          >
            <div className="absolute -top-1 left-1/2 -translate-x-1/2 w-0 h-0 border-l-[4px] border-l-transparent border-r-[4px] border-r-transparent border-t-[5px] border-t-botanical-bark" />
          </div>
        )}
      </div>

      {showLabels && (
        <div className="flex items-center justify-between mt-1.5">
          <span className={cn('text-botanical-soil', sizes[size].text)}>
            {status}
          </span>
          {hasData && (
            <span className={cn('text-botanical-soil', sizes[size].text)}>
              Target: {thresholdValue}%
            </span>
          )}
        </div>
      )}
    </div>
  );
}
