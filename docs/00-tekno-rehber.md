# 🧭 Proje Temel Bilgilendirme ve Kurulum Notları

Bu doküman, projenin teknolojik altyapısını, kullanılan araçların neden seçildiğini ve başlangıç kurulum aşamalarını açıklar. Özellikle bu projeye yeni dahil olacak geliştiriciler için rehber niteliğindedir.

---

## 📌 JavaScript Nedir, TypeScript'e Geçiş Neden?

### JavaScript:

Web’in temel programlama dilidir. Tarayıcılar tarafından doğal olarak çalıştırılır. Dinamik, esnek ama tip güvenliği yoktur.

### TypeScript:

JavaScript'in **tip güvenliği** ve **gelişmiş editör desteği** eklenmiş halidir.  
Kod büyüdükçe daha okunabilir, daha sürdürülebilir ve daha az hata üretir.

**Bu projede TypeScript tercih ettik çünkü:**

- Daha az runtime hatası
- Kod okurken belirsizlik yok
- Daha güçlü otomatik tamamlama ve refactor imkanı
- Sürü algoritmaları ve mesaj yapıları gibi karmaşık verileri modellemek kolay

---

## ⚛️ React Nedir? Neden Tercih Ettik?

React, kullanıcı arayüzü oluşturmak için bileşen tabanlı bir JavaScript kütüphanesidir.

**Tercih sebebi:**

- UI bileşenlerini modüler olarak yönetebilme
- Reaktif güncellemeler (örneğin: İHA konumları sürekli değişirken yeniden çizim)
- DevTools ve ekosistem desteği
- Takım çalışmasına uygun component mimarisi

---

## 🎨 TailwindCSS Nedir? Neden Tercih Ettik?

Tailwind, utility-first bir CSS framework’üdür. Her stil `className` üzerinden yazılır.

**Neden tercih ettik:**

- Hızlı prototipleme
- Tasarım sistemine ihtiyaç duymadan düzenli stil yazımı
- Komponentlere gömülü stil (ayrı `.css` dosyasına gerek kalmaz)
- Responsive sınıflar hazır

---

## ⚡ Vite Nedir? Neden Tercih Ettik?

Vite, modern frontend projeleri için ultra hızlı bir bundler'dır (Webpack yerine).

**Tercih sebepleri:**

- Milisaniyelik başlatma süresi
- HMR (Hot Module Reloading) çok hızlı
- Tailwind + React + TypeScript için hazır şablon
- Karmaşık konfigürasyon gerekmez

---

## 🧠 Tüm Stack'i Beraber Tercih Etme Nedenimiz

| Teknoloji  | Amacı         | Neden Bizim İçin Uygun                           |
| ---------- | ------------- | ------------------------------------------------ |
| React      | UI            | Harita, görev yönetimi gibi bileşenli yapılar    |
| TypeScript | Tip güvenliği | JSON veri modelleri ve algoritmalar için güvenli |
| Tailwind   | CSS           | Hızlı ve okunabilir arayüz                       |
| Vite       | Bundler       | Hızlı geliştirme, sade yapı                      |

---

## 🛠️ `npm create vite@latest frontend -- --template react-ts` Komutu Ne Yaptı?

Bu komut, şu işlemleri yaptı:

- `frontend/` klasörünü oluşturdu
- React + TypeScript yapılandırmasını kurdu
- Vite yapılandırma dosyalarını (`vite.config.ts`, `tsconfig.json`) ekledi
- Başlangıç bileşenleri (`App.tsx`, `main.tsx`) oluşturdu

---

## 📂 Oluşan Dosya Yapısı & Dosya Açıklamaları

```bash
frontend/
├── node_modules/        # Bağımlılık klasörü
├── public/              # HTML dış kaynaklar
├── src/                 # Uygulama kaynak kodları
│   ├── components/      # UI bileşenleri (React component'leri)
│   ├── types/           # TypeScript tip tanımları (ör. Drone, Task, Obstacle)
│   ├── websocket/       # WebSocket bağlantı ve veri işleyici fonksiyonları
│   ├── App.tsx          # Ana UI bileşeni
│   ├── index.css        # TailwindCSS stil giriş noktası
│   ├── main.tsx         # React uygulamasını başlatır
│   └── vite-env.d.ts    # Vite özel Type tanımları
├── index.html           # HTML iskeleti
├── package.json         # Bağımlılık tanımları
├── tsconfig.json        # TypeScript genel ayarları
├── vite.config.ts       # Vite yapılandırma dosyası
└── eslint.config.js     # Kod kalitesi kuralları
```

---

## 🧹 Sildiğimiz / Kullanmadığımız Dosyalar

- Varsayılan örnek `.svg` veya demo CSS bileşenleri silindi.
- Kullanmadığımız `assets/` klasörü kaldırıldı.
- Ek olarak, `README.md` sadeleştirildi, içerik bu `manual.md` dosyasına taşındı.
