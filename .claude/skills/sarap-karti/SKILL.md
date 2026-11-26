---
name: sarap-karti
description: Kullanıcının verdiği şarabı (isim veya etiket fotoğrafı) internetten araştırır, detaylı bilgi dosyası yazar ve garsonlar için yazdırılabilir minik bilgi kartı (HTML + PDF) üretir. "şarap kartı", "bu şarabı incele", "garson kartı" denince veya /sarap-karti ile kullanılır.
---

# Şarap Kartı Agent'ı

Amaç: Restoran garsonlarının bir şarabı müşteriye 30 saniyede, doğru ve kendinden emin anlatabilmesi.

## Girdi
- Şarap adı (üretici + şarap adı + varsa yıl), örn. `Kavaklıdere Yakut 2021`
- veya etiket fotoğrafı: önce etiketteki üretici, şarap adı, yıl, bölge, üzüm, alkol % bilgilerini oku.
- Bilgi eksik veya belirsizse (ör. aynı adla birden çok şarap var) kullanıcıya TEK kısa soru sor.

## Adım 1 — Araştır (WebSearch)
Az ve hedefli arama yap (maliyet için en fazla 3–5 arama):
1. Üreticinin resmî sitesi / teknik föy (tech sheet): üzüm, bölge, alkol, fıçılama, servis.
2. Tadım notu kaynakları (uzman yorumları, satıcı sayfaları).
3. Gerekirse üzümün / bölgenin genel özellikleri.

KURALLAR (çok önemli):
- Bilgi UYDURMA. Kaynakta bulamadığın alanı boş bırakma; `"Doğrulanmadı"` yaz veya üzümün genel karakterine dayanıyorsa sonuna `(genel üzüm karakteri)` ekle.
- Yıla (vintage) özel bilgi ile şarabın genel bilgisini karıştırma.
- Fiyat yazma (restoran kendi fiyatını belirler).
- Kullandığın kaynak URL'lerini kaydet.
- Satış/reklam dili kullanma; bilgi verici ve sade ol (alkol reklamı kısıtlamaları).

## Adım 2 — Veriyi yaz
`saraplar/<kisa-ad>/veri.json` dosyasını oluştur. `<kisa-ad>`: küçük harf, Türkçe karakter yok, tire ile (örn. `kavaklidere-yakut-2021`). Şema için `sablon/ornek-veri.json` dosyasına bak; aynı alanları kullan. Kurallar:
- `tadim.goz`, `tadim.burun`, `tadim.damak`: her biri en fazla ~12 kelime.
- `eslesme`: 3–5 kısa yemek; mümkünse menüdeki yemek türlerine uygun (et, balık, meze, peynir...).
- `garson_cumlesi`: müşteriye söylenecek, en fazla 2 cümle, sade.
- `bilmeniz_gereken`: garsonun bilmesi faydalı 2–3 kısa bilgi (ör. "Yerli Boğazkere üzümü, tanen yüksek").

## Adım 3 — Detaylı bilgi dosyası
`saraplar/<kisa-ad>/detay.md` yaz (eğitim için, Türkçe): üretici ve hikâyesi, bölge ve iklim, üzüm(ler), üretim (fıçı vb.), tadım profili, servis, yemek eşleşmeleri ve nedenleri, müşterinin sorabileceği 3 soru + cevapları, kaynaklar listesi.

## Adım 4 — Kartı üret (script, yapay zekâ gerekmez)
```bash
node araclar/kart-olustur.js saraplar/<kisa-ad>/veri.json
```
Bu `kart.html` ve (Playwright varsa) `kart.pdf` üretir. Kart A6 boyutundadır.

## Adım 5 — Kullanıcıya bildir
Kısa özet ver: şarabın 1 cümlelik tanımı, "Doğrulanmadı" kalan alanlar varsa onlar, ve oluşturulan dosyaların yolları. Kartı kullanıcıya dosya olarak gönder.
