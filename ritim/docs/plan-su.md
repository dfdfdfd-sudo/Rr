# Su modülü — Plan

Durum: **onaylandı** (2026-11-26). Kararlar en altta.
Kaynak: `reference/ritim-web.html` (SU 2.0 bölümü, satır ~1038–1260) + aşağıdaki araştırma.

## Hedef (tek cümle)
Su içmeyi "rakam yazmak" değil, **gerçek bir kabı doldurmak** gibi hissettiren, tek dokunuşla kayıt alan,
araştırmaya dayalı bir modül.

## Ekran düzeni (Tasarım dili #9: sade ilk ekran, derinlik sekmelerde)
Üstte 3 sekme: **Bugün · İstatistik · Oyun**

### 1) Bugün
- Solda büyük **kap** (seçili içeceğin kabı), sağda büyük rakam: `1,25 L / hedef 2,0 L` + kalan.
- **Tempo çizgisi:** "Tempondasın" / "0,4 L gerideysin" (suçlamayan dil).
- Kategori: **Gazsız · Gazlı · Sıcak** → içecek çipleri (renk noktalı).
- İçecek "Su" ise **şişe boyu**: 0,5 L · Matara · 1 L · 1,5 L · 5 L · Damacana.
- **3 porsiyon düğmesi** (tek dokunuşla kayıt): Bir yudum · Bir bardak / Yarım fincan · Hepsini içtim / 1 kutu.
- "Son kaydı geri al".
- **Sık içtiklerin** (son 14 gün, ilk 3) → tek dokunuşla ekle.
- **Bugünün karışımı** çubuğu + gruplu liste (`Çay 6× · − / +`), istenirse saat saat liste.
- **Kafein / şeker kartı** (yalnızca o gün kafein ya da şeker varsa görünür).
- **Damacana kartı** (damacana seçiliyken): kalan litre + "bu hızla N gün sonra biter".
- **Hatırlatıcı** ayarı (aşağıda).

### 2) İstatistik
- Bu haftanın **rafı** (içilen her şişe rafa dizilir).
- Son 7 gün sütun grafiği (hedefe ulaşan gün yeşil).
- Günlük hedef ayarı (− / +) ve kiloya göre öneri.
- Rozetler: 7 gün seri · Altın şişe (ilk hedef) · Damacana bitirdin · Kafeinsiz hedefli gün · Çevirme ustası.
- "Şunu fark ettim" kartı: **kahve ve uyku** (en az 3+3 gün veri yoksa sonuç söylemez; Uyku modülü gelince açılır).

### 3) Oyun — Şişe çevirme
- Şişeyi parmakla tut → savur → bırak. **Güç çubuğu yok.**
- Fizik: havada açısal momentum korunur; su uçlara yayılınca eylemsizlik momenti artar, dönüş yavaşlar.
  İnişte ağırlık merkezi yüksekliği ve devrilme açısı kontrol edilir. ⅓ dolu en kolay, boş seker, dolu devrilir.
- Puan: dibine iniş 1, kapağa iniş 2. Seri, rekor, günlük görev (3 kez art arda).
- Doluluk seçimi (Boş · %20 · ⅓ · Yarım · %75 · Dolu), zemin (Masa · Raf kenarı 🔒3 · Buzdolabı 🔒6),
  altın şişe (ilk su hedefinde açılır).

## Araştırma kontrolü (Tasarım dili #11)
| Konu | Prototipte | Kaynak ne diyor | Öneri |
|---|---|---|---|
| Su değeri | Çay/ayran %90, kahve/kola/meyve suyu %80, enerji %60 | Maughan ve ark. 2016 (AJCN, 13 içecek): **kahve, çay, kola, meyve suyu, maden suyu sudan farklı değil**; süt ve ORS daha iyi. İçeceğin kendi su oranı: kola/portakal suyu ~%89, kahve ~%99, çay %100. Enerji içeceği test edilmemiş. | Oranları **içeceğin su içeriğine** göre ayarla (çay/kahve ~%100, kola/meyve suyu/ayran ~%90). Kafein ve şeker ayrı uyarı olarak kalsın. → **Karar 1** |
| Günlük hedef | 2,5 L varsayılan, kilo × 33 ml | EFSA 2010: **toplam** su (yemekler dahil) kadın 2,0 L, erkek 2,5 L. Suyun ~%20–30'u yemekten gelir. 33 ml/kg yaygın bir pratik formül ama güçlü kanıtı yok. | Varsayılanı EFSA'ya göre koy, kullanıcı değiştirebilsin. → **Karar 2** |
| Kafein | 400 mg/gün | EFSA 2015: sağlıklı yetişkinde 400 mg/gün sorun yok; tek seferde 200 mg; **yatmaya yakın 100 mg uykuyu etkileyebilir**; hamilelikte 200 mg. | 400 mg sınırı kalsın, akşam kafeini için uyku notu ekle. Hamilelik ayarı sonra. |
| Şeker | DSÖ <25 g ideal | DSÖ 2015: serbest şeker <%10 enerji (~50 g) güçlü öneri, <%5 (~25 g) koşullu öneri. Meyve suyundaki şeker de "serbest şeker". | 50 g = sınır, 25 g = ideal diye iki eşik göster. |
| Çok su | yok | EFSA: böbrek saatte en fazla ~0,7–1,0 L atabilir. | Saatte 1 L'yi geçen kayıtta nazik bir not göster ("yavaş yavaş iç"). Tıbbi tavsiye değil. |

## Teknik plan
- **Veri:** `expo-sqlite`. Tablo `su_kayit(id, tarih, saat, icecek_id, ml, su_degeri_ml, kafein_mg, seker_g, kap)`.
  Ayarlar (hedef, şişe boyu, hatırlatıcı, damacana, oyun rekorları) basit anahtar-değer tablosunda.
- **İçecek listesi:** `src/data/icecekler.ts` (13 içecek + kendi içeceğin). Her içecekte kap tipi, renk, su oranı, kafein ve şeker değeri (100 ml başına) var.
- **Hesaplar:** `src/modules/su/hesap.ts`. Saf fonksiyonlar: su değeri, kafein, şeker, tempo, seri, damacana tahmini, sık içilenler.
  → **birim testleri** (jest) ile kontrol.
- **Çizim:** `react-native-svg` + `react-native-reanimated`. Kap şekilleri prototipteki SVG yollarından taşınır.
  Dolma animasyonu, dalga, gazlı içecekte kabarcık. Telefonu eğince su sallanır (`expo-sensors`).
- **Ses / titreşim:** `expo-audio` (yudum, tıkırtı, düşme sesleri; küçük .wav dosyaları), `expo-haptics`.
- **Hatırlatıcı:** `expo-notifications`. Seçilen saat aralığında her gün tekrar eden **yerel** bildirimler
  (Expo Go'da yerel bildirim çalışır). İzin istenir, reddedilirse uygulama içi "bir şeyler iç" kartı yine çalışır.
- **Oyun:** fizik motoru `src/modules/su/fizik.ts` içinde saf TypeScript olarak yazılır (test edilebilir).
  Çizim `@shopify/react-native-skia`, dokunma `react-native-gesture-handler` ile.

## Adımlar (her adım sonunda: tip kontrolü + test + ekran görüntüsü + commit)
1. **Veri temeli:** içecek listesi, SQLite deposu, hesap fonksiyonları + birim testleri.
2. **Kap bileşeni:** tüm kap şekilleri, dolma animasyonu, dalga, kabarcık, eğince sallanma.
3. **Bugün sekmesi:** kayıt düğmeleri, geri al, karışım, gruplu liste, tempo, sık içilenler, kafein/şeker, damacana.
   Bugün ekranındaki Su kartı küçük bir şişe gösterir.
4. **Ses + titreşim.**
5. **Hatırlatıcı** (yerel bildirim + uygulama içi uyarı kartı).
6. **İstatistik sekmesi:** raf, 7 gün, hedef ayarı, rozetler, kendi içeceğini ekleme.
7. **Oyun sekmesi:** şişe çevirme (en büyük adım; önce fizik + testler, sonra çizim).
8. **Son kontrol:** baştan sona deneme, Emre'nin iPhone'unda Expo Go testi, hataları düzeltme.

## Bilerek sonraya bırakılanlar
- "Spor yaptığım gün +500 ml": Antrenman modülü gelince eklenecek.
- Kahve ↔ uyku tespiti: Uyku modülü gelince açılacak (kart şimdiden yerinde, veri yokken susar).
- Odam bağlantısı (su içtikçe canlanan bitki): Odam modülünde. Su modülü gereken veriyi ("hedef tutulan gün sayısı") şimdiden sağlar.

## Kararlar (Emre, 2026-11-26)
1. **Su değeri: araştırmaya göre.** İçeceğin kendi su oranı sayılır: su, maden suyu, soda, çay, kahve, bitki çayı ~%100;
   kola, gazoz, meyve suyu, ayran, şalgam ~%90. Enerji içeceği test edilmedi, o yüzden su oranına göre ~%90 sayılır ve "sınırlı kanıt" notu konur.
   Kafein ve şeker ayrı uyarı olarak gösterilir.
2. **Hedef: EFSA'ya göre.** Varsayılan 2,0 L (içecekten gelen kısım). Kilo girilirse "kilo × 33 ml" sadece **öneri** olarak,
   "sınırlı kanıt" etiketiyle gösterilir. Kullanıcı hedefi her zaman elle değiştirebilir.
