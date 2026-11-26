import * as Haptics from 'expo-haptics';
import { router } from 'expo-router';
import { Pressable, StyleSheet, View } from 'react-native';

import { Ikon } from '@/components/Ikon';
import { Y } from '@/components/Y';
import { bugun } from '@/lib/tarih';
import { useGunluk } from '@/store/gunluk';
import { aracRenk, kose, renk } from '@/theme';

/** "+" düğmesinin açtığı hızlı kayıt sayfası. */
export default function Hizli() {
  const g = useGunluk();
  const git = (ad: string) => {
    router.back();
    setTimeout(() => router.push({ pathname: '/modul/[ad]', params: { ad } }), 50);
  };
  const ogeler = [
    {
      ad: '+250 ml su',
      ikon: 'su',
      renk: aracRenk.su,
      f: () => {
        Haptics.notificationAsync(Haptics.NotificationFeedbackType.Success);
        g.suEkle(bugun(), 250);
        router.back();
      },
    },
    { ad: 'Kilo', ikon: 'tarti', renk: aracRenk.vucut, f: () => git('vucut') },
    { ad: 'Ruh hali', ikon: 'kalp', renk: aracRenk.ruh, f: () => git('ruh') },
    { ad: 'Uyku', ikon: 'ay', renk: aracRenk.uyku, f: () => git('uyku') },
  ];
  return (
    <View style={s.kok}>
      <Y k={800} b={22} style={{ letterSpacing: -0.4 }}>
        Hızlı kayıt
      </Y>
      <View style={s.izgara}>
        {ogeler.map((o) => (
          <Pressable key={o.ad} accessibilityRole="button" onPress={o.f} style={({ pressed }) => [s.oge, pressed && { backgroundColor: renk.iz }]}>
            <View style={[s.ikon, { backgroundColor: o.renk }]}>
              <Ikon ad={o.ikon} renk="#fff" />
            </View>
            <Y k={700} b={15}>
              {o.ad}
            </Y>
          </Pressable>
        ))}
      </View>
    </View>
  );
}

const s = StyleSheet.create({
  kok: { flex: 1, backgroundColor: renk.kart, padding: 20, paddingTop: 28 },
  izgara: { flexDirection: 'row', flexWrap: 'wrap', gap: 10, marginTop: 16 },
  oge: { flexBasis: '47%', flexGrow: 1, flexDirection: 'row', alignItems: 'center', gap: 12, padding: 14, borderRadius: kose.kucuk, backgroundColor: renk.kart2, minHeight: 64 },
  ikon: { width: 40, height: 40, borderRadius: 12, alignItems: 'center', justifyContent: 'center' },
});
