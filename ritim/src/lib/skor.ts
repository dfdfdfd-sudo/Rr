import { renk } from '@/theme';

// Ritim skoru (prototipteki dayScore ile aynı mantık):
// alışkanlıklar 40 · antrenman 25 · su 15 · uyku 20 puan.
// Dinlenme günü antrenman puanı tam sayılır. Uyku kaydı yoksa bugün için hesaba girmez.

export type SkorGirdi = {
  aliskanlikSayisi: number;
  aliskanlikTamam: number;
  antrenmanGunu: boolean;
  antrenmanYapildi: boolean;
  suMl: number;
  suHedefMl: number;
  uykuDk: number | null;
  uykuHedefDk: number;
  gecmisGun: boolean;
};

export function gunSkoru(g: SkorGirdi): number {
  let al = 0;
  let enCok = 0;
  if (g.aliskanlikSayisi > 0) {
    enCok += 40;
    al += (40 * g.aliskanlikTamam) / g.aliskanlikSayisi;
  }
  enCok += 25;
  al += !g.antrenmanGunu || g.antrenmanYapildi ? 25 : 0;
  enCok += 15;
  al += 15 * Math.min(1, g.suMl / g.suHedefMl);
  if (g.uykuDk != null) {
    enCok += 20;
    al += 20 * Math.min(1, g.uykuDk / g.uykuHedefDk);
  } else if (g.gecmisGun) {
    enCok += 20;
  }
  return enCok ? Math.round((al / enCok) * 100) : 0;
}

export const skorRengi = (s: number) => (s >= 67 ? renk.iyi : s >= 34 ? renk.orta : renk.dusuk);

export const skorYazisi = (s: number) =>
  s >= 85 ? 'Mükemmel gidiyorsun' : s >= 67 ? 'İyi bir gün' : s >= 34 ? 'Toparlanabilir' : 'Daha yeni başlıyorsun';
