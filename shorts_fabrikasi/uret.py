#!/usr/bin/env python3
"""Shorts/Reels/TikTok fabrikası — ana program.

  python3 uret.py                 # kuyruktaki sıradaki (henüz üretilmemiş) konuyu üret
  python3 uret.py --konu 001      # belirli bir konuyu üret
  python3 uret.py --hepsi         # üretilmemiş bütün konuları üret
  python3 uret.py --onizleme      # video yerine 5 önizleme karesi üret (hızlı kontrol)

Ayarlar ayarlar.json içinde (ses, hız, TTS kaynağı).
"""
import argparse
import json
import shutil
import subprocess
import sys
import time
from pathlib import Path

KOK = Path(__file__).resolve().parent
sys.path.insert(0, str(KOK / "motor"))
import ses  # noqa: E402


def konulari_bul():
    return sorted(KOK.glob("konular/*.json"))


def uretildi_mi(konu_id):
    return (KOK / "videolar" / konu_id / ".tamam").exists()


def aciklama_yaz(konu, hedef):
    etiket = " ".join("#" + e.replace(" ", "") for e in konu.get("etiketler", []))
    metin = [konu["baslik"] + " 🏔️", "", konu["giris"], ""]
    if konu.get("not"):
        metin += ["ℹ️ " + konu["not"], ""]
    if konu.get("kaynaklar"):
        metin += ["Kaynaklar:"] + konu["kaynaklar"] + [""]
    metin += [etiket + " #shorts #reels #fyp"]
    (hedef / "aciklama.txt").write_text("\n".join(metin), encoding="utf-8")


def uret(dosya, ayar, onizleme=False):
    konu = json.loads(dosya.read_text(encoding="utf-8"))
    kid = konu["id"]
    print(f"\n▶ {kid}: {konu['baslik']}")
    is_klasoru = KOK / ".is" / kid
    if is_klasoru.exists():
        shutil.rmtree(is_klasoru)
    bas = time.time()

    print("  1/3 Seslendirme ve ses tasarımı...")
    cizelge = ses.uret(konu, is_klasoru, ayar)
    print(f"      süre {cizelge['sure']:.1f} sn, ses kaynağı: {cizelge['ses_kaynagi']}")
    if cizelge["ses_kaynagi"] != "google":
        print("      ⚠ Google TTS anahtarı yok: test sesi (espeak) kullanıldı. README'deki 'Google anahtarı' bölümüne bak.")

    print("  2/3 3D render...")
    komut = ["node", str(KOK / "motor" / "render.js"), str(is_klasoru)]
    if onizleme:
        sure = cizelge["sure"]
        komut += ["--onizleme", ",".join(f"{sure * x:.2f}" for x in (0.04, 0.15, 0.45, 0.85, 0.97))]
    subprocess.run(komut, check=True)

    print("  3/3 Paketleniyor...")
    hedef = KOK / "videolar" / kid
    hedef.mkdir(parents=True, exist_ok=True)
    if onizleme:
        for f in is_klasoru.glob("onizleme_*.jpg"):
            shutil.copy(f, hedef / f.name)
    else:
        shutil.copy(is_klasoru / "video.mp4", hedef / "video.mp4")
        # Kapak: #1 sahnesinin ortasından bir kare
        bir = next(s for s in cizelge["sahneler"] if s["tur"] == "oge" and s["oge"]["sira"] == 1)
        subprocess.run(["ffmpeg", "-y", "-loglevel", "error", "-ss", f"{bir['ses_bas'] + 1.8:.2f}", "-i", str(hedef / "video.mp4"),
                        "-frames:v", "1", "-q:v", "2", str(hedef / "kapak.jpg")], check=True)
    shutil.copy(is_klasoru / "altyazi.srt", hedef / "altyazi.srt")
    aciklama_yaz(konu, hedef)
    if not onizleme:
        (hedef / ".tamam").write_text(cizelge["ses_kaynagi"], encoding="utf-8")
    print(f"  ✔ Bitti ({time.time() - bas:.0f} sn) -> {hedef}")


def main():
    p = argparse.ArgumentParser()
    p.add_argument("--konu", help="Konu dosyasının başı (örn. 001)")
    p.add_argument("--hepsi", action="store_true")
    p.add_argument("--onizleme", action="store_true")
    x = p.parse_args()
    ayar = json.loads((KOK / "ayarlar.json").read_text(encoding="utf-8"))

    konular = konulari_bul()
    if x.konu:
        secilen = [k for k in konular if k.name.startswith(x.konu)]
    else:
        bekleyen = [k for k in konular if not uretildi_mi(k.stem)]
        secilen = bekleyen if x.hepsi else bekleyen[:1]
    if not secilen:
        print("Kuyrukta üretilecek konu yok. konular/ klasörüne yeni bir JSON ekle.")
        return
    for k in secilen:
        uret(k, ayar, x.onizleme)


if __name__ == "__main__":
    main()
