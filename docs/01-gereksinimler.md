# 01 - Gereksinim Dokümanı

## 🎯 Amaç

AYRIS, çoklu İHA’ların görev almasını, engellerden kaçınarak hedefe ulaşmasını ve sürü halinde çalışmasını simüle eden bir sistemdir.

## ✅ MVP Fonksiyonel Gereksinimler

- [ ] Haritada görev noktası ve engel tanımlanabilmeli.
- [ ] Görevler İHA’lara atanabilmeli.
- [ ] İHA’lar hedeflerine yönelmeli ve görev tamamlamalı.
- [ ] Engellerden kaçınma algoritması çalışmalı.
- [ ] Sürü algoritması uygulanmalı (lider-takip).
- [ ] WebSocket üzerinden canlı konum güncellemesi yapılmalı.

## ⚙️ Teknik Gereksinimler

- Frontend: React + TypeScript + TailwindCSS
- Backend: Python + FastAPI + WebSocket
- İletişim: JSON veri formatı
- Simülasyon: 10 Hz pozisyon güncellemesi

## 🚫 Kısıtlar

- Gerçek donanım (IHA/MAVLink) entegrasyonu MVP dışıdır.
- Simülasyon 2D harita üzerinde yürütülür.

## 🛠️ Genişletilebilirlik (Gelecek)

- Donanım haberleşmesi (UDP/MAVLink)
- Görev türlerinin artırılması (tarama, dönüş, bölgede kalma)
- Gelişmiş sürü davranışları (dinamik görev paylaşımı)
