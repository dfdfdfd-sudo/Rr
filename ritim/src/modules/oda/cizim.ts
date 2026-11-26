// Odam: izometrik oda çizimi. reference/ritim-web.html içindeki drawRoom() satır satır aktarıldı.
// Sonuç bir SVG metnidir; ekranda react-native-svg'nin SvgXml bileşeniyle çizilir.

export type OdaVerisi = {
  pomos: number; // odak seansı
  booksAll: number;
  books: number; // bitirilen kitap
  waterDays: number; // su hedefinin tutulduğu gün
  sleeps: number; // kaydedilen gece
  wo: number; // antrenman
  km: number;
  yoga: boolean;
  breath: number;
  mdMin: number;
  medi: number;
  badges: number;
  chal: number;
  level: number;
  suIcildiBugun: boolean;
  bitkiSoluyor: boolean; // son 4 günün hiçbirinde su hedefi tutmadı
};

export type Esya = { id: string; ad: string; kosul: string; ikon: string; ilerleme: (x: OdaVerisi) => number };

export const ESYALAR: Esya[] = [
  { id: 'window', ad: 'Pencere', kosul: 'Odanın başlangıcı', ikon: 'gunes', ilerleme: () => 1 },
  { id: 'desk', ad: 'Çalışma masası', kosul: 'Odanın başlangıcı', ikon: 'canta', ilerleme: () => 1 },
  { id: 'chair', ad: 'Sandalye', kosul: 'Odanın başlangıcı', ikon: 'kisi', ilerleme: () => 1 },
  { id: 'laptop', ad: 'Laptop', kosul: '3 odak seansı tamamla', ikon: 'saat', ilerleme: (x) => x.pomos / 3 },
  { id: 'lamp', ad: 'Masa lambası', kosul: '10 odak seansı', ikon: 'gunes', ilerleme: (x) => x.pomos / 10 },
  { id: 'monitor', ad: 'İkinci monitör', kosul: '25 odak seansı', ikon: 'izgara', ilerleme: (x) => x.pomos / 25 },
  { id: 'shelf', ad: 'Kitap rafı', kosul: 'Kütüphaneye ilk kitabını ekle', ikon: 'kitap', ilerleme: (x) => x.booksAll },
  { id: 'books', ad: 'Raftaki kitaplar', kosul: 'Bitirdiğin her kitap rafa dizilir', ikon: 'kitap', ilerleme: (x) => x.books },
  { id: 'plant', ad: 'Bitki', kosul: 'Su hedefini 1 gün tuttur', ikon: 'su', ilerleme: (x) => x.waterDays },
  { id: 'bed', ad: 'Rahat yatak', kosul: '5 gece uykunu kaydet', ikon: 'ay', ilerleme: (x) => x.sleeps / 5 },
  { id: 'rack', ad: 'Dambıl seti', kosul: 'İlk antrenmanını bitir', ikon: 'dambil', ilerleme: (x) => x.wo },
  { id: 'bench', ad: 'Antrenman sehpası', kosul: '5 antrenman', ikon: 'dambil', ilerleme: (x) => x.wo / 5 },
  { id: 'pullup', ad: 'Barfiks istasyonu', kosul: '15 antrenman', ikon: 'dambil', ilerleme: (x) => x.wo / 15 },
  { id: 'bag', ad: 'Kum torbası', kosul: '30 antrenman', ikon: 'simsek', ilerleme: (x) => x.wo / 30 },
  { id: 'tread', ad: 'Koşu bandı', kosul: 'Toplam 20 km kardiyo', ikon: 'kos', ilerleme: (x) => x.km / 20 },
  { id: 'mat', ad: 'Yoga matı', kosul: '30 dk nefes/meditasyon ya da bir yoga antrenmanı', ikon: 'esneme', ilerleme: (x) => (x.yoga ? 1 : (x.breath + x.mdMin) / 30) },
  { id: 'candle', ad: 'Mum ve meditasyon minderi', kosul: '7 meditasyon seansı', ikon: 'lotus', ilerleme: (x) => x.medi / 7 },
  { id: 'frames', ad: 'Rozet çerçeveleri', kosul: 'İlk rozetini kazan', ikon: 'yildiz', ilerleme: (x) => x.badges },
  { id: 'trophy', ad: 'Kupalar', kosul: 'İlk meydan okumanı bitir', ikon: 'kupa', ilerleme: (x) => x.chal },
  { id: 'rug', ad: 'Halı', kosul: 'Seviye 3', ikon: 'simsek', ilerleme: (x) => x.level / 3 },
  { id: 'poster', ad: 'Poster', kosul: 'Seviye 5', ikon: 'simsek', ilerleme: (x) => x.level / 5 },
];

export const esyaAcik = (id: string, x: OdaVerisi) => (ESYALAR.find((e) => e.id === id)?.ilerleme(x) ?? 0) >= 1;
export const gece = (saat = new Date().getHours()) => saat >= 20 || saat < 7;

// --- izometrik yardımcılar ---
const RK = 17;
const RCX = 180;
const RCY = 128;
type P2 = [number, number];
const RP = (x: number, y: number, z: number): P2 => [RCX + (x - y) * RK * 0.866, RCY + (x + y) * RK * 0.5 - z * RK];
const pp = (a: P2[]) => a.map((p) => p[0].toFixed(1) + ',' + p[1].toFixed(1)).join(' ');

function shade(hex: string, a: number) {
  const n = parseInt(hex.slice(1), 16);
  const rgb = [n >> 16, (n >> 8) & 255, n & 255];
  const f = (v: number) => Math.max(0, Math.min(255, Math.round(a > 0 ? v + (255 - v) * a : v * (1 + a))));
  return '#' + rgb.map((v) => f(v).toString(16).padStart(2, '0')).join('');
}

function bx(x: number, y: number, z: number, w: number, d: number, h: number, c: string, o: { t?: string; l?: string; r?: string } = {}) {
  const t = [RP(x, y, z + h), RP(x + w, y, z + h), RP(x + w, y + d, z + h), RP(x, y + d, z + h)];
  const l = [RP(x, y + d, z), RP(x + w, y + d, z), RP(x + w, y + d, z + h), RP(x, y + d, z + h)];
  const r = [RP(x + w, y, z), RP(x + w, y + d, z), RP(x + w, y + d, z + h), RP(x + w, y, z + h)];
  return `<polygon points="${pp(t)}" fill="${o.t || shade(c, 0.16)}"/><polygon points="${pp(l)}" fill="${o.l || c}"/><polygon points="${pp(r)}" fill="${o.r || shade(c, -0.25)}"/>`;
}
const wallX = (y1: number, y2: number, z1: number, z2: number, f: string) =>
  `<polygon points="${pp([RP(0, y1, z1), RP(0, y2, z1), RP(0, y2, z2), RP(0, y1, z2)])}" fill="${f}"/>`;
const wallY = (x1: number, x2: number, z1: number, z2: number, f: string) =>
  `<polygon points="${pp([RP(x1, 0, z1), RP(x2, 0, z1), RP(x2, 0, z2), RP(x1, 0, z2)])}" fill="${f}"/>`;
const wallYat = (y: number, x1: number, x2: number, z1: number, z2: number, f: string) =>
  `<polygon points="${pp([RP(x1, y, z1), RP(x2, y, z1), RP(x2, y, z2), RP(x1, y, z2)])}" fill="${f}"/>`;
const flat = (x: number, y: number, w: number, d: number, f: string, z = 0.01) =>
  `<polygon points="${pp([RP(x, y, z), RP(x + w, y, z), RP(x + w, y + d, z), RP(x, y + d, z)])}" fill="${f}"/>`;

/** Odanın SVG metni. */
export function odaCiz(x: OdaVerisi, N = gece()): string {
  const has = (id: string) => esyaAcik(id, x);
  const g: { key: number; svg: string }[] = [];
  const add = (key: number, svg: string) => g.push({ key, svg });

  let s = `<defs><linearGradient id="sky" x1="0" y1="0" x2="0" y2="1">${
    N ? '<stop offset="0" stop-color="#0b1430"/><stop offset="1" stop-color="#1d2c57"/>' : '<stop offset="0" stop-color="#8ccbf0"/><stop offset="1" stop-color="#e3f3fb"/>'
  }</linearGradient><radialGradient id="glow"><stop offset="0" stop-color="#ffd58a" stop-opacity=".55"/><stop offset="1" stop-color="#ffd58a" stop-opacity="0"/></radialGradient><radialGradient id="day"><stop offset="0" stop-color="#fff6d8" stop-opacity=".22"/><stop offset="1" stop-color="#fff6d8" stop-opacity="0"/></radialGradient></defs>`;
  const fl = N ? '#2a211b' : '#3d3027';
  const wl = N ? '#1b1d22' : '#262a31';
  const wr = N ? '#15171b' : '#1e2127';
  s += `<polygon points="${pp([RP(0, 0, 0), RP(10, 0, 0), RP(10, 10, 0), RP(0, 10, 0)])}" fill="${fl}"/>`;
  for (let i = 1; i < 10; i++) {
    const a = RP(0, i, 0);
    const b = RP(10, i, 0);
    s += `<line x1="${a[0]}" y1="${a[1]}" x2="${b[0]}" y2="${b[1]}" stroke="rgba(0,0,0,.22)" stroke-width=".8"/>`;
  }
  s += wallX(0, 10, 0, 7, wl) + wallY(0, 10, 0, 7, wr) + wallX(0, 10, 0, 0.35, shade(wl, -0.3)) + wallY(0, 10, 0, 0.35, shade(wr, -0.3));

  // pencere
  s += wallY(1.3, 4.7, 3.4, 6.3, '#2b2e35') + wallY(1.5, 4.5, 3.6, 6.1, 'url(#sky)');
  if (N) {
    for (const [a, b] of [[2, 5.6], [3.6, 5.2], [4.1, 5.8], [2.6, 4.6], [1.9, 4.2]]) {
      const p = RP(a, 0, b);
      s += `<circle cx="${p[0]}" cy="${p[1]}" r=".8" fill="#fff" opacity=".8"/>`;
    }
    const m = RP(3.9, 0, 5.4);
    s += `<circle cx="${m[0]}" cy="${m[1]}" r="5" fill="#f3efd9"/><circle cx="${m[0] + 2}" cy="${m[1] - 1.5}" r="4.2" fill="#14204a"/>`;
  } else {
    const m = RP(3.6, 0, 5.5);
    s += `<circle cx="${m[0]}" cy="${m[1]}" r="5" fill="#ffe08a"/>${wallY(1.5, 4.5, 3.6, 4.2, '#9cc7a3')}`;
  }
  s += wallY(2.95, 3.05, 3.6, 6.1, '#2b2e35') + wallY(1.5, 4.5, 4.8, 4.9, '#2b2e35');
  if (!N) {
    const c = RP(3, 2.5, 0);
    s += `<ellipse cx="${c[0]}" cy="${c[1]}" rx="70" ry="30" fill="url(#day)"/>`;
  }
  if (has('poster')) {
    s += wallY(6, 8.6, 3.4, 6.2, '#e9e2d2') + wallY(6.2, 8.4, 3.6, 6, '#2f4f6f');
    s += `<polygon points="${pp([RP(6.2, 0, 3.6), RP(7.1, 0, 5.1), RP(7.7, 0, 4.3), RP(8.4, 0, 5.4), RP(8.4, 0, 3.6)])}" fill="#d9e6ef"/>`;
  }
  if (has('frames')) {
    for (let i = 0; i < Math.min(6, x.badges); i++) {
      const y = 5.4 + (i % 3) * 1.25;
      const z = i < 3 ? 5.2 : 3.7;
      s += wallX(y, y + 1, z, z + 1.15, '#c9a55a') + wallX(y + 0.12, y + 0.88, z + 0.12, z + 1.03, i % 2 ? '#2e3a52' : '#3e2e46');
      const c = RP(0, y + 0.5, z + 0.58);
      s += `<circle cx="${c[0]}" cy="${c[1]}" r="3.2" fill="#f6c344" opacity=".9"/>`;
    }
  }
  if (has('rug')) s += flat(3, 3.6, 4.4, 3.8, '#3c4466') + flat(3.3, 3.9, 3.8, 3.2, '#4d5680') + flat(3.6, 4.2, 3.2, 2.6, '#3c4466');

  // masa
  let dk =
    bx(1.1, 0.5, 0, 0.2, 0.2, 2.6, '#4b3424') + bx(4.8, 0.5, 0, 0.2, 0.2, 2.6, '#4b3424') + bx(1.1, 2.1, 0, 0.2, 0.2, 2.6, '#4b3424') +
    bx(4.8, 2.1, 0, 0.2, 0.2, 2.6, '#4b3424') + bx(3.6, 0.5, 1.7, 1.4, 1.8, 0.9, '#55392a') + bx(1, 0.4, 2.6, 4.2, 2.1, 0.25, '#6b4a32');
  if (has('lamp')) {
    const b = RP(1.6, 0.9, 2.85);
    const top = RP(1.6, 0.9, 4.6);
    dk += bx(1.35, 0.65, 2.85, 0.5, 0.5, 0.12, '#2b2b2e') + `<line x1="${b[0]}" y1="${b[1]}" x2="${top[0]}" y2="${top[1]}" stroke="#2b2b2e" stroke-width="2"/>`;
    dk += bx(1.25, 0.55, 4.4, 0.7, 0.7, 0.5, N ? '#ffcf6b' : '#3a3a3e', { t: N ? '#ffe2a1' : undefined });
    if (N) {
      const c = RP(2.4, 1.5, 2.9);
      dk += `<ellipse cx="${c[0]}" cy="${c[1]}" rx="62" ry="34" fill="url(#glow)"/>`;
    }
  }
  if (has('monitor')) dk += bx(4.25, 0.6, 2.85, 0.6, 0.4, 0.1, '#222222') + bx(4.48, 0.72, 2.95, 0.14, 0.14, 0.5, '#222222') + wallYat(0.62, 3.9, 5.1, 3.4, 4.6, '#111318') + wallYat(0.6, 4, 5, 3.5, 4.5, N ? '#3d6fd0' : '#2a4b8f');
  if (has('laptop')) {
    dk += bx(2.2, 1.2, 2.85, 1.5, 1, 0.07, '#c3c7ce');
    dk += `<polygon points="${pp([RP(2.2, 1.2, 2.92), RP(3.7, 1.2, 2.92), RP(3.7, 1.05, 3.95), RP(2.2, 1.05, 3.95)])}" fill="#2a2e38"/>`;
    dk += `<polygon points="${pp([RP(2.3, 1.19, 3.02), RP(3.6, 1.19, 3.02), RP(3.6, 1.06, 3.85), RP(2.3, 1.06, 3.85)])}" fill="${N ? '#7fb0ff' : '#5d86c9'}" opacity=".9"/>`;
  }
  if (x.suIcildiBugun) dk += bx(4.62, 1.75, 2.85, 0.26, 0.26, 0.62, '#5fb8ea') + bx(4.67, 1.8, 3.47, 0.16, 0.16, 0.12, '#e9eef5'); // masada su şişesi
  add(4.6, dk);

  // sandalye
  add(
    6.2,
    bx(2.5, 2.85, 0, 0.12, 0.12, 1.5, '#222222') + bx(3.5, 2.85, 0, 0.12, 0.12, 1.5, '#222222') + bx(2.5, 3.85, 0, 0.12, 0.12, 1.5, '#222222') +
      bx(3.5, 3.85, 0, 0.12, 0.12, 1.5, '#222222') + bx(2.45, 2.8, 1.5, 1.25, 1.2, 0.2, '#2c2f36') + bx(2.45, 3.85, 1.7, 1.25, 0.16, 1.7, '#2c2f36'),
  );

  // raf (kitaplar Kütüphane modülü gelince dizilecek)
  if (has('shelf')) {
    let sh = bx(0, 1, 0, 1.15, 0.15, 6.4, '#4a3727') + bx(0, 1.15, 0, 1.15, 3.7, 0.15, '#4a3727');
    [0.15, 1.75, 3.35].forEach((z) => (sh += bx(0, 1.15, z + 1.45, 1.15, 3.7, 0.15, '#4a3727')));
    sh += bx(0, 1.15, 6.25, 1.15, 3.7, 0.15, '#4a3727') + bx(0, 4.85, 0, 1.15, 0.15, 6.4, '#4a3727');
    if (has('trophy')) {
      for (let i = 0; i < Math.min(4, x.chal); i++) {
        const y = 1.5 + i * 0.8;
        sh += bx(0.35, y, 6.4, 0.5, 0.5, 0.12, '#8a6a1e') + bx(0.48, y + 0.13, 6.52, 0.24, 0.24, 0.25, '#c9a046') + bx(0.38, y + 0.03, 6.77, 0.44, 0.44, 0.4, '#e6bd4f');
      }
    }
    add(3.4, sh);
  }

  // bitki: su içtikçe büyür, birkaç gün içmezsen solar
  if (has('plant')) {
    const w = x.bitkiSoluyor;
    const st = Math.min(4, 1 + Math.floor(x.waterDays / 4));
    const lc = w ? '#8f8d4a' : '#3f9a52';
    const lc2 = w ? '#a7a35a' : '#57b866';
    let pl = bx(0.35, 5.9, 0, 0.8, 0.8, 0.75, '#a85f3e');
    const c = RP(0.75, 6.3, 0.8);
    for (let i = 0; i < st + 2; i++) {
      const ang = -90 + (i - (st + 1) / 2) * 28;
      const len = 8 + st * 5;
      const ex = c[0] + Math.cos((ang * Math.PI) / 180) * len * 0.8;
      const ey = c[1] + Math.sin((ang * Math.PI) / 180) * len * (w ? 0.6 : 1) + (w ? 6 : 0);
      pl += `<path d="M${c[0]} ${c[1]} Q${(c[0] + ex) / 2} ${ey - 4} ${ex} ${ey}" stroke="${i % 2 ? lc : lc2}" stroke-width="${3.5 + st * 0.4}" stroke-linecap="round" fill="none"/>`;
    }
    add(7, pl);
  }

  if (has('bed'))
    add(9.6, bx(0, 7, 0, 0.25, 3, 2.1, '#3a2a1f') + bx(0.25, 7, 0, 3.3, 3, 0.6, '#3a2a1f') + bx(0.3, 7.05, 0.6, 3.2, 2.9, 0.45, '#ddd8ce') + bx(0.3, 8.2, 0.66, 3.2, 1.75, 0.45, '#34507a') + bx(0.5, 7.3, 1.05, 1.1, 0.9, 0.3, '#f1ede5'));

  if (has('rack')) {
    let r = bx(6.2, 0.4, 0, 2.2, 0.9, 0.9, '#2a2c31');
    const n = Math.min(4, 1 + Math.floor(x.wo / 5));
    for (let i = 0; i < n; i++) {
      const xx = 6.4 + i * 0.5;
      r += bx(xx, 0.5, 0.9, 0.14, 0.7, 0.14, '#1a1a1c') + bx(xx - 0.04, 0.45, 0.85, 0.22, 0.18, 0.26, '#111111') + bx(xx - 0.04, 1.07, 0.85, 0.22, 0.18, 0.26, '#111111');
    }
    add(7.2, r);
  }
  if (has('candle')) {
    const fp = RP(7.32, 6.62, 0.55);
    add(
      10.2,
      flat(6.2, 6.0, 1.1, 1, '#6b4c8a', 0.02) + flat(6.3, 6.1, 0.9, 0.8, '#7d5ca0', 0.06) + bx(7.2, 6.5, 0, 0.25, 0.25, 0.55, '#efe6d2') +
        `<path d="M${fp[0]} ${fp[1] - 12} q5 7 0 11 q-5 -4 0 -11z" fill="#ffb347"/>` + (N ? `<ellipse cx="${fp[0]}" cy="${fp[1]}" rx="46" ry="26" fill="url(#glow)"/>` : ''),
    );
  }
  if (has('mat')) add(10.4, flat(5.4, 6.9, 2.7, 1, '#2f7d6b', 0.02) + flat(5.4, 6.9, 0.25, 1, '#25665a', 0.03));
  if (has('bench'))
    add(10.8, bx(5.9, 4.6, 0, 0.2, 0.2, 1.05, '#1c1d20') + bx(8.4, 4.6, 0, 0.2, 0.2, 1.05, '#1c1d20') + bx(5.9, 5.2, 0, 0.2, 0.2, 1.05, '#1c1d20') + bx(8.4, 5.2, 0, 0.2, 0.2, 1.05, '#1c1d20') + bx(5.8, 4.5, 1.05, 3, 0.95, 0.35, '#31343b', { t: '#3f434c' }));
  if (has('tread'))
    add(11.2, bx(3.7, 5.7, 0, 2.6, 1.1, 0.4, '#22242a') + bx(3.8, 5.8, 0.4, 2.3, 0.9, 0.03, '#111111') + bx(3.75, 5.75, 0, 0.12, 0.12, 3.2, '#2c2f35') + bx(3.75, 6.65, 0, 0.12, 0.12, 3.2, '#2c2f35') + bx(3.7, 5.7, 3.2, 0.25, 1.1, 0.2, '#3a3d44'));
  if (has('bag')) {
    const a = RP(5.1, 8.1, 7);
    const b = RP(5.1, 8.1, 4.3);
    add(13.2, `<line x1="${a[0]}" y1="${a[1]}" x2="${b[0]}" y2="${b[1]}" stroke="#555555" stroke-width="1.2"/>` + bx(4.65, 7.65, 1.6, 0.9, 0.9, 2.7, '#7a1f22') + bx(4.65, 7.65, 4.1, 0.9, 0.9, 0.2, '#3a1012'));
  }
  if (has('pullup'))
    add(15.5, bx(8.4, 6.3, 0, 1.2, 0.25, 0.12, '#2a2c31') + bx(8.4, 8.7, 0, 1.2, 0.25, 0.12, '#2a2c31') + bx(8.9, 6.35, 0, 0.18, 0.18, 6.1, '#34373e') + bx(8.9, 8.75, 0, 0.18, 0.18, 6.1, '#34373e') + bx(8.93, 6.35, 5.85, 0.12, 2.55, 0.12, '#9aa0aa'));

  g.sort((a, b) => a.key - b.key);
  s += g.map((i) => i.svg).join('');
  return `<svg viewBox="20 0 320 312" xmlns="http://www.w3.org/2000/svg">${s}</svg>`;
}
