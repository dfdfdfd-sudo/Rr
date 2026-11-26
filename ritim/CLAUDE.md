# Ritim — Proje Rehberi (Claude Code için)

Bu dosya projenin kök klasöründe durur. Claude Code her oturumun başında bunu okur.
Kullanıcı: Emre. Türkçe konuş, adım adım ve çok basit anlat (5 yaşındaki çocuğa anlatır gibi).

## Ürün
- **Ne:** Spor ve alışkanlıkları "oynanan" bir deneyime çeviren mobil uygulama.
- **Konum:** "Takip uygulaması değil, oynadığın bir uygulama." Özdisiplin (ozdisiplin.com) gibi uygulamaların modüllerini
  etkileşimli, dokunulan nesnelere çeviriyoruz. Onların metinlerini, isimlerini ve ekran düzenlerini KOPYALAMA.
- **Hedef platform:** iPhone önce (App Store), sonra Android.
- **Referans:** `reference/ritim-web.html` dosyası, şimdiye kadar web'de yaptığımız prototip. Tasarımları ve mantığı oradan taşı.

## Teknoloji
- Expo (React Native) + TypeScript + expo-router
- Bildirim: expo-notifications (yerel bildirimler: su, meditasyon, uyku hatırlatıcısı)
- Veri: cihazda (expo-sqlite ya da AsyncStorage). Hesap/sunucu sonraki aşama.
- Animasyon: react-native-reanimated; çizim: react-native-svg (gerekirse @shopify/react-native-skia)
- Ses: expo-av / expo-audio; titreşim: expo-haptics
- Test: kullanıcının iPhone'unda Expo Go ile

## Klasör yapısı (öneri)
```
app/            ekranlar (expo-router)
  (tabs)/       bugun, antrenman, odam, profil
  modul/        su, uyku, meditasyon, odak, ruh, hedef, kardiyo, vucut
src/components  ortak bileşenler (Kart, Sekme, Halka, Grafik...)
src/modules     her modülün mantığı ve verisi ayrı klasörde
src/theme       renkler, yazı tipleri, boşluklar (tasarım sistemi)
src/data        egzersizler, içecekler, alışkanlık şablonları
```

## Tasarım dili (her ekranda kontrol et)
1. **Her modül gerçek bir nesne:** su = dolan şişe / ince belli çay bardağı, odak = kum saati, kilo = ibreli tartı, günlük = çizgili defter.
2. **Her dokunuşun karşılığı var** (animasyon, ses, titreşim) ama kayıt **tek dokunuş** kalır.
3. **Gerçek dünya kuralları:** gerçek fizik, gerçek değerler, hile yok.
4. **Yerli ve tanıdık:** çay, ayran, şalgam, damacana, puantaj kartı.
5. **Premium koyu tema:** siyaha yakın zemin, yumuşak köşeli kartlar, her modülün kendi rengi, büyük kalın rakamlar. Çocuksu değil.
6. **Suçlamayan dil:** "başarısız" yok; "az kalsın", "tempondasın". Kullanıcıya "sen" de.
7. **"Şunu fark ettim":** kayıtlardan kişisel tespit çıkar (en az 3 veri olmadan sonuç söyleme).
8. **Her şey Odam'a akar:** modüller odaya eşya/ilerleme kazandırır.
9. **Sade ilk ekran, derinlik sekmelerde** (Bugün · İstatistik · Oyun). Sayfa aşağı uzayıp gitmesin.
10. **Bitmeden geçilmez:** bir modül etkileşimli ve hatasız olmadan sıradakine geçme.
11. **Araştırmaya dayan:** sağlıkla ilgili her değer ve öneri için güvenilir kaynağa bak; kanıt zayıfsa "sınırlı kanıt" diye belirt. Tıbbi tavsiye verme.

## Çekirdek modüller (ilk sürüm)
Bugün (alışkanlık kartları), Antrenman (kas haritası, hareket kütüphanesi), Odam, Su, Uyku, Meditasyon, Odak, Ruh hali+Günlük, Hedefler+Meydan okuma, Kardiyo, Vücut (tartı+ölçü+foto).
Laboratuvar (sonra): ilaç, döngü, hasta gün (sağlık verisi → KVKK açık rıza gerekir), kalori, oruç, harcama, mesai, cilt, makyaj, rüya, yaşam çarkı, sigara.

## Tamamlanan modül özellikleri (prototipte var, taşınacak)
### Su
- İçecek kategorileri: Gazsız / Gazlı / Sıcak; her içeceğin kabı farklı (şişe, ince belli çay bardağı, fincan, kupa, kutu, bardak).
- Şişe boyu: 0,5 / 1 / 1,5 L, matara, 5 L, damacana (19 L) + damacana bitiş tahmini.
- **Su değeri:** su/maden %100, çay/ayran/şalgam %90, kahve/kola/meyve suyu %80, enerji içeceği %60 (yaklaşık oranlar).
- Kafein (yetişkin üst sınır ~400 mg/gün) ve şeker (DSÖ ideal <25 g/gün) uyarısı.
- Bugünün karışım çubuğu, gruplu liste (Çay 6× · −/+), tempo çizgisi, sık içilenlerden tek dokunuşla ekleme.
- Hatırlatıcı: saat aralığı + sıklık → **expo-notifications ile yerel bildirim**.
- Şişe çevirme oyunu (fizik): açısal momentum korunur; su havada uçlara yayılır → eylemsizlik momenti artar → dönüş yavaşlar.
  İnişte ağırlık merkezi yüksekliği ve devrilme açısı kontrol edilir. ⅓ dolu en kolay, boş seker, dolu devrilir.
  Dibine iniş 1 puan, kapağa iniş 2 puan. Güç çubuğu YOK (hile olur). Şişeyi tutup savurarak fırlat.
### Meditasyon (araştırmaya dayalı)
- Teknikler: Döngüsel iç çekiş (Balban ve ark. 2023, Cell Reports Medicine: günde 5 dk, ruh halini farkındalıktan çok iyileştirdi),
  dakikada 6 nefes 5-5 ve 4-6 (HRV'yi kutu ve 4-7-8'den çok artırdı, 2025), Kutu ve 4-7-8 ("sınırlı kanıt" etiketiyle).
- "8 hafta, günde 13 dk" programı (Basso ve ark. 2019: etki 8. haftada görüldü, 4. haftada görülmedi).
- Seans öncesi/sonrası his (5 basamak), tekniklerin kişisel karşılaştırması, zen bahçesi (her seans bir taş).
- Güvenlik notu: meditasyon yapanların ~%8'i istenmeyen etki yaşayabiliyor (en sık kaygı) → "durmak normal" mesajı.

## Çalışma kuralları
- Her değişiklikten sonra Expo Go'da telefonda dene; hatayı kullanıcı göstermeden yakalamaya çalış.
- Bir seferde tek modül. Önce plan, sonra kod, sonra test.
- Kullanıcıya her adımı Türkçe, kısa ve net anlat.
