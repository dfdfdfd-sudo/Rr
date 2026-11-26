import Svg, { Path } from 'react-native-svg';

// Prototipteki çizgi simgeler (24x24, 2px çizgi). Kaynak: reference/ritim-web.html içindeki P nesnesi.
const YOL = {
  ev: 'M4 11l8-7 8 7v9h-5v-6H9v6H4z',
  oda: 'M3 21V9l9-6 9 6v12M3 21h18M9 21v-6h6v6',
  dambil: 'M6 7v10M3 9.5v5M18 7v10M21 9.5v5M6 12h12',
  arti: 'M12 5v14M5 12h14',
  kisi: 'M12 12a4 4 0 1 0 0-8 4 4 0 0 0 0 8zM4 21c1-4 4-6 8-6s7 2 8 6',
  su: 'M12 3s6 6.5 6 11a6 6 0 0 1-12 0c0-4.5 6-11 6-11z',
  ay: 'M20 14.5A8 8 0 1 1 9.5 4a6.5 6.5 0 0 0 10.5 10.5z',
  kalp: 'M12 20s-7-4.4-7-10a4 4 0 0 1 7-2.6A4 4 0 0 1 19 10c0 5.6-7 10-7 10z',
  tarti: 'M4 7h16v13H4zM9 7a3 3 0 0 1 6 0M12 12l2-2',
  ileri: 'M9 6l6 6-6 6',
  geri: 'M15 6l-6 6 6 6',
  tik: 'M5 12.5l4.5 4.5L19 7',
  alev: 'M12 22c4 0 7-2.8 7-7 0-3.5-2.2-5.6-3.7-7.4-.4 1.8-1.3 3-2.6 3.4.3-3.3-1-6.4-3.7-8-.3 3.4-2 5.3-3.6 7.2C4.3 12 4 13.4 4 15c0 4.2 3 7 8 7z',
  saat: 'M12 9v4l2.5 1.5M9 2h6M20 13a8 8 0 1 1-16 0 8 8 0 0 1 16 0z',
  yemek: 'M7 3v7a2 2 0 0 0 2 2v9M5 3v5M9 3v5M16 21V3c2.5 1 4 3.5 4 8h-4',
  lotus: 'M12 20c-4.5 0-8-2.2-9-6 2.6-.2 4.6.7 6 2-1-3.4.1-7.2 3-10 2.9 2.8 4 6.6 3 10 1.4-1.3 3.4-2.2 6-2-1 3.8-4.5 6-9 6z',
  simsek: 'M13 2L4 14h7l-1 8 9-12h-7z',
  gunes: 'M12 3v2M12 19v2M3 12h2M19 12h2M5.6 5.6l1.4 1.4M17 17l1.4 1.4M5.6 18.4L7 17M17 7l1.4-1.4M16 12a4 4 0 1 1-8 0 4 4 0 0 1 8 0z',
  canta: 'M4 8h16v11H4zM9 8V5h6v3M4 13h16',
  kitap: 'M4 5a2 2 0 0 1 2-2h13v15H6a2 2 0 0 0-2 2zM4 20V5M19 18v3H6',
  izgara: 'M4 4h7v7H4zM13 4h7v7h-7zM4 13h7v7H4zM13 13h7v7h-7z',
  esneme: 'M12 5.5a2 2 0 1 0 0-4 2 2 0 0 0 0 4zM4 9l8 2 8-2M12 11v5l-3 6M12 16l3 6',
  yildiz: 'M12 3l2.7 5.6 6.1.9-4.4 4.3 1 6.1L12 17l-5.4 2.9 1-6.1-4.4-4.3 6.1-.9z',
  kupa: 'M8 4h8v5a4 4 0 0 1-8 0zM8 6H5a3 3 0 0 0 3 4M16 6h3a3 3 0 0 1-3 4M12 13v4M8 21h8M9 17h6',
  kilit: 'M6 11h12v10H6zM8 11V8a4 4 0 0 1 8 0v3',
  grafik: 'M5 20v-8M11 20V5M17 20v-5M3 20h18',
  kalem: 'M4 20h4L19 9l-4-4L4 16z',
  cop: 'M5 7h14M10 7V4h4v3M7 7l1 13h8l1-13',
  ara: 'M11 18a7 7 0 1 0 0-14 7 7 0 0 0 0 14zM20 20l-4-4',
  cikis: 'M15 3h4v18h-4M10 17l5-5-5-5M15 12H3',
  kapat: 'M6 6l12 12M18 6L6 18',
  ayak: 'M8 3c2 0 3 2 3 4.5S10 13 8 13 5 10 5 7.5 6 3 8 3zM16 9c2 0 3 2 3 4.5S18 19 16 19s-3-3-3-5.5S14 9 16 9z',
  ruzgar: 'M3 8h11a3 3 0 1 0-3-3M3 12h16a3 3 0 1 1-3 3M3 16h8',
  seker: 'M4 20L20 4M7 7l2 2M15 15l2 2M10 4h4M4 10v4M20 10v4M10 20h4',
  sigarasiz: 'M3 15h12v3H3zM18 15v3M21 15v3M4 4l16 16',
  defter: 'M4 20h4L19 9l-4-4L4 16zM13.5 6.5l4 4',
  oynat: 'M7 4l13 8-13 8z',
  hedef: 'M12 21a9 9 0 1 0 0-18 9 9 0 0 0 0 18zM12 16a4 4 0 1 0 0-8 4 4 0 0 0 0 8z',
  bayrak: 'M5 21V4M5 4h11l-2 4 2 4H5',
  kos: 'M13 4.5a1.5 1.5 0 1 0 0-3 1.5 1.5 0 0 0 0 3zM7 21l3-6 3 2 1 4M10 15l1-6 4 2 3-1M11 9L8 10l-2 3',
} as const;

export type IkonAdi = keyof typeof YOL;

type Props = { ad: IkonAdi | string; boyut?: number; renk?: string; kalinlik?: number };

export function Ikon({ ad, boyut = 22, renk = '#f4f4f3', kalinlik = 2 }: Props) {
  const d = (YOL as Record<string, string>)[ad] ?? YOL.tik;
  return (
    <Svg width={boyut} height={boyut} viewBox="0 0 24 24" fill="none">
      <Path d={d} stroke={renk} strokeWidth={kalinlik} strokeLinecap="round" strokeLinejoin="round" />
    </Svg>
  );
}
