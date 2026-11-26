import * as Haptics from 'expo-haptics';
import { router } from 'expo-router';
import { Pressable, ScrollView, StyleSheet, View } from 'react-native';

import { Ikon } from '@/components/Ikon';
import { Y } from '@/components/Y';
import { ALISKANLIK_KUTUPHANESI } from '@/data/varsayilan';
import { useGunluk } from '@/store/gunluk';
import { renk } from '@/theme';

/** Alışkanlık kütüphanesinden tek dokunuşla ekleme. */
export default function AliskanlikEkle() {
  const g = useGunluk();
  return (
    <ScrollView style={{ flex: 1, backgroundColor: renk.kart }} contentContainerStyle={{ padding: 20, paddingTop: 28, paddingBottom: 40 }}>
      <Y k={800} b={24} style={{ letterSpacing: -0.4 }}>
        Alışkanlık ekle
      </Y>
      <Y k={500} b={15} r={renk.yazi2} style={{ marginTop: 6 }}>
        Küçük başla: her gün yapabileceğin bir şey seç.
      </Y>
      <View style={{ marginTop: 12, gap: 10 }}>
        {ALISKANLIK_KUTUPHANESI.map((a) => {
          const var_ = g.aliskanliklar.some((x) => x.id === a.id);
          return (
            <Pressable
              key={a.id}
              accessibilityRole="button"
              accessibilityState={{ disabled: var_ }}
              disabled={var_}
              onPress={() => {
                Haptics.notificationAsync(Haptics.NotificationFeedbackType.Success);
                g.aliskanlikEkle(a);
                router.back();
              }}
              style={[s.oge, var_ && { opacity: 0.45 }]}
            >
              <View style={[s.tile, { backgroundColor: a.renk + '21' }]}>
                <Ikon ad={a.ikon} renk={a.renk} />
              </View>
              <Y k={700} b={16} style={{ flex: 1 }}>
                {a.ad}
              </Y>
              <Y k={600} b={13} r={renk.soluk}>
                {var_ ? 'Ekli' : ''}
              </Y>
            </Pressable>
          );
        })}
      </View>
    </ScrollView>
  );
}

const s = StyleSheet.create({
  oge: { flexDirection: 'row', alignItems: 'center', gap: 12, padding: 12, borderRadius: 18, backgroundColor: renk.zemin, borderWidth: 1, borderColor: renk.cizgi, minHeight: 64 },
  tile: { width: 44, height: 44, borderRadius: 14, alignItems: 'center', justifyContent: 'center' },
});
