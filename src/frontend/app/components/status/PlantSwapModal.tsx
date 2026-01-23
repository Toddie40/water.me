'use client';

import { useState } from 'react';
import { Modal } from '@/app/components/ui/Modal';
import { Button } from '@/app/components/ui/Button';
import { SearchInput } from '@/app/components/ui/SearchInput';
import type { Plant } from '@/app/types';

export interface PlantSwapModalProps {
  isOpen: boolean;
  onClose: () => void;
  slotNumber: number;
  plants: Plant[];
  currentPlantName: string | null;
  onSwap: (plantName: string) => Promise<void>;
  onClear: () => Promise<void>;
}

export function PlantSwapModal({
  isOpen,
  onClose,
  slotNumber,
  plants,
  currentPlantName,
  onSwap,
  onClear,
}: PlantSwapModalProps) {
  const [searchTerm, setSearchTerm] = useState('');
  const [isLoading, setIsLoading] = useState(false);
  const [selectedPlant, setSelectedPlant] = useState<string | null>(null);

  const filteredPlants = plants.filter((plant) =>
    plant.name.toLowerCase().includes(searchTerm.toLowerCase())
  );

  const handleSwap = async () => {
    if (!selectedPlant) return;
    setIsLoading(true);
    try {
      await onSwap(selectedPlant);
      onClose();
    } finally {
      setIsLoading(false);
    }
  };

  const handleClear = async () => {
    setIsLoading(true);
    try {
      await onClear();
      onClose();
    } finally {
      setIsLoading(false);
    }
  };

  const handleClose = () => {
    setSearchTerm('');
    setSelectedPlant(null);
    onClose();
  };

  return (
    <Modal
      isOpen={isOpen}
      onClose={handleClose}
      title={`Slot ${slotNumber} - Select Plant`}
      size="md"
      footer={
        <>
          {currentPlantName && (
            <Button
              variant="danger"
              onClick={handleClear}
              isLoading={isLoading}
            >
              Clear Slot
            </Button>
          )}
          <Button variant="ghost" onClick={handleClose} disabled={isLoading}>
            Cancel
          </Button>
          <Button
            variant="primary"
            onClick={handleSwap}
            disabled={!selectedPlant || selectedPlant === currentPlantName}
            isLoading={isLoading}
          >
            Assign Plant
          </Button>
        </>
      }
    >
      <div className="space-y-4">
        <SearchInput
          placeholder="Search plants..."
          value={searchTerm}
          onChange={(e) => setSearchTerm(e.target.value)}
          onClear={() => setSearchTerm('')}
        />

        <div className="max-h-64 overflow-y-auto space-y-2">
          {filteredPlants.length === 0 ? (
            <p className="text-center text-botanical-soil py-4">
              No plants found
            </p>
          ) : (
            filteredPlants.map((plant) => (
              <button
                key={plant.name}
                type="button"
                onClick={() => setSelectedPlant(plant.name)}
                className={`w-full p-3 rounded-lg border text-left transition-colors ${
                  selectedPlant === plant.name
                    ? 'border-botanical-fern bg-botanical-fern/10'
                    : plant.name === currentPlantName
                    ? 'border-botanical-stone bg-botanical-stone/50 opacity-60'
                    : 'border-botanical-stone hover:border-botanical-moss hover:bg-botanical-sand'
                }`}
                disabled={plant.name === currentPlantName}
              >
                <div className="flex items-center gap-3">
                  {plant.image ? (
                    <img
                      src={`/api/plant-image?plantName=${encodeURIComponent(plant.name)}`}
                      alt={plant.name}
                      className="w-10 h-10 rounded-lg object-cover"
                    />
                  ) : (
                    <div className="w-10 h-10 rounded-lg bg-botanical-stone flex items-center justify-center">
                      <svg
                        className="w-5 h-5 text-botanical-soil"
                        fill="none"
                        stroke="currentColor"
                        viewBox="0 0 24 24"
                      >
                        <path
                          strokeLinecap="round"
                          strokeLinejoin="round"
                          strokeWidth={2}
                          d="M12 6.253v13m0-13C10.832 5.477 9.246 5 7.5 5S4.168 5.477 3 6.253v13C4.168 18.477 5.754 18 7.5 18s3.332.477 4.5 1.253m0-13C13.168 5.477 14.754 5 16.5 5c1.747 0 3.332.477 4.5 1.253v13C19.832 18.477 18.247 18 16.5 18c-1.746 0-3.332.477-4.5 1.253"
                        />
                      </svg>
                    </div>
                  )}
                  <div className="flex-1 min-w-0">
                    <p className="font-medium text-botanical-bark truncate">
                      {plant.name}
                      {plant.name === currentPlantName && (
                        <span className="ml-2 text-xs text-botanical-soil">(current)</span>
                      )}
                    </p>
                    <p className="text-sm text-botanical-soil">
                      Threshold: {plant.moisture_threshold}%
                    </p>
                  </div>
                  {selectedPlant === plant.name && (
                    <svg
                      className="w-5 h-5 text-botanical-fern flex-shrink-0"
                      fill="currentColor"
                      viewBox="0 0 20 20"
                    >
                      <path
                        fillRule="evenodd"
                        d="M16.707 5.293a1 1 0 010 1.414l-8 8a1 1 0 01-1.414 0l-4-4a1 1 0 011.414-1.414L8 12.586l7.293-7.293a1 1 0 011.414 0z"
                        clipRule="evenodd"
                      />
                    </svg>
                  )}
                </div>
              </button>
            ))
          )}
        </div>
      </div>
    </Modal>
  );
}
