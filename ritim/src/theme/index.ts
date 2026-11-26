// Ritim tasarım sistemi — tüm renk, boşluk ve yazı ölçüleri burada.
// Kural: ekranlarda renk kodu (#...) yazma; buradan al.

export const renk = {
  zemin: '#08090a', // siyaha yakın zemin
  kart: '#111214',
  kart2: '#1a1b1e',
  cizgi: '#1f2024',
  iz: '#1c1d21', // halka/çubuk arka izi
  yazi: '#f4f4f3',
  yazi2: '#c2c4c9',
  soluk: '#85888f',

  // Her modülün kendi rengi
  su: '#5cc8f2',
  uyku: '#a99bff',
  ruh: '#f6c344',
  sicak: '#ff7a59', // seri, antrenman
  tamam: '#2ee59d',
  uyari: '#ff5a5f',
} as const;

export const bosluk = { xs: 4, s: 8, m: 12, l: 18, xl: 24, xxl: 32 } as const;

export const kose = { kart: 20, kucuk: 14, hap: 999 } as const;

/** En küçük dokunma alanı (Apple önerisi 44pt; biz 48 kullanıyoruz). */
export const dokunma = 48;

export const yazi = {
  dev: { fontSize: 44, fontWeight: '800', letterSpacing: -1.2 },
  baslik: { fontSize: 30, fontWeight: '800', letterSpacing: -0.6 },
  altBaslik: { fontSize: 21, fontWeight: '800', letterSpacing: -0.4 },
  govde: { fontSize: 16, fontWeight: '500' },
  ust: { fontSize: 13, fontWeight: '600' }, // küçük üst etiket
} as const;
