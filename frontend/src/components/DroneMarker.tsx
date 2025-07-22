import { Marker, Popup } from "react-leaflet";
import { type DroneMarkerProps } from "../types/drone";
import { MilStdIcon } from "./MilStdIcon";

const DroneMarker: React.FC<DroneMarkerProps> = ({ drone }) => {
  return (
    <Marker
      position={drone.position}
      icon={new MilStdIcon("🟦 ♦️ SUAS ISR").icon}
    >
      <Popup>
        <div className="min-w-0">
          <div className="font-semibold">{drone.name}</div>
          <div className="text-sm text-gray-600 mt-1">
            Konum: [{drone.position[0].toFixed(4)}, {drone.position[1].toFixed(4)}]
          </div>
          {drone.task && (
            <div className="text-sm text-blue-600 mt-1">
              Görev: {drone.task}
            </div>
          )}
        </div>
      </Popup>
    </Marker>
  );
};

export default DroneMarker;