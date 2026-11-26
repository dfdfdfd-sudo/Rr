import { gece, OdaVerisi } from '@/modules/oda/cizim';
import { bugun, gunEkle } from '@/lib/tarih';
import { useGunluk } from '@/store/gunluk';

/** Odanın ihtiyaç duyduğu sayılar. Henüz taşınmamış modüllerin (odak, kitap, antrenman…) değerleri 0. */
export function useOdaVerisi(): OdaVerisi & { gece: boolean } {
  const g = useGunluk();
  const k = bugun();
  const gunler = Object.values(g.gunler);
  return {
    pomos: 0,
    booksAll: 0,
    books: 0,
    waterDays: g.istatistik.suGunu,
    sleeps: gunler.filter((d) => d.uykuDk).length,
    wo: g.istatistik.antrenman,
    km: 0,
    yoga: false,
    breath: 0,
    mdMin: 0,
    medi: 0,
    badges: 0,
    chal: 0,
    level: g.istatistik.seviye,
    suIcildiBugun: g.gun(k).suMl > 0,
    bitkiSoluyor: [0, 1, 2, 3].every((i) => g.gun(gunEkle(k, -i)).suMl < g.hedefler.su),
    gece: gece(),
  };
}
