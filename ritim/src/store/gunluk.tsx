import AsyncStorage from '@react-native-async-storage/async-storage';
import { createContext, ReactNode, useCallback, useContext, useEffect, useMemo, useRef, useState } from 'react';

import { PROGRAMLAR, Program } from '@/data/hareketler';
import { Aliskanlik, Hedefler, ILK_ALISKANLIKLAR, ILK_HEDEFLER, ILK_PLAN, SABAH } from '@/data/varsayilan';
import { gunSkoru } from '@/lib/skor';
import { bugun, gunEkle, tarihten } from '@/lib/tarih';

// Telefonda saklanan uygulama verisi. Su modülü gelince su kayıtları SQLite'a taşınacak.

export type Gun = {
  aliskanlik: Record<string, boolean>;
  suMl: number;
  sabah: Record<number, boolean>;
  uykuDk: number | null;
};

type Durum = {
  ad: string;
  amac: string;
  seviye: number;
  yer: string;
  plan: Record<number, string>;
  aliskanliklar: Aliskanlik[];
  hedefler: Hedefler;
  moduller: Record<string, boolean>;
  gunler: Record<string, Gun>;
};

const ILK: Durum = {
  ad: 'Emre',
  amac: 'Kas yapmak',
  seviye: 1,
  yer: 'Evde',
  plan: ILK_PLAN,
  aliskanliklar: ILK_ALISKANLIKLAR,
  hedefler: ILK_HEDEFLER,
  moduller: {},
  gunler: {},
};

const BOS_GUN: Gun = { aliskanlik: {}, suMl: 0, sabah: {}, uykuDk: null };
const ANAHTAR = 'ritim:v1';

/** Seviye için gereken puan: 100, 150, 200… (prototipteki need) */
const gerek = (L: number) => 100 + 50 * (L - 1);

export type Istatistik = {
  xp: number;
  seviye: number;
  seviyePuan: number; // bu seviyede toplanan
  seviyeGerek: number; // bu seviyeyi bitirmek için gereken
  suGunu: number; // su hedefinin tutulduğu gün sayısı
  enIyiSeri: number;
  antrenman: number;
};

type Baglam = Durum & {
  hazir: boolean;
  gun: (k: string) => Gun;
  skor: (k: string) => number;
  gununProgrami: (k: string) => Program | null;
  seri: (aliskanlikId: string) => number;
  istatistik: Istatistik;
  modulAcik: (id: string) => boolean;
  aliskanlikDegistir: (k: string, id: string) => void;
  sabahDegistir: (k: string, i: number) => void;
  suEkle: (k: string, ml: number) => void;
  planAyarla: (gunNo: number, programId: string | null) => void;
  aliskanlikEkle: (a: Aliskanlik) => void;
  aliskanlikSil: (id: string) => void;
  hedefAyarla: (k: keyof Hedefler, v: number) => void;
  modulDegistir: (id: string) => void;
  yedek: () => string;
  sifirla: () => void;
};

const Ctx = createContext<Baglam | null>(null);

export function GunlukSaglayici({ children }: { children: ReactNode }) {
  const [d, setD] = useState<Durum>(ILK);
  const [hazir, setHazir] = useState(false);
  const yuklendi = useRef(false);

  useEffect(() => {
    AsyncStorage.getItem(ANAHTAR)
      .then((v) => {
        if (v) setD({ ...ILK, ...JSON.parse(v) }); // eski kayıtlarda olmayan alanlar ILK'ten gelir
      })
      .catch(() => {})
      .finally(() => {
        yuklendi.current = true;
        setHazir(true);
      });
  }, []);

  useEffect(() => {
    if (yuklendi.current) AsyncStorage.setItem(ANAHTAR, JSON.stringify(d)).catch(() => {});
  }, [d]);

  const gun = useCallback((k: string) => d.gunler[k] ?? BOS_GUN, [d]);
  const guncelle = useCallback((k: string, f: (g: Gun) => Gun) => {
    setD((o) => ({ ...o, gunler: { ...o.gunler, [k]: f(o.gunler[k] ?? BOS_GUN) } }));
  }, []);

  const deger = useMemo<Baglam>(() => {
    const gununProgrami = (k: string) => PROGRAMLAR.find((p) => p.id === d.plan[tarihten(k).getDay()]) ?? null;

    const seri = (id: string) => {
      let k = bugun();
      if (!gun(k).aliskanlik[id]) k = gunEkle(k, -1); // bugün henüz yapılmadıysa dünden say
      let n = 0;
      while (n < 400 && gun(k).aliskanlik[id]) {
        n++;
        k = gunEkle(k, -1);
      }
      return n;
    };

    // Puan (prototipteki calc'ın şimdilik kullanılan kısmı): her alışkanlık 10, tamamlanan sabah rutini 10.
    let xp = 0;
    let suGunu = 0;
    for (const g of Object.values(d.gunler)) {
      xp += d.aliskanliklar.filter((a) => g.aliskanlik[a.id]).length * 10;
      if (SABAH.every((_, i) => g.sabah[i])) xp += 10;
      if (g.suMl >= d.hedefler.su) suGunu++;
    }
    let L = 1;
    let r = xp;
    while (r >= gerek(L)) {
      r -= gerek(L);
      L++;
    }

    return {
      ...d,
      hazir,
      gun,
      gununProgrami,
      seri,
      istatistik: {
        xp,
        seviye: L,
        seviyePuan: r,
        seviyeGerek: gerek(L),
        suGunu,
        enIyiSeri: Math.max(0, ...d.aliskanliklar.map((a) => seri(a.id))),
        antrenman: 0,
      },
      modulAcik: (id) => d.moduller[id] !== false,
      skor: (k) => {
        const g = gun(k);
        return gunSkoru({
          aliskanlikSayisi: d.aliskanliklar.length,
          aliskanlikTamam: d.aliskanliklar.filter((a) => g.aliskanlik[a.id]).length,
          antrenmanGunu: !!gununProgrami(k),
          antrenmanYapildi: false, // rehberli antrenman henüz yok
          suMl: g.suMl,
          suHedefMl: d.hedefler.su,
          uykuDk: g.uykuDk,
          uykuHedefDk: d.hedefler.uyku * 60,
          gecmisGun: k < bugun(),
        });
      },
      aliskanlikDegistir: (k, id) => guncelle(k, (g) => ({ ...g, aliskanlik: { ...g.aliskanlik, [id]: !g.aliskanlik[id] } })),
      sabahDegistir: (k, i) => guncelle(k, (g) => ({ ...g, sabah: { ...g.sabah, [i]: !g.sabah[i] } })),
      suEkle: (k, ml) => guncelle(k, (g) => ({ ...g, suMl: Math.max(0, g.suMl + ml) })),
      planAyarla: (n, pid) =>
        setD((o) => {
          const plan = { ...o.plan };
          if (pid) plan[n] = pid;
          else delete plan[n];
          return { ...o, plan };
        }),
      aliskanlikEkle: (a) => setD((o) => (o.aliskanliklar.some((x) => x.id === a.id) ? o : { ...o, aliskanliklar: [...o.aliskanliklar, a] })),
      aliskanlikSil: (id) => setD((o) => ({ ...o, aliskanliklar: o.aliskanliklar.filter((a) => a.id !== id) })),
      hedefAyarla: (k, v) => setD((o) => ({ ...o, hedefler: { ...o.hedefler, [k]: v } })),
      modulDegistir: (id) => setD((o) => ({ ...o, moduller: { ...o.moduller, [id]: o.moduller[id] === false } })),
      yedek: () => JSON.stringify(d),
      sifirla: () => setD(ILK),
    };
  }, [d, hazir, gun, guncelle]);

  return <Ctx.Provider value={deger}>{children}</Ctx.Provider>;
}

export function useGunluk() {
  const c = useContext(Ctx);
  if (!c) throw new Error('useGunluk, GunlukSaglayici içinde kullanılmalı');
  return c;
}
