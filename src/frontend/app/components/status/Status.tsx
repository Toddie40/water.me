import axios from 'axios';
import './Status.css';
import PlantStatusItem from '@/app/components/status/PlantStatusItem';

interface StatusData {
  result: any;
}

export default async function StatusPage() {
  let statusData: any = null;
  let error = '';

  try {
    // Use the internal hostname if needed e.g. "http://api:8000/status" inside Docker
    const res = await axios.get<StatusData>("http://localhost:8000/status");
    statusData = res.data.result;
  } catch (err: any) {
    error = err.message || 'Unknown error';
  }

  return (
    <div>
      <div className="pageHeading">Plant Status</div>
      {error ? (
        <p>Error retrieving status information from API: {error}</p>
      ) : (
        <div className='plantStatusItemList'>
          {statusData.map((dataObject: Object, index: number) => (
            <PlantStatusItem key={`plantStatusItem-${index}`} statusData={dataObject} />    
          ))}
        </div>
      )}
    </div>
  );
}