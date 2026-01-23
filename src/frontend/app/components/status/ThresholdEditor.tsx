'use client';

import { useState } from 'react';
import { Button } from '@/app/components/ui/Button';
import { Slider } from '@/app/components/ui/Slider';

export interface ThresholdEditorProps {
  plantName: string;
  currentThreshold: number;
  onSave: (threshold: number) => Promise<void>;
  onCancel: () => void;
}

export function ThresholdEditor({
  plantName,
  currentThreshold,
  onSave,
  onCancel,
}: ThresholdEditorProps) {
  const [threshold, setThreshold] = useState(currentThreshold);
  const [isSaving, setIsSaving] = useState(false);

  const handleSave = async () => {
    setIsSaving(true);
    try {
      await onSave(threshold);
    } finally {
      setIsSaving(false);
    }
  };

  return (
    <div className="space-y-4">
      <p className="text-sm text-botanical-soil">
        Set moisture threshold for <span className="font-medium text-botanical-bark">{plantName}</span>
      </p>

      <Slider
        value={threshold}
        onChange={(e) => setThreshold(Number(e.target.value))}
        min={0}
        max={100}
        step={1}
        label="Moisture Threshold"
      />

      <div className="flex justify-end gap-2">
        <Button
          variant="ghost"
          size="sm"
          onClick={onCancel}
          disabled={isSaving}
        >
          Cancel
        </Button>
        <Button
          variant="primary"
          size="sm"
          onClick={handleSave}
          isLoading={isSaving}
        >
          Save
        </Button>
      </div>
    </div>
  );
}
