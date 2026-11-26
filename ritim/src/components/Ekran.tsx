import { ReactNode } from 'react';
import { ScrollView, StyleSheet, Text, View } from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';

import { bosluk, renk, yazi } from '@/theme';

type Props = { ust?: string; baslik: string; children?: ReactNode };

/** Her sekmenin ortak iskeleti: üst etiket + büyük başlık + içerik. */
export function Ekran({ ust, baslik, children }: Props) {
  return (
    <SafeAreaView style={s.kok} edges={['top']}>
      <ScrollView contentContainerStyle={s.ic}>
        {ust ? <Text style={s.ust}>{ust}</Text> : null}
        <Text style={s.baslik}>{baslik}</Text>
        <View style={{ height: bosluk.l }} />
        {children}
      </ScrollView>
    </SafeAreaView>
  );
}

const s = StyleSheet.create({
  kok: { flex: 1, backgroundColor: renk.zemin },
  ic: { padding: bosluk.l, paddingBottom: 120 },
  ust: { ...yazi.ust, color: renk.soluk },
  baslik: { ...yazi.baslik, color: renk.yazi, marginTop: 2 },
});
