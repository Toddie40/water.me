import axios from 'axios';
import type { Plant, PlantsList, StatusResponse, SlotStatus, LogsResponse } from '@/app/types';

const api = axios.create({
  baseURL: process.env.API_ENDPOINT || 'http://localhost:8000',
  headers: {
    Accept: 'application/json',
  },
});

// Status API
export const statusApi = {
  getAll: async (): Promise<StatusResponse> => {
    const response = await api.get<StatusResponse>('/status');
    return response.data;
  },

  getSlot: async (slot: number): Promise<SlotStatus> => {
    const response = await api.get<SlotStatus>(`/status/${slot}`);
    return response.data;
  },

  assignPlant: async (slot: number, plantName: string): Promise<{ message: string }> => {
    const response = await api.put<{ message: string }>(`/status/${slot}/${encodeURIComponent(plantName)}`);
    return response.data;
  },

  clearSlot: async (slot: number): Promise<{ message: string }> => {
    const response = await api.delete<{ message: string }>(`/status/${slot}`);
    return response.data;
  },
};

// Plants API
export const plantsApi = {
  getAll: async (): Promise<PlantsList> => {
    const response = await api.get<PlantsList>('/plants');
    return response.data;
  },

  get: async (name: string): Promise<Plant> => {
    const response = await api.get<Plant>(`/plants/${encodeURIComponent(name)}`);
    return response.data;
  },

  create: async (formData: FormData): Promise<Plant> => {
    const response = await api.post<Plant>('/plants', formData, {
      headers: { 'Content-Type': 'multipart/form-data' },
    });
    return response.data;
  },

  update: async (name: string, formData: FormData): Promise<Plant> => {
    const response = await api.put<Plant>(`/plants/${encodeURIComponent(name)}`, formData, {
      headers: { 'Content-Type': 'multipart/form-data' },
    });
    return response.data;
  },

  delete: async (name: string): Promise<{ message: string }> => {
    const response = await api.delete<{ message: string }>(`/plants/${encodeURIComponent(name)}`);
    return response.data;
  },
};

// Logs API
export const logsApi = {
  get: async (page: number, perPage: number): Promise<LogsResponse> => {
    const response = await api.get<LogsResponse>('/log', {
      params: { page_no: page, lines_per_page: perPage },
    });
    return response.data;
  },
};

export default api;
