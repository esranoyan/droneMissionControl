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

// Yeni MilStdIcon sınıfı – metin tabanlı ikon üretir
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

const Map = () => {
  const ankara: [number, number] = [39.92077, 32.85411]; // Harita merkezi
  const golbasi: [number, number] = [39.7982, 32.8057];  // Gölbaşı
  const kizilay: [number, number] = [39.9208, 32.8541];  // Kızılay
  const etimesgut_havaalani: [number, number] = [39.9514, 32.6874];

  // Marker ikonları
  const droneIconGölbaşı = new MilStdIcon("🟦 ♦️ SUAS ISR").icon;
  const droneIconKızılay = new MilStdIcon("🟦 ♦️ SUAS ISR").icon;
  const droneIconEtimesgut = new MilStdIcon("🟦 ♦️ SUAS ISR").icon;

  return (
    <div className="h-screen w-full">
      <MapContainer center={ankara} zoom={13} className="h-full w-full z-0">
        <TileLayer
          attribution='&copy; <a href="http://osm.org/copyright">OpenStreetMap</a>'
          url="https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png"
        />

        {/* Gölbaşı Drone */}
        <Marker position={golbasi} icon={droneIconGölbaşı}>
          <Popup>Görevdeki İHA <br /> Konum: Gölbaşı</Popup>
        </Marker>

        {/* Kızılay Drone */}
        <Marker position={kizilay} icon={droneIconKızılay}>
          <Popup>Beklemede duran İHA <br /> Konum: Kızılay</Popup>
        </Marker>

        {/*Etimesgut Havaalanı Drone*/}
      <Marker position={etimesgut_havaalani} icon={droneIconEtimesgut}>
        <Popup>Görevini tamamlamış İHA <br/> Konum: Etimesgut Havaalanı</Popup>
      </Marker>

      </MapContainer>
    </div>
  );
};

export default Map;
