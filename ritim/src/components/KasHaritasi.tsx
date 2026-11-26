import { useRef } from 'react';
import { GestureResponderEvent, HostInstance, Pressable, StyleSheet, View } from 'react-native';
import { SvgXml } from 'react-native-svg';

import { kartStil } from '@/components/ortak';
import { Y } from '@/components/Y';
import { renk } from '@/theme';

// Prototipteki muscleMap(): ön ve arka vücut, son 7 günde çalışan kaslar turuncuya boyanır.
// Yük: kas adı → set sayısı. Rehberli antrenman gelince doldurulacak; şimdilik boş.

const TUM = ['Göğüs', 'Sırt', 'Omuz', 'Pazı', 'Arka kol', 'Karın', 'Bel', 'Ön bacak', 'Arka bacak', 'Kalça', 'Baldır'];

// sıcak (#ff7a59) ile kart2 (#1a1b1e) karışımı
function karis(t: number) {
  const a = [0x1a, 0x1b, 0x1e];
  const b = [0xff, 0x7a, 0x59];
  return '#' + a.map((v, i) => Math.round(v + (b[i] - v) * t).toString(16).padStart(2, '0')).join('');
}

function svgMetni(yuk: Record<string, number>, secili?: string) {
  const mx = Math.max(6, ...Object.values(yuk));
  const dolgu = (m: string) => (yuk[m] ? karis(0.3 + Math.min(1, yuk[m] / mx) * 0.7) : renk.kart2);
  const R = (m: string, ic: string) =>
    m === secili ? `<g fill="${dolgu(m)}" stroke="${renk.yazi}" stroke-width="2.5">${ic}</g>` : `<g fill="${dolgu(m)}" stroke="rgba(244,244,243,.18)" stroke-width="1">${ic}</g>`;
  const el = (x: number, y: number, rx: number, ry: number) => `<ellipse cx="${x}" cy="${y}" rx="${rx}" ry="${ry}"/>`;
  const rr = (x: number, y: number, w: number, h: number, r: number) => `<rect x="${x}" y="${y}" width="${w}" height="${h}" rx="${r}"/>`;
  const govde = (cx: number) =>
    `<g fill="#1f2022" stroke="${renk.cizgi}" stroke-width="1"><circle cx="${cx}" cy="26" r="15"/>${rr(cx - 6, 40, 12, 12, 4)}${el(cx - 37, 138, 7, 20)}${el(cx + 37, 138, 7, 20)}${el(cx - 37, 166, 6, 8)}${el(cx + 37, 166, 6, 8)}${rr(cx - 24, 138, 48, 22, 10)}${el(cx - 10, 250, 8, 26)}${el(cx + 10, 250, 8, 26)}${el(cx - 11, 282, 9, 5)}${el(cx + 11, 282, 9, 5)}</g>`;
  const F = 70;
  const B = 210;
  const on =
    govde(F) + R('Omuz', el(F - 26, 66, 12, 10) + el(F + 26, 66, 12, 10)) + R('Göğüs', rr(F - 19, 58, 18, 30, 8) + rr(F + 1, 58, 18, 30, 8)) +
    R('Pazı', el(F - 34, 100, 8, 19) + el(F + 34, 100, 8, 19)) + R('Karın', rr(F - 13, 92, 26, 46, 8)) + R('Ön bacak', el(F - 11, 192, 11, 32) + el(F + 11, 192, 11, 32));
  const arka =
    govde(B) + R('Omuz', el(B - 26, 66, 12, 10) + el(B + 26, 66, 12, 10)) + R('Sırt', `<path d="M${B - 20} 56 L${B + 20} 56 L${B + 16} 112 L${B - 16} 112 Z"/>`) +
    R('Arka kol', el(B - 34, 100, 8, 19) + el(B + 34, 100, 8, 19)) + R('Bel', rr(B - 14, 112, 28, 26, 8)) + R('Kalça', el(B - 11, 152, 12, 13) + el(B + 11, 152, 12, 13)) +
    R('Arka bacak', el(B - 11, 196, 11, 28) + el(B + 11, 196, 11, 28)) + R('Baldır', el(B - 10, 248, 8, 22) + el(B + 10, 248, 8, 22));
  return `<svg viewBox="0 0 280 296" xmlns="http://www.w3.org/2000/svg">${on}${arka}</svg>`;
}

// Dokunulan noktanın hangi kasa denk geldiğini bulmak için kaba bölgeler (280x296 çizim koordinatı).
const F0 = 70;
const B0 = 210;
const BOLGE: [string, number, number, number, number][] = [
  // [kas, x1, y1, x2, y2]
  ['Omuz', F0 - 38, 56, F0 - 14, 76], ['Omuz', F0 + 14, 56, F0 + 38, 76], ['Göğüs', F0 - 19, 58, F0 + 19, 88],
  ['Pazı', F0 - 42, 81, F0 - 26, 119], ['Pazı', F0 + 26, 81, F0 + 42, 119], ['Karın', F0 - 13, 89, F0 + 13, 138],
  ['Ön bacak', F0 - 22, 160, F0 + 22, 224],
  ['Omuz', B0 - 38, 56, B0 - 14, 76], ['Omuz', B0 + 14, 56, B0 + 38, 76], ['Sırt', B0 - 20, 56, B0 + 20, 112],
  ['Arka kol', B0 - 42, 81, B0 - 26, 119], ['Arka kol', B0 + 26, 81, B0 + 42, 119], ['Bel', B0 - 14, 112, B0 + 14, 138],
  ['Kalça', B0 - 23, 139, B0 + 23, 165], ['Arka bacak', B0 - 22, 168, B0 + 22, 224], ['Baldır', B0 - 18, 226, B0 + 18, 270],
];

export function KasHaritasi({ yuk = {}, secili, onKas }: { yuk?: Record<string, number>; secili?: string; onKas?: (kas: string) => void }) {
  const kutu = useRef<HostInstance>(null);
  // Dokunulan noktayı ekrandaki gerçek konumdan hesapla (telefon ve web'de aynı sonucu verir).
  const dokun = (e: GestureResponderEvent) => {
    const { pageX, pageY } = e.nativeEvent;
    kutu.current?.measureInWindow((ox: number, oy: number, w: number) => {
      const k = 280 / w;
      const x = (pageX - ox) * k;
      const y = (pageY - oy) * k;
      const b = BOLGE.find(([, x1, y1, x2, y2]) => x >= x1 && x <= x2 && y >= y1 && y <= y2);
      if (b && onKas) onKas(b[0]);
    });
  };
  const enCok = Object.entries(yuk).sort((a, b) => b[1] - a[1]).slice(0, 3).map((x) => x[0]);
  const hic = TUM.filter((m) => !yuk[m]);
  return (
    <View style={[kartStil, { padding: 18 }]}>
      <Pressable ref={kutu} accessibilityLabel="Kas haritası: bir kasa dokun" onPress={dokun} style={{ width: '100%', aspectRatio: 280 / 296 }}>
        <View pointerEvents="none" style={StyleSheet.absoluteFill}>
          <SvgXml xml={svgMetni(yuk, secili)} width="100%" height="100%" />
        </View>
        <View style={s.etiketler} pointerEvents="none">
          <Y k={700} b={11} r={renk.soluk} style={{ width: '50%', textAlign: 'center' }}>
            Ön
          </Y>
          <Y k={700} b={11} r={renk.soluk} style={{ width: '50%', textAlign: 'center' }}>
            Arka
          </Y>
        </View>
      </Pressable>
      <View style={s.lejant}>
        {[
          ['Çalışmadı', renk.kart2],
          ['Az', karis(0.45)],
          ['Çok', renk.sicak],
        ].map(([ad, c]) => (
          <View key={ad} style={s.lejantOge}>
            <View style={[s.kare, { backgroundColor: c }]} />
            <Y k={600} b={12} r={renk.soluk}>
              {ad}
            </Y>
          </View>
        ))}
        <View style={s.lejantOge}>
          <View style={[s.kare, { borderWidth: 1.5, borderColor: '#ffd27a', borderStyle: 'dashed' }]} />
          <Y k={600} b={12} r={renk.soluk}>
            Dinleniyor
          </Y>
        </View>
      </View>
      <Y k={500} b={13} r={renk.soluk} style={{ marginTop: 8, lineHeight: 19 }}>
        {enCok.length ? `Bu hafta en çok ${enCok.join(', ')} çalıştı. ` : 'Bu hafta henüz antrenman yok. '}
        {enCok.length && hic.length ? `Hiç çalışmayan: ${hic.slice(0, 3).join(', ')}${hic.length > 3 ? '…' : ''}. ` : ''}
        Bir kasa dokununca o kası çalıştıran hareketler gelir.
      </Y>
    </View>
  );
}

const s = StyleSheet.create({
  etiketler: { position: 'absolute', left: 0, right: 0, bottom: 0, flexDirection: 'row' },
  lejant: { flexDirection: 'row', flexWrap: 'wrap', gap: 12, marginTop: 8 },
  lejantOge: { flexDirection: 'row', alignItems: 'center', gap: 5 },
  kare: { width: 12, height: 12, borderRadius: 4 },
});
