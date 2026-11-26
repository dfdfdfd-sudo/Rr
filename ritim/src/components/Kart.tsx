import * as Haptics from 'expo-haptics';
import { ReactNode } from 'react';
import { Pressable, StyleSheet, Text, View, ViewStyle } from 'react-native';

import { bosluk, kose, renk, yazi } from '@/theme';

type Props = {
  baslik?: string;
  alt?: string;
  vurgu?: string; // modül rengi
  onPress?: () => void;
  style?: ViewStyle;
  children?: ReactNode;
};

/** Yumuşak köşeli koyu kart. Dokunulabiliyorsa hafif titreşim + basılma efekti verir. */
export function Kart({ baslik, alt, vurgu, onPress, style, children }: Props) {
  const icerik = (
    <>
      {baslik ? (
        <View style={s.satir}>
          {vurgu ? <View style={[s.nokta, { backgroundColor: vurgu }]} /> : null}
          <Text style={s.baslik}>{baslik}</Text>
        </View>
      ) : null}
      {alt ? <Text style={s.alt}>{alt}</Text> : null}
      {children}
    </>
  );

  if (!onPress) return <View style={[s.kart, style]}>{icerik}</View>;

  return (
    <Pressable
      accessibilityRole="button"
      onPress={() => {
        Haptics.selectionAsync();
        onPress();
      }}
      style={({ pressed }) => [s.kart, style, pressed && { transform: [{ scale: 0.98 }], opacity: 0.9 }]}
    >
      {icerik}
    </Pressable>
  );
}

const s = StyleSheet.create({
  kart: {
    backgroundColor: renk.kart,
    borderColor: renk.cizgi,
    borderWidth: 1,
    borderRadius: kose.kart,
    padding: bosluk.l,
    marginBottom: bosluk.m,
  },
  satir: { flexDirection: 'row', alignItems: 'center', gap: bosluk.s },
  nokta: { width: 10, height: 10, borderRadius: 5 },
  baslik: { ...yazi.altBaslik, fontSize: 18, color: renk.yazi },
  alt: { ...yazi.govde, color: renk.soluk, marginTop: 4 },
});
