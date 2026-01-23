export interface LogEntry {
  id: number;
  timestamp: string;
  endpoint: string;
  method: string;
  query_params: string;
  request_body: string;
  response_status: number;
  client_ip: string;
}

export interface LogsResponse {
  items: LogEntry[];
  total: number;
}

export interface LogsPaginationParams {
  lines_per_page: number;
  page_no: number;
}
