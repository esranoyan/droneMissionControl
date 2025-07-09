# 03 - Sistem Mimarisi

## 🧱 Yapı

- **Frontend:** Kullanıcı ile etkileşimi sağlar, görev/engel tanımı ve harita üstünden izleme yapılır.
- **Backend:** Simülasyonu yürütür, algoritmaları çalıştırır, WebSocket ile veri sağlar.
- **Veri:** JSON modeli ile tanımlı görev, drone ve engel nesneleri kullanılır.

## 🔗 Bileşenler Arası İletişim

Kullanıcı <-> React UI <-> WebSocket <-> FastAPI (Python) <-> Simülasyon + Algoritmalar

## 🌐 WebSocket Veri Akışı

- UI → Backend: Görev tanımı, engel tanımı, simülasyon başlatma
- Backend → UI: İHA pozisyon güncellemeleri, görev durumu

## 🧪 Test Noktaları

- WebSocket bağlantı kararlılığı
- Harita üstü güncellemelerin senkronizasyonu
- Çoklu İHA veri akışı
- Algoritma davranışı (engel kaçınma, görev tamamlama)
