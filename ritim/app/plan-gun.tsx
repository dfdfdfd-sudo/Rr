import * as Haptics from 'expo-haptics';
import { router, useLocalSearchParams } from 'expo-router';
import { Pressable, ScrollView, StyleSheet, View } from 'react-native';

import { Ikon } from '@/components/Ikon';
import { Y } from '@/components/Y';
import { PROGRAMLAR } from '@/data/hareketler';
import { GUN_UZUN } from '@/lib/tarih';
import { useGunluk } from '@/store/gunluk';
import { renk } from '@/theme';

/** Haftalık planda bir güne dokununca açılır: "Bu güne ne koyalım?" */
export default function PlanGun() {
  const { gun } = useLocalSearchParams<{ gun: string }>();
  const n = Number(gun);
  const g = useGunluk();
  const sec = (pid: string | null) => {
    Haptics.selectionAsync();
    g.planAyarla(n, pid);
    router.back();
  };
  const secenekler = [...PROGRAMLAR.filter((p) => p.id !== 'yoga' || g.modulAcik('yoga')).map((p) => ({ id: p.id as string | null, ad: p.n, alt: `${p.w} · ${p.min} dk` })), { id: null, ad: 'Dinlenme günü', alt: 'Kaslar toparlanır' }];

  return (
    <ScrollView style={{ flex: 1, backgroundColor: renk.kart }} contentContainerStyle={{ padding: 20, paddingTop: 28, paddingBottom: 40 }}>
      <Y k={800} b={24} style={{ letterSpacing: -0.4 }}>
        {GUN_UZUN[n]}
      </Y>
      <Y k={500} b={15} r={renk.yazi2} style={{ marginTop: 6 }}>
        Bu güne ne koyalım?
      </Y>
      <View style={{ marginTop: 12 }}>
        {secenekler.map((o) => {
          const on = (g.plan[n] ?? null) === o.id;
          return (
            <Pressable key={o.ad} accessibilityRole="radio" accessibilityState={{ selected: on }} onPress={() => sec(o.id)} style={[s.opt, on && s.optOn]}>
              <View style={{ flex: 1 }}>
                <Y k={800} b={16}>
                  {o.ad}
                </Y>
                <Y k={500} b={13} r={renk.soluk}>
                  {o.alt}
                </Y>
              </View>
              <View style={[s.rd, on && { backgroundColor: renk.vurgu, borderColor: renk.vurgu }]}>{on ? <Ikon ad="tik" boyut={14} renk={renk.vurguYazi} kalinlik={3} /> : null}</View>
            </Pressable>
          );
        })}
      </View>
    </ScrollView>
  );
}

const s = StyleSheet.create({
  opt: { flexDirection: 'row', alignItems: 'center', gap: 14, padding: 16, borderRadius: 20, backgroundColor: renk.zemin, borderWidth: 1.5, borderColor: renk.cizgi, marginTop: 10, minHeight: 68 },
  optOn: { borderColor: renk.yazi, backgroundColor: 'rgba(255,255,255,0.06)' },
  rd: { width: 24, height: 24, borderRadius: 12, borderWidth: 2, borderColor: renk.cizgi, alignItems: 'center', justifyContent: 'center' },
});
