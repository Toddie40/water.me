import React, { type FC } from 'react';

interface LogEntryProps {
  data: Record<string, unknown>;
}

const LogEntry: FC<LogEntryProps> = ({ data }) => {
  // Generate the cells for this row
  const cells = Object.values(data).map((cell_entry, index) => (
    <td key={index}>
      <div className='text-truncate' style={{ maxWidth: '150px' }}>
        {cell_entry as React.ReactNode}
      </div>
    </td>
  ));

  return <tr>{cells}</tr>;
}

export default LogEntry;