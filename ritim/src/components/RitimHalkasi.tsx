import { useEffect } from 'react';
import Animated, { useAnimatedProps, useSharedValue, withTiming } from 'react-native-reanimated';
import Svg, { Circle, Text as SvgText } from 'react-native-svg';

import { skorRengi } from '@/lib/skor';
import { renk, yaziTipi } from '@/theme';

const AnimCircle = Animated.createAnimatedComponent(Circle);
const R = 78;
const CEVRE = 2 * Math.PI * R;

/** Bugün ekranındaki büyük "RİTİM" skor halkası (0–100). Skor değişince halka akarak dolar. */
export function RitimHalkasi({ skor, boyut = 200 }: { skor: number; boyut?: number }) {
  const p = useSharedValue(0);
  useEffect(() => {
    p.value = withTiming(skor / 100, { duration: 800 });
  }, [skor, p]);

  const yay = useAnimatedProps(() => ({ strokeDasharray: [CEVRE * p.value, CEVRE] }));

  return (
    <Svg width={boyut} height={boyut} viewBox="0 0 180 180" accessibilityLabel={`Ritim skoru ${skor}`}>
      <Circle cx={90} cy={90} r={R} fill="none" stroke={renk.iz} strokeWidth={8} />
      <AnimCircle
        cx={90}
        cy={90}
        r={R}
        fill="none"
        stroke={skorRengi(skor)}
        strokeWidth={8}
        strokeLinecap="round"
        animatedProps={yay}
        transform="rotate(-90 90 90)"
      />
      <SvgText
        x={90}
        y={98}
        textAnchor="middle"
        fontSize={58}
        fontFamily={yaziTipi[800]}
        fontWeight="800"
        letterSpacing={-2}
        fill={renk.yazi}
      >
        {skor}
      </SvgText>
      <SvgText
        x={90}
        y={124}
        textAnchor="middle"
        fontSize={11}
        fontFamily={yaziTipi[700]}
        fontWeight="700"
        letterSpacing={2.5}
        fill={renk.soluk}
      >
        RİTİM
      </SvgText>
    </Svg>
  );
}
