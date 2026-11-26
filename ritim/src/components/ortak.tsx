import * as Haptics from 'expo-haptics';
import { router } from 'expo-router';
import { ReactNode } from 'react';
import { Pressable, StyleSheet, View, ViewStyle } from 'react-native';

import { Ikon } from '@/components/Ikon';
import { Y } from '@/components/Y';
import { PROGRAMLAR } from '@/data/hareketler';
import { GUN_KISA } from '@/lib/tarih';
import { useGunluk } from '@/store/gunluk';
import { kose, renk } from '@/theme';

/** Büyük bölüm başlığı ("Haftalık plan", "Hazır antrenmanlar"…), istenirse yanında hap ve sağda bağlantı. */
export function Baslik2({ ad, hap, eylem, onEylem, ilk }: { ad: string; hap?: string; eylem?: string; onEylem?: () => void; ilk?: boolean }) {
  return (
    <View style={[s.b2, ilk && { marginTop: 14 }]}>
      <Y k={800} b={21} style={{ letterSpacing: -0.4 }}>
        {ad}
      </Y>
      {hap ? <Hap>{hap}</Hap> : null}
      {eylem ? (
        <Pressable accessibilityRole="button" onPress={onEylem} hitSlop={8} style={{ marginLeft: 'auto', minHeight: 36, justifyContent: 'center' }}>
          <Y k={700} b={14}>
            {eylem}
          </Y>
        </Pressable>
      ) : null}
    </View>
  );
}

/** Küçük yuvarlak etiket. sicak=true turuncu (seri). */
export function Hap({ children, ikon, sicak, style }: { children: ReactNode; ikon?: string; sicak?: boolean; style?: ViewStyle }) {
  const c = sicak ? renk.sicak : renk.yazi2;
  return (
    <View style={[s.hap, sicak && { backgroundColor: 'rgba(255,122,89,0.14)' }, style]}>
      {ikon ? <Ikon ad={ikon} boyut={16} renk={c} /> : null}
      <Y k={700} b={13} r={c}>
        {children}
      </Y>
    </View>
  );
}

/** Seçilebilir çip (filtre). */
export function Cip({ ad, secili, onPress }: { ad: string; secili: boolean; onPress: () => void }) {
  return (
    <Pressable
      accessibilityRole="button"
      accessibilityState={{ selected: secili }}
      onPress={() => {
        Haptics.selectionAsync();
        onPress();
      }}
      style={[s.cip, secili && { backgroundColor: renk.yazi, borderColor: renk.yazi }]}
    >
      <Y k={700} b={14} r={secili ? renk.zemin : renk.yazi}>
        {ad}
      </Y>
    </Pressable>
  );
}

/** Açma-kapama anahtarı (prototipteki .sw). */
export function Anahtar({ acik, onPress, etiket }: { acik: boolean; onPress: () => void; etiket: string }) {
  return (
    <Pressable
      accessibilityRole="switch"
      accessibilityState={{ checked: acik }}
      accessibilityLabel={etiket}
      onPress={() => {
        Haptics.selectionAsync();
        onPress();
      }}
      style={[s.sw, acik && { backgroundColor: renk.iyi, borderColor: renk.iyi }]}
    >
      <View style={[s.swTop, { left: acik ? 23 : 3 }]} />
    </Pressable>
  );
}

/** Zorluk noktaları: ●●○ */
export function SeviyeNoktalari({ n }: { n: number }) {
  return (
    <View style={{ flexDirection: 'row', gap: 2, marginRight: 4 }}>
      {[1, 2, 3].map((i) => (
        <View key={i} style={{ width: 5, height: 5, borderRadius: 3, backgroundColor: i <= n ? renk.yazi : renk.cizgi }} />
      ))}
    </View>
  );
}

/** İnce ilerleme çubuğu. */
export function Cubuk({ oran, renk: c = renk.iyi, kalin = 8 }: { oran: number; renk?: string; kalin?: number }) {
  return (
    <View style={{ height: kalin, borderRadius: 99, backgroundColor: renk.kart2, overflow: 'hidden' }}>
      <View style={{ width: `${Math.max(0, Math.min(1, oran)) * 100}%`, height: '100%', borderRadius: 99, backgroundColor: c }} />
    </View>
  );
}

/** Haftalık plan şeridi (Pzt…Paz). Bir güne dokununca o günün programı seçilir. */
export function PlanSeridi({ kisa }: { kisa?: boolean }) {
  const g = useGunluk();
  const bugunNo = new Date().getDay();
  return (
    <View style={s.plan}>
      {[1, 2, 3, 4, 5, 6, 0].map((i) => {
        const p = PROGRAMLAR.find((x) => x.id === g.plan[i]);
        const ad = p ? (kisa ? 'Antrenman' : p.n.replace('Salon · ', '').split(' ').slice(0, 2).join(' ')) : 'Dinlen';
        return (
          <Pressable
            key={i}
            accessibilityRole="button"
            accessibilityLabel={`${GUN_KISA[i]}: ${p ? p.n : 'dinlenme'}`}
            onPress={() => {
              Haptics.selectionAsync();
              router.push({ pathname: '/plan-gun', params: { gun: String(i) } });
            }}
            style={[s.pd, p && s.pdOn, !kisa && i === bugunNo && s.pdBugun]}
          >
            <Y k={700} b={12} r={p ? renk.vurguYazi : renk.yazi}>
              {GUN_KISA[i]}
            </Y>
            <Y k={600} b={kisa && p ? 9.5 : 11} r={p ? renk.vurguYazi : renk.yazi} numberOfLines={2} style={{ textAlign: 'center', opacity: 0.85, lineHeight: 13 }}>
              {ad}
            </Y>
          </Pressable>
        );
      })}
    </View>
  );
}

export const kartStil = { backgroundColor: renk.kart, borderWidth: 1, borderColor: renk.cizgi, borderRadius: kose.kart } as const;

const s = StyleSheet.create({
  b2: { flexDirection: 'row', alignItems: 'center', gap: 8, marginTop: 30, marginBottom: 12 },
  hap: { flexDirection: 'row', alignItems: 'center', gap: 6, minHeight: 34, paddingHorizontal: 12, borderRadius: 99, backgroundColor: renk.kart2, alignSelf: 'flex-start' },
  cip: { minHeight: 40, paddingHorizontal: 16, borderRadius: 99, borderWidth: 1, borderColor: renk.cizgi, backgroundColor: renk.kart, justifyContent: 'center' },
  sw: { width: 52, height: 32, borderRadius: 99, backgroundColor: renk.kart2, borderWidth: 1, borderColor: renk.cizgi },
  swTop: { position: 'absolute', top: 3, width: 24, height: 24, borderRadius: 12, backgroundColor: '#fff', shadowColor: '#000', shadowOpacity: 0.25, shadowRadius: 2, shadowOffset: { width: 0, height: 1 } },
  plan: { flexDirection: 'row', gap: 6 },
  pd: { flex: 1, minHeight: 76, borderRadius: 16, borderWidth: 1, borderColor: renk.cizgi, backgroundColor: renk.kart, alignItems: 'center', justifyContent: 'center', gap: 4, paddingVertical: 6, paddingHorizontal: 2 },
  pdOn: { backgroundColor: renk.vurgu, borderColor: renk.vurgu },
  pdBugun: { borderWidth: 2, borderColor: renk.yazi },
});
