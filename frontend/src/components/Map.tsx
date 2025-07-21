import { useState } from "react";
import { MapContainer, TileLayer, Marker, Popup } from "react-leaflet";
import "leaflet/dist/leaflet.css";
import L from "leaflet";

// Varsayılan Leaflet ikonlarını devre dışı bırakıyoruz
delete (L.Icon.Default.prototype as any)._getIconUrl;
L.Icon.Default.mergeOptions({
  iconRetinaUrl: "",
  iconUrl: "",
  shadowUrl: "",
});

// Metin tabanlı ikon sınıfı
class MilStdIcon {
  text: string;

  constructor(text: string) {
    this.text = text;
  }

  get icon() {
    return L.divIcon({
      className: "",
      html: `
        <div style="
          min-width: 50px;
          padding: 4px 6px;
          font-size: 14px;
          font-weight: bold;
          color: black;
          text-align: center;
        ">
          ${this.text}
        </div>
      `,
      iconSize: [90, 30],
      iconAnchor: [45, 15],
    });
  }
}

interface Drone {
  id: number;
  name: string;
  position: [number, number];
  task?: string;
}

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

  return (
    <div className="flex h-screen w-full">
      {/* Menü */}
      <div className="w-1/4 bg-gray-100 p-4 overflow-y-auto">
        <h2 className="text-xl font-bold mb-4">Kontrol Paneli</h2>
        <button
          className="bg-blue-500 text-white px-4 py-2 rounded mb-4"
          onClick={addDrone}
        >
          Unsur Ekle
        </button>

        <div className="mb-6">
          <h3 className="font-semibold mb-2">Ekli Unsurlar</h3>
          <ul className="space-y-1">
            {drones.map((drone) => (
              <li key={drone.id} className="flex justify-between items-center">
                {drone.name}
                <button
                  className="text-sm text-blue-600 hover:underline"
                  onClick={() => assignTask(drone.id)}
                >
                  Görev Ata
                </button>
              </li>
            ))}
          </ul>
        </div>

        <div>
          <h3 className="font-semibold mb-2">Atanmış Görevler</h3>
          <ul className="space-y-1">
            {drones.filter(d => d.task).map((drone) => (
              <li key={drone.id}>
                {drone.name}: <span className="italic">{drone.task}</span>
              </li>
            ))}
          </ul>
        </div>
      </div>

      {/* Harita */}
      <div className="w-3/4">
        <MapContainer center={ankara} zoom={13} className="h-full w-full z-0">
          <TileLayer
            attribution='&copy; <a href="http://osm.org/copyright">OpenStreetMap</a>'
            url="https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png"
          />

          {drones.map((drone) => (
            <Marker
              key={drone.id}
              position={drone.position}
              icon={new MilStdIcon("🟦 ♦️ SUAS ISR").icon}
            >
              <Popup>
                {drone.name}
                <br />
                Konum: [{drone.position[0].toFixed(4)}, {drone.position[1].toFixed(4)}]
                <br />
                {drone.task && <>Görev: {drone.task}</>}
              </Popup>
            </Marker>
          ))}
        </MapContainer>
      </div>
    </div>
  );
};

export default Map;
