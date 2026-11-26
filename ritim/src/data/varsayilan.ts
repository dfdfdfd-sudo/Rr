// Başlangıç verileri (prototipten).
import { renk } from '@/theme';

export type Aliskanlik = { id: string; ad: string; ikon: string; renk: string };

/** Alışkanlık kütüphanesi (prototipteki HLIB). */
export const ALISKANLIK_KUTUPHANESI: Aliskanlik[] = [
  { id: 'su', ad: 'Su iç', ikon: 'su', renk: renk.su },
  { id: 'kitap', ad: '10 sayfa kitap oku', ikon: 'kitap', renk: renk.uyku },
  { id: 'nefes', ad: '5 dk nefes', ikon: 'ruzgar', renk: renk.yazi },
  { id: 'adim', ad: '8.000 adım yürü', ikon: 'ayak', renk: renk.iyi },
  { id: 'uyku', ad: "23:30'da yatakta ol", ikon: 'ay', renk: renk.uyku },
  { id: 'seker', ad: 'Şekersiz gün', ikon: 'seker', renk: renk.sicak },
  { id: 'sigara', ad: 'Sigarasız gün', ikon: 'sigarasiz', renk: renk.sicak },
  { id: 'gunluk', ad: 'Günlük yaz', ikon: 'defter', renk: renk.ruh },
  { id: 'esneme', ad: '10 dk esneme', ikon: 'esneme', renk: renk.iyi },
  { id: 'protein', ad: 'Protein hedefini tuttur', ikon: 'yemek', renk: renk.ruh },
  { id: 'ders', ad: '45 dk ders çalış', ikon: 'kitap', renk: renk.yazi },
  { id: 'gunes', ad: 'Sabah 10 dk güneş', ikon: 'gunes', renk: renk.ruh },
];

const al = (id: string) => ALISKANLIK_KUTUPHANESI.find((a) => a.id === id)!;
export const ILK_ALISKANLIKLAR: Aliskanlik[] = [al('su'), al('protein'), al('uyku')];

export const SABAH = [
  'Bir bardak su iç',
  'Yatağını topla',
  '5 dakika esneme',
  'Günün 3 önceliğini yaz',
  'Dışarı çık, gün ışığı al',
];

export const ARACLAR: { id: string; ad: string; ikon: string }[] = [
  { id: 'su', ad: 'Su', ikon: 'su' },
  { id: 'uyku', ad: 'Uyku', ikon: 'ay' },
  { id: 'meditasyon', ad: 'Meditasyon', ikon: 'lotus' },
  { id: 'odak', ad: 'Odak saati', ikon: 'saat' },
  { id: 'ruh', ad: 'Ruh hali', ikon: 'kalp' },
  { id: 'hedef', ad: 'Hedefler', ikon: 'bayrak' },
  { id: 'kardiyo', ad: 'Kardiyo', ikon: 'kos' },
  { id: 'vucut', ad: 'Vücut', ikon: 'tarti' },
];

/** Profil > Modüller listesi (prototipteki görünen gruplar). */
export const MODUL_GRUPLARI: { ad: string; moduller: { id: string; ad: string; ikon: string }[] }[] = [
  { ad: 'Spor', moduller: [{ id: 'kardiyo', ad: 'Yürüyüş, koşu, bisiklet', ikon: 'kos' }, { id: 'yoga', ad: 'Yoga', ikon: 'esneme' }, { id: 'vucut', ad: 'Vücut (tartı, ölçü, fotoğraf)', ikon: 'tarti' }] },
  { ad: 'Beslenme ve sağlık', moduller: [{ id: 'su', ad: 'Su', ikon: 'su' }] },
  {
    ad: 'Zihin ve uyku',
    moduller: [
      { id: 'uyku', ad: 'Uyku', ikon: 'ay' },
      { id: 'ruh', ad: 'Ruh hali', ikon: 'kalp' },
      { id: 'meditasyon', ad: 'Meditasyon', ikon: 'lotus' },
      { id: 'odak', ad: 'Odak saati', ikon: 'saat' },
      { id: 'sabah', ad: 'Güne başla', ikon: 'gunes' },
    ],
  },
  { ad: 'Hedef ve gelişim', moduller: [{ id: 'hedef', ad: 'Hedefler', ikon: 'bayrak' }] },
];

export const IPUCLARI = [
  'Bir gün kaçırmak alışkanlığı bozmaz. Asıl kural: iki gün üst üste kaçırma.',
  'Zor günde hedefi küçült: 10 şınav yerine 3 şınav da zinciri korur.',
  'Yeni alışkanlığı var olan birine bağla: "Kahvemi koyunca 5 dk nefes."',
  'Antrenman kıyafetini akşamdan hazırla; sabah karar vermek zorunda kalma.',
  'Kas, antrenmanda değil dinlenirken büyür. Dinlenme günü de planın parçası.',
  'Her hafta yükü ya da tekrarı biraz artır. Küçük artışlar büyük sonuç getirir.',
  'Su şişeni görünür bir yere koy; gördüğün şeyi daha çok yaparsın.',
];

export type Hedefler = { su: number; kalori: number; protein: number; uyku: number; dinlenme: number; mesai: number; haftaMesai: number };

/** Su: EFSA'ya göre 2000 ml (bkz. docs/plan-su.md). Diğerleri prototipteki varsayılanlar. */
export const ILK_HEDEFLER: Hedefler = { su: 2000, kalori: 2200, protein: 120, uyku: 8, dinlenme: 60, mesai: 8.5, haftaMesai: 45 };

/** Haftalık plan: gün numarası (0 = Pazar) → program kimliği. Prototipte "haftada 2 gün, evde, başlangıç" seçiminin sonucu. */
export const ILK_PLAN: Record<number, string> = { 2: 'ev-a', 5: 'ev-a' };
