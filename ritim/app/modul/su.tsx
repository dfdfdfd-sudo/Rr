import { router } from 'expo-router';
import { Pressable, Text } from 'react-native';

import { Ekran } from '@/components/Ekran';
import { Kart } from '@/components/Kart';
import { renk } from '@/theme';

// Su modülü sıradaki adımda burada kurulacak (dolan şişe, içecekler, hatırlatıcı, şişe çevirme).
export default function Su() {
  return (
    <Ekran ust="Modül" baslik="Su">
      <Kart baslik="Hazırlanıyor" alt="Prototipteki su modülü buraya taşınacak" vurgu={renk.su} />
      <Pressable onPress={() => router.back()} accessibilityRole="button" style={{ padding: 12 }}>
        <Text style={{ color: renk.soluk, fontWeight: '700' }}>← Geri</Text>
      </Pressable>
    </Ekran>
  );
}
