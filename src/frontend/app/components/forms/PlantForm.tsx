'use client';

import { useState } from 'react';
import { Input } from '@/app/components/ui/Input';
import { Slider } from '@/app/components/ui/Slider';
import { Button } from '@/app/components/ui/Button';
import { ImageUpload } from './ImageUpload';
import type { Plant } from '@/app/types';

export interface PlantFormProps {
  initialData?: Partial<Plant>;
  currentImageUrl?: string | null;
  onSubmit: (formData: FormData) => Promise<void>;
  onCancel?: () => void;
  submitLabel?: string;
  isLoading?: boolean;
}

export function PlantForm({
  initialData,
  currentImageUrl,
  onSubmit,
  onCancel,
  submitLabel = 'Save',
  isLoading = false,
}: PlantFormProps) {
  const [name, setName] = useState(initialData?.name || '');
  const [description, setDescription] = useState(initialData?.description || '');
  const [moistureThreshold, setMoistureThreshold] = useState(
    initialData?.moisture_threshold || 50
  );
  const [image, setImage] = useState<File | null>(null);
  const [removeImage, setRemoveImage] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [isSubmitting, setIsSubmitting] = useState(false);

  const isEditMode = Boolean(initialData?.name);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();

    if (!name.trim()) {
      setError('Plant name is required');
      return;
    }

    setError(null);
    setIsSubmitting(true);

    try {
      const formData = new FormData();
      formData.append('name', name.trim());
      formData.append('description', description.trim());
      formData.append('moisture_threshold', moistureThreshold.toString());
      if (image) {
        formData.append('image', image);
      } else if (removeImage) {
        formData.append('remove_image', 'true');
      }

      await onSubmit(formData);
    } catch (err) {
      setError(err instanceof Error ? err.message : 'An error occurred');
    } finally {
      setIsSubmitting(false);
    }
  };

  const loading = isLoading || isSubmitting;

  return (
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
        disabled={isEditMode}
        required
      />

      <Input
        label="Description"
        placeholder="e.g., Large tropical plant with split leaves"
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

      <ImageUpload
        value={image}
        onChange={(file, wasCleared) => {
          setImage(file);
          setRemoveImage(wasCleared ?? false);
        }}
        currentImageUrl={currentImageUrl}
      />

      <div className="flex justify-end gap-2 pt-2">
        {onCancel && (
          <Button
            type="button"
            variant="ghost"
            onClick={onCancel}
            disabled={loading}
          >
            Cancel
          </Button>
        )}
        <Button type="submit" variant="primary" isLoading={loading}>
          {submitLabel}
        </Button>
      </div>
    </form>
  );
}
