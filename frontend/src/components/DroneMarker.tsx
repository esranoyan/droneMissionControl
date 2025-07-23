import { Marker, Popup } from "react-leaflet";
import { type DroneMarkerProps } from "../types/drone";
import { MilStdIcon } from "./MilStdIcon";

const DroneMarker: React.FC<DroneMarkerProps> = ({ drone, isSelected = false }) => {
  return (
    <Marker
      position={[drone.position[0], drone.position[1]]}
      icon={new MilStdIcon("🟦 ♦️ SUAS ISR"
      ).icon}
    >
      <Popup>
        <div className="min-w-0">
          <div className="font-semibold">{drone.name}</div>
          <div className="text-sm text-gray-600 mt-1">
            ID: {drone.id}
          </div>
          <div className="text-sm text-gray-600">
            Lat: {drone.position[0].toFixed(8)}°
          </div>
          <div className="text-sm text-gray-600">
            Lng: {drone.position[1].toFixed(8)}°
          </div>
          <div className="text-sm text-gray-600">
            Alt: {drone.position[2].toFixed(1)}m
          </div>
          {drone.isMoving && (
            <div className="text-sm text-orange-600 mt-1 font-semibold">
              🔄 Hareket halinde
            </div>
          )}
          {isSelected && (
            <div className="text-sm text-green-600 mt-1 font-semibold">
              ✅ Seçili
            </div>
          )}
        </div>
      </Popup>
    </Marker>
  );
};

export default DroneMarker;
