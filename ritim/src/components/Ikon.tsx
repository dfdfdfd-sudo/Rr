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
  bayrak: 'M5 21V4M5 4h11l-2 4 2 4H5',
  kos: 'M13 4.5a1.5 1.5 0 1 0 0-3 1.5 1.5 0 0 0 0 3zM7 21l3-6 3 2 1 4M10 15l1-6 4 2 3-1M11 9L8 10l-2 3',
  simsek: 'M13 2L4 14h7l-1 8 9-12h-7z',
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
