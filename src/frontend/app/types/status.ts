export interface SlotStatus {
  slot: number;
  moisture: number | null;
  last_watered: string | null;
  auto_water: boolean | null;
  plant_name: string | null;
  description: string | null;
  moisture_threshold: number | null;
  image_link: string | null;
}

export interface StatusResponse {
  slots: SlotStatus[];
}
