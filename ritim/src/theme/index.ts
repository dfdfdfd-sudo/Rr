// Ritim tasarım sistemi — değerler reference/ritim-web.html'deki koyu temadan alındı.
// Kural: ekranlarda renk kodu (#...) yazma; buradan al.

export const renk = {
  zemin: '#08090a',
  kart: '#111214',
  kart2: '#1a1b1e',
  cizgi: '#1f2024',
  iz: '#1c1d21', // halka / çubuk arka izi
  yazi: '#f4f4f3',
  yazi2: '#c2c4c9',
  soluk: '#85888f',
  vurgu: '#f4f4f3', // ana düğme zemini (açık)
  vurguYazi: '#08090a', // ana düğme yazısı (koyu)
  menu: 'rgba(28,29,33,0.94)', // yüzen alt menü
  figur: '#d9dce2', // hareket figürü

  // Durum renkleri (skor, uyarı)
  iyi: '#2ee59d',
  orta: '#f6c344',
  dusuk: '#ff5a5f',

  // Modül renkleri
  su: '#5cc8f2',
  uyku: '#a99bff',
  ruh: '#f6c344',
  sicak: '#ff7a59',
} as const;

/** Araç simgelerinin renkleri (prototipteki TCOL). */
export const aracRenk: Record<string, string> = {
  su: '#2f9fe0',
  uyku: '#7c6cf0',
  meditasyon: '#9b7bf0',
  odak: '#f0a23a',
  ruh: '#e86aa0',
  hedef: '#f0603a',
  kardiyo: '#2fbf9f',
  vucut: '#36b37e',
};

export const bosluk = { xs: 4, s: 8, m: 12, l: 18, xl: 24, xxl: 32 } as const;

export const kose = { kart: 20, buyuk: 24, kucuk: 14, hap: 999 } as const;

/** En küçük dokunma alanı. */
export const dokunma = 48;

/** Plus Jakarta Sans: her kalınlık ayrı dosya (iOS kalınlığı kendisi üretmez). */
export const yaziTipi = {
  400: 'PlusJakartaSans_400Regular',
  500: 'PlusJakartaSans_500Medium',
  600: 'PlusJakartaSans_600SemiBold',
  700: 'PlusJakartaSans_700Bold',
  800: 'PlusJakartaSans_800ExtraBold',
} as const;

export type Kalinlik = keyof typeof yaziTipi;
