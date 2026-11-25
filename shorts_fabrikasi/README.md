# 🎬 Shorts Fabrikası

Merak uyandıran bilgi videolarını (Shorts / Reels / TikTok) **otomatik** üreten sistem.
Her video: dikey 1080×1920, 30 fps, yaklaşık 60 saniye, Türkçe, 3D animasyonlu,
karaoke altyazılı. Ses tasarımı tamamen kodla sentezlenir.

İlk konu: **Türkiye'nin En Yüksek 10 Dağı**

---

## 1. Fabrika nasıl çalışır? (5 yaşındaki çocuğa anlatır gibi)

Bir videoyu bir **çizgi film stüdyosu** gibi düşün. Stüdyoda 4 kişi çalışıyor:

| Stüdyo çalışanı | Ne yapar? | Dosya |
|---|---|---|
| ✍️ **Senarist** | Ne anlatılacağını yazar: başlık, dağlar, cümleler | `konular/001-....json` |
| 🎙️ **Ses ustası** | Metni Google'ın sesiyle okutur. Müziği, rüzgârı ve "vuuş" geçiş seslerini matematikle üretir | `motor/ses.py` |
| 🎨 **Animatör** | Dağları 3D olarak sıfırdan çizer, kamerayı uçurur, yazıları hareket ettirir | `motor/sahne.js` + `sahne.html` |
| 🎞️ **Kurgucu** | Her kareyi fotoğraflar, sesle birleştirip MP4 yapar | `motor/render.js` |

**Patron** `uret.py` dosyası: sırayla hepsine "şimdi sen çalış" der.

### Animasyon nasıl yapılıyor?
Bir video aslında saniyede 30 fotoğraftır. Animatörümüz her fotoğrafı şu soruyla çizer:
*"Saat şu an kaç saniye?"* Örneğin 12,5. saniyede kamera nerede olmalı, sayaç kaçı
göstermeli, hangi kelime sarı yanmalı? Her şey sadece zamana göre hesaplandığı için
aynı konu her seferinde birebir aynı videoyu verir. Buna **deterministik render** denir.

### Dağlar nasıl çiziliyor?
Hazır 3D model yok. Her dağ bir **gürültü fonksiyonundan** (noise) doğar. Düz bir
kâğıdı ortasından yukarı çektiğini düşün. Gürültü fonksiyonu da kenarları rastgele
ama doğal bir şekilde buruşturur. Sonra renk verilir:
- Alçaklar orman yeşili
- Ortası toprak
- Dik yerler kaya
- Tepe karlı

Yanardağlara (Ağrı, Erciyes, Süphan) zirvede bir krater oyulur. Sarp dağlara
(Demirkazık, Cilo) keskin sırtlar eklenir.

### Sesler nasıl üretiliyor? (hiç ses dosyası yok!)
| Ses | Tarif |
|---|---|
| 🌌 Atmosfer | Hafifçe akordu kaydırılmış sinüs dalgaları (pad akorları), yavaşça "nefes alır" |
| 🌬️ Rüzgâr | Pembe gürültü + bant geçiren filtre + yavaş dalgalanma |
| 🥁 Nabız | Frekansı hızla düşen sinüs (kick), dakikada 96 vuruş |
| 💨 Vuuş (geçiş) | Filtresi alçaktan tize kayan gürültü |
| 💥 Darbe (vurgu) | 38 Hz'e düşen alt bas + gürültü patlaması + sentetik yankı |
| ⏫ Gerilim | #1'den önce tizleşen ton ve gürültü (riser) |
| ✨ Parıltı | FM sentezle çan sesi (zirve anı) |
| 🔢 Sayaç tıkları | Rakamlar sayarken kısa "tık"lar |

Konuşma başlayınca müzik otomatik kısılır (**ducking**). Sonunda ses, platform
standardı olan **-14 LUFS** seviyesine getirilir.

---

## 2. Kurulum (kendi bilgisayarında)

1. **Python 3.10+** ve **Node.js 20+** kur.
2. **ffmpeg** kur (Windows: `winget install ffmpeg`, Mac: `brew install ffmpeg`).
3. Komut satırında:
   ```bash
   pip install numpy scipy
   cd shorts_fabrikasi/motor
   npm install
   npm install playwright
   npx playwright install chromium
   ```

## 3. Google seslendirme anahtarı

1. https://console.cloud.google.com → yeni proje oluştur.
2. "APIs & Services" → **Cloud Text-to-Speech API** → *Enable*.
3. "Credentials" → *Create credentials* → **API key**. Güvenlik için anahtarı sadece
   Text-to-Speech API ile sınırla.
4. Anahtarı **asla** sohbete, koda veya GitHub'a yazma. Şu yerlere koy:
   - **Kendi bilgisayarında:** ortam değişkeni olarak.
     Windows: `setx GOOGLE_TTS_API_KEY "anahtar"` · Mac/Linux: `export GOOGLE_TTS_API_KEY=anahtar`
   - **GitHub otomasyonu için:** depo → *Settings* → *Secrets and variables* → *Actions* →
     *New repository secret* → adı `GOOGLE_TTS_API_KEY`.
   - **Claude bulut oturumunda:** ortamın ayarlarındaki *network secrets* bölümüne,
     `texttospeech.googleapis.com` için, başlık adı `X-Goog-Api-Key`.

Anahtar yoksa sistem durmaz. Robotik bir test sesiyle (espeak) devam eder, böylece
görüntüyü ve zamanlamayı yine kontrol edebilirsin. Ses seçimi `ayarlar.json` içinde.
En doğal ses için `tr-TR-Chirp3-HD-Charon` dene.

## 4. Kullanım

```bash
python3 shorts_fabrikasi/uret.py              # kuyruktaki sıradaki konuyu üret
python3 shorts_fabrikasi/uret.py --konu 001   # belirli konuyu üret
python3 shorts_fabrikasi/uret.py --onizleme   # sadece 5 kare (10 saniyede kontrol)
python3 shorts_fabrikasi/uret.py --hepsi      # bekleyen tüm konular
```

Çıktı `videolar/<konu>/` klasörüne gider:
- `video.mp4`
- `kapak.jpg`
- `altyazi.srt`
- `aciklama.txt` (başlık + hashtag)

## 5. Sürekli ve otomatik üretim

`.github/workflows/gunluk-shorts.yml` her gün **16:17**'de GitHub'ın bilgisayarında
çalışır. Kuyrukta henüz üretilmemiş ilk konuyu alır, videoyu üretir ve
*Actions → ilgili çalışma → Artifacts* altına koyar. Oradan indirirsin.

Yani senin tek işin **`konular/` klasörüne yeni konu eklemek**. Fabrika her gün bir
tane alır.

## 6. Yeni konu eklemek

`konular/001-...json` dosyasını kopyala, numarasını artır (`002-...`), alanları doldur:

| Alan | Ne yazılır? |
|---|---|
| `giris` | Videonun ilk cümlesi. **En önemli cümle bu**: ilk 2 saniyede merak uyandırmalı |
| `ogeler` | 10'dan 1'e sıralı liste: `ad`, `yer`, `deger`, `sekil` (`volkan` / `sarp` / `kalkan`), `metin` |
| `kapanis` | Yorum yaptıracak bir soru |
| `not` | Doğruluk notu (ekranın altında küçük görünür) |
| `kaynaklar` | Bilgiyi nereden aldığın (açıklamaya eklenir) |

Altın kurallar:
- Bir öğenin metni **1 kısa cümle + sayı** olsun. Uzun metin = uzun video = izleyici kaçar.
- Toplam metin yaklaşık **130 kelimeyi** geçmesin. Bu da yaklaşık 60 saniye eder.
- Bilgiyi mutlaka **doğrula**. Bilgi kanallarını büyüten şey güvendir.

> Şu an görsel tema olarak **dağ** (`"tema": "dag"`) hazır. Göller, binalar,
> hayvanlar gibi başka konular için yeni 3D temalar eklenebilir (bkz. 7. bölüm).

## 7. Yol haritası (sıradaki adımlar)
- [ ] Yeni görsel temalar: `sutun` (her konuya uyan 3D veri sütunları), `gezegen`, `harita`
- [ ] Konu kuyruğunu doldurmak için araştırma yapan zamanlanmış görev
- [ ] YouTube / TikTok'a otomatik yükleme (her platformun kendi izin anahtarı gerekir)
- [ ] Google TTS zaman damgalarıyla (timepoint) kelimesi kelimesine kusursuz altyazı
