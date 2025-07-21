import { MapContainer, TileLayer, Marker, Popup } from "react-leaflet";
import "leaflet/dist/leaflet.css";
import L from "leaflet";

//Default ikonları kaldırıyoruz (React-Leaflet için)
delete (L.Icon.Default.prototype as any)._getIconUrl;
L.Icon.Default.mergeOptions({
  iconRetinaUrl: "",
  iconUrl: "",
  shadowUrl: "",
});

// MilStdIcon sınıfı
class MilStdIcon {
  color: string;
  symbol: string;
  label: string;

  constructor(color: string, symbol: string, label: string) {
    this.color = color;
    this.symbol = symbol;
    this.label = label;
  }

  get icon() {
    return L.divIcon({
      className: "",
      html: `
        <div style="
          width: 40px;
          height: 40px;
          background-color: ${this.color};
          border: 2px solid black;
          display: flex;
          align-items: center;
          justify-content: center;
          font-weight: bold;
          font-size: 20px;
          color: black;
          position: relative;
        ">
          ${this.symbol}
          <div style="
            position: absolute;
            bottom: -20px;
            width: 100%;
            text-align: center;
            font-size: 12px;
            font-weight: normal;
          ">
            ${this.label}
          </div>
        </div>
      `,
      iconSize: [40, 40],
      iconAnchor: [20, 20],
    });
  }
}

const Map = () => {
  const ankara: [number, number] = [39.92077, 32.85411]; // Ankara koordinatları

  // Sınıfı kullanarak ikon yaratıyoruz
  const attackIcon = new MilStdIcon("red", "+", "Saldırı").icon;

  // Önceki drone ikonu için direkt DivIcon nesnesi
  const droneIcon = new L.DivIcon({
    className: "",
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

  return (
    <div className="h-screen w-full">
      <MapContainer center={ankara} zoom={13} className="h-full w-full z-0">
        <TileLayer
          attribution='&copy; <a href="http://osm.org/copyright">OpenStreetMap</a>'
          url="https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png"
        />

        {/* MilStdIcon sınıfından oluşturulmuş marker */}
        <Marker position={ankara} icon={attackIcon}>
          <Popup>Saldırı Noktası <br /> Konum: Ankara</Popup>
        </Marker>

        {/* Önceki drone ikonu marker */}
        <Marker position={[39.7764, 32.8326]} icon={droneIcon}>
          <Popup>Görevdeki İHA <br /> Konum: Gölbaşı</Popup>
          </Marker>
      </MapContainer>
    </div>
  );
};

export default Map;
