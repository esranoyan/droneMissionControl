# 🤝 Katkı Rehberi – AYRIS

Bu belge, AYRIS projesine katkıda bulunacak geliştiriciler için bir yol haritasıdır.

---

## 🧭 Geliştirme Süreci

- Ana branch: `main` → sadece yönetici tarafından yönetilir.
- Aktif geliştirme: `dev` branch üzerinden yürütülür.
- Her özellik, hata düzeltme veya iyileştirme için yeni bir feature branch oluşturulur:

  ```bash
  git checkout dev
  git checkout -b feature/isim
  ```

---

## 🔄 Pull Request (PR) Süreci

1. Geliştirmeyi kendi branch'inde yap.
2. Anlamlı commit mesajlarıyla ilerle:

   ```bash
   git commit -m "görev atama formu eklendi"
   ```

3. Branch'i GitHub'a gönder:

   ```bash
   git push origin feature/isim
   ```

4. GitHub üzerinden `dev`'e karşı bir Pull Request aç.
5. PR içeriğini açık ve anlaşılır şekilde açıklamalısın:

   - Ne değişti?
   - Neden yapıldı?
   - Ek olarak test ettin mi?

---

## 📐 Kod Standartları

- **KISS:** Gereksiz soyutlamadan ve karmaşıklıktan kaçın.
- **DRY:** Yinelenen kodları fonksiyonlaştır.
- **YAGNI:** İhtiyacın olmayanı yazma.
- **SOLID:** Temiz, sorumluluğu belli yapılar kur.
- **Clean Code:** Anlamlı isimler, açıklayıcı yapılar, sade mantık.

---

## 🧪 Geliştirici Tavsiyeleri

- Her PR küçük ve odaklı olsun.

- Başka bir PR üzerinde çalışırken, mümkünse sıradakini beklet.

- `dev` branch'ini düzenli olarak güncelle:

  ```bash
  git fetch origin
  git rebase origin/dev
  ```

- Gözden geçirme isteklerini dikkate al, yorumlara açıklık getir.

- Her PR'da öğrenmeye ve birlikte geliştirmeye açık ol.

---

## 🧼 Ekstra: Ne eklenmemeli?

- `.env`, `node_modules/`, `venv/`, `.log`, `build/` gibi klasör ve dosyalar `.gitignore` içinde zaten tanımlı.
- Geliştirme sırasında oluşan geçici dosyaları (ör: VS Code ayarları, OS dosyaları) eklememeye dikkat et.

---

## 📣 Deney, Öğren, Boz, Yeniden Yap – Cesur Kod Yaz!

> Ayris, öğrenmek isteyen herkesin özgürce keşfetmesini destekler.
> Bu projede yazdığın kodun “yanlış” olması değil, yazmaman problem olur.

- Dilediğin gibi deney yap.
- Yapıyı anlamaya çalışmadan korkma.
- Gerekiyorsa boz. Gerekirse yeniden yaz.
- Commit atmadan önce sadece 1 kez gözden geçirmen yeterli.
- Hiçbir katkı küçük değildir.

İlk amacımız üretmek, öğrenmek ve paylaşmak.

> Kod, sadece makineye değil, birlikte çalıştığın takıma da yazılır.
> Ve bu takımda soru sormak, yardım istemek ve öneri sunmak güçtür.

Senin katkın, bu projeyi ileri taşıyan gerçek yakıttır.
