// Başlangıç verileri (prototipten).

export type Aliskanlik = { id: string; ad: string; ikon: string };

export const ALISKANLIKLAR: Aliskanlik[] = [
  { id: 'su', ad: 'Su iç', ikon: 'su' },
  { id: 'protein', ad: 'Protein hedefini tuttur', ikon: 'yemek' },
  { id: 'uyku', ad: "23:30'da yatakta ol", ikon: 'ay' },
];

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

export const IPUCLARI = [
  'Bir gün kaçırmak alışkanlığı bozmaz. Asıl kural: iki gün üst üste kaçırma.',
  'Zor günde hedefi küçült: 10 şınav yerine 3 şınav da zinciri korur.',
  'Yeni alışkanlığı var olan birine bağla: "Kahvemi koyunca 5 dk nefes."',
  'Antrenman kıyafetini akşamdan hazırla; sabah karar vermek zorunda kalma.',
  'Kas, antrenmanda değil dinlenirken büyür. Dinlenme günü de planın parçası.',
  'Her hafta yükü ya da tekrarı biraz artır. Küçük artışlar büyük sonuç getirir.',
  'Su şişeni görünür bir yere koy; gördüğün şeyi daha çok yaparsın.',
];

/** EFSA'ya göre varsayılan günlük içecek hedefi (bkz. docs/plan-su.md). */
export const SU_HEDEF_ML = 2000;
export const UYKU_HEDEF_DK = 8 * 60;
