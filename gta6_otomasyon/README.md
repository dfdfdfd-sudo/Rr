# 🎮 GTA 6 Viral Video Fabrikası

Bu klasör bir **video fabrikası**. Sen düğmeye basıyorsun, o sana her video için
hazır bir paket veriyor: senaryo, seslendirme metni, açıklama, etiketler, altyazı,
küçük resim fikri ve yükleme takvimi.

> GTA 6, **19 Kasım 2026**'da PS5 ve Xbox Series X|S için çıktı. PC tarihi henüz
> açıklanmadı. Çıkıştan sonraki ilk haftalar GTA videoları için en büyük fırsat,
> çünkü herkes aynı anda arama yapıyor.

---

## 1. Bu fabrika nasıl çalışır? (5 yaşındaki çocuğa anlatır gibi)

Bunu bir **pasta tarifi** gibi düşün:

| Parça | Benzetme | Dosya |
|---|---|---|
| Malzemeler | Konu fikirleri | `konular.json` |
| Aşçı | Program | `uret.py` |
| Pastalar | Her videonun paketi | `cikti/<konu>/` |
| Doğum günü takvimi | Hangi gün ne yüklenecek | `cikti/yayin_takvimi.csv` |

Malzemeyi (konuyu) sen değiştirirsin, aşçı (program) her seferinde aynı düzende
pişirir. Bu sayede 10 video da yapsan 100 video da yapsan hepsi düzenli çıkar.

## 2. Kurulum (sadece bir kere)

1. Bilgisayarına **Python 3** kur: https://www.python.org/downloads/
   (Windows'ta kurarken "Add Python to PATH" kutusunu işaretle.)
2. Komut satırını aç (Windows: Başlat'a `cmd` yaz) ve ses aracını kur:
   ```
   pip install edge-tts
   ```
   `edge-tts`, Microsoft'un ücretsiz Türkçe yapay zekâ sesidir. Hesap veya şifre istemez.

## 3. Kullanım

Klasörün içindeyken:

```bash
python3 uret.py                    # 10 videonun hepsini üretir
python3 uret.py --konu 05          # sadece 05 numaralı videoyu üretir
python3 uret.py --konu 05 --ses    # 05'in sesini de üretir (ses.mp3)
python3 uret.py --baslangic 2026-12-01 --saat 20:00   # takvimi değiştirir
```

Windows'ta `python3` yerine `python` yazman gerekebilir.

## 4. ⚠️ En önemli kural: `[DOLDUR]` yerleri

Senaryolarda `[DOLDUR: ...]` yazan yerler var. Bunları **bilerek boş bıraktım**.
Nedeni şu: bir GTA videosunu viral yapan şey, **senin oyunda kendi gözünle
gördüğün** detaylardır. Ben oyunun içini görmediğim için oraya uydurma bilgi
yazsaydım, yorumlarda "yalan söylüyorsun" denir ve kanal güvenini kaybeder.

Yani iş bölümü şöyle:
- **Ben:** konu, başlık, kanca, sunucu dili, akış, açıklama, etiket, takvim.
- **Sen:** oyunu oyna, bulduğun gerçek detayları `[DOLDUR]` yerlerine yaz.

Program her video için kaç tane `[DOLDUR]` kaldığını söyler. Hepsi bitince
`HAZIR` yazar ve ses üretimi açılır. (Zorla üretmek için `--zorla` ekle.)

Şu anki senaryolar 35 saniye ile 1,5 dakika arası, çünkü bunlar **iskelet**.
Her `[DOLDUR]`'u 3-5 cümleyle doldurduğunda videolar 8-12 dakikaya çıkar.
Bu süre YouTube'da reklam ekleme ve önerilme için en iyi aralık.

## 5. Bir videoyu baştan sona yapma adımları

1. `cikti/05-npc-takip/senaryo.md` dosyasını aç, oku.
2. Oyunu aç, "🎬 GÖRÜNTÜ" notlarına göre görüntü kaydet
   (PS5: Create tuşu, Xbox: Xbox tuşu → Yakala).
3. `konular.json` içindeki `[DOLDUR]` yerlerini doldur.
4. `python3 uret.py --konu 05 --ses` çalıştır. `ses.mp3` gelir.
   (İstersen kendi sesinle oku. Kendi sesin daha samimi olur ve genelde daha çok izlenir.)
5. **CapCut** veya **DaVinci Resolve** (ikisi de ücretsiz) aç:
   görüntü + `ses.mp3` + `altyazi.srt` dosyalarını sürükle bırak.
6. `kucuk_resim.txt`'deki fikirle küçük resmi Canva'da yap.
7. YouTube'a yükle: başlık = senaryodaki 1. seçenek,
   açıklama = `aciklama.txt`, etiketler = `etiketler.txt`.
8. Ertesi gün aynı videodan bir **Shorts** kes (`senaryo.md` sonunda nasıl yapılacağı yazıyor).

## 6. Viral olmanın 6 altın kuralı

1. **İlk 3 saniye her şeydir.** Logo, "Merhaba arkadaşlar" yok. Doğrudan kanca ile başla.
2. **Başlık + küçük resim bir ikilidir.** İkisi aynı şeyi söylememeli, birbirini tamamlamalı.
   Başlık "15 Gizli Detay" diyorsa küçük resim "BUNU GÖRDÜN MÜ?" diye sorar.
3. **Her 30-60 saniyede bir yenilik.** Görüntü, müzik veya konu değişmeli, yoksa izleyici kaçar.
4. **Sonda soru sor.** Yorum sayısı YouTube'a "bu video konuşuluyor" sinyali verir.
5. **Düzenli yükle.** Takvim iki günde bir uzun video, arada Shorts öneriyor.
6. **Hız.** Çıkıştan sonraki ilk 2-3 ay en sıcak dönem. Mükemmeli bekleme, yükle.

## 7. Telif ve güvenlik

- Kendi oyun kayıtlarını yorum yaparak kullanmak YouTube'da yaygındır.
  Uzun, yorumsuz ara sahne (cutscene) yüklemek ise telif şikâyeti alabilir.
- Rockstar'ın resmi logosunu ve kapak görsellerini küçük resimde kullanma.
- Sızıntı (leak) içeriği kullanma. Hem Rockstar kaldırtır hem kanala yasak gelebilir.
- Hikâye videolarında başlıkta ve ilk saniyede **SPOILER** uyarısı ver.

## 8. Yeni konu eklemek

`konular.json`'daki bir konuyu kopyala, `id`'sini değiştir (`11-...`), metinleri
yaz, programı tekrar çalıştır. Hepsi bu.
