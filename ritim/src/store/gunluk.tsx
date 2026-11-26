import AsyncStorage from '@react-native-async-storage/async-storage';
import { createContext, ReactNode, useCallback, useContext, useEffect, useMemo, useRef, useState } from 'react';

import { ALISKANLIKLAR, SU_HEDEF_ML, UYKU_HEDEF_DK } from '@/data/varsayilan';
import { gunSkoru } from '@/lib/skor';
import { bugun } from '@/lib/tarih';

// Telefonda saklanan basit gün defteri. Su modülü gelince su kayıtları SQLite'a taşınacak.

export type Gun = {
  aliskanlik: Record<string, boolean>;
  suMl: number;
  sabah: Record<number, boolean>;
  uykuDk: number | null;
};

type Durum = { ad: string; gunler: Record<string, Gun> };

const BOS_GUN: Gun = { aliskanlik: {}, suMl: 0, sabah: {}, uykuDk: null };
const ANAHTAR = 'ritim:v1';

type Baglam = {
  hazir: boolean;
  ad: string;
  gun: (k: string) => Gun;
  skor: (k: string) => number;
  aliskanlikDegistir: (k: string, id: string) => void;
  sabahDegistir: (k: string, i: number) => void;
  suEkle: (k: string, ml: number) => void;
};

const Ctx = createContext<Baglam | null>(null);

export function GunlukSaglayici({ children }: { children: ReactNode }) {
  const [d, setD] = useState<Durum>({ ad: 'Emre', gunler: {} });
  const [hazir, setHazir] = useState(false);
  const yuklendi = useRef(false);

  useEffect(() => {
    AsyncStorage.getItem(ANAHTAR)
      .then((v) => {
        if (v) setD(JSON.parse(v));
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

  const deger = useMemo<Baglam>(
    () => ({
      hazir,
      ad: d.ad,
      gun,
      skor: (k) => {
        const g = gun(k);
        return gunSkoru({
          aliskanlikSayisi: ALISKANLIKLAR.length,
          aliskanlikTamam: ALISKANLIKLAR.filter((a) => g.aliskanlik[a.id]).length,
          antrenmanGunu: false, // Antrenman modülü gelene kadar her gün dinlenme günü
          antrenmanYapildi: false,
          suMl: g.suMl,
          suHedefMl: SU_HEDEF_ML,
          uykuDk: g.uykuDk,
          uykuHedefDk: UYKU_HEDEF_DK,
          gecmisGun: k < bugun(),
        });
      },
      aliskanlikDegistir: (k, id) =>
        guncelle(k, (g) => ({ ...g, aliskanlik: { ...g.aliskanlik, [id]: !g.aliskanlik[id] } })),
      sabahDegistir: (k, i) => guncelle(k, (g) => ({ ...g, sabah: { ...g.sabah, [i]: !g.sabah[i] } })),
      suEkle: (k, ml) => guncelle(k, (g) => ({ ...g, suMl: Math.max(0, g.suMl + ml) })),
    }),
    [hazir, d.ad, gun, guncelle],
  );

  return <Ctx.Provider value={deger}>{children}</Ctx.Provider>;
}

export function useGunluk() {
  const c = useContext(Ctx);
  if (!c) throw new Error('useGunluk, GunlukSaglayici içinde kullanılmalı');
  return c;
}
