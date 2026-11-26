import type { BottomTabBarProps } from 'expo-router/tabs';
import * as Haptics from 'expo-haptics';
import { router } from 'expo-router';
import { Pressable, StyleSheet, View } from 'react-native';
import { useSafeAreaInsets } from 'react-native-safe-area-context';

import { Ikon } from '@/components/Ikon';
import { Y } from '@/components/Y';
import { renk } from '@/theme';

const SEKMELER: Record<string, { ad: string; ikon: string }> = {
  index: { ad: 'Bugün', ikon: 'ev' },
  antrenman: { ad: 'Antrenman', ikon: 'dambil' },
  odam: { ad: 'Odam', ikon: 'oda' },
  profil: { ad: 'Profil', ikon: 'kisi' },
};

/** Prototipteki yüzen alt menü: 4 sekme + ortada beyaz "+" (hızlı kayıt). */
export function AltMenu({ state, navigateToTab }: BottomTabBarProps) {
  const alt = useSafeAreaInsets().bottom;
  const rotalar = state.routes.filter((r) => SEKMELER[r.name]);

  const sekme = (r: (typeof rotalar)[number]) => {
    const secili = state.routes[state.index]?.key === r.key;
    const m = SEKMELER[r.name];
    const c = secili ? renk.yazi : renk.soluk;
    return (
      <Pressable
        key={r.key}
        accessibilityRole="tab"
        accessibilityState={{ selected: secili }}
        accessibilityLabel={m.ad}
        onPress={() => {
          Haptics.selectionAsync();
          if (!secili) navigateToTab(r.key);
        }}
        style={s.sekme}
      >
        <Ikon ad={m.ikon} renk={c} />
        <Y k={700} b={11} r={c}>
          {m.ad}
        </Y>
      </Pressable>
    );
  };

  return (
    <View pointerEvents="box-none" style={[s.dis, { bottom: 12 + alt }]}>
      <View style={s.menu}>
        {sekme(rotalar[0])}
        {sekme(rotalar[1])}
        <Pressable
          accessibilityRole="button"
          accessibilityLabel="Hızlı kayıt"
          onPress={() => {
            Haptics.impactAsync(Haptics.ImpactFeedbackStyle.Medium);
            router.push('/hizli');
          }}
          style={({ pressed }) => [s.arti, pressed && { transform: [{ scale: 0.92 }] }]}
        >
          <Ikon ad="arti" boyut={26} renk={renk.vurguYazi} />
        </Pressable>
        {sekme(rotalar[2])}
        {sekme(rotalar[3])}
      </View>
    </View>
  );
}

const s = StyleSheet.create({
  dis: { position: 'absolute', left: 12, right: 12, alignItems: 'center' },
  menu: {
    width: '100%',
    maxWidth: 520,
    flexDirection: 'row',
    alignItems: 'center',
    padding: 6,
    borderRadius: 28,
    backgroundColor: renk.menu,
    borderWidth: 1,
    borderColor: renk.cizgi,
    shadowColor: '#000',
    shadowOpacity: 0.3,
    shadowRadius: 15,
    shadowOffset: { width: 0, height: 8 },
    elevation: 8,
  },
  sekme: { flex: 1, alignItems: 'center', justifyContent: 'center', gap: 2, minHeight: 52 },
  arti: {
    width: 52,
    height: 52,
    borderRadius: 26,
    backgroundColor: renk.vurgu,
    alignItems: 'center',
    justifyContent: 'center',
    marginHorizontal: 8,
  },
});
