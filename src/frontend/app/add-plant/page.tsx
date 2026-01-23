'use client';

import { useRouter } from 'next/navigation';
import { PageHeader } from '@/app/components/layout/PageHeader';
import { Card, CardContent } from '@/app/components/ui/Card';
import { PlantForm } from '@/app/components/forms/PlantForm';
import { createPlant } from '@/app/actions/plants';

export default function AddPlantPage() {
  const router = useRouter();

  const handleSubmit = async (formData: FormData) => {
    await createPlant(formData);
    router.push('/library');
  };

  const handleCancel = () => {
    router.back();
  };

  return (
    <div>
      <PageHeader
        title="Add New Plant"
        subtitle="Create a new plant for your library"
      />

      <Card className="max-w-lg mx-auto">
        <CardContent>
          <PlantForm
            onSubmit={handleSubmit}
            onCancel={handleCancel}
            submitLabel="Add Plant"
          />
        </CardContent>
      </Card>
    </div>
  );
}
