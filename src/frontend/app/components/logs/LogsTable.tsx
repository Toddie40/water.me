'use client';

import { useState } from 'react';
import { PageHeader } from '@/app/components/layout/PageHeader';
import {
  Table,
  TableHeader,
  TableBody,
  TableRow,
  TableHead,
} from '@/app/components/ui/Table';
import { Pagination } from '@/app/components/ui/Pagination';
import { Select } from '@/app/components/ui/Select';
import { LogRow } from './LogRow';
import { fetchLogs as fetchLogsAction } from '@/app/actions/logs';
import type { LogEntry } from '@/app/types';

export interface LogsTableProps {
  initialLogs: LogEntry[];
  initialTotal: number;
}

const PAGE_SIZE_OPTIONS = [10, 25, 50];

export function LogsTable({ initialLogs, initialTotal }: LogsTableProps) {
  const [logs, setLogs] = useState<LogEntry[]>(initialLogs);
  const [total, setTotal] = useState(initialTotal);
  const [currentPage, setCurrentPage] = useState(1);
  const [pageSize, setPageSize] = useState(25);
  const [isLoading, setIsLoading] = useState(false);

  const totalPages = Math.ceil(total / pageSize);

  const fetchLogs = async (page: number, size: number) => {
    setIsLoading(true);
    try {
      const response = await fetchLogsAction(page, size);
      setLogs(response.items);
      setTotal(response.total);
    } catch (error) {
      console.error('Failed to fetch logs:', error);
    } finally {
      setIsLoading(false);
    }
  };

  const handlePageChange = (page: number) => {
    setCurrentPage(page);
    fetchLogs(page, pageSize);
  };

  const handlePageSizeChange = (newSize: number) => {
    setPageSize(newSize);
    setCurrentPage(1);
    fetchLogs(1, newSize);
  };

  return (
    <div>
      <PageHeader
        title="Activity Logs"
        subtitle="Monitor API requests and system activity"
      />

      {/* Controls */}
      <div className="flex items-center justify-between mb-4">
        <p className="text-sm text-botanical-soil">
          {total} total entries
        </p>
        <div className="flex items-center gap-2">
          <span className="text-sm text-botanical-soil">Show:</span>
          <Select
            value={pageSize}
            onChange={(e) => handlePageSizeChange(Number(e.target.value))}
            className="w-20"
          >
            {PAGE_SIZE_OPTIONS.map((size) => (
              <option key={size} value={size}>
                {size}
              </option>
            ))}
          </Select>
        </div>
      </div>

      {/* Table */}
      <div className="bg-botanical-sand rounded-xl border border-botanical-stone overflow-hidden">
        <Table>
          <TableHeader>
            <TableRow>
              <TableHead>Timestamp</TableHead>
              <TableHead>Method</TableHead>
              <TableHead>Endpoint</TableHead>
              <TableHead>Status</TableHead>
              <TableHead>Client IP</TableHead>
            </TableRow>
          </TableHeader>
          <TableBody>
            {isLoading ? (
              <TableRow>
                <td colSpan={5} className="px-4 py-8 text-center text-botanical-soil">
                  Loading...
                </td>
              </TableRow>
            ) : logs.length === 0 ? (
              <TableRow>
                <td colSpan={5} className="px-4 py-8 text-center text-botanical-soil">
                  No logs found
                </td>
              </TableRow>
            ) : (
              logs.map((log) => <LogRow key={log.id} log={log} />)
            )}
          </TableBody>
        </Table>
      </div>

      {/* Pagination */}
      {totalPages > 1 && (
        <div className="mt-6">
          <Pagination
            currentPage={currentPage}
            totalPages={totalPages}
            onPageChange={handlePageChange}
          />
        </div>
      )}
    </div>
  );
}
