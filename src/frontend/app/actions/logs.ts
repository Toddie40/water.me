'use server';

import { logsApi } from '@/app/lib/api';
import type { LogsResponse } from '@/app/types';

export async function fetchLogs(page: number, perPage: number): Promise<LogsResponse> {
  return logsApi.get(page, perPage);
}
