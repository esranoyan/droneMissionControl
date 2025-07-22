import { useState } from "react";
import { MapContainer, TileLayer } from "react-leaflet";
import "leaflet/dist/leaflet.css";
import L from "leaflet";
import ControlPanel from "./components/ControlPanel";
import DroneMarker from "./components/DroneMarker";
import { type Drone } from "./types/drone";  
 
// Varsayılan Leaflet ikonlarını devre dışı bırakıyoruz
delete (L.Icon.Default.prototype as any)._getIconUrl;
L.Icon.Default.mergeOptions({
  iconRetinaUrl: "",
  iconUrl: "",
  shadowUrl: "",
});

const Map = () => {
  const ankara: [number, number] = [39.92077, 32.85411];
  const [drones, setDrones] = useState<Drone[]>([]);
  const [nextId, setNextId] = useState(1);

  const addDrone = () => {
    const newDrone: Drone = {
      id: nextId,
      name: `İHA ${nextId}`,
      position: [ankara[0] + Math.random() * 0.02 - 0.01, ankara[1] + Math.random() * 0.02 - 0.01],
    };
    setDrones([...drones, newDrone]);
    setNextId(nextId + 1);
  };

  const assignTask = (id: number) => {
    const task = prompt("Görev girin:");
    if (!task) return;
    setDrones(
      drones.map((d) => (d.id === id ? { ...d, task } : d))
    );
  };

  const removeDrone = (id: number) => {
    setDrones(drones.filter(d => d.id !== id));
  };

  return (
    <div className="flex h-screen w-full">
      <ControlPanel 
        drones={drones}
        onAddDrone={addDrone}
        onAssignTask={assignTask}
        onRemoveDrone={removeDrone}
      />

      <div className="w-3/4">
        <MapContainer center={ankara} zoom={13} className="h-full w-full z-0">
          <TileLayer
            attribution='&copy; <a href="http://osm.org/copyright">OpenStreetMap</a>'
            url="https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png"
          />

          {drones.map((drone) => (
            <DroneMarker key={drone.id} drone={drone} />
          ))}
        </MapContainer>
      </div>
    </div>
  );
};

export default Map;