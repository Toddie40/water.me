import { type FC } from 'react';
import EmptyStatusElement from './EmptyStatusElement';

interface PlantStatusItemProps {
  statusData: Record<string, any>;
}

const PlantStatusItem: FC<PlantStatusItemProps> = ({ statusData }) => {
  if (!statusData || Object.keys(statusData).length === 0) {
    // return the empty status item object with the ability to add a new item.
    return <EmptyStatusElement/>;
  }


  return (
    <div className="plantCard">
      {/* Action icons container */}
      <div className="cardActions">
        <i className="bi bi-pencil-fill pencil-icon" />
        <i className="bi bi-trash-fill trash-icon" />
      </div>
      
      <img className="plantImage" src={statusData.image} alt="monstera plant image" />
      <div className="plantMain">
        <h2 className="plantName">{statusData.name}</h2>
        <p className="plantDescription">{statusData.description}</p>
        <ul className="plantProperties">
          <li className="propertyRow">
            <span>Moisture Level</span>
            <span>{statusData.moisture}</span>
          </li>
          <li className="propertyRow">
            <span>Water Threshold</span>
            <span>{statusData.threshold}</span>
          </li>
          <li className="propertyRow">
            <span>Last Watered</span>
            <span>{statusData.lastWatered}</span>
          </li>
          <li className="propertyRow">
            <span>Auto Water</span>
            {statusData.autoWater === "true" ? (
              <span className="badge success">On</span>
            ) : (
              <span className="badge">Off</span>
            )}
          </li>
        </ul>
      </div>
    </div>
  );
};

export default PlantStatusItem;