import { StyleSheet, View } from 'react-native';

import { Ikon } from '@/components/Ikon';
import { Y } from '@/components/Y';
import { kose, renk } from '@/theme';

/** Henüz prototipten taşınmamış ekranlar için dürüst bir yer tutucu. */
export function Yakinda({ ikon, metin }: { ikon: string; metin: string }) {
  return (
    <View style={s.kart}>
      <View style={s.ikon}>
        <Ikon ad={ikon} renk={renk.yazi2} />
      </View>
      <Y k={700} b={16}>
        Sırada
      </Y>
      <Y k={500} b={14} r={renk.soluk} style={{ lineHeight: 20 }}>
        {metin}
      </Y>
    </View>
  );
}

const s = StyleSheet.create({
  kart: { backgroundColor: renk.kart, borderWidth: 1, borderColor: renk.cizgi, borderRadius: kose.kart, padding: 18, gap: 6 },
  ikon: { width: 40, height: 40, borderRadius: 14, backgroundColor: renk.kart2, alignItems: 'center', justifyContent: 'center', marginBottom: 6 },
});
