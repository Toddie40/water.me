import { type FC } from 'react';

interface PlantStatusItemProps {
  statusData: Array<Record<string, any>>;
}

const PlantStatusItem: FC<PlantStatusItemProps> = ({ statusData }) => {
  if (!statusData || statusData.length === 0) {
    return <div>No data available</div>;
  }

  // Extract headings from the first data object.
  const headings: string[] = Object.keys(statusData[0]);

  return (
    <table>
      <thead>
        <tr>
          {headings.map((heading, index) => (
            <th key={index}>{heading}</th>
          ))}
        </tr>
      </thead>
      <tbody>
        {statusData.map((rowData, rowIndex) => (
          <tr key={rowIndex}>
            {Object.entries(rowData).map(([key, value], cellIndex) => (
              <td key={cellIndex}>
                {key === "image" ? (
                  <img
                    src={value as string}
                    alt={rowData["name"] ? String(rowData["name"]) : "image"}
                  />
                ) : (
                  value?.toString()
                )}
              </td>
            ))}
          </tr>
        ))}
      </tbody>
    </table>
  );
};

export default PlantStatusItem;