export interface LogRow {
  id: string | number;
  [key: string]: any;
}

export interface LogResponse {
  items: LogRow[];
  total: number;
}
