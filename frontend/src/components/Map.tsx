import { MapContainer, TileLayer, Marker, Popup, useMap } from "react-leaflet";
import "leaflet/dist/leaflet.css";
import L from "leaflet";
import { useEffect } from "react";

// ❗ Default ikonları kaldırıyoruz
delete (L.Icon.Default.prototype as any)._getIconUrl;
L.Icon.Default.mergeOptions({
  iconRetinaUrl: "",
  iconUrl: "",
  shadowUrl: "",
});

// 🔰 Custom MIL-STD-2525 tarzı ikon (SVG içeren)
const droneIcon = new L.DivIcon({
  className: "", // varsayılan class'ı devre dışı bırak
  html: `
    <div style="display: flex; flex-direction: column; align-items: center;">
      <div style="font-size: 20px;">🟢</div>
      <div style="
        width: 24px;
        height: 24px;
        background: white;
        border: 2px solid green;
        clip-path: polygon(50% 0%, 100% 50%, 50% 100%, 0% 50%);
        display: flex;
        align-items: center;
        justify-content: center;
        font-weight: bold;
        font-size: 10px;
        color: green;
      ">
        UAV
      </div>
    </div>
  `,
  iconSize: [30, 42],
  iconAnchor: [15, 42],
  popupAnchor: [0, -40],
});

const Map = () => {
  const ankara: [number, number] = [39.92077, 32.85411]; // Ankara koordinatları

  return (
    <div className="h-screen w-full">
      <MapContainer center={ankara} zoom={13} className="h-full w-full z-0">
        <TileLayer
          attribution='&copy; <a href="http://osm.org/copyright">OpenStreetMap</a>'
          url="https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png"
        />
        {/* 🔰 Özel askeri drone ikonu */}
        <Marker position={ankara} icon={droneIcon}>
          <Popup>
            Görevdeki İHA <br /> Konum: Ankara
          </Popup>
        </Marker>
      </MapContainer>
    </div>
  );
};

export default Map;
