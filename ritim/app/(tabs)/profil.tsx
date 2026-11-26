import { StyleSheet, View } from 'react-native';

import { Ekran } from '@/components/Ekran';
import { Yakinda } from '@/components/Yakinda';
import { Y } from '@/components/Y';
import { useGunluk } from '@/store/gunluk';
import { kose, renk } from '@/theme';

export default function Profil() {
  const { ad } = useGunluk();
  return (
    <Ekran>
      <View style={s.kart}>
        <View style={s.harf}>
          <Y k={800} b={34} r={renk.vurguYazi}>
            {ad.charAt(0).toLocaleUpperCase('tr-TR')}
          </Y>
        </View>
        <Y k={800} b={28} style={{ letterSpacing: -0.5 }}>
          {ad}
        </Y>
        <Y k={500} b={14} r={renk.soluk}>
          Verilerin sadece bu telefonda duruyor
        </Y>
      </View>
      <View style={{ height: 12 }} />
      <Yakinda ikon="kisi" metin="Seviye, seri, ilerleme ve istatistikler, haftalık plan ve ayarlar prototipten buraya taşınacak." />
    </Ekran>
  );
}

const s = StyleSheet.create({
  kart: { backgroundColor: renk.kart, borderWidth: 1, borderColor: renk.cizgi, borderRadius: kose.kart, padding: 22, alignItems: 'center', gap: 6 },
  harf: { width: 84, height: 84, borderRadius: 42, backgroundColor: renk.vurgu, alignItems: 'center', justifyContent: 'center', marginBottom: 6 },
});
