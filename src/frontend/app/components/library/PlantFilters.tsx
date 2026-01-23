'use client';

import { SearchInput } from '@/app/components/ui/SearchInput';
import { Select } from '@/app/components/ui/Select';

export interface PlantFiltersProps {
  searchTerm: string;
  onSearchChange: (value: string) => void;
  sortBy: 'name' | 'threshold';
  onSortChange: (value: 'name' | 'threshold') => void;
}

export function PlantFilters({
  searchTerm,
  onSearchChange,
  sortBy,
  onSortChange,
}: PlantFiltersProps) {
  return (
    <div className="flex flex-col sm:flex-row gap-4">
      <div className="flex-1">
        <SearchInput
          placeholder="Search plants..."
          value={searchTerm}
          onChange={(e) => onSearchChange(e.target.value)}
          onClear={() => onSearchChange('')}
        />
      </div>
      <div className="w-full sm:w-48">
        <Select
          value={sortBy}
          onChange={(e) => onSortChange(e.target.value as 'name' | 'threshold')}
        >
          <option value="name">Sort by Name</option>
          <option value="threshold">Sort by Threshold</option>
        </Select>
      </div>
    </div>
  );
}
