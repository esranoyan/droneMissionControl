# 🛰️ AYRIS

**Ayrota Raporlama, İstihbarat ve Simülasyon Sistemi**  
Gerçek zamanlı çoklu İHA görev simülasyonu, sürü algoritması test ortamı ve harita tabanlı kontrol arayüzü.

---

## 🎯 Amaç

AYRIS, çoklu İHA’ların görev almasını, engellerden kaçınarak hedefe ulaşmasını ve sürü halinde çalışmasını simüle eden bir sistemdir.  
Bu sistem, hem akademik test ortamı hem de gerçek zamanlı gözetim ve kontrol uygulamaları için kullanılabilir.

---

## ⚙️ Teknolojiler

- **Frontend:** React + TypeScript + TailwindCSS + Leaflet (2D harita)
- **Backend:** Python + FastAPI + WebSocket
- **İletişim:** JSON veri modeli, çift yönlü canlı veri akışı
- **Simülasyon:** Anlık pozisyon güncellemeleri, görev yürütme, sürü davranışı

---

## 📘 Ek Bilgilendirme

Bu projede kullanılan teknolojiler ve kurulum tercihleri hakkında detaylı teknik notlar için:  
📄 [00-tekno-rehber.md](./docs/00-tekno-rehber.md)

---

## 🧱 Yapı ve Prensipler

Bu proje aşağıdaki yazılım geliştirme prensiplerini uygular:

- **KISS (Keep It Simple, Stupid):** Kodlar sade, gereksiz soyutlamadan uzak yazılır.
- **DRY (Don't Repeat Yourself):** Yinelenen kodlar fonksiyonlara bölünerek tek noktadan yönetilir.
- **YAGNI (You Aren’t Gonna Need It):** İhtiyaç duyulmadıkça yeni özellik ya da yapı eklenmez.
- **SOLID:** Temiz, test edilebilir, genişletilebilir sınıf yapıları ve bileşen mantığı kullanılır.
- **Clean Code:** Anlamlı isimlendirme, okunabilirlik ve minimum bağımlılık hedeflenir.

Bu prensiplere uygun kod yazmak sadece teknik değil, iletişimsel bir değer taşır. Her satır kod, bir takım arkadaşına mesajdır.

---

## 📚 Belgeler

Bu proje belgeleri `docs/` klasöründe yer almaktadır.  
Geliştirme sürecinde her katkıdan önce mutlaka kontrol edilmelidir.

- [01 - Gereksinim Dokümanı](./docs/01-gereksinimler.md)
- [02 - Veri Modeli Tanımı](./docs/02-veri-modeli.md)
- [03 - Sistem Mimarisi](./docs/03-mimari.md)

---

## 📂 Proje Yapısı

```bash
ayris/
├── docs/                # Gereksinim & mimari belgeler
├── backend/             # FastAPI tabanlı simülasyon & kontrol API'si
│   ├── main.py
│   ├── models/          # Veri sınıfları (IHA, görev, engel)
│   └── logic/           # Kontrol/sürü algoritmaları
├── frontend/            # React + TypeScript UI
│   ├── public/
│   └── src/
│       ├── components/  # UI bileşenleri (ör: Button, Panel, DroneCard)
│       ├── types/       # Tip tanımları (TypeScript arayüzleri)
│       └── websocket/   # WebSocket işleyicileri
├── simulators/          # Asenkron çalışma ve test süreçleri için gerekli simülatörler
└── .gitignore
└── CONTRIBUTING.md
└── README.md
```

---

## 🚀 Başlarken

### Backend

```bash
cd backend
python -m venv venv
source venv/bin/activate  # Windows: venv\Scripts\activate
pip install -r requirements.txt
uvicorn main:app --reload
```

### Frontend

```bash
cd frontend
npm install
npm run dev  # veya npm start
```

---

## 🔁 Veri Yapısı Örnekleri

```ts
// Drone.ts
export interface Drone {
  id: string;
  position: { lat: number; lng: number };
  speed: number;
  heading: number;
  state: "idle" | "moving" | "waiting";
}
```

```ts
// Task.ts
export interface Task {
  id: string;
  type: "goto" | "scan";
  target: { lat: number; lng: number };
  assignedDroneId?: string;
}
```

---

## 📆 Takip & Planlama

Proje görevleri ilgili Github sayfası üzerinden takip edilmektedir.

Github bağlantısı:
🔗 [AYRIS Görev Takibi](https://github.com/users/ayrota/projects/2/views/1?system_template=kanban)

---

## 👥 Katkı Rehberi

Projeye katkıda bulunmak isteyen geliştiriciler için detaylı süreç açıklaması
ve kodlama standartları `CONTRIBUTING.md` dosyasında yer almaktadır.

📄 Lütfen başlamadan önce şu sayfaya göz atın:
[CONTRIBUTING.md](./CONTRIBUTING.md)

---

## 📄 Lisans

Bu proje Ayrota tarafından yürütülmektedir.
Staj ve araştırma kapsamında geliştirilmektedir.
Tüm hakları saklıdır.
