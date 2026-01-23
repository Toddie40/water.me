'use client';

import { Card, CardContent } from '@/app/components/ui/Card';
import { PlantCard } from './PlantCard';
import type { Plant } from '@/app/types';

export interface PlantGridProps {
  plants: Plant[];
  onEdit: (plant: Plant) => void;
  onDelete: (plantName: string) => Promise<void>;
  onAddNew: () => void;
}

export function PlantGrid({ plants, onEdit, onDelete, onAddNew }: PlantGridProps) {
  return (
    <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6">
      {/* Add new plant card */}
      <Card
        variant="interactive"
        className="min-h-[280px] flex items-center justify-center border-dashed border-2 border-botanical-stone bg-botanical-sand/50"
        onClick={onAddNew}
      >
        <CardContent className="flex flex-col items-center justify-center text-center">
          <div className="w-14 h-14 rounded-full bg-botanical-fern/10 flex items-center justify-center mb-3">
            <svg
              className="w-7 h-7 text-botanical-fern"
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
          <p className="font-medium text-botanical-bark">Add New Plant</p>
          <p className="text-sm text-botanical-soil mt-1">
            Create a new plant profile
          </p>
        </CardContent>
      </Card>

      {/* Plant cards */}
      {plants.map((plant) => (
        <PlantCard
          key={plant.name}
          plant={plant}
          onEdit={onEdit}
          onDelete={onDelete}
        />
      ))}
    </div>
  );
}
