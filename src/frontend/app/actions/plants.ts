'use server';

import { revalidatePath } from 'next/cache';
import { plantsApi } from '@/app/lib/api';

export async function createPlant(formData: FormData) {
  await plantsApi.create(formData);
  revalidatePath('/library');
}

export async function updatePlant(plantName: string, formData: FormData) {
  await plantsApi.update(plantName, formData);
  revalidatePath('/library');
  revalidatePath('/');
}

export async function deletePlant(plantName: string) {
  await plantsApi.delete(plantName);
  revalidatePath('/library');
  revalidatePath('/');
}
