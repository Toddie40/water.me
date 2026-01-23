import { logsApi } from '@/app/lib/api';
import { LogsTable } from '@/app/components/logs';

export default async function LogsPage() {
  let logs;
  let total;

  try {
    const response = await logsApi.get(1, 25);
    logs = response.items;
    total = response.total;
  } catch (error) {
    return (
      <div className="text-center py-12">
        <div className="w-16 h-16 mx-auto mb-4 rounded-full bg-botanical-danger/10 flex items-center justify-center">
          <svg
            className="w-8 h-8 text-botanical-danger"
            fill="none"
            stroke="currentColor"
            viewBox="0 0 24 24"
          >
            <path
              strokeLinecap="round"
              strokeLinejoin="round"
              strokeWidth={2}
              d="M12 9v2m0 4h.01m-6.938 4h13.856c1.54 0 2.502-1.667 1.732-3L13.732 4c-.77-1.333-2.694-1.333-3.464 0L3.34 16c-.77 1.333.192 3 1.732 3z"
            />
          </svg>
        </div>
        <h2 className="text-lg font-semibold text-botanical-bark mb-2">
          Unable to load logs
        </h2>
        <p className="text-botanical-soil">
          Could not fetch activity logs. Please check your connection and try again.
        </p>
      </div>
    );
  }

  return <LogsTable initialLogs={logs} initialTotal={total} />;
}
