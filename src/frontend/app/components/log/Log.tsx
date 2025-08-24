// app/log/page.tsx  (server component, no 'use client')
import LogTableClient from './LogTableClient';
import axios from 'axios';
import { LogResponse } from '@/app/interfaces/log';


// serverside function to fetch the logs from the fastAPI container
async function fetchLogs(pageNumber: number, linesPerPage: number): Promise<LogResponse> {
  'use server'
  try {
    const response = await axios.get<LogResponse>(`${process.env.API_ENDPOINT}/log`, {
      params: {
        lines_per_page: linesPerPage,
        page_no: pageNumber,
      },
      headers: {
        'Accept': 'application/json',
        'Content-Type': 'application/json',
      },
    });
    return response.data ?? { items: [], total: 0 };
  } catch (error) {
    console.error("Failed to fetch logs:", error);
    return { items: [], total: 0 };
  }
}


// Main page component (async server component)
export default async function LogPage() {
  const initialPage = 1;
  const initialLinesPerPage = 10;
  const initialLogs = await fetchLogs(initialPage, initialLinesPerPage);

  // Pass initial data to client component and pass it the server-side callback function to update the logs during pagination
  return <LogTableClient fetchLogsCallback={fetchLogs} initialLogs={initialLogs} initialPage={initialPage} initialLinesPerPage={initialLinesPerPage} />;
}
