import { statusApi, plantsApi } from '@/app/lib/api';
import { SlotCard } from './SlotCard';
import { PageHeader } from '@/app/components/layout/PageHeader';

export async function StatusGrid() {
  let statusData;
  let plantsData;

  try {
    [statusData, plantsData] = await Promise.all([
      statusApi.getAll(),
      plantsApi.getAll(),
    ]);
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
          Unable to connect
        </h2>
        <p className="text-botanical-soil">
          Could not fetch plant status. Please check your connection and try again.
        </p>
      </div>
    );
  }

  const slots = statusData.slots;
  const plants = plantsData.plants;

  return (
    <div>
      <PageHeader
        title="Plant Status"
        subtitle="Monitor and manage your plants"
      />

      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6">
        {slots.map((slot) => (
          <SlotCard key={slot.slot} slot={slot} plants={plants} />
        ))}
      </div>

      {slots.length === 0 && (
        <div className="text-center py-12">
          <p className="text-botanical-soil">No slots configured.</p>
        </div>
      )}
    </div>
  );
}
