'use server';

import { revalidatePath } from 'next/cache';
import { statusApi, plantsApi } from '@/app/lib/api';

export async function assignPlantToSlot(slot: number, plantName: string) {
  await statusApi.assignPlant(slot, plantName);
  revalidatePath('/');
}

export async function clearSlot(slot: number) {
  await statusApi.clearSlot(slot);
  revalidatePath('/');
}

export async function createAndAssignPlant(
  slot: number,
  data: { name: string; description: string; moisture_threshold: number }
) {
  const formData = new FormData();
  formData.append('name', data.name);
  formData.append('description', data.description);
  formData.append('moisture_threshold', data.moisture_threshold.toString());

  await plantsApi.create(formData);
  await statusApi.assignPlant(slot, data.name);
  revalidatePath('/');
  revalidatePath('/library');
}

export async function updatePlantThreshold(plantName: string, threshold: number) {
  const formData = new FormData();
  formData.append('moisture_threshold', threshold.toString());
  await plantsApi.update(plantName, formData);
  revalidatePath('/');
}
