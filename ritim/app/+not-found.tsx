import { Link, Stack } from 'expo-router';
import { StyleSheet, View } from 'react-native';

import { Y } from '@/components/Y';
import { renk } from '@/theme';

export default function Bulunamadi() {
  return (
    <>
      <Stack.Screen options={{ title: 'Bulunamadı' }} />
      <View style={s.kok}>
        <Y k={800} b={21}>Bu sayfa yok.</Y>
        <Link href="/" style={s.link}>Bugün'e dön</Link>
      </View>
    </>
  );
}

const s = StyleSheet.create({
  kok: { flex: 1, alignItems: 'center', justifyContent: 'center', backgroundColor: renk.zemin, padding: 20 },
  link: { marginTop: 16, color: renk.su, fontWeight: '700' },
});
