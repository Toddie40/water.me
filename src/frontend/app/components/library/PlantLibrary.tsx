'use client';

import { useState, useMemo } from 'react';
import { PageHeader } from '@/app/components/layout/PageHeader';
import { PlantFilters } from './PlantFilters';
import { PlantGrid } from './PlantGrid';
import { PlantEditForm } from './PlantEditForm';
import { AddPlantModal } from './AddPlantModal';
import { createPlant, updatePlant, deletePlant } from '@/app/actions/plants';
import type { Plant } from '@/app/types';

export interface PlantLibraryProps {
  initialPlants: Plant[];
}

export function PlantLibrary({ initialPlants }: PlantLibraryProps) {
  const [searchTerm, setSearchTerm] = useState('');
  const [sortBy, setSortBy] = useState<'name' | 'threshold'>('name');
  const [editingPlant, setEditingPlant] = useState<Plant | null>(null);
  const [isAddModalOpen, setIsAddModalOpen] = useState(false);

  const filteredAndSortedPlants = useMemo(() => {
    let result = [...initialPlants];

    // Filter
    if (searchTerm) {
      const term = searchTerm.toLowerCase();
      result = result.filter(
        (plant) =>
          plant.name.toLowerCase().includes(term) ||
          plant.description.toLowerCase().includes(term)
      );
    }

    // Sort
    result.sort((a, b) => {
      if (sortBy === 'name') {
        return a.name.localeCompare(b.name);
      } else {
        return b.moisture_threshold - a.moisture_threshold;
      }
    });

    return result;
  }, [initialPlants, searchTerm, sortBy]);

  const handleEdit = (plant: Plant) => {
    setEditingPlant(plant);
  };

  const handleEditSubmit = async (plantName: string, formData: FormData) => {
    await updatePlant(plantName, formData);
  };

  const handleDelete = async (plantName: string) => {
    await deletePlant(plantName);
  };

  const handleAddSubmit = async (formData: FormData) => {
    await createPlant(formData);
  };

  return (
    <div>
      <PageHeader
        title="Plant Library"
        subtitle="Manage your plant collection"
      />

      <div className="mb-6">
        <PlantFilters
          searchTerm={searchTerm}
          onSearchChange={setSearchTerm}
          sortBy={sortBy}
          onSortChange={setSortBy}
        />
      </div>

      <PlantGrid
        plants={filteredAndSortedPlants}
        onEdit={handleEdit}
        onDelete={handleDelete}
        onAddNew={() => setIsAddModalOpen(true)}
      />

      {filteredAndSortedPlants.length === 0 && searchTerm && (
        <div className="text-center py-12">
          <p className="text-botanical-soil">
            No plants found matching "{searchTerm}"
          </p>
        </div>
      )}

      <PlantEditForm
        isOpen={editingPlant !== null}
        onClose={() => setEditingPlant(null)}
        plant={editingPlant}
        onSubmit={handleEditSubmit}
      />

      <AddPlantModal
        isOpen={isAddModalOpen}
        onClose={() => setIsAddModalOpen(false)}
        onSubmit={handleAddSubmit}
      />
    </div>
  );
}
