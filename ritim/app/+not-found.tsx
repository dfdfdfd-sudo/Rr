import { Link, Stack } from 'expo-router';
import { StyleSheet, Text, View } from 'react-native';

import { renk, yazi } from '@/theme';

export default function Bulunamadi() {
  return (
    <>
      <Stack.Screen options={{ title: 'Bulunamadı' }} />
      <View style={s.kok}>
        <Text style={s.baslik}>Bu sayfa yok.</Text>
        <Link href="/" style={s.link}>Bugün'e dön</Link>
      </View>
    </>
  );
}

const s = StyleSheet.create({
  kok: { flex: 1, alignItems: 'center', justifyContent: 'center', backgroundColor: renk.zemin, padding: 20 },
  baslik: { ...yazi.altBaslik, color: renk.yazi },
  link: { marginTop: 16, color: renk.su, fontWeight: '700' },
});
