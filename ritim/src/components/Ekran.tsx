import { router } from 'expo-router';
import { ReactNode } from 'react';
import { Pressable, ScrollView, StyleSheet, View } from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';

import { Ikon } from '@/components/Ikon';
import { Y } from '@/components/Y';
import { bosluk, renk } from '@/theme';

type Props = {
  /** Büyük başlık (Antrenman, Odam, Su…). Bugün ekranı kendi başlığını çizer. */
  baslik?: string;
  /** Başlığın solunda geri düğmesi */
  geri?: boolean;
  /** Başlığın sağındaki küçük öğeler (rozet vb.) */
  sag?: ReactNode;
  children?: ReactNode;
};

/** Her ekranın ortak iskeleti. Alt menünün altında kalmasın diye altta boşluk bırakır. */
export function Ekran({ baslik, geri, sag, children }: Props) {
  return (
    <SafeAreaView style={s.kok} edges={['top']}>
      <ScrollView contentContainerStyle={s.ic} showsVerticalScrollIndicator={false}>
        {baslik ? (
          <View style={s.ust}>
            {geri ? (
              <Pressable accessibilityRole="button" accessibilityLabel="Geri" onPress={() => router.back()} style={s.geri}>
                <Ikon ad="geri" renk={renk.yazi} />
              </Pressable>
            ) : null}
            <Y k={800} b={30} style={s.baslik}>
              {baslik}
            </Y>
            {sag}
          </View>
        ) : null}
        {children}
      </ScrollView>
    </SafeAreaView>
  );
}

/** Bölüm başlığı: küçük, büyük harfli, soluk ("ALIŞKANLIKLAR 0/3 … Ekle"). */
export function Bolum({ ad, sayac, eylem, onEylem }: { ad: string; sayac?: string; eylem?: string; onEylem?: () => void }) {
  return (
    <View style={s.bolum}>
      <Y k={700} b={13} r={renk.soluk} style={s.bolumAd}>
        {ad.toLocaleUpperCase('tr-TR')}
      </Y>
      {sayac ? (
        <Y k={700} b={13} style={s.bolumAd}>
          {sayac}
        </Y>
      ) : null}
      {eylem ? (
        <Pressable accessibilityRole="button" onPress={onEylem} style={s.bolumEylem} hitSlop={8}>
          <Y k={700} b={14}>
            {eylem}
          </Y>
        </Pressable>
      ) : null}
    </View>
  );
}

const s = StyleSheet.create({
  kok: { flex: 1, backgroundColor: renk.zemin },
  ic: { paddingHorizontal: bosluk.l, paddingTop: 14, paddingBottom: 130 },
  ust: { flexDirection: 'row', alignItems: 'center', gap: 10, minHeight: 48, marginBottom: 8 },
  geri: {
    width: 44,
    height: 44,
    borderRadius: 22,
    backgroundColor: renk.kart2,
    alignItems: 'center',
    justifyContent: 'center',
  },
  baslik: { flex: 1, letterSpacing: -0.6 },
  bolum: { flexDirection: 'row', alignItems: 'center', gap: 8, marginTop: 28, marginBottom: 10, marginHorizontal: 4, minHeight: 24 },
  bolumAd: { letterSpacing: 1 },
  bolumEylem: { marginLeft: 'auto', minHeight: 32, justifyContent: 'center' },
});
