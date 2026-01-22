'use server'

import axios from 'axios';
import './Status.css';
import PlantStatusItem from '@/app/components/status/PlantStatusItem';

interface StatusData {
  slots: any;
}

export default async function StatusPage() {
  let statusData: any = null;
  let error = '';

  try {
    // Use the internal hostname if needed e.g. "http://api:8000/status" inside Docker
    const res = await axios.get<StatusData>(`${process.env.API_ENDPOINT}/status`);
    statusData = res.data.slots;
  } catch (err: any) {
    error = err.message || 'Unknown error';
  }

  return (
    <div>
      <div className="pageHeading">Plant Status</div>
      {error ? (
        <p>Error retrieving status information from API: {error}</p>
      ) : statusData && statusData.length > 0 ? (
        <div className='plantStatusItemList'>
          {statusData.map((dataObject: Object, index: number) => (
            <PlantStatusItem key={`plantStatusItem-${index}`} statusData={dataObject} />
          ))}
        </div>
      ) : (
        <p>No status data available</p>
      )}
    </div>
  );
}