'use client';

import { Modal } from '@/app/components/ui/Modal';
import { PlantForm } from '@/app/components/forms/PlantForm';

export interface AddPlantModalProps {
  isOpen: boolean;
  onClose: () => void;
  onSubmit: (formData: FormData) => Promise<void>;
}

export function AddPlantModal({
  isOpen,
  onClose,
  onSubmit,
}: AddPlantModalProps) {
  const handleSubmit = async (formData: FormData) => {
    await onSubmit(formData);
    onClose();
  };

  return (
    <Modal
      isOpen={isOpen}
      onClose={onClose}
      title="Add New Plant"
      size="md"
    >
      <PlantForm
        onSubmit={handleSubmit}
        onCancel={onClose}
        submitLabel="Add Plant"
      />
    </Modal>
  );
}
