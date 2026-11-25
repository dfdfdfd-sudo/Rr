#!/usr/bin/env python3
"""GTA 6 YouTube video üretim otomasyonu.

konular.json içindeki her konu için şunları üretir (cikti/<konu-id>/):
  senaryo.md      -> Sunucu için tam senaryo (görüntü notlarıyla)
  seslendirme.txt -> Sadece okunacak metin (yapay ses için)
  aciklama.txt    -> YouTube açıklaması + zaman damgaları + hashtag
  etiketler.txt   -> Virgülle ayrılmış etiketler
  altyazi.srt     -> Tahmini zamanlı altyazı
  kucuk_resim.txt -> Küçük resim (thumbnail) yazısı ve fikri
  ses.mp3         -> (isteğe bağlı, --ses) Türkçe yapay zekâ seslendirmesi
Ayrıca cikti/yayin_takvimi.csv dosyasına yükleme takvimi yazar.

Kullanım:
  python3 uret.py                 # hepsini üret
  python3 uret.py --konu 05       # sadece id'si 05 ile başlayanı üret
  python3 uret.py --ses           # seslendirmeyi de üret (edge-tts gerekir)
  python3 uret.py --baslangic 2026-11-27 --saat 19:00
"""
import argparse
import asyncio
import csv
import datetime as dt
import json
import re
import shutil
from pathlib import Path

KLASOR = Path(__file__).resolve().parent
KELIME_SANIYE = 2.5  # Ortalama Türkçe anlatım hızı: dakikada ~150 kelime
SES = "tr-TR-AhmetNeural"  # Kadın ses için: tr-TR-EmelNeural
DOLDUR = re.compile(r"\[DOLDUR[^\]]*\]")


def parcalar(konu):
    """Videonun konuşulan parçalarını sırayla verir: (başlık, metin, görüntü)."""
    yield "Kanca", konu["kanca"], "İlk 3 saniyede en çarpıcı görüntü. Asla logo/intro ile başlama."
    for b in konu["bolumler"]:
        yield b["baslik"], b["anlatim"], b.get("goruntu", "")
    yield "Kapanış", konu["kapanis"], "Bitiş ekranı: bir sonraki video + abone ol butonu."


def sure(metin):
    return len(metin.split()) / KELIME_SANIYE


def zaman(sn, srt=False):
    sn = max(0.0, sn)
    s, ms = int(sn), int((sn - int(sn)) * 1000)
    if srt:
        return f"{s // 3600:02}:{s % 3600 // 60:02}:{s % 60:02},{ms:03}"
    return f"{s // 60}:{s % 60:02}"


def cumleler(metin):
    return [c.strip() for c in re.split(r"(?<=[.!?…])\s+", metin) if c.strip()]


def uret(konu, hedef):
    hedef.mkdir(parents=True, exist_ok=True)
    liste = list(parcalar(konu))

    # 1) Senaryo
    s = [f"# {konu['basliklar'][0]}\n",
         f"**Neden viral olur?** {konu['viral_neden']}\n",
         "**Başlık seçenekleri (A/B testi için):**"]
    s += [f"{i}. {b}" for i, b in enumerate(konu["basliklar"], 1)]
    s.append("")
    t, damgalar = 0.0, []
    for baslik, metin, goruntu in liste:
        damgalar.append((t, baslik))
        s += [f"## [{zaman(t)}] {baslik}", f"> 🎬 GÖRÜNTÜ: {goruntu}" if goruntu else "", "", metin, ""]
        t += sure(metin)
    s += [f"---\n**Tahmini süre:** {zaman(t)} (dakikada ~150 kelime)",
          f"\n**Shorts için:** {konu['shorts_kesiti']}"]
    (hedef / "senaryo.md").write_text("\n".join(s), encoding="utf-8")

    # 2) Seslendirme metni
    ses_metni = "\n\n".join(m for _, m, _ in liste)
    (hedef / "seslendirme.txt").write_text(ses_metni, encoding="utf-8")

    # 3) Açıklama
    a = [konu["kanca"], "", "⏱️ Bölümler:"]
    a += [f"{zaman(z)} {b}" for z, b in damgalar]
    a += ["", "👇 Senin bulduğun bir şey varsa yorumlara yaz!",
          "🔔 Yeni GTA 6 videoları için abone ol ve bildirimleri aç.", "",
          " ".join("#" + e.replace(" ", "") for e in konu["etiketler"][:3])]
    (hedef / "aciklama.txt").write_text("\n".join(a), encoding="utf-8")

    # 4) Etiketler ve küçük resim
    (hedef / "etiketler.txt").write_text(", ".join(konu["etiketler"]), encoding="utf-8")
    (hedef / "kucuk_resim.txt").write_text(
        f"YAZI: {konu['kucuk_resim_yazi']}\nFİKİR: {konu['kucuk_resim_fikir']}\n"
        "KURAL: En fazla 3-4 kelime, kocaman yazı, yüz ifadesi, yüksek kontrast. "
        "Rockstar'ın resmi logosunu veya kapak görselini kullanma.\n", encoding="utf-8")

    # 5) Altyazı (cümle cümle, tahmini zaman)
    srt, t, n = [], 0.0, 1
    for _, metin, _ in liste:
        for c in cumleler(metin):
            d = sure(c)
            srt.append(f"{n}\n{zaman(t, True)} --> {zaman(t + d, True)}\n{c}\n")
            t, n = t + d, n + 1
    (hedef / "altyazi.srt").write_text("\n".join(srt), encoding="utf-8")

    eksik = len(DOLDUR.findall(ses_metni))
    return t, eksik, ses_metni


async def seslendir(metin, dosya):
    import edge_tts
    await edge_tts.Communicate(metin, SES, rate="+8%").save(str(dosya))


def main():
    p = argparse.ArgumentParser(description="GTA 6 YouTube video üretici")
    p.add_argument("--konu", help="Sadece bu id ile başlayan konuyu üret (örn: 05)")
    p.add_argument("--ses", action="store_true", help="edge-tts ile ses.mp3 üret")
    p.add_argument("--zorla", action="store_true", help="[DOLDUR] kalsa bile sesi üret")
    p.add_argument("--baslangic", default=(dt.date.today() + dt.timedelta(days=1)).isoformat())
    p.add_argument("--saat", default="19:00", help="Yayın saati (Türkiye saati)")
    p.add_argument("--aralik", type=int, default=2, help="Uzun videolar arası gün")
    p.add_argument("--cikti", default=str(KLASOR / "cikti"))
    x = p.parse_args()

    konular = json.loads((KLASOR / "konular.json").read_text(encoding="utf-8"))
    if x.konu:
        konular = [k for k in konular if k["id"].startswith(x.konu)]
        if not konular:
            raise SystemExit(f"'{x.konu}' ile başlayan konu bulunamadı.")
    cikti = Path(x.cikti)
    gun = dt.date.fromisoformat(x.baslangic)
    takvim = []

    for i, konu in enumerate(konular):
        hedef = cikti / konu["id"]
        uzunluk, eksik, metin = uret(konu, hedef)
        durum = "HAZIR" if eksik == 0 else f"{eksik} adet [DOLDUR] var"
        print(f"✔ {konu['id']:<24} ~{zaman(uzunluk)} dk  | {durum}")

        if x.ses:
            if eksik and not x.zorla:
                print("   ↳ ses atlandı: önce seslendirme.txt içindeki [DOLDUR] yerlerini doldur (ya da --zorla)")
            else:
                try:
                    asyncio.run(seslendir(DOLDUR.sub("", metin), hedef / "ses.mp3"))
                    print("   ↳ ses.mp3 hazır")
                except ImportError:
                    print("   ↳ edge-tts yok. Kur: pip install edge-tts")
                except Exception as e:  # ağ hatası vb.
                    (hedef / "ses.mp3").unlink(missing_ok=True)
                    print(f"   ↳ ses üretilemedi (internet bağlantını kontrol et): {e}")

        yayin = gun + dt.timedelta(days=i * x.aralik)
        takvim.append([yayin.isoformat(), x.saat, "Uzun video", konu["basliklar"][0], konu["id"]])
        takvim.append([(yayin + dt.timedelta(days=1)).isoformat(), x.saat, "Shorts",
                       konu["shorts_kesiti"], konu["id"]])

    if not x.konu:
        with open(cikti / "yayin_takvimi.csv", "w", newline="", encoding="utf-8-sig") as f:
            w = csv.writer(f)
            w.writerow(["Tarih", "Saat", "Tür", "Başlık / Fikir", "Klasör"])
            w.writerows(sorted(takvim))
        print(f"\n📅 Takvim: {cikti / 'yayin_takvimi.csv'}")
    if x.ses and not shutil.which("ffmpeg"):
        print("ℹ️ Video montajı için ffmpeg veya CapCut/DaVinci Resolve kullanabilirsin.")


if __name__ == "__main__":
    main()
