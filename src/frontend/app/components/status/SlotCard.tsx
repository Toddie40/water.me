'use client';

import { useState } from 'react';
import { Card, CardContent } from '@/app/components/ui/Card';
import { Button } from '@/app/components/ui/Button';
import { MoistureGauge } from './MoistureGauge';
import { ThresholdEditor } from './ThresholdEditor';
import { PlantSwapModal } from './PlantSwapModal';
import { QuickAddPlantModal } from './QuickAddPlantModal';
import type { SlotStatus, Plant } from '@/app/types';
import {
  assignPlantToSlot,
  clearSlot,
  createAndAssignPlant,
  updatePlantThreshold,
} from '@/app/actions/status';

export interface SlotCardProps {
  slot: SlotStatus;
  plants: Plant[];
}

export function SlotCard({ slot, plants }: SlotCardProps) {
  const [isEditingThreshold, setIsEditingThreshold] = useState(false);
  const [isSwapModalOpen, setIsSwapModalOpen] = useState(false);
  const [isAddModalOpen, setIsAddModalOpen] = useState(false);

  const hasPlant = slot.plant_name !== null;

  const handleSaveThreshold = async (threshold: number) => {
    if (!slot.plant_name) return;
    await updatePlantThreshold(slot.plant_name, threshold);
    setIsEditingThreshold(false);
  };

  const handleSwapPlant = async (plantName: string) => {
    await assignPlantToSlot(slot.slot, plantName);
  };

  const handleClearSlot = async () => {
    await clearSlot(slot.slot);
  };

  const handleQuickAdd = async (data: {
    name: string;
    description: string;
    moisture_threshold: number;
  }) => {
    await createAndAssignPlant(slot.slot, data);
  };

  // Empty slot card
  if (!hasPlant) {
    return (
      <>
        <Card
          variant="interactive"
          className="h-full min-h-[280px] flex flex-col items-center justify-center border-dashed border-2 border-botanical-stone bg-botanical-sand/50"
          onClick={() => setIsSwapModalOpen(true)}
        >
          <CardContent className="flex flex-col items-center justify-center text-center py-8">
            <div className="w-16 h-16 rounded-full bg-botanical-stone/50 flex items-center justify-center mb-4">
              <svg
                className="w-8 h-8 text-botanical-soil"
                fill="none"
                stroke="currentColor"
                viewBox="0 0 24 24"
              >
                <path
                  strokeLinecap="round"
                  strokeLinejoin="round"
                  strokeWidth={2}
                  d="M12 6v6m0 0v6m0-6h6m-6 0H6"
                />
              </svg>
            </div>
            <p className="text-lg font-medium text-botanical-bark mb-1">
              Slot {slot.slot}
            </p>
            <p className="text-sm text-botanical-soil mb-4">Empty</p>
            <div className="flex gap-2">
              <Button
                variant="secondary"
                size="sm"
                onClick={(e) => {
                  e.stopPropagation();
                  setIsSwapModalOpen(true);
                }}
              >
                Select Plant
              </Button>
              <Button
                variant="primary"
                size="sm"
                onClick={(e) => {
                  e.stopPropagation();
                  setIsAddModalOpen(true);
                }}
              >
                New Plant
              </Button>
            </div>
          </CardContent>
        </Card>

        <PlantSwapModal
          isOpen={isSwapModalOpen}
          onClose={() => setIsSwapModalOpen(false)}
          slotNumber={slot.slot}
          plants={plants}
          currentPlantName={null}
          onSwap={handleSwapPlant}
          onClear={handleClearSlot}
        />

        <QuickAddPlantModal
          isOpen={isAddModalOpen}
          onClose={() => setIsAddModalOpen(false)}
          slotNumber={slot.slot}
          onAdd={handleQuickAdd}
        />
      </>
    );
  }

  // Filled slot card
  return (
    <>
      <Card className="h-full min-h-[280px] flex flex-col">
        {/* Plant image header */}
        <div className="relative h-32 bg-botanical-stone rounded-t-xl overflow-hidden">
          {slot.image_link ? (
            <img
              src={`/api/plant-image?plantName=${encodeURIComponent(slot.plant_name!)}`}
              alt={slot.plant_name!}
              className="w-full h-full object-cover"
            />
          ) : (
            <div className="w-full h-full flex items-center justify-center">
              <svg
                className="w-12 h-12 text-botanical-soil/50"
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
          <div className="absolute top-2 left-2 px-2 py-1 bg-botanical-forest/80 text-botanical-cream text-xs font-medium rounded">
            Slot {slot.slot}
          </div>
        </div>

        <CardContent className="flex-1 flex flex-col">
          {/* Plant info */}
          <div className="mb-4">
            <h3 className="text-lg font-semibold text-botanical-bark truncate">
              {slot.plant_name}
            </h3>
            {slot.description && (
              <p className="text-sm text-botanical-soil line-clamp-2">
                {slot.description}
              </p>
            )}
          </div>

          {/* Moisture gauge or threshold editor */}
          <div className="flex-1 mb-4">
            {isEditingThreshold ? (
              <ThresholdEditor
                plantName={slot.plant_name!}
                currentThreshold={slot.moisture_threshold ?? 50}
                onSave={handleSaveThreshold}
                onCancel={() => setIsEditingThreshold(false)}
              />
            ) : (
              <div
                className="cursor-pointer hover:opacity-80 transition-opacity"
                onClick={() => setIsEditingThreshold(true)}
                title="Click to edit threshold"
              >
                <MoistureGauge
                  moisture={slot.moisture}
                  threshold={slot.moisture_threshold}
                  size="md"
                />
              </div>
            )}
          </div>

          {/* Last watered */}
          {slot.last_watered && (
            <p className="text-xs text-botanical-soil mb-3">
              Last watered: {new Date(slot.last_watered).toLocaleDateString()}
            </p>
          )}

          {/* Actions */}
          {!isEditingThreshold && (
            <div className="flex gap-2">
              <Button
                variant="secondary"
                size="sm"
                className="flex-1"
                onClick={() => setIsSwapModalOpen(true)}
              >
                <svg
                  className="w-4 h-4"
                  fill="none"
                  stroke="currentColor"
                  viewBox="0 0 24 24"
                >
                  <path
                    strokeLinecap="round"
                    strokeLinejoin="round"
                    strokeWidth={2}
                    d="M8 7h12m0 0l-4-4m4 4l-4 4m0 6H4m0 0l4 4m-4-4l4-4"
                  />
                </svg>
                Swap
              </Button>
              <Button
                variant="ghost"
                size="sm"
                onClick={() => setIsEditingThreshold(true)}
                title="Edit threshold"
              >
                <svg
                  className="w-4 h-4"
                  fill="none"
                  stroke="currentColor"
                  viewBox="0 0 24 24"
                >
                  <path
                    strokeLinecap="round"
                    strokeLinejoin="round"
                    strokeWidth={2}
                    d="M11 5H6a2 2 0 00-2 2v11a2 2 0 002 2h11a2 2 0 002-2v-5m-1.414-9.414a2 2 0 112.828 2.828L11.828 15H9v-2.828l8.586-8.586z"
                  />
                </svg>
              </Button>
            </div>
          )}
        </CardContent>
      </Card>

      <PlantSwapModal
        isOpen={isSwapModalOpen}
        onClose={() => setIsSwapModalOpen(false)}
        slotNumber={slot.slot}
        plants={plants}
        currentPlantName={slot.plant_name}
        onSwap={handleSwapPlant}
        onClear={handleClearSlot}
      />
    </>
  );
}
