"""Ses motoru: seslendirme (Google TTS) + kodla sentezlenen ses tasarımı + miks.

Çıktılar (is_klasoru içine):
  seslendirme/NN.wav  -> her sahnenin konuşması
  miks.wav            -> konuşma + müzik/atmosfer + efektler (48 kHz stereo)
  zaman_cizelgesi.json-> sahnelerin ve altyazı kelimelerinin zamanları
  altyazi.srt
"""
import base64
import json
import os
import re
import shutil
import ssl
import subprocess
import urllib.request
from pathlib import Path

import numpy as np
from scipy import signal
from scipy.io import wavfile

SR = 48000
RNG = np.random.default_rng(7)  # Sabit tohum: aynı konu her seferinde aynı sesi verir

# ----------------------------------------------------------------------------
# 1) SESLENDİRME
# ----------------------------------------------------------------------------

def konusma_metni(metin):
    """Ekranda '3.524' yazar ama TTS'e '3524' gider; yoksa 'üç nokta...' okunabilir."""
    return re.sub(r"(\d)\.(\d{3})", r"\1\2", metin)


def google_tts(metin, dosya, ses_adi, hiz):
    govde = {
        "input": {"text": konusma_metni(metin)},
        "voice": {"languageCode": "tr-TR", "name": ses_adi},
        "audioConfig": {"audioEncoding": "LINEAR16", "sampleRateHertz": SR, "speakingRate": hiz},
    }
    istek = urllib.request.Request(
        "https://texttospeech.googleapis.com/v1/text:synthesize",
        data=json.dumps(govde).encode(), method="POST",
        headers={"Content-Type": "application/json",
                 # Anahtar ortam değişkeninde yoksa bulut ortamının ağ katmanı ekler.
                 "X-Goog-Api-Key": os.environ.get("GOOGLE_TTS_API_KEY", "ortam-tarafindan-eklenir")})
    ca = os.environ.get("SSL_CERT_FILE") or ("/root/.ccr/ca-bundle.crt" if Path("/root/.ccr/ca-bundle.crt").exists() else None)
    ctx = ssl.create_default_context(cafile=ca) if ca else None
    with urllib.request.urlopen(istek, timeout=60, context=ctx) as r:
        veri = json.load(r)
    Path(dosya).write_bytes(base64.b64decode(veri["audioContent"]))  # WAV başlıklı LINEAR16


def espeak_tts(metin, dosya):
    """Çevrimdışı yedek ses (robotik). Sadece test ve zamanlama içindir."""
    subprocess.run(["espeak-ng", "-v", "tr", "-s", "185", "-p", "40", "-w", str(dosya),
                    konusma_metni(metin)], check=True)


def edge_tts(metin, dosya, ses_adi, hiz):
    """Microsoft Edge neural sesi: ücretsiz, anahtar istemez. MP3 üretir, WAV'a çevrilir."""
    import asyncio
    import edge_tts as et
    yuzde = f"{round((hiz - 1) * 100):+d}%"
    mp3 = Path(dosya).with_suffix(".mp3")
    asyncio.run(et.Communicate(konusma_metni(metin), ses_adi, rate=yuzde).save(str(mp3)))
    subprocess.run(["ffmpeg", "-y", "-loglevel", "error", "-i", str(mp3), "-ar", str(SR), "-ac", "1", str(dosya)], check=True)
    mp3.unlink(missing_ok=True)


def tek_ses(motor, metin, dosya, ayar):
    if motor == "google":
        google_tts(metin, dosya, ayar.get("google_ses", "tr-TR-Wavenet-E"), ayar["hiz"])
    elif motor == "edge":
        edge_tts(metin, dosya, ayar.get("edge_ses", "tr-TR-AhmetNeural"), ayar["hiz"])
    else:
        espeak_tts(metin, dosya)


def wav_oku(dosya):
    sr, x = wavfile.read(dosya)
    if x.dtype.kind in "iu":
        x = x.astype(np.float32) / float(np.iinfo(x.dtype).max)
    x = x.astype(np.float32)
    if x.ndim > 1:
        x = x.mean(axis=1)
    if sr != SR:
        g = np.gcd(sr, SR)
        x = signal.resample_poly(x, SR // g, sr // g).astype(np.float32)
    # Baştaki/sondaki sessizliği kırp
    esik = 0.01 * np.abs(x).max()
    idx = np.where(np.abs(x) > esik)[0]
    if len(idx):
        x = x[max(0, idx[0] - 800): idx[-1] + 2400]
    return x / (np.abs(x).max() + 1e-9) * 0.9


def seslendir(sahneler, klasor, ayar):
    klasor.mkdir(parents=True, exist_ok=True)
    kaynak = None
    sesler = []
    for i, s in enumerate(sahneler):
        dosya = klasor / f"{i:02}.wav"
        # Sıra: istenen motor -> (auto ise) Google anahtarı varsa Google, sonra Edge, en son espeak
        if kaynak is None:
            secim = ayar.get("tts", "auto")
            adaylar = {"auto": (["google"] if os.environ.get("GOOGLE_TTS_API_KEY") else []) + ["edge", "espeak"]}.get(secim, [secim])
            for motor in adaylar:
                try:
                    tek_ses(motor, s["metin"], dosya, ayar)
                    kaynak = motor
                    break
                except Exception as e:
                    print(f"  ! {motor} sesi kullanılamadı: {str(e)[:120]}")
                    if len(adaylar) == 1:
                        raise
            if kaynak != adaylar[0]:
                print(f"  ! Ses motoru: {kaynak}")
        else:
            tek_ses(kaynak, s["metin"], dosya, ayar)
        sesler.append(wav_oku(dosya))
    return sesler, kaynak

# ----------------------------------------------------------------------------
# 2) SES TASARIMI — her şey matematikle, örnek (sample) dosyası yok
# ----------------------------------------------------------------------------

def t_ekseni(sure):
    return np.arange(int(sure * SR)) / SR


def zarf(n, atak, bitis):
    """Basit ADSR benzeri zarf: atak süresi boyunca yükselir, sonra üstel söner."""
    t = np.arange(n) / SR
    a = np.clip(t / max(atak, 1e-4), 0, 1)
    return a * np.exp(-t / max(bitis, 1e-4))


def pembe_gurultu(n):
    beyaz = RNG.standard_normal(n)
    b, a = [0.049922035, -0.095993537, 0.050612699, -0.004408786], [1, -2.494956002, 2.017265875, -0.522189400]
    p = signal.lfilter(b, a, beyaz)
    return p / (np.abs(p).max() + 1e-9)


def yansima(x, sure=2.2, islak=0.3):
    """Sentetik oda yansıması (reverb): sönümlenen gürültüden impuls yanıtı."""
    n = int(sure * SR)
    ir = RNG.standard_normal(n) * np.exp(-np.arange(n) / SR * 6.5 / sure)
    ir = signal.sosfilt(signal.butter(2, 6000, "low", fs=SR, output="sos"), ir)
    ir /= np.sqrt((ir ** 2).sum())
    islak_ses = signal.fftconvolve(x, ir)[: len(x)]
    return (1 - islak) * x + islak * islak_ses * 3


def atmosfer(sure, akorlar):
    """Arka plan: yavaşça nefes alan pad akorları + rüzgâr + alt bas."""
    t = t_ekseni(sure)
    n = len(t)
    pad = np.zeros(n)
    akor_suresi = sure / len(akorlar)
    for k, akor in enumerate(akorlar):
        bas, son = int(k * akor_suresi * SR), int(min(n, (k + 1) * akor_suresi * SR + SR * 1.5))
        tt = t[bas:son] - t[bas]
        parca = np.zeros(son - bas)
        for f in akor:
            for d in (-0.12, 0.0, 0.11):  # hafif detune -> geniş, sinematik
                parca += np.sin(2 * np.pi * f * (1 + d / 100) * tt + RNG.uniform(0, 6))
                parca += 0.3 * np.sin(2 * np.pi * 2 * f * tt)
        yumusak = np.minimum(1, np.minimum(tt / 1.5, (tt[-1] - tt) / 1.5 + 1e-3))
        pad[bas:son] += parca * np.clip(yumusak, 0, 1)
    pad *= 0.6 + 0.4 * np.sin(2 * np.pi * 0.11 * t)  # nefes alma (LFO)
    pad = signal.sosfilt(signal.butter(2, 1800, "low", fs=SR, output="sos"), pad)

    ruzgar = pembe_gurultu(n)
    ruzgar_dalga = 0.5 + 0.5 * np.sin(2 * np.pi * 0.07 * t) * np.sin(2 * np.pi * 0.023 * t + 1)
    ruzgar = signal.sosfilt(signal.butter(2, [250, 1400], "band", fs=SR, output="sos"), ruzgar) * ruzgar_dalga

    alt = np.sin(2 * np.pi * akorlar[0][0] / 2 * t) * 0.5
    karisim = pad / (np.abs(pad).max() + 1e-9) * 0.5 + ruzgar * 0.9 + alt * 0.25
    giris_cikis = np.minimum(1, np.minimum(t / 2.5, (sure - t) / 2.0))
    return karisim * np.clip(giris_cikis, 0, 1)


def nabiz(sure, bpm, baslangic):
    """Motion graphics hissi veren yumuşak 'kick' ritmi (giriş sonrasında başlar)."""
    n = int(sure * SR)
    x = np.zeros(n)
    vurus = int(0.35 * SR)
    tt = np.arange(vurus) / SR
    kick = np.sin(2 * np.pi * (45 + 90 * np.exp(-tt * 30)) * tt) * np.exp(-tt * 9)
    adim = 60 / bpm
    t = baslangic
    while t < sure - 3:
        i = int(t * SR)
        x[i:i + vurus] += kick[: len(x[i:i + vurus])]
        t += adim
    return x * 0.5


def whoosh(sure=0.7, yukselen=True):
    n = int(sure * SR)
    g = RNG.standard_normal(n)
    parcalar = 24
    cikti = np.zeros(n)
    pencere = np.hanning(2 * (n // parcalar))
    for k in range(parcalar):
        oran = k / (parcalar - 1)
        fc = 300 * (14 ** (oran if yukselen else 1 - oran))
        sos = signal.butter(2, [fc * 0.6, min(fc * 1.6, 20000)], "band", fs=SR, output="sos")
        bas = max(0, int((k - 0.5) * n / parcalar))
        son = min(n, bas + len(pencere))
        cikti[bas:son] += signal.sosfilt(sos, g[bas:son]) * pencere[: son - bas]
    tt = np.linspace(0, 1, n)
    sekil = np.sin(np.pi * tt ** 0.7) ** 2  # ortada en yüksek, iki uçta sessiz
    return cikti * sekil / (np.abs(cikti).max() + 1e-9)


def darbe(guc=1.0, uzun=1.6):
    """Sinematik 'boom': düşen frekanslı alt bas + gürültü patlaması + yansıma."""
    n = int(uzun * SR)
    tt = np.arange(n) / SR
    bas = np.sin(2 * np.pi * np.cumsum(38 + 120 * np.exp(-tt * 14)) / SR) * np.exp(-tt * 2.6)
    patlama = signal.sosfilt(signal.butter(2, 900, "low", fs=SR, output="sos"), RNG.standard_normal(n)) * np.exp(-tt * 18)
    x = bas * 1.0 + patlama * 0.6
    return yansima(x, 2.0, 0.35) * guc / (np.abs(x).max() + 1e-9)


def tik(frekans=1800, uzun=0.06):
    n = int(uzun * SR)
    tt = np.arange(n) / SR
    return np.sin(2 * np.pi * frekans * tt) * np.exp(-tt * 70) * 0.6


def yukselis(sure=2.5):
    """Büyük finalden önceki gerilim: tizleşen gürültü + yükselen ton (riser)."""
    t = t_ekseni(sure)
    n = len(t)
    f = 120 * (8 ** (t / sure))
    ton = np.sin(2 * np.pi * np.cumsum(f) / SR) + 0.5 * np.sin(2 * np.pi * np.cumsum(f * 1.5) / SR)
    gur = whoosh(sure, True)
    x = (ton * 0.5 + gur) * (t / sure) ** 2
    return x / (np.abs(x).max() + 1e-9)


def parilti(sure=2.0):
    """Zirve anı için çan benzeri parıltı (FM sentez)."""
    t = t_ekseni(sure)
    x = np.zeros(len(t))
    for i, f in enumerate([1318.5, 1760, 2093, 2637]):
        bas = i * 0.07
        tt = np.clip(t - bas, 0, None)
        x += np.sin(2 * np.pi * f * tt + 2.0 * np.sin(2 * np.pi * f * 1.41 * tt) * np.exp(-tt * 4)) * np.exp(-tt * 2.2) * (t >= bas)
    return yansima(x * 0.25, 2.5, 0.45)


def ekle(hedef, ses, zaman, kazanc=1.0):
    i = int(zaman * SR)
    if i >= len(hedef) or i + len(ses) <= 0:
        return
    if i < 0:
        ses, i = ses[-i:], 0
    son = min(len(hedef), i + len(ses))
    hedef[i:son] += ses[: son - i] * kazanc

# ----------------------------------------------------------------------------
# 3) ZAMAN ÇİZELGESİ + MİKS
# ----------------------------------------------------------------------------

def kelime_zamanlari(metin, bas, sure):
    """Kelimelerin zamanını harf sayısına göre paylaştırır (karaoke altyazı için)."""
    kelimeler = metin.split()
    agirlik = np.array([len(re.sub(r"\W", "", k)) + 2 + (4 if re.search(r"[.!?…,:]$", k) else 0) for k in kelimeler], float)
    sinirlar = np.concatenate([[0], np.cumsum(agirlik)]) / agirlik.sum() * sure + bas
    return [{"k": k, "b": round(float(sinirlar[i]), 3), "s": round(float(sinirlar[i + 1]), 3)} for i, k in enumerate(kelimeler)]


def srt_zaman(s):
    ms = int(round(s * 1000))
    return f"{ms // 3600000:02}:{ms // 60000 % 60:02}:{ms // 1000 % 60:02},{ms % 1000:03}"


def uret(konu, is_klasoru, ayar):
    sahneler = [{"tur": "giris", "metin": konu["giris"]}]
    sahneler += [{"tur": "oge", "metin": o["metin"], "oge": o} for o in konu["ogeler"]]
    sahneler += [{"tur": "kapanis", "metin": konu["kapanis"]}]

    sesler, kaynak = seslendir(sahneler, is_klasoru / "seslendirme", ayar)

    # Sahneleri arka arkaya diz
    on, arka = 0.25, 0.3
    imlec = 0.0
    for i, (s, v) in enumerate(zip(sahneler, sesler)):
        ek = 0.9 if (s["tur"] == "oge" and s["oge"]["sira"] == 1) else 0.0  # final öncesi gerilim payı
        s["baslangic"] = round(imlec, 3)
        s["ses_bas"] = round(imlec + on + ek, 3)
        s["ses_sure"] = round(len(v) / SR, 3)
        bitis = s["ses_bas"] + s["ses_sure"] + arka + (1.2 if s["tur"] == "oge" and s["oge"]["sira"] == 1 else 0)
        if s["tur"] == "kapanis":
            bitis += 1.0
        s["bitis"] = round(bitis, 3)
        s["kelimeler"] = kelime_zamanlari(s["metin"], s["ses_bas"], s["ses_sure"])
        imlec = bitis
    toplam = imlec

    # Ses bantları
    n = int(toplam * SR) + SR
    konusma = np.zeros(n)
    for s, v in zip(sahneler, sesler):
        ekle(konusma, v, s["ses_bas"])
    konusma = signal.sosfilt(signal.butter(2, 90, "high", fs=SR, output="sos"), konusma)

    muzik = atmosfer(n / SR, [[73.42, 110, 146.83, 174.61], [58.27, 116.54, 146.83, 174.61],
                              [65.41, 98, 130.81, 164.81], [55, 110, 138.59, 164.81]])
    muzik += nabiz(n / SR, 96, sahneler[1]["baslangic"])

    efekt = np.zeros(n)
    for i, s in enumerate(sahneler):
        if i > 0:
            ekle(efekt, whoosh(0.8), s["baslangic"] - 0.45, 0.55)
        if s["tur"] == "oge":
            sira = s["oge"]["sira"]
            if sira == 1:
                ekle(efekt, yukselis(2.4), s["ses_bas"] - 1.6, 0.6)
                ekle(efekt, darbe(1.0, 2.4), s["ses_bas"] + 0.75, 1.0)
                ekle(efekt, parilti(2.5), s["ses_bas"] + 0.8, 0.8)
            else:
                ekle(efekt, darbe(0.6), s["baslangic"] + 0.05, 0.55)
            # sayaç sesi: rakam sayarken hızlı tıklar
            for k in range(10):
                ekle(efekt, tik(1500 + k * 60), s["baslangic"] + 0.35 + k * 0.07, 0.18)
        elif s["tur"] == "giris":
            ekle(efekt, darbe(0.9, 2.2), 0.05, 0.9)
        else:
            ekle(efekt, parilti(2.0), s["baslangic"] + 0.3, 0.5)

    # Ducking: konuşma varken müziği kıs (sidechain)
    zarf_k = np.abs(konusma)
    zarf_k = signal.sosfiltfilt(signal.butter(1, 4, "low", fs=SR, output="sos"), zarf_k)
    zarf_k = np.clip(zarf_k / (zarf_k.max() + 1e-9) * 4, 0, 1)
    muzik_kazanc = 1 - 0.55 * zarf_k

    mono = konusma * 1.0 + muzik * 0.22 * muzik_kazanc + efekt * 0.5
    # Stereo genişlik: efekt ve müziği hafif kaydırılmış kopyalarla genişlet
    gecikme = int(0.012 * SR)
    yan = np.concatenate([np.zeros(gecikme), (muzik * 0.22 * muzik_kazanc + efekt * 0.3)[:-gecikme]])
    sol, sag = mono + 0.15 * yan, mono - 0.15 * yan
    st = np.stack([sol, sag], axis=1)
    st = np.tanh(st * 1.2) / np.tanh(1.2)  # yumuşak limiter
    st /= np.abs(st).max() + 1e-9
    st = st[: int(toplam * SR)] * 0.95
    wavfile.write(is_klasoru / "miks.wav", SR, (st * 32767).astype(np.int16))

    # Altyazı dosyası (cümle grupları)
    srt, no = [], 1
    for s in sahneler:
        kel = s["kelimeler"]
        for j in range(0, len(kel), 4):
            g = kel[j:j + 4]
            srt.append(f"{no}\n{srt_zaman(g[0]['b'])} --> {srt_zaman(g[-1]['s'])}\n{' '.join(x['k'] for x in g)}\n")
            no += 1
    (is_klasoru / "altyazi.srt").write_text("\n".join(srt), encoding="utf-8")

    cizelge = {"sure": round(toplam, 3), "ses_kaynagi": kaynak, "konu": {k: v for k, v in konu.items() if k != "ogeler"},
               "maks_deger": max(o["deger"] for o in konu["ogeler"]), "ogeler": konu["ogeler"],
               "sahneler": [{k: v for k, v in s.items()} for s in sahneler]}
    (is_klasoru / "zaman_cizelgesi.json").write_text(json.dumps(cizelge, ensure_ascii=False, indent=1), encoding="utf-8")
    return cizelge
