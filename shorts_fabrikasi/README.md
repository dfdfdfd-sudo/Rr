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
| 🎙️ **Ses ustası** | Metni yapay zekâ sesiyle (Edge veya Google) okutur. Müziği, rüzgârı ve "vuuş" geçiş seslerini matematikle üretir | `motor/ses.py` |
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
   pip install numpy scipy edge-tts
   cd shorts_fabrikasi/motor
   npm install
   npm install playwright
   npx playwright install chromium
   ```

## 3. Seslendirme (anahtar gerekmez!)

Sistem sesi şu sırayla seçer (`ayarlar.json` → `"tts": "auto"`):

| Sıra | Ses motoru | Anahtar? | Kalite |
|---|---|---|---|
| 1 | **Google Cloud TTS** | Gerekir (`GOOGLE_TTS_API_KEY`) | Çok iyi |
| 2 | **Microsoft Edge neural** | **Gerekmez, ücretsiz** | Çok iyi |
| 3 | espeak-ng | Gerekmez | Robotik, sadece test için |

Yani hiçbir şey yapmasan bile Edge sesi kullanılır: `tr-TR-AhmetNeural` (erkek) veya
`tr-TR-EmelNeural` (kadın). Sesi `ayarlar.json` içinde `edge_ses` satırından değiştirirsin.

Not: Edge sesi Microsoft'un resmi olmayan ücretsiz servisidir. Bir gün değişirse
sistem otomatik olarak bir sonraki motora geçer. Google anahtarını sonradan eklemek
istersen:
1. https://console.cloud.google.com → **Cloud Text-to-Speech API** → *Enable* → *Credentials* → **API key**.
2. Anahtarı asla koda veya sohbete yazma. GitHub'da *Settings → Secrets → Actions* altına
   `GOOGLE_TTS_API_KEY` adıyla ekle. Kendi bilgisayarında bunu ortam değişkeni olarak tanımla.

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
