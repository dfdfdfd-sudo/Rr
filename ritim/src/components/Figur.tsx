import { memo, useEffect } from 'react';
import Animated, { Easing, SharedValue, useAnimatedProps, useSharedValue, withRepeat, withTiming } from 'react-native-reanimated';
import Svg, { Circle, Ellipse, Line, Path } from 'react-native-svg';

import { HAREKETLER } from '@/data/hareketler';
import { renk } from '@/theme';

// Prototipteki fig(): her hareketin A ve B pozu var, figür ikisi arasında gidip gelir.
// Noktalar: baş, omuz, kalça, ön dirsek, ön bilek, ön diz, ön ayak, (arka dirsek, bilek, diz, ayak).

type N = [number, number];
type Poz = Record<'h' | 's' | 'p' | 'e1' | 'w1' | 'k1' | 'f1' | 'e2' | 'w2' | 'k2' | 'f2', N>;

function poz(str: string): Poz {
  const a = str.split(' ').map((p) => p.split(',').map(Number) as N);
  const kay = (v: N): N => [v[0] - 2.5, v[1] - 1]; // arka uzuv verilmemişse biraz geride çiz
  return {
    h: a[0], s: a[1], p: a[2], e1: a[3], w1: a[4], k1: a[5], f1: a[6],
    e2: a[7] ?? kay(a[3]), w2: a[8] ?? kay(a[4]), k2: a[9] ?? kay(a[5]), f2: a[10] ?? kay(a[6]),
  };
}

const SEG: [keyof Poz, keyof Poz, number][] = [
  ['s', 'e2', 6], ['e2', 'w2', 6], ['p', 'k2', 7], ['k2', 'f2', 7], ['s', 'p', 11],
  ['p', 'k1', 7], ['k1', 'f1', 7], ['s', 'e1', 6], ['e1', 'w1', 6],
];

const ALine = Animated.createAnimatedComponent(Line);
const ACircle = Animated.createAnimatedComponent(Circle);

const ara = (a: number, b: number, t: number) => {
  'worklet';
  return a + (b - a) * t;
};

function Uzuv({ a1, a2, b1, b2, w, uzak, t }: { a1: N; a2: N; b1: N; b2: N; w: number; uzak: boolean; t: SharedValue<number> }) {
  const props = useAnimatedProps(() => ({
    x1: ara(a1[0], b1[0], t.value),
    y1: ara(a1[1], b1[1], t.value),
    x2: ara(a2[0], b2[0], t.value),
    y2: ara(a2[1], b2[1], t.value),
  }));
  return <ALine animatedProps={props} stroke={renk.figur} strokeWidth={w} strokeLinecap="round" opacity={uzak ? 0.42 : 1} />;
}

function Nokta({ a, b, r, t, dolu }: { a: N; b: N; r: number; t: SharedValue<number>; dolu: boolean }) {
  const props = useAnimatedProps(() => ({ cx: ara(a[0], b[0], t.value), cy: ara(a[1], b[1], t.value) }));
  return dolu ? (
    <ACircle animatedProps={props} r={r} fill={renk.figur} />
  ) : (
    <ACircle animatedProps={props} r={r} fill="none" stroke={renk.yazi} strokeWidth={2.5} />
  );
}

type Props = { id: string; boyut?: number; oynasin?: boolean; sure?: number };

/** Hareket figürü. oynasin=false ise ilk pozda durur (liste küçük resimleri için). */
export const Figur = memo(function Figur({ id, boyut = 100, oynasin = true, sure = 2600 }: Props) {
  const x = HAREKETLER[id];
  const t = useSharedValue(0);

  useEffect(() => {
    if (oynasin) t.value = withRepeat(withTiming(1, { duration: sure / 2, easing: Easing.bezier(0.45, 0, 0.55, 1) }), -1, true);
    else t.value = 0;
  }, [oynasin, sure, t]);

  if (!x) return null;
  const A = poz(x.A);
  const B = poz(x.B);
  const gol = { stroke: renk.yazi, strokeWidth: 3, strokeLinecap: 'round' as const, opacity: 0.35, fill: 'none' };

  return (
    <Svg width={boyut} height={boyut * 0.96} viewBox="0 0 100 96" accessibilityLabel={`${x.n} hareket animasyonu`}>
      <Ellipse cx={50} cy={90} rx={40} ry={2.5} fill={renk.yazi} opacity={0.12} />
      {x.prop === 'bar' && <Path d="M26 14h48M30 14v76M70 14v76" {...gol} />}
      {x.prop === 'chair' && <Path d="M16 60h26M18 60v30M40 60v30M18 60V36" {...gol} />}
      {x.prop === 'wall' && <Path d="M29 8v82" {...gol} strokeWidth={4} opacity={0.3} />}
      {x.prop === 'bench' && <Path d="M18 66h48M24 66v24M60 66v24" {...gol} />}
      {SEG.map(([a, b, w]) => (
        <Uzuv key={a + b} a1={A[a]} a2={A[b]} b1={B[a]} b2={B[b]} w={w} uzak={a.endsWith('2') || b.endsWith('2')} t={t} />
      ))}
      <Nokta a={A.h} b={B.h} r={6.2} t={t} dolu />
      {x.load ? <Nokta a={A.w1} b={B.w1} r={x.load === 'bar' ? 7 : 4} t={t} dolu={false} /> : null}
    </Svg>
  );
});
