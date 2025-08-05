import L from "leaflet";

export class MilStdIcon {
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

// Farklı tip ikonlar için yardımcı fonksiyonlar
export const createDroneIcon = () => new MilStdIcon("🟦 ♦️ SUAS ISR");