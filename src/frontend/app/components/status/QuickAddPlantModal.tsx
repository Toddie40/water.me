'use client';

import { useState } from 'react';
import { Modal } from '@/app/components/ui/Modal';
import { Button } from '@/app/components/ui/Button';
import { Input } from '@/app/components/ui/Input';
import { Slider } from '@/app/components/ui/Slider';

export interface QuickAddPlantModalProps {
  isOpen: boolean;
  onClose: () => void;
  slotNumber: number;
  onAdd: (data: { name: string; description: string; moisture_threshold: number }) => Promise<void>;
}

export function QuickAddPlantModal({
  isOpen,
  onClose,
  slotNumber,
  onAdd,
}: QuickAddPlantModalProps) {
  const [name, setName] = useState('');
  const [description, setDescription] = useState('');
  const [moistureThreshold, setMoistureThreshold] = useState(50);
  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();

    if (!name.trim()) {
      setError('Plant name is required');
      return;
    }

    setIsLoading(true);
    setError(null);

    try {
      await onAdd({
        name: name.trim(),
        description: description.trim(),
        moisture_threshold: moistureThreshold,
      });
      handleClose();
    } catch (err) {
      setError(err instanceof Error ? err.message : 'Failed to add plant');
    } finally {
      setIsLoading(false);
    }
  };

  const handleClose = () => {
    setName('');
    setDescription('');
    setMoistureThreshold(50);
    setError(null);
    onClose();
  };

  return (
    <Modal
      isOpen={isOpen}
      onClose={handleClose}
      title={`Add Plant to Slot ${slotNumber}`}
      size="md"
    >
      <form onSubmit={handleSubmit} className="space-y-4">
        {error && (
          <div className="p-3 rounded-lg bg-botanical-danger/10 text-botanical-danger text-sm">
            {error}
          </div>
        )}

        <Input
          label="Plant Name"
          placeholder="e.g., Monstera"
          value={name}
          onChange={(e) => setName(e.target.value)}
          required
        />

        <Input
          label="Description"
          placeholder="e.g., Large tropical plant"
          value={description}
          onChange={(e) => setDescription(e.target.value)}
        />

        <Slider
          label="Moisture Threshold"
          value={moistureThreshold}
          onChange={(e) => setMoistureThreshold(Number(e.target.value))}
          min={0}
          max={100}
          step={1}
        />

        <p className="text-xs text-botanical-soil">
          You can add an image later from the Library page.
        </p>

        <div className="flex justify-end gap-2 pt-2">
          <Button
            type="button"
            variant="ghost"
            onClick={handleClose}
            disabled={isLoading}
          >
            Cancel
          </Button>
          <Button type="submit" variant="primary" isLoading={isLoading}>
            Add & Assign
          </Button>
        </div>
      </form>
    </Modal>
  );
}
