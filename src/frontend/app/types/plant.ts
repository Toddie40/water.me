export interface Plant {
  name: string;
  description: string;
  moisture_threshold: number;
  image: string | null;
}

export interface PlantsList {
  plants: Plant[];
}

export interface PlantFormData {
  name: string;
  description: string;
  moisture_threshold: number;
  image?: File | null;
}
