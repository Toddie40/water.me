'use client';

import { Modal } from '@/app/components/ui/Modal';
import { PlantForm } from '@/app/components/forms/PlantForm';
import type { Plant } from '@/app/types';

export interface PlantEditFormProps {
  isOpen: boolean;
  onClose: () => void;
  plant: Plant | null;
  onSubmit: (plantName: string, formData: FormData) => Promise<void>;
}

export function PlantEditForm({
  isOpen,
  onClose,
  plant,
  onSubmit,
}: PlantEditFormProps) {
  if (!plant) return null;

  const handleSubmit = async (formData: FormData) => {
    await onSubmit(plant.name, formData);
    onClose();
  };

  const currentImageUrl = plant.image
    ? `/api/plant-image?plantName=${encodeURIComponent(plant.name)}`
    : null;

  return (
    <Modal
      isOpen={isOpen}
      onClose={onClose}
      title={`Edit ${plant.name}`}
      size="md"
    >
      <PlantForm
        initialData={plant}
        currentImageUrl={currentImageUrl}
        onSubmit={handleSubmit}
        onCancel={onClose}
        submitLabel="Save Changes"
      />
    </Modal>
  );
}
